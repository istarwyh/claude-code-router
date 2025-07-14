import { Env } from './env';
import { formatAnthropicToOpenAI } from './formatRequest';
import { streamOpenAIToAnthropic } from './streamResponse';
import { formatOpenAIToAnthropic } from './formatResponse';
import { indexHtml } from './indexHtml';
import { termsHtml } from './termsHtml';
import { privacyHtml } from './privacyHtml';
import { Provider, PROVIDER_CONFIGS } from './types';

function selectProvider(env: Env): { provider: Provider; baseUrl: string } {
  // Check specific provider configurations first
  if (env.DEEPSEEK_BASE_URL) {
    return { provider: 'deepseek', baseUrl: env.DEEPSEEK_BASE_URL };
  }
  if (env.OPENAI_BASE_URL) {
    return { provider: 'openai', baseUrl: env.OPENAI_BASE_URL };
  }
  if (env.KIMI_BASE_URL) {
    return { provider: 'kimi', baseUrl: env.KIMI_BASE_URL };
  }
  if (env.SILICONFLOW_BASE_URL) {
    return { provider: 'siliconflow', baseUrl: env.SILICONFLOW_BASE_URL };
  }

  // Auto-detect provider from generic OPENAI_COMPATIBLE_BASE_URL
  if (env.OPENAI_COMPATIBLE_BASE_URL) {
    const baseUrl = env.OPENAI_COMPATIBLE_BASE_URL.toLowerCase();
    
    if (baseUrl.includes('deepseek')) {
      return { provider: 'deepseek', baseUrl };
    } else if (baseUrl.includes('openai')) {
      return { provider: 'openai', baseUrl };
    } else if (baseUrl.includes('moonshot')) {
      return { provider: 'kimi', baseUrl };
    } else if (baseUrl.includes('siliconflow')) {
      return { provider: 'siliconflow', baseUrl };
    } 
    // Default to deepseek if can't detect
    return { provider: 'deepseek', baseUrl };
  }
  
  // Default to OpenRouter
  return {
    provider: 'openrouter',
    baseUrl: env.OPENROUTER_BASE_URL || PROVIDER_CONFIGS.openrouter.defaultBaseUrl
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }
    
    if (url.pathname === '/terms' && request.method === 'GET') {
      return new Response(termsHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }
    
    if (url.pathname === '/privacy' && request.method === 'GET') {
      return new Response(privacyHtml, {
        headers: { "Content-Type": "text/html" }
      });
    }
    
    if (url.pathname === '/v1/messages' && request.method === 'POST') {
      const anthropicRequest = await request.json();
      const bearerToken = request.headers.get("x-api-key");

      // Select provider and base URL based on environment configuration
      const { provider, baseUrl } = selectProvider(env);

      const openaiRequest = formatAnthropicToOpenAI(anthropicRequest, provider);
      const openaiResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(openaiRequest),
      });

      if (!openaiResponse.ok) {
        return new Response(await openaiResponse.text(), { status: openaiResponse.status });
      }

      if (openaiRequest.stream) {
        const anthropicStream = streamOpenAIToAnthropic(openaiResponse.body as ReadableStream, openaiRequest.model);
        return new Response(anthropicStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        const openaiData = await openaiResponse.json();
        const anthropicResponse = formatOpenAIToAnthropic(openaiData, openaiRequest.model);
        return new Response(JSON.stringify(anthropicResponse), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
}