import { HowToImplementManager } from './core/HowToImplementManager';

export function initializeHowToImplement(): void {
  console.log('初始化 How to Implement 模块...');
  
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