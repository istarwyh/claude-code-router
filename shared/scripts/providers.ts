// Provider-related shared functions

export const providerScripts = `
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
`;
