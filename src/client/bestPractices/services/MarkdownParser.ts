import { SafeMarkdownRenderer } from '../../../../shared/utils/markdownRenderer';

export class MarkdownParser {
  private readonly renderer = new SafeMarkdownRenderer();

  public render(markdown: string): string {
    // 保持原 API，但委托给统一渲染器（markdown-it + highlight + mermaid）
    return this.parse(markdown);
  }

  public parse(markdown: string): string {
    return this.renderer.render(markdown);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private parseHeaders(html: string): string {
    // 已由 markdown-it 处理；保留方法避免大范围删除
    return html;
  }

  private parseCodeBlocks(html: string): string {
    // 已由 markdown-it 处理；保留方法避免大范围删除
    return html;
  }

  private parseInlineCode(html: string): string {
    // 已由 markdown-it 处理
    return html;
  }

  private parseLists(html: string): string {
    // 已由 markdown-it 处理
    return html;
  }

  private parseParagraphs(html: string): string {
    // 已由 markdown-it 处理
    return html;
  }

  private parseEmphasis(html: string): string {
    // 已由 markdown-it 处理
    return html;
  }

  private isHtmlTag(text: string): boolean {
    return /^<\/?[a-zA-Z][^>]*>/.test(text.trim());
  }
}
