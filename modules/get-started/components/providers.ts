import { providers } from '../types/provider';

// 工具函数：转义HTML特殊字符以防止XSS攻击
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 工具函数：获取状态徽章
function getStatusBadge(isDirectlyUsable: boolean, providerId: string): string {
  const statusBadge = isDirectlyUsable ? 
    '<span class="status-ready">✓ 即用</span>' : 
    '<span class="status-deploy">⚠ 部署</span>';
  
  const specialBadge = providerId === 'anyrouter' ? 
    '<span class="bonus-badge">🎁 $100</span>' : '';
  
  const specialAiCodeWithBadge = providerId === 'aicodewith' ? 
    '<span class="bonus-badge">🎁 2000 Free Credits</span>' : '';
    
  const specialClaudeCodeBadge = providerId === 'claude-code' ? 
    '<span class="bonus-badge">🎁 4000 积分</span>' : '';
    
  return `${statusBadge}${specialBadge}${specialAiCodeWithBadge}${specialClaudeCodeBadge}`;
}

// 工具函数：获取provider颜色（优先使用自定义颜色，否则自动生成）
function getProviderColor(provider: any): string {
  if (provider.color) {
    return provider.color;
  }
  
  // 自动生成颜色的哈希函数
  let hash = 0;
  for (let i = 0; i < provider.id.length; i++) {
    hash = provider.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;
  const saturation = 65 + (Math.abs(hash >> 8) % 20);
  const lightness = 45 + (Math.abs(hash >> 16) % 15);
  
  return `linear-gradient(45deg, hsl(${hue1}, ${saturation}%, ${lightness}%), hsl(${hue2}, ${saturation}%, ${lightness - 5}%))`;
}

// 紧凑的供应商卡片生成函数
function generateCompactProviderCard(provider: any) {
  const statusBadges = getStatusBadge(provider.isDirectlyUsable, provider.id);
  const iconStyle = getProviderColor(provider);
  
  return `
    <div id="provider-${escapeHtml(provider.id)}" class="compact-provider-card" data-provider="${escapeHtml(provider.id)}" onclick="showProviderDetails('${escapeHtml(provider.id)}')">
      <div class="provider-header">
        <span class="provider-icon" style="background: ${iconStyle}">${escapeHtml(provider.icon)}</span>
        <div class="provider-info">
          <h4>${escapeHtml(provider.displayName)}</h4>
          <div class="provider-badges">
            ${statusBadges}
          </div>
        </div>
      </div>
      <p class="provider-desc">${escapeHtml(provider.description)}</p>
    </div>`;
}

// 供应商详情组件
export const providerDetailsComponent = `
<div class="provider-details" id="provider-details" style="display: none;">
    <div class="details-header">
        <h4 id="details-title"></h4>
        <button class="close-details" onclick="hideProviderDetails()">×</button>
    </div>
    <div class="details-content" id="details-content"></div>
</div>
`;

// Worker 中只负责生成静态 HTML 结构
// DOM 操作函数将移到客户端脚本中

// 生成所有紧凑型供应商卡片的 HTML
function generateAllProviderCards() {
  return providers.map(provider => generateCompactProviderCard(provider)).join('');
}

// 供应商详情交互函数将在客户端实现
// 这里只提供类型定义和接口

export const providersComponent = `
<!-- Provider Selection integrated into Quick Setup -->
<div class="provider-selection">
    <div class="compact-provider-grid">
        ${generateAllProviderCards()}
    </div>
</div>

${providerDetailsComponent}

<!-- 不再需要 JavaScript 代码，使用 TypeScript 模块化实现 -->
`;
