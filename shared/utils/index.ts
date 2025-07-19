// 共享工具函数

/**
 * 生成内容路径
 */
export function generateContentPath(module: string, type: string, id: string): string {
  return `/modules/${module}/${type}/${id}`;
}

/**
 * 格式化模块标题
 */
export function formatModuleTitle(moduleId: string, config: any): string {
  const module = config[moduleId];
  return module ? `${module.icon} ${module.title}` : moduleId;
}

/**
 * 检查内容状态
 */
export function isContentAvailable(status: string): boolean {
  return status === 'published';
}

/**
 * 生成面包屑导航
 */
export function generateBreadcrumb(path: string[]): string {
  return path.map((item, index) => {
    const isLast = index === path.length - 1;
    return isLast ? `<span class="breadcrumb-current">${item}</span>` : 
           `<a href="#" class="breadcrumb-link">${item}</a>`;
  }).join(' <span class="breadcrumb-separator">></span> ');
}

/**
 * 内容搜索和过滤
 */
export function filterContent(items: any[], query: string, category?: string): any[] {
  return items.filter(item => {
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = !category || item.category === category;
    
    return matchesQuery && matchesCategory;
  });
}
