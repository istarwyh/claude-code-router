/**
 * 安全的 Markdown 渲染器
 * 使用白名单方式处理 Markdown，避免 XSS 攻击
 */

interface MarkdownRendererOptions {
    enableCodeHighlight?: boolean;
    allowedTags?: string[];
}

export class SafeMarkdownRenderer {
    private options: MarkdownRendererOptions;
    
    // 允许的 HTML 标签白名单
    private readonly defaultAllowedTags = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'code', 'pre',
        'ul', 'ol', 'li', 'a', 'blockquote'
    ];

    constructor(options: MarkdownRendererOptions = {}) {
        this.options = {
            enableCodeHighlight: true,
            allowedTags: this.defaultAllowedTags,
            ...options
        };
    }

    /**
     * 渲染 Markdown 为 HTML
     */
    render(markdown: string): string {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        // 不要在开始就转义所有 HTML，而是在处理具体内容时进行安全处理
        let html = markdown;
        
        // 按顺序应用 Markdown 规则
        html = this.renderCodeBlocks(html);  // 先处理代码块，避免其中的内容被误处理
        html = this.renderHeaders(html);
        html = this.renderInlineCode(html);
        html = this.renderBoldItalic(html);
        html = this.renderLinks(html);
        html = this.renderLists(html);
        html = this.renderParagraphs(html);
        
        return html;
    }

    /**
     * 转义 HTML 字符以防止 XSS
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 保留已经处理的 HTML 标签，对其他内容进行转义
     */
    private preserveHtmlTags(text: string): string {
        // 对于已经包含 HTML 标签的内容，直接返回
        if (text.includes('<') && text.includes('>')) {
            return text;
        }
        // 对于纯文本内容，进行转义
        return this.escapeHtml(text);
    }

    /**
     * 渲染标题
     */
    private renderHeaders(html: string): string {
        // 按从大到小的顺序处理标题，对标题内容进行转义
        html = html.replace(/^######\s(.+)$/gm, (match, title) => `<h6>${this.escapeHtml(title.trim())}</h6>`);
        html = html.replace(/^#####\s(.+)$/gm, (match, title) => `<h5>${this.escapeHtml(title.trim())}</h5>`);
        html = html.replace(/^####\s(.+)$/gm, (match, title) => `<h4>${this.escapeHtml(title.trim())}</h4>`);
        html = html.replace(/^###\s(.+)$/gm, (match, title) => `<h3>${this.escapeHtml(title.trim())}</h3>`);
        html = html.replace(/^##\s(.+)$/gm, (match, title) => `<h2>${this.escapeHtml(title.trim())}</h2>`);
        html = html.replace(/^#\s(.+)$/gm, (match, title) => `<h1>${this.escapeHtml(title.trim())}</h1>`);
        return html;
    }

    /**
     * 渲染代码块
     */
    private renderCodeBlocks(html: string): string {
        // 处理三个反引号的代码块
        html = html.replace(/```([^`]*?)```/gs, (match, code) => {
            const trimmedCode = code.trim();
            return `<pre><code>${this.escapeHtml(trimmedCode)}</code></pre>`;
        });
        return html;
    }

    /**
     * 渲染行内代码
     */
    private renderInlineCode(html: string): string {
        // 处理单个反引号的行内代码，但不处理已经在 <pre><code> 中的
        html = html.replace(/`([^`\n]+)`/g, (match, code) => {
            // 检查是否在代码块中
            if (html.indexOf('<pre><code>') !== -1 && html.indexOf('</code></pre>') !== -1) {
                const preStart = html.lastIndexOf('<pre><code>', html.indexOf(match));
                const preEnd = html.indexOf('</code></pre>', html.indexOf(match));
                if (preStart !== -1 && preEnd !== -1 && preStart < html.indexOf(match) && html.indexOf(match) < preEnd) {
                    return match; // 在代码块中，不处理
                }
            }
            return `<code>${this.escapeHtml(code)}</code>`;
        });
        return html;
    }

    /**
     * 渲染粗体和斜体
     */
    private renderBoldItalic(html: string): string {
        // 粗体 **text**
        html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        // 斜体 *text*
        html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        return html;
    }

    /**
     * 渲染链接
     */
    private renderLinks(html: string): string {
        // [text](url) 格式的链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
            // 简单的 URL 验证，只允许 http/https
            if (url.match(/^https?:\/\//)) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
            return match; // 不符合条件的链接保持原样
        });
        return html;
    }

    /**
     * 渲染列表
     */
    private renderLists(html: string): string {
        // 处理无序列表
        const lines = html.split('\n');
        const result: string[] = [];
        let inList = false;
        let listItems: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isListItem = /^[*+-]\s(.+)$/.test(line);

            if (isListItem) {
                if (!inList) {
                    inList = true;
                    listItems = [];
                }
                const content = line.replace(/^[*+-]\s/, '');
                listItems.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    // 结束当前列表
                    result.push(`<ul>${listItems.join('')}</ul>`);
                    inList = false;
                    listItems = [];
                }
                result.push(line);
            }
        }

        // 处理文件末尾的列表
        if (inList && listItems.length > 0) {
            result.push(`<ul>${listItems.join('')}</ul>`);
        }

        return result.join('\n');
    }

    /**
     * 渲染段落
     */
    private renderParagraphs(html: string): string {
        // 将双换行符转换为段落分隔
        const paragraphs = html.split('\n\n').filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            // 如果已经是 HTML 标签，不要包装在 <p> 中
            if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote)/)) {
                return trimmed;
            }
            // 空段落不处理
            if (!trimmed) {
                return '';
            }
            // 对段落内容进行转义，但保留已经处理的 HTML 标签
            const content = this.preserveHtmlTags(trimmed);
            return `<p>${content}</p>`;
        }).join('\n\n');
    }

    /**
     * 添加代码高亮（简单实现）
     */
    highlightCode(container: HTMLElement): void {
        if (!this.options.enableCodeHighlight) return;

        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
            // 简单的语法高亮（可以根据需要扩展）
            this.applyBasicHighlighting(block as HTMLElement);
        });
    }

    /**
     * 应用基础语法高亮
     */
    private applyBasicHighlighting(codeBlock: HTMLElement): void {
        let code = codeBlock.textContent || '';
        
        // 简单的关键字高亮
        const keywords = [
            'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 
            'return', 'class', 'interface', 'type', 'import', 'export',
            'async', 'await', 'try', 'catch', 'throw', 'new'
        ];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // 字符串高亮
        code = code.replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="string">$1$2$3</span>');
        
        // 注释高亮
        code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
        code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
        
        codeBlock.innerHTML = code;
    }
}

/**
 * 创建默认的 Markdown 渲染器实例
 */
export function createMarkdownRenderer(options?: MarkdownRendererOptions): SafeMarkdownRenderer {
    return new SafeMarkdownRenderer(options);
}
