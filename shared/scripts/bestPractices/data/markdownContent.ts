// 文章元数据 - 内容已分离到独立的 .md 文件
// 从 /modules/best-practices/articles/ 读取，确保内容一致性

export interface MarkdownArticle {
  id: string;
  title: string;
  status: string;
  category: string;
  lastUpdated: string;
  filePath: string; // 指向对应的 .md 文件
}

export const markdownArticles: Record<string, MarkdownArticle> = {
  'current-workflow': {
    id: 'current-workflow',
    title: '我现在的工作流 - 基于 Claude Code 的完整开发实践',
    status: '已完成',
    category: '工作流程',
    lastUpdated: '2025-01-19',
    filePath: 'current-workflow.md'
  },

  'environment-config': {
    id: 'environment-config',
    title: '自定义环境配置深度指南',
    status: '即将推出',
    category: '环境配置',
    lastUpdated: '2025-01-19',
    filePath: 'environment-config.md'
  },

  'mcp-commands': {
    id: 'mcp-commands',
    title: 'MCP 与常用命令 - 扩展 Claude Code 的能力边界',
    status: '已完成',
    category: '工具集成',
    lastUpdated: '2025-01-19',
    filePath: 'mcp-commands.md'
  },

  'concurrent-claude': {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活 - 构建高效的 AI 协作开发团队',
    status: '已完成',
    category: '并发协作',
    lastUpdated: '2025-01-19',
    filePath: 'concurrent-claude.md'
  },

  'core-workflow': {
    id: 'core-workflow',
    title: '核心工作流程 - 文档先行与测试驱动的开发实践',
    status: '已完成',
    category: '开发流程',
    lastUpdated: '2025-01-19',
    filePath: 'core-workflow.md'
  },

  'context-management': {
    id: 'context-management',
    title: '上下文管理 - 精准沟通与高效协作的艺术',
    status: '已完成',
    category: '沟通技巧',
    lastUpdated: '2025-01-19',
    filePath: 'context-management.md'
  },

  'automation-batch': {
    id: 'automation-batch',
    title: '自动化与批处理 - 让 Claude Code 成为你的开发生产力倍增器',
    status: '已完成',
    category: '自动化工具',
    lastUpdated: '2025-01-19',
    filePath: 'automation-batch.md'
  }
};
