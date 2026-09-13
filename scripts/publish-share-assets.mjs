#!/usr/bin/env node

import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { error, log } from 'node:console';
import { execFile as execFileCallback } from 'node:child_process';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath, URL } from 'node:url';
import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const execFile = promisify(execFileCallback);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bucket = 'assets-aispeeds-me';
const publicOrigin = 'https://assets.aispeeds.me';
const immutableCacheControl = 'public, max-age=31536000, immutable';
const manifestContentType = 'application/json; charset=utf-8';
const manifestContentDisposition = 'inline; filename="manifest.json"';
const expectedPayloadCount = 84;
const expectedObjectCount = 85;
const sha256Pattern = /^[a-f0-9]{64}$/;
const safePrefixPattern = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*){2,}$/;
const safeKeyPattern = /^[a-z0-9][a-z0-9._/-]*$/;
const publicBodyVerificationKeys = new Set([
  'manifest.json',
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

/** @typedef {Record<string, unknown>} UnknownRecord */
/**
 * @typedef {object} CliOptions
 * @property {string} stagingDirectory
 * @property {string | undefined} prefix
 * @property {string | undefined} publicBaseUrl
 * @property {boolean} apply
 * @property {boolean} resume
 * @property {number} concurrency
 * @property {number} timeoutMs
 */
/**
 * @typedef {object} Payload
 * @property {string} key
 * @property {number} size
 * @property {string} sha256
 * @property {string} mimeType
 * @property {string} cacheControl
 * @property {string} contentDisposition
 */
/**
 * @typedef {object} PublishManifest
 * @property {UnknownRecord} raw
 * @property {string} slug
 * @property {string} version
 * @property {string} objectPrefix
 * @property {string} publicBaseUrl
 * @property {boolean} sealed
 * @property {number} payloadCount
 * @property {number} totalObjectCount
 * @property {Payload[]} payloads
 */
/**
 * @typedef {object} ExpectedObject
 * @property {string} relativeKey
 * @property {string} objectKey
 * @property {string} path
 * @property {number} size
 * @property {string} sha256
 * @property {string} contentType
 * @property {string} cacheControl
 * @property {string} contentDisposition
 * @property {boolean} manifest
 */

function usage() {
  return [
    'Usage: node scripts/publish-share-assets.mjs [options]',
    '',
    'Dry-run is the default. No network calls or credentials are used without --apply.',
    '',
    'Options:',
    '  --staging <directory>         prepared local staging directory',
    '  --prefix <prefix>             assert the exact manifest object prefix',
    '  --public-base-url <https-url> assert the exact manifest public URL',
    '  --concurrency <1-8>           upload/verification concurrency (default: 4)',
    '  --timeout-ms <1000-120000>    request timeout (default: 30000)',
    '  --apply                       perform immutable uploads',
    '  --resume                      with --apply, skip exact existing payloads',
    '  --help',
    '',
    'Required only with --apply: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.',
  ].join('\n');
}

/** @param {string[]} arguments_ @returns {CliOptions} */
function parseArguments(arguments_) {
  /** @type {CliOptions} */
  const options = {
    stagingDirectory: resolve(repoRoot, 'dist', 'shares', 'agent-native-product-ai-maker-shanghai', 'v4'),
    prefix: undefined,
    publicBaseUrl: undefined,
    apply: false,
    resume: false,
    concurrency: 4,
    timeoutMs: 30_000,
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
    if (argument === '--apply') {
      options.apply = true;
      continue;
    }
    if (argument === '--resume') {
      options.resume = true;
      continue;
    }
    if (
      argument === '--staging' ||
      argument === '--prefix' ||
      argument === '--public-base-url' ||
      argument === '--concurrency' ||
      argument === '--timeout-ms'
    ) {
      const value = arguments_[index + 1];
      if (!value) {
        throw new Error(`Missing value for ${argument}`);
      }
      index += 1;
      if (argument === '--staging') {
        options.stagingDirectory = resolve(process.cwd(), value);
      } else if (argument === '--prefix') {
        options.prefix = value.replace(/^\/+|\/+$/g, '');
      } else if (argument === '--public-base-url') {
        options.publicBaseUrl = value.replace(/\/+$/, '');
      } else if (argument === '--concurrency') {
        options.concurrency = Number(value);
      } else {
        options.timeoutMs = Number(value);
      }
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  if (options.resume && !options.apply) {
    throw new Error('--resume is only valid with --apply');
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 8) {
    throw new Error('--concurrency must be an integer from 1 through 8');
  }
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 1_000 || options.timeoutMs > 120_000) {
    throw new Error('--timeout-ms must be an integer from 1000 through 120000');
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

/** @param {UnknownRecord} record @param {string} key @param {string} label @returns {string} */
function requireString(record, key, label) {
  const value = record[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label}.${key} must be a non-empty string`);
  }
  return value.trim();
}

/** @param {UnknownRecord} record @param {string} key @param {string} label @param {number} minimum @returns {number} */
function requireInteger(record, key, label, minimum) {
  const value = record[key];
  if (!Number.isInteger(value) || typeof value !== 'number' || value < minimum) {
    throw new Error(`${label}.${key} must be an integer of at least ${minimum}`);
  }
  return value;
}

/** @param {string} value @param {string} label @returns {URL} */
function parseHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch (cause) {
    throw new Error(`${label} must be a valid URL`, { cause });
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error(`${label} must be a plain HTTPS URL without credentials, query, or fragment`);
  }
  return url;
}

/** @param {string} prefix @param {string} slug @param {string} version */
function validatePrefix(prefix, slug, version) {
  if (
    prefix.length > 512 ||
    !safePrefixPattern.test(prefix) ||
    prefix.includes('//') ||
    prefix.split('/').some(segment => segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe R2 object prefix: ${prefix}`);
  }
  if (!prefix.endsWith(`/${slug}/${version}`) && prefix !== `${slug}/${version}`) {
    throw new Error(`R2 object prefix must end with /${slug}/${version}`);
  }
}

/** @param {unknown} value @param {number} index @returns {Payload} */
function parsePayload(value, index) {
  const record = requireRecord(value, `manifest.payloads[${index}]`);
  const key = requireString(record, 'key', `manifest.payloads[${index}]`);
  if (
    !safeKeyPattern.test(key) ||
    key.startsWith('/') ||
    key.endsWith('/') ||
    key.includes('//') ||
    key.split('/').some(segment => segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe payload key in manifest: ${key}`);
  }
  const size = requireInteger(record, 'size', `manifest payload ${key}`, 1);
  const sha256 = requireString(record, 'sha256', `manifest payload ${key}`);
  if (!sha256Pattern.test(sha256)) {
    throw new Error(`Invalid SHA-256 for manifest payload ${key}`);
  }
  const mimeType = requireString(record, 'mimeType', `manifest payload ${key}`);
  const cacheControl = requireString(record, 'cacheControl', `manifest payload ${key}`);
  const contentDisposition = requireString(record, 'contentDisposition', `manifest payload ${key}`);
  if (cacheControl !== immutableCacheControl) {
    throw new Error(`Manifest payload ${key} must use immutable cache control`);
  }
  return { key, size, sha256, mimeType, cacheControl, contentDisposition };
}

/** @param {unknown} value @returns {PublishManifest} */
function parseManifest(value) {
  const record = requireRecord(value, 'manifest');
  if (record['schemaVersion'] !== 1) {
    throw new Error('Unsupported manifest schemaVersion');
  }
  const slug = requireString(record, 'slug', 'manifest');
  const version = requireString(record, 'version', 'manifest');
  const objectPrefix = requireString(record, 'objectPrefix', 'manifest');
  validatePrefix(objectPrefix, slug, version);
  const publicBaseUrl = requireString(record, 'publicBaseUrl', 'manifest').replace(/\/+$/, '');
  parseHttpsUrl(publicBaseUrl, 'manifest.publicBaseUrl');
  const sealed = record['sealed'];
  if (typeof sealed !== 'boolean') {
    throw new Error('manifest.sealed must be a boolean');
  }
  if (sealed) {
    throw new Error('Refusing a sealed local manifest');
  }
  const payloadCount = requireInteger(record, 'payloadCount', 'manifest', 1);
  const totalObjectCount = requireInteger(record, 'totalObjectCount', 'manifest', 2);
  if (!Array.isArray(record['payloads'])) {
    throw new Error('manifest.payloads must be an array');
  }
  const payloads = record['payloads'].map(parsePayload);
  if (payloadCount !== payloads.length || totalObjectCount !== payloadCount + 1) {
    throw new Error('Manifest object counts are inconsistent');
  }
  const keys = new Set(payloads.map(payload => payload.key));
  if (keys.size !== payloads.length) {
    throw new Error('Manifest payload keys must be unique');
  }
  return { raw: record, slug, version, objectPrefix, publicBaseUrl, sealed, payloadCount, totalObjectCount, payloads };
}

/** @param {string} path @returns {Promise<string>} */
async function sha256File(path) {
  return createHash('sha256')
    .update(await readFile(path))
    .digest('hex');
}

/** @param {Uint8Array} value @returns {string} */
function sha256Bytes(value) {
  return createHash('sha256').update(value).digest('hex');
}

/** @param {string} path @returns {string} */
function displayPath(path) {
  const projectRelative = relative(repoRoot, path);
  if (projectRelative && projectRelative !== '..' && !projectRelative.startsWith(`..${sep}`)) {
    return projectRelative.split(sep).join('/');
  }
  return basename(path);
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
        throw new Error(`Staging contains a non-regular entry: ${entry.name}`);
      }
    }
  }
  await visit(root);
  return output.sort();
}

/** @param {string} stagingDirectory @returns {Promise<{manifest: PublishManifest, manifestBytes: Buffer, objects: ExpectedObject[]}>} */
async function loadAndValidateStaging(stagingDirectory) {
  const manifestPath = join(stagingDirectory, 'manifest.json');
  await access(manifestPath);
  const manifestBytes = await readFile(manifestPath);
  let parsed;
  try {
    parsed = JSON.parse(manifestBytes.toString('utf8'));
  } catch (cause) {
    throw new Error('Staging manifest.json is invalid JSON', { cause });
  }
  const manifest = parseManifest(parsed);
  const files = await listFilesRecursively(stagingDirectory);
  const expectedFiles = [...manifest.payloads.map(payload => payload.key), 'manifest.json'].sort();
  if (files.length !== expectedFiles.length || files.some((file, index) => file !== expectedFiles[index])) {
    throw new Error('Staging contains files outside the manifest whitelist or is missing expected files');
  }
  /** @type {ExpectedObject[]} */
  const objects = [];
  for (const payload of manifest.payloads) {
    const path = join(stagingDirectory, ...payload.key.split('/'));
    const details = await stat(path);
    if (!details.isFile() || details.size !== payload.size) {
      throw new Error(`Payload size mismatch: ${payload.key}`);
    }
    const sha256 = await sha256File(path);
    if (sha256 !== payload.sha256) {
      throw new Error(`Payload SHA-256 mismatch: ${payload.key}`);
    }
    objects.push({
      relativeKey: payload.key,
      objectKey: '',
      path,
      size: payload.size,
      sha256: payload.sha256,
      contentType: payload.mimeType,
      cacheControl: payload.cacheControl,
      contentDisposition: payload.contentDisposition,
      manifest: false,
    });
  }
  objects.push({
    relativeKey: 'manifest.json',
    objectKey: '',
    path: manifestPath,
    size: manifestBytes.byteLength,
    sha256: sha256Bytes(manifestBytes),
    contentType: manifestContentType,
    cacheControl: immutableCacheControl,
    contentDisposition: manifestContentDisposition,
    manifest: true,
  });
  return { manifest, manifestBytes, objects };
}

/** @param {CliOptions} options @param {PublishManifest} manifest */
async function runStrictLocalValidator(options, manifest) {
  try {
    await execFile(
      process.execPath,
      [
        resolve(repoRoot, 'scripts', 'validate-share-assets.ts'),
        '--mode',
        'local',
        '--slug',
        manifest.slug,
        '--version',
        manifest.version,
        '--staging',
        options.stagingDirectory,
      ],
      { cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
    );
  } catch (cause) {
    const details = isRecord(cause) && typeof cause['stderr'] === 'string' ? cause['stderr'].trim() : '';
    throw new Error(`Strict local asset validation failed${details ? `: ${details}` : ''}`, { cause });
  }
}

/** @param {string} name @returns {string} */
function requireEnvironment(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** @param {unknown} cause @returns {boolean} */
function isNotFound(cause) {
  if (!isRecord(cause)) {
    return false;
  }
  const metadata = isRecord(cause['$metadata']) ? cause['$metadata'] : undefined;
  const status = metadata?.['httpStatusCode'];
  const name = typeof cause['name'] === 'string' ? cause['name'] : '';
  return status === 404 || name === 'NotFound' || name === 'NoSuchKey';
}

/** @param {S3Client} client @param {string} key @param {number} timeoutMs */
async function headObject(client, key, timeoutMs) {
  try {
    return await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key, ChecksumMode: 'ENABLED' }), {
      abortSignal: globalThis.AbortSignal.timeout(timeoutMs),
    });
  } catch (cause) {
    if (isNotFound(cause)) {
      return undefined;
    }
    throw new Error(`Authenticated HEAD failed for ${key}`, { cause });
  }
}

/** @param {string | null | undefined} value @returns {string} */
function normalizeHeader(value) {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

/** @param {Awaited<ReturnType<typeof headObject>>} head @param {ExpectedObject} expected @returns {boolean} */
function authenticatedHeadMetadataMatches(head, expected) {
  if (!head) {
    return false;
  }
  return (
    head.ContentLength === expected.size &&
    normalizeHeader(head.ContentType) === normalizeHeader(expected.contentType) &&
    normalizeHeader(head.CacheControl) === normalizeHeader(expected.cacheControl) &&
    normalizeHeader(head.ContentDisposition) === normalizeHeader(expected.contentDisposition) &&
    head.Metadata?.['sha256'] === expected.sha256
  );
}

/** @param {S3Client} client @param {ExpectedObject} expected @param {number} timeoutMs @returns {Promise<boolean>} */
async function authenticatedGetMatches(client, expected, timeoutMs) {
  let response;
  try {
    response = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: expected.objectKey, ChecksumMode: 'ENABLED' }),
      { abortSignal: globalThis.AbortSignal.timeout(timeoutMs) },
    );
  } catch (cause) {
    if (isNotFound(cause)) {
      return false;
    }
    throw new Error(`Authenticated GET failed for ${expected.objectKey}`, { cause });
  }
  if (!response.Body || typeof response.Body.transformToByteArray !== 'function') {
    throw new Error(`Authenticated GET returned an unreadable body for ${expected.objectKey}`);
  }
  const body = Buffer.from(await response.Body.transformToByteArray());
  return body.byteLength === expected.size && sha256Bytes(body) === expected.sha256;
}

/** @param {S3Client} client @param {Awaited<ReturnType<typeof headObject>>} head @param {ExpectedObject} expected @param {number} timeoutMs @returns {Promise<boolean>} */
async function authenticatedObjectMatches(client, head, expected, timeoutMs) {
  if (!authenticatedHeadMetadataMatches(head, expected)) {
    return false;
  }
  const expectedChecksum = Buffer.from(expected.sha256, 'hex').toString('base64');
  if (head?.ChecksumSHA256) {
    return head.ChecksumSHA256 === expectedChecksum;
  }
  return authenticatedGetMatches(client, expected, timeoutMs);
}

/** @template T @param {T[]} values @param {number} concurrency @param {(value: T, index: number) => Promise<void>} worker */
async function mapConcurrent(values, concurrency, worker) {
  let nextIndex = 0;
  async function consume() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      const value = values[index];
      if (value === undefined) {
        throw new Error('Concurrent publish queue returned an undefined item');
      }
      await worker(value, index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => consume()));
}

/** @param {S3Client} client @param {string} prefix @param {number} timeoutMs @returns {Promise<Set<string>>} */
async function listPrefixKeys(client, prefix, timeoutMs) {
  const keys = new Set();
  let continuationToken;
  do {
    let response;
    try {
      response = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: `${prefix}/`,
          ContinuationToken: continuationToken,
          MaxKeys: 1_000,
        }),
        { abortSignal: globalThis.AbortSignal.timeout(timeoutMs) },
      );
    } catch (cause) {
      throw new Error(`Authenticated prefix listing failed for ${prefix}`, { cause });
    }
    for (const object of response.Contents ?? []) {
      if (!object.Key) {
        throw new Error(`Authenticated prefix listing returned an object without a key for ${prefix}`);
      }
      keys.add(object.Key);
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    if (response.IsTruncated && !continuationToken) {
      throw new Error(`Authenticated prefix listing was truncated without a continuation token for ${prefix}`);
    }
  } while (continuationToken);
  return keys;
}

/** @param {Set<string>} actual @param {Set<string>} allowed @param {string} label */
function assertNoUnexpectedKeys(actual, allowed, label) {
  const unexpected = [...actual].filter(key => !allowed.has(key)).sort();
  if (unexpected.length > 0) {
    throw new Error(`${label} contains unexpected object keys: ${unexpected.join(', ')}`);
  }
}

/** @param {Set<string>} actual @param {Set<string>} expected @param {string} label */
function assertExactKeys(actual, expected, label) {
  assertNoUnexpectedKeys(actual, expected, label);
  const missing = [...expected].filter(key => !actual.has(key)).sort();
  if (missing.length > 0 || actual.size !== expected.size) {
    throw new Error(`${label} is missing expected object keys: ${missing.join(', ')}`);
  }
}

/** @param {S3Client} client @param {string} prefix @param {ExpectedObject[]} payloads @param {ExpectedObject} manifestObject @param {CliOptions} options @returns {Promise<Set<string>>} */
async function authenticatedPreflight(client, prefix, payloads, manifestObject, options) {
  const listedKeys = await listPrefixKeys(client, prefix, options.timeoutMs);
  const manifestHead = await headObject(client, manifestObject.objectKey, options.timeoutMs);
  if (manifestHead || listedKeys.has(manifestObject.objectKey)) {
    throw new Error(
      `Remote manifest already exists; prefix is sealed and will not be modified: ${manifestObject.objectKey}`,
    );
  }
  const payloadKeys = new Set(payloads.map(payload => payload.objectKey));
  assertNoUnexpectedKeys(listedKeys, payloadKeys, 'Remote prefix preflight');
  if (!options.resume && listedKeys.size > 0) {
    throw new Error('Remote prefix is not empty; use explicit --resume only for exact matching payloads');
  }

  const exactExisting = new Set();
  await mapConcurrent(payloads, options.concurrency, async expected => {
    const head = await headObject(client, expected.objectKey, options.timeoutMs);
    if (!head) {
      return;
    }
    if (!(await authenticatedObjectMatches(client, head, expected, options.timeoutMs))) {
      throw new Error(`Remote object differs from the manifest and will not be overwritten: ${expected.objectKey}`);
    }
    if (!options.resume) {
      throw new Error(
        `Remote object already exists; rerun with explicit --resume only if exact-match resume is intended: ${expected.objectKey}`,
      );
    }
    exactExisting.add(expected.objectKey);
  });
  return exactExisting;
}

/** @param {S3Client} client @param {ExpectedObject} expected @param {number} timeoutMs */
async function putObject(client, expected, timeoutMs) {
  const body = await readFile(expected.path);
  if (body.byteLength !== expected.size || sha256Bytes(body) !== expected.sha256) {
    throw new Error(`Payload changed after preflight: ${expected.relativeKey}`);
  }
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: expected.objectKey,
        Body: body,
        ContentLength: expected.size,
        ContentType: expected.contentType,
        CacheControl: expected.cacheControl,
        ContentDisposition: expected.contentDisposition,
        ChecksumSHA256: Buffer.from(expected.sha256, 'hex').toString('base64'),
        Metadata: { sha256: expected.sha256 },
        IfNoneMatch: '*',
      }),
      { abortSignal: globalThis.AbortSignal.timeout(timeoutMs) },
    );
  } catch (cause) {
    throw new Error(`Immutable upload failed for ${expected.objectKey}; no objects were deleted`, { cause });
  }
}

/** @param {S3Client} client @param {ExpectedObject[]} objects @param {CliOptions} options */
async function verifyAuthenticated(client, objects, options) {
  await mapConcurrent(objects, options.concurrency, async expected => {
    const head = await headObject(client, expected.objectKey, options.timeoutMs);
    if (!(await authenticatedObjectMatches(client, head, expected, options.timeoutMs))) {
      throw new Error(`Authenticated verification failed for ${expected.objectKey}`);
    }
  });
}

/** @param {string} url @param {RequestInit} init @param {number} timeoutMs @returns {Promise<Response>} */
async function fetchWithTimeout(url, init, timeoutMs) {
  const headers = new globalThis.Headers(init.headers);
  headers.set('accept-encoding', 'identity');
  const response = await globalThis.fetch(url, {
    ...init,
    headers,
    signal: globalThis.AbortSignal.timeout(timeoutMs),
    redirect: 'manual',
  });
  if (response.headers.has('content-encoding')) {
    throw new Error('Public asset response used unexpected Content-Encoding');
  }
  return response;
}

/** @param {number} milliseconds */
async function delay(milliseconds) {
  await new Promise(resolveDelay => globalThis.setTimeout(resolveDelay, milliseconds));
}

/** @param {string} url @param {ExpectedObject} expected @param {number} timeoutMs @param {boolean} getBody */
async function verifyPublicObjectOnce(url, expected, timeoutMs, getBody) {
  const response = await fetchWithTimeout(url, { method: getBody ? 'GET' : 'HEAD', cache: 'no-store' }, timeoutMs);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const contentLength = Number(response.headers.get('content-length'));
  if (contentLength !== expected.size) {
    throw new Error('incorrect Content-Length');
  }
  if (normalizeHeader(response.headers.get('content-type')) !== normalizeHeader(expected.contentType)) {
    throw new Error('incorrect Content-Type');
  }
  if (normalizeHeader(response.headers.get('cache-control')) !== normalizeHeader(expected.cacheControl)) {
    throw new Error('incorrect Cache-Control');
  }
  if (normalizeHeader(response.headers.get('content-disposition')) !== normalizeHeader(expected.contentDisposition)) {
    throw new Error('incorrect Content-Disposition');
  }
  // R2 custom domains may omit S3 custom metadata; authenticated verification remains authoritative.
  const publicSha256Metadata = response.headers.get('x-amz-meta-sha256');
  if (publicSha256Metadata !== null && publicSha256Metadata !== expected.sha256) {
    throw new Error('incorrect SHA-256 object metadata');
  }
  if (getBody) {
    const body = new Uint8Array(await response.arrayBuffer());
    if (body.byteLength !== expected.size || sha256Bytes(body) !== expected.sha256) {
      throw new Error('public body hash mismatch');
    }
  }
}

/** @param {string} url @param {ExpectedObject} expected @param {number} timeoutMs */
async function verifyPublicObject(url, expected, timeoutMs) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      await verifyPublicObjectOnce(url, expected, timeoutMs, publicBodyVerificationKeys.has(expected.relativeKey));
      return;
    } catch (cause) {
      lastError = cause;
      if (attempt < 5) {
        await delay(attempt * 1_000);
      }
    }
  }
  const detail = lastError instanceof Error ? `: ${lastError.message}` : '';
  throw new Error(`Public verification failed for ${expected.objectKey}${detail}`, { cause: lastError });
}

/** @param {ExpectedObject[]} objects @param {string} publicBaseUrl @param {CliOptions} options */
async function verifyPublic(objects, publicBaseUrl, options) {
  await mapConcurrent(objects, options.concurrency, async expected => {
    await verifyPublicObject(`${publicBaseUrl}/${expected.relativeKey}`, expected, options.timeoutMs);
  });
}

/** @param {CliOptions} options */
async function publish(options) {
  const staged = await loadAndValidateStaging(options.stagingDirectory);
  await runStrictLocalValidator(options, staged.manifest);
  if (options.prefix !== undefined && options.prefix !== staged.manifest.objectPrefix) {
    throw new Error('--prefix must exactly match manifest.objectPrefix');
  }
  if (options.publicBaseUrl !== undefined && options.publicBaseUrl !== staged.manifest.publicBaseUrl) {
    throw new Error('--public-base-url must exactly match manifest.publicBaseUrl');
  }
  const prefix = staged.manifest.objectPrefix;
  validatePrefix(prefix, staged.manifest.slug, staged.manifest.version);
  const publicBaseUrl = staged.manifest.publicBaseUrl;
  const publicUrl = parseHttpsUrl(publicBaseUrl, '--public-base-url');
  if (publicUrl.origin !== publicOrigin || publicUrl.pathname !== `/${prefix}`) {
    throw new Error(`Public base URL must be exactly ${publicOrigin}/${prefix}`);
  }

  const objects = staged.objects.map(expected => ({
    ...expected,
    objectKey: `${prefix}/${expected.relativeKey}`,
  }));
  const payloads = objects.filter(expected => !expected.manifest);
  const manifestObject = objects.find(expected => expected.manifest);
  if (
    !manifestObject ||
    staged.manifest.payloadCount !== expectedPayloadCount ||
    staged.manifest.totalObjectCount !== expectedObjectCount ||
    payloads.length !== expectedPayloadCount ||
    objects.length !== expectedObjectCount
  ) {
    throw new Error('Manifest object whitelist invariant failed: expected 84 payloads and 85 total objects');
  }

  if (!options.apply) {
    log(`Dry run: validated ${payloads.length} payloads plus manifest from ${displayPath(options.stagingDirectory)}`);
    log(`Target: s3://${bucket}/${prefix}/`);
    log('No credentials were read and no network requests were made. Pass --apply to publish.');
    return;
  }

  const accountId = requireEnvironment('R2_ACCOUNT_ID');
  if (!/^[a-f0-9]{32}$/i.test(accountId)) {
    throw new Error('R2_ACCOUNT_ID must be a 32-character hexadecimal Cloudflare account ID');
  }
  const accessKeyId = requireEnvironment('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnvironment('R2_SECRET_ACCESS_KEY');
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
    maxAttempts: 3,
  });

  try {
    const exactExisting = await authenticatedPreflight(client, prefix, payloads, manifestObject, options);
    const pending = payloads.filter(expected => !exactExisting.has(expected.objectKey));
    await mapConcurrent(pending, options.concurrency, async expected => {
      await putObject(client, expected, options.timeoutMs);
    });
    await verifyAuthenticated(client, payloads, options);
    await verifyPublic(payloads, publicBaseUrl, options);
    assertExactKeys(
      await listPrefixKeys(client, prefix, options.timeoutMs),
      new Set(payloads.map(payload => payload.objectKey)),
      'Remote payload prefix before sealing',
    );
    await putObject(client, manifestObject, options.timeoutMs);
    await verifyAuthenticated(client, objects, options);
    assertExactKeys(
      await listPrefixKeys(client, prefix, options.timeoutMs),
      new Set(objects.map(object => object.objectKey)),
      'Remote sealed prefix',
    );
    await verifyPublic(objects, publicBaseUrl, options);
    log(
      `Published and verified ${payloads.length} payloads plus manifest at ${publicBaseUrl} (${exactExisting.size} resumed)`,
    );
  } finally {
    client.destroy();
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  await publish(options);
}

main().catch(cause => {
  const message = cause instanceof Error ? cause.message : String(cause);
  error(`publish-share-assets: ${message}`);
  process.exitCode = 1;
});
