export interface CategoryConfig {
  icon: string;
  label: string;
}

export interface DifficultyConfig {
  color: string;
  label: string;
}

export const categoryIcons: Record<string, string> = {
  'workflow': '🔄',
  'configuration': '⚙️',
  'mcp-commands': '🛠️',
  'context': '📝',
  'automation': '🤖',
  'collaboration': '👥'
};

export const difficultyColors: Record<string, string> = {
  'beginner': '#10b981',
  'intermediate': '#f59e0b', 
  'advanced': '#ef4444'
};

export const difficultyLabels: Record<string, string> = {
  'beginner': '初级',
  'intermediate': '中级',
  'advanced': '高级'
};