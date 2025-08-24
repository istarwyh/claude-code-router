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
    id: 'software-engineering-with-claude',
    title: '软件工程与 Claude',
    description: '用软件工程方法驯服 AI：Brief、KISS、YAGNI、DRY、SOLID 的落地指南',
    category: 'workflow',
    difficulty: 'intermediate',
    readTime: '10 分钟',
    imageUrl: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*tLFdzFI5tHrMRwYLoYZGBw.jpeg',
    tags: ['KISS', 'YAGNI', 'DRY', 'SOLID', 'Brief'],
    tips: [
      { type: 'info', title: '流程先行', content: '先定义数据与边界，再写代码' },
      { type: 'success', title: '减复杂', content: '消除特殊分支，代码自然变短' }
    ],
    sections: [
      { title: 'Brief', content: '函数短小、参数精简、纯函数优先', type: 'text' },
      { title: 'KISS', content: '能直不绕，优先简单方案', type: 'text' },
      { title: 'YAGNI', content: '不为未来的假想需求提前设计', type: 'text' },
      { title: 'DRY', content: '消除重复，抽象在恰当层次', type: 'text' },
      { title: 'SOLID', content: '以可维护性为核心的 OO 原则', type: 'text' }
    ]
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
  },
  {
    id: 'agent-linus-torvalds',
    title: 'Linus Torvalds Agent',
    category: 'workflow',
    difficulty: 'expert',
    readTime: '15 分钟',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg/256px-LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg',
    tags: ['Linus', 'Linux', '代码品味', '实用主义', '工程质量'],
    tips: [
      { type: 'expert', title: '好品味', content: '复杂性是万恶之源，3层缩进是极限' },
      { type: 'warning', title: 'Never break userspace', content: '向后兼容性是神圣不可侵犯的' },
      { type: 'info', title: '实用主义', content: '为现实服务，不为论文服务' }
    ]
  }
];
