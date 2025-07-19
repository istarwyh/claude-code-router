export interface Provider {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  isDirectlyUsable: boolean;
  proxyUrl?: string;
  originalUrl: string;
  aliasCommand?: string;
  apiKeyUrl: string;
  features: string[];
  specialConfig?: {
    envVars: Record<string, string>;
    notes?: string;
  };
}

export const providers: Provider[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    displayName: 'DeepSeek',
    icon: 'DS',
    description: 'High-performance reasoning models with excellent cost efficiency. Perfect for complex coding tasks.',
    isDirectlyUsable: true,
    proxyUrl: 'https://cc.xiaohui.cool',
    originalUrl: 'https://api.deepseek.com',
    aliasCommand: 'alias deepseek="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://cc.xiaohui.cool claude"',
    apiKeyUrl: 'https://platform.deepseek.com',
    features: ['High reasoning capability', 'Cost efficient', 'Fast response']
  },
  {
    id: 'anyrouter',
    name: 'AnyRouter',
    displayName: 'AnyRouter',
    icon: 'AR',
    description: 'Model proxy service - Provides access to Claude and other models. Click to register and get $100 free credits!',
    isDirectlyUsable: true,
    proxyUrl: 'https://anyrouter.top',
    originalUrl: 'https://anyrouter.top',
    aliasCommand: 'alias anyrouter="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://anyrouter.top claude"',
    apiKeyUrl: 'https://anyrouter.top/console/token?aff=4Ly0',
    features: ['$100 free credits', 'Multiple models', 'Easy setup'],
    specialConfig: {
      envVars: {},
      notes: '🎁 Register to get $100 free credits'
    }
  },
  {
    id: 'kimi',
    name: 'Kimi',
    displayName: 'Kimi (Moonshot AI)',
    icon: 'KM',
    description: 'Advanced Chinese AI models with strong multilingual capabilities and long context support.',
    isDirectlyUsable: true,
    proxyUrl: 'https://api.moonshot.cn/anthropic',
    originalUrl: 'https://api.moonshot.cn/v1',
    aliasCommand: 'alias kimi="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic claude"',
    apiKeyUrl: 'https://platform.moonshot.cn',
    features: ['Chinese AI models', 'Multilingual support', 'Long context']
  },
  {
    id: 'siliconflow',
    name: 'SiliconFlow',
    displayName: 'SiliconFlow',
    icon: 'SF',
    description: 'Chinese AI infrastructure platform providing access to various domestic and international models.',
    isDirectlyUsable: true,
    proxyUrl: 'https://api.siliconflow.cn/',
    originalUrl: 'https://api.siliconflow.cn/v1',
    aliasCommand: 'alias siliconflow="ANTHROPIC_BASE_URL=https://api.siliconflow.cn/ ANTHROPIC_API_KEY=sk-your-siliconflow-key ANTHROPIC_MODEL=Pro/moonshotai/Kimi-K2-Instruct claude"',
    apiKeyUrl: 'https://siliconflow.cn',
    features: ['Chinese platform', 'Multiple models', 'Domestic & international'],
    specialConfig: {
      envVars: {
        'ANTHROPIC_BASE_URL': 'https://api.siliconflow.cn/',
        'ANTHROPIC_API_KEY': 'sk-your-siliconflow-key',
        'ANTHROPIC_MODEL': 'Pro/moonshotai/Kimi-K2-Instruct'
      },
      notes: 'Uses special environment variable format'
    }
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    displayName: 'OpenRouter',
    icon: 'OR',
    description: 'Access to multiple AI models through a single API, including Claude, GPT, and open-source models.',
    isDirectlyUsable: false,
    originalUrl: 'https://openrouter.ai/api/v1',
    apiKeyUrl: 'https://openrouter.ai',
    features: ['Multiple models', 'Single API', 'Open-source models']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    displayName: 'OpenAI',
    icon: 'AI',
    description: 'Industry-leading GPT models including GPT-4o and GPT-4o-mini for diverse AI applications.',
    isDirectlyUsable: false,
    originalUrl: 'https://api.openai.com/v1',
    apiKeyUrl: 'https://platform.openai.com',
    features: ['GPT-4o models', 'Industry leading', 'Diverse applications']
  }
];
