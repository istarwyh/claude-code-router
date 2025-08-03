// 卡片渲染配置
export interface DifficultyConfig {
  colors: Record<string, string>;
  labels: Record<string, string>;
}

export const defaultDifficultyConfig: DifficultyConfig = {
  colors: {
    'beginner': '#10B981',
    'intermediate': '#F59E0B', 
    'advanced': '#EF4444',
    'expert': '#8B5CF6'
  },
  labels: {
    'beginner': '入门',
    'intermediate': '进阶',
    'advanced': '高级',
    'expert': '专家'
  }
};