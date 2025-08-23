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
}
