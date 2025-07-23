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
          <button class="overview-card__action-btn" data-card-id="\${card.id}">
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

// 集中的事件绑定函数，遵循最佳实践
function bindEventListeners() {
  console.log('开始绑定事件监听器');
  
  // 使用事件委托方式，避免闭包问题
  const container = document.getElementById('best-practices-overview-cards');
  if (!container) {
    console.error('未找到容器元素');
    return;
  }
  
  console.log('找到容器元素:', container);
  
  // 检查容器内的按钮
  const buttons = container.querySelectorAll('.overview-card__action-btn');
  console.log('容器内找到的按钮数量:', buttons.length);
  buttons.forEach((btn, index) => {
    console.log(\`按钮 \${index + 1}:\`, {
      class: btn.className,
      cardId: btn.getAttribute('data-card-id'),
      text: btn.textContent.trim()
    });
  });
  
  // 移除之前的事件监听器（如果存在）
  container.removeEventListener('click', handleCardClick);
  
  // 添加事件委托监听器
  container.addEventListener('click', handleCardClick);
  
  // 添加通用点击监听器用于调试
  container.addEventListener('click', function(e) {
    console.log('容器收到点击事件:', {
      target: e.target,
      targetClass: e.target.className,
      targetTag: e.target.tagName
    });
  }, true); // 使用捕获阶段
  
  console.log('事件委托绑定完成');
}

// 处理卡片点击的函数
function handleCardClick(e) {
  console.log('handleCardClick被调用:', e.target);
  
  // 检查点击的是否是按钮，或者是卡片内的其他元素
  let targetButton = null;
  
  if (e.target.classList.contains('overview-card__action-btn')) {
    // 直接点击按钮
    targetButton = e.target;
    console.log('直接点击按钮');
  } else {
    // 点击的是卡片内的其他元素，找到对应的按钮
    const card = e.target.closest('.practice-card');
    if (card) {
      targetButton = card.querySelector('.overview-card__action-btn');
      console.log('点击卡片内元素，找到对应按钮:', targetButton);
    }
  }
  
  if (targetButton) {
    console.log('确认找到目标按钮');
    e.preventDefault();
    e.stopPropagation();
    
    const cardId = targetButton.getAttribute('data-card-id');
    console.log('点击事件被触发！卡片ID:', cardId);
    
    if (cardId) {
      // 验证按钮状态
      const styles = window.getComputedStyle(targetButton);
      console.log('按钮CSS状态:', {
        pointerEvents: styles.pointerEvents,
        display: styles.display,
        visibility: styles.visibility,
        zIndex: styles.zIndex,
        position: styles.position
      });
      
      window.showDetailedContent(cardId);
    } else {
      console.error('未找到卡片ID');
    }
  } else {
    console.log('点击的不是按钮，也没找到对应的卡片:', e.target.className, e.target.tagName);
  }
}

// Global function for detailed content
window.showDetailedContent = function(cardId) {
  console.log('显示详细内容:', cardId);
  
  // 映射卡片ID到文章ID
  const cardIdMapping = {
    'workflow-overview': 'current-workflow',
    'environment-config': 'environment-config',
    'mcp-commands': 'mcp-commands', 
    'core-workflow': 'core-workflow',
    'context-management': 'context-management',
    'automation-batch': 'automation-batch',
    'concurrent-claude': 'concurrent-claude'
  };
  
  const articleId = cardIdMapping[cardId] || cardId;
  
  // 直接使用简单的加载器，不依赖其他组件
  loadArticleContent(articleId);
};

// 简单的文章内容加载器（作为备用方案）
function loadArticleContent(articleId) {
  const container = document.getElementById('best-practices-overview-cards');
  if (!container) return;
  
  // 显示加载状态
  container.innerHTML = \`
    <div class="article-loading" style="text-align: center; padding: 60px 30px;">
      <div style="width: 40px; height: 40px; margin: 0 auto 20px; border: 4px solid #f3f4f6; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <h2 style="color: #374151; margin-bottom: 16px;">正在加载文章内容...</h2>
      <p style="color: #6b7280; margin-bottom: 30px;">请稍候，我们正在为您准备详细内容。</p>
      <button onclick="showBestPracticesOverview()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">← 返回概览</button>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  \`;
  
  // 尝试从实际的 markdown 文件加载内容
  const markdownPath = \`/modules/best-practices/articles/\${articleId}.md\`;
  
  fetch(markdownPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('文章文件未找到');
      }
      return response.text();
    })
    .then(markdownContent => {
      // 简单的 markdown 转 HTML（基础版本）
      const htmlContent = parseMarkdownToHtml(markdownContent);
      const articleTitle = extractTitleFromMarkdown(markdownContent);
      
      displayArticle(articleId, {
        title: articleTitle,
        content: htmlContent
      });
    })
    .catch(error => {
      console.error('加载文章失败:', error);
      // 降级到静态内容
      const articleContent = getArticleContent(articleId);
      displayArticle(articleId, articleContent);
    });
}

// 从 markdown 内容中提取标题
function extractTitleFromMarkdown(markdown) {
  const titleMatch = markdown.match(/^#\\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : '未知标题';
}

// 简单的 markdown 转 HTML 解析器
function parseMarkdownToHtml(markdown) {
  return markdown
    // 标题
    .replace(/^### (.+)$/gm, '<h3>\$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>\$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>\$1</h1>')
    // 段落
    .replace(/^> (.+)$/gm, '<blockquote>\$1</blockquote>')
    // 列表
    .replace(/^\\d+\\.\\s+(.+)$/gm, '<li>\$1</li>')
    .replace(/^-\\s+(.+)$/gm, '<li>\$1</li>')
    .replace(/(<li>.*<\\/li>)/s, '<ol>\$1</ol>')
    // 代码块
    .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>\$1</code></pre>')
    // 内联代码
    .replace(/\`([^\`]+)\`/g, '<code>\$1</code>')
    // 粗体
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>\$1</strong>')
    // 换行为段落
    .split('\\n\\n')
    .map(para => para.trim() ? (para.startsWith('<') ? para : \`<p>\${para}</p>\`) : '')
    .filter(para => para)
    .join('\\n');
}

// 获取文章内容（静态内容作为演示）
function getArticleContent(articleId) {
  const articles = {
    'current-workflow': {
      title: '我现在的工作流 - 基于 Claude Code 的完整开发实践',
      content: \`
        <h1>我现在的工作流</h1>
        <p>基于 Claude Code，我综合了最佳实践形成了自己的工作流。整个过程中，我只需要提出需求以及 Review，Claude Code 承担了大部分的编码和实现工作。</p>
        
        <h2>核心理念</h2>
        <p>现代 AI 驱动的开发流程核心是：<strong>人负责需求定义和质量把关，AI 负责具体实现</strong>。</p>
        
        <h2>完整工作流程</h2>
        <ol>
          <li>创建多工作区（并发开发时）</li>
          <li>启动 Claude 无限制模式</li>
          <li>Issue 管理和任务分派</li>
          <li>技术方案设计（复杂需求）</li>
          <li>代码实现</li>
          <li>代码审查</li>
          <li>反馈处理</li>
          <li>流程自动化</li>
        </ol>
        
        <h2>关键成功要素</h2>
        <ul>
          <li><strong>清晰的需求定义</strong>：Issue 描述要详细具体</li>
          <li><strong>有效的沟通方式</strong>：使用精确的技术词汇</li>
          <li><strong>质量保证机制</strong>：多重 AI 代码审查</li>
          <li><strong>流程优化意识</strong>：识别重复性工作</li>
        </ul>
      \`
    },
    'environment-config': {
      title: '自定义环境配置',
      content: \`
        <h1>自定义环境配置</h1>
        <p>配置 CLAUDE.md 文件、权限管理和 GitHub CLI 集成。</p>
        
        <h2>CLAUDE.md 项目记忆库</h2>
        <p>CLAUDE.md 是一个特殊的项目文件，用于存储项目的上下文信息。</p>
        
        <h2>权限管理策略</h2>
        <pre><code># 查看当前权限
/permissions

# 允许特定操作
/permissions add Edit
/permissions add Bash(git commit:*)

# 跳过所有权限检查（谨慎使用）
claude --dangerously-skip-permissions</code></pre>
        
        <h2>GitHub CLI 集成</h2>
        <pre><code># 安装
brew install gh  # macOS

# 常用操作
gh pr create
gh issue view
gh issue edit --add-label</code></pre>
      \`
    },
    'mcp-commands': {
      title: 'MCP 与常用命令',
      content: \`
        <h1>MCP 与常用命令</h1>
        <p>MCP 服务器集成、常用命令参数和自定义 Slash 命令。</p>
        
        <h2>MCP 服务器集成</h2>
        <p>MCP (Model Context Protocol) 允许 Claude Code 访问外部工具和服务。</p>
        
        <h2>常用命令参数</h2>
        <pre><code># 基本用法
claude "创建一个React组件"

# 指定文件
claude --file src/App.js "修复这个bug"

# 并发模式
claude --concurrent "同时处理多个任务"</code></pre>
        
        <h2>自定义 Slash 命令</h2>
        <p>创建可复用的命令模板，提升开发效率。</p>
        <pre><code># 创建自定义命令
/create-slash review "进行代码审查"</code></pre>
      \`
    },
    'core-workflow': {
      title: '核心工作流程',
      content: \`
        <h1>核心工作流程</h1>
        <p>探索-计划模式和测试驱动开发(TDD)最佳实践。</p>
        
        <h2>探索-计划模式</h2>
        <p>对于复杂需求，使用探索模式先理解问题域，再制定实现计划。</p>
        
        <h2>测试驱动开发(TDD)</h2>
        <p>文档先行、测试先行的开发方法论。</p>
        
        <h3>TDD 流程</h3>
        <ol>
          <li>编写测试用例</li>
          <li>运行测试（预期失败）</li>
          <li>编写最小可行代码</li>
          <li>运行测试（预期通过）</li>
          <li>重构代码</li>
        </ol>
      \`
    },
    'context-management': {
      title: '上下文管理',
      content: \`
        <h1>上下文管理</h1>
        <p>详细指令编写、上下文管理和多种数据输入方式。</p>
        
        <h2>详细指令编写</h2>
        <p>使用 SMART 原则编写指令：</p>
        <ul>
          <li><strong>Specific</strong> - 具体明确</li>
          <li><strong>Measurable</strong> - 可衡量</li>
          <li><strong>Achievable</strong> - 可实现</li>
          <li><strong>Relevant</strong> - 相关性</li>
          <li><strong>Time-bound</strong> - 有时限</li>
        </ul>
        
        <h2>数据输入方式</h2>
        <ol>
          <li>直接文本输入</li>
          <li>文件拖放</li>
          <li>Ctrl+V 粘贴</li>
          <li>@ 引用文件</li>
          <li>截图输入</li>
          <li>代码块粘贴</li>
        </ol>
      \`
    },
    'automation-batch': {
      title: '自动化与批处理',
      content: \`
        <h1>自动化与批处理</h1>
        <p>无头模式、自动化脚本、Pre-Commit Hooks 和 Claude Code Hooks。</p>
        
        <h2>无头模式(Headless Mode)</h2>
        <p>适用于 CI/CD 集成和批量处理。</p>
        <pre><code># 无头模式执行
claude --headless --input "task.md" --output "result.md"</code></pre>
        
        <h2>Pre-Commit Hooks</h2>
        <p>代码提交前的自动检查。</p>
        <pre><code># .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: claude-review
        name: Claude Code Review
        entry: claude
        language: system</code></pre>
        
        <h2>Claude Code Hooks</h2>
        <p>生命周期扩展点的使用。</p>
      \`
    },
    'concurrent-claude': {
      title: '多 Claude 并发干活',
      content: \`
        <h1>多 Claude 并发干活</h1>
        <p>代码审查模式和并行开发策略，提升团队协作效率。</p>
        
        <h2>代码审查模式</h2>
        <p>使用两个 Claude 实例进行代码审查：</p>
        <ul>
          <li>Claude A：负责代码实现</li>
          <li>Claude B：负责代码审查</li>
        </ul>
        
        <h2>并行开发策略</h2>
        <p>使用 Git Worktrees 创建独立的开发环境。</p>
        <pre><code># 创建工作树
git worktree add ../feature-branch feature-branch

# 切换到工作树
cd ../feature-branch</code></pre>
        
        <h2>环境隔离</h2>
        <p>数据库、Redis 等资源的隔离策略。</p>
      \`
    }
  };
  
  return articles[articleId] || {
    title: '文章未找到',
    content: '<p>抱歉，该文章内容暂时不可用。</p>'
  };
}

// 显示文章内容
function displayArticle(articleId, article) {
  const container = document.getElementById('best-practices-overview-cards');
  if (!container) return;
  
  container.innerHTML = \`
    <div class="article-container" style="max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
      <div class="article-header" style="padding: 20px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <button onclick="showBestPracticesOverview()" style="background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
          ← 返回概览
        </button>
        <h1 style="margin: 15px 0 0 0; font-size: 1.5rem;">\${article.title}</h1>
      </div>
      
      <div class="article-content" style="padding: 40px 30px; line-height: 1.7; color: #374151;">
        \${article.content}
      </div>
    </div>
  \`;
}

// 返回概览页面的函数
window.showBestPracticesOverview = function() {
  console.log('返回最佳实践概览页面');
  renderBestPracticesOverviewCards();
  // 重新绑定事件监听器
  setTimeout(bindEventListeners, 100);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // 等待更长时间确保其他系统已加载
    setTimeout(function() {
      renderBestPracticesOverviewCards();
      console.log('脚本版本渲染完成');
      bindEventListeners();
    }, 500);
  });
} else {
  // 等待更长时间确保其他系统已加载
  setTimeout(function() {
    renderBestPracticesOverviewCards();
    console.log('脚本版本渲染完成');
    bindEventListeners();
  }, 500);
}
`;

export function initializeBestPracticesOverviewCards(): void {
  // This function is now handled by the script string above
  console.log('Initializing Best Practices Overview Cards');
}