export class ArticleRenderer {
  public renderArticle(title: string, content: string): string {
    return `
      <div class="practice-article">
        <div class="practice-article__header">
          <button class="practice-article__back-btn" onclick="showOverviewCards()">
            ← 返回概览
          </button>
          <h2 class="practice-article__title">${title}</h2>
        </div>
        
        <div class="practice-article__content">
          ${content}
        </div>
      </div>
    `;
  }

  public renderLoadingState(): string {
    return `
      <div class="practice-article">
        <div class="practice-article__header">
          <button class="practice-article__back-btn" onclick="showOverviewCards()">
            ← 返回概览
          </button>
          <h2 class="practice-article__title">加载中...</h2>
        </div>
        
        <div class="practice-article__content">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>正在加载内容...</p>
          </div>
        </div>
      </div>
    `;
  }

  public renderErrorState(error: string): string {
    return `
      <div class="practice-article">
        <div class="practice-article__header">
          <button class="practice-article__back-btn" onclick="showOverviewCards()">
            ← 返回概览
          </button>
          <h2 class="practice-article__title">加载失败</h2>
        </div>
        
        <div class="practice-article__content">
          <div class="error-message">
            <p>❌ 无法加载内容: ${error}</p>
            <button onclick="location.reload()" class="retry-btn">重试</button>
          </div>
        </div>
      </div>
    `;
  }
}
