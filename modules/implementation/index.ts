import { implementationComponent } from './components/implementation';

// 未来可以在这里导入更多技术指南
// import { architectureGuide } from './guides/architecture';
// import { deploymentGuide } from './guides/deployment';
// import { securityGuide } from './guides/security';

export const implementationModule = implementationComponent;

export * from './components/implementation';

// 技术指南列表 - 未来扩展用
export const guidesList = [
  {
    id: 'architecture-deep-dive',
    title: '系统架构深度解析',
    category: 'architecture',
    status: 'coming-soon'
  },
  {
    id: 'api-proxy-mechanism',
    title: 'API 代理机制详解',
    category: 'api',
    status: 'coming-soon'
  },
  {
    id: 'security-best-practices',
    title: '安全最佳实践指南',
    category: 'security',
    status: 'coming-soon'
  },
  {
    id: 'performance-optimization',
    title: '性能优化实战',
    category: 'performance',
    status: 'coming-soon'
  }
];
