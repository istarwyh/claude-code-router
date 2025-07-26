import type { PracticeCard, PracticeSection, PracticeTip } from '../types/PracticeCard';
import { categoryIcons, difficultyColors, difficultyLabels } from '../data/categoryConfig';

export class CardRenderer {
  public renderCards(cards: PracticeCard[]): string {
    return cards.map(card => this.renderCard(card)).join('');
  }

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
          <div class="overview-card__meta-info">
            <span class="overview-card__version">v${card.version}</span>
            <span class="overview-card__updated">更新于 ${card.lastUpdated}</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderSections(sections: PracticeSection[]): string {
    return sections.map(section => `
      <li class="overview-card__section-item">
        <span class="overview-card__section-title">${section.title}</span>
        <span class="overview-card__section-content">${section.content}</span>
      </li>
    `).join('');
  }

  private renderTips(tips: PracticeTip[]): string {
    if (!tips || tips.length === 0) return '';
    
    return tips.map(tip => `
      <div class="overview-card__tip overview-card__tip--${tip.type}">
        <strong class="overview-card__tip-title">${tip.title}:</strong>
        <span class="overview-card__tip-content">${tip.content}</span>
      </div>
    `).join('');
  }

  private renderTags(tags: string[]): string {
    return tags.map(tag => `
      <span class="overview-card__tag">${tag}</span>
    `).join('');
  }
}
