// 最佳实践卡片的类型定义

export interface PracticeCard {
  id: string;
  title: string;
  description: string;
  category: 'workflow' | 'configuration' | 'mcp-commands' | 'context' | 'automation' | 'concurrency';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  readTime: string;
  tags: string[];
  overview: string;
  sections: PracticeSection[];
  tips: PracticeTip[];
  lastUpdated: string;
  version: string;
}

export interface PracticeSection {
  title: string;
  content: string;
  type: 'text' | 'code' | 'list' | 'mermaid';
}

export interface PracticeTip {
  type: 'info' | 'success' | 'warning' | 'tip' | 'expert';
  title: string;
  content: string;
}

export interface CategoryConfig {
  [key: string]: string;
}

export interface DifficultyConfig {
  [key: string]: string;
}
