export const sideCardStyles = `
  /* 侧边导航容器 */
  .side-card {
    position: fixed;
    width: 250px;
    max-height: 80vh;
    overflow-y: auto;
    background-color: var(--color-bg-primary);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: all 0.3s ease;
    z-index: 10;
  }

  /* 左侧导航卡片定位 - 靠近页面左边 */
  .left-card {
    left: 20px;
    top: 120px;
  }

  /* 导航卡片内容样式 */
  .side-card-content h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    color: var(--color-text-primary);
    border-bottom: 1px solid var(--color-border-light);
    padding-bottom: 8px;
  }

  /* 导航部分样式 */
  .nav-section {
    margin-bottom: 20px;
  }

  .nav-section h4 {
    font-size: 15px;
    margin-bottom: 10px;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  /* 导航链接样式 */
  .nav-link {
    display: flex;
    align-items: center;
    padding: 8px 0;
    color: var(--color-text-primary);
    text-decoration: none;
    transition: all 0.2s ease;
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .nav-link:hover {
    background-color: var(--color-bg-hover);
    padding-left: 8px;
    color: var(--color-accent);
  }

  .nav-link.active {
    color: var(--color-accent);
    font-weight: 500;
  }

  .nav-icon {
    margin-right: 10px;
    font-size: 16px;
    width: 20px;
    text-align: center;
  }

  /* 响应式隐藏 */
  @media (max-width: 1000px) {
    .side-card {
      display: none;
    }
  }
`;
