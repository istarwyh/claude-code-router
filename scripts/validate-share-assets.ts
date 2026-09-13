#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { error, log } from 'node:console';
import { execFile as execFileCallback } from 'node:child_process';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFile = promisify(execFileCallback);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSlug = 'agent-native-product-ai-maker-shanghai';
const defaultVersion = 'v4';
const expectedSourceSha256 = 'd2a8f210a4904bfbe8d157f7a7014380164cc4dc3f8abd4341746fc9bf7ac44f';
const expectedSlideCount = 40;
const expectedPayloadCount = 84;
const expectedObjectCount = 85;
const expectedPublicOrigin = 'https://assets.aispeeds.me';
const immutableCacheControl = 'public, max-age=31536000, immutable';
const sha256Pattern = /^[a-f0-9]{64}$/;
const simpleSlugPattern = /^[a-z0-9-]+$/;
const simpleVersionPattern = /^v[a-z0-9-]+$/;
const safeObjectKeyPattern = /^[a-z0-9][a-z0-9._/-]*$/;
const publicBodyVerificationKeys = new Set([
  'cover.webp',
  'slides/001.webp',
  'slides/003.webp',
  'slides/033.webp',
  'slides/034.webp',
  'slides/035.webp',
  'slides/040.webp',
  'deck.pdf',
  'source.pptx',
  'transcript.md',
]);
const localPathPattern =
  /(?:file:\/\/(?:localhost)?\/(?:Users|home|private|tmp)\/|\/(?:Users|home|private|tmp)\/|\b[A-Z]:\\)/i;
const sensitivePatterns = [
  /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  /\bbearer\s+[A-Za-z0-9._~+/-]{20,}/i,
  /\b(?:api[_ -]?key|client[_ -]?secret|secret|password|passwd|token)\s*(?:=|:)\s*[A-Za-z0-9._~+/-]{8,}/i,
  /https?:\/\/[^\s/:@]+:[^\s/@]+@/i,
];

type UnknownRecord = Record<string, unknown>;
type ValidationMode = 'local' | 'registry' | 'remote';

type CliOptions = {
  mode: ValidationMode;
  slug: string;
  version: string;
  stagingDirectory: string;
  registryPath: string;
  publicBaseUrl?: string;
  concurrency: number;
  requestTimeoutMs: number;
};

type PayloadEntry = {
  key: string;
  size: number;
  sha256: string;
  mimeType: string;
  cacheControl: string;
  contentDisposition: string;
  slideNumber?: number;
  width?: number;
  height?: number;
};

type ShareDeck = {
  version: string;
  baseUrl: string;
  slideCount: number;
  width: number;
  height: number;
};

type RegistryShare = {
  value: UnknownRecord;
  slug: string;
  status: string;
  deck?: ShareDeck;
};

type Manifest = {
  raw: UnknownRecord;
  schemaVersion: number;
  slug: string;
  version: string;
  objectPrefix: string;
  publicBaseUrl: string;
  generatedAt: string;
  sealed: boolean;
  sourceSha256: string;
  sanitizedSha256: string;
  slideCount: number;
  payloadCount: number;
  totalObjectCount: number;
  totalPayloadBytes: number;
  payloads: PayloadEntry[];
};

type WebpInspection = {
  width: number;
  height: number;
  metadataChunks: string[];
};

function usage(): string {
  return [
    'Usage: node scripts/validate-share-assets.ts [options]',
    '',
    'Modes:',
    '  --mode local      validate registry plus local dist staging (default)',
    '  --mode registry   validate the public Share registry only',
    '  --mode remote     validate public registry entries and public assets',
    '',
    'Options:',
    '  --slug <slug>                 target Share (local; optional remote filter)',
    '  --version <version>           target version (local)',
    '  --staging <directory>         local staging directory',
    '  --registry <file>             TypeScript Share registry module',
    '  --public-base-url <https-url> override public base URL for one remote Share',
    '  --concurrency <1-16>          remote request concurrency (default: 8)',
    '  --timeout-ms <1000-60000>     per-request timeout (default: 15000)',
    '  --local | --registry-only | --remote  mode aliases',
    '  --help',
  ].join('\n');
}

function parseArguments(arguments_: string[]): CliOptions {
  const options: CliOptions = {
    mode: 'local',
    slug: defaultSlug,
    version: defaultVersion,
    stagingDirectory: resolve(repoRoot, 'dist', 'shares', defaultSlug, defaultVersion),
    registryPath: resolve(repoRoot, 'src', 'content', 'shares', 'index.ts'),
    concurrency: 8,
    requestTimeoutMs: 15_000,
  };
  let customStaging = false;
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_.at(index);
    if (argument === '--') {
      continue;
    }
    if (argument === '--help') {
      log(usage());
      process.exit(0);
    }
    if (argument === '--local') {
      options.mode = 'local';
      continue;
    }
    if (argument === '--registry-only') {
      options.mode = 'registry';
      continue;
    }
    if (argument === '--remote') {
      options.mode = 'remote';
      continue;
    }
    if (
      argument === '--mode' ||
      argument === '--slug' ||
      argument === '--version' ||
      argument === '--staging' ||
      argument === '--registry' ||
      argument === '--public-base-url' ||
      argument === '--concurrency' ||
      argument === '--timeout-ms'
    ) {
      const value = arguments_.at(index + 1);
      if (!value) {
        throw new Error(`Missing value for ${argument}`);
      }
      index += 1;
      if (argument === '--mode') {
        if (!['local', 'registry', 'remote'].includes(value)) {
          throw new Error('--mode must be local, registry, or remote');
        }
        options.mode = value as ValidationMode;
      } else if (argument === '--slug') {
        options.slug = value;
      } else if (argument === '--version') {
        options.version = value;
      } else if (argument === '--staging') {
        options.stagingDirectory = resolve(process.cwd(), value);
        customStaging = true;
      } else if (argument === '--registry') {
        options.registryPath = resolve(process.cwd(), value);
      } else if (argument === '--public-base-url') {
        options.publicBaseUrl = value.replace(/\/+$/, '');
      } else if (argument === '--concurrency') {
        options.concurrency = Number(value);
      } else {
        options.requestTimeoutMs = Number(value);
      }
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  if (!isSafeSlug(options.slug)) {
    throw new Error(`Invalid Share slug: ${options.slug}`);
  }
  if (!isSafeVersion(options.version)) {
    throw new Error(`Invalid Share version: ${options.version}`);
  }
  if (!customStaging) {
    options.stagingDirectory = resolve(repoRoot, 'dist', 'shares', options.slug, options.version);
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 16) {
    throw new Error('--concurrency must be an integer from 1 through 16');
  }
  if (
    !Number.isInteger(options.requestTimeoutMs) ||
    options.requestTimeoutMs < 1_000 ||
    options.requestTimeoutMs > 60_000
  ) {
    throw new Error('--timeout-ms must be an integer from 1000 through 60000');
  }
  if (options.publicBaseUrl) {
    const publicUrl = parseHttpsUrl(options.publicBaseUrl, '--public-base-url');
    if (publicUrl.search || publicUrl.hash) {
      throw new Error('--public-base-url cannot include a query string or fragment');
    }
  }
  return options;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): UnknownRecord {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

function requireArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
  return value;
}

function requireString(record: UnknownRecord, key: string, label: string): string {
  const value = Reflect.get(record, key) as unknown;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label}.${key} must be a non-empty string`);
  }
  return value.trim();
}

function requireInteger(record: UnknownRecord, key: string, label: string, minimum = 0): number {
  const value = Reflect.get(record, key) as unknown;
  if (!Number.isInteger(value) || typeof value !== 'number' || value < minimum) {
    throw new Error(`${label}.${key} must be an integer of at least ${minimum}`);
  }
  return value;
}

function requireBoolean(record: UnknownRecord, key: string, label: string): boolean {
  const value = Reflect.get(record, key) as unknown;
  if (typeof value !== 'boolean') {
    throw new Error(`${label}.${key} must be a boolean`);
  }
  return value;
}

function parseHttpsUrl(value: string, label: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch (cause) {
    throw new Error(`${label} must be a valid URL`, { cause });
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${label} must be an HTTPS URL without credentials`);
  }
  return url;
}

function isSafeSlug(value: string): boolean {
  return simpleSlugPattern.test(value) && !value.startsWith('-') && !value.endsWith('-') && !value.includes('--');
}

function isSafeVersion(value: string): boolean {
  return simpleVersionPattern.test(value) && /^v[1-9]/.test(value) && !value.endsWith('-') && !value.includes('--');
}

function assertIsoUtc(value: string, label: string): void {
  const parsed = Date.parse(value);
  if (!value.includes('T') || !value.endsWith('Z') || Number.isNaN(parsed)) {
    throw new Error(`${label} must be a parseable ISO 8601 UTC datetime`);
  }
  const normalized = new Date(parsed).toISOString();
  if (value !== normalized && value !== normalized.replace('.000Z', 'Z')) {
    throw new Error(`${label} must use normalized ISO 8601 UTC formatting`);
  }
}

function assertPublicTextSafe(value: string, label: string): void {
  if (localPathPattern.test(value)) {
    throw new Error(`${label} contains a local absolute path`);
  }
  for (const pattern of sensitivePatterns) {
    if (pattern.test(value)) {
      throw new Error(`${label} contains a possible credential or secret`);
    }
  }
}

function displayPath(path: string): string {
  const projectRelative = relative(repoRoot, path);
  if (projectRelative && projectRelative !== '..' && !projectRelative.startsWith(`..${sep}`)) {
    return projectRelative.split(sep).join('/');
  }
  return basename(path);
}

async function requireFile(path: string): Promise<void> {
  try {
    await access(path);
    if (!(await stat(path)).isFile()) {
      throw new Error('not a regular file');
    }
  } catch (cause) {
    throw new Error(`Required file is unavailable: ${displayPath(path)}`, { cause });
  }
}

async function sha256File(path: string): Promise<string> {
  const digest = createHash('sha256');
  digest.update(await readFile(path));
  return digest.digest('hex');
}

function sha256Bytes(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

async function loadRegistry(path: string): Promise<UnknownRecord> {
  await requireFile(path);
  let imported: unknown;
  try {
    imported = await import(`${pathToFileURL(path).href}?validate=${Date.now()}`);
  } catch (cause) {
    throw new Error(
      `Unable to import ${displayPath(path)} with Node.js type stripping; registry imports must be relative and include file extensions`,
      { cause },
    );
  }
  return requireRecord(imported, 'Share registry module');
}

function getPublicRegistryShares(registry: UnknownRecord): unknown[] {
  const getter = registry['getPublicShares'];
  if (typeof getter !== 'function') {
    throw new Error('Share registry must export getPublicShares()');
  }
  return requireArray(getter(), 'getPublicShares() result');
}

function getRegistryShare(registry: UnknownRecord, slug: string): unknown {
  const getter = registry['getShareBySlug'];
  if (typeof getter !== 'function') {
    throw new Error('Share registry must export getShareBySlug(slug)');
  }
  return getter(slug);
}

function parseDeckArtifact(share: UnknownRecord, label: string): ShareDeck | undefined {
  let deckValue = share['deck'];
  if (deckValue === undefined && Array.isArray(share['artifacts'])) {
    const decks = share['artifacts'].filter(artifact => isRecord(artifact) && artifact['kind'] === 'deck');
    if (decks.length > 1) {
      throw new Error(`${label} must not have multiple deck artifacts`);
    }
    deckValue = decks[0];
  }
  if (!deckValue || !isRecord(deckValue)) {
    return undefined;
  }
  if (deckValue['kind'] !== undefined && deckValue['kind'] !== 'deck') {
    throw new Error(`${label} deck.kind must be deck`);
  }
  if (deckValue['imageFormat'] !== undefined && deckValue['imageFormat'] !== 'webp') {
    throw new Error(`${label} deck.imageFormat must be webp`);
  }
  const version = requireString(deckValue, 'version', `${label} deck`);
  const baseUrl = requireString(deckValue, 'baseUrl', `${label} deck`).replace(/\/+$/, '');
  const slideCount = requireInteger(deckValue, 'slideCount', `${label} deck`, 1);
  const widthValue = deckValue['width'] ?? deckValue['slideWidth'];
  const heightValue = deckValue['height'] ?? deckValue['slideHeight'];
  if (!Number.isInteger(widthValue) || typeof widthValue !== 'number' || widthValue < 1) {
    throw new Error(`${label} deck width/slideWidth must be a positive integer`);
  }
  if (!Number.isInteger(heightValue) || typeof heightValue !== 'number' || heightValue < 1) {
    throw new Error(`${label} deck height/slideHeight must be a positive integer`);
  }
  parseHttpsUrl(baseUrl, `${label} deck.baseUrl`);
  return { version, baseUrl, slideCount, width: widthValue, height: heightValue };
}

function locateTranscriptEntries(registry: UnknownRecord, share: UnknownRecord, label: string): unknown[] {
  const candidates: { label: string; value: unknown[] }[] = [];
  const getter = registry['getShareSlides'];
  if (typeof getter === 'function') {
    const result = getter(requireString(share, 'slug', label));
    if (Array.isArray(result)) {
      candidates.push({ label: 'getShareSlides()', value: result });
    }
  }
  if (Array.isArray(share['slides'])) {
    candidates.push({ label: 'share.slides', value: share['slides'] });
  }
  const transcript = share['transcript'];
  if (Array.isArray(transcript)) {
    candidates.push({ label: 'share.transcript', value: transcript });
  } else if (isRecord(transcript) && Array.isArray(transcript['slides'])) {
    candidates.push({ label: 'share.transcript.slides', value: transcript['slides'] });
  }
  const deck = share['deck'];
  if (isRecord(deck) && Array.isArray(deck['slides'])) {
    candidates.push({ label: 'share.deck.slides', value: deck['slides'] });
  }
  const artifacts = Array.isArray(share['artifacts']) ? share['artifacts'] : [];
  for (const artifact of artifacts) {
    if (isRecord(artifact) && artifact['kind'] === 'deck' && Array.isArray(artifact['slides'])) {
      candidates.push({ label: 'deck artifact slides', value: artifact['slides'] });
    }
  }
  const first = candidates.at(0);
  if (!first) {
    throw new Error(`${label} must expose its reviewed slide transcript from the TypeScript registry`);
  }
  for (const candidate of candidates.slice(1)) {
    if (candidate.value !== first.value) {
      throw new Error(`Ambiguous transcript sources: ${first.label} and ${candidate.label}`);
    }
  }
  return first.value;
}

function requireSingleTextField(record: UnknownRecord, keys: string[], label: string): string {
  const values = keys
    .map(key => Reflect.get(record, key) as unknown)
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .map(value => value.trim());
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length !== 1) {
    throw new Error(`${label} must provide exactly one unambiguous ${keys.join('/')} text value`);
  }
  const value = uniqueValues.at(0);
  if (!value) {
    throw new Error(`${label} text is empty`);
  }
  return value;
}

function readOptionalSingleTextField(record: UnknownRecord, keys: string[]): string {
  const values = keys
    .map(key => Reflect.get(record, key) as unknown)
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.trim());
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length > 1) {
    throw new Error(`Transcript provides ambiguous ${keys.join('/')} text values`);
  }
  return uniqueValues.at(0) ?? '';
}

function readTranscriptSlides(
  registry: UnknownRecord,
  share: UnknownRecord,
  label: string,
  expectedSlides: number,
): { number: number; title: string; alt: string; transcript: string }[] {
  const slides = locateTranscriptEntries(registry, share, label);
  if (slides.length !== expectedSlides) {
    throw new Error(`${label} transcript must contain exactly ${expectedSlides} entries`);
  }
  return slides.map((value, index) => {
    const slideLabel = `${label} transcript slide ${index + 1}`;
    const slide = requireRecord(value, slideLabel);
    const number = slide['number'] ?? slide['slideNumber'] ?? index + 1;
    if (number !== index + 1) {
      throw new Error(`${label} transcript is not in physical slide order at slide ${index + 1}`);
    }
    const title = requireSingleTextField(slide, ['title', 'heading'], `${slideLabel} title`);
    const alt = requireSingleTextField(slide, ['alt', 'altText', 'description'], `${slideLabel} alt text`);
    const transcriptText = readOptionalSingleTextField(slide, ['transcript', 'notes', 'speakerNotes', 'body']);
    assertPublicTextSafe(`${title}\n${alt}\n${transcriptText}`, slideLabel);
    return { number: index + 1, title, alt, transcript: transcriptText };
  });
}

function validateTranscriptRegistry(
  registry: UnknownRecord,
  share: UnknownRecord,
  label: string,
  expectedSlides: number,
): void {
  readTranscriptSlides(registry, share, label, expectedSlides);
}

function renderRegistryTranscript(registry: UnknownRecord, share: UnknownRecord, expectedSlides: number): string {
  const slides = readTranscriptSlides(registry, share, 'Share', expectedSlides);
  const title = requireString(share, 'title', 'Share');
  const summary = requireString(share, 'summary', 'Share');
  assertPublicTextSafe(`${title}\n${summary}`, 'Share title and summary');
  const sections = slides.map(slide => {
    const heading = slide.title.replace(/[\r\n]+/g, ' ').trim();
    return [
      `## Slide ${String(slide.number).padStart(3, '0')}: ${heading}`,
      '',
      `**Image description:** ${slide.alt}`,
      '',
      slide.transcript || '_No speaker notes were provided for this slide._',
    ].join('\n');
  });
  const transcript = [
    `# ${title} — Transcript`,
    '',
    summary,
    '',
    'This transcript is maintained in the reviewed TypeScript Share registry and follows the physical slide order.',
    '',
    ...sections.flatMap(section => [section, '']),
  ].join('\n');
  assertPublicTextSafe(transcript, 'Generated registry transcript');
  return `${transcript.trim()}\n`;
}

function validateRegistryAssets(share: UnknownRecord, slug: string, deck: ShareDeck, cover: string): void {
  const expectedCover = `${deck.baseUrl}/cover.webp`;
  if (cover !== expectedCover) {
    throw new Error(`Share ${slug} cover path must be ${expectedCover}`);
  }
  const paths = isRecord(share['deck']) && isRecord(share['deck']['paths']) ? share['deck']['paths'] : undefined;
  if (paths) {
    const expectedPaths: Record<string, string> = {
      cover: 'cover.webp',
      slides: 'slides',
      thumbnails: 'thumbnails',
      manifest: 'manifest.json',
      pdf: 'deck.pdf',
      pptx: 'source.pptx',
      transcript: 'transcript.md',
    };
    for (const [key, expected] of Object.entries(expectedPaths)) {
      if (Reflect.get(paths, key) !== expected) {
        throw new Error(`Share ${slug} deck.paths.${key} must be ${expected}`);
      }
    }
  }
  if (Array.isArray(share['resources'])) {
    const expectedResources: Record<string, { url: string; mediaType: string }> = {
      pdf: { url: `${deck.baseUrl}/deck.pdf`, mediaType: 'application/pdf' },
      pptx: {
        url: `${deck.baseUrl}/source.pptx`,
        mediaType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      },
      transcript: { url: `${deck.baseUrl}/transcript.md`, mediaType: 'text/markdown; charset=utf-8' },
    };
    const seen = new Set<string>();
    for (const resourceValue of share['resources']) {
      const resource = requireRecord(resourceValue, `Share ${slug} resource`);
      const kind = requireString(resource, 'kind', `Share ${slug} resource`);
      const expected = Reflect.get(expectedResources, kind) as { url: string; mediaType: string } | undefined;
      if (!expected || seen.has(kind)) {
        throw new Error(`Share ${slug} has an unexpected or duplicate resource kind: ${kind}`);
      }
      seen.add(kind);
      if (
        requireString(resource, 'url', `Share ${slug} ${kind} resource`) !== expected.url ||
        requireString(resource, 'mediaType', `Share ${slug} ${kind} resource`) !== expected.mediaType
      ) {
        throw new Error(`Share ${slug} ${kind} resource does not match the immutable deck path`);
      }
      const fileName = requireString(resource, 'fileName', `Share ${slug} ${kind} resource`);
      if (fileName.includes('/') || fileName.includes('\\')) {
        throw new Error(`Share ${slug} ${kind} resource fileName must be a basename`);
      }
    }
    if (seen.size !== Object.keys(expectedResources).length) {
      throw new Error(`Share ${slug} must provide PDF, PPTX, and transcript resources`);
    }
  }
}

function validateShare(registry: UnknownRecord, value: unknown, expectedPublic: boolean): RegistryShare {
  const share = requireRecord(value, 'Share');
  const slug = requireString(share, 'slug', 'Share');
  if (!isSafeSlug(slug)) {
    throw new Error(`Share slug is invalid: ${slug}`);
  }
  const status = requireString(share, 'status', `Share ${slug}`);
  if (!['draft', 'public', 'archived'].includes(status)) {
    throw new Error(`Share ${slug} has invalid status: ${status}`);
  }
  if (expectedPublic && status !== 'public') {
    throw new Error(`getPublicShares() returned non-public Share ${slug}`);
  }
  const title = requireString(share, 'title', `Share ${slug}`);
  const summary = requireString(share, 'summary', `Share ${slug}`);
  assertPublicTextSafe(`${title}\n${summary}`, `Share ${slug}`);
  const publishedAt = requireString(share, 'publishedAt', `Share ${slug}`);
  const updatedAt = requireString(share, 'updatedAt', `Share ${slug}`);
  assertIsoUtc(publishedAt, `Share ${slug}.publishedAt`);
  assertIsoUtc(updatedAt, `Share ${slug}.updatedAt`);
  if (Date.parse(updatedAt) < Date.parse(publishedAt)) {
    throw new Error(`Share ${slug}.updatedAt cannot precede publishedAt`);
  }
  const coverValue = share['cover'] ?? share['coverPath'];
  if (typeof coverValue !== 'string' || !coverValue.trim()) {
    throw new Error(`Share ${slug}.cover/coverPath must be a non-empty string`);
  }
  const cover = coverValue.trim();
  parseHttpsUrl(cover, `Share ${slug}.coverPath`);
  const coverAlt = share['coverAlt'];
  if (coverAlt !== undefined) {
    if (typeof coverAlt !== 'string' || !coverAlt.trim()) {
      throw new Error(`Share ${slug}.coverAlt must be a non-empty string`);
    }
    assertPublicTextSafe(coverAlt, `Share ${slug}.coverAlt`);
  }
  const tags = requireArray(share['tags'], `Share ${slug}.tags`);
  if (tags.length < 1 || tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
    throw new Error(`Share ${slug}.tags must contain non-empty strings`);
  }
  const deck = parseDeckArtifact(share, `Share ${slug}`);
  if (deck) {
    validateRegistryAssets(share, slug, deck, cover);
    validateTranscriptRegistry(registry, share, `Share ${slug}`, deck.slideCount);
  }
  return { value: share, slug, status, ...(deck ? { deck } : {}) };
}

function validateRegistry(
  registry: UnknownRecord,
  localSlug?: string,
): { publicShares: RegistryShare[]; localShare?: RegistryShare } {
  const publicValues = getPublicRegistryShares(registry);
  const publicShares = publicValues.map(value => validateShare(registry, value, true));
  const slugs = new Set<string>();
  for (const share of publicShares) {
    if (slugs.has(share.slug)) {
      throw new Error(`Duplicate public Share slug: ${share.slug}`);
    }
    slugs.add(share.slug);
  }
  if (!localSlug) {
    return { publicShares };
  }
  const localValue = getRegistryShare(registry, localSlug);
  if (localValue === undefined) {
    throw new Error(`Share registry does not contain ${localSlug}`);
  }
  const localShare = validateShare(registry, localValue, false);
  return { publicShares, localShare };
}

function requiredPayloadKeys(slideCount: number): string[] {
  const keys: string[] = [];
  for (let number = 1; number <= slideCount; number += 1) {
    keys.push(`slides/${String(number).padStart(3, '0')}.webp`);
  }
  for (let number = 1; number <= slideCount; number += 1) {
    keys.push(`thumbnails/${String(number).padStart(3, '0')}.webp`);
  }
  keys.push('cover.webp', 'deck.pdf', 'source.pptx', 'transcript.md');
  return keys;
}

function expectedMetadata(
  key: string,
  slug: string,
  version: string,
): { mimeType: string; contentDisposition: string } {
  const name = basename(key);
  if (key.endsWith('.webp')) {
    return { mimeType: 'image/webp', contentDisposition: `inline; filename="${name}"` };
  }
  if (key === 'deck.pdf') {
    return {
      mimeType: 'application/pdf',
      contentDisposition: `attachment; filename="${slug}-${version}.pdf"`,
    };
  }
  if (key === 'source.pptx') {
    return {
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      contentDisposition: `attachment; filename="${slug}-${version}.pptx"`,
    };
  }
  if (key === 'transcript.md') {
    return {
      mimeType: 'text/markdown; charset=utf-8',
      contentDisposition: `attachment; filename="${slug}-${version}-transcript.md"`,
    };
  }
  throw new Error(`Unexpected payload key: ${key}`);
}

function parsePayload(value: unknown, index: number, slug: string, version: string): PayloadEntry {
  const record = requireRecord(value, `manifest.payloads[${index}]`);
  const key = requireString(record, 'key', `manifest.payloads[${index}]`);
  if (
    !safeObjectKeyPattern.test(key) ||
    key.startsWith('/') ||
    key.endsWith('/') ||
    key.includes('//') ||
    key.split('/').some(segment => segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe payload key: ${key}`);
  }
  const size = requireInteger(record, 'size', `manifest payload ${key}`, 1);
  const sha256 = requireString(record, 'sha256', `manifest payload ${key}`);
  if (!sha256Pattern.test(sha256)) {
    throw new Error(`Manifest payload ${key} has an invalid SHA-256`);
  }
  const mimeType = requireString(record, 'mimeType', `manifest payload ${key}`);
  const cacheControl = requireString(record, 'cacheControl', `manifest payload ${key}`);
  const contentDisposition = requireString(record, 'contentDisposition', `manifest payload ${key}`);
  const expected = expectedMetadata(key, slug, version);
  if (
    mimeType !== expected.mimeType ||
    cacheControl !== immutableCacheControl ||
    contentDisposition !== expected.contentDisposition
  ) {
    throw new Error(`Manifest payload ${key} has incorrect HTTP metadata`);
  }
  const optionalNumber = (field: 'slideNumber' | 'width' | 'height'): number | undefined => {
    const candidate = Reflect.get(record, field) as unknown;
    if (candidate === undefined) {
      return undefined;
    }
    if (!Number.isInteger(candidate) || typeof candidate !== 'number' || candidate < 1) {
      throw new Error(`Manifest payload ${key}.${field} must be a positive integer`);
    }
    return candidate;
  };
  const slideNumber = optionalNumber('slideNumber');
  const width = optionalNumber('width');
  const height = optionalNumber('height');
  return {
    key,
    size,
    sha256,
    mimeType,
    cacheControl,
    contentDisposition,
    ...(slideNumber === undefined ? {} : { slideNumber }),
    ...(width === undefined ? {} : { width }),
    ...(height === undefined ? {} : { height }),
  };
}

function assertNoPrivatePaths(value: unknown, label: string): void {
  if (typeof value === 'string') {
    assertPublicTextSafe(value, label);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoPrivatePaths(entry, `${label}[${index}]`));
    return;
  }
  if (isRecord(value)) {
    for (const [key, entry] of Object.entries(value)) {
      assertNoPrivatePaths(entry, `${label}.${key}`);
    }
  }
}

function parseManifest(value: unknown): Manifest {
  const record = requireRecord(value, 'manifest');
  assertNoPrivatePaths(record, 'manifest');
  const schemaVersion = requireInteger(record, 'schemaVersion', 'manifest', 1);
  if (schemaVersion !== 1) {
    throw new Error(`Unsupported manifest schemaVersion: ${schemaVersion}`);
  }
  const slug = requireString(record, 'slug', 'manifest');
  const version = requireString(record, 'version', 'manifest');
  if (!isSafeSlug(slug) || !isSafeVersion(version)) {
    throw new Error('Manifest slug or version is unsafe');
  }
  const objectPrefix = requireString(record, 'objectPrefix', 'manifest');
  const expectedPrefix = `shares/${slug}/${version}`;
  if (objectPrefix !== expectedPrefix) {
    throw new Error(`Manifest objectPrefix must be ${expectedPrefix}`);
  }
  const publicBaseUrl = requireString(record, 'publicBaseUrl', 'manifest').replace(/\/+$/, '');
  const publicUrl = parseHttpsUrl(publicBaseUrl, 'manifest.publicBaseUrl');
  if (publicUrl.origin !== expectedPublicOrigin || publicUrl.pathname !== `/${objectPrefix}`) {
    throw new Error(`Manifest publicBaseUrl must be ${expectedPublicOrigin}/${objectPrefix}`);
  }
  const generatedAt = requireString(record, 'generatedAt', 'manifest');
  assertIsoUtc(generatedAt, 'manifest.generatedAt');
  const sealed = requireBoolean(record, 'sealed', 'manifest');
  if (sealed) {
    throw new Error('A sealed local manifest cannot be prepared or republished');
  }
  const source = requireRecord(record['source'], 'manifest.source');
  const sourceFileName = requireString(source, 'fileName', 'manifest.source');
  if (sourceFileName.includes('/') || sourceFileName.includes('\\')) {
    throw new Error('manifest.source.fileName must be a basename, not a path');
  }
  const sourceSha256 = requireString(source, 'sha256', 'manifest.source');
  const sanitizedSha256 = requireString(source, 'sanitizedSha256', 'manifest.source');
  if (!sha256Pattern.test(sourceSha256) || !sha256Pattern.test(sanitizedSha256)) {
    throw new Error('Manifest source hashes must be lowercase SHA-256 values');
  }
  const deck = requireRecord(record['deck'], 'manifest.deck');
  const slideCount = requireInteger(deck, 'slideCount', 'manifest.deck', 1);
  const width = requireInteger(deck, 'width', 'manifest.deck', 1);
  const height = requireInteger(deck, 'height', 'manifest.deck', 1);
  const pdfPageCount = requireInteger(deck, 'pdfPageCount', 'manifest.deck', 1);
  if (width !== 1920 || height !== 1080 || pdfPageCount !== slideCount || deck['format'] !== 'webp') {
    throw new Error('Manifest deck geometry, format, or PDF page count is invalid');
  }
  if (
    deck['thumbnailWidth'] !== 480 ||
    deck['thumbnailHeight'] !== 270 ||
    deck['coverWidth'] !== 1200 ||
    deck['coverHeight'] !== 675
  ) {
    throw new Error('Manifest thumbnail or cover geometry is invalid');
  }
  const sanitizer = requireRecord(record['sanitizer'], 'manifest.sanitizer');
  if (
    sanitizer['status'] !== 'passed' ||
    sanitizer['physicalSlideCount'] !== slideCount ||
    sanitizer['speakerNotesRemoved'] !== true ||
    sanitizer['commentsRejected'] !== true ||
    sanitizer['hiddenSlidesRejected'] !== true ||
    sanitizer['externalRelationshipsRejected'] !== true ||
    sanitizer['activeContentRejected'] !== true ||
    sanitizer['documentPropertiesSanitized'] !== true ||
    sanitizer['zipTimestampsNormalized'] !== true
  ) {
    throw new Error('Manifest sanitizer summary is incomplete or failed');
  }
  const payloadCount = requireInteger(record, 'payloadCount', 'manifest', 1);
  const totalObjectCount = requireInteger(record, 'totalObjectCount', 'manifest', 2);
  const totalPayloadBytes = requireInteger(record, 'totalPayloadBytes', 'manifest', 1);
  const payloadValues = requireArray(record['payloads'], 'manifest.payloads');
  const payloads = payloadValues.map((payload, index) => parsePayload(payload, index, slug, version));
  if (payloadCount !== payloads.length || totalObjectCount !== payloadCount + 1) {
    throw new Error('Manifest object counts are inconsistent');
  }
  const requiredKeys = requiredPayloadKeys(slideCount);
  if (payloadCount !== requiredKeys.length) {
    throw new Error(`Manifest must contain ${requiredKeys.length} payloads for ${slideCount} slides`);
  }
  const byKey = new Map(payloads.map(payload => [payload.key, payload]));
  if (byKey.size !== payloads.length || requiredKeys.some(key => !byKey.has(key))) {
    throw new Error('Manifest payload whitelist has duplicate, missing, or unexpected keys');
  }
  if (payloads.reduce((sum, payload) => sum + payload.size, 0) !== totalPayloadBytes) {
    throw new Error('Manifest totalPayloadBytes does not match payload sizes');
  }
  const sourcePayload = byKey.get('source.pptx');
  if (!sourcePayload || sourcePayload.sha256 !== sanitizedSha256) {
    throw new Error('Sanitized source hash does not match source.pptx payload hash');
  }
  for (let number = 1; number <= slideCount; number += 1) {
    const padded = String(number).padStart(3, '0');
    const slide = byKey.get(`slides/${padded}.webp`);
    const thumbnail = byKey.get(`thumbnails/${padded}.webp`);
    if (!slide || slide.slideNumber !== number || slide.width !== 1920 || slide.height !== 1080) {
      throw new Error(`Manifest slide ${padded} metadata is invalid`);
    }
    if (!thumbnail || thumbnail.slideNumber !== number || thumbnail.width !== 480 || thumbnail.height !== 270) {
      throw new Error(`Manifest thumbnail ${padded} metadata is invalid`);
    }
  }
  const cover = byKey.get('cover.webp');
  if (!cover || cover.width !== 1200 || cover.height !== 675) {
    throw new Error('Manifest cover metadata is invalid');
  }
  return {
    raw: record,
    schemaVersion,
    slug,
    version,
    objectPrefix,
    publicBaseUrl,
    generatedAt,
    sealed,
    sourceSha256,
    sanitizedSha256,
    slideCount,
    payloadCount,
    totalObjectCount,
    totalPayloadBytes,
    payloads,
  };
}

function inspectWebp(buffer: Buffer): WebpInspection {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Invalid WebP RIFF container');
  }
  let offset = 12;
  let width: number | undefined;
  let height: number | undefined;
  const metadataChunks: string[] = [];
  while (offset + 8 <= buffer.length) {
    const chunkName = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    if (dataOffset + chunkSize > buffer.length) {
      throw new Error(`Malformed WebP chunk: ${chunkName}`);
    }
    if (['EXIF', 'XMP ', 'ICCP'].includes(chunkName)) {
      metadataChunks.push(chunkName.trim());
    }
    if (chunkName === 'VP8X' && chunkSize >= 10) {
      width = 1 + buffer.readUIntLE(dataOffset + 4, 3);
      height = 1 + buffer.readUIntLE(dataOffset + 7, 3);
    } else if (chunkName === 'VP8 ' && chunkSize >= 10) {
      if (buffer[dataOffset + 3] === 0x9d && buffer[dataOffset + 4] === 0x01 && buffer[dataOffset + 5] === 0x2a) {
        width = buffer.readUInt16LE(dataOffset + 6) & 0x3fff;
        height = buffer.readUInt16LE(dataOffset + 8) & 0x3fff;
      }
    } else if (chunkName === 'VP8L' && chunkSize >= 5 && buffer.readUInt8(dataOffset) === 0x2f) {
      const bits = buffer.readUInt32LE(dataOffset + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >> 14) & 0x3fff) + 1;
    }
    offset = dataOffset + chunkSize + (chunkSize % 2);
  }
  if (!width || !height) {
    throw new Error('Unable to read WebP dimensions');
  }
  return { width, height, metadataChunks };
}

async function listFilesRecursively(root: string): Promise<string[]> {
  const output: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile()) {
        output.push(relative(root, absolute).split(sep).join('/'));
      } else {
        throw new Error(`Staging contains a non-regular entry: ${entry.name}`);
      }
    }
  }
  await visit(root);
  return output.sort();
}

async function validateSanitizedPptx(path: string, manifest: Manifest): Promise<void> {
  const python = process.env['PYTHON_BIN'] || 'python3';
  try {
    const { stdout } = await execFile(
      python,
      [
        resolve(repoRoot, 'scripts', 'sanitize-share-pptx.py'),
        '--validate-only',
        '--input',
        path,
        '--expected-sha256',
        manifest.sanitizedSha256,
        '--expected-slides',
        String(manifest.slideCount),
      ],
      { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
    );
    const result = requireRecord(JSON.parse(stdout) as unknown, 'Sanitizer validation result');
    if (result['validated'] !== true || result['slideCount'] !== manifest.slideCount) {
      throw new Error('Sanitizer did not validate the staged PPTX');
    }
  } catch (cause) {
    throw new Error('Staged source.pptx failed sanitizer validation', { cause });
  }
}

async function validatePdf(path: string, expectedPages: number): Promise<void> {
  try {
    const { stdout } = await execFile('pdfinfo', [path], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
    const pages = /^Pages:\s+(\d+)\s*$/m.exec(stdout);
    const pageSize = /^Page size:\s+([0-9.]+)\s+x\s+([0-9.]+)\s+pts/m.exec(stdout);
    if (!pages || Number(pages[1]) !== expectedPages || !pageSize) {
      throw new Error(`PDF must have exactly ${expectedPages} pages and a reported page size`);
    }
    const ratio = Number(pageSize[1]) / Number(pageSize[2]);
    if (!Number.isFinite(ratio) || Math.abs(ratio - 16 / 9) > 0.002) {
      throw new Error('PDF pages must be 16:9');
    }
    assertPublicTextSafe(stdout, 'PDF metadata');
  } catch (cause) {
    throw new Error('deck.pdf failed pdfinfo validation; install Poppler pdfinfo for local validation', { cause });
  }
}

async function validateLocalStaging(
  stagingDirectory: string,
  manifest: Manifest,
  expectedTranscript: string,
): Promise<void> {
  const files = await listFilesRecursively(stagingDirectory);
  const expectedFiles = [...manifest.payloads.map(payload => payload.key), 'manifest.json'].sort();
  if (files.length !== expectedFiles.length || files.some((file, index) => file !== expectedFiles.at(index))) {
    throw new Error(
      `Local staging must contain exactly ${manifest.payloadCount} whitelisted payloads and manifest.json`,
    );
  }
  for (const payload of manifest.payloads) {
    const path = join(stagingDirectory, ...payload.key.split('/'));
    const details = await stat(path);
    if (!details.isFile() || details.size !== payload.size) {
      throw new Error(`Staged payload size mismatch: ${payload.key}`);
    }
    if ((await sha256File(path)) !== payload.sha256) {
      throw new Error(`Staged payload SHA-256 mismatch: ${payload.key}`);
    }
    if (payload.key.endsWith('.webp')) {
      const inspection = inspectWebp(await readFile(path));
      if (inspection.width !== payload.width || inspection.height !== payload.height) {
        throw new Error(`Staged WebP dimensions mismatch: ${payload.key}`);
      }
      if (inspection.metadataChunks.length > 0) {
        throw new Error(`Staged WebP retains metadata: ${payload.key}`);
      }
    }
  }
  const transcriptPath = join(stagingDirectory, 'transcript.md');
  const transcript = await readFile(transcriptPath, 'utf8');
  assertPublicTextSafe(transcript, 'Staged transcript');
  if (transcript !== expectedTranscript) {
    throw new Error('Staged transcript does not exactly match the selected TypeScript Share registry');
  }
  const headings = [...transcript.matchAll(/^## Slide (\d{3}):\s+.+$/gm)];
  if (headings.length !== manifest.slideCount) {
    throw new Error(`Staged transcript must contain ${manifest.slideCount} ordered slide headings`);
  }
  for (let index = 0; index < headings.length; index += 1) {
    if (headings.at(index)?.at(1) !== String(index + 1).padStart(3, '0')) {
      throw new Error(`Staged transcript heading order is invalid at slide ${index + 1}`);
    }
  }
  await validatePdf(join(stagingDirectory, 'deck.pdf'), manifest.slideCount);
  await validateSanitizedPptx(join(stagingDirectory, 'source.pptx'), manifest);
}

async function mapConcurrent<T>(
  values: T[],
  concurrency: number,
  worker: (value: T, index: number) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  async function consume(): Promise<void> {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      const value = values.at(index);
      if (value === undefined) {
        throw new Error('Concurrent validation queue returned an undefined item');
      }
      await worker(value, index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => consume()));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('accept-encoding', 'identity');
  const response = await fetch(url, {
    ...init,
    headers,
    signal: AbortSignal.timeout(timeoutMs),
    redirect: 'manual',
  });
  if (response.headers.has('content-encoding')) {
    throw new Error('Public asset response used unexpected Content-Encoding');
  }
  return response;
}

function normalizeHeader(value: string | null): string {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

async function fetchRemoteManifest(
  baseUrl: string,
  timeoutMs: number,
): Promise<{ manifest: Manifest; bytes: Uint8Array; response: Response }> {
  const response = await fetchWithTimeout(`${baseUrl}/manifest.json`, { method: 'GET', cache: 'no-store' }, timeoutMs);
  if (!response.ok) {
    throw new Error(`Public manifest returned HTTP ${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch (cause) {
    throw new Error('Public manifest is not valid JSON', { cause });
  }
  return { manifest: parseManifest(parsed), bytes, response };
}

function validateRemoteHeaders(response: Response, payload: PayloadEntry, label: string): void {
  const contentLength = Number(response.headers.get('content-length'));
  if (!Number.isInteger(contentLength) || contentLength !== payload.size) {
    throw new Error(`${label} has an incorrect Content-Length`);
  }
  if (normalizeHeader(response.headers.get('content-type')) !== normalizeHeader(payload.mimeType)) {
    throw new Error(`${label} has an incorrect Content-Type`);
  }
  if (normalizeHeader(response.headers.get('cache-control')) !== normalizeHeader(payload.cacheControl)) {
    throw new Error(`${label} has an incorrect Cache-Control`);
  }
  if (normalizeHeader(response.headers.get('content-disposition')) !== normalizeHeader(payload.contentDisposition)) {
    throw new Error(`${label} has an incorrect Content-Disposition`);
  }
  // R2 custom domains may omit S3 custom metadata; public HTTP metadata remains required.
  const publicSha256Metadata = response.headers.get('x-amz-meta-sha256');
  if (publicSha256Metadata !== null && publicSha256Metadata !== payload.sha256) {
    throw new Error(`${label} has incorrect SHA-256 object metadata`);
  }
}

async function validateRemoteAssets(
  baseUrl: string,
  manifest: Manifest,
  options: CliOptions,
  manifestBytes: Uint8Array,
  manifestResponse: Response,
): Promise<void> {
  if (manifest.publicBaseUrl !== baseUrl) {
    throw new Error(`Public manifest base URL mismatch: expected ${baseUrl}`);
  }
  const manifestSha256 = sha256Bytes(manifestBytes);
  const manifestLength = Number(manifestResponse.headers.get('content-length'));
  if (!Number.isInteger(manifestLength) || manifestLength !== manifestBytes.byteLength) {
    throw new Error('Public manifest has an incorrect Content-Length');
  }
  if (normalizeHeader(manifestResponse.headers.get('content-type')) !== 'application/json; charset=utf-8') {
    throw new Error('Public manifest has an incorrect Content-Type');
  }
  if (normalizeHeader(manifestResponse.headers.get('cache-control')) !== immutableCacheControl) {
    throw new Error('Public manifest has an incorrect Cache-Control');
  }
  if (normalizeHeader(manifestResponse.headers.get('content-disposition')) !== 'inline; filename="manifest.json"') {
    throw new Error('Public manifest has an incorrect Content-Disposition');
  }
  // R2 custom domains may omit S3 custom metadata; the fetched manifest body is authoritative here.
  const publicManifestSha256Metadata = manifestResponse.headers.get('x-amz-meta-sha256');
  if (publicManifestSha256Metadata !== null && publicManifestSha256Metadata !== manifestSha256) {
    throw new Error('Public manifest has incorrect SHA-256 object metadata');
  }
  await mapConcurrent(manifest.payloads, options.concurrency, async payload => {
    const verifyBody = publicBodyVerificationKeys.has(payload.key);
    const response = await fetchWithTimeout(
      `${baseUrl}/${payload.key}`,
      { method: verifyBody ? 'GET' : 'HEAD', cache: 'no-store' },
      options.requestTimeoutMs,
    );
    if (!response.ok) {
      throw new Error(`Public payload ${payload.key} returned HTTP ${response.status}`);
    }
    validateRemoteHeaders(response, payload, `Public payload ${payload.key}`);
    if (verifyBody) {
      const body = new Uint8Array(await response.arrayBuffer());
      if (body.byteLength !== payload.size || sha256Bytes(body) !== payload.sha256) {
        throw new Error(`Public payload ${payload.key} has a body hash mismatch`);
      }
    }
  });
}

function validateApprovedReleaseInvariant(manifest: Manifest): void {
  if (manifest.slug !== defaultSlug || manifest.version !== defaultVersion) {
    return;
  }
  if (
    manifest.sourceSha256 !== expectedSourceSha256 ||
    manifest.slideCount !== expectedSlideCount ||
    manifest.payloadCount !== expectedPayloadCount ||
    manifest.totalObjectCount !== expectedObjectCount
  ) {
    throw new Error('Approved v4 manifest does not match fixed source hash, slide count, or object counts');
  }
}

function validateManifestAgainstRegistry(manifest: Manifest, share: RegistryShare): void {
  if (manifest.slug !== share.slug) {
    throw new Error(`Manifest slug ${manifest.slug} does not match registry Share ${share.slug}`);
  }
  if (!share.deck) {
    throw new Error(`Registry Share ${share.slug} has no deck artifact`);
  }
  if (
    manifest.version !== share.deck.version ||
    manifest.slideCount !== share.deck.slideCount ||
    manifest.publicBaseUrl !== share.deck.baseUrl ||
    share.deck.width !== 1920 ||
    share.deck.height !== 1080
  ) {
    throw new Error(`Manifest deck metadata does not match registry Share ${share.slug}`);
  }
}

function validateManifestTranscriptAgainstRegistry(
  registry: UnknownRecord,
  share: RegistryShare,
  manifest: Manifest,
): string {
  const expectedTranscript = renderRegistryTranscript(registry, share.value, manifest.slideCount);
  const transcriptPayload = manifest.payloads.find(payload => payload.key === 'transcript.md');
  if (!transcriptPayload) {
    throw new Error(`Manifest for Share ${share.slug} has no transcript.md payload`);
  }
  const expectedSha256 = sha256Bytes(new TextEncoder().encode(expectedTranscript));
  if (transcriptPayload.sha256 !== expectedSha256) {
    throw new Error(`Manifest transcript does not exactly match registry Share ${share.slug}`);
  }
  return expectedTranscript;
}

async function readLocalManifest(stagingDirectory: string): Promise<Manifest> {
  const manifestPath = join(stagingDirectory, 'manifest.json');
  await requireFile(manifestPath);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(manifestPath, 'utf8')) as unknown;
  } catch (cause) {
    throw new Error(`Invalid JSON in ${displayPath(manifestPath)}`, { cause });
  }
  return parseManifest(parsed);
}

async function run(): Promise<void> {
  const options = parseArguments(process.argv.slice(2));
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (!Number.isInteger(nodeMajor) || nodeMajor < 22) {
    throw new Error('Node.js 22 or newer is required');
  }
  const registry = await loadRegistry(options.registryPath);
  const registryResult = validateRegistry(registry, options.mode === 'local' ? options.slug : undefined);

  if (options.mode === 'registry') {
    log(`Validated Share registry (${registryResult.publicShares.length} public Share entries)`);
    return;
  }
  if (options.mode === 'local') {
    const localShare = registryResult.localShare;
    if (!localShare) {
      throw new Error(`Registry validation did not return local Share ${options.slug}`);
    }
    const manifest = await readLocalManifest(options.stagingDirectory);
    validateApprovedReleaseInvariant(manifest);
    validateManifestAgainstRegistry(manifest, localShare);
    const expectedTranscript = validateManifestTranscriptAgainstRegistry(registry, localShare, manifest);
    await validateLocalStaging(options.stagingDirectory, manifest, expectedTranscript);
    log(`Validated local staging: ${manifest.payloadCount} payloads and ${manifest.totalObjectCount} total objects`);
    return;
  }

  const publicShares =
    options.slug === defaultSlug && !process.argv.includes('--slug')
      ? registryResult.publicShares
      : registryResult.publicShares.filter(share => share.slug === options.slug);
  if (process.argv.includes('--slug') && publicShares.length === 0) {
    throw new Error(`No public Share matches ${options.slug}`);
  }
  for (const share of publicShares) {
    if (!share.deck) {
      continue;
    }
    const baseUrl = options.publicBaseUrl ?? share.deck.baseUrl;
    parseHttpsUrl(baseUrl, `Public base URL for ${share.slug}`);
    const remote = await fetchRemoteManifest(baseUrl, options.requestTimeoutMs);
    validateApprovedReleaseInvariant(remote.manifest);
    validateManifestAgainstRegistry(remote.manifest, share);
    validateManifestTranscriptAgainstRegistry(registry, share, remote.manifest);
    await validateRemoteAssets(baseUrl, remote.manifest, options, remote.bytes, remote.response);
  }
  log(`Validated public registry and remote assets for ${publicShares.length} Share entries`);
}

run().catch(cause => {
  const message = cause instanceof Error ? cause.message : String(cause);
  error(`validate-share-assets: ${message}`);
  process.exitCode = 1;
});
