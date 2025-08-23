import { BaseArticleEventHandler, IArticleRenderer, IContentService } from '../../shared/handlers/BaseArticleEventHandler';

export class EventHandler extends BaseArticleEventHandler {
  constructor(
    containerId: string,
    contentService: IContentService,
    articleRenderer: IArticleRenderer
  ) {
    super(
      containerId,
      contentService,
      articleRenderer,
      () => (window as any).initializeBestPractices()
    );
  }

  protected addDebugListeners(container: HTMLElement): void {
    container.addEventListener(
      'click',
      function (e) {
        console.log('容器收到点击事件:', {
          target: e.target,
          targetClass: (e.target as HTMLElement).className,
          targetTag: (e.target as HTMLElement).tagName,
        });
      },
      true
    );
  }

  protected async beforeEnterArticle(container: HTMLElement): Promise<void> {
    const grid = container.querySelector(
      '.overview-cards-grid'
    ) as HTMLElement | null;
    if (grid) {
      grid.classList.add('is-exiting');
      grid.style.pointerEvents = 'none';
      await new Promise((resolve) => setTimeout(resolve, 230));
    }
  }
}
