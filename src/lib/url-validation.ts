const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '[::1]']);

function normalizeHostname(hostname: string): string {
  return hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
}

function isPrivateIp(hostname: string): boolean {
  const normalizedHostname = normalizeHostname(hostname);
  // IPv4 private ranges
  const parts = normalizedHostname.split('.').map(Number);
  if (parts.length === 4 && parts.every(n => !isNaN(n))) {
    const a = parts[0] as number;
    const b = parts[1] as number;
    if (a === 10) {
      return true;
    }
    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }
    if (a === 192 && b === 168) {
      return true;
    }
    if (a === 127) {
      return true;
    }
    if (a === 169 && b === 254) {
      return true;
    } // link-local
    if (a === 0) {
      return true;
    }
  }

  // IPv6 loopback and private prefixes
  const h = normalizedHostname.toLowerCase();
  if (h === '::1' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80')) {
    return true;
  }

  return false;
}

/**
 * Validate a user-supplied URL for the playground proxy.
 * Blocks non-HTTP(S) schemes, localhost, and private/internal IP ranges (SSRF protection).
 */
export function validateProxyUrl(raw: string): { ok: true; url: URL } | { ok: false; error: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, error: 'Invalid URL format' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Only http/https URLs are allowed' };
  }

  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTS.has(hostname)) {
    return { ok: false, error: 'Requests to localhost are not allowed' };
  }

  if (isPrivateIp(hostname)) {
    return { ok: false, error: 'Requests to private/internal IP addresses are not allowed' };
  }

  return { ok: true, url };
}
