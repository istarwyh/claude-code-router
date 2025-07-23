export const bestPracticesOverviewCardsScript = `
// Best Practices Overview Cards Data
const bestPracticesOverviewCards = [
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
      { title: '自定义 Slash 命令', content: '创建可复用的自定义命令提升效率', type: 'code' }
    ],
    tips: [{ type: 'warning', title: '命令设计原则', content: '自定义命令不要太大，保持小而精，方便组合使用' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'core-workflow',
    title: '核心工作流程',
    description: '探索-计划模式和测试驱动开发(TDD)最佳实践',
    category: 'workflow',
    difficulty: 'advanced',
    readTime: '15 分钟',
    tags: ['tdd', 'exploration', 'planning', 'testing'],
    overview: '深入了解 Claude Code 的核心工作模式，包括探索式开发和测试驱动开发的实践方法。',
    sections: [
      { title: '探索-计划模式', content: '如何使用探索模式理清复杂需求', type: 'text' },
      { title: '测试驱动开发(TDD)', content: '文档先行和测试先行的开发方法', type: 'code' }
    ],
    tips: [{ type: 'success', title: '核心理念', content: '软件工程本质上是知识工程，软件是知识的实践和传递' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'context-management',
    title: '上下文管理',
    description: '详细指令编写、上下文管理和多种数据输入方式',
    category: 'context',
    difficulty: 'intermediate',
    readTime: '10 分钟',
    tags: ['context', 'instructions', 'data-input', 'images'],
    overview: '学习如何有效管理 Claude Code 的上下文，包括精准指令编写和多种数据输入方式。',
    sections: [
      { title: '详细指令编写', content: '如何编写清晰、精准的指令', type: 'text' },
      { title: '上下文管理策略', content: '有效管理对话上下文的方法', type: 'code' },
      { title: '数据输入方式', content: '6种不同的数据输入方法', type: 'list' },
      { title: '结合图片开发', content: '在命令行中使用图片进行开发', type: 'text' }
    ],
    tips: [{ type: 'info', title: '输入技巧', content: '可以直接将图片拖放到 Claude Code 窗口中，或使用 Ctrl+V 粘贴' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'automation-batch',
    title: '自动化与批处理',
    description: '无头模式、自动化脚本、Pre-Commit Hooks 和 Claude Code Hooks',
    category: 'automation',
    difficulty: 'advanced',
    readTime: '18 分钟',
    tags: ['automation', 'headless', 'hooks', 'ci-cd'],
    overview: '掌握 Claude Code 的自动化功能，包括无头模式、各种 Hooks 和 CI/CD 集成。',
    sections: [
      { title: '无头模式(Headless Mode)', content: 'CI/CD 集成和批量处理', type: 'code' },
      { title: '自动化脚本示例', content: 'Issue 自动分类等实用脚本', type: 'code' },
      { title: 'Pre-Commit Hooks', content: '代码提交前的自动检查', type: 'code' },
      { title: 'Claude Code Hooks', content: '生命周期扩展点的使用', type: 'code' }
    ],
    tips: [{ type: 'warning', title: '安全提醒', content: 'Claude Code Hooks 自动化运行后结果自负，请谨慎配置' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  },
  {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活',
    description: '代码审查模式和并行开发策略，提升团队协作效率',
    category: 'collaboration',
    difficulty: 'advanced',
    readTime: '12 分钟',
    tags: ['concurrent', 'collaboration', 'git-worktree', 'review'],
    overview: '学习如何使用多个 Claude 实例进行并行开发和代码审查，最大化开发效率。',
    sections: [
      { title: '代码审查模式', content: '双 Claude 协作进行代码审查', type: 'code' },
      { title: '并行开发策略', content: '使用 Git Worktrees 创建独立环境', type: 'code' },
      { title: '环境隔离', content: '数据库、Redis 等资源的隔离策略', type: 'text' }
    ],
    tips: [{ type: 'info', title: '环境管理', content: '子工作区完成后记得使用 git worktree remove 删除，避免资源浪费' }],
    lastUpdated: '2024-07-23',
    version: '1.0.0'
  }
];

// Render Best Practices Overview Cards
function renderBestPracticesOverviewCards() {
  const container = document.getElementById('best-practices-overview-cards');
  if (!container) {
    console.log('Container not found: best-practices-overview-cards');
    return;
  }

  const categoryIcons = {
    'workflow': '🔄',
    'configuration': '⚙️',
    'mcp-commands': '🛠️',
    'context': '📝',
    'automation': '🤖',
    'collaboration': '👥'
  };

  const difficultyColors = {
    'beginner': '#10b981',
    'intermediate': '#f59e0b', 
    'advanced': '#ef4444'
  };

  const difficultyText = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  };

  const cardsHtml = bestPracticesOverviewCards.map(card => {
    const icon = categoryIcons[card.category] || '📋';
    const difficultyColor = difficultyColors[card.difficulty];
    const difficultyLabel = difficultyText[card.difficulty];
    
    const sectionsHtml = card.sections.map(section => \`
      <li class="overview-card__section-item">
        <span class="overview-card__section-title">\${section.title}</span>
        <span class="overview-card__section-desc">\${section.content}</span>
      </li>
    \`).join('');
    
    const tipsHtml = card.tips ? card.tips.map(tip => \`
      <div class="overview-card__tip overview-card__tip--\${tip.type}">
        <strong>\${tip.title}：</strong>\${tip.content}
      </div>
    \`).join('') : '';
    
    const tagsHtml = card.tags.map(tag => \`
      <span class="overview-card__tag">\${tag}</span>
    \`).join('');
    
    return \`
      <div class="practice-card overview-card" data-card-id="\${card.id}">
        <div class="overview-card__header">
          <div class="overview-card__title-section">
            <div class="overview-card__icon">\${icon}</div>
            <h3 class="overview-card__title">\${card.title}</h3>
          </div>
          <div class="overview-card__meta">
            <span class="overview-card__difficulty" style="--difficulty-color: \${difficultyColor}">
              \${difficultyLabel}
            </span>
            <span class="overview-card__read-time">📖 \${card.readTime}</span>
          </div>
        </div>
        
        <div class="overview-card__content">
          <p class="overview-card__description">\${card.description}</p>
          <div class="overview-card__overview">\${card.overview}</div>
          
          <div class="overview-card__sections">
            <h4 class="overview-card__sections-title">主要内容：</h4>
            <ul class="overview-card__sections-list">
              \${sectionsHtml}
            </ul>
          </div>

          \${tipsHtml ? \`<div class="overview-card__tips">\${tipsHtml}</div>\` : ''}
          
          <div class="overview-card__tags">
            \${tagsHtml}
          </div>
        </div>
        
        <div class="overview-card__footer">
          <button class="overview-card__action-btn" onclick="showDetailedContent('\${card.id}')">
            查看详细内容 →
          </button>
          <div class="overview-card__updated">
            更新时间：\${card.lastUpdated}
          </div>
        </div>
      </div>
    \`;
  }).join('');

  container.innerHTML = \`
    <div class="overview-cards-grid">
      \${cardsHtml}
    </div>
  \`;
  
  console.log('Best Practices Overview Cards rendered successfully');
}

// Global function for detailed content
window.showDetailedContent = function(cardId) {
  console.log('显示详细内容:', cardId);
  alert('即将显示 ' + cardId + ' 的详细内容');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderBestPracticesOverviewCards);
} else {
  renderBestPracticesOverviewCards();
}
`;

export function initializeBestPracticesOverviewCards(): void {
  // This function is now handled by the script string above
  console.log('Initializing Best Practices Overview Cards');
}
