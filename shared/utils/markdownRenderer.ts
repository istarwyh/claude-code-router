/**
 * 安全的 Markdown 渲染器（内部使用 markdown-it 渲染）
 * 目标：更完整的 Markdown 支持 + Mermaid + 语法高亮（highlight.js）
 */
import MarkdownIt from 'markdown-it';
import DOMPurify from 'isomorphic-dompurify';
// 使用按需注册的 highlight.js，减少体积并避免运行时从 CDN 加载 JS
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdownLang from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import { loadHighlightJsStyle } from './highlight';

// 注册常用语言（可按需增减）
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdownLang);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('dockerfile', dockerfile);

interface MarkdownRendererOptions {
    enableCodeHighlight?: boolean;
    allowedTags?: string[];
}

export class SafeMarkdownRenderer {
    private options: MarkdownRendererOptions;
    private md: MarkdownIt;
    
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

        // 初始化 markdown-it
        this.md = new MarkdownIt({
            html: false,     // 禁用 HTML 以防止 XSS 攻击
            linkify: true,
            breaks: true,
            // 使用 highlight.js 在渲染阶段生成高亮后的 HTML
            highlight: (str: string, lang: string) => {
                const language = (lang || '').toLowerCase();
                if (language && hljs.getLanguage(language)) {
                    try {
                        const { value } = hljs.highlight(str, {
                            language,
                            ignoreIllegals: true,
                        });
                        return `<pre class="code-block"><code class="hljs language-${language}">${value}</code></pre>`;
                    } catch (e) {
                        console.error(`Error highlighting code block with language ${language}:`, e);
                    }
                }
                // 未知语言或异常：转义原文，保留基本结构
                const escaped = this.escapeHtml(str);
                return `<pre class="code-block"><code class="hljs">${escaped}</code></pre>`;
            }
        });

        // 自定义 fence 渲染：支持 mermaid，并为代码块添加与现有样式匹配的类名
        const self = this;
        const defaultFence = this.md.renderer.rules.fence?.bind(this.md.renderer);
        this.md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
            const token = tokens[idx];
            const info = (token.info || '').trim().toLowerCase();
            const content = token.content || '';

            // 特殊处理 Mermaid，其余交给默认 fence（从而走 highlight 回调）
            if (info === 'mermaid' || info === 'sequencediagram') {
                const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                return `<div class="mermaid-diagram" id="${diagramId}">${self.escapeHtml(content)}</div>`;
            }

            if (defaultFence) {
                return defaultFence(tokens, idx, options, env, slf);
            }

            // 兜底：无默认 fence 时，仍输出基础结构
            const lang = info || 'text';
            const escaped = self.escapeHtml(content);
            return `<pre class="code-block"><code class="hljs language-${lang}">${escaped}</code></pre>`;
        };
    }

    /**
     * 渲染 Markdown 为 HTML
     */
    render(markdown: string): string {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }
        // 使用 markdown-it 渲染（内部已处理代码块与 mermaid 占位）
        const html = this.md.render(markdown);
        
        // 使用 DOMPurify 进行 HTML 安全清理
        const sanitizedHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'strong', 'em', 'code', 'pre',
                'ul', 'ol', 'li', 'a', 'blockquote', 'div'
            ],
            ALLOWED_ATTR: ['class', 'id', 'href', 'target', 'rel'],
            ALLOW_DATA_ATTR: false
        });
        
        return sanitizedHtml;
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
        console.log('renderCodeBlocks called, input length:', html.length);
        
        // 先检查是否包含代码块
        const hasCodeBlocks = html.includes('```');
        console.log('Contains code blocks:', hasCodeBlocks);
        
        if (hasCodeBlocks) {
            // 匹配所有代码块
            const codeBlockMatches = html.match(/```[\s\S]*?```/g);
            console.log('Found code block matches:', codeBlockMatches?.length || 0);
            if (codeBlockMatches) {
                codeBlockMatches.forEach((match, index) => {
                    console.log(`Code block ${index}:`, match.substring(0, 100) + '...');
                });
            }
        }
        
        // 处理三个反引号的代码块 - 恢复原来的正则表达式
        html = html.replace(/```([^`]*?)```/gs, (match, codeWithLang) => {
            const lines = codeWithLang.trim().split('\n');
            const firstLine = lines[0] || '';
            const language = firstLine.toLowerCase().trim();
            const code = lines.slice(1).join('\n').trim();
            
            console.log('Processing code block:', { language, codeLength: code.length });
            
            // 检查是否是 Mermaid 图表
            if (language === 'mermaid' || language === 'sequencediagram') {
                console.log('Detected Mermaid diagram!');
                return this.renderMermaidDiagram(code);
            }
            
            // 普通代码块
            console.log('Rendering as regular code block');
            return `<pre><code class="language-${language}">${this.escapeHtml(code)}</code></pre>`;
        });
        
        console.log('renderCodeBlocks finished, output length:', html.length);
        return html;
    }

    /**
     * 渲染 Mermaid 图表
     */
    private renderMermaidDiagram(code: string): string {
        const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('Rendering Mermaid diagram:', { diagramId, code: code.substring(0, 100) + '...' });
        return `<div class="mermaid-diagram" id="${diagramId}">${this.escapeHtml(code)}</div>`;
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
        const lines = html.split('\n');
        const result: string[] = [];
        let inUnorderedList = false;
        let inOrderedList = false;
        let listItems: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isUnorderedListItem = /^[*+-]\s(.+)$/.test(line);
            const isOrderedListItem = /^\d+\.\s(.+)$/.test(line);

            if (isUnorderedListItem) {
                // 如果之前在有序列表中，先结束有序列表
                if (inOrderedList) {
                    result.push(`<ol>${listItems.join('')}</ol>`);
                    inOrderedList = false;
                    listItems = [];
                }
                
                if (!inUnorderedList) {
                    inUnorderedList = true;
                    listItems = [];
                }
                const content = line.replace(/^[*+-]\s/, '');
                // 将换行符转换为 <br> 标签以保持原有格式
                const formattedContent = content.replace(/\n/g, '<br>');
                listItems.push(`<li>${formattedContent}</li>`);
            } else if (isOrderedListItem) {
                // 如果之前在无序列表中，先结束无序列表
                if (inUnorderedList) {
                    result.push(`<ul>${listItems.join('')}</ul>`);
                    inUnorderedList = false;
                    listItems = [];
                }
                
                if (!inOrderedList) {
                    inOrderedList = true;
                    listItems = [];
                }
                const content = line.replace(/^\d+\.\s/, '');
                listItems.push(`<li>${content}</li>`);
            } else {
                // 结束当前列表（无论是有序还是无序）
                if (inUnorderedList) {
                    result.push(`<ul>${listItems.join('')}</ul>`);
                    inUnorderedList = false;
                    listItems = [];
                } else if (inOrderedList) {
                    result.push(`<ol>${listItems.join('')}</ol>`);
                    inOrderedList = false;
                    listItems = [];
                }
                result.push(line);
            }
        }

        // 处理文件末尾的列表
        if (inUnorderedList && listItems.length > 0) {
            result.push(`<ul>${listItems.join('')}</ul>`);
        } else if (inOrderedList && listItems.length > 0) {
            result.push(`<ol>${listItems.join('')}</ol>`);
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
            
            // 如果已经是 HTML 标签（包括 div、pre 等），不要包装在 <p> 中，也不要处理换行
            if (trimmed.match(/^<(h[1-6]|ul|ol|pre|blockquote|div)/)) {
                return trimmed;
            }
            
            // 空段落不处理
            if (!trimmed) {
                return '';
            }
            
            // 只对纯文本内容进行换行处理
            let content = trimmed;
            
            // 检查是否为纯文本内容（不包含 HTML 标签）
            const hasHtmlTags = /<[^>]+>/.test(content);
            
            if (!hasHtmlTags) {
                // 对于纯文本内容，转义 HTML 字符
                content = this.escapeHtml(content);
                // 将单个换行符转换为 <br> 标签
                content = content.replace(/\n/g, '<br>');
            } else {
                // 对于包含 HTML 标签的内容，保持原样
                // 这些内容通常已经在之前的步骤中正确处理过了
                content = trimmed;
            }
            
            return `<p>${content}</p>`;
        }).join('\n\n');
    }

    /**
     * 添加代码高亮（简单实现）
     */
    highlightCode(container: HTMLElement): void {
        // 由于我们在渲染阶段已通过 markdown-it + hljs 完成高亮，这里仅确保样式和 Mermaid 渲染
        // 注入高亮样式（主题 CSS）并触发 Mermaid
        this.ensureHighlightCss();
        this.renderMermaidDiagrams(container);
    }

    /**
     * 动态加载 highlight.js 与默认样式
     */
    private loadHighlightJsLibrary(): Promise<void> {
        // 兼容旧接口：现在 hljs 已随 bundle 打包，这里只负责注入样式后立即 resolve
        return new Promise((resolve) => {
            this.ensureHighlightCss();
            resolve();
        });
    }

    /**
     * 确保高亮样式已加载（已移除 CDN 依赖）
     */
    private ensureHighlightCss(): void {
        // 优先确保主题样式可用（当前使用 CDN 注入方式，后续可切换为本地打包）
        loadHighlightJsStyle().catch(() => {
            // 降级：若样式加载失败，则保留占位提示，避免静默失败
            if (!document.getElementById('hljs-style-note')) {
                const note = document.createElement('style');
                note.id = 'hljs-style-note';
                note.textContent = '/* highlight.js styles should be bundled locally */';
                document.head.appendChild(note);
            }
        });
    }

    /**
     * 渲染 Mermaid 图表
     */
    private renderMermaidDiagrams(container: HTMLElement): void {
        const mermaidDiagrams = container.querySelectorAll('.mermaid-diagram');
        if (mermaidDiagrams.length === 0) return;

        console.log(`Found ${mermaidDiagrams.length} Mermaid diagrams to render`);

        // 动态加载 Mermaid 库
        this.loadMermaidLibrary().then(() => {
            console.log('Mermaid library loaded successfully');
            mermaidDiagrams.forEach((diagram, index) => {
                console.log(`Initializing Mermaid diagram ${index + 1}/${mermaidDiagrams.length}`);
                this.initializeMermaidDiagram(diagram as HTMLElement);
            });
        }).catch((error) => {
            console.error('Failed to load Mermaid library:', error);
            // 降级处理：显示原始代码
            mermaidDiagrams.forEach((diagram) => {
                const code = diagram.textContent || '';
                diagram.innerHTML = `<pre><code>${code}</code></pre>`;
                diagram.classList.add('mermaid-fallback');
            });
        });
    }

    /**
     * 动态加载 Mermaid 库
     */
    private loadMermaidLibrary(): Promise<void> {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if ((window as any).mermaid) {
                console.log('Mermaid library already loaded');
                resolve();
                return;
            }

            console.log('Loading Mermaid library from CDN...');
            
            // 创建 script 标签加载 Mermaid
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.async = true;
            script.onload = () => {
                console.log('Mermaid library script loaded, initializing...');
                try {
                    // 初始化 Mermaid
                    const mermaid = (window as any).mermaid;
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default',
                        securityLevel: 'loose',
                        fontFamily: 'monospace'
                    });
                    console.log('Mermaid library initialized');
                    resolve();
                } catch (error) {
                    console.error('Error initializing Mermaid:', error);
                    reject(error);
                }
            };
            script.onerror = (error) => {
                console.error('Failed to load Mermaid script:', error);
                reject(new Error('Failed to load Mermaid library'));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * 初始化单个 Mermaid 图表
     */
    private initializeMermaidDiagram(element: HTMLElement): void {
        const mermaid = (window as any).mermaid;
        if (!mermaid) {
            console.error('Mermaid library not available');
            return;
        }

        const code = element.textContent || '';
        const id = element.id;
        
        console.log(`Rendering diagram ${id}:`, code.substring(0, 100) + '...');

        try {
            // 清空元素内容
            element.textContent = '';
            element.innerHTML = '<div style="padding: 20px; color: #666;">正在渲染图表...</div>';
            
            // 渲染 Mermaid 图表
            mermaid.render(id + '-svg', code).then((result: { svg: string }) => {
                console.log(`Successfully rendered diagram ${id}`);
                element.innerHTML = result.svg;
                element.classList.add('mermaid-rendered');
                
                // 添加点击全屏查看功能
                element.addEventListener('click', () => {
                    this.showMermaidFullscreen(result.svg, id);
                });
                
            }).catch((error: Error) => {
                console.error(`Mermaid rendering error for ${id}:`, error);
                // 降级显示原始代码
                element.innerHTML = `
                    <div style="color: #dc2626; margin-bottom: 8px;">⚠️ 图表渲染失败</div>
                    <pre><code>${this.escapeHtml(code)}</code></pre>
                `;
                element.classList.add('mermaid-error');
            });
        } catch (error) {
            console.error(`Mermaid initialization error for ${id}:`, error);
            // 降级显示原始代码
            element.innerHTML = `
                <div style="color: #dc2626; margin-bottom: 8px;">⚠️ 图表初始化失败</div>
                <pre><code>${this.escapeHtml(code)}</code></pre>
            `;
            element.classList.add('mermaid-error');
        }
    }

    /**
     * 显示 Mermaid 图表全屏模式
     */
    private showMermaidFullscreen(svgContent: string, diagramId: string): void {
        // 创建全屏模态框
        const modal = document.createElement('div');
        modal.className = 'mermaid-fullscreen-modal';
        modal.innerHTML = `
            <div class="mermaid-fullscreen-content">
                <button class="mermaid-fullscreen-close" onclick="this.closest('.mermaid-fullscreen-modal').remove()">&times;</button>
                ${svgContent}
            </div>
        `;
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // ESC 键关闭
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        document.body.appendChild(modal);
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
