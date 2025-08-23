/**
 * 代码高亮工具 - 使用highlight.js进行语法高亮
 */

// 动态加载highlight.js库
let highlightJs: any = null;

/**
 * 异步加载highlight.js库
 */
async function loadHighlightJs(): Promise<any> {
    if (highlightJs) return highlightJs;
    
    try {
        // 使用CDN加载highlight.js
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        script.async = true;
        
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });

        // 加载TypeScript语言支持
        const tsScript = document.createElement('script');
        tsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js';
        tsScript.async = true;
        
        await new Promise((resolve, reject) => {
            tsScript.onload = resolve;
            tsScript.onerror = reject;
            document.head.appendChild(tsScript);
        });

        highlightJs = (window as any).hljs;
        return highlightJs;
    } catch (error) {
        console.error('Failed to load highlight.js:', error);
        return null;
    }
}

/**
 * 高亮代码块
 */
export async function highlightCode(code: string, language: string = 'typescript'): Promise<string> {
    const hljs = await loadHighlightJs();
    if (!hljs) {
        // fallback: 简单包裹在<pre><code>中
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }

    try {
        const result = hljs.highlight(code, { language });
        return `<pre><code class="hljs language-${language}">${result.value}</code></pre>`;
    } catch (error) {
        console.error('Highlighting failed:', error);
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
}

/**
 * 高亮页面中的所有代码块
 */
export async function highlightAllCodeBlocks(): Promise<void> {
    const hljs = await loadHighlightJs();
    if (!hljs) return;

    try {
        hljs.highlightAll();
    } catch (error) {
        console.error('Failed to highlight all code blocks:', error);
    }
}

/**
 * HTML转义函数
 */
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 异步加载highlight.js样式
 */
export async function loadHighlightJsStyle(): Promise<void> {
    try {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
        document.head.appendChild(link);
    } catch (error) {
        console.error('Failed to load highlight.js styles:', error);
    }
}