'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { BrandIcon } from '@/components/brand';
import { UI_TEXTS } from '@/config/ui-texts';
import {
  AGNES_MODEL,
  AGNES_URL,
  DEFAULT_MESSAGE,
  DEFAULT_URL,
  buildCurlCommand,
  buildDirectRequest,
  buildServerPayload,
  extractSseTextDelta,
  type ApiType,
  type PlaygroundMode,
  type RawSseLine,
  type RequestTransport,
  type TestResult,
  type ViewMode,
} from '../_lib/playgroundRequest';

const CHAT_COMPLETIONS_PRESETS: { value: PlaygroundMode; label: string }[] = [
  { value: 'agnes', label: 'Agnes 免费测试' },
  { value: 'custom', label: '自定义 Chat Completions' },
];

const API_TYPE_OPTIONS: { value: ApiType; label: string }[] = [
  { value: 'openai', label: 'Chat Completions' },
  { value: 'openai-responses', label: 'Responses' },
  { value: 'anthropic', label: 'Anthropic' },
];

const REQUEST_TRANSPORT_OPTIONS: { value: RequestTransport; label: string; description: string }[] = [
  { value: 'server', label: 'Server proxy', description: 'Best for public APIs; localhost stays blocked server-side.' },
  {
    value: 'browser',
    label: 'Browser direct',
    description: 'Calls the URL from this browser for localhost/private APIs.',
  },
];

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error('Clipboard is unavailable');
  }
};

const formatRawLine = (line: RawSseLine) => {
  if (line.event) {
    return `event: ${line.event}\ndata: ${line.data}`;
  }
  return `data: ${line.data}`;
};

export function PlaygroundClient() {
  const [mode, setMode] = useState<PlaygroundMode>('agnes');
  const [apiType, setApiType] = useState<ApiType>('openai');
  const [requestTransport, setRequestTransport] = useState<RequestTransport>('server');
  const [url, setUrl] = useState(DEFAULT_URL);
  const [model, setModel] = useState('');
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [timeout, setTimeout_] = useState(60);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [rawLines, setRawLines] = useState<RawSseLine[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');
  const [streamDone, setStreamDone] = useState(false);
  const [streamLatency, setStreamLatency] = useState<number | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsHint, setModelsHint] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const isChatCompletions = apiType === 'openai';
  const isAgnesMode = isChatCompletions && mode === 'agnes';
  const requestMode: PlaygroundMode = isAgnesMode ? 'agnes' : 'custom';
  const effectiveUrl = isAgnesMode ? AGNES_URL : url;
  const effectiveModel = isAgnesMode ? AGNES_MODEL : model;

  const resetOutput = () => {
    setError('');
    setResult(null);
    setStreamText('');
    setRawLines([]);
    setViewMode('rendered');
    setStreamDone(false);
    setStreamLatency(null);
    setModels([]);
    setModelsHint('');
    setCopyFeedback('');
  };

  const getBlockedDirectTargetMessage = () => {
    if (isAgnesMode || requestTransport !== 'browser') {
      return '';
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(url.trim());
    } catch {
      return '';
    }

    const hostname = targetUrl.hostname.toLowerCase();
    const defaultOrigin = new URL(DEFAULT_URL).origin;
    if (
      targetUrl.origin === window.location.origin ||
      targetUrl.origin === defaultOrigin ||
      hostname === 'aispeeds.me'
    ) {
      return 'Browser direct will not send API keys to this app origin. Use Browser direct only for localhost/private or another non-app endpoint, or switch back to Server proxy for aispeeds.me/public API testing.';
    }

    return '';
  };

  const buildCurrentDirectRequest = (stream: boolean, includeAuthorization: boolean) =>
    buildDirectRequest({
      apiType,
      baseUrl: effectiveUrl,
      model: effectiveModel,
      key,
      message,
      stream,
      includeAuthorization,
    });

  const readPlaygroundResponse = async (res: Response, start: number) => {
    const serverLatency = res.headers.get('X-Playground-Latency');
    const serverStatus = res.headers.get('X-Playground-Status');
    const contentType = res.headers.get('content-type') ?? '';

    if (contentType.includes('text/event-stream') && res.body) {
      const status = serverStatus ? Number(serverStatus) : res.status;
      setStreamLatency(serverLatency ? Number(serverLatency) : Date.now() - start);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let text = '';
      let pendingEvent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              pendingEvent = line.slice(6).trim();
              continue;
            }
            if (!line.startsWith('data:')) {
              continue;
            }
            const payload = line.slice(5).trim();
            const rawLine: RawSseLine = pendingEvent ? { event: pendingEvent, data: payload } : { data: payload };
            setRawLines(prev => [...prev, rawLine]);
            pendingEvent = '';

            const delta = extractSseTextDelta(payload);
            if (delta) {
              text += delta;
              setStreamText(text);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      const latency = Date.now() - start;
      setStreamDone(true);
      setStreamLatency(latency);
      setResult({
        status,
        statusText: res.statusText || (status >= 200 && status < 300 ? 'OK' : 'Error'),
        latency,
        data: { content: text },
      });
      return;
    }

    const data = await res.json().catch(() => null);
    const serverResult = data as TestResult | { error?: string } | null;
    if (!res.ok && serverResult && 'error' in serverResult && serverResult.error) {
      setError(serverResult.error);
      return;
    }
    if (serverResult && 'status' in serverResult && 'latency' in serverResult && 'data' in serverResult) {
      setResult(serverResult);
      return;
    }
    setResult({
      status: res.status,
      statusText: res.statusText,
      latency: Date.now() - start,
      data,
    });
  };

  const handleApiTypeChange = (nextApiType: ApiType) => {
    abortRef.current?.abort();
    setLoading(false);
    setApiType(nextApiType);
    resetOutput();
  };

  const handleModeChange = (nextMode: PlaygroundMode) => {
    abortRef.current?.abort();
    setLoading(false);
    setMode(nextMode);
    resetOutput();
  };

  const handleRequestTransportChange = (nextTransport: RequestTransport) => {
    abortRef.current?.abort();
    setLoading(false);
    setRequestTransport(nextTransport);
    resetOutput();
  };

  const handleSend = async () => {
    if (!effectiveUrl || !effectiveModel || (!isAgnesMode && !key)) {
      return;
    }

    abortRef.current?.abort();
    setLoading(true);
    resetOutput();

    const blockedDirectTargetMessage = getBlockedDirectTargetMessage();
    if (blockedDirectTargetMessage) {
      setError(blockedDirectTargetMessage);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const start = Date.now();
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, timeout * 1000);

    try {
      const directRequest =
        !isAgnesMode && requestTransport === 'browser' ? buildCurrentDirectRequest(true, true) : null;
      const res = directRequest
        ? await fetch(directRequest.targetUrl, {
            method: 'POST',
            headers: directRequest.headers,
            body: directRequest.body,
            signal: controller.signal,
          })
        : await fetch('/api/playground', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              buildServerPayload({ apiType, isAgnesMode, key, message, mode: requestMode, model, timeout, url }),
            ),
            signal: controller.signal,
          });

      await readPlaygroundResponse(res, start);
    } catch (err) {
      const directHint =
        !isAgnesMode && requestTransport === 'browser'
          ? ' Browser direct requests also require CORS; Chrome Private Network Access may require OPTIONS to return Access-Control-Allow-Private-Network: true.'
          : '';
      if (err instanceof DOMException && err.name === 'AbortError') {
        if (didTimeout) {
          setError(`Request timed out after ${timeout} seconds.${directHint}`);
        }
        return;
      }
      setError(`${err instanceof Error ? err.message : 'Network error'}${directHint}`);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
    setStreamDone(true);
  };

  const handleCopyCurl = async () => {
    if (!effectiveUrl.trim() || !effectiveModel.trim() || (!isAgnesMode && !key.trim())) {
      return;
    }

    setCopyFeedback('');
    try {
      const curl = buildCurlCommand(buildCurrentDirectRequest(true, !isAgnesMode));
      await copyTextToClipboard(curl);
      setCopyFeedback(
        isAgnesMode
          ? 'Copied curl without the server-only Agnes Authorization header.'
          : 'Copied curl with the current request settings.',
      );
    } catch (err) {
      setCopyFeedback(err instanceof Error ? err.message : 'Failed to copy curl.');
    }
  };

  const handleFetchModels = async () => {
    if (!isAgnesMode && (!url.trim() || !key.trim())) {
      return;
    }

    setModelsLoading(true);
    setModels([]);
    setModelsHint('');

    const blockedDirectTargetMessage = getBlockedDirectTargetMessage();
    if (blockedDirectTargetMessage) {
      setModelsHint(blockedDirectTargetMessage);
      setModelsLoading(false);
      return;
    }

    try {
      if (!isAgnesMode && requestTransport === 'browser') {
        const headers =
          apiType === 'anthropic'
            ? { 'x-api-key': key, 'anthropic-version': '2023-06-01' }
            : { Authorization: `Bearer ${key}` };
        const res = await fetch(`${url.trim().replace(/\/$/, '')}/models`, { method: 'GET', headers });
        const data = (await res.json().catch(() => null)) as {
          data?: Array<{ id?: string }>;
          models?: string[];
        } | null;
        const nextModels =
          data?.models ?? data?.data?.map(item => item.id).filter((id): id is string => Boolean(id)) ?? [];

        if (!res.ok) {
          setModelsHint(`Failed to fetch models (${res.status}). Please enter the model ID manually.`);
          return;
        }
        if (nextModels.length > 0) {
          setModels([...nextModels].sort());
        } else {
          setModelsHint('No models returned by this endpoint. Please enter the model ID manually.');
        }
        return;
      }

      const res = await fetch('/api/playground/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isAgnesMode ? { mode: requestMode } : { mode: requestMode, url, key, apiType }),
      });
      const data = (await res.json()) as { models?: string[]; hint?: string };
      if (data.models?.length) {
        setModels(data.models);
      }
      if (data.hint) {
        setModelsHint(data.hint);
      }
    } catch (err) {
      const directHint =
        !isAgnesMode && requestTransport === 'browser'
          ? ' Browser direct model fetching requires CORS; Chrome Private Network Access may require OPTIONS to return Access-Control-Allow-Private-Network: true.'
          : '';
      setModelsHint(`${err instanceof Error ? err.message : 'Failed to fetch models'}${directHint}`);
    } finally {
      setModelsLoading(false);
    }
  };

  const canSend = Boolean(effectiveUrl.trim() && effectiveModel.trim() && (isAgnesMode || key.trim()) && !loading);
  const canCopyCurl = Boolean(effectiveUrl.trim() && effectiveModel.trim() && (isAgnesMode || key.trim()));

  return (
    <main className='min-h-screen bg-bg-secondary text-text-primary'>
      <header className='flex h-12 shrink-0 items-center gap-3 border-b border-border-light bg-bg-primary px-4'>
        <Link href='/' className='flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary'>
          <BrandIcon size={24} />
          <span className='text-sm font-semibold italic'>AI Speeds</span>
        </Link>
        <span className='text-text-muted'>|</span>
        <span className='text-sm font-medium text-text-secondary'>{UI_TEXTS.NAVIGATION.PLAYGROUND}</span>
      </header>

      <div className='mx-auto max-w-2xl px-4 py-8'>
        <div className='space-y-6'>
          <div className='flex flex-wrap gap-2'>
            {API_TYPE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type='button'
                onClick={() => handleApiTypeChange(value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  apiType === value
                    ? 'bg-teal-500 text-teal-500-foreground shadow-sm'
                    : 'border border-border-light bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isChatCompletions && (
            <div className='rounded-xl border border-border-light bg-bg-primary p-2 shadow-sm'>
              <div className='flex flex-wrap gap-2'>
                {CHAT_COMPLETIONS_PRESETS.map(({ value, label }) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => handleModeChange(value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      mode === value
                        ? 'bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/30'
                        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isAgnesMode && (
            <div className='space-y-3 rounded-xl border border-border-light bg-bg-primary p-4 shadow-sm'>
              <div>
                <p className='text-sm font-medium text-text-primary'>Request transport</p>
                <p className='mt-1 text-xs text-text-muted'>
                  Browser direct can reach localhost/private URLs from your browser, but the target service must enable
                  CORS. Chrome Private Network Access may also require OPTIONS to return
                  Access-Control-Allow-Private-Network: true.
                </p>
              </div>
              <div className='grid gap-2 sm:grid-cols-2'>
                {REQUEST_TRANSPORT_OPTIONS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type='button'
                    onClick={() => handleRequestTransportChange(value)}
                    className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                      requestTransport === value
                        ? 'border-teal-500 bg-teal-500/10 text-teal-700 ring-1 ring-teal-500/30'
                        : 'border-border-light text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                    }`}
                  >
                    <span className='block text-sm font-medium'>{label}</span>
                    <span className='mt-1 block text-xs text-text-muted'>{description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='space-y-4 rounded-xl border border-border-light bg-bg-primary p-6 shadow-sm'>
            <div>
              <label className='mb-1.5 block text-sm font-medium text-text-primary'>URL</label>
              <input
                type='text'
                value={effectiveUrl}
                onChange={e => setUrl(e.target.value)}
                placeholder={isAgnesMode ? AGNES_URL : DEFAULT_URL}
                disabled={isAgnesMode}
                className='w-full rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-bg-secondary'
              />
            </div>

            <div>
              <div className='mb-1.5 flex items-center justify-between'>
                <label className='text-sm font-medium text-text-primary'>Model</label>
                <button
                  type='button'
                  onClick={handleFetchModels}
                  disabled={(!isAgnesMode && (!url.trim() || !key.trim())) || modelsLoading}
                  className='text-xs text-teal-600 transition-colors hover:text-teal-500 disabled:cursor-not-allowed disabled:text-text-muted'
                >
                  {modelsLoading ? 'Fetching...' : 'Fetch Models'}
                </button>
              </div>
              <input
                type='text'
                value={effectiveModel}
                onChange={e => setModel(e.target.value)}
                placeholder={
                  isAgnesMode ? AGNES_MODEL : apiType === 'anthropic' ? 'claude-sonnet-4-20250514' : 'gpt-4o'
                }
                disabled={isAgnesMode}
                className='w-full rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-bg-secondary'
              />
              {modelsHint && <p className='mt-1.5 text-xs text-text-muted'>{modelsHint}</p>}
              {models.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  {models.map(modelName => (
                    <button
                      key={modelName}
                      type='button'
                      onClick={() => {
                        if (!isAgnesMode) {
                          setModel(modelName);
                        }
                      }}
                      disabled={isAgnesMode}
                      className={`rounded-md px-2 py-0.5 text-xs transition-colors disabled:cursor-not-allowed ${
                        effectiveModel === modelName
                          ? 'bg-teal-500 text-teal-500-foreground'
                          : 'bg-bg-tertiary text-text-secondary hover:bg-teal-500/10 hover:text-teal-600'
                      }`}
                    >
                      {modelName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isAgnesMode && (
              <div>
                <label className='mb-1.5 block text-sm font-medium text-text-primary'>API Key</label>
                <div className='relative'>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder='sk-...'
                    className='w-full rounded-lg border border-border-medium px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
                  />
                  <button
                    type='button'
                    onClick={() => setShowKey(!showKey)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted transition-colors hover:text-text-primary'
                    aria-label={showKey ? 'Hide API Key' : 'Show API Key'}
                  >
                    {showKey ? <HiddenKeyIcon /> : <VisibleKeyIcon />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className='mb-1.5 block text-sm font-medium text-text-primary'>
                Message <span className='font-normal text-text-muted'>(optional)</span>
              </label>
              <input
                type='text'
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={DEFAULT_MESSAGE}
                className='w-full rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-text-primary'>Timeout</label>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  value={timeout}
                  onChange={e => setTimeout_(Math.min(120, Math.max(10, Number(e.target.value) || 60)))}
                  min={10}
                  max={120}
                  step={10}
                  className='w-24 rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
                />
                <span className='text-sm text-text-muted'>seconds</span>
              </div>
            </div>

            <div className='flex flex-col gap-2 sm:flex-row'>
              {loading ? (
                <button
                  type='button'
                  onClick={handleStop}
                  className='rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-error-foreground shadow-sm transition-colors hover:opacity-90 sm:flex-1'
                >
                  Stop
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleSend}
                  disabled={!canSend}
                  className='rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-medium text-teal-500-foreground shadow-sm transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1'
                >
                  Send Test
                </button>
              )}
              <button
                type='button'
                onClick={handleCopyCurl}
                disabled={!canCopyCurl}
                className='rounded-pill border border-floating-border bg-floating-surface px-4 py-2.5 text-sm font-medium text-text-primary shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-floating-surface-strong active:scale-press disabled:cursor-not-allowed disabled:opacity-50 sm:w-40'
              >
                Copy as curl
              </button>
            </div>
            {copyFeedback && <p className='text-xs text-text-muted'>{copyFeedback}</p>}
          </div>

          {error && (
            <div className='rounded-xl border border-error/30 bg-error/5 p-4'>
              <p className='text-sm font-medium text-error'>Error</p>
              <p className='mt-1 text-sm text-error/80'>{error}</p>
            </div>
          )}

          {streamText && (
            <div className='space-y-3 rounded-xl border border-border-light bg-bg-primary p-6 shadow-sm'>
              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-4'>
                  {streamLatency !== null && <span className='text-text-muted'>Latency: {streamLatency}ms</span>}
                  {!streamDone && (
                    <span className='inline-flex items-center gap-1.5 text-xs text-teal-600'>
                      <span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500' />
                      Streaming...
                    </span>
                  )}
                  {streamDone && <span className='text-xs text-success'>Done</span>}
                </div>
                <div className='flex rounded-md border border-border-light'>
                  <button
                    type='button'
                    onClick={() => setViewMode('rendered')}
                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                      viewMode === 'rendered'
                        ? 'bg-teal-500 text-teal-500-foreground'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Rendered
                  </button>
                  <button
                    type='button'
                    onClick={() => setViewMode('raw')}
                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                      viewMode === 'raw'
                        ? 'bg-teal-500 text-teal-500-foreground'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Raw
                  </button>
                </div>
              </div>

              {viewMode === 'rendered' ? (
                <div className='whitespace-pre-wrap rounded-lg bg-text-primary p-4 text-sm leading-relaxed text-text-inverse'>
                  {streamText}
                  {!streamDone && (
                    <span className='ml-0.5 inline-block h-4 w-2 animate-pulse bg-teal-400 align-text-bottom' />
                  )}
                </div>
              ) : (
                <pre className='max-h-96 overflow-auto rounded-lg bg-text-primary p-4 text-xs leading-relaxed text-text-inverse'>
                  {rawLines.map(formatRawLine).join('\n')}
                  {!streamDone && (
                    <span className='ml-0.5 inline-block h-3 w-2 animate-pulse bg-teal-400 align-text-bottom' />
                  )}
                </pre>
              )}
            </div>
          )}

          {!streamText && result && (
            <div className='space-y-3 rounded-xl border border-border-light bg-bg-primary p-6 shadow-sm'>
              <div className='flex items-center gap-4 text-sm'>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    result.status >= 200 && result.status < 300
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  {result.status} {result.statusText}
                </span>
                <span className='text-text-muted'>{result.latency}ms</span>
              </div>
              <pre className='overflow-auto rounded-lg bg-text-primary p-4 text-xs leading-relaxed text-text-inverse'>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function HiddenKeyIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='h-4 w-4'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
      />
    </svg>
  );
}

function VisibleKeyIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='h-4 w-4'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
      />
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
    </svg>
  );
}
