import { createMarkdownViewer, MarkdownViewer } from '../../../shared/components/markdownViewer.js';

/**
 * Markdown渲染器组件
 * 使用安全的 Markdown 渲染器，避免 XSS 攻击和代码重复
 */
export class MarkdownRenderer {
    private viewer: MarkdownViewer;

    constructor(containerId: string) {
        try {
            this.viewer = createMarkdownViewer(containerId);
        } catch (error) {
            console.error('Failed to initialize MarkdownRenderer:', error);
            throw error;
        }
    }

    /**
     * 从 URL 加载 Markdown 内容
     */
    async loadMarkdown(url: string): Promise<void> {
        try {
            await this.viewer.loadFromUrl(url);
        } catch (error) {
            console.error('Failed to load Markdown:', error);
            throw error;
        }
    }

    /**
     * 直接渲染 Markdown 内容
     */
    renderMarkdown(markdown: string): void {
        try {
            this.viewer.renderMarkdown(markdown);
        } catch (error) {
            console.error('Failed to render Markdown:', error);
            throw error;
        }
    }

    /**
     * 显示加载状态
     */
    showLoading(): void {
        this.viewer.showLoading();
    }

    /**
     * 显示错误状态
     */
    showError(message?: string): void {
        this.viewer.showError(message);
    }

    /**
     * 清空内容
     */
    clear(): void {
        this.viewer.clear();
    }

    /**
     * 获取渲染后的 HTML
     */
    getRenderedHtml(): string {
        return this.viewer.getRenderedHtml();
    }
}

/**
 * 创建 Markdown 渲染器实例
 */
export function createMarkdownRenderer(containerId: string): MarkdownRenderer {
    return new MarkdownRenderer(containerId);
}

// 导出组件模板（保持向后兼容）
export const markdownRendererComponent = `
<!-- Markdown Renderer Component -->
<div class="markdown-renderer" id="markdown-content">
    <!-- 内容将通过 MarkdownViewer 组件渲染 -->
</div>
`;
