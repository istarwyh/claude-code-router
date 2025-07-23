import { sidebarScript } from './sidebar';
import { navigationScript } from './navigation';
import { codeExamplesScript } from './codeExamples';

// 最佳实践卡片初始化脚本
const bestPracticesInitScript = `
// 最佳实践概览卡片初始化函数
function initializeBestPracticeOverviewCards() {
  if (typeof document === 'undefined') return;
  
  // 初始化所有模块的概览卡片
  const modules = [
    {
      id: 'workflow-overview',
      containerId: 'workflow-overview-cards-container',
      title: '🔄 我现在的工作流',
      description: '基于 Claude Code 的完整开发工作流程',
      difficulty: '初级',
      tag: '工作流',
      highlights: [
        '项目初始化与需求分析',
        '架构设计与代码实现',
        '测试验证与部署上线'
      ],
      route: '#best-practices/workflow'
    },
    {
      id: 'environment-config',
      containerId: 'environment-config-cards-container',
      title: '⚙️ 自定义环境配置',
      description: '优化你的 Claude Code 工作环境',
      difficulty: '中级',
      tag: '配置',
      highlights: [
        '环境变量与配置文件',
        '自定义命令与快捷键',
        '插件与扩展管理'
      ],
      route: '#best-practices/environment'
    },
    {
      id: 'mcp-commands',
      containerId: 'mcp-commands-cards-container',
      title: '🔧 MCP 与常用命令',
      description: 'MCP 服务配置和 Slash 命令使用',
      difficulty: '中级',
      tag: '命令',
      highlights: [
        'MCP 服务配置与管理',
        'Slash 命令速查表',
        '高效命令组合技巧'
      ],
      route: '#best-practices/mcp-commands'
    },
    {
      id: 'core-workflow',
      containerId: 'core-workflow-cards-container',
      title: '🎯 核心工作流程',
      description: '掌握计划 TDD 开发模式',
      difficulty: '高级',
      tag: '流程',
      highlights: [
        'TDD 测试驱动开发',
        '代码审查与重构',
        '持续集成与部署'
      ],
      route: '#best-practices/core-workflow'
    },
    {
      id: 'context-management',
      containerId: 'context-management-cards-container',
      title: '📄 上下文管理',
      description: '指令优化和数据输入技巧',
      difficulty: '中级',
      tag: '管理',
      highlights: [
        '上下文窗口优化',
        '指令模板与复用',
        '数据结构化输入'
      ],
      route: '#best-practices/context'
    },
    {
      id: 'automation',
      containerId: 'automation-cards-container',
      title: '🤖 自动化与批处理',
      description: '无头模式、脚本和 Hooks 配置',
      difficulty: '高级',
      tag: '自动化',
      highlights: [
        '无头模式批处理',
        'Git Hooks 集成',
        '自动化脚本编写'
      ],
      route: '#best-practices/automation'
    },
    {
      id: 'multi-claude',
      containerId: 'multi-claude-cards-container',
      title: '👥 多 Claude 并发干活',
      description: '并行开发策略和协作模式',
      difficulty: '专家',
      tag: '协作',
      highlights: [
        '多实例并发策略',
        '任务分工与协调',
        '代码合并与冲突解决'
      ],
      route: '#best-practices/multi-claude'
    }
  ];

  modules.forEach(module => {
    const container = document.getElementById(module.containerId);
    if (!container) {
      console.warn(\`Container not found: \${module.containerId}\`);
      return;
    }

    try {
      const cardHtml = \`
        <div class="practice-overview-card" data-card-id="\${module.id}" onclick="navigateToPractice('\${module.route}')">
          <div class="overview-card__header">
            <div class="overview-card__title">
              <h4>\${module.title}</h4>
              <div class="overview-card__meta">
                <span class="difficulty-badge difficulty-\${module.difficulty.toLowerCase()}">\${module.difficulty}</span>
                <span class="tag">\${module.tag}</span>
              </div>
            </div>
            <p class="overview-card__description">\${module.description}</p>
          </div>
          <div class="overview-card__content">
            <ul class="overview-highlights">
              \${module.highlights.map(highlight => \`<li>\${highlight}</li>\`).join('')}
            </ul>
          </div>
          <div class="overview-card__footer">
            <span class="learn-more">点击查看详细内容 →</span>
          </div>
        </div>
      `;
      
      container.innerHTML = cardHtml;
    } catch (error) {
      console.error(\`Error initializing \${module.id} card:\`, error);
    }
  });
  
  console.log('Best practice overview cards initialized successfully');
}

// 初始化路由管理器
function initializeBestPracticesRouter() {
  if (typeof window === 'undefined') return;
  
  class BestPracticesRouteManager {
    private currentPage: string = '';
    
    constructor() {
      this.initializeRouting();
    }
    
    initializeRouting() {
      window.addEventListener('hashchange', () => {
        this.handleRouteChange();
      });
      this.handleRouteChange();
    }
    
    handleRouteChange() {
      const hash = window.location.hash;
      
      if (hash.startsWith('#best-practices/')) {
        const subRoute = hash.replace('#best-practices/', '');
        this.showDetailPage(subRoute);
      } else if (hash === '#best-practices') {
        this.showOverviewPage();
      }
    }
    
    showOverviewPage() {
      if (this.currentPage === 'overview') return;
      
      this.currentPage = 'overview';
      
      const overviewPage = document.getElementById('best-practices');
      const detailContainer = document.getElementById('best-practices-detail-container');
      
      if (overviewPage) {
        overviewPage.style.display = 'block';
      }
      
      if (detailContainer) {
        detailContainer.style.display = 'none';
      }
    }
    
    showDetailPage(route: string) {
      if (this.currentPage === route) return;
      
      this.currentPage = route;
      
      const overviewPage = document.getElementById('best-practices');
      if (overviewPage) {
        overviewPage.style.display = 'none';
      }
      
      let detailContainer = document.getElementById('best-practices-detail-container');
      if (!detailContainer) {
        detailContainer = this.createDetailContainer();
      }
      
      detailContainer.style.display = 'block';
      this.renderDetailPage(route, detailContainer);
    }
    
    createDetailContainer() {
      const container = document.createElement('div');
      container.id = 'best-practices-detail-container';
      container.className = 'best-practices-detail-container';
      
      const mainContainer = document.querySelector('.container');
      if (mainContainer) {
        mainContainer.appendChild(container);
      }
      
      return container;
    }
    
    renderDetailPage(route: string, container: HTMLElement) {
      switch (route) {
        case 'workflow':
          this.renderWorkflowDetailPage(container);
          break;
        default:
          container.innerHTML = this.createComingSoonPage(route);
          break;
      }
    }
    
    renderWorkflowDetailPage(container: HTMLElement) {
      const workflowHTML = \`
        <div class="practice-detail-page" id="workflow-detail-page">
          <div class="detail-page__header">
            <div class="breadcrumb">
              <a href="#best-practices" class="breadcrumb-link">⚡ 如何用好 CC</a>
              <span class="breadcrumb-separator">></span>
              <span class="breadcrumb-current">🔄 我现在的工作流</span>
            </div>
            
            <div class="detail-header">
              <div class="detail-title">
                <h1>我现在的工作流</h1>
                <div class="detail-meta">
                  <span class="difficulty-badge difficulty-intermediate">中级</span>
                  <span class="tag">workflow</span>
                  <span class="tag">automation</span>
                </div>
              </div>
              <p class="detail-description">基于 Claude Code 的完整开发工作流程，从需求分析到代码审查的全流程自动化</p>
            </div>
          </div>

          <div class="detail-page__content">
            <div class="detail-section">
              <h2>工作流程步骤</h2>
              <ul class="workflow-steps">
                <li>有需要并发则创建多工作区</li>
                <li>在子工作区中每个分支启动 Claude 无限制模式</li>
                <li>从 GitHub 创建或拉取 Issue，明确任务目标</li>
                <li>向 Claude 分派具体的编码任务</li>
                <li>对于复杂需求，使用探索模式理清需求并输出 TDD 技术方案</li>
                <li>Claude 执行技术方案并编写代码</li>
                <li>提交 Pull Request 到 GitHub</li>
                <li>使用 AI 代码审查员进行代码审查</li>
                <li>Claude 处理审查意见并修复代码</li>
                <li>反思工作流程，将重复性工作抽象为 Slash Commands</li>
              </ul>
            </div>

            <div class="tips-section">
              <h2>💡 实用技巧</h2>
              <div class="tip-item">
                <span class="tip-icon">⚡</span>
                <div class="tip-content">
                  <h4>并发开发</h4>
                  <p>为不同的功能模块创建独立的工作区，可以同时进行多个任务的开发</p>
                </div>
              </div>
              <div class="tip-item">
                <span class="tip-icon">🔍</span>
                <div class="tip-content">
                  <h4>探索模式</h4>
                  <p>对于复杂需求，先让 Claude 进入探索模式理清需求，再制定技术方案</p>
                </div>
              </div>
            </div>

            <div class="navigation-buttons">
              <a href="#best-practices" class="btn btn-secondary">← 返回概览</a>
              <a href="#best-practices/environment" class="btn btn-primary">下一个：自定义环境配置 →</a>
            </div>
          </div>
        </div>
      \`;
      
      container.innerHTML = workflowHTML;
      
      // 初始化 Mermaid
      if (typeof (window as any).mermaid !== 'undefined') {
        (window as any).mermaid.init();
      }
    }
    
    createComingSoonPage(route: string) {
      return `
        <div class="practice-detail-page coming-soon-page">
          <div class="detail-page__header">
            <div class="breadcrumb">
              <a href="#best-practices" class="breadcrumb-link">⚡ 如何用好 CC</a>
              <span class="breadcrumb-separator">></span>
              <span class="breadcrumb-current">${route}</span>
            </div>
          </div>
          
          <div class="detail-page__content">
            <div class="coming-soon-content">
              <h1>🚧 敬请期待</h1>
              <p>该模块正在开发中，敬请期待...</p>
              <a href="#best-practices" class="btn btn-primary">← 返回概览</a>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  // 创建全局路由管理器实例
  if (!(window as any).bestPracticesRouteManager) {
    (window as any).bestPracticesRouteManager = new BestPracticesRouteManager();
  }
  
  // 全局导航函数
  (window as any).navigateToPractice = function(practiceId: string) {
    window.location.hash = `#best-practices/${practiceId}`;
  };
}

// 自动初始化（只在浏览器环境中）
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeBestPracticeOverviewCards();
    initializeBestPracticesRouter();
  });
  
  // 如果页面已经加载完成，立即初始化
  if (document.readyState === 'loading') {
    // 等待 DOMContentLoaded
  } else {
    // DOM 已经准备好
    initializeBestPracticeOverviewCards();
  }
}

// 路由变化时重新初始化（只在浏览器环境中）
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#best-practices') {
      setTimeout(() => {
        initializeBestPracticeOverviewCards();
      }, 100);
    }
  });
}
`;

export const allScripts = `
${sidebarScript}
${navigationScript}
${codeExamplesScript}
${bestPracticesInitScript}
`;
