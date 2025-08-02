// 通用内容卡片的类型定义 - 遵循 DRY 原则
export interface BaseContentCard {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  readTime: string;
  tags: string[];
  overview: string;
  sections: ContentSection[];
  tips: ContentTip[];
  lastUpdated: string;
  version: string;
}

export interface ContentSection {
  title: string;
  content: string;
  type: 'text' | 'code' | 'list' | 'mermaid';
}

export interface ContentTip {
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

// 扩展 Best Practices 的特定类型
export interface PracticeCard extends BaseContentCard {
  category: 'workflow' | 'configuration' | 'mcp-commands' | 'context' | 'automation' | 'concurrency';
}

// How to Implement 的特定类型
export interface ImplementCard extends BaseContentCard {
  category: 'conversation' | 'system-prompt' | 'integration' | 'configuration';
}