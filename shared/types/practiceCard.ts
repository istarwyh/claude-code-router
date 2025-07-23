export interface CardSection {
  title: string;
  content: string;
  type: 'text' | 'code' | 'list' | 'mermaid';
  language?: string;
  items?: string[];
}

export interface CardTip {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  content: string;
}

export interface PracticeCard {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  tags: string[];
  overview: string;
  sections: CardSection[];
  tips?: CardTip[];
  lastUpdated: string;
  version: string;
}
