import { BaseContentService } from '../../shared/services/BaseContentService';
import type { ImplementCard } from '../../shared/types/ContentCard';

export class HowToImplementService extends BaseContentService<ImplementCard> {
  protected async getContentFromFile(cardId: string): Promise<string> {
    try {
      const contentMap: Record<string, () => Promise<string>> = {
        'claude-code-conversation-example-1': async () => (await import('../content/claude-code-conversation-example-1.md')).default,
        'claude-code-implementation': async () => (await import('../content/claude-code-implementation.md')).default,
        'claude-code-output-format-example-1': async () => (await import('../content/claude-code-output-format-example-1.md')).default,
        'claude-code-system-prompt-cn': async () => (await import('../content/claude-code-system-prompt-cn.md')).default,
        'claude-code-system-prompt-en': async () => (await import('../content/claude-code-system-prompt-en.md')).default
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
      'claude-code-conversation-example-1': 'Claude Code 对话示例',
      'claude-code-implementation': 'Claude Code 实现方案',
      'claude-code-output-format-example-1': 'Claude Code 输出格式示例',
      'claude-code-system-prompt-cn': 'Claude Code 系统提示词 (中文)',
      'claude-code-system-prompt-en': 'Claude Code 系统提示词 (English)'
    };

    return titles[cardId] || cardId;
  }
}