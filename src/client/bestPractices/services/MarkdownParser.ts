export class MarkdownParser {
  public parse(markdown: string): string {
    let html = markdown;

    // 转义 HTML 特殊字符
    html = this.escapeHtml(html);

    // 解析标题
    html = this.parseHeaders(html);

    // 解析代码块
    html = this.parseCodeBlocks(html);

    // 解析行内代码
    html = this.parseInlineCode(html);

    // 解析列表
    html = this.parseLists(html);

    // 解析段落
    html = this.parseParagraphs(html);

    // 解析粗体和斜体
    html = this.parseEmphasis(html);

    return html;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private parseHeaders(html: string): string {
    return html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level} class="markdown-h${level}">${content.trim()}</h${level}>`;
    });
  }

  private parseCodeBlocks(html: string): string {
    return html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<pre class="code-block"><code class="language-${language}">${code.trim()}</code></pre>`;
    });
  }

  private parseInlineCode(html: string): string {
    return html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  }

  private parseLists(html: string): string {
    // 解析无序列表
    html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="markdown-list">$1</ul>');

    // 解析有序列表
    html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    return html;
  }

  private parseParagraphs(html: string): string {
    // 将连续的非空行包装在段落标签中
    const lines = html.split('\n');
    const result: string[] = [];
    let currentParagraph: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          const paragraphContent = currentParagraph.join(' ').trim();
          if (paragraphContent && !this.isHtmlTag(paragraphContent)) {
            result.push(`<p class="markdown-paragraph">${paragraphContent}</p>`);
          } else {
            result.push(paragraphContent);
          }
          currentParagraph = [];
        }
        result.push('');
      } else if (this.isHtmlTag(trimmedLine)) {
        if (currentParagraph.length > 0) {
          const paragraphContent = currentParagraph.join(' ').trim();
          result.push(`<p class="markdown-paragraph">${paragraphContent}</p>`);
          currentParagraph = [];
        }
        result.push(trimmedLine);
      } else {
        currentParagraph.push(trimmedLine);
      }
    }

    // 处理最后一个段落
    if (currentParagraph.length > 0) {
      const paragraphContent = currentParagraph.join(' ').trim();
      if (paragraphContent && !this.isHtmlTag(paragraphContent)) {
        result.push(`<p class="markdown-paragraph">${paragraphContent}</p>`);
      } else {
        result.push(paragraphContent);
      }
    }

    return result.join('\n');
  }

  private parseEmphasis(html: string): string {
    // 粗体
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // 斜体
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    return html;
  }

  private isHtmlTag(text: string): boolean {
    return /^<\/?[a-zA-Z][^>]*>/.test(text.trim());
  }
}
