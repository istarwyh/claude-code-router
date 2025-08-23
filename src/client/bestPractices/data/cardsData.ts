import type { PracticeCard } from '../types/PracticeCard';

export const bestPracticesCards: PracticeCard[] = [
  {
    id: 'workflow-overview',
    title: '我现在的工作流',
    imageUrl: 'https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202508232133560.png',
    category: 'workflow',
    tips: [{ type: 'success', title: '效率提升', content: '整个过程开发者只需要提出需求和Review，大大提升开发效率' }]
  },
  {
    id: 'environment-config',
    title: '自定义环境配置',
    description: '配置 CLAUDE.md 文件、权限管理和 GitHub CLI 集成',
    category: 'configuration',
    difficulty: 'beginner',
    readTime: '8 分钟',
    tips: [{ type: 'info', title: '最佳实践', content: 'CLAUDE.md 文件应该放在项目根目录，作为项目的记忆库' }],
  },
  {
    id: 'mcp-commands',
    title: 'MCP 与常用命令',
    imageUrl: 'https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507202037009.png',
    category: 'mcp-commands',
    tips: [{ type: 'info', title: '扩展性', content: 'MCP 服务器让 Claude Code 具备无限扩展的可能性' }],
  },
  {
    id: 'core-workflow',
    title: '代码生成、调试、重构和测试的核心工作流程',
    category: 'workflow',
    tags: ['coding', 'debugging', 'refactoring', 'testing'],
    tips: [{ type: 'warning', title: '注意事项', content: '始终保持代码审查的习惯，AI 生成的代码也需要人工验证' }],
  },
  {
    id: 'context-management',
    title: '上下文管理',
    description: '项目记忆库、上下文窗口优化和长期记忆管理',
    category: 'context',
    tags: ['context', 'memory', 'optimization', 'management'],
    tips: [{ type: 'success', title: '高级技巧', content: '合理的上下文管理可以让 Claude Code 的表现提升 50% 以上' }]
  },
  {
    id: 'automation-batch',
    title: '自动化与批处理',
    description: '无头模式、自动化脚本、Pre-Commit Hooks 和 Claude Code Hooks',
    category: 'automation',
    tags: ['automation', 'batch', 'hooks', 'ci-cd'],
    tips: [{ type: 'warning', title: '安全提醒', content: '在自动化环境中使用时，注意 API 密钥的安全管理' }]
  },
  {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活',
    category: 'concurrency',
    tags: ['concurrency', 'multi-instance', 'optimization', 'scaling'],
    tips: [{ type: 'expert', title: '专家级技巧', content: '合理的多实例使用可以将开发效率提升 3-5 倍' }]
  },
  {
    id: 'intelligent-undo',
    title: 'ccundo --开源 checkpointor',
    category: 'tools',
    tags: ['ccundo', 'undo', 'safety', 'backup', 'recovery'],
    tips: [
      { type: 'success', title: '安全保障', content: '有了可靠的撤销机制，可以更大胆地尝试复杂重构和实验性功能' },
      { type: 'info', title: '级联安全', content: 'ccundo 的级联撤销机制确保项目状态始终保持一致性' }
    ]
  }
];
