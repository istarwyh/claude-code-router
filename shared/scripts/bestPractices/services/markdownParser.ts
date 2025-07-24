export class MarkdownParser {
  public static parseMarkdownToHtml(markdown: string): string {
    return markdown
      // 标题
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // 段落
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // 列表
      .replace(/^\\d+\\.\\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^-\\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\\/li>)/s, '<ol>$1</ol>')
      // 代码块
      .replace(/```([\\s\\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 内联代码
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 粗体
      .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
      // 换行为段落
      .split('\\n\\n')
      .map(para => para.trim() ? (para.startsWith('<') ? para : `<p>${para}</p>`) : '')
      .filter(para => para)
      .join('\\n');
  }

  public static extractTitleFromMarkdown(markdown: string): string {
    const titleMatch = markdown.match(/^#\\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : '未知标题';
  }
}