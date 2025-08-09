import type { BaseContentCard } from '../types/ContentCard';

export interface Article {
  id: string;
  title: string;
  content: string;
  rawMarkdown: string;
}

// 通用内容服务 - 符合开放封闭原则
export abstract class BaseContentService<T extends BaseContentCard> {
  protected markdownParser: any;
  protected cache: Map<string, Article> = new Map();
  protected disableCache: boolean;
  
  constructor(markdownParser: any, disableCache: boolean = process.env.NODE_ENV === 'development') {
    this.markdownParser = markdownParser;
    this.disableCache = disableCache;
  }

  public async getArticle(cardId: string): Promise<Article> {
    // 根据配置决定是否清除缓存
    if (this.disableCache && this.cache.has(cardId)) {
      this.cache.delete(cardId);
    }

    try {
      const markdownContent = await this.fetchMarkdownContent(cardId);
      const htmlContent = this.markdownParser.render(markdownContent);
      
      const article: Article = {
        id: cardId,
        title: this.getTitleFromCardId(cardId),
        content: htmlContent,
        rawMarkdown: markdownContent
      };

      this.cache.set(cardId, article);
      return article;
    } catch (error) {
      throw new Error(`无法加载文章 ${cardId}: ${error.message}`);
    }
  }

  protected async fetchMarkdownContent(cardId: string): Promise<string> {
    return this.getContentFromFile(cardId);
  }

  // 抽象方法，由子类实现具体的内容加载逻辑
  protected abstract getContentFromFile(cardId: string): Promise<string>;
  protected abstract getTitleFromCardId(cardId: string): string;
  protected abstract getDefaultContent(cardId: string): string;
}