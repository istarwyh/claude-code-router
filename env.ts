export interface Env {
  OPENROUTER_BASE_URL?: string;
  
  // Provider-specific base URLs
  DEEPSEEK_BASE_URL?: string;
  OPENAI_BASE_URL?: string;
  KIMI_BASE_URL?: string;
  SILICONFLOW_BASE_URL?: string;
  
  // Backward compatibility - auto-detects provider type
  OPENAI_COMPATIBLE_BASE_URL?: string;
}
