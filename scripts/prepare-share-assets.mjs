#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { error, log } from 'node:console';
import { execFile as execFileCallback } from 'node:child_process';
import { access, lstat, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFile = promisify(execFileCallback);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'agent-native-product-ai-maker-shanghai';
const version = 'v4';
const expectedSourceSha256 = 'd2a8f210a4904bfbe8d157f7a7014380164cc4dc3f8abd4341746fc9bf7ac44f';
const expectedSlideCount = 40;
const slideWidth = 1920;
const slideHeight = 1080;
const thumbnailWidth = 480;
const thumbnailHeight = 270;
const coverWidth = 1200;
const coverHeight = 675;
const immutableCacheControl = 'public, max-age=31536000, immutable';
const manifestFileName = 'manifest.json';
const expectedPayloadCount = 84;
const maxCommandOutputBytes = 16 * 1024 * 1024;
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

/** @typedef {Record<string, unknown>} UnknownRecord */
/**
 * @typedef {object} CliOptions
 * @property {string} source
 * @property {string} output
 * @property {string} registry
 * @property {boolean} force
 * @property {number} concurrency
 */
/**
 * @typedef {object} SlideTranscript
 * @property {number} number
 * @property {string} title
 * @property {string} alt
 * @property {string} transcript
 */
/**
 * @typedef {object} PayloadEntry
 * @property {string} key
 * @property {number} size
 * @property {string} sha256
 * @property {string} mimeType
 * @property {string} cacheControl
 * @property {string} contentDisposition
 * @property {number} [slideNumber]
 * @property {number} [width]
 * @property {number} [height]
 */
/**
 * @typedef {object} Executables
 * @property {string} python
 * @property {string} soffice
 * @property {string} pdfinfo
 * @property {string} pdftoppm
 * @property {string} cwebp
 */

function usage() {
  return [
    'Usage: node scripts/prepare-share-assets.mjs [options]',
    '',
    'Options:',
    '  --source <pptx>       authoritative source deck',
    '  --output <directory>  staging directory',
    '  --registry <file>     TypeScript Share registry module',
    '  --concurrency <1-8>   bounded image conversion concurrency (default: 4)',
    '  --force               replace an existing generated staging directory',
    '  --help                show this help',
  ].join('\n');
}

/** @param {string[]} arguments_ @returns {CliOptions} */
function parseArguments(arguments_) {
  const defaultSource = resolve(
    repoRoot,
    '..',
    'quartz',
    'content',
    'slide-deck',
    'agent-native-ai-maker-shanghai',
    '构建 Agent Native Product-AI Maker 上海-晓灰-v4.pptx',
  );
  /** @type {CliOptions} */
  const options = {
    source: defaultSource,
    output: resolve(repoRoot, 'dist', 'shares', slug, version),
    registry: resolve(repoRoot, 'src', 'content', 'shares', 'index.ts'),
    force: false,
    concurrency: 4,
  };
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === '--') {
      continue;
    }
    if (argument === '--help') {
      log(usage());
      process.exit(0);
    }
    if (argument === '--force') {
      options.force = true;
      continue;
    }
    if (
      argument === '--source' ||
      argument === '--output' ||
      argument === '--registry' ||
      argument === '--concurrency'
    ) {
      const value = arguments_[index + 1];
      if (!value) {
        throw new Error(`Missing value for ${argument}`);
      }
      index += 1;
      if (argument === '--source') {
        options.source = resolve(process.cwd(), value);
      } else if (argument === '--output') {
        options.output = resolve(process.cwd(), value);
      } else if (argument === '--registry') {
        options.registry = resolve(process.cwd(), value);
      } else {
        options.concurrency = Number(value);
      }
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 8) {
    throw new Error('--concurrency must be an integer from 1 through 8');
  }
  return options;
}

/** @param {unknown} value @returns {value is UnknownRecord} */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {unknown} value @param {string} label @returns {UnknownRecord} */
function requireRecord(value, label) {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }
  return value;
}

/** @param {UnknownRecord} value @param {string} key @param {string} label @returns {string} */
function requireString(value, key, label) {
  const candidate = value[key];
  if (typeof candidate !== 'string' || !candidate.trim()) {
    throw new Error(`${label}.${key} must be a non-empty string`);
  }
  return candidate.trim();
}

/** @param {string} path */
async function requireFile(path) {
  try {
    await access(path, fsConstants.R_OK);
    const details = await stat(path);
    if (!details.isFile()) {
      throw new Error('not a regular file');
    }
  } catch (cause) {
    throw new Error(`Required file is unavailable: ${displayPath(path)}`, { cause });
  }
}

/** @param {string} path @returns {string} */
function displayPath(path) {
  const projectRelative = relative(repoRoot, path);
  if (projectRelative && !projectRelative.startsWith(`..${sep}`) && projectRelative !== '..') {
    return projectRelative.split(sep).join('/');
  }
  return basename(path);
}

/** @param {string} candidate @returns {Promise<boolean>} */
async function isExecutable(candidate) {
  try {
    await access(candidate, fsConstants.X_OK);
    return (await stat(candidate)).isFile();
  } catch {
    return false;
  }
}

/** @param {string} command @returns {Promise<string | undefined>} */
async function findOnPath(command) {
  const pathValue = process.env['PATH'];
  if (!pathValue) {
    return undefined;
  }
  for (const directory of pathValue.split(process.platform === 'win32' ? ';' : ':')) {
    if (!directory) {
      continue;
    }
    const candidate = join(directory, command);
    if (await isExecutable(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/** @param {string} command @param {string[]} candidates @returns {Promise<string>} */
async function resolveExecutable(command, candidates = []) {
  for (const candidate of candidates) {
    if (candidate && (await isExecutable(candidate))) {
      return candidate;
    }
  }
  const fromPath = await findOnPath(command);
  if (fromPath) {
    return fromPath;
  }
  throw new Error(`Required executable not found: ${command}`);
}

/** @returns {Promise<Executables>} */
async function preflight() {
  const python = await resolveExecutable('python3');
  const configuredSoffice = process.env['SOFFICE_BIN'];
  const soffice = configuredSoffice
    ? await resolveExecutable(configuredSoffice, [configuredSoffice])
    : await resolveExecutable(
        'soffice',
        process.platform === 'darwin' ? ['/Applications/LibreOffice.app/Contents/MacOS/soffice'] : [],
      );
  const pdfinfo = await resolveExecutable('pdfinfo');
  const pdftoppm = await resolveExecutable('pdftoppm');
  const cwebp = await resolveExecutable('cwebp');
  const { stdout } = await execFile(python, ['--version'], {
    encoding: 'utf8',
    maxBuffer: maxCommandOutputBytes,
  });
  const versionMatch = /Python\s+(\d+)\.(\d+)/.exec(stdout);
  if (!versionMatch) {
    throw new Error('Unable to determine the Python version');
  }
  const major = Number(versionMatch[1]);
  const minor = Number(versionMatch[2]);
  if (major < 3 || (major === 3 && minor < 9)) {
    throw new Error('Python 3.9 or newer is required');
  }
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (!Number.isInteger(nodeMajor) || nodeMajor < 22) {
    throw new Error('Node.js 22 or newer is required to import the TypeScript Share registry');
  }
  return { python, soffice, pdfinfo, pdftoppm, cwebp };
}

/** @param {string} command @param {string[]} arguments_ @param {string} action @param {string | undefined} cwd */
async function runCommand(command, arguments_, action, cwd = undefined) {
  try {
    return await execFile(command, arguments_, {
      cwd,
      encoding: 'utf8',
      maxBuffer: maxCommandOutputBytes,
      env: process.env,
    });
  } catch (cause) {
    const details = isRecord(cause) && typeof cause['stderr'] === 'string' ? cause['stderr'].trim() : '';
    throw new Error(`${action} failed${details ? `: ${details}` : ''}`, { cause });
  }
}

/** @param {string} path @returns {Promise<string>} */
async function sha256File(path) {
  const digest = createHash('sha256');
  const data = await readFile(path);
  digest.update(data);
  return digest.digest('hex');
}

/** @param {string} text @param {string} label */
function assertPublicTextSafe(text, label) {
  if (localPathPattern.test(text)) {
    throw new Error(`${label} contains a local absolute path`);
  }
  for (const pattern of sensitivePatterns) {
    if (pattern.test(text)) {
      throw new Error(`${label} contains a possible credential or secret and requires manual review`);
    }
  }
}

/** @param {unknown} moduleValue @returns {UnknownRecord} */
function moduleRecord(moduleValue) {
  return requireRecord(moduleValue, 'Share registry module');
}

/** @param {UnknownRecord} registry @returns {UnknownRecord} */
function loadShareRecord(registry) {
  const getter = registry['getShareBySlug'];
  if (typeof getter !== 'function') {
    throw new Error('Share registry must export getShareBySlug(slug)');
  }
  const share = getter(slug);
  const record = requireRecord(share, `Share ${slug}`);
  if (requireString(record, 'slug', 'Share') !== slug) {
    throw new Error(`Share registry returned the wrong slug for ${slug}`);
  }
  return record;
}

/** @param {UnknownRecord} registry @param {UnknownRecord} share @returns {unknown[]} */
function locateTranscriptEntries(registry, share) {
  /** @type {{label: string, value: unknown[]}[]} */
  const candidates = [];
  const exportedGetter = registry['getShareSlides'];
  if (typeof exportedGetter === 'function') {
    const value = exportedGetter(slug);
    if (Array.isArray(value)) {
      candidates.push({ label: 'getShareSlides()', value });
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
  for (const artifactValue of artifacts) {
    if (!isRecord(artifactValue) || artifactValue['kind'] !== 'deck') {
      continue;
    }
    if (Array.isArray(artifactValue['slides'])) {
      candidates.push({ label: 'deck artifact slides', value: artifactValue['slides'] });
    }
  }
  if (candidates.length === 0) {
    throw new Error(
      'Share registry must provide 40 transcript entries through getShareSlides(), share.slides, share.transcript, or deck.slides',
    );
  }
  const first = candidates[0];
  if (!first) {
    throw new Error('Transcript registry lookup failed unexpectedly');
  }
  for (const candidate of candidates.slice(1)) {
    if (candidate.value !== first.value) {
      throw new Error(`Ambiguous transcript sources: ${first.label} and ${candidate.label}`);
    }
  }
  return first.value;
}

/** @param {UnknownRecord} record @param {string[]} keys @param {string} label @returns {string} */
function requireSingleTextField(record, keys, label) {
  const values = keys
    .map(key => record[key])
    .filter(value => typeof value === 'string' && value.trim())
    .map(value => /** @type {string} */ (value).trim());
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length !== 1) {
    throw new Error(`${label} must provide exactly one unambiguous ${keys.join('/')} text value`);
  }
  const value = uniqueValues[0];
  if (!value) {
    throw new Error(`${label} text is empty`);
  }
  return value;
}

/** @param {UnknownRecord} record @param {string[]} keys @returns {string} */
function readOptionalSingleTextField(record, keys) {
  const values = keys
    .map(key => record[key])
    .filter(value => typeof value === 'string')
    .map(value => /** @type {string} */ (value).trim());
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length > 1) {
    throw new Error(`Transcript provides ambiguous ${keys.join('/')} text values`);
  }
  return uniqueValues[0] ?? '';
}

/** @param {UnknownRecord} registry @param {UnknownRecord} share @returns {SlideTranscript[]} */
function readTranscriptSlides(registry, share) {
  const entries = locateTranscriptEntries(registry, share);
  if (entries.length !== expectedSlideCount) {
    throw new Error(
      `Registry transcript must contain exactly ${expectedSlideCount} slides; received ${entries.length}`,
    );
  }
  return entries.map((entry, index) => {
    const label = `Transcript slide ${index + 1}`;
    const record = requireRecord(entry, label);
    const numberValue = record['number'] ?? record['slideNumber'] ?? index + 1;
    if (numberValue !== index + 1) {
      throw new Error(`${label} must be in physical order and numbered ${index + 1}`);
    }
    const title = requireSingleTextField(record, ['title', 'heading'], `${label} title`);
    const alt = requireSingleTextField(record, ['alt', 'altText', 'description'], `${label} alt text`);
    const transcriptText = readOptionalSingleTextField(record, ['transcript', 'notes', 'speakerNotes', 'body']);
    assertPublicTextSafe(`${title}\n${alt}\n${transcriptText}`, label);
    return { number: index + 1, title, alt, transcript: transcriptText };
  });
}

/** @param {string} registryPath @returns {Promise<{share: UnknownRecord, slides: SlideTranscript[]}>} */
async function loadRegistryTranscript(registryPath) {
  await requireFile(registryPath);
  let imported;
  try {
    imported = await import(`${pathToFileURL(registryPath).href}?prepare=${Date.now()}`);
  } catch (cause) {
    throw new Error(
      `Unable to import ${displayPath(registryPath)} with Node.js type stripping; registry imports must be relative and include file extensions`,
      { cause },
    );
  }
  const registry = moduleRecord(imported);
  const share = loadShareRecord(registry);
  return { share, slides: readTranscriptSlides(registry, share) };
}

/** @param {UnknownRecord} share @param {SlideTranscript[]} slides @returns {string} */
function renderTranscript(share, slides) {
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
  assertPublicTextSafe(transcript, 'Generated transcript');
  return `${transcript.trim()}\n`;
}

/** @param {Buffer} buffer @returns {{width: number, height: number, metadataChunks: string[]}} */
function inspectWebp(buffer) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Generated file is not a valid WebP RIFF container');
  }
  let offset = 12;
  let width;
  let height;
  /** @type {string[]} */
  const metadataChunks = [];
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
    } else if (chunkName === 'VP8L' && chunkSize >= 5 && buffer[dataOffset] === 0x2f) {
      const bits = buffer.readUInt32LE(dataOffset + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >> 14) & 0x3fff) + 1;
    }
    offset = dataOffset + chunkSize + (chunkSize % 2);
  }
  if (!width || !height) {
    throw new Error('Unable to read generated WebP dimensions');
  }
  return { width, height, metadataChunks };
}

/** @param {string} path @param {number} expectedWidth @param {number} expectedHeight */
async function validateWebp(path, expectedWidth, expectedHeight) {
  const inspection = inspectWebp(await readFile(path));
  if (inspection.width !== expectedWidth || inspection.height !== expectedHeight) {
    throw new Error(
      `${displayPath(path)} has dimensions ${inspection.width}x${inspection.height}; expected ${expectedWidth}x${expectedHeight}`,
    );
  }
  if (inspection.metadataChunks.length > 0) {
    throw new Error(`${displayPath(path)} retains metadata chunks: ${inspection.metadataChunks.join(', ')}`);
  }
}

/** @param {string[]} values @param {number} concurrency @param {(value: string, index: number) => Promise<void>} worker */
async function mapConcurrent(values, concurrency, worker) {
  let nextIndex = 0;
  async function consume() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      const value = values[index];
      if (value === undefined) {
        throw new Error('Concurrent work queue returned an undefined item');
      }
      await worker(value, index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => consume()));
}

/** @param {string} pdfInfoOutput @returns {{pages: number, widthPoints: number, heightPoints: number}} */
function parsePdfInfo(pdfInfoOutput) {
  const pagesMatch = /^Pages:\s+(\d+)\s*$/m.exec(pdfInfoOutput);
  const pageSizeMatch = /^Page size:\s+([0-9.]+)\s+x\s+([0-9.]+)\s+pts/m.exec(pdfInfoOutput);
  if (!pagesMatch || !pageSizeMatch) {
    throw new Error('pdfinfo did not report page count and page size');
  }
  const pages = Number(pagesMatch[1]);
  const widthPoints = Number(pageSizeMatch[1]);
  const heightPoints = Number(pageSizeMatch[2]);
  if (![pages, widthPoints, heightPoints].every(Number.isFinite)) {
    throw new Error('pdfinfo returned invalid numeric metadata');
  }
  return { pages, widthPoints, heightPoints };
}

/** @param {string} output */
function validatePdfMetadata(output) {
  assertPublicTextSafe(output, 'PDF metadata');
  const sensitiveFields = ['Author', 'Subject', 'Keywords'];
  for (const field of sensitiveFields) {
    const match = new RegExp(`^${field}:\\s*(.+)$`, 'm').exec(output);
    if (match && match[1]?.trim() && match[1].trim() !== 'AI Speeds') {
      throw new Error(`Generated PDF has an unexpected ${field} metadata value`);
    }
  }
}

/** @param {string} directory @returns {Promise<string[]>} */
async function listRasterPages(directory) {
  const names = await readdir(directory);
  const numbered = names
    .map(name => {
      const match = /^page-(\d+)\.png$/.exec(name);
      return match ? { name, number: Number(match[1]) } : undefined;
    })
    .filter(value => value !== undefined)
    .sort((left, right) => left.number - right.number);
  if (numbered.length !== expectedSlideCount) {
    throw new Error(`Expected ${expectedSlideCount} rasterized pages; received ${numbered.length}`);
  }
  for (let index = 0; index < numbered.length; index += 1) {
    if (numbered[index]?.number !== index + 1) {
      throw new Error(`Rasterized PDF pages are missing or out of order at physical page ${index + 1}`);
    }
  }
  return numbered.map(value => join(directory, value.name));
}

/** @param {string} cwebp @param {string} input @param {string} output @param {number} width @param {number} height @param {number} quality */
async function convertWebp(cwebp, input, output, width, height, quality) {
  await runCommand(
    cwebp,
    [
      '-quiet',
      '-mt',
      '-preset',
      'text',
      '-m',
      '6',
      '-q',
      String(quality),
      '-alpha_q',
      '100',
      '-sharp_yuv',
      '-metadata',
      'none',
      '-resize',
      String(width),
      String(height),
      input,
      '-o',
      output,
    ],
    `WebP conversion for ${basename(output)}`,
  );
  await validateWebp(output, width, height);
}

/** @param {string} key @returns {{mimeType: string, contentDisposition: string}} */
function payloadHttpMetadata(key) {
  const fileName = basename(key);
  if (key.endsWith('.webp')) {
    return { mimeType: 'image/webp', contentDisposition: `inline; filename="${fileName}"` };
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
  throw new Error(`No HTTP metadata policy for payload: ${key}`);
}

/** @param {string} stageDirectory @param {string} key @param {{slideNumber?: number, width?: number, height?: number}} image */
async function createPayloadEntry(stageDirectory, key, image = {}) {
  const path = join(stageDirectory, ...key.split('/'));
  await requireFile(path);
  const details = await stat(path);
  if (details.size <= 0) {
    throw new Error(`Generated payload is empty: ${key}`);
  }
  const metadata = payloadHttpMetadata(key);
  /** @type {PayloadEntry} */
  const payload = {
    key,
    size: details.size,
    sha256: await sha256File(path),
    mimeType: metadata.mimeType,
    cacheControl: immutableCacheControl,
    contentDisposition: metadata.contentDisposition,
  };
  if (image.slideNumber !== undefined) {
    payload.slideNumber = image.slideNumber;
  }
  if (image.width !== undefined) {
    payload.width = image.width;
  }
  if (image.height !== undefined) {
    payload.height = image.height;
  }
  return payload;
}

/** @param {string} root @returns {Promise<string[]>} */
async function listFilesRecursively(root) {
  /** @type {string[]} */
  const output = [];
  /** @param {string} directory */
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile()) {
        output.push(relative(root, absolute).split(sep).join('/'));
      } else {
        throw new Error(`Generated staging contains a non-regular entry: ${entry.name}`);
      }
    }
  }
  await visit(root);
  return output.sort();
}

/** @param {UnknownRecord} sanitizerResult @returns {UnknownRecord} */
function sanitizerManifestSummary(sanitizerResult) {
  const removed = requireRecord(sanitizerResult['removed'], 'Sanitizer removed summary');
  const requiredBoolean = sanitizerResult['validated'];
  if (requiredBoolean !== true) {
    throw new Error('Sanitizer did not report successful validation');
  }
  const slideCount = sanitizerResult['slideCount'];
  const slidesWithOriginalNotes = sanitizerResult['slidesWithOriginalNotes'];
  const originalLocalPathCount = sanitizerResult['originalLocalPathCount'];
  if (
    slideCount !== expectedSlideCount ||
    !Number.isInteger(slidesWithOriginalNotes) ||
    !Number.isInteger(originalLocalPathCount)
  ) {
    throw new Error('Sanitizer returned invalid counts');
  }
  return {
    status: 'passed',
    implementation: 'python-stdlib-zip-xml',
    physicalSlideCount: slideCount,
    slidesWithOriginalNotes,
    originalLocalPathCount,
    speakerNotesRemoved: true,
    commentsRejected: true,
    hiddenSlidesRejected: true,
    externalRelationshipsRejected: true,
    activeContentRejected: true,
    documentPropertiesSanitized: true,
    zipTimestampsNormalized: true,
    removed,
  };
}

/** @param {unknown} cause @returns {boolean} */
function isMissingPathError(cause) {
  return isRecord(cause) && cause['code'] === 'ENOENT';
}

/** @param {string} output */
async function assertSafeStagingOutput(output) {
  const stagingRoot = resolve(repoRoot, 'dist', 'shares');
  const normalizedOutput = resolve(output);
  const requiredOutput = resolve(stagingRoot, slug, version);
  if (normalizedOutput !== requiredOutput) {
    throw new Error(`--output must be exactly ${displayPath(requiredOutput)}`);
  }
  const outputRelative = relative(stagingRoot, normalizedOutput);
  if (
    !outputRelative ||
    outputRelative === '..' ||
    outputRelative.startsWith(`..${sep}`) ||
    isAbsolute(outputRelative)
  ) {
    throw new Error('The public staging directory must be a descendant of dist/shares');
  }
  const segments = outputRelative.split(sep);
  if (segments[0] === '.work') {
    throw new Error('The public staging directory cannot be inside dist/shares/.work');
  }

  let current = repoRoot;
  for (const segment of ['dist', 'shares', ...segments]) {
    current = join(current, segment);
    let details;
    try {
      details = await lstat(current);
    } catch (cause) {
      if (isMissingPathError(cause)) {
        break;
      }
      throw new Error(`Unable to inspect staging path component: ${displayPath(current)}`, { cause });
    }
    if (details.isSymbolicLink()) {
      throw new Error(`Staging path must not contain symbolic links: ${displayPath(current)}`);
    }
    if (!details.isDirectory()) {
      throw new Error(`Staging path component is not a directory: ${displayPath(current)}`);
    }
  }
}

/** @param {CliOptions} options @param {Executables} executables */
async function prepare(options, executables) {
  await requireFile(options.source);
  await assertSafeStagingOutput(options.output);
  const actualSourceSha256 = await sha256File(options.source);
  if (actualSourceSha256 !== expectedSourceSha256) {
    throw new Error(`Authoritative source SHA-256 mismatch: received ${actualSourceSha256}`);
  }
  if (
    options.output === resolve(repoRoot, 'dist', 'shares', '.work') ||
    options.output.startsWith(`${resolve(repoRoot, 'dist', 'shares', '.work')}${sep}`)
  ) {
    throw new Error('The public staging directory cannot be inside dist/shares/.work');
  }
  if (await pathExists(options.output)) {
    if (!options.force) {
      throw new Error(
        `Staging already exists: ${displayPath(options.output)}; pass --force to replace generated assets`,
      );
    }
    await rm(options.output, { recursive: true, force: true });
  }

  const workRoot = resolve(repoRoot, 'dist', 'shares', '.work');
  const runDirectory = join(workRoot, `${slug}-${version}-${process.pid}`);
  const stageDirectory = join(runDirectory, 'stage');
  const rasterDirectory = join(runDirectory, 'raster');
  const libreOfficeOutputDirectory = join(runDirectory, 'libreoffice-output');
  const libreOfficeProfileDirectory = join(runDirectory, 'libreoffice-profile');
  const reviewReport = join(workRoot, `${slug}-${version}-sanitizer-review.json`);
  await rm(runDirectory, { recursive: true, force: true });
  await mkdir(join(stageDirectory, 'slides'), { recursive: true });
  await mkdir(join(stageDirectory, 'thumbnails'), { recursive: true });
  await mkdir(rasterDirectory, { recursive: true });
  await mkdir(libreOfficeOutputDirectory, { recursive: true });
  await mkdir(libreOfficeProfileDirectory, { recursive: true });

  try {
    const sanitizerPath = resolve(repoRoot, 'scripts', 'sanitize-share-pptx.py');
    const sanitizedPptx = join(stageDirectory, 'source.pptx');
    const sanitizerExecution = await runCommand(
      executables.python,
      [
        sanitizerPath,
        '--input',
        options.source,
        '--output',
        sanitizedPptx,
        '--report',
        reviewReport,
        '--expected-sha256',
        expectedSourceSha256,
        '--expected-slides',
        String(expectedSlideCount),
        '--force',
      ],
      'PPTX sanitization',
      repoRoot,
    );
    let sanitizerResultValue;
    try {
      sanitizerResultValue = JSON.parse(sanitizerExecution.stdout);
    } catch (cause) {
      throw new Error('Sanitizer returned invalid JSON', { cause });
    }
    const sanitizerResult = requireRecord(sanitizerResultValue, 'Sanitizer result');
    const sanitizedSha256 = requireString(sanitizerResult, 'sanitizedSha256', 'Sanitizer result');
    const sanitizerSummary = sanitizerManifestSummary(sanitizerResult);

    const libreOfficeProfileUrl = pathToFileURL(`${libreOfficeProfileDirectory}${sep}`).href;
    await runCommand(
      executables.soffice,
      [
        '--headless',
        '--nologo',
        '--nodefault',
        '--nolockcheck',
        '--nofirststartwizard',
        `-env:UserInstallation=${libreOfficeProfileUrl}`,
        '--convert-to',
        'pdf:impress_pdf_Export',
        '--outdir',
        libreOfficeOutputDirectory,
        sanitizedPptx,
      ],
      'LibreOffice PDF export',
      repoRoot,
    );
    const convertedPdf = join(libreOfficeOutputDirectory, 'source.pdf');
    await requireFile(convertedPdf);
    const deckPdf = join(stageDirectory, 'deck.pdf');
    await rename(convertedPdf, deckPdf);
    const pdfInspection = await runCommand(executables.pdfinfo, [deckPdf], 'PDF inspection');
    const pdfInfo = parsePdfInfo(pdfInspection.stdout);
    validatePdfMetadata(pdfInspection.stdout);
    if (pdfInfo.pages !== expectedSlideCount) {
      throw new Error(`Fresh PDF has ${pdfInfo.pages} pages; expected ${expectedSlideCount}`);
    }
    const aspectRatio = pdfInfo.widthPoints / pdfInfo.heightPoints;
    if (Math.abs(aspectRatio - 16 / 9) > 0.002) {
      throw new Error(`Fresh PDF page ratio is ${aspectRatio.toFixed(6)}; expected 16:9`);
    }

    await runCommand(
      executables.pdftoppm,
      [
        '-f',
        '1',
        '-l',
        String(expectedSlideCount),
        '-png',
        '-scale-to-x',
        String(slideWidth),
        '-scale-to-y',
        String(slideHeight),
        deckPdf,
        join(rasterDirectory, 'page'),
      ],
      'PDF rasterization',
    );
    const rasterPages = await listRasterPages(rasterDirectory);
    await mapConcurrent(rasterPages, options.concurrency, async (input, index) => {
      const number = String(index + 1).padStart(3, '0');
      await convertWebp(
        executables.cwebp,
        input,
        join(stageDirectory, 'slides', `${number}.webp`),
        slideWidth,
        slideHeight,
        90,
      );
      await convertWebp(
        executables.cwebp,
        input,
        join(stageDirectory, 'thumbnails', `${number}.webp`),
        thumbnailWidth,
        thumbnailHeight,
        82,
      );
    });
    const firstRaster = rasterPages[0];
    if (!firstRaster) {
      throw new Error('Rasterization did not produce a cover source');
    }
    await convertWebp(executables.cwebp, firstRaster, join(stageDirectory, 'cover.webp'), coverWidth, coverHeight, 90);

    const registryContent = await loadRegistryTranscript(options.registry);
    const transcript = renderTranscript(registryContent.share, registryContent.slides);
    await writeFile(join(stageDirectory, 'transcript.md'), transcript, 'utf8');

    /** @type {PayloadEntry[]} */
    const payloads = [];
    for (let slideNumber = 1; slideNumber <= expectedSlideCount; slideNumber += 1) {
      const number = String(slideNumber).padStart(3, '0');
      payloads.push(
        await createPayloadEntry(stageDirectory, `slides/${number}.webp`, {
          slideNumber,
          width: slideWidth,
          height: slideHeight,
        }),
      );
    }
    for (let slideNumber = 1; slideNumber <= expectedSlideCount; slideNumber += 1) {
      const number = String(slideNumber).padStart(3, '0');
      payloads.push(
        await createPayloadEntry(stageDirectory, `thumbnails/${number}.webp`, {
          slideNumber,
          width: thumbnailWidth,
          height: thumbnailHeight,
        }),
      );
    }
    payloads.push(
      await createPayloadEntry(stageDirectory, 'cover.webp', { width: coverWidth, height: coverHeight }),
      await createPayloadEntry(stageDirectory, 'deck.pdf'),
      await createPayloadEntry(stageDirectory, 'source.pptx'),
      await createPayloadEntry(stageDirectory, 'transcript.md'),
    );
    if (payloads.length !== expectedPayloadCount) {
      throw new Error(`Payload invariant failed: expected ${expectedPayloadCount}, received ${payloads.length}`);
    }
    const payloadKeys = new Set(payloads.map(payload => payload.key));
    if (payloadKeys.size !== expectedPayloadCount) {
      throw new Error('Generated payload keys are not unique');
    }
    const filesBeforeManifest = await listFilesRecursively(stageDirectory);
    if (filesBeforeManifest.length !== expectedPayloadCount || filesBeforeManifest.some(key => !payloadKeys.has(key))) {
      throw new Error('Staging contains missing or unexpected files before manifest creation');
    }

    const manifest = {
      schemaVersion: 1,
      slug,
      version,
      objectPrefix: `shares/${slug}/${version}`,
      publicBaseUrl: `https://assets.aispeeds.me/shares/${slug}/${version}`,
      generatedAt: new Date().toISOString(),
      sealed: false,
      source: {
        fileName: basename(options.source),
        sha256: expectedSourceSha256,
        sanitizedSha256,
      },
      deck: {
        slideCount: expectedSlideCount,
        width: slideWidth,
        height: slideHeight,
        format: 'webp',
        thumbnailWidth,
        thumbnailHeight,
        coverWidth,
        coverHeight,
        pdfPageCount: pdfInfo.pages,
      },
      sanitizer: sanitizerSummary,
      payloadCount: payloads.length,
      totalObjectCount: payloads.length + 1,
      totalPayloadBytes: payloads.reduce((sum, payload) => sum + payload.size, 0),
      payloads,
    };
    const serializedManifest = `${JSON.stringify(manifest, undefined, 2)}\n`;
    assertPublicTextSafe(serializedManifest, 'Manifest');
    await writeFile(join(stageDirectory, manifestFileName), serializedManifest, { encoding: 'utf8', flag: 'wx' });
    const finalFiles = await listFilesRecursively(stageDirectory);
    if (finalFiles.length !== expectedPayloadCount + 1 || !finalFiles.includes(manifestFileName)) {
      throw new Error('Final staging must contain exactly 84 payloads and one manifest');
    }
    await mkdir(dirname(options.output), { recursive: true });
    await rename(stageDirectory, options.output);
    log(
      `Prepared ${payloads.length} payloads (${manifest.totalPayloadBytes} bytes) and manifest at ${displayPath(options.output)}`,
    );
    log(`Private sanitizer review: ${displayPath(reviewReport)}`);
  } finally {
    await rm(runDirectory, { recursive: true, force: true });
  }
}

/** @param {string} path @returns {Promise<boolean>} */
async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const executables = await preflight();
  await prepare(options, executables);
}

main().catch(cause => {
  const message = cause instanceof Error ? cause.message : String(cause);
  error(`prepare-share-assets: ${message}`);
  process.exitCode = 1;
});
