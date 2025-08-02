import { ArticleRenderer } from '../../bestPractices/renderers/ArticleRenderer';
import { HowToImplementService } from '../services/HowToImplementService';
import { MarkdownParser } from '../../bestPractices/services/MarkdownParser';
import { SafeMarkdownRenderer } from '../../../../shared/utils/markdownRenderer';
import { injectMarkdownStyles } from '../../bestPractices/styles/markdownStyles';

export class HowToImplementEventHandler {
  private containerId: string;
  private boundClickHandler: (e: Event) => void;
  private contentService: HowToImplementService;
  private articleRenderer: ArticleRenderer;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.boundClickHandler = this.handleCardClick.bind(this);
    
    // 复用 MarkdownParser
    const markdownParser = new MarkdownParser();
    this.contentService = new HowToImplementService(markdownParser);
    this.articleRenderer = new ArticleRenderer();
  }

  public bindEventListeners(): void {
    console.log('开始绑定 How to Implement 事件监听器');
    
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`未找到容器元素: ${this.containerId}`);
      return;
    }
    
    this.removeExistingListeners(container);
    this.addEventListeners(container);
    
    console.log('How to Implement 事件委托绑定完成');
  }

  private removeExistingListeners(container: HTMLElement): void {
    container.removeEventListener('click', this.boundClickHandler);
  }

  private addEventListeners(container: HTMLElement): void {
    container.addEventListener('click', this.boundClickHandler);
    
    container.addEventListener('click', function(e) {
      console.log('How to Implement 容器收到点击事件:', {
        target: e.target,
        targetClass: (e.target as HTMLElement).className,
        targetTag: (e.target as HTMLElement).tagName
      });
    }, true);
  }

  private handleCardClick(e: Event): void {
    const event = e as MouseEvent;
    const target = event.target as HTMLElement;
    
    console.log('How to Implement handleCardClick被调用:', target);
    
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
    
    console.log('准备显示 How to Implement 详细内容:', cardId);
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
      const article = await this.contentService.getArticle(cardId);
      
      // 渲染文章的 HTML 结构
      const articleHtml = this.articleRenderer.renderArticle(article.title, article.content);
      container.innerHTML = articleHtml;
      
      // 使用 SafeMarkdownRenderer 渲染 Markdown 内容
      const markdownContainer = document.getElementById('markdown-content-container');
      if (markdownContainer) {
        const renderer = new SafeMarkdownRenderer();
        console.log('How to Implement: 开始渲染 Markdown 内容');
        const renderedHtml = renderer.render(article.rawMarkdown);
        
        markdownContainer.innerHTML = `<div class="markdown-content">${renderedHtml}</div>`;
        
        // 应用代码高亮
        renderer.highlightCode(markdownContainer);
        
        // 添加增强功能
        this.addEnhancedFeatures(markdownContainer);
      }
      
      // 暴露返回函数到全局作用域
      (window as any).showOverviewCards = () => {
        // 重新初始化 How to Implement 概览卡片
        (window as any).initializeHowToImplement();
      };
      
    } catch (error) {
      console.error('加载 How to Implement 文章失败:', error);
      const errorHtml = this.articleRenderer.renderErrorState(error.message);
      container.innerHTML = errorHtml;
    }
  }

  private addEnhancedFeatures(container: HTMLElement): void {
    this.addCopyButtonsToCodeBlocks(container);
    this.addReadingProgress();
    this.addBackToTopButton();
  }

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

  private addReadingProgress(): void {
    const existingProgress = document.querySelector('.reading-progress');
    if (existingProgress) {
      existingProgress.remove();
    }

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }

  private addBackToTopButton(): void {
    const existingButton = document.querySelector('.back-to-top');
    if (existingButton) {
      existingButton.remove();
    }

    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(backToTopButton);

    const toggleBackToTop = () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
  }
}