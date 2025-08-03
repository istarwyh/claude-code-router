import type { BaseContentCard } from '../types/ContentCard';

// Base interfaces for type safety
interface ICardRenderer<T extends BaseContentCard> {
  renderCards(cards: T[]): string;
}

interface IArticleRenderer {
  renderArticle(title: string, content: string): string;
  renderLoadingState(): string;
  renderErrorState(error: string): string;
}

interface IEventHandler {
  bindEventListeners(): void;
}

interface INavigationHandler {
  bindEventListeners(): void;
}

interface IContentService {
  getArticle(id: string): Promise<{ title: string; content: string; rawMarkdown: string }>;
}

// 通用内容管理器 - 依赖注入模式，符合 SOLID 原则
export abstract class BaseContentManager<T extends BaseContentCard> {
  protected cardRenderer: ICardRenderer<T>;
  protected articleRenderer: IArticleRenderer;
  protected eventHandler: IEventHandler;
  protected navigationHandler: INavigationHandler;
  protected contentService: IContentService;
  protected containerId: string;

  constructor(
    cardRenderer: ICardRenderer<T>,
    articleRenderer: IArticleRenderer,
    eventHandler: IEventHandler,
    navigationHandler: INavigationHandler,
    contentService: IContentService,
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