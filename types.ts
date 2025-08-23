export type Provider = 'openrouter' | 'deepseek' | 'openai' ;

export interface ModelMapping {
  [key: string]: string;
}

export const PROVIDER_CONFIGS = {
  openrouter: {
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    modelMappings: {
      // Exact model name mappings
      'claude-3-5-haiku-20241022': 'anthropic/claude-3.5-haiku',
      'claude-3-5-sonnet-20241022': 'anthropic/claude-3.5-sonnet',
      'claude-3-opus-20240229': 'anthropic/claude-3-opus',
      // Family mappings for backward compatibility
      'haiku': 'anthropic/claude-3.5-haiku',
      'sonnet': 'anthropic/claude-3.5-sonnet',
      'opus': 'anthropic/claude-3-opus',
    } as ModelMapping,
  },
  deepseek: {
    defaultBaseUrl: 'https://api.deepseek.com',
    modelMappings: {
      'claude-3-5-haiku-20241022': 'deepseek-chat',
      'claude-3-5-sonnet-20241022': 'deepseek-chat',
      'claude-3-opus-20240229': 'deepseek-reasoner',
      'haiku': 'deepseek-chat',
      'sonnet': 'deepseek-chat', 
      'opus': 'deepseek-reasoner',
    } as ModelMapping,
    commonModels: ['deepseek-chat', 'deepseek-reason'],
  },
  openai: {
    defaultBaseUrl: 'https://api.openai.com/v1',
    modelMappings: {
      'claude-3-5-haiku-20241022': 'gpt-4o-mini',
      'claude-3-5-sonnet-20241022': 'gpt-4o',
      'claude-3-opus-20240229': 'gpt-4o',
      'haiku': 'gpt-4o-mini',
      'sonnet': 'gpt-4o',
      'opus': 'gpt-4o',
    } as ModelMapping,
    commonModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  },
} as const;