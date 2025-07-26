import { SafeMarkdownRenderer } from '../utils/markdownRenderer.js';

/**
 * Markdown 查看器组件
 * 提供安全的 Markdown 渲染和显示功能
 */
export class MarkdownViewer {
    private container: HTMLElement;
    private renderer: SafeMarkdownRenderer;
    private loadingElement: HTMLElement;
    private errorElement: HTMLElement;
    private contentElement: HTMLElement;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = container;

        this.renderer = new SafeMarkdownRenderer();
        this.initializeElements();
        this.addStyles();
    }

    /**
     * 初始化 DOM 元素
     */
    private initializeElements(): void {
        this.container.innerHTML = `
            <div class="markdown-viewer">
                <div class="loading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
                <div class="error" style="display: none;">
                    <p class="error-message">加载失败，请稍后重试</p>
                </div>
                <div class="content markdown-content"></div>
            </div>
        `;

        const loadingElement = this.container.querySelector('.loading') as HTMLElement;
        const errorElement = this.container.querySelector('.error') as HTMLElement;
        const contentElement = this.container.querySelector('.content') as HTMLElement;
        
        if (!loadingElement || !errorElement || !contentElement) {
            throw new Error('Required elements not found in container');
        }
        
        this.loadingElement = loadingElement;
        this.errorElement = errorElement;
        this.contentElement = contentElement;
    }

    /**
     * 添加样式
     */
    private addStyles(): void {
        if (document.getElementById('markdown-viewer-styles')) return;

        const style = document.createElement('style');
        style.id = 'markdown-viewer-styles';
        style.textContent = `
            .markdown-viewer {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 200px;
                color: var(--text-secondary, #666);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid var(--border-color, #e0e0e0);
                border-top: 3px solid var(--primary, #007bff);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .error {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 200px;
                color: var(--error, #dc3545);
                text-align: center;
            }

            .error-message {
                margin: 0;
                padding: 16px;
                background: var(--bg-secondary, #f8f9fa);
                border-radius: 8px;
                border: 1px solid var(--error, #dc3545);
            }

            .markdown-content {
                line-height: 1.6;
                color: var(--text-primary, #333);
            }

            .markdown-content h1,
            .markdown-content h2,
            .markdown-content h3,
            .markdown-content h4,
            .markdown-content h5,
            .markdown-content h6 {
                margin-top: 24px;
                margin-bottom: 16px;
                font-weight: 600;
                line-height: 1.25;
                color: var(--text-primary, #333);
            }

            .markdown-content h1 { font-size: 2em; }
            .markdown-content h2 { font-size: 1.5em; }
            .markdown-content h3 { font-size: 1.25em; }

            .markdown-content p {
                margin-bottom: 16px;
            }

            .markdown-content code {
                background: var(--bg-secondary, #f8f9fa);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.9em;
            }

            .markdown-content pre {
                background: var(--bg-secondary, #f8f9fa);
                padding: 16px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 16px 0;
                border: 1px solid var(--border-color, #e0e0e0);
            }

            .markdown-content pre code {
                background: none;
                padding: 0;
                border-radius: 0;
            }

            .markdown-content ul,
            .markdown-content ol {
                padding-left: 24px;
                margin-bottom: 16px;
            }

            .markdown-content li {
                margin-bottom: 8px;
            }

            .markdown-content a {
                color: var(--primary, #007bff);
                text-decoration: none;
            }

            .markdown-content a:hover {
                text-decoration: underline;
            }

            .markdown-content strong {
                font-weight: 600;
            }

            .markdown-content em {
                font-style: italic;
            }

            /* 代码高亮样式 */
            .markdown-content .keyword {
                color: #d73a49;
                font-weight: bold;
            }

            .markdown-content .string {
                color: #032f62;
            }

            .markdown-content .comment {
                color: #6a737d;
                font-style: italic;
            }

            /* Mermaid 图表样式 */
            .markdown-content .mermaid-diagram {
                margin: 16px 0;
                padding: 16px;
                background: var(--bg-secondary, #f8f9fa);
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 8px;
                text-align: center;
                overflow-x: auto;
            }

            .markdown-content .mermaid-diagram.mermaid-rendered {
                background: #fff;
                border: 1px solid var(--border-color, #e0e0e0);
            }

            .markdown-content .mermaid-diagram svg {
                max-width: 100%;
                height: auto;
            }

            .markdown-content .mermaid-diagram.mermaid-error {
                background: #ffeaea;
                border-color: #dc3545;
                color: #dc3545;
            }

            .markdown-content .mermaid-diagram.mermaid-fallback {
                background: #fff3cd;
                border-color: #ffc107;
                color: #856404;
            }

            .markdown-content .mermaid-diagram.mermaid-fallback::before {
                content: "⚠️ Mermaid 图表加载失败，显示原始代码：";
                display: block;
                margin-bottom: 8px;
                font-size: 0.9em;
                font-weight: bold;
            }

            .markdown-content .mermaid-diagram pre {
                margin: 0;
                background: transparent;
                border: none;
                padding: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 显示加载状态
     */
    showLoading(): void {
        this.loadingElement.style.display = 'flex';
        this.errorElement.style.display = 'none';
        this.contentElement.style.display = 'none';
    }

    /**
     * 显示错误状态
     */
    showError(message?: string): void {
        this.loadingElement.style.display = 'none';
        this.errorElement.style.display = 'flex';
        this.contentElement.style.display = 'none';
        
        if (message) {
            const errorMsg = this.errorElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.textContent = message;
            }
        }
    }

    /**
     * 显示内容
     */
    showContent(): void {
        this.loadingElement.style.display = 'none';
        this.errorElement.style.display = 'none';
        this.contentElement.style.display = 'block';
    }

    /**
     * 渲染 Markdown 内容
     */
    renderMarkdown(markdown: string): void {
        try {
            this.showLoading();
            
            // 使用安全的渲染器
            const html = this.renderer.render(markdown);
            this.contentElement.innerHTML = html;
            
            // 应用代码高亮
            this.renderer.highlightCode(this.contentElement);
            
            this.showContent();
        } catch (error) {
            console.error('Markdown rendering error:', error);
            this.showError('渲染失败，请检查内容格式');
        }
    }

    /**
     * 从 URL 加载 Markdown 内容
     */
    async loadFromUrl(url: string): Promise<void> {
        try {
            this.showLoading();
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdown = await response.text();
            this.renderMarkdown(markdown);
        } catch (error) {
            console.error('Failed to load markdown from URL:', error);
            this.showError('加载失败，请检查网络连接或文件路径');
        }
    }

    /**
     * 清空内容
     */
    clear(): void {
        this.contentElement.innerHTML = '';
        this.showContent();
    }

    /**
     * 获取渲染后的 HTML
     */
    getRenderedHtml(): string {
        return this.contentElement.innerHTML;
    }
}

/**
 * 创建 Markdown 查看器实例
 */
export function createMarkdownViewer(containerId: string): MarkdownViewer {
    return new MarkdownViewer(containerId);
}
