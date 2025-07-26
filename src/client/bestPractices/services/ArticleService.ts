import { MarkdownParser } from './MarkdownParser';

export interface Article {
  id: string;
  title: string;
  content: string;
  rawMarkdown: string;
}

export class ArticleService {
  private markdownParser: MarkdownParser;
  private cache: Map<string, Article> = new Map();

  constructor() {
    this.markdownParser = new MarkdownParser();
  }

  public async getArticle(cardId: string): Promise<Article> {
    // 检查缓存
    if (this.cache.has(cardId)) {
      return this.cache.get(cardId)!;
    }

    try {
      // 模拟从服务器获取 Markdown 内容
      const markdownContent = await this.fetchMarkdownContent(cardId);
      
      // 解析 Markdown
      const htmlContent = this.markdownParser.parse(markdownContent);
      
      const article: Article = {
        id: cardId,
        title: this.getTitleFromCardId(cardId),
        content: htmlContent,
        rawMarkdown: markdownContent
      };

      // 缓存结果
      this.cache.set(cardId, article);
      
      return article;
    } catch (error) {
      throw new Error(`无法加载文章 ${cardId}: ${error.message}`);
    }
  }

  private async fetchMarkdownContent(cardId: string): Promise<string> {
    // 从内容文件中获取真实的 Markdown 内容
    return this.getContentFromFile(cardId);
  }

  private async getContentFromFile(cardId: string): Promise<string> {
    // 使用构建时打包的方式导入 .md 文件
    // esbuild 会将 .md 文件作为文本字符串打包进来
    try {
      const contentMap: Record<string, () => Promise<string>> = {
        'workflow-overview': async () => (await import('../content/workflow-overview.md')).default,
        'environment-config': async () => (await import('../content/environment-config.md')).default,
        'mcp-commands': async () => (await import('../content/mcp-commands.md')).default,
        'core-workflow': async () => (await import('../content/core-workflow.md')).default,
        'context-management': async () => (await import('../content/context-management.md')).default,
        'automation-batch': async () => (await import('../content/automation-batch.md')).default,
        'concurrent-claude': async () => (await import('../content/concurrent-claude.md')).default
      };

      const contentLoader = contentMap[cardId];
      if (contentLoader) {
        return await contentLoader();
      }

      return this.getDefaultContent(cardId);
    } catch (error) {
      console.warn(`Failed to load content for ${cardId}:`, error);
      return this.getDefaultContent(cardId);
    }
  }

  private getDefaultContent(cardId: string): string {
    return `# ${this.getTitleFromCardId(cardId)}

内容正在开发中...

请稍后查看完整内容。`;
  }

  private getTitleFromCardId(cardId: string): string {
    const titles = {
      'workflow-overview': '我现在的工作流',
      'environment-config': '自定义环境配置',
      'mcp-commands': 'MCP 与常用命令',
      'core-workflow': '核心工作流程',
      'context-management': '上下文管理',
      'automation-batch': '自动化与批处理',
      'concurrent-claude': '多 Claude 并发干活'
    };

    return titles[cardId] || cardId;
  }
}
