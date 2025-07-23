import { ArticleContentLoader } from './ArticleContentLoader';
import { bestPracticesOverviewCards } from '../data/bestPracticesOverviewData';

// 声明全局 window 属性
declare global {
  interface Window {
    showDetailedContent: (cardId: string) => void;
    showBestPracticesOverview: () => void;
    bestPracticesArticleDisplay: ArticleDisplayComponent;
    toggleFooterVisibility: (isArticleView: boolean) => void;
    updateBreadcrumb: (isArticleView: boolean, articleTitle?: string) => void;
    scrollToTop: () => void;
  }
}

/**
 * 文章显示组件
 * 负责显示详细的最佳实践文章
 */
export class ArticleDisplayComponent {
  private containerId: string;
  private currentCardId: string | null = null;
  private contentLoader: ArticleContentLoader;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.contentLoader = ArticleContentLoader.getInstance();
  }

  /**
   * 显示文章详细内容
   */
  public async showArticle(cardId: string): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with id ${this.containerId} not found`);
      return;
    }

    this.currentCardId = cardId;

    // 显示加载状态
    container.innerHTML = this.renderLoadingState(cardId);

    try {
      // 加载文章内容
      const articleContent = await this.contentLoader.loadArticleContent(cardId);
      
      // 获取卡片数据
      const cardData = bestPracticesOverviewCards.find(card => card.id === cardId);
      
      // 渲染完整的文章页面
      container.innerHTML = this.renderArticlePage(cardData, articleContent);
      
      // 更新导航状态
      if (typeof window !== 'undefined') {
        // 隐藏页脚提示
        if (window.toggleFooterVisibility) {
          window.toggleFooterVisibility(true);
        }
        
        // 更新面包屑导航
        if (window.updateBreadcrumb && cardData) {
          window.updateBreadcrumb(true, cardData.title);
        }
      }
      
      // 初始化文章页面的交互功能
      this.initializeArticleInteractions();
      
      // 滚动到顶部
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
    } catch (error) {
      console.error('Error displaying article:', error);
      container.innerHTML = this.renderErrorState(cardId);
    }
  }

  /**
   * 渲染加载状态
   */
  private renderLoadingState(cardId: string): string {
    const cardData = bestPracticesOverviewCards.find(card => card.id === cardId);
    const title = cardData?.title || '加载中...';

    return `
      <div class="article-container article-loading">
        <div class="article-header">
          <button class="article-back-btn" onclick="showBestPracticesOverview()">
            ← 返回概览
          </button>
          <div class="article-breadcrumb">
            <span>如何用好 CC</span> <span class="breadcrumb-separator">></span> <span>${title}</span>
          </div>
        </div>
        
        <div class="article-loading-content">
          <div class="loading-spinner"></div>
          <h2>正在加载文章内容...</h2>
          <p>请稍候，我们正在为您准备 "${title}" 的详细内容。</p>
        </div>
      </div>
    `;
  }

  /**
   * 渲染错误状态
   */
  private renderErrorState(cardId: string): string {
    const cardData = bestPracticesOverviewCards.find(card => card.id === cardId);
    const title = cardData?.title || '未知文章';

    return `
      <div class="article-container article-error">
        <div class="article-header">
          <button class="article-back-btn" onclick="showBestPracticesOverview()">
            ← 返回概览
          </button>
          <div class="article-breadcrumb">
            <span>如何用好 CC</span> <span class="breadcrumb-separator">></span> <span>${title}</span>
          </div>
        </div>
        
        <div class="article-error-content">
          <div class="error-icon">⚠️</div>
          <h2>文章加载失败</h2>
          <p>很抱歉，无法加载 "${title}" 的内容。</p>
          <div class="error-actions">
            <button class="retry-btn" onclick="showDetailedContent('${cardId}')">
              🔄 重试
            </button>
            <button class="back-btn" onclick="showBestPracticesOverview()">
              返回概览
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染完整的文章页面
   */
  private renderArticlePage(cardData: any, articleContent: string): string {
    if (!cardData) {
      return this.renderErrorState(this.currentCardId || '');
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

    const difficultyMap = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级'
    };

    return `
      <div class="article-container">
        <div class="article-header">
          <button class="article-back-btn" onclick="showBestPracticesOverview()">
            ← 返回概览
          </button>
          <div class="article-breadcrumb">
            <span>如何用好 CC</span> <span class="breadcrumb-separator">></span> <span>${cardData.title}</span>
          </div>
        </div>

        <div class="article-hero">
          <div class="article-hero__content">
            <div class="article-hero__meta">
              <span class="article-hero__icon">
                ${categoryIcons[cardData.category as keyof typeof categoryIcons] || '📋'}
              </span>
              <span class="article-hero__category">${cardData.category}</span>
              <span class="article-hero__difficulty" style="--difficulty-color: ${difficultyColors[cardData.difficulty]}">
                ${difficultyMap[cardData.difficulty] || cardData.difficulty}
              </span>
              <span class="article-hero__read-time">📖 ${cardData.readTime}</span>
            </div>
            
            <h1 class="article-hero__title">${cardData.title}</h1>
            <p class="article-hero__description">${cardData.description}</p>
            
            <div class="article-hero__tags">
              ${cardData.tags.map((tag: string) => `
                <span class="article-hero__tag">${tag}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="article-nav">
          <div class="article-nav__content">
            <h3>📋 文章导航</h3>
            <div class="article-nav__sections">
              ${cardData.sections.map((section: any, index: number) => `
                <a href="#section-${index + 1}" class="article-nav__link">
                  <span class="nav-number">${index + 1}</span>
                  <span class="nav-title">${section.title}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="article-content">
          <div class="article-content__wrapper">
            ${articleContent}
          </div>
        </div>

        <div class="article-footer">
          <div class="article-footer__info">
            <p><strong>最后更新：</strong>${cardData.lastUpdated}</p>
            <p><strong>阅读难度：</strong>${difficultyMap[cardData.difficulty] || cardData.difficulty}</p>
            <p><strong>预计阅读时间：</strong>${cardData.readTime}</p>
          </div>
          
          <div class="article-footer__actions">
            <button class="article-footer__btn article-footer__btn--primary" onclick="showBestPracticesOverview()">
              返回概览
            </button>
            <button class="article-footer__btn article-footer__btn--secondary" onclick="scrollToTop()">
              回到顶部
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 初始化文章页面的交互功能
   */
  private initializeArticleInteractions(): void {
    // 代码高亮（如果需要）
    this.initializeCodeHighlighting();
    
    // Mermaid 图表渲染（如果需要）
    this.initializeMermaidDiagrams();
    
    // 导航链接平滑滚动
    this.initializeSmoothScrolling();
    
    // 返回顶部功能
    this.initializeScrollToTop();
  }

  /**
   * 初始化代码高亮
   */
  private initializeCodeHighlighting(): void {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      // 这里可以集成 Prism.js 或其他代码高亮库
      block.classList.add('highlighted');
    });
  }

  /**
   * 初始化 Mermaid 图表
   */
  private initializeMermaidDiagrams(): void {
    const mermaidBlocks = document.querySelectorAll('.mermaid');
    if (mermaidBlocks.length > 0) {
      // 这里可以集成 Mermaid.js
      console.log('Found Mermaid diagrams:', mermaidBlocks.length);
      // 简单的占位符处理
      mermaidBlocks.forEach((block) => {
        block.innerHTML = `<div class="mermaid-placeholder">📊 Mermaid 图表（开发中）</div>`;
      });
    }
  }

  /**
   * 初始化平滑滚动
   */
  private initializeSmoothScrolling(): void {
    const navLinks = document.querySelectorAll('.article-nav__link');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /**
   * 初始化返回顶部功能
   */
  private initializeScrollToTop(): void {
    if (typeof window !== 'undefined') {
      (window as any).scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }
  }

  /**
   * 显示概览页面
   */
  public showOverview(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // 恢复导航状态
    if (typeof window !== 'undefined') {
      // 显示页脚提示
      if (window.toggleFooterVisibility) {
        window.toggleFooterVisibility(false);
      }
      
      // 移除面包屑导航
      if (window.updateBreadcrumb) {
        window.updateBreadcrumb(false, '');
      }
    }

    // 重新加载概览页面
    this.loadOverviewPage();
    
    // 清空当前文章ID
    this.currentCardId = null;
  }

  /**
   * 加载概览页面
   */
  private loadOverviewPage(): void {
    // 这个方法将在后面与导航系统集成时实现
    console.log('Loading overview page...');
  }

  /**
   * 获取当前显示的文章ID
   */
  public getCurrentCardId(): string | null {
    return this.currentCardId;
  }
}