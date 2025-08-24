// 最佳实践模块的客户端入口文件
// 这个文件将被 esbuild 打包成单个 IIFE

import { BestPracticesManager } from './core/BestPracticesManager';
import { initializeApp } from './utils/initialization';
import { loadHighlightJsStyle } from '../../../shared/utils/highlight';

// 全局初始化函数
function initializeBestPractices() {
  // 确保加载高亮主题样式（异步注入，不阻塞初始化）
  try { loadHighlightJsStyle(); } catch {}
  initializeApp(() => {
    const manager = new BestPracticesManager();
    manager.initialize();
  });
}

// 导出到全局作用域，供 HTML 调用
(window as any).initializeBestPractices = initializeBestPractices;

// 自动初始化（如果 DOM 已就绪）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBestPractices);
} else {
  initializeBestPractices();
}
