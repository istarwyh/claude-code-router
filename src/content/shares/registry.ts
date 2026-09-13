import { agentNativeProductAiMakerShanghai } from './agent-native-product-ai-maker-shanghai.ts';
import type { Share, ShareDeck, ShareResource, ShareResourceKind, ShareSlide } from './types.ts';

export const SHARE_ASSET_ORIGIN = 'https://assets.aispeeds.me';

const ENCODED_PATH_CONTROL_PATTERN = /%(?:2e|2f|5c)/i;
const GENERIC_SLIDE_PLACEHOLDERS = ['待补充', '暂无', 'todo', 'tbd'] as const;
const GENERIC_SLIDE_TRAILING_PUNCTUATION = ['。', '.', '!', '！'] as const;

const SENSITIVE_CONTENT_PATTERNS: readonly { label: string; pattern: RegExp }[] = [
  { label: 'macOS 本地路径', pattern: /(?:^|[\s"'(])\/Users\/[^/\s]+/i },
  { label: 'Linux 本地路径', pattern: /(?:^|[\s"'(])\/home\/[^/\s]+/i },
  { label: 'Windows 本地路径', pattern: /[a-z]:\\Users\\/i },
  { label: 'file URL', pattern: /file:\/\//i },
  { label: '私钥', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: '常见 API 凭据', pattern: /\b(?:sk|rk|pk)-(?:live|prod|test)?[a-z0-9_-]{12,}\b/i },
  { label: 'AWS Access Key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: 'R2 凭据变量', pattern: /\bR2_(?:ACCESS_KEY_ID|SECRET_ACCESS_KEY)\b/ },
  { label: 'Bearer 凭据', pattern: /\bBearer\s+[a-z0-9._~-]{12,}\b/i },
];

const registeredShares: readonly Share[] = [agentNativeProductAiMakerShanghai];

export const shares: readonly Share[] = registeredShares;

function isAsciiDigit(character: string): boolean {
  const codePoint = character.codePointAt(0);
  return codePoint !== undefined && codePoint >= 48 && codePoint <= 57;
}

function isAsciiLowercaseLetterOrDigit(character: string): boolean {
  const codePoint = character.codePointAt(0);
  return codePoint !== undefined && ((codePoint >= 48 && codePoint <= 57) || (codePoint >= 97 && codePoint <= 122));
}

function isNonEmptyAsciiDigits(value: string): boolean {
  return value.length > 0 && Array.from(value).every(isAsciiDigit);
}

function isNonEmptyAsciiLowercaseAlphaNumeric(value: string): boolean {
  return value.length > 0 && Array.from(value).every(isAsciiLowercaseLetterOrDigit);
}

function isKebabCaseSlug(value: string): boolean {
  return value.split('-').every(isNonEmptyAsciiLowercaseAlphaNumeric);
}

function hasStrictUtcDateShape(value: string): boolean {
  if (!value.endsWith('Z')) {
    return false;
  }

  const dateTimeParts = value.slice(0, -1).split('T');
  if (dateTimeParts.length !== 2) {
    return false;
  }

  const dateParts = (dateTimeParts.at(0) ?? '').split('-');
  const timeAndMilliseconds = (dateTimeParts.at(1) ?? '').split('.');
  const timeParts = (timeAndMilliseconds.at(0) ?? '').split(':');
  const milliseconds = timeAndMilliseconds.at(1);
  const [year, month, day] = dateParts;
  const [hour, minute, second] = timeParts;

  return (
    dateParts.length === 3 &&
    timeParts.length === 3 &&
    timeAndMilliseconds.length <= 2 &&
    year?.length === 4 &&
    month?.length === 2 &&
    day?.length === 2 &&
    hour?.length === 2 &&
    minute?.length === 2 &&
    second?.length === 2 &&
    isNonEmptyAsciiDigits(year) &&
    isNonEmptyAsciiDigits(month) &&
    isNonEmptyAsciiDigits(day) &&
    isNonEmptyAsciiDigits(hour) &&
    isNonEmptyAsciiDigits(minute) &&
    isNonEmptyAsciiDigits(second) &&
    (milliseconds === undefined || (milliseconds.length === 3 && isNonEmptyAsciiDigits(milliseconds)))
  );
}

function isVersionIdentifier(value: string): boolean {
  if (!value.startsWith('v')) {
    return false;
  }

  const segments = value.slice(1).split('-');
  const numericVersion = segments.at(0) ?? '';

  return (
    isNonEmptyAsciiDigits(numericVersion) &&
    !numericVersion.startsWith('0') &&
    segments.slice(1).every(isNonEmptyAsciiLowercaseAlphaNumeric)
  );
}

function isNumberedGenericText(value: string, prefix: string): boolean {
  if (!value.startsWith(prefix)) {
    return false;
  }

  const remainder = value.slice(prefix.length);
  return remainder === '' || isNonEmptyAsciiDigits(remainder.trimStart());
}

function isGenericSlideText(value: string): boolean {
  let normalized = value.toLowerCase();
  const trailingCharacter = normalized.at(-1);

  if (GENERIC_SLIDE_TRAILING_PUNCTUATION.some(punctuation => punctuation === trailingCharacter)) {
    normalized = normalized.slice(0, -1);
  }

  if (GENERIC_SLIDE_PLACEHOLDERS.some(placeholder => placeholder === normalized)) {
    return true;
  }

  if (normalized.startsWith('第') && normalized.endsWith('页')) {
    return isNonEmptyAsciiDigits(normalized.slice(1, -1).trim());
  }

  return isNumberedGenericText(normalized, '幻灯片') || isNumberedGenericText(normalized, 'slide');
}

export function getPublicShares(): Share[] {
  return registeredShares
    .filter(share => share.status === 'public')
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}

export function getShareBySlug(slug: string): Share | undefined {
  return registeredShares.find(share => share.slug === slug);
}

export function getPublicShareBySlug(slug: string): Share | undefined {
  const share = getShareBySlug(slug);
  return share?.status === 'public' ? share : undefined;
}

export function getDeckArtifact(share: Share): ShareDeck | undefined {
  return share.deck;
}

export function getCoverUrl(share: Share): string {
  return share.coverPath;
}

export function getSlideUrl(share: Share, slideNumber: number): string {
  const deck = requireDeck(share);
  assertSlideNumber(deck, slideNumber);
  return buildAssetUrl(deck.baseUrl, `${deck.paths.slides}/${formatSlideNumber(slideNumber)}.${deck.imageFormat}`);
}

export function getThumbnailUrl(share: Share, slideNumber: number): string {
  const deck = requireDeck(share);
  assertSlideNumber(deck, slideNumber);
  return buildAssetUrl(deck.baseUrl, `${deck.paths.thumbnails}/${formatSlideNumber(slideNumber)}.${deck.imageFormat}`);
}

export function getManifestUrl(share: Share): string | undefined {
  return getDeckPathUrl(share, 'manifest');
}

export function getPdfUrl(share: Share): string | undefined {
  return getDeckPathUrl(share, 'pdf');
}

export function getPptxUrl(share: Share): string | undefined {
  return getDeckPathUrl(share, 'pptx');
}

export function getTranscriptUrl(share: Share): string | undefined {
  return getDeckPathUrl(share, 'transcript');
}

export function getResourceUrl(share: Share, resource: ShareResource): string {
  const belongsToShare = share.resources.some(
    candidate => candidate.kind === resource.kind && candidate.url === resource.url,
  );

  if (!belongsToShare) {
    throw new Error(`资源 ${resource.kind} 不属于 Share ${share.slug}`);
  }

  return resource.url;
}

export function getResourceUrls(share: Share): string[] {
  return share.resources.map(resource => getResourceUrl(share, resource));
}

export function getResourceByKind(share: Share, kind: ShareResourceKind): ShareResource | undefined {
  return share.resources.find(resource => resource.kind === kind);
}

export function validateShareRegistry(registry: readonly Share[]): void {
  const slugs = new Set<string>();

  for (const share of registry) {
    validateShare(share);

    if (slugs.has(share.slug)) {
      throw new Error(`Share slug 重复：${share.slug}`);
    }

    slugs.add(share.slug);
  }
}

function validateShare(share: Share): void {
  if (!isKebabCaseSlug(share.slug)) {
    throw new Error(`Share slug 必须使用 kebab-case：${share.slug}`);
  }

  assertNonBlank(share.title, `${share.slug}.title`);
  assertNonBlank(share.summary, `${share.slug}.summary`);
  assertNonBlank(share.description, `${share.slug}.description`);
  assertNonBlank(share.author.name, `${share.slug}.author.name`);
  assertNonBlank(share.event.name, `${share.slug}.event.name`);
  assertNonBlank(share.event.location, `${share.slug}.event.location`);
  assertNonBlank(share.location, `${share.slug}.location`);
  assertNonBlank(share.coverAlt, `${share.slug}.coverAlt`);

  if (share.location !== share.event.location) {
    throw new Error(`Share ${share.slug} 的 location 必须与 event.location 一致`);
  }

  assertStrictUtcDate(share.publishedAt, `${share.slug}.publishedAt`);
  assertStrictUtcDate(share.updatedAt, `${share.slug}.updatedAt`);

  if (share.eventDate !== undefined) {
    assertStrictUtcDate(share.eventDate, `${share.slug}.eventDate`);
  }

  if (Date.parse(share.updatedAt) < Date.parse(share.publishedAt)) {
    throw new Error(`Share ${share.slug} 的 updatedAt 不能早于 publishedAt`);
  }

  assertAssetUrl(share.coverPath, `${share.slug}.coverPath`);
  validateTags(share);
  validateResources(share);

  if (share.deck !== undefined) {
    validateDeck(share, share.deck);
  }

  if (share.status === 'public') {
    validatePublicShare(share);
  }
}

function validateTags(share: Share): void {
  if (share.tags.length === 0) {
    throw new Error(`Share ${share.slug} 至少需要一个标签`);
  }

  const tags = new Set<string>();

  for (const tag of share.tags) {
    assertNonBlank(tag, `${share.slug}.tags`);

    if (tags.has(tag)) {
      throw new Error(`Share ${share.slug} 的标签重复：${tag}`);
    }

    tags.add(tag);
  }
}

function validateResources(share: Share): void {
  const kinds = new Set<ShareResourceKind>();

  for (const resource of share.resources) {
    assertNonBlank(resource.label, `${share.slug}.resources.${resource.kind}.label`);
    assertNonBlank(resource.fileName, `${share.slug}.resources.${resource.kind}.fileName`);
    assertAssetUrl(resource.url, `${share.slug}.resources.${resource.kind}.url`);
    validateResourceMediaType(resource);

    if (kinds.has(resource.kind)) {
      throw new Error(`Share ${share.slug} 的资源类型重复：${resource.kind}`);
    }

    kinds.add(resource.kind);
  }
}

function validateResourceMediaType(resource: ShareResource): void {
  if (resource.kind === 'pdf' && resource.mediaType !== 'application/pdf') {
    throw new Error('PDF 资源必须使用 application/pdf');
  }

  if (
    resource.kind === 'pptx' &&
    resource.mediaType !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    throw new Error('PPTX 资源必须使用 Open XML presentation media type');
  }

  if (resource.kind === 'transcript' && resource.mediaType !== 'text/markdown; charset=utf-8') {
    throw new Error('讲稿资源必须使用 text/markdown; charset=utf-8');
  }
}

function validateDeck(share: Share, deck: ShareDeck): void {
  if (!isVersionIdentifier(deck.version)) {
    throw new Error(`Share ${share.slug} 的 deck version 无效：${deck.version}`);
  }

  assertAssetUrl(deck.baseUrl, `${share.slug}.deck.baseUrl`);

  if (deck.baseUrl.endsWith('/')) {
    throw new Error(`Share ${share.slug} 的 deck baseUrl 不能以斜杠结尾`);
  }

  const baseUrl = new URL(deck.baseUrl);
  const expectedPath = `/shares/${share.slug}/${deck.version}`;

  if (baseUrl.pathname !== expectedPath) {
    throw new Error(`Share ${share.slug} 的 deck baseUrl 必须以 ${expectedPath} 结尾`);
  }

  assertPositiveInteger(deck.slideCount, `${share.slug}.deck.slideCount`);
  assertPositiveInteger(deck.slideWidth, `${share.slug}.deck.slideWidth`);
  assertPositiveInteger(deck.slideHeight, `${share.slug}.deck.slideHeight`);

  if (deck.slideWidth * 9 !== deck.slideHeight * 16) {
    throw new Error(`Share ${share.slug} 的 deck 必须使用 16:9 尺寸`);
  }

  validateDeckPaths(share, deck);

  if (deck.slides.length !== deck.slideCount) {
    throw new Error(
      `Share ${share.slug} 的 slideCount 为 ${deck.slideCount}，但 slides 实际包含 ${deck.slides.length} 页`,
    );
  }

  for (let index = 0; index < deck.slides.length; index += 1) {
    const slide = deck.slides.at(index);

    if (slide === undefined) {
      throw new Error(`Share ${share.slug} 缺少第 ${index + 1} 页幻灯片元数据`);
    }

    validateSlide(share, slide, index + 1);
  }

  validateDeckResourceConsistency(share, deck);
}

function validateDeckPaths(share: Share, deck: ShareDeck): void {
  assertRelativeAssetPath(deck.paths.cover, `${share.slug}.deck.paths.cover`);
  assertRelativeAssetPath(deck.paths.slides, `${share.slug}.deck.paths.slides`);
  assertRelativeAssetPath(deck.paths.thumbnails, `${share.slug}.deck.paths.thumbnails`);
  assertRelativeAssetPath(deck.paths.manifest, `${share.slug}.deck.paths.manifest`);
  assertRelativeAssetPath(deck.paths.pdf, `${share.slug}.deck.paths.pdf`);
  assertRelativeAssetPath(deck.paths.pptx, `${share.slug}.deck.paths.pptx`);
  assertRelativeAssetPath(deck.paths.transcript, `${share.slug}.deck.paths.transcript`);

  const expectedCoverUrl = buildAssetUrl(deck.baseUrl, deck.paths.cover);

  if (share.coverPath !== expectedCoverUrl) {
    throw new Error(`Share ${share.slug} 的 coverPath 必须与 deck.paths.cover 一致`);
  }
}

function validateSlide(share: Share, slide: ShareSlide, expectedNumber: number): void {
  if (slide.number !== expectedNumber) {
    throw new Error(`Share ${share.slug} 的第 ${expectedNumber} 个 slide 记录编号为 ${slide.number}`);
  }

  assertNonBlank(slide.title, `${share.slug}.deck.slides[${expectedNumber}].title`);
  assertNonBlank(slide.description, `${share.slug}.deck.slides[${expectedNumber}].description`);

  if (typeof slide.transcript !== 'string') {
    throw new Error(`Share ${share.slug} 第 ${expectedNumber} 页的 transcript 必须是字符串`);
  }

  assertSafePublicText(slide.title, `${share.slug} 第 ${expectedNumber} 页标题`);
  assertSafePublicText(slide.description, `${share.slug} 第 ${expectedNumber} 页描述`);
  assertSafePublicText(slide.transcript, `${share.slug} 第 ${expectedNumber} 页讲稿`);
}

function validateDeckResourceConsistency(share: Share, deck: ShareDeck): void {
  const pdf = getResourceByKind(share, 'pdf');
  const pptx = getResourceByKind(share, 'pptx');
  const transcript = getResourceByKind(share, 'transcript');

  if (pdf === undefined || pdf.url !== buildAssetUrl(deck.baseUrl, deck.paths.pdf)) {
    throw new Error(`Share ${share.slug} 的 PDF 资源必须匹配 deck.paths.pdf`);
  }

  if (pptx === undefined || pptx.url !== buildAssetUrl(deck.baseUrl, deck.paths.pptx)) {
    throw new Error(`Share ${share.slug} 的 PPTX 资源必须匹配 deck.paths.pptx`);
  }

  if (transcript === undefined || transcript.url !== buildAssetUrl(deck.baseUrl, deck.paths.transcript)) {
    throw new Error(`Share ${share.slug} 的讲稿资源必须匹配 deck.paths.transcript`);
  }
}

function validatePublicShare(share: Share): void {
  if (share.resources.length === 0) {
    throw new Error(`公开 Share ${share.slug} 至少需要一个资源`);
  }

  if (isGenericSlideText(share.title)) {
    throw new Error(`公开 Share ${share.slug} 的标题不能使用占位文本`);
  }

  if (share.deck === undefined) {
    return;
  }

  for (const slide of share.deck.slides) {
    if (isGenericSlideText(slide.title) || isGenericSlideText(slide.description)) {
      throw new Error(`公开 Share ${share.slug} 第 ${slide.number} 页不能使用通用占位标题或描述`);
    }
  }
}

function getDeckPathUrl(share: Share, path: 'manifest' | 'pdf' | 'pptx' | 'transcript'): string | undefined {
  const deck = share.deck;

  if (deck === undefined) {
    return undefined;
  }

  if (path === 'manifest') {
    return buildAssetUrl(deck.baseUrl, deck.paths.manifest);
  }

  if (path === 'pdf') {
    return buildAssetUrl(deck.baseUrl, deck.paths.pdf);
  }

  if (path === 'pptx') {
    return buildAssetUrl(deck.baseUrl, deck.paths.pptx);
  }

  return buildAssetUrl(deck.baseUrl, deck.paths.transcript);
}

function requireDeck(share: Share): ShareDeck {
  const deck = getDeckArtifact(share);

  if (deck === undefined) {
    throw new Error(`Share ${share.slug} 没有 deck`);
  }

  return deck;
}

function assertSlideNumber(deck: ShareDeck, slideNumber: number): void {
  if (!Number.isInteger(slideNumber) || slideNumber < 1 || slideNumber > deck.slideCount) {
    throw new RangeError(`幻灯片页码必须位于 1 到 ${deck.slideCount} 之间：${slideNumber}`);
  }
}

function formatSlideNumber(slideNumber: number): string {
  return String(slideNumber).padStart(3, '0');
}

function buildAssetUrl(baseUrl: string, path: string): string {
  assertRelativeAssetPath(path, 'asset path');
  const url = `${baseUrl}/${path}`;
  assertAssetUrl(url, 'asset URL');
  return url;
}

function assertAssetUrl(value: string, field: string): void {
  assertNonBlank(value, field);

  if (
    value.includes('\\') ||
    value.includes('/../') ||
    value.includes('/./') ||
    ENCODED_PATH_CONTROL_PATTERN.test(value)
  ) {
    throw new Error(`${field} 包含不安全的路径片段`);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} 不是有效 URL：${value}`);
  }

  if (url.origin !== SHARE_ASSET_ORIGIN || url.protocol !== 'https:') {
    throw new Error(`${field} 只允许使用 ${SHARE_ASSET_ORIGIN}`);
  }

  if (!url.pathname.startsWith('/shares/') || url.username || url.password || url.search || url.hash) {
    throw new Error(`${field} 必须是无凭据、查询参数或片段的 Share 资源 URL`);
  }

  if (url.href !== value) {
    throw new Error(`${field} 必须使用规范化 HTTPS URL：${value}`);
  }
}

function assertRelativeAssetPath(value: string, field: string): void {
  assertNonBlank(value, field);

  if (
    value.startsWith('/') ||
    value.endsWith('/') ||
    value.includes('\\') ||
    value.includes('://') ||
    value.includes('?') ||
    value.includes('#') ||
    ENCODED_PATH_CONTROL_PATTERN.test(value)
  ) {
    throw new Error(`${field} 必须是安全的相对资源路径`);
  }

  const segments = value.split('/');

  if (segments.some(segment => segment === '' || segment === '.' || segment === '..')) {
    throw new Error(`${field} 不能包含空目录、当前目录或父目录片段`);
  }
}

function assertStrictUtcDate(value: string, field: string): void {
  if (!hasStrictUtcDateShape(value)) {
    throw new Error(`${field} 必须是 ISO 8601 UTC 时间：${value}`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} 不是有效日期：${value}`);
  }

  const normalizedInput = value.includes('.') ? value : `${value.slice(0, -1)}.000Z`;

  if (date.toISOString() !== normalizedInput) {
    throw new Error(`${field} 不是严格有效的 UTC 日期：${value}`);
  }
}

function assertPositiveInteger(value: number, field: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} 必须是正整数`);
  }
}

function assertNonBlank(value: string, field: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} 不能为空`);
  }
}

function assertSafePublicText(value: string, field: string): void {
  for (const sensitivePattern of SENSITIVE_CONTENT_PATTERNS) {
    if (sensitivePattern.pattern.test(value)) {
      throw new Error(`${field} 包含${sensitivePattern.label}`);
    }
  }
}

validateShareRegistry(registeredShares);
