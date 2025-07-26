import { ArticleService } from '../services/ArticleService';
import { ArticleRenderer } from '../renderers/ArticleRenderer';

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
      // 显示加载状态
      container.innerHTML = this.articleRenderer.renderLoadingState();
      
      // 获取文章内容
      const article = await this.articleService.getArticle(cardId);
      
      // 渲染文章
      const articleHtml = this.articleRenderer.renderArticle(article.title, article.content);
      container.innerHTML = articleHtml;
      
      // 暴露返回函数到全局作用域
      (window as any).showOverviewCards = () => {
        // 重新初始化概览卡片
        const manager = new (window as any).BestPracticesManager();
        manager.initialize();
      };
      
    } catch (error) {
      console.error('加载文章失败:', error);
      const errorHtml = this.articleRenderer.renderErrorState(error.message);
      container.innerHTML = errorHtml;
    }
  }
}
