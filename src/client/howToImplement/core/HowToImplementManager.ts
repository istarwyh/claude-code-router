import { BaseContentManager } from '../../shared/managers/BaseContentManager';
import { HowToImplementCardRenderer } from '../renderers/CardRenderer';
import { ArticleRenderer } from '../../bestPractices/renderers/ArticleRenderer';
import { HowToImplementEventHandler } from '../handlers/EventHandler';
import { NavigationHandler } from '../../bestPractices/handlers/NavigationHandler';
import { HowToImplementService } from '../services/HowToImplementService';
import { MarkdownParser } from '../../bestPractices/services/MarkdownParser';
import { howToImplementCards } from '../data/cardsData';
import type { ImplementCard } from '../../shared/types/ContentCard';

export class HowToImplementManager extends BaseContentManager<ImplementCard> {
  constructor() {
    const cardRenderer = new HowToImplementCardRenderer();
    const articleRenderer = new ArticleRenderer();
    const eventHandler = new HowToImplementEventHandler('how-to-implement-overview-cards');
    const navigationHandler = new NavigationHandler();
    const markdownParser = new MarkdownParser();
    const contentService = new HowToImplementService(markdownParser);
    
    super(
      cardRenderer,
      articleRenderer, 
      eventHandler,
      navigationHandler,
      contentService,
      'how-to-implement-overview-cards'
    );
  }

  protected getCards(): ImplementCard[] {
    return howToImplementCards;
  }
}