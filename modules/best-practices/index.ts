import { bestPracticesComponent } from './components/bestPractices';

// 未来可以在这里导入更多文章和内容
// import { environmentConfigArticle } from './articles/environment-config';
// import { workflowOptimizationArticle } from './articles/workflow-optimization';

export const bestPracticesModule = bestPracticesComponent;

export * from './components/bestPractices';

// 文章列表 - 未来扩展用
export const articlesList = [
  {
    id: 'environment-config',
    title: '自定义环境配置深度指南',
    category: 'config',
    status: 'coming-soon'
  },
  {
    id: 'workflow-optimization', 
    title: '工作流程优化最佳实践',
    category: 'workflow',
    status: 'coming-soon'
  },
  {
    id: 'multi-instance-collaboration',
    title: '多 Claude 实例协作模式',
    category: 'collaboration', 
    status: 'coming-soon'
  }
];
