import { bestPracticesComponent } from './components/bestPractices';

export const bestPracticesModule = bestPracticesComponent;

export * from './components/bestPractices';
export * from './components/ArticleContentLoader';
export * from './components/ArticleDisplayComponent';
export * from './components/cards/BestPracticesOverviewCards';

// 已实现的文章列表
export const articlesList = [
  {
    id: 'current-workflow',
    title: '我现在的工作流 - 基于 Claude Code 的完整开发实践',
    category: 'workflow',
    status: 'available'
  },
  {
    id: 'environment-config',
    title: '自定义环境配置深度指南',
    category: 'configuration',
    status: 'available'
  },
  {
    id: 'mcp-commands',
    title: 'MCP 与常用命令 - 扩展 Claude Code 的能力边界',
    category: 'mcp-commands',
    status: 'available'
  },
  {
    id: 'core-workflow',
    title: '核心工作流程 - 文档先行与测试驱动的开发实践',
    category: 'context',
    status: 'available'
  },
  {
    id: 'context-management',
    title: '上下文管理 - 精准沟通与高效协作的艺术',
    category: 'context',
    status: 'available'
  },
  {
    id: 'automation-batch',
    title: '自动化与批处理 - 让 Claude Code 成为你的开发生产力倍增器',
    category: 'automation',
    status: 'available'
  },
  {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活 - 构建高效的 AI 协作开发团队',
    category: 'collaboration',
    status: 'available'
  }
];
