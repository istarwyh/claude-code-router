import type { BaseContentCard } from '../types/ContentCard';

// 通用内容管理器 - 依赖注入模式，符合 SOLID 原则
export abstract class BaseContentManager<T extends BaseContentCard> {
  protected cardRenderer: any;
  protected articleRenderer: any;
  protected eventHandler: any;
  protected navigationHandler: any;
  protected contentService: any;
  protected containerId: string;

  constructor(
    cardRenderer: any,
    articleRenderer: any,
    eventHandler: any,
    navigationHandler: any,
    contentService: any,
    containerId: string
  ) {
    this.cardRenderer = cardRenderer;
    this.articleRenderer = articleRenderer;
    this.eventHandler = eventHandler;
    this.navigationHandler = navigationHandler;
    this.contentService = contentService;
    this.containerId = containerId;
  }

  public initialize(): void {
    this.renderOverviewCards();
    this.bindEventListeners();
  }

  protected renderOverviewCards(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn(`Container with id "${this.containerId}" not found`);
      return;
    }

    const cards = this.getCards();
    const cardsHtml = this.cardRenderer.renderCards(cards);
    container.innerHTML = cardsHtml;
  }

  protected bindEventListeners(): void {
    this.eventHandler.bindEventListeners();
    this.navigationHandler.bindEventListeners();
  }

  // 抽象方法，由子类提供具体的卡片数据
  protected abstract getCards(): T[];
}