import { providers } from '../../modules/get-started/types/provider';

// 创建别名命令元素
function createAliasCommandElement(aliasCommand: string): HTMLElement {
  const aliasDiv = document.createElement('div');
  aliasDiv.className = 'alias-command';
  
  const labelDiv = document.createElement('div');
  labelDiv.className = 'alias-label';
  labelDiv.textContent = '🚀 快速配置命令：';
  
  const codeDiv = document.createElement('div');
  codeDiv.className = 'alias-code';
  
  const codeElement = document.createElement('code');
  codeElement.textContent = aliasCommand;
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copy';
  copyBtn.onclick = () => {
    if (typeof (window as any).copyToClipboard === 'function') {
      (window as any).copyToClipboard(aliasCommand);
    }
  };
  
  codeDiv.appendChild(codeElement);
  codeDiv.appendChild(copyBtn);
  aliasDiv.appendChild(labelDiv);
  aliasDiv.appendChild(codeDiv);
  
  return aliasDiv;
}

// 创建部署提示元素
function createDeployNoticeElement(): HTMLElement {
  const noticeDiv = document.createElement('div');
  noticeDiv.className = 'deploy-notice';
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'notice-icon';
  iconDiv.textContent = '⚠️';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'notice-content';
  
  const strongP = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = '需要部署代理服务';
  strongP.appendChild(strong);
  
  const descP = document.createElement('p');
  descP.textContent = '该供应商需要您自己部署代理服务。请参考下方的部署指南。';
  
  contentDiv.appendChild(strongP);
  contentDiv.appendChild(descP);
  noticeDiv.appendChild(iconDiv);
  noticeDiv.appendChild(contentDiv);
  
  return noticeDiv;
}

// 创建特殊配置说明元素
function createSpecialConfigElement(notes: string): HTMLElement {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'special-note';
  
  const iconSpan = document.createElement('span');
  iconSpan.className = 'note-icon';
  iconSpan.textContent = 'ℹ️';
  
  noteDiv.appendChild(iconSpan);
  noteDiv.innerHTML += ' ' + notes; // 使用 innerHTML 因为 notes 可能包含 HTML
  
  return noteDiv;
}

// 创建特性标签列表元素
function createFeatureListElement(features: string[]): HTMLElement {
  const featuresDiv = document.createElement('div');
  featuresDiv.className = 'provider-features';
  
  const title = document.createElement('h5');
  title.textContent = '✨ 特性亮点：';
  
  const featureList = document.createElement('div');
  featureList.className = 'feature-list';
  
  features.forEach(feature => {
    const tag = document.createElement('span');
    tag.className = 'feature-tag';
    tag.textContent = feature;
    featureList.appendChild(tag);
  });
  
  featuresDiv.appendChild(title);
  featuresDiv.appendChild(featureList);
  
  return featuresDiv;
}

// 创建API Key链接元素
function createApiKeyLinkElement(apiKeyUrl: string): HTMLElement {
  const linksDiv = document.createElement('div');
  linksDiv.className = 'provider-links';
  
  const link = document.createElement('a');
  link.href = apiKeyUrl;
  link.target = '_blank';
  link.className = 'api-key-btn';
  link.textContent = '🔑 获取 API Key →';
  
  linksDiv.appendChild(link);
  
  return linksDiv;
}

// 生成供应商详情内容（使用 DOM 操作）
function generateProviderDetailsContent(provider: any): HTMLElement {
  const container = document.createElement('div');
  
  // 添加描述
  const description = document.createElement('p');
  description.className = 'provider-description';
  description.textContent = provider.description;
  container.appendChild(description);
  
  // 添加别名命令或部署提示
  if (provider.aliasCommand) {
    container.appendChild(createAliasCommandElement(provider.aliasCommand));
  } else if (!provider.isDirectlyUsable) {
    container.appendChild(createDeployNoticeElement());
  }
  
  // 添加特殊配置说明
  if (provider.specialConfig?.notes) {
    container.appendChild(createSpecialConfigElement(provider.specialConfig.notes));
  }
  
  // 添加特性标签
  container.appendChild(createFeatureListElement(provider.features));
  
  // 添加API Key链接
  container.appendChild(createApiKeyLinkElement(provider.apiKeyUrl));
  
  return container;
}

// 显示供应商详情的函数
export function showProviderDetails(providerId: string): void {
  const provider = providers.find(p => p.id === providerId);
  if (!provider) return;
  
  const detailsElement = document.getElementById('provider-details');
  const titleElement = document.getElementById('details-title');
  const contentElement = document.getElementById('details-content');
  
  if (!detailsElement || !titleElement || !contentElement) return;
  
  titleElement.textContent = provider.displayName;
  
  // 清空现有内容
  contentElement.innerHTML = '';
  
  // 添加新内容
  const detailsContent = generateProviderDetailsContent(provider);
  contentElement.appendChild(detailsContent);
  
  detailsElement.style.display = 'block';
  detailsElement.scrollIntoView({ behavior: 'smooth' });
}

// 隐藏供应商详情的函数
export function hideProviderDetails(): void {
  const detailsElement = document.getElementById('provider-details');
  if (detailsElement) {
    detailsElement.style.display = 'none';
  }
}

// 将函数暴露到全局作用域（用于 onclick 事件）
if (typeof window !== 'undefined') {
  (window as any).showProviderDetails = showProviderDetails;
  (window as any).hideProviderDetails = hideProviderDetails;
}
