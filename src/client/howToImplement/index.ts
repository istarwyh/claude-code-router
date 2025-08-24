import { HowToImplementManager } from './core/HowToImplementManager';
import { loadHighlightJsStyle } from '../../../shared/utils/highlight';

export function initializeHowToImplement(): void {
  console.log('初始化 How to Implement 模块...');
  // 注入高亮主题样式（异步，不阻塞）
  try { loadHighlightJsStyle(); } catch {}
  
  const manager = new HowToImplementManager();
  manager.initialize();
  
  // 暴露到全局作用域以便页面调用
  (window as any).initializeHowToImplement = initializeHowToImplement;
  
  console.log('How to Implement 模块初始化完成');
}

// 自动初始化（如果在浏览器环境中）
if (typeof window !== 'undefined') {
  initializeHowToImplement();
}