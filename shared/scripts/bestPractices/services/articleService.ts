import { ArticleRenderer, type ArticleContent } from '../renderers/articleRenderer';
import { TemplateEngine } from '../renderers/templateEngine';
import { MarkdownParser } from './markdownParser';

export class ArticleService {
  private static readonly CONTAINER_ID = 'best-practices-overview-cards';
  private articleRenderer: ArticleRenderer;

  constructor() {
    this.articleRenderer = new ArticleRenderer();
  }

  public async loadArticleContent(articleId: string): Promise<void> {
    this.showLoadingState();
    
    try {
      const article = await this.fetchArticleFromMarkdown(articleId);
      this.displayArticle(articleId, article);
    } catch (error) {
      console.error('加载文章失败:', error);
      this.displayErrorMessage(articleId, error as Error);
    }
  }

  private displayErrorMessage(articleId: string, error: Error): void {
    const errorHtml = this.articleRenderer.renderErrorState(articleId, error.message);
    TemplateEngine.renderContainer(ArticleService.CONTAINER_ID, errorHtml);
  }

  private showLoadingState(): void {
    const loadingHtml = this.articleRenderer.renderLoadingState();
    TemplateEngine.renderContainer(ArticleService.CONTAINER_ID, loadingHtml);
  }

  private async fetchArticleFromMarkdown(articleId: string): Promise<ArticleContent> {
    const markdownPath = `/modules/best-practices/articles/${articleId}.md`;
    
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`文章文件未找到: ${articleId}.md`);
    }
    
    const markdownContent = await response.text();
    const htmlContent = MarkdownParser.parseMarkdownToHtml(markdownContent);
    const articleTitle = MarkdownParser.extractTitleFromMarkdown(markdownContent);
    
    return {
      title: articleTitle,
      content: htmlContent
    };
  }

  private displayArticle(articleId: string, article: ArticleContent): void {
    const articleHtml = this.articleRenderer.renderArticle(articleId, article);
    TemplateEngine.renderContainer(ArticleService.CONTAINER_ID, articleHtml);
  }
}
}