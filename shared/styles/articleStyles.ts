export const articleStyles = `
/* 基础文章内容样式 - 用于脚本中的简单文章显示 */
.article-container h1,
.article-container h2,
.article-container h3 {
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.article-container h1 {
  font-size: 1.8rem;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.article-container h2 {
  font-size: 1.4rem;
  font-weight: 600;
  border-left: 4px solid #667eea;
  padding-left: 12px;
}

.article-container h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.article-container p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

.article-container ul,
.article-container ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-container li {
  margin-bottom: 0.5rem;
  color: #4b5563;
  line-height: 1.5;
}

.article-container strong {
  color: #1f2937;
  font-weight: 600;
}

.article-container pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.article-container code {
  background: #f3f4f6;
  color: #db2777;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
}

.article-container pre code {
  background: none;
  color: inherit;
  padding: 0;
}

/* 文章容器样式 */
.article-container {
  max-width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 文章头部 */
.article-header {
  padding: 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.article-back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.article-back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.article-breadcrumb {
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-separator {
  opacity: 0.7;
}

/* 文章英雄区域 */
.article-hero {
  padding: 40px 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid #e1e8ed;
}

.article-hero__content {
  max-width: 800px;
  margin: 0 auto;
}

.article-hero__meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.article-hero__icon {
  font-size: 24px;
}

.article-hero__category {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.article-hero__difficulty {
  background: var(--difficulty-color, #10b981);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.article-hero__read-time {
  color: #6b7280;
  font-size: 14px;
}

.article-hero__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.2;
}

.article-hero__description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.article-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.article-hero__tag {
  background: white;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  font-weight: 500;
}

/* 文章导航 */
.article-nav {
  padding: 30px;
  background: #f8fafc;
  border-bottom: 1px solid #e1e8ed;
}

.article-nav__content {
  max-width: 800px;
  margin: 0 auto;
}

.article-nav h3 {
  margin-bottom: 20px;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.article-nav__sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.article-nav__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: #374151;
}

.article-nav__link:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.nav-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.nav-title {
  font-weight: 500;
}

/* 文章内容 */
.article-content {
  padding: 40px 30px;
}

.article-content__wrapper {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
  color: #374151;
}

.article-content__wrapper h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.article-content__wrapper h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1.5rem 0 1rem 0;
  padding-left: 12px;
  border-left: 4px solid #667eea;
}

.article-content__wrapper h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 1.25rem 0 0.75rem 0;
}

.article-content__wrapper h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0 0.5rem 0;
}

.article-content__wrapper p {
  margin-bottom: 1rem;
  color: #4b5563;
}

.article-content__wrapper ul,
.article-content__wrapper ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-content__wrapper li {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.article-content__wrapper blockquote {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #1f2937;
  border-radius: 0 8px 8px 0;
}

.article-content__wrapper a {
  color: #3b82f6;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.article-content__wrapper a:hover {
  border-bottom-color: #3b82f6;
}

.article-content__wrapper strong {
  font-weight: 600;
  color: #1f2937;
}

.article-content__wrapper em {
  font-style: italic;
  color: #6b7280;
}

.article-content__wrapper code {
  background: #f3f4f6;
  color: #db2777;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875em;
}

.article-content__wrapper pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.article-content__wrapper pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
}

/* 表格样式 */
.article-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.article-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
}

.article-table tr:last-child td {
  border-bottom: none;
}

.article-table tr:hover {
  background: #f8fafc;
}

/* Mermaid 图表样式 */
.mermaid {
  text-align: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.mermaid-placeholder {
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
  text-align: center;
  background: #f3f4f6;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

/* 文章底部 */
.article-footer {
  padding: 30px;
  background: #f8fafc;
  border-top: 1px solid #e1e8ed;
}

.article-footer__info {
  max-width: 800px;
  margin: 0 auto 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.article-footer__info p {
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 14px;
}

.article-footer__actions {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.article-footer__btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 14px;
}

.article-footer__btn--primary {
  background: #667eea;
  color: white;
}

.article-footer__btn--primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.article-footer__btn--secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.article-footer__btn--secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* 加载状态 */
.article-loading {
  padding: 60px 30px;
  text-align: center;
}

.article-loading-content h2 {
  color: #374151;
  margin-bottom: 16px;
}

.article-loading-content p {
  color: #6b7280;
  margin-bottom: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px auto;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.article-error {
  padding: 60px 30px;
  text-align: center;
}

.article-error-content {
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.article-error-content h2 {
  color: #ef4444;
  margin-bottom: 16px;
}

.article-error-content p {
  color: #6b7280;
  margin-bottom: 30px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.retry-btn, .back-btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
}

.retry-btn {
  background: #3b82f6;
  color: white;
}

.retry-btn:hover {
  background: #2563eb;
}

.back-btn {
  background: #f3f4f6;
  color: #374151;
}

.back-btn:hover {
  background: #e5e7eb;
}

/* 面包屑导航样式 */
.practices-page__breadcrumb {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.breadcrumb-back {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.breadcrumb-back:hover {
  background: rgba(255, 255, 255, 0.3);
}

.breadcrumb-path {
  font-size: 12px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-header {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-hero {
    padding: 30px 20px;
  }
  
  .article-hero__title {
    font-size: 2rem;
  }
  
  .article-nav {
    padding: 20px;
  }
  
  .article-nav__sections {
    grid-template-columns: 1fr;
  }
  
  .article-content {
    padding: 30px 20px;
  }
  
  .article-footer {
    padding: 20px;
  }
  
  .article-footer__actions {
    flex-direction: column;
  }
  
  .article-content__wrapper pre {
    padding: 1rem;
    font-size: 0.8rem;
  }
  
  .article-table {
    font-size: 14px;
  }
  
  .article-table th,
  .article-table td {
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .article-hero__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .article-hero__title {
    font-size: 1.75rem;
  }
  
  .article-nav__link {
    padding: 10px 12px;
  }
  
  .article-content__wrapper {
    font-size: 16px;
  }
  
  .practices-page__breadcrumb {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
`;