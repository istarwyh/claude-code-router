import { bestPracticesOverviewCards } from '../data/bestPracticesOverviewData';

/**
 * 文章内容加载器
 * 负责加载和显示详细的最佳实践文章内容
 */
export class ArticleContentLoader {
  private static instance: ArticleContentLoader;
  private loadedArticles: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): ArticleContentLoader {
    if (!ArticleContentLoader.instance) {
      ArticleContentLoader.instance = new ArticleContentLoader();
    }
    return ArticleContentLoader.instance;
  }

  /**
   * 获取文章文件路径映射
   */
  private getArticleFilePath(cardId: string): string {
    const articleFileMap: Record<string, string> = {
      'current-workflow': '/modules/best-practices/articles/current-workflow.md',
      'environment-config': '/modules/best-practices/articles/environment-config.md',
      'mcp-commands': '/modules/best-practices/articles/mcp-commands.md',
      'core-workflow': '/modules/best-practices/articles/core-workflow.md',
      'context-management': '/modules/best-practices/articles/context-management.md',
      'automation-batch': '/modules/best-practices/articles/automation-batch.md',
      'concurrent-claude': '/modules/best-practices/articles/concurrent-claude.md'
    };

    return articleFileMap[cardId] || '';
  }

  /**
   * 加载文章内容
   */
  public async loadArticleContent(cardId: string): Promise<string> {
    // 检查缓存
    if (this.loadedArticles.has(cardId)) {
      return this.loadedArticles.get(cardId)!;
    }

    const filePath = this.getArticleFilePath(cardId);
    if (!filePath) {
      throw new Error(`Article file not found for card: ${cardId}`);
    }

    try {
      // 在实际应用中，这里会通过网络请求加载文件内容
      // 由于是静态网站，我们需要预先处理 markdown 文件
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.statusText}`);
      }

      const markdownContent = await response.text();
      const htmlContent = this.parseMarkdownToHtml(markdownContent);
      
      // 缓存解析后的内容
      this.loadedArticles.set(cardId, htmlContent);
      
      return htmlContent;
    } catch (error) {
      console.error(`Error loading article ${cardId}:`, error);
      // 返回错误提示内容
      return this.getErrorContent(cardId);
    }
  }

  /**
   * 简单的 Markdown 到 HTML 转换器
   * 支持基本的 Markdown 语法
   */
  private parseMarkdownToHtml(markdown: string): string {
    let html = markdown;

    // 处理代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang ? ` class="language-${lang}"` : '';
      return `<pre><code${language}>${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // 处理行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 处理标题
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');

    // 处理粗体和斜体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 处理列表
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // 处理有序列表
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // 处理段落
    html = html.replace(/^(?!<[h|u|p|c|l])(.+)$/gm, '<p>$1</p>');

    // 处理引用块
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // 处理 Mermaid 图表
    html = html.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
      return `<div class="mermaid">${diagram.trim()}</div>`;
    });

    // 处理表格（简单实现）
    html = html.replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n)*)/g, (match, header, rows) => {
      const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
      const headerHtml = headerCells.map(cell => `<th>${cell}</th>`).join('');
      
      const rowsHtml = rows.trim().split('\n').map(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
      }).join('');

      return `
        <table class="article-table">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    });

    return html;
  }

  /**
   * HTML 转义
   */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * 获取错误内容
   */
  private getErrorContent(cardId: string): string {
    const cardData = bestPracticesOverviewCards.find(card => card.id === cardId);
    const title = cardData?.title || '未知文章';

    return `
      <div class="article-error">
        <h1>📚 ${title}</h1>
        <div class="error-message">
          <h3>⚠️ 内容加载失败</h3>
          <p>很抱歉，无法加载文章内容。这可能是由于以下原因：</p>
          <ul>
            <li>网络连接问题</li>
            <li>文章文件不存在</li>
            <li>服务器临时不可用</li>
          </ul>
          <p>请稍后重试，或者联系管理员。</p>
        </div>
        
        <div class="article-preview">
          <h3>📋 文章概览</h3>
          <p>${cardData?.description || '暂无描述'}</p>
          
          ${cardData?.sections ? `
            <h4>主要内容：</h4>
            <ul>
              ${cardData.sections.map(section => `
                <li><strong>${section.title}</strong>: ${section.content}</li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * 清理缓存
   */
  public clearCache(): void {
    this.loadedArticles.clear();
  }

  /**
   * 预加载所有文章内容
   */
  public async preloadAllArticles(): Promise<void> {
    const cardIds = bestPracticesOverviewCards.map(card => card.id);
    const loadPromises = cardIds.map(cardId => 
      this.loadArticleContent(cardId).catch(error => {
        console.warn(`Failed to preload article ${cardId}:`, error);
      })
    );

    await Promise.allSettled(loadPromises);
  }
}