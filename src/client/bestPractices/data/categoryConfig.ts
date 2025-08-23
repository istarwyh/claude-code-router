import type { CategoryConfig, DifficultyConfig } from '../types/PracticeCard';

export const categoryIcons: Record<string, string> = {
  'workflow': '🔄',
  'configuration': '⚙️',
  'mcp-commands': '🛠️',
  'context': '📝',
  'automation': '🤖',
  'concurrency': '👥',
  'tools': '🔧'
};

export const difficultyColors: Record<string, string> = {
  'beginner': '#10b981',
  'intermediate': '#f59e0b', 
  'advanced': '#ef4444',
  'expert': '#8b5cf6'
};

export const difficultyLabels: Record<string, string> = {
  'beginner': '初级',
  'intermediate': '中级',
  'advanced': '高级',
  'expert': '专家'
};
