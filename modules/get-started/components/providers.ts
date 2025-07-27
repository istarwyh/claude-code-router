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
  return `${statusBadge}${specialBadge}${specialAiCodeWithBadge}`;
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
    <div class="compact-provider-card" data-provider="${escapeHtml(provider.id)}" onclick="showProviderDetails('${escapeHtml(provider.id)}')">
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

// 生成详细信息的函数
function generateProviderDetailsContent(provider: any) {
  const aliasSection = provider.aliasCommand ? `
    <div class="alias-command">
      <div class="alias-label">🚀 快速配置命令：</div>
      <div class="alias-code">
        <code>${provider.aliasCommand}</code>
        <button class="copy-btn" onclick="copyToClipboard('${provider.aliasCommand.replace(/'/g, "\\'")}')">Copy</button>
      </div>
    </div>` : `
    <div class="deploy-notice">
      <div class="notice-icon">⚠️</div>
      <div class="notice-content">
        <p><strong>需要部署代理服务</strong></p>
        <p>该供应商需要您自己部署代理服务。请参考下方的部署指南。</p>
      </div>
    </div>`;
  
  const specialConfigSection = provider.specialConfig?.notes ? `
    <div class="special-note">
      <span class="note-icon">ℹ️</span>
      ${provider.specialConfig.notes}
    </div>` : '';
  
  return `
    <p class="provider-description">${provider.description}</p>
    ${aliasSection}
    ${specialConfigSection}
    <div class="provider-features">
      <h5>✨ 特性亮点：</h5>
      <div class="feature-list">
        ${provider.features.map((feature: string) => `<span class="feature-tag">${feature}</span>`).join('')}
      </div>
    </div>
    <div class="provider-links">
      <a href="${provider.apiKeyUrl}" target="_blank" class="api-key-btn">
        🔑 获取 API Key →
      </a>
    </div>
  `;
}

// 生成所有紧凑型供应商卡片的 HTML
function generateAllProviderCards() {
  return providers.map(provider => generateCompactProviderCard(provider)).join('');
}

export const providersComponent = `
<!-- Provider Selection integrated into Quick Setup -->
<div class="provider-selection">
    <div class="compact-provider-grid">
        ${generateAllProviderCards()}
    </div>
</div>

${providerDetailsComponent}

<script>
// 供应商数据
const providersData = ${JSON.stringify(providers)};

// 工具函数：基于字符串生成唯一颜色
function generateProviderColor(providerId) {
  let hash = 0;
  for (let i = 0; i < providerId.length; i++) {
    hash = providerId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;
  const saturation = 65 + (Math.abs(hash >> 8) % 20);
  const lightness = 45 + (Math.abs(hash >> 16) % 15);
  
  return \`linear-gradient(45deg, hsl(\${hue1}, \${saturation}%, \${lightness}%), hsl(\${hue2}, \${saturation}%, \${lightness - 5}%))\`;
}

// 工具函数：获取provider颜色（优先使用自定义颜色，否则自动生成）
function getProviderColor(provider) {
  return provider.color || generateProviderColor(provider.id);
}

// 显示供应商详情
function showProviderDetails(providerId) {
  const provider = providersData.find(p => p.id === providerId);
  if (!provider) return;
  
  const detailsElement = document.getElementById('provider-details');
  const titleElement = document.getElementById('details-title');
  const contentElement = document.getElementById('details-content');
  
  titleElement.textContent = provider.displayName;
  contentElement.innerHTML = generateProviderDetailsContent(provider);
  
  detailsElement.style.display = 'block';
  detailsElement.scrollIntoView({ behavior: 'smooth' });
}

// 隐藏供应商详情
function hideProviderDetails() {
  document.getElementById('provider-details').style.display = 'none';
}

// 生成详细内容
function generateProviderDetailsContent(provider) {
  const aliasSection = provider.aliasCommand ? \`
    <div class="alias-command">
      <div class="alias-label">🚀 快速配置命令：</div>
      <div class="alias-code">
        <code>\${provider.aliasCommand}</code>
        <button class="copy-btn" onclick="copyToClipboard('\${provider.aliasCommand.replace(/'/g, "\\\\'")}')">Copy</button>
      </div>
    </div>\` : \`
    <div class="deploy-notice">
      <div class="notice-icon">⚠️</div>
      <div class="notice-content">
        <p><strong>需要部署代理服务</strong></p>
        <p>该供应商需要您自己部署代理服务。请参考下方的部署指南。</p>
      </div>
    </div>\`;
  
  const specialConfigSection = provider.specialConfig?.notes ? \`
    <div class="special-note">
      <span class="note-icon">ℹ️</span>
      \${provider.specialConfig.notes}
    </div>\` : '';
  
  return \`
    <p class="provider-description">\${provider.description}</p>
    \${aliasSection}
    \${specialConfigSection}
    <div class="provider-features">
      <h5>✨ 特性亮点：</h5>
      <div class="feature-list">
        \${provider.features.map(feature => \`<span class="feature-tag">\${feature}</span>\`).join('')}
      </div>
    </div>
    <div class="provider-links">
      <a href="\${provider.apiKeyUrl}" target="_blank" class="api-key-btn">
        🔑 获取 API Key →
      </a>
    </div>
  \`;
}

// 滚动到指定供应商卡片
function scrollToProvider(providerId) {
  const providerCard = document.getElementById('provider-' + providerId);
  if (providerCard) {
    // 移除所有卡片的高亮
    document.querySelectorAll('.compact-provider-card').forEach(card => {
      card.classList.remove('highlighted');
    });
    
    // 高亮目标卡片
    providerCard.classList.add('highlighted');
    
    // 滚动到卡片位置
    providerCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // 3秒后移除高亮
    setTimeout(() => {
      providerCard.classList.remove('highlighted');
    }, 3000);
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '命令已复制到剪贴板！';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }).catch(function(err) {
    console.error('复制失败: ', err);
  });
}
</script>
`;
