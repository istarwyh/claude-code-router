import type { PracticeCard } from '../types/PracticeCard';

export const bestPracticesCards: PracticeCard[] = [
  {
    id: 'workflow-overview',
    title: '我现在的工作流',
    description: '基于 Claude Code 的完整开发工作流，从需求到部署的全流程最佳实践',
    category: 'workflow',
    difficulty: 'intermediate',
    readTime: '10 分钟',
    tags: ['workflow', 'github', 'tdd', 'review'],
    overview: '展示如何使用 Claude Code 构建高效的开发工作流，包含时序图和详细的流程步骤。',
    sections: [
      { title: '工作流时序图', content: '完整的开发流程可视化展示', type: 'mermaid' },
      { title: '核心步骤', content: '从创建工作区到代码审查的8个关键步骤', type: 'list' }
    ],
    tips: [{ type: 'success', title: '效率提升', content: '整个过程开发者只需要提出需求和Review，大大提升开发效率' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'environment-config',
    title: '自定义环境配置',
    description: '配置 CLAUDE.md 文件、权限管理和 GitHub CLI 集成',
    category: 'configuration',
    difficulty: 'beginner',
    readTime: '8 分钟',
    tags: ['claude-md', 'configuration', 'github', 'permissions'],
    overview: '学习如何正确配置 Claude Code 的开发环境，包括项目记忆库、权限策略和工具集成。',
    sections: [
      { title: 'CLAUDE.md 文件配置', content: '创建项目记忆库，自动注入上下文', type: 'code' },
      { title: '权限管理策略', content: '安全地管理 Claude Code 的操作权限', type: 'text' },
      { title: 'GitHub CLI 集成', content: '无缝集成 GitHub 工作流', type: 'code' }
    ],
    tips: [{ type: 'info', title: '最佳实践', content: 'CLAUDE.md 文件应该放在项目根目录，作为项目的记忆库' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'mcp-commands',
    title: 'MCP 与常用命令',
    description: 'MCP 服务器集成、常用命令参数和自定义 Slash 命令',
    category: 'mcp-commands',
    difficulty: 'intermediate',
    readTime: '12 分钟',
    tags: ['mcp', 'commands', 'integration', 'automation'],
    overview: '掌握 MCP (Model Context Protocol) 服务器的集成和管理，以及如何创建和使用自定义命令。',
    sections: [
      { title: 'MCP 服务器集成', content: '配置和使用 MCP 服务器扩展 Claude Code 功能', type: 'code' },
      { title: '常用命令参数', content: '掌握 Claude Code 的核心命令和参数', type: 'list' },
      { title: '自定义 Slash 命令', content: '创建项目特定的快捷命令', type: 'code' }
    ],
    tips: [{ type: 'tip', title: '扩展性', content: 'MCP 服务器让 Claude Code 具备无限扩展的可能性' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'core-workflow',
    title: '核心工作流程',
    description: '代码生成、调试、重构和测试的核心工作流程',
    category: 'workflow',
    difficulty: 'intermediate',
    readTime: '15 分钟',
    tags: ['coding', 'debugging', 'refactoring', 'testing'],
    overview: '深入了解 Claude Code 在日常开发中的核心工作流程，从代码生成到测试的完整链路。',
    sections: [
      { title: '代码生成最佳实践', content: '如何让 Claude Code 生成高质量代码', type: 'text' },
      { title: '调试和问题解决', content: '使用 Claude Code 进行高效调试', type: 'code' },
      { title: '重构和优化', content: '代码重构的策略和技巧', type: 'text' },
      { title: '测试驱动开发', content: '结合 TDD 的开发流程', type: 'code' }
    ],
    tips: [{ type: 'warning', title: '注意事项', content: '始终保持代码审查的习惯，AI 生成的代码也需要人工验证' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'context-management',
    title: '上下文管理',
    description: '项目记忆库、上下文窗口优化和长期记忆管理',
    category: 'context',
    difficulty: 'advanced',
    readTime: '18 分钟',
    tags: ['context', 'memory', 'optimization', 'management'],
    overview: '掌握 Claude Code 的上下文管理技巧，包括项目记忆库的使用和长期记忆的维护。',
    sections: [
      { title: '项目记忆库设计', content: '如何设计有效的项目记忆库', type: 'text' },
      { title: '上下文窗口优化', content: '最大化利用有限的上下文窗口', type: 'list' },
      { title: '长期记忆管理', content: '维护项目的长期记忆和知识库', type: 'text' }
    ],
    tips: [{ type: 'success', title: '高级技巧', content: '合理的上下文管理可以让 Claude Code 的表现提升 50% 以上' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'automation-batch',
    title: '自动化与批处理',
    description: '无头模式、自动化脚本、Pre-Commit Hooks 和 Claude Code Hooks',
    category: 'automation',
    difficulty: 'advanced',
    readTime: '20 分钟',
    tags: ['automation', 'batch', 'hooks', 'ci-cd'],
    overview: '学习如何将 Claude Code 集成到自动化工作流中，包括 CI/CD 流程和批处理任务。',
    sections: [
      { title: '无头模式使用', content: '在服务器环境中使用 Claude Code', type: 'code' },
      { title: '自动化脚本编写', content: '编写高效的自动化脚本', type: 'code' },
      { title: 'Git Hooks 集成', content: '在 Git 工作流中集成 Claude Code', type: 'code' },
      { title: 'CI/CD 流程集成', content: '在持续集成中使用 Claude Code', type: 'text' }
    ],
    tips: [{ type: 'warning', title: '安全提醒', content: '在自动化环境中使用时，注意 API 密钥的安全管理' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活',
    description: '多实例管理、任务分配和并发优化策略',
    category: 'concurrency',
    difficulty: 'expert',
    readTime: '25 分钟',
    tags: ['concurrency', 'multi-instance', 'optimization', 'scaling'],
    overview: '高级用法：如何同时使用多个 Claude Code 实例来处理复杂项目和大规模任务。',
    sections: [
      { title: '多实例架构设计', content: '设计多 Claude 协作的架构', type: 'text' },
      { title: '任务分配策略', content: '如何合理分配任务给不同实例', type: 'list' },
      { title: '并发控制和同步', content: '避免冲突和保持一致性', type: 'code' },
      { title: '性能监控和优化', content: '监控和优化多实例性能', type: 'text' }
    ],
    tips: [{ type: 'expert', title: '专家级技巧', content: '合理的多实例使用可以将开发效率提升 3-5 倍' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'intelligent-undo',
    title: '智能撤销工具',
    description: '基于 ccundo 工具的智能撤销管理，精确回退和恢复 Claude Code 操作',
    category: 'tools',
    difficulty: 'intermediate',
    readTime: '22 分钟',
    tags: ['ccundo', 'undo', 'safety', 'backup', 'recovery'],
    overview: '掌握 ccundo 智能撤销工具，为 Claude Code 开发提供精确的操作回退和恢复能力，让快速迭代更加安全。',
    sections: [
      { title: '为什么需要智能撤销', content: 'AI 开发面临的新挑战和 ccundo 的价值', type: 'text' },
      { title: '核心功能详解', content: '精确操作追踪、智能预览、级联撤销机制', type: 'list' },
      { title: '实战应用场景', content: '特性开发实验、重构试验、多版本方案比较', type: 'code' },
      { title: '高级技巧和最佳实践', content: '与 Git 协作、团队使用、自动化集成', type: 'text' }
    ],
    tips: [
      { type: 'success', title: '安全保障', content: '有了可靠的撤销机制，可以更大胆地尝试复杂重构和实验性功能' },
      { type: 'tip', title: '级联安全', content: 'ccundo 的级联撤销机制确保项目状态始终保持一致性' }
    ],
    lastUpdated: '2024-08-03',
    version: '1.0.0'
  }
];
