import { ArticleService } from '../services/ArticleService';
import { ArticleRenderer } from '../renderers/ArticleRenderer';
import { MarkdownViewer } from '../../../../shared/components/markdownViewer';
import { SafeMarkdownRenderer } from '../../../../shared/utils/markdownRenderer';
import { injectMarkdownStyles } from '../styles/markdownStyles';

export class EventHandler {
  private containerId: string;
  private boundClickHandler: (e: Event) => void;
  private articleService: ArticleService;
  private articleRenderer: ArticleRenderer;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.boundClickHandler = this.handleCardClick.bind(this);
    this.articleService = new ArticleService();
    this.articleRenderer = new ArticleRenderer();
  }

  public bindEventListeners(): void {
    console.log('开始绑定事件监听器');
    
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`未找到容器元素: ${this.containerId}`);
      return;
    }
    
    console.log('找到容器元素:', container);
    
    this.removeExistingListeners(container);
    this.addEventListeners(container);
    
    console.log('事件委托绑定完成');
  }

  private removeExistingListeners(container: HTMLElement): void {
    container.removeEventListener('click', this.boundClickHandler);
  }

  private addEventListeners(container: HTMLElement): void {
    // 添加事件委托监听器
    container.addEventListener('click', this.boundClickHandler);
    
    // 添加通用点击监听器用于调试  
    container.addEventListener('click', function(e) {
      console.log('容器收到点击事件:', {
        target: e.target,
        targetClass: (e.target as HTMLElement).className,
        targetTag: (e.target as HTMLElement).tagName
      });
    }, true);
  }

  private handleCardClick(e: Event): void {
    const event = e as MouseEvent;
    const target = event.target as HTMLElement;
    
    console.log('handleCardClick被调用:', target);
    
    // 检查当前是否在文章详情页面
    const isInArticleView = document.querySelector('.practice-article');
    if (isInArticleView) {
      console.log('当前在文章详情页面，忽略点击事件');
      return;
    }
    
    // 查找按钮元素
    const button = target.closest('.overview-card__action-btn') as HTMLElement;
    if (!button) {
      console.log('点击的不是操作按钮');
      return;
    }
    
    console.log('找到操作按钮:', button);
    
    const cardId = button.getAttribute('data-card-id');
    if (!cardId) {
      console.error('按钮缺少 data-card-id 属性');
      return;
    }
    
    console.log('准备显示详细内容:', cardId);
    this.showDetailedContent(cardId);
  }

  private async showDetailedContent(cardId: string): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`未找到容器元素: ${this.containerId}`);
      return;
    }

    try {
      // 注入 Markdown 样式
      injectMarkdownStyles();
      
      // 显示加载状态
      container.innerHTML = this.articleRenderer.renderLoadingState();
      
      // 获取文章内容
      const article = await this.articleService.getArticle(cardId);
      
      // 渲染文章的 HTML 结构（不包含内容）
      const articleHtml = this.articleRenderer.renderArticle(article.title, article.content);
      container.innerHTML = articleHtml;
      
      // 使用 MarkdownViewer 渲染 Markdown 内容
      const markdownContainer = document.getElementById('markdown-content-container');
      if (markdownContainer) {
        // 创建一个临时的 SafeMarkdownRenderer 实例
        const renderer = new SafeMarkdownRenderer();
        console.log('About to render raw markdown with SafeMarkdownRenderer');
        const renderedHtml = renderer.render(article.rawMarkdown);
        
        // 渲染并应用样式
        markdownContainer.innerHTML = `<div class="markdown-content">${renderedHtml}</div>`;
        
        // 应用代码高亮和 Mermaid 渲染
        renderer.highlightCode(markdownContainer);
        
        // 添加增强功能
        this.addEnhancedFeatures(markdownContainer);
      }
      
      // 暴露返回函数到全局作用域
      (window as any).showOverviewCards = () => {
        // 重新初始化概览卡片
        (window as any).initializeBestPractices();
      };
      
    } catch (error) {
      console.error('加载文章失败:', error);
      const errorHtml = this.articleRenderer.renderErrorState(error.message);
      container.innerHTML = errorHtml;
    }
  }

  /**
   * 添加增强功能
   */
  private addEnhancedFeatures(container: HTMLElement): void {
    this.addCopyButtonsToCodeBlocks(container);
    this.addReadingProgress();
    this.addBackToTopButton();
  }

  /**
   * 为代码块添加复制按钮
   */
  private addCopyButtonsToCodeBlocks(container: HTMLElement): void {
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      if (!block.querySelector('.copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制';
        copyButton.onclick = () => this.copyCodeBlock(block, copyButton);
        block.appendChild(copyButton);
      }
    });
  }

  /**
   * 复制代码块内容
   */
  private copyCodeBlock(block: HTMLElement, button: HTMLElement): void {
    const code = block.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        button.textContent = '已复制';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = '复制';
          button.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        button.textContent = '复制失败';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      });
    }
  }

  /**
   * 添加阅读进度条
   */
  private addReadingProgress(): void {
    // 移除已存在的进度条
    const existingProgress = document.querySelector('.reading-progress');
    if (existingProgress) {
      existingProgress.remove();
    }

    // 创建新的进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    // 监听滚动事件
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // 初始化
  }

  /**
   * 添加返回顶部按钮
   */
  private addBackToTopButton(): void {
    // 移除已存在的按钮
    const existingButton = document.querySelector('.back-to-top');
    if (existingButton) {
      existingButton.remove();
    }

    // 创建返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(backToTopButton);

    // 监听滚动显示/隐藏按钮
    const toggleBackToTop = () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // 初始化
  }
}
