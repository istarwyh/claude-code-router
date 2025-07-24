import { cardIdMapping } from '../data/articleMapping';

export class NavigationHandler {
  public static showDetailedContent(cardId: string): void {
    console.log('显示详细内容:', cardId);
    
    const articleId = cardIdMapping[cardId] || cardId;
    this.loadArticleContent(articleId);
  }

  public static showBestPracticesOverview(): void {
    console.log('返回最佳实践概览页面');
    // 这里需要调用主渲染函数，将在主入口文件中实现
    (window as any).renderBestPracticesOverviewCards();
    
    // 重新绑定事件监听器
    setTimeout(() => {
      (window as any).bindEventListeners();
    }, 100);
  }

  private static loadArticleContent(articleId: string): void {
    // 这里将调用文章服务来加载内容，将在服务层实现
    (window as any).loadArticleContent(articleId);
  }
}