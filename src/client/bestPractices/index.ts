// 最佳实践模块的客户端入口文件
// 这个文件将被 esbuild 打包成单个 IIFE

import { BestPracticesManager } from './core/BestPracticesManager';
import { initializeApp } from './utils/initialization';

// 全局初始化函数
function initializeBestPractices() {
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
