import { PracticeCard } from '../../../../shared/types/practiceCard';
import { bestPracticesOverviewCards } from '../../data/bestPracticesOverviewData';
import { ArticleDisplayComponent } from '../ArticleDisplayComponent';

export class BestPracticesOverviewCard {
  private card: PracticeCard;
  private containerId: string;

  constructor(containerId: string, cardId: string) {
    const foundCard = bestPracticesOverviewCards.find(card => card.id === cardId);
    if (!foundCard) {
      throw new Error(`Card with id ${cardId} not found`);
    }
    this.card = foundCard;
    this.containerId = containerId;
  }

  render(): string {
    return `
      <div class="practice-card overview-card" data-card-id="${this.card.id}">
        ${this.renderHeader()}
        ${this.renderContent()}
        ${this.renderFooter()}
      </div>
    `;
  }

  private renderHeader(): string {
    const difficultyColors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b', 
      'advanced': '#ef4444'
    };

    const categoryIcons = {
      'workflow': '🔄',
      'configuration': '⚙️',
      'mcp-commands': '🛠️',
      'context': '📝',
      'automation': '🤖',
      'collaboration': '👥'
    };

    return `
      <div class="overview-card__header">
        <div class="overview-card__title-section">
          <div class="overview-card__icon">${categoryIcons[this.card.category as keyof typeof categoryIcons] || '📋'}</div>
          <h3 class="overview-card__title">${this.card.title}</h3>
        </div>
        <div class="overview-card__meta">
          <span class="overview-card__difficulty" style="--difficulty-color: ${difficultyColors[this.card.difficulty]}">
            ${this.getDifficultyText()}
          </span>
          <span class="overview-card__read-time">📖 ${this.card.readTime}</span>
        </div>
      </div>
    `;
  }

  private renderContent(): string {
    return `
      <div class="overview-card__content">
        <p class="overview-card__description">${this.card.description}</p>
        <div class="overview-card__overview">${this.card.overview}</div>
        
        <div class="overview-card__sections">
          <h4 class="overview-card__sections-title">主要内容：</h4>
          <ul class="overview-card__sections-list">
            ${this.card.sections.map(section => `
              <li class="overview-card__section-item">
                <span class="overview-card__section-title">${section.title}</span>
                <span class="overview-card__section-desc">${section.content}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${this.renderTips()}
        ${this.renderTags()}
      </div>
    `;
  }

  private renderTips(): string {
    if (!this.card.tips || this.card.tips.length === 0) return '';

    return `
      <div class="overview-card__tips">
        ${this.card.tips.map(tip => `
          <div class="overview-card__tip overview-card__tip--${tip.type}">
            <strong>${tip.title}：</strong>${tip.content}
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderTags(): string {
    return `
      <div class="overview-card__tags">
        ${this.card.tags.map(tag => `
          <span class="overview-card__tag">${tag}</span>
        `).join('')}
      </div>
    `;
  }

  private renderFooter(): string {
    return `
      <div class="overview-card__footer">
        <button class="overview-card__action-btn" onclick="showDetailedContent('${this.card.id}')">
          查看详细内容 →
        </button>
        <div class="overview-card__updated">
          更新时间：${this.card.lastUpdated}
        </div>
      </div>
    `;
  }

  private getDifficultyText(): string {
    const difficultyMap = {
      'beginner': '初级',
      'intermediate': '中级',
      'advanced': '高级'
    };
    return difficultyMap[this.card.difficulty] || this.card.difficulty;
  }

  initializeInteractions(): void {
    // 在浏览器环境中初始化交互功能
    if (typeof window !== 'undefined') {
      const cardElement = document.querySelector(`[data-card-id="${this.card.id}"]`);
      if (cardElement) {
        // 添加悬停效果
        cardElement.addEventListener('mouseenter', () => {
          cardElement.classList.add('overview-card--hover');
        });
        
        cardElement.addEventListener('mouseleave', () => {
          cardElement.classList.remove('overview-card--hover');
        });
      }
    }
  }
}

// 渲染所有概览卡片的函数
export function renderBestPracticesOverviewCards(containerId: string): void {
  if (typeof window === 'undefined') return;
  
  const container = document.getElementById(containerId);
  if (!container) return;

  const cardsHtml = bestPracticesOverviewCards.map(cardData => {
    const card = new BestPracticesOverviewCard(containerId, cardData.id);
    return card.render();
  }).join('');

  container.innerHTML = `
    <div class="overview-cards-grid">
      ${cardsHtml}
    </div>
  `;

  // 初始化所有卡片的交互功能
  bestPracticesOverviewCards.forEach(cardData => {
    const card = new BestPracticesOverviewCard(containerId, cardData.id);
    card.initializeInteractions();
  });
}

// 全局函数，用于处理详细内容显示
declare global {
  interface Window {
    showDetailedContent: (cardId: string) => void;
    showBestPracticesOverview: () => void;
    bestPracticesArticleDisplay: ArticleDisplayComponent;
  }
}

if (typeof window !== 'undefined') {
  // 创建全局的文章显示组件实例
  window.bestPracticesArticleDisplay = new ArticleDisplayComponent('best-practices');

  window.showDetailedContent = function(cardId: string) {
    console.log(`显示详细内容: ${cardId}`);
    
    // 使用文章显示组件显示详细内容
    window.bestPracticesArticleDisplay.showArticle(cardId).catch(error => {
      console.error('Failed to show article:', error);
      alert(`加载文章失败: ${error.message}`);
    });
  };

  window.showBestPracticesOverview = function() {
    console.log('返回最佳实践概览页面');
    
    // 使用文章显示组件的 showOverview 方法
    if (window.bestPracticesArticleDisplay) {
      window.bestPracticesArticleDisplay.showOverview();
    }
    
    // 重新渲染概览页面
    const container = document.getElementById('best-practices-overview-cards');
    if (container) {
      renderBestPracticesOverviewCards('best-practices-overview-cards');
    }
    
    // 滚动到顶部
    const section = document.getElementById('best-practices');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}
