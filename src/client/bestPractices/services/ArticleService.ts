import { BaseContentService } from '../../shared/services/BaseContentService';
import type { PracticeCard } from '../types/PracticeCard';

export { Article } from '../../shared/services/BaseContentService';

export class ArticleService extends BaseContentService<PracticeCard> {
  protected async getContentFromFile(cardId: string): Promise<string> {
    try {
      const contentMap: Record<string, () => Promise<string>> = {
        'workflow-overview': async () => (await import('../content/workflow-overview.md')).default,
        'environment-config': async () => (await import('../content/environment-config.md')).default,
        'mcp-commands': async () => (await import('../content/mcp-commands.md')).default,
        'core-workflow': async () => (await import('../content/core-workflow.md')).default,
        'context-management': async () => (await import('../content/context-management.md')).default,
        'automation-batch': async () => (await import('../content/automation-batch.md')).default,
        'concurrent-claude': async () => (await import('../content/concurrent-claude.md')).default,
        'intelligent-undo': async () => (await import('../content/intelligent-undo.md')).default
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

  protected getDefaultContent(cardId: string): string {
    return `# ${this.getTitleFromCardId(cardId)}

内容正在开发中...

请稍后查看完整内容。`;
  }

  protected getTitleFromCardId(cardId: string): string {
    const titles = {
      'workflow-overview': '我现在的工作流',
      'environment-config': '自定义环境配置',
      'mcp-commands': 'MCP 与常用命令',
      'core-workflow': '核心工作流程',
      'context-management': '上下文管理',
      'automation-batch': '自动化与批处理',
      'concurrent-claude': '多 Claude 并发干活',
      'intelligent-undo': '智能撤销工具'
    };

    return titles[cardId] || cardId;
  }
}
