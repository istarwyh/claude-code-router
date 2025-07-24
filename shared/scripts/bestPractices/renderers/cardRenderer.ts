import type { PracticeCard } from '../../../types/practiceCard';
import { categoryIcons, difficultyColors, difficultyLabels } from '../data/categoryConfig';

export class CardRenderer {
  public renderCard(card: PracticeCard): string {
    const icon = categoryIcons[card.category] || '📋';
    const difficultyColor = difficultyColors[card.difficulty];
    const difficultyLabel = difficultyLabels[card.difficulty];
    
    const sectionsHtml = this.renderSections(card.sections);
    const tipsHtml = this.renderTips(card.tips);
    const tagsHtml = this.renderTags(card.tags);
    
    return `
      <div class="practice-card overview-card" data-card-id="${card.id}">
        <div class="overview-card__header">
          <div class="overview-card__title-section">
            <div class="overview-card__icon">${icon}</div>
            <h3 class="overview-card__title">${card.title}</h3>
          </div>
          <div class="overview-card__meta">
            <span class="overview-card__difficulty" style="--difficulty-color: ${difficultyColor}">
              ${difficultyLabel}
            </span>
            <span class="overview-card__read-time">📖 ${card.readTime}</span>
          </div>
        </div>
        
        <div class="overview-card__content">
          <p class="overview-card__description">${card.description}</p>
          <div class="overview-card__overview">${card.overview}</div>
          
          <div class="overview-card__sections">
            <h4 class="overview-card__sections-title">主要内容：</h4>
            <ul class="overview-card__sections-list">
              ${sectionsHtml}
            </ul>
          </div>

          ${tipsHtml ? `<div class="overview-card__tips">${tipsHtml}</div>` : ''}
          
          <div class="overview-card__tags">
            ${tagsHtml}
          </div>
        </div>
        
        <div class="overview-card__footer">
          <button class="overview-card__action-btn" data-card-id="${card.id}">
            查看详细内容 →
          </button>
          <div class="overview-card__updated">
            更新时间：${card.lastUpdated}
          </div>
        </div>
      </div>
    `;
  }

  public renderCards(cards: PracticeCard[]): string {
    const cardsHtml = cards.map(card => this.renderCard(card)).join('');
    
    return `
      <div class="overview-cards-grid">
        ${cardsHtml}
      </div>
    `;
  }

  private renderSections(sections: PracticeCard['sections']): string {
    return sections.map(section => `
      <li class="overview-card__section-item">
        <span class="overview-card__section-title">${section.title}</span>
        <span class="overview-card__section-desc">${section.content}</span>
      </li>
    `).join('');
  }

  private renderTips(tips?: PracticeCard['tips']): string {
    if (!tips) return '';
    
    return tips.map(tip => `
      <div class="overview-card__tip overview-card__tip--${tip.type}">
        <strong>${tip.title}：</strong>${tip.content}
      </div>
    `).join('');
  }

  private renderTags(tags: string[]): string {
    return tags.map(tag => `
      <span class="overview-card__tag">${tag}</span>
    `).join('');
  }
}