import { BaseContentManager } from '../../shared/managers/BaseContentManager';
import { CardRenderer } from '../renderers/CardRenderer';
import { ArticleRenderer } from '../renderers/ArticleRenderer';
import { EventHandler } from '../handlers/EventHandler';
import { NavigationHandler } from '../handlers/NavigationHandler';
import { ArticleService } from '../services/ArticleService';
import { MarkdownParser } from '../services/MarkdownParser';
import { bestPracticesCards } from '../data/cardsData';
import type { PracticeCard } from '../types/PracticeCard';

export class BestPracticesManager extends BaseContentManager<PracticeCard> {
  constructor() {
    const cardRenderer = new CardRenderer();
    const articleRenderer = new ArticleRenderer();
    const markdownParser = new MarkdownParser();
    const articleService = new ArticleService(markdownParser);
    const eventHandler = new EventHandler(
      'best-practices-overview-cards',
      articleService,
      articleRenderer
    );
    const navigationHandler = new NavigationHandler();
    
    super(
      cardRenderer,
      articleRenderer,
      eventHandler,
      navigationHandler,
      articleService,
      'best-practices-overview-cards'
    );
  }

  protected getCards(): PracticeCard[] {
    return bestPracticesCards;
  }
}
