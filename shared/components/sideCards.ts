/**
 * 侧边目录组件
 * 提供左侧导航目录
 */

// 左侧目录卡片
export const leftNavCard = () => {
  return `
    <div class="side-card left-card nav-card">
      <div class="side-card-content">
        <h3>📖 内容目录</h3>
        <div class="nav-section">
          <h4>快速开始</h4>
          <a href="#install" class="nav-link">
            <span class="nav-icon">💻</span>
            <span class="nav-text">安装 Claude Code</span>
          </a>
          <a href="#choose-provider" class="nav-link">
            <span class="nav-icon">🌐</span>
            <span class="nav-text">选择供应商</span>
          </a>
          <a href="#config" class="nav-link">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">配置环境</span>
          </a>
        </div>
        
        <div class="nav-section">
          <h4>使用指南</h4>
          <a href="#best-practices" class="nav-link">
            <span class="nav-icon">⚡</span>
            <span class="nav-text">最佳实践</span>
          </a>
          <a href="#implementation" class="nav-link">
            <span class="nav-icon">🔧</span>
            <span class="nav-text">实现原理</span>
          </a>
        </div>
      </div>
    </div>
  `;
};

// 添加页面锚点
export const addPageAnchors = () => {
  return `
    <script>
      // 为主要部分添加ID锚点
      document.addEventListener('DOMContentLoaded', () => {
        // 安装部分
        const installSection = document.querySelector('.step-item:nth-child(1)');
        if (installSection) installSection.id = 'install';
        
        // 选择供应商部分
        const providerSection = document.querySelector('.step-item:nth-child(2)');
        if (providerSection) providerSection.id = 'choose-provider';
        
        // 配置部分
        const configSection = document.querySelector('.step-item:nth-child(3)');
        if (configSection) configSection.id = 'config';
        
        // 最佳实践部分
        const bestPracticesSection = document.getElementById('best-practices-module');
        if (bestPracticesSection) bestPracticesSection.id = 'best-practices';
        
        // 实现原理部分
        const implementationSection = document.getElementById('implementation-module');
        if (implementationSection) implementationSection.id = 'implementation';
        
        // 添加平滑滚动
        document.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });
      });
    </script>
  `;
};

// 组合卡片和脚本
export const sideCardsComponent = `
  <!-- 左侧目录卡片 -->
  ${leftNavCard()}
  
  <!-- 添加页面锚点脚本 -->
  ${addPageAnchors()}
`;
