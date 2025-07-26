// 最佳实践管理器 - 主要协调类
import { CardRenderer } from '../renderers/CardRenderer';
import { ArticleRenderer } from '../renderers/ArticleRenderer';
import { EventHandler } from '../handlers/EventHandler';
import { NavigationHandler } from '../handlers/NavigationHandler';
import { ArticleService } from '../services/ArticleService';
import { bestPracticesCards } from '../data/cardsData';

export class BestPracticesManager {
  private cardRenderer: CardRenderer;
  private articleRenderer: ArticleRenderer;
  private eventHandler: EventHandler;
  private navigationHandler: NavigationHandler;
  private articleService: ArticleService;
  private containerId = 'best-practices-overview-cards';

  constructor() {
    this.cardRenderer = new CardRenderer();
    this.articleRenderer = new ArticleRenderer();
    this.eventHandler = new EventHandler(this.containerId);
    this.navigationHandler = new NavigationHandler();
    this.articleService = new ArticleService();
  }

  /**
   * 初始化最佳实践模块
   */
  initialize(): void {
    this.renderBestPracticesOverviewCards();
    this.bindEventListeners();
  }

  /**
   * 渲染最佳实践概览卡片
   */
  private renderBestPracticesOverviewCards(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn(`Container with id "${this.containerId}" not found`);
      return;
    }

    const cardsHtml = this.cardRenderer.renderCards(bestPracticesCards);
    container.innerHTML = cardsHtml;
  }

  /**
   * 绑定事件监听器
   */
  private bindEventListeners(): void {
    this.eventHandler.bindEventListeners();
    this.navigationHandler.bindEventListeners();
  }
}
