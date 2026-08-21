export type ApiType = 'openai' | 'anthropic' | 'openai-responses';
export type PlaygroundMode = 'agnes' | 'custom';
export type RequestTransport = 'server' | 'browser';
export type ViewMode = 'rendered' | 'raw';

export interface TestResult {
  status: number;
  statusText: string;
  latency: number;
  data: unknown;
}

export interface RawSseLine {
  event?: string;
  data: string;
}

export interface ApiRequestConfig {
  targetUrl: string;
  headers: Record<string, string>;
  body: string;
}

export interface BuildDirectRequestInput {
  apiType: ApiType;
  baseUrl: string;
  model: string;
  key?: string;
  message?: string;
  stream: boolean;
  includeAuthorization: boolean;
}

export interface BuildServerPayloadInput {
  apiType: ApiType;
  isAgnesMode: boolean;
  key: string;
  message: string;
  mode: PlaygroundMode;
  model: string;
  timeout: number;
  url: string;
}

export type PlaygroundServerPayload =
  | {
      mode: 'agnes';
      message?: string;
      timeout: number;
    }
  | {
      mode: 'custom';
      url: string;
      model: string;
      key: string;
      apiType: ApiType;
      message?: string;
      timeout: number;
    };

export const DEFAULT_URL = 'https://aispeeds.me';
export const AGNES_URL = 'https://apihub.agnes-ai.com/v1';
export const AGNES_MODEL = 'agnes-2.0-flash';
export const DEFAULT_MESSAGE = 'Say hello in one sentence.';

const shellQuote = (value: string) => `'${value.replace(/'/g, String.raw`'\''`)}'`;

export const normalizeBaseUrl = (baseUrl: string) => baseUrl.trim().replace(/\/$/, '');

export const joinApiEndpoint = (baseUrl: string, versionedEndpoint: string, unversionedEndpoint: string) => {
  const targetBaseUrl = normalizeBaseUrl(baseUrl);
  return `${targetBaseUrl}${targetBaseUrl.endsWith('/v1') ? unversionedEndpoint : versionedEndpoint}`;
};

export const buildApiEndpoint = (apiType: ApiType, baseUrl: string) => {
  if (apiType === 'openai') {
    return joinApiEndpoint(baseUrl, '/v1/chat/completions', '/chat/completions');
  }

  if (apiType === 'openai-responses') {
    return joinApiEndpoint(baseUrl, '/v1/responses', '/responses');
  }

  return joinApiEndpoint(baseUrl, '/v1/messages', '/messages');
};

export const buildDirectRequest = ({
  apiType,
  baseUrl,
  model,
  key,
  message,
  stream,
  includeAuthorization,
}: BuildDirectRequestInput): ApiRequestConfig => {
  const targetUrl = buildApiEndpoint(apiType, baseUrl);
  const testMessage = message || DEFAULT_MESSAGE;

  if (apiType === 'anthropic') {
    return {
      targetUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(includeAuthorization && key ? { 'x-api-key': key } : {}),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        stream,
        messages: [{ role: 'user', content: testMessage }],
      }),
    };
  }

  if (apiType === 'openai-responses') {
    return {
      targetUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(includeAuthorization && key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream,
        input: [{ role: 'user', content: testMessage }],
      }),
    };
  }

  return {
    targetUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(includeAuthorization && key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      stream,
      messages: [{ role: 'user', content: testMessage }],
    }),
  };
};

export const buildServerPayload = ({
  apiType,
  isAgnesMode,
  key,
  message,
  mode,
  model,
  timeout,
  url,
}: BuildServerPayloadInput): PlaygroundServerPayload => {
  const optionalMessage = message ? { message } : {};

  if (isAgnesMode) {
    return { mode: 'agnes', timeout, ...optionalMessage };
  }

  return { mode: mode as 'custom', url, model, key, apiType, timeout, ...optionalMessage };
};

export const buildCurlCommand = ({ targetUrl, headers, body }: ApiRequestConfig) => {
  const headerLines = Object.entries(headers).map(([name, value]) => `  -H ${shellQuote(`${name}: ${value}`)} \\`);

  return [`curl -N -X POST ${shellQuote(targetUrl)} \\`, ...headerLines, `  --data ${shellQuote(body)}`].join('\n');
};

export const extractSseTextDelta = (payload: string) => {
  if (!payload || payload === '[DONE]') {
    return '';
  }

  try {
    const json = JSON.parse(payload) as Record<string, unknown>;
    const choices = json['choices'] as Array<{ delta?: { content?: string } }> | undefined;
    if (choices?.[0]?.delta?.content) {
      return choices[0].delta.content;
    }

    if (json['type'] === 'response.output_text.delta') {
      return (json['delta'] as string | undefined) ?? '';
    }

    const deltaObj = json['delta'] as { text?: string; type?: string } | undefined;
    if (deltaObj?.type === 'content_block_delta' && deltaObj.text) {
      return deltaObj.text;
    }

    if (json['type'] === 'content_block_delta') {
      const delta = json['delta'] as { text?: string } | undefined;
      return delta?.text ?? '';
    }
  } catch {
    return '';
  }

  return '';
};
