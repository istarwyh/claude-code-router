export const markdownRendererComponent = `
<!-- Markdown Renderer Component -->
<div class="markdown-renderer" id="markdown-content">
    <div class="loading" id="loading">
        <div class="spinner"></div>
        <p>正在加载文档...</p>
    </div>

    <div class="content" id="content" style="display: none;">
        <!-- 内容将通过JavaScript渲染 -->
    </div>

    <div class="error" id="error" style="display: none;">
        <div class="error-icon">⚠️</div>
        <p>加载文档时出错</p>
    </div>
</div>

<style>
.markdown-renderer {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    max-width: none;
}

.loading {
    text-align: center;
    padding: 4rem 2rem;
}

.spinner {
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--accent-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

/* Markdown 样式 */
.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
    margin: 2rem 0 1rem 0;
    font-weight: 600;
    line-height: 1.3;
}

.markdown-content h1 {
    font-size: 2.5rem;
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.markdown-content h2 {
    font-size: 2rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3rem;
}

.markdown-content h3 {
    font-size: 1.5rem;
}

.markdown-content h4 {
    font-size: 1.25rem;
}

.markdown-content h5 {
    font-size: 1.1rem;
}

.markdown-content h6 {
    font-size: 1rem;
}

.markdown-content p {
    margin: 1rem 0;
    color: var(--text-primary);
}

.markdown-content ul,
.markdown-content ol {
    margin: 1rem 0;
    padding-left: 2rem;
}

.markdown-content li {
    margin: 0.5rem 0;
    color: var(--text-primary);
}

.markdown-content code {
    background: var(--bg-code);
    color: var(--text-code);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
}

.markdown-content pre {
    background: var(--bg-code);
    color: var(--text-code);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid var(--border-color);
}

.markdown-content pre code {
    background: none;
    padding: 0;
    border-radius: 0;
}

.markdown-content blockquote {
    border-left: 4px solid var(--accent-color);
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-style: italic;
}

.markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.markdown-content th,
.markdown-content td {
    border: 1px solid var(--border-color);
    padding: 0.75rem;
    text-align: left;
}

.markdown-content th {
    background: var(--bg-secondary);
    font-weight: 600;
}

.markdown-content strong {
    font-weight: 600;
    color: var(--text-primary);
}

.markdown-content em {
    font-style: italic;
    color: var(--text-secondary);
}

.markdown-content a {
    color: var(--accent-color);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
}

.markdown-content a:hover {
    border-bottom-color: var(--accent-color);
}

.markdown-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
}

.markdown-content hr {
    border: none;
    height: 1px;
    background: var(--border-color);
    margin: 2rem 0;
}

/* 特殊样式 */
.markdown-content .warning {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    border-left: 4px solid #ffc107;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
}

.markdown-content .info {
    background: rgba(0, 123, 255, 0.1);
    border: 1px solid rgba(0, 123, 255, 0.3);
    border-left: 4px solid #007bff;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
}

.markdown-content .tip {
    background: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.3);
    border-left: 4px solid #28a745;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
}

/* 代码高亮 */
.markdown-content .hljs {
    background: var(--bg-code);
    color: var(--text-code);
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
}

.markdown-content .hljs-keyword {
    color: #d73a49;
}

.markdown-content .hljs-string {
    color: #032f62;
}

.markdown-content .hljs-comment {
    color: #6a737d;
}

.markdown-content .hljs-function {
    color: #6f42c1;
}

.markdown-content .hljs-number {
    color: #005cc5;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .markdown-content {
        padding: 1rem;
    }
    
    .markdown-content h1 {
        font-size: 2rem;
    }
    
    .markdown-content h2 {
        font-size: 1.75rem;
    }
    
    .markdown-content h3 {
        font-size: 1.5rem;
    }
}
</style>

<script>
class MarkdownRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.content = this.container.querySelector('#content');
        this.loading = this.container.querySelector('#loading');
        this.error = this.container.querySelector('#error');
    }

    async loadMarkdown(url) {
        this.showLoading();
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            const markdown = await response.text();
            const html = this.renderMarkdown(markdown);
            this.renderContent(html);
        } catch (error) {
            this.showError(error.message);
        }
    }

    renderMarkdown(markdown) {
        // 简单的Markdown渲染器
        let html = markdown;
        
        // 标题
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // 代码块
        html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
        html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
        
        // 粗体和斜体
        html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
        html = html.replace(/\\*(.*?)\\*/g, '<em>$1</em>');
        
        // 链接
        html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 列表
        html = html.replace(/^\\* (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');
        
        // 段落
        html = html.replace(/\\n\\n/g, '</p><p>');
        html = html.replace(/^<p>/, '<p>');
        html = html.replace(/<\\/p>$/, '</p>');
        
        return html;
    }

    renderContent(html) {
        this.content.innerHTML = html;
        this.content.className = 'markdown-content';
        this.hideLoading();
        this.hideError();
        this.showContent();
        
        // 添加代码高亮
        this.highlightCode();
    }

    highlightCode() {
        // 简单的代码高亮
        const codeBlocks = this.content.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            let html = block.innerHTML;
            
            // 关键字高亮
            html = html.replace(/\\b(class|function|async|await|const|let|var|import|export|return|if|else|for|while|try|catch)\\b/g, '<span class="hljs-keyword">$1</span>');
            
            // 字符串高亮
            html = html.replace(/"([^"]*)"/g, '<span class="hljs-string">"$1"</span>');
            html = html.replace(/'([^']*)'/g, '<span class="hljs-string">\'$1\'</span>');
            
            // 注释高亮
            html = html.replace(/\\/\\/.*$/gm, '<span class="hljs-comment">$&</span>');
            html = html.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '<span class="hljs-comment">$&</span>');
            
            // 数字高亮
            html = html.replace(/\\b\\d+\\b/g, '<span class="hljs-number">$&</span>');
            
            block.innerHTML = html;
        });
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.content.style.display = 'none';
        this.error.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showContent() {
        this.content.style.display = 'block';
    }

    showError(message) {
        this.error.style.display = 'block';
        this.error.querySelector('p').textContent = message;
        this.hideLoading();
        this.hideContent();
    }

    hideError() {
        this.error.style.display = 'none';
    }

    hideContent() {
        this.content.style.display = 'none';
    }
}

// 初始化Markdown渲染器
window.addEventListener('DOMContentLoaded', () => {
    const renderer = new MarkdownRenderer('markdown-content');
    
    // 提供全局访问
    window.markdownRenderer = renderer;
    
    // 加载示例文档
    renderer.loadMarkdown('./docs/claude-code-implementation.md');
});
</script>
`;

export { markdownRendererComponent };