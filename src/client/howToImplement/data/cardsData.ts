import type { ImplementCard } from '../../shared/types/ContentCard';

export const howToImplementCards: ImplementCard[] = [
  {
    id: 'claude-code-conversation-example-1',
    title: 'Claude Code 对话示例',
    description: '真实的 Claude Code 使用对话记录，展示完整的开发流程和交互模式',
    category: 'conversation',
    difficulty: 'beginner',
    readTime: '15 分钟',
    tags: ['对话示例', '实际案例', '工作流程', 'Python开发'],
    overview: '通过真实对话记录了解 Claude Code 的工作方式，学习如何与 AI 协作开发俄罗斯方块游戏。',
    sections: [
      { title: '对话流程分析', content: '从需求提出到代码完成的完整交互过程', type: 'text' },
      { title: '工具使用示例', content: 'TodoWrite、LS、Write、Edit 等工具的实际应用', type: 'code' },
      { title: '任务分解策略', content: '如何将复杂任务拆分为可管理的步骤', type: 'list' }
    ],
    tips: [
      { 
        type: 'success', 
        title: '学习要点', 
        content: '注意观察 Claude Code 如何使用 TodoWrite 工具来规划和跟踪任务进度' 
      },
      { 
        type: 'tip', 
        title: '实践建议', 
        content: '尝试模仿对话中的交互模式来提升你与 Claude Code 的协作效率' 
      }
    ],
    lastUpdated: '2024-08-02',
    version: '1.0.0'
  },
  {
    id: 'claude-code-system-prompt',
    title: 'Claude Code 系统提示词',
    description: '深入了解 Claude Code 的内部工作机制和系统提示词设计',
    category: 'system-prompt',
    difficulty: 'advanced',
    readTime: '25 分钟',
    tags: ['系统提示词', '内部机制', 'AI架构', '工具使用'],
    overview: '详细解析 Claude Code 的系统提示词，理解其设计理念和工作原理。',
    sections: [
      { title: '系统提示词结构', content: '分析提示词的组织方式和各个部分的作用', type: 'text' },
      { title: '工具定义和使用', content: '了解各种工具的定义和调用机制', type: 'code' },
      { title: '交互规则和约束', content: '掌握 Claude Code 的行为规则和限制条件', type: 'list' },
      { title: '最佳实践指导', content: '学习如何编写有效的用户指令', type: 'text' }
    ],
    tips: [
      { 
        type: 'expert', 
        title: '深度理解', 
        content: '理解系统提示词有助于更好地与 Claude Code 协作和定制化使用' 
      },
      { 
        type: 'warning', 
        title: '注意事项', 
        content: '系统提示词包含了 Claude Code 的核心逻辑，理解后可以更精准地提出需求' 
      }
    ],
    lastUpdated: '2024-08-02',
    version: '1.0.0'
  }
];