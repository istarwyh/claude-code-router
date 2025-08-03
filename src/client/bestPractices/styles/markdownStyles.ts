/**
 * Markdown 内容专用样式
 * 为最佳实践模块的 Markdown 内容提供美观的样式
 */
export const markdownStyles = `
/* Markdown 内容容器 */
.practice-article {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.practice-article__header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.practice-article__back-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.practice-article__back-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.practice-article__content {
  line-height: 1.7;
  color: #374151;
}

/* Markdown 内容样式 */
.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.markdown-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.markdown-content h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin: 32px 0 16px 0;
  padding-left: 12px;
  border-left: 4px solid #3b82f6;
}

.markdown-content h3 {
  font-size: 1.375rem;
  font-weight: 600;
  color: #1f2937;
  margin: 24px 0 12px 0;
}

.markdown-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 10px 0;
}

.markdown-content p {
  margin-bottom: 16px;
  line-height: 1.7;
  color: #4b5563;
}

.markdown-content strong {
  font-weight: 600;
  color: #1f2937;
}

.markdown-content em {
  font-style: italic;
  color: #6b7280;
}

/* 列表样式 */
.markdown-content ul,
.markdown-content ol {
  margin: 16px 0;
  padding-left: 24px;
}

.markdown-content li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #4b5563;
}

.markdown-content li strong {
  color: #1f2937;
}

/* 代码样式 */
.markdown-content code {
  background: #f1f5f9;
  color: #e11d48;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9em;
  border: 1px solid #e2e8f0;
}

/* 代码块样式 - 匹配 SafeMarkdownRenderer 生成的结构 */
.markdown-content .code-block {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  overflow-x: auto;
  position: relative;
}

.markdown-content .code-block pre {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.markdown-content .code-block pre code {
  background: none;
  color: #334155;
  padding: 0;
  border: none;
  border-radius: 0;
  display: block;
  white-space: pre;
}

/* 骨架屏加载动画 */
.article-skeleton {
  padding: 20px 0;
}

.skeleton-title {
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
  width: 60%;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
  width: 100%;
}

.skeleton-line.short {
  width: 70%;
}

.skeleton-diagram {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
  margin: 24px 0;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Mermaid 图表增强样式 */
.markdown-content .mermaid-diagram {
  margin: 24px 0;
  padding: 20px;
  background: #fafbfc;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  text-align: center;
  overflow-x: auto;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.markdown-content .mermaid-diagram:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.markdown-content .mermaid-diagram.mermaid-rendered {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 16px;
  cursor: pointer;
}

.markdown-content .mermaid-diagram.mermaid-rendered::after {
  content: "🔍 点击查看大图";
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.markdown-content .mermaid-diagram.mermaid-rendered:hover::after {
  opacity: 1;
}

.markdown-content .mermaid-diagram svg {
  max-width: 100%;
  height: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  transition: transform 0.3s ease;
}

.markdown-content .mermaid-diagram.mermaid-rendered:hover svg {
  transform: scale(1.02);
}

/* 全屏查看模态框 */
.mermaid-fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.mermaid-fullscreen-content {
  max-width: 95%;
  max-height: 95%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow: auto;
  transform: scale(0.9);
  animation: scaleIn 0.3s ease forwards;
}

.mermaid-fullscreen-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 1001;
}

.mermaid-fullscreen-close:hover {
  color: #333;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes scaleIn {
  to { transform: scale(1); }
}

/* 复制按钮样式 - 适配新的代码块结构 */
.markdown-content .code-block:hover .copy-button {
  opacity: 1;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1;
}

.copy-button:hover {
  background: #d1d5db;
}

.copy-button.copied {
  background: #10b981;
  color: white;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* 阅读进度条 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  z-index: 999;
  transition: width 0.1s ease;
}

/* 链接样式 */
.markdown-content a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.markdown-content a:hover {
  color: #1d4ed8;
  border-bottom-color: #3b82f6;
}

/* 引用块样式 */
.markdown-content blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 16px;
  margin: 20px 0;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
  padding: 16px;
  border-radius: 0 8px 8px 0;
}

/* 表格样式 */
.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.markdown-content th,
.markdown-content td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.markdown-content th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.markdown-content tr:hover {
  background: #f9fafb;
}

/* 分隔线样式 */
.markdown-content hr {
  border: none;
  height: 1px;
  background: #e5e7eb;
  margin: 32px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .practice-article {
    margin: 10px;
    padding: 16px;
  }
  
  .markdown-content h1 {
    font-size: 1.875rem;
  }
  
  .markdown-content h2 {
    font-size: 1.5rem;
  }
  
  .markdown-content pre {
    padding: 12px;
    font-size: 0.8rem;
  }
}
`;

/**
 * 注入 Markdown 样式到页面
 */
export function injectMarkdownStyles(): void {
  if (document.getElementById('markdown-styles')) {
    return; // 样式已经注入
  }
  
  const style = document.createElement('style');
  style.id = 'markdown-styles';
  style.textContent = markdownStyles;
  document.head.appendChild(style);
}
