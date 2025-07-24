export interface ArticleContent {
  title: string;
  content: string;
}

export class ArticleRenderer {
  public renderLoadingState(): string {
    return `
      <div class="article-loading" style="text-align: center; padding: 60px 30px;">
        <div style="width: 40px; height: 40px; margin: 0 auto 20px; border: 4px solid #f3f4f6; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <h2 style="color: #374151; margin-bottom: 16px;">正在加载文章内容...</h2>
        <p style="color: #6b7280; margin-bottom: 30px;">请稍候，我们正在为您准备详细内容。</p>
        <button onclick="showBestPracticesOverview()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">← 返回概览</button>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  public renderArticle(articleId: string, article: ArticleContent): string {
    return `
      <div class="article-container" style="max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
        <div class="article-header" style="padding: 20px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <button onclick="showBestPracticesOverview()" style="background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            ← 返回概览
          </button>
          <h1 style="margin: 15px 0 0 0; font-size: 1.5rem;">${article.title}</h1>
        </div>
        
        <div class="article-content" style="padding: 40px 30px; line-height: 1.7; color: #374151;">
          ${article.content}
        </div>
      </div>
    `;
  }
}