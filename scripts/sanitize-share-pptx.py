#!/usr/bin/env python3
"""Validate and sanitize the approved public Share PowerPoint package.

The implementation deliberately uses only Python's standard-library ZIP and XML
support. It removes notes and private document properties rather than attempting
to redact unreviewed text in place.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import posixpath
import re
import stat
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Dict, Iterable, List, Mapping, MutableMapping, Optional, Sequence, Set, Tuple
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZIP_STORED, BadZipFile, ZipFile, ZipInfo

EXPECTED_SOURCE_SHA256 = "d2a8f210a4904bfbe8d157f7a7014380164cc4dc3f8abd4341746fc9bf7ac44f"
EXPECTED_SLIDE_COUNT = 40
SLUG = "agent-native-product-ai-maker-shanghai"
VERSION = "v4"
FIXED_ZIP_TIMESTAMP = (1980, 1, 1, 0, 0, 0)
MAX_PACKAGE_ENTRIES = 2_000
MAX_ENTRY_BYTES = 300 * 1024 * 1024
MAX_TOTAL_UNCOMPRESSED_BYTES = 1_500 * 1024 * 1024
MAX_XML_BYTES = 32 * 1024 * 1024
MAX_COMPRESSION_RATIO = 250

PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
OFFICE_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PRESENTATION_NS = "http://schemas.openxmlformats.org/presentationml/2006/main"
DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
CONTENT_TYPES_NS = "http://schemas.openxmlformats.org/package/2006/content-types"
CORE_NS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
DC_NS = "http://purl.org/dc/elements/1.1/"

REL = f"{{{PACKAGE_REL_NS}}}Relationship"
SLIDE_ID = f"{{{PRESENTATION_NS}}}sldId"
RELATIONSHIP_ID = f"{{{OFFICE_REL_NS}}}id"
DRAWING_TEXT = f"{{{DRAWING_NS}}}t"
DRAWING_PARAGRAPH = f"{{{DRAWING_NS}}}p"
PRESENTATION_SHAPE = f"{{{PRESENTATION_NS}}}sp"
PRESENTATION_PLACEHOLDER = f"{{{PRESENTATION_NS}}}ph"

ALLOWED_PART_PATTERNS = tuple(
    re.compile(pattern, re.IGNORECASE)
    for pattern in (
        r"^\[Content_Types\]\.xml$",
        r"^_rels/\.rels$",
        r"^docProps/(?:core|app|custom)\.xml$",
        r"^ppt/(?:presentation|presProps|viewProps|tableStyles)\.xml$",
        r"^ppt/_rels/presentation\.xml\.rels$",
        r"^ppt/theme/theme[1-9][0-9]*\.xml$",
        r"^ppt/slideMasters/slideMaster[1-9][0-9]*\.xml$",
        r"^ppt/slideMasters/_rels/slideMaster[1-9][0-9]*\.xml\.rels$",
        r"^ppt/slideLayouts/slideLayout[1-9][0-9]*\.xml$",
        r"^ppt/slideLayouts/_rels/slideLayout[1-9][0-9]*\.xml\.rels$",
        r"^ppt/slides/slide[1-9][0-9]*\.xml$",
        r"^ppt/slides/_rels/slide[1-9][0-9]*\.xml\.rels$",
        r"^ppt/notesMasters/notesMaster[1-9][0-9]*\.xml$",
        r"^ppt/notesMasters/_rels/notesMaster[1-9][0-9]*\.xml\.rels$",
        r"^ppt/notesSlides/notesSlide[1-9][0-9]*\.xml$",
        r"^ppt/notesSlides/_rels/notesSlide[1-9][0-9]*\.xml\.rels$",
        r"^ppt/media/image[1-9][0-9]*\.(?:png|jpe?g|gif)$",
    )
)

RISKY_PATH_MARKERS = (
    "/activex/",
    "/embeddings/",
    "/externallinks/",
    "/comments/",
    "/commentauthors",
    "/threadedcomments/",
    "/people/",
    "/customxml/",
    "/xmlsignatures/",
    "/digitalsignatures/",
    "/connections",
    "/charts/",
    "/diagrams/",
    "/controls/",
)
RISKY_EXTENSIONS = (
    ".bin",
    ".exe",
    ".dll",
    ".com",
    ".js",
    ".vbs",
    ".html",
    ".svg",
    ".emf",
    ".wmf",
    ".zip",
    ".ole",
    ".cab",
)
RISKY_RELATIONSHIP_MARKERS = (
    "vbaproject",
    "activex",
    "oleobject",
    "externaldata",
    "externallink",
    "attachedtemplate",
    "comments",
    "commentauthors",
    "customxml",
    "/relationships/package",
    "control",
)
RISKY_CONTENT_TYPE_MARKERS = (
    "macroenabled",
    "vbaproject",
    "activex",
    "oleobject",
    "externaldata",
    "externallink",
    "comments",
    "commentauthors",
    "customxml",
)
RISKY_XML_LOCAL_NAMES = {
    "oleobj",
    "oleobject",
    "control",
    "externaldata",
    "custdata",
    "script",
}
FALSE_VALUES = {"0", "false", "off", "no"}

LOCAL_PATH_PATTERNS = (
    re.compile(r"(?i)file://(?:localhost)?/(?:Users|home|private|tmp)/[^\s<>\"']+"),
    re.compile(r"/(?:Users|home|private|tmp)/[^\s<>\"']+"),
    re.compile(r"(?i)\b[A-Z]:\\(?:[^\\\r\n:*?\"<>|]+\\)*[^\\\r\n:*?\"<>|]*"),
)
SENSITIVE_PATTERNS = {
    "private-key": re.compile(r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----"),
    "aws-access-key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "github-token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b"),
    "slack-token": re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b"),
    "jwt": re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
    "bearer-token": re.compile(r"(?i)\bbearer\s+[A-Za-z0-9._~+/-]{20,}"),
    "credential-assignment": re.compile(
        r"(?i)\b(?:api[_ -]?key|client[_ -]?secret|secret|password|passwd|token)\s*(?:=|:)\s*[A-Za-z0-9._~+/-]{8,}"
    ),
    "url-credential": re.compile(r"(?i)https?://[^\s/:@]+:[^\s/@]+@"),
}

CORE_PROPERTIES = b"""<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<cp:coreProperties xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"><dc:title>Constructing an Agent Native Product</dc:title><dc:creator>AI Speeds</dc:creator><cp:lastModifiedBy>AI Speeds</cp:lastModifiedBy><cp:revision>1</cp:revision></cp:coreProperties>"""
APP_PROPERTIES = b"""<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>
<Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\"><Application>AI Speeds media sanitizer</Application><AppVersion>1.0</AppVersion></Properties>"""


class SanitizationError(RuntimeError):
    """Raised when a package is unsafe or structurally ambiguous."""


@dataclass(frozen=True)
class NoteRecord:
    slide_number: int
    text: str
    local_path_count: int


@dataclass(frozen=True)
class PackageInspection:
    slide_parts: Tuple[str, ...]
    notes: Tuple[NoteRecord, ...]
    package_entry_count: int
    total_uncompressed_bytes: int
    local_path_count: int
    slides_with_notes: int
    relationship_count: int


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_xml(data: bytes, part_name: str) -> ET.Element:
    if len(data) > MAX_XML_BYTES:
        raise SanitizationError(f"XML part is too large: {part_name}")
    lowered = data[:4096].lower()
    if b"<!doctype" in lowered or b"<!entity" in lowered:
        raise SanitizationError(f"DTD or entity declarations are forbidden: {part_name}")
    try:
        return ET.fromstring(data)
    except ET.ParseError as error:
        raise SanitizationError(f"Invalid XML in {part_name}: {error}") from error


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def validate_member_name(name: str) -> None:
    if not name or "\x00" in name or "\\" in name:
        raise SanitizationError(f"Unsafe ZIP member name: {name!r}")
    if any(ord(character) < 32 for character in name):
        raise SanitizationError(f"Control character in ZIP member name: {name!r}")
    if name.startswith("/") or name.startswith("//") or re.match(r"^[A-Za-z]:", name):
        raise SanitizationError(f"Absolute ZIP member path is forbidden: {name!r}")
    if "//" in name:
        raise SanitizationError(f"Ambiguous ZIP member path is forbidden: {name!r}")
    decoded = unquote(name)
    path = PurePosixPath(decoded)
    if path.is_absolute() or any(part in {"", ".", ".."} for part in path.parts):
        raise SanitizationError(f"ZIP traversal path is forbidden: {name!r}")
    normalized = posixpath.normpath(decoded)
    if normalized == ".." or normalized.startswith("../"):
        raise SanitizationError(f"ZIP traversal path is forbidden: {name!r}")


def validate_zip_infos(infos: Sequence[ZipInfo]) -> Tuple[Tuple[str, ...], int]:
    if not infos or len(infos) > MAX_PACKAGE_ENTRIES:
        raise SanitizationError(f"Unexpected ZIP entry count: {len(infos)}")
    names: List[str] = []
    exact_names: Set[str] = set()
    folded_names: Set[str] = set()
    total_uncompressed = 0
    for info in infos:
        validate_member_name(info.filename.rstrip("/"))
        if info.is_dir():
            continue
        name = info.filename
        if name in exact_names or name.casefold() in folded_names:
            raise SanitizationError(f"Duplicate or case-colliding ZIP member: {name}")
        exact_names.add(name)
        folded_names.add(name.casefold())
        if info.flag_bits & 0x1:
            raise SanitizationError(f"Encrypted ZIP member is forbidden: {name}")
        if info.compress_type not in {ZIP_STORED, ZIP_DEFLATED}:
            raise SanitizationError(f"Unsupported ZIP compression for {name}")
        if info.file_size > MAX_ENTRY_BYTES:
            raise SanitizationError(f"ZIP member exceeds the size limit: {name}")
        if info.compress_size > 0 and info.file_size / info.compress_size > MAX_COMPRESSION_RATIO:
            raise SanitizationError(f"Suspicious ZIP compression ratio: {name}")
        unix_mode = info.external_attr >> 16
        if unix_mode and stat.S_IFMT(unix_mode) == stat.S_IFLNK:
            raise SanitizationError(f"Symbolic links are forbidden in the package: {name}")
        total_uncompressed += info.file_size
        names.append(name)
    if total_uncompressed > MAX_TOTAL_UNCOMPRESSED_BYTES:
        raise SanitizationError("The uncompressed package exceeds the safety limit")
    return tuple(names), total_uncompressed


def relation_owner_part(rels_part: str) -> str:
    if rels_part == "_rels/.rels":
        return ""
    marker = "/_rels/"
    if marker not in rels_part or not rels_part.endswith(".rels"):
        raise SanitizationError(f"Invalid relationship part path: {rels_part}")
    directory, filename = rels_part.split(marker, 1)
    return posixpath.join(directory, filename[:-5])


def relationship_part_for(owner_part: str) -> str:
    if not owner_part:
        return "_rels/.rels"
    return posixpath.join(
        posixpath.dirname(owner_part),
        "_rels",
        f"{posixpath.basename(owner_part)}.rels",
    )


def resolve_relationship_target(rels_part: str, target: str) -> str:
    if not target or "\\" in target or "\x00" in target:
        raise SanitizationError(f"Unsafe relationship target in {rels_part}")
    decoded = unquote(target)
    parsed = urlsplit(decoded)
    if parsed.scheme or parsed.netloc or parsed.query or parsed.fragment:
        raise SanitizationError(f"URL-like relationship target is forbidden in {rels_part}")
    owner = relation_owner_part(rels_part)
    if decoded.startswith("/"):
        candidate = decoded[1:]
    else:
        candidate = posixpath.join(posixpath.dirname(owner), decoded)
    normalized = posixpath.normpath(candidate)
    if normalized in {"", ".", ".."} or normalized.startswith("../"):
        raise SanitizationError(f"Relationship traversal is forbidden in {rels_part}")
    validate_member_name(normalized)
    return normalized


def parse_relationships(data: bytes, rels_part: str, names: Set[str]) -> Tuple[ET.Element, Dict[str, str], int]:
    root = parse_xml(data, rels_part)
    if root.tag != f"{{{PACKAGE_REL_NS}}}Relationships":
        raise SanitizationError(f"Unexpected relationship root element: {rels_part}")
    targets: Dict[str, str] = {}
    relationship_count = 0
    for relationship in root.findall(REL):
        relationship_count += 1
        relationship_id = relationship.get("Id", "")
        relationship_type = relationship.get("Type", "")
        target = relationship.get("Target", "")
        target_mode = relationship.get("TargetMode", "")
        if not relationship_id or relationship_id in targets:
            raise SanitizationError(f"Duplicate or missing relationship Id in {rels_part}")
        if target_mode or target_mode.lower() == "external":
            raise SanitizationError(f"External relationship is forbidden: {rels_part}#{relationship_id}")
        lowered_type = relationship_type.lower()
        if any(marker in lowered_type for marker in RISKY_RELATIONSHIP_MARKERS):
            if lowered_type.endswith("/custom-properties"):
                pass
            else:
                raise SanitizationError(f"Risky relationship type is forbidden: {rels_part}#{relationship_id}")
        resolved = resolve_relationship_target(rels_part, target)
        if resolved not in names:
            raise SanitizationError(f"Relationship target is missing: {rels_part}#{relationship_id}")
        targets[relationship_id] = resolved
    return root, targets, relationship_count


def count_local_paths(text: str) -> int:
    spans: Set[Tuple[int, int]] = set()
    for pattern in LOCAL_PATH_PATTERNS:
        spans.update(match.span() for match in pattern.finditer(text))
    return len(spans)


def find_sensitive_categories(text: str) -> Tuple[str, ...]:
    return tuple(name for name, pattern in SENSITIVE_PATTERNS.items() if pattern.search(text))


def extract_note_text(root: ET.Element) -> str:
    paragraphs: List[str] = []
    for shape in root.iter(PRESENTATION_SHAPE):
        placeholder = shape.find(
            f"./{{{PRESENTATION_NS}}}nvSpPr/{{{PRESENTATION_NS}}}nvPr/{PRESENTATION_PLACEHOLDER}"
        )
        if placeholder is not None and placeholder.get("type", "body") != "body":
            continue
        for paragraph in shape.iter(DRAWING_PARAGRAPH):
            text = "".join(element.text or "" for element in paragraph.iter(DRAWING_TEXT)).strip()
            if text:
                paragraphs.append(text)
    return "\n".join(paragraphs).strip()


def validate_content_types(data: bytes, names: Set[str], allow_notes: bool, allow_custom: bool) -> None:
    root = parse_xml(data, "[Content_Types].xml")
    if root.tag != f"{{{CONTENT_TYPES_NS}}}Types":
        raise SanitizationError("Invalid [Content_Types].xml root")
    presentation_type_found = False
    for element in root:
        content_type = element.get("ContentType", "")
        lowered = content_type.lower()
        if any(marker in lowered for marker in RISKY_CONTENT_TYPE_MARKERS):
            if allow_custom and lowered.endswith("custom-properties+xml"):
                pass
            else:
                raise SanitizationError(f"Risky package content type is forbidden: {content_type}")
        part_name = element.get("PartName")
        if part_name:
            normalized = part_name.lstrip("/")
            if normalized not in names:
                raise SanitizationError(f"Content type references a missing part: {part_name}")
            if not allow_notes and "/notes" in normalized.lower():
                raise SanitizationError("Sanitized package still declares speaker-note parts")
            if not allow_custom and normalized.lower() == "docprops/custom.xml":
                raise SanitizationError("Sanitized package still declares custom properties")
        if content_type == "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":
            presentation_type_found = True
    if not presentation_type_found:
        raise SanitizationError("The package is not a standard non-macro PPTX presentation")


def validate_part_allowlist(names: Iterable[str], allow_notes: bool, allow_custom: bool) -> None:
    for name in names:
        lowered = f"/{name.lower()}"
        if any(marker in lowered for marker in RISKY_PATH_MARKERS):
            raise SanitizationError(f"Risky package content is forbidden: {name}")
        if lowered.endswith(RISKY_EXTENSIONS):
            raise SanitizationError(f"Risky binary or active content is forbidden: {name}")
        if not allow_notes and lowered.startswith("/ppt/notes"):
            raise SanitizationError(f"Speaker-note package part remains after sanitization: {name}")
        if not allow_custom and lowered == "/docprops/custom.xml":
            raise SanitizationError("Custom properties remain after sanitization")
        if not any(pattern.fullmatch(name) for pattern in ALLOWED_PART_PATTERNS):
            raise SanitizationError(f"Unexpected package part requires manual review: {name}")


def validate_xml_elements(name: str, data: bytes) -> None:
    if not name.lower().endswith((".xml", ".rels")):
        return
    root = parse_xml(data, name)
    for element in root.iter():
        if local_name(element.tag) in RISKY_XML_LOCAL_NAMES:
            raise SanitizationError(f"Risky XML element in {name}: {local_name(element.tag)}")


def slide_order(
    members: Mapping[str, bytes],
    names: Set[str],
    expected_slides: int,
) -> Tuple[Tuple[str, ...], Dict[str, Dict[str, str]], int]:
    presentation_name = "ppt/presentation.xml"
    presentation_rels_name = "ppt/_rels/presentation.xml.rels"
    if presentation_name not in members or presentation_rels_name not in members:
        raise SanitizationError("Presentation XML or its relationships are missing")
    _, presentation_relationships, relationship_count = parse_relationships(
        members[presentation_rels_name], presentation_rels_name, names
    )
    presentation = parse_xml(members[presentation_name], presentation_name)
    slide_ids = presentation.findall(f".//{SLIDE_ID}")
    ordered_parts: List[str] = []
    for slide_id in slide_ids:
        if slide_id.get("show", "true").lower() in FALSE_VALUES:
            raise SanitizationError("Hidden slides are forbidden")
        relationship_id = slide_id.get(RELATIONSHIP_ID, "")
        target = presentation_relationships.get(relationship_id)
        if not target or not re.fullmatch(r"ppt/slides/slide[1-9][0-9]*\.xml", target):
            raise SanitizationError(f"Invalid slide relationship: {relationship_id or '<missing>'}")
        ordered_parts.append(target)
    physical_parts = sorted(name for name in names if re.fullmatch(r"ppt/slides/slide[1-9][0-9]*\.xml", name))
    if len(ordered_parts) != expected_slides or len(physical_parts) != expected_slides:
        raise SanitizationError(
            f"Expected {expected_slides} physical slides, found {len(physical_parts)} parts and {len(ordered_parts)} ordered slides"
        )
    if len(set(ordered_parts)) != expected_slides or set(ordered_parts) != set(physical_parts):
        raise SanitizationError("Presentation order has duplicate, missing, or orphan slide parts")
    all_relationships: Dict[str, Dict[str, str]] = {presentation_rels_name: presentation_relationships}
    for slide_part in ordered_parts:
        slide_root = parse_xml(members[slide_part], slide_part)
        if slide_root.get("show", "true").lower() in FALSE_VALUES:
            raise SanitizationError(f"Hidden slide is forbidden: {slide_part}")
        rels_name = relationship_part_for(slide_part)
        if rels_name in members:
            _, relationships, count = parse_relationships(members[rels_name], rels_name, names)
            relationship_count += count
            all_relationships[rels_name] = relationships
    return tuple(ordered_parts), all_relationships, relationship_count


def inspect_package(path: Path, expected_slides: int, sanitized: bool) -> PackageInspection:
    try:
        with ZipFile(path, "r") as archive:
            infos = archive.infolist()
            member_names, total_uncompressed = validate_zip_infos(infos)
            names = set(member_names)
            required = {"[Content_Types].xml", "_rels/.rels", "ppt/presentation.xml", "docProps/core.xml", "docProps/app.xml"}
            missing = sorted(required - names)
            if missing:
                raise SanitizationError(f"Required PPTX parts are missing: {', '.join(missing)}")
            validate_part_allowlist(names, allow_notes=not sanitized, allow_custom=not sanitized)
            members = {name: archive.read(name) for name in member_names}
    except BadZipFile as error:
        raise SanitizationError(f"Invalid PPTX ZIP package: {error}") from error

    validate_content_types(members["[Content_Types].xml"], names, allow_notes=not sanitized, allow_custom=not sanitized)
    relationship_count = 0
    for name, data in members.items():
        validate_xml_elements(name, data)
        if name.endswith(".rels"):
            _, _, count = parse_relationships(data, name, names)
            relationship_count += count

    ordered_slides, slide_relationships, _ = slide_order(members, names, expected_slides)
    notes: List[NoteRecord] = []
    sensitive_findings: List[Tuple[int, Tuple[str, ...]]] = []
    for slide_number, slide_part in enumerate(ordered_slides, start=1):
        note_text = ""
        rels_name = relationship_part_for(slide_part)
        relationships = slide_relationships.get(rels_name, {})
        note_targets = [
            target
            for relationship_id, target in relationships.items()
            if relationship_type_for_id(members[rels_name], rels_name, relationship_id).endswith("/notesSlide")
        ] if rels_name in members else []
        if len(note_targets) > 1:
            raise SanitizationError(f"Slide {slide_number} has multiple notes relationships")
        if note_targets:
            note_part = note_targets[0]
            if note_part is None:
                raise SanitizationError(f"Slide {slide_number} has an unresolved notes relationship")
            note_text = extract_note_text(parse_xml(members[note_part], note_part))
        local_paths = count_local_paths(note_text)
        categories = find_sensitive_categories(note_text)
        if categories:
            sensitive_findings.append((slide_number, categories))
        notes.append(NoteRecord(slide_number=slide_number, text=note_text, local_path_count=local_paths))

    if sensitive_findings:
        summary = "; ".join(
            f"slide {slide_number}: {', '.join(categories)}" for slide_number, categories in sensitive_findings
        )
        raise SanitizationError(
            "Potential credentials or secrets require manual review before sanitization; matched categories only: " + summary
        )

    if sanitized:
        validate_sanitized_properties(members)
        for info in infos:
            if not info.is_dir() and info.date_time != FIXED_ZIP_TIMESTAMP:
                raise SanitizationError(f"ZIP timestamp is not normalized: {info.filename}")
        if any(record.text for record in notes):
            raise SanitizationError("Sanitized package still contains speaker-note text")

    return PackageInspection(
        slide_parts=ordered_slides,
        notes=tuple(notes),
        package_entry_count=len(member_names),
        total_uncompressed_bytes=total_uncompressed,
        local_path_count=sum(record.local_path_count for record in notes),
        slides_with_notes=sum(1 for record in notes if record.text),
        relationship_count=relationship_count,
    )


def relationship_type_for_id(data: bytes, rels_part: str, relationship_id: str) -> str:
    root = parse_xml(data, rels_part)
    for relationship in root.findall(REL):
        if relationship.get("Id") == relationship_id:
            return relationship.get("Type", "")
    raise SanitizationError(f"Relationship Id disappeared while reading {rels_part}: {relationship_id}")


def validate_sanitized_properties(members: Mapping[str, bytes]) -> None:
    if "docProps/custom.xml" in members:
        raise SanitizationError("Sanitized package retains custom document properties")
    core = parse_xml(members["docProps/core.xml"], "docProps/core.xml")
    creators = [element.text or "" for element in core.findall(f"{{{DC_NS}}}creator")]
    modifiers = [element.text or "" for element in core.findall(f"{{{CORE_NS}}}lastModifiedBy")]
    if creators != ["AI Speeds"] or modifiers != ["AI Speeds"]:
        raise SanitizationError("Sanitized creator properties are not normalized")
    app = parse_xml(members["docProps/app.xml"], "docProps/app.xml")
    for element in app.iter():
        if local_name(element.tag) in {"company", "manager", "hyperlinkbase"} and (element.text or "").strip():
            raise SanitizationError(f"Private extended property remains: {local_name(element.tag)}")


def serialize_xml(root: ET.Element, default_namespace: Optional[str] = None) -> bytes:
    if default_namespace:
        ET.register_namespace("", default_namespace)
    else:
        ET.register_namespace("p", PRESENTATION_NS)
        ET.register_namespace("a", DRAWING_NS)
        ET.register_namespace("r", OFFICE_REL_NS)
    return ET.tostring(root, encoding="utf-8", xml_declaration=True, short_empty_elements=True)


def remove_relationships(data: bytes, rels_part: str, type_suffixes: Set[str]) -> Tuple[bytes, int]:
    root = parse_xml(data, rels_part)
    removed = 0
    for relationship in list(root.findall(REL)):
        relationship_type = relationship.get("Type", "")
        if any(relationship_type.endswith(suffix) for suffix in type_suffixes):
            root.remove(relationship)
            removed += 1
    return serialize_xml(root, PACKAGE_REL_NS), removed


def transform_members(source_path: Path) -> Tuple[MutableMapping[str, bytes], Dict[str, int]]:
    with ZipFile(source_path, "r") as archive:
        member_names, _ = validate_zip_infos(archive.infolist())
        members: MutableMapping[str, bytes] = {name: archive.read(name) for name in member_names}

    removed_counts = {
        "notesParts": 0,
        "notesRelationships": 0,
        "notesMasterReferences": 0,
        "customPropertyParts": 0,
        "customPropertyRelationships": 0,
        "orphanParts": 0,
    }

    for name in list(members):
        lowered = name.lower()
        if lowered.startswith("ppt/notesslides/") or lowered.startswith("ppt/notesmasters/"):
            del members[name]
            removed_counts["notesParts"] += 1
        elif lowered == "docprops/custom.xml":
            del members[name]
            removed_counts["customPropertyParts"] += 1

    presentation = parse_xml(members["ppt/presentation.xml"], "ppt/presentation.xml")
    for element in list(presentation):
        if local_name(element.tag) == "notesmasteridlst":
            presentation.remove(element)
            removed_counts["notesMasterReferences"] += 1
    members["ppt/presentation.xml"] = serialize_xml(presentation)

    root_rels, removed = remove_relationships(
        members["_rels/.rels"], "_rels/.rels", {"/custom-properties"}
    )
    members["_rels/.rels"] = root_rels
    removed_counts["customPropertyRelationships"] += removed

    presentation_rels, removed = remove_relationships(
        members["ppt/_rels/presentation.xml.rels"],
        "ppt/_rels/presentation.xml.rels",
        {"/notesMaster"},
    )
    members["ppt/_rels/presentation.xml.rels"] = presentation_rels
    removed_counts["notesRelationships"] += removed

    for name in list(members):
        if re.fullmatch(r"ppt/slides/_rels/slide[1-9][0-9]*\.xml\.rels", name):
            data, removed = remove_relationships(members[name], name, {"/notesSlide"})
            members[name] = data
            removed_counts["notesRelationships"] += removed

    content_types = parse_xml(members["[Content_Types].xml"], "[Content_Types].xml")
    for element in list(content_types):
        part_name = element.get("PartName", "").lstrip("/").lower()
        if part_name.startswith("ppt/notesslides/") or part_name.startswith("ppt/notesmasters/") or part_name == "docprops/custom.xml":
            content_types.remove(element)
    members["[Content_Types].xml"] = serialize_xml(content_types, CONTENT_TYPES_NS)
    members["docProps/core.xml"] = CORE_PROPERTIES
    members["docProps/app.xml"] = APP_PROPERTIES

    reachable = reachable_parts(members)
    for name in list(members):
        if name not in reachable:
            del members[name]
            removed_counts["orphanParts"] += 1

    content_types = parse_xml(members["[Content_Types].xml"], "[Content_Types].xml")
    for element in list(content_types):
        part_name = element.get("PartName")
        if part_name and part_name.lstrip("/") not in members:
            content_types.remove(element)
    members["[Content_Types].xml"] = serialize_xml(content_types, CONTENT_TYPES_NS)
    return members, removed_counts


def reachable_parts(members: Mapping[str, bytes]) -> Set[str]:
    names = set(members)
    reachable: Set[str] = {"[Content_Types].xml", "_rels/.rels"}
    queue: List[str] = [""]
    visited_owners: Set[str] = set()
    while queue:
        owner = queue.pop()
        if owner in visited_owners:
            continue
        visited_owners.add(owner)
        rels_part = relationship_part_for(owner)
        if rels_part not in members:
            continue
        reachable.add(rels_part)
        _, targets, _ = parse_relationships(members[rels_part], rels_part, names)
        for target in targets.values():
            if target not in reachable:
                reachable.add(target)
                queue.append(target)
    return reachable


def write_deterministic_pptx(path: Path, members: Mapping[str, bytes]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    file_descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    os.close(file_descriptor)
    temporary_path = Path(temporary_name)
    try:
        with ZipFile(temporary_path, "w", compression=ZIP_DEFLATED, compresslevel=9, allowZip64=True) as archive:
            for name in sorted(members):
                info = ZipInfo(name, date_time=FIXED_ZIP_TIMESTAMP)
                info.compress_type = ZIP_DEFLATED
                info.create_system = 3
                info.external_attr = (stat.S_IFREG | 0o600) << 16
                archive.writestr(info, members[name])
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)


def write_json_atomic(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    file_descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    os.close(file_descriptor)
    temporary_path = Path(temporary_name)
    try:
        temporary_path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)


def assert_distinct_paths(source_path: Path, output_path: Path, report_path: Path) -> None:
    labeled_paths = (("source", source_path), ("output", output_path), ("report", report_path))
    for index, (left_label, left_path) in enumerate(labeled_paths):
        for right_label, right_path in labeled_paths[index + 1 :]:
            if left_path == right_path:
                raise SanitizationError(f"{left_label} and {right_label} paths must be distinct")
            if left_path.exists() and right_path.exists():
                try:
                    if os.path.samefile(left_path, right_path):
                        raise SanitizationError(f"{left_label} and {right_label} paths must not reference the same file")
                except FileNotFoundError:
                    pass


def sanitize(
    source_path: Path,
    output_path: Path,
    report_path: Path,
    expected_sha256: str,
    expected_slides: int,
    force: bool,
) -> Dict[str, object]:
    assert_distinct_paths(source_path, output_path, report_path)
    if not source_path.is_file():
        raise SanitizationError(f"Source PPTX does not exist: {source_path.name}")
    if output_path.exists() and not force:
        raise SanitizationError(f"Refusing to overwrite existing sanitized PPTX: {output_path.name}; pass --force")
    if report_path.exists() and not force:
        raise SanitizationError(f"Refusing to overwrite existing private review report: {report_path.name}; pass --force")

    source_sha256 = sha256_file(source_path)
    if source_sha256 != expected_sha256.lower():
        raise SanitizationError(
            f"Source SHA-256 mismatch: expected {expected_sha256.lower()}, received {source_sha256}"
        )

    source_inspection = inspect_package(source_path, expected_slides=expected_slides, sanitized=False)
    members, removed_counts = transform_members(source_path)
    write_deterministic_pptx(output_path, members)
    try:
        sanitized_inspection = inspect_package(output_path, expected_slides=expected_slides, sanitized=True)
    except Exception:
        output_path.unlink(missing_ok=True)
        raise
    sanitized_sha256 = sha256_file(output_path)

    report: Dict[str, object] = {
        "schemaVersion": 1,
        "private": True,
        "notForPublication": True,
        "sourceFileName": source_path.name,
        "sourceSha256": source_sha256,
        "sanitizedFileName": output_path.name,
        "sanitizedSha256": sanitized_sha256,
        "slideCount": len(source_inspection.slide_parts),
        "sourcePackageEntryCount": source_inspection.package_entry_count,
        "sanitizedPackageEntryCount": sanitized_inspection.package_entry_count,
        "sourceRelationshipCount": source_inspection.relationship_count,
        "sanitizedRelationshipCount": sanitized_inspection.relationship_count,
        "slidesWithOriginalNotes": source_inspection.slides_with_notes,
        "originalLocalPathCount": source_inspection.local_path_count,
        "removed": removed_counts,
        "checks": {
            "sourceHashMatched": True,
            "physicalSlideCountMatched": True,
            "zipTraversalRejected": True,
            "macrosRejected": True,
            "externalRelationshipsRejected": True,
            "commentsRejected": True,
            "hiddenSlidesRejected": True,
            "activeContentRejected": True,
            "speakerNotesRemoved": sanitized_inspection.slides_with_notes == 0,
            "customPropertiesRemoved": True,
            "zipTimestampsNormalized": True,
            "sanitizedPackageValidated": True,
        },
        "originalNotes": [
            {
                "slideNumber": note.slide_number,
                "text": note.text,
                "localPathCount": note.local_path_count,
            }
            for note in source_inspection.notes
        ],
    }
    write_json_atomic(report_path, report)
    return {
        "sourceSha256": source_sha256,
        "sanitizedSha256": sanitized_sha256,
        "slideCount": len(source_inspection.slide_parts),
        "slidesWithOriginalNotes": source_inspection.slides_with_notes,
        "originalLocalPathCount": source_inspection.local_path_count,
        "removed": removed_counts,
        "validated": True,
    }


def validate_only(path: Path, expected_sha256: Optional[str], expected_slides: int) -> Dict[str, object]:
    if not path.is_file():
        raise SanitizationError(f"Sanitized PPTX does not exist: {path.name}")
    actual_sha256 = sha256_file(path)
    if expected_sha256 and actual_sha256 != expected_sha256.lower():
        raise SanitizationError(
            f"Sanitized SHA-256 mismatch: expected {expected_sha256.lower()}, received {actual_sha256}"
        )
    inspection = inspect_package(path, expected_slides=expected_slides, sanitized=True)
    return {
        "sha256": actual_sha256,
        "slideCount": len(inspection.slide_parts),
        "packageEntryCount": inspection.package_entry_count,
        "validated": True,
    }


def build_parser(repo_root: Path) -> argparse.ArgumentParser:
    default_source = repo_root.parent / "quartz" / "content" / "slide-deck" / "agent-native-ai-maker-shanghai" / "构建 Agent Native Product-AI Maker 上海-晓灰-v4.pptx"
    default_output = repo_root / "dist" / "shares" / SLUG / VERSION / "source.pptx"
    default_report = repo_root / "dist" / "shares" / ".work" / f"{SLUG}-{VERSION}-sanitizer-review.json"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=default_source, help="source or sanitized PPTX path")
    parser.add_argument("--output", type=Path, default=default_output, help="sanitized PPTX output path")
    parser.add_argument("--report", type=Path, default=default_report, help="private review report path")
    parser.add_argument("--expected-sha256", default=EXPECTED_SOURCE_SHA256, help="required input SHA-256")
    parser.add_argument("--expected-slides", type=int, default=EXPECTED_SLIDE_COUNT, help="required physical slide count")
    parser.add_argument("--force", action="store_true", help="replace existing generated output and report")
    parser.add_argument("--validate-only", action="store_true", help="validate an already sanitized package without writing")
    parser.add_argument(
        "--no-expected-sha256",
        action="store_true",
        help="validate-only: skip the input hash comparison (structure is still validated)",
    )
    return parser


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    parser = build_parser(repo_root)
    arguments = parser.parse_args()
    if arguments.expected_slides < 1:
        parser.error("--expected-slides must be positive")
    try:
        if arguments.validate_only:
            expected = None if arguments.no_expected_sha256 else arguments.expected_sha256
            result = validate_only(arguments.input.resolve(), expected, arguments.expected_slides)
        else:
            if arguments.no_expected_sha256:
                parser.error("--no-expected-sha256 is only valid with --validate-only")
            result = sanitize(
                source_path=arguments.input.resolve(),
                output_path=arguments.output.resolve(),
                report_path=arguments.report.resolve(),
                expected_sha256=arguments.expected_sha256,
                expected_slides=arguments.expected_slides,
                force=arguments.force,
            )
    except (OSError, SanitizationError) as error:
        print(f"sanitize-share-pptx: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
