export const bestPracticesOverviewCardStyles = `
  /* 概览卡片网格布局 */
  .overview-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 2rem 0;
  }

  /* 基础卡片样式 */
  .overview-card {
    background: var(--bp-bg-primary);
    border: 1px solid var(--bp-border-color);
    border-radius: 16px;
    padding: 1rem 1rem 1.25rem 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .overview-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--bp-accent), var(--bp-primary));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .overview-card:hover::before,
  .overview-card--hover::before {
    opacity: 1;
  }

  .overview-card:hover,
  .overview-card--hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--bp-border-hover);
  }

  /* 卡片头部 */
  .overview-card__header {
    margin-bottom: 1.5rem;
  }

  .overview-card__title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  /* 封面图 */
  .overview-card__cover {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 0.75rem;
    background: var(--bp-bg-secondary);
  }

  .overview-card__cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .overview-card__icon {
    font-size: 2rem;
    line-height: 1;
  }

  .overview-card__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--bp-text-primary);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .overview-card__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .overview-card__difficulty {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background: var(--difficulty-color, var(--bp-accent));
    color: white;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    opacity: 0.9;
  }

  .overview-card__read-time {
    color: var(--bp-text-secondary);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* 卡片内容 */
  .overview-card__content {
    margin-bottom: 1.5rem;
  }

  .overview-card__description {
    font-size: 1.1rem;
    color: var(--bp-text-primary);
    margin: 0 0 1rem 0;
    font-weight: 500;
    line-height: 1.5;
  }

  .overview-card__overview {
    color: var(--bp-text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* 章节列表 */
  .overview-card__sections {
    margin-bottom: 1.5rem;
  }

  .overview-card__sections-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--bp-text-primary);
    margin: 0 0 0.75rem 0;
  }

  .overview-card__sections-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .overview-card__section-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--bp-border-color);
  }

  .overview-card__section-item:last-child {
    border-bottom: none;
  }

  .overview-card__section-title {
    display: block;
    font-weight: 600;
    color: var(--bp-text-primary);
    margin-bottom: 0.25rem;
  }

  .overview-card__section-desc {
    display: block;
    color: var(--bp-text-secondary);
    font-size: 0.9rem;
    line-height: 1.4;
  }

  /* 提示信息 */
  .overview-card__tips {
    margin-bottom: 1.5rem;
  }

  .overview-card__tip {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .overview-card__tip:last-child {
    margin-bottom: 0;
  }

  .overview-card__tip--success {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
    color: var(--bp-text-primary);
  }

  .overview-card__tip--info {
    background: rgba(59, 130, 246, 0.1);
    border-left: 4px solid #3b82f6;
    color: var(--bp-text-primary);
  }

  .overview-card__tip--warning {
    background: rgba(245, 158, 11, 0.1);
    border-left: 4px solid #f59e0b;
    color: var(--bp-text-primary);
  }

  /* 标签 */
  .overview-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .overview-card__tag {
    padding: 0.25rem 0.75rem;
    background: var(--bp-bg-secondary);
    color: var(--bp-text-secondary);
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--bp-border-color);
  }

  /* 卡片底部 */
  .overview-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--bp-border-color);
  }

  .overview-card__action-btn {
    background: var(--bp-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .overview-card__action-btn:hover {
    background: var(--bp-primary-dark);
    transform: translateX(2px);
  }

  .overview-card__updated {
    color: var(--bp-text-secondary);
    font-size: 0.8rem;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .overview-cards-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
      padding: 1rem 0;
    }

    .overview-card {
      padding: 1.5rem;
    }

    .overview-card__title {
      font-size: 1.3rem;
    }

    .overview-card__meta {
      gap: 0.75rem;
    }

    .overview-card__footer {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .overview-card__action-btn {
      width: 100%;
      text-align: center;
    }
  }

  @media (max-width: 1600px) {
    .overview-cards-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 1200px) {
    .overview-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
