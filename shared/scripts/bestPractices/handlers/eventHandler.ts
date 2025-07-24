import { TemplateEngine } from '../renderers/templateEngine';

export class EventHandler {
  private containerId: string;
  private boundClickHandler: (e: Event) => void;

  constructor(containerId: string) {
    this.containerId = containerId;
    this.boundClickHandler = this.handleCardClick.bind(this);
  }

  public bindEventListeners(): void {
    console.log('开始绑定事件监听器');
    
    const container = TemplateEngine.findContainer(this.containerId);
    if (!container) {
      console.error('未找到容器元素');
      return;
    }
    
    console.log('找到容器元素:', container);
    TemplateEngine.logContainerStatus(this.containerId);
    
    this.removeExistingListeners(container);
    this.addEventListeners(container);
    
    console.log('事件委托绑定完成');
  }

  private removeExistingListeners(container: HTMLElement): void {
    container.removeEventListener('click', this.boundClickHandler);
  }

  private addEventListeners(container: HTMLElement): void {
    // 添加事件委托监听器
    container.addEventListener('click', this.boundClickHandler);
    
    // 添加通用点击监听器用于调试  
    container.addEventListener('click', function(e) {
      console.log('容器收到点击事件:', {
        target: e.target,
        targetClass: (e.target as HTMLElement).className,
        targetTag: (e.target as HTMLElement).tagName
      });
    }, true);
  }

  private handleCardClick(e: Event): void {
    const event = e as MouseEvent;
    console.log('handleCardClick被调用:', event.target);
    
    const targetButton = this.findTargetButton(event);
    
    if (targetButton) {
      this.processButtonClick(event, targetButton);
    } else {
      console.log('点击的不是按钮，也没找到对应的卡片:', 
        (event.target as HTMLElement).className, 
        (event.target as HTMLElement).tagName);
    }
  }

  private findTargetButton(event: MouseEvent): HTMLElement | null {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('overview-card__action-btn')) {
      console.log('直接点击按钮');
      return target;
    }
    
    // 点击的是卡片内的其他元素，找到对应的按钮
    const card = target.closest('.practice-card');
    if (card) {
      const button = card.querySelector('.overview-card__action-btn') as HTMLElement;
      console.log('点击卡片内元素，找到对应按钮:', button);
      return button;
    }
    
    return null;
  }

  private processButtonClick(event: MouseEvent, button: HTMLElement): void {
    console.log('确认找到目标按钮');
    event.preventDefault();
    event.stopPropagation();
    
    const cardId = button.getAttribute('data-card-id');
    console.log('点击事件被触发！卡片ID:', cardId);
    
    if (cardId) {
      this.logButtonStatus(button);
      this.triggerCardAction(cardId);
    } else {
      console.error('未找到卡片ID');
    }
  }

  private logButtonStatus(button: HTMLElement): void {
    const styles = window.getComputedStyle(button);
    console.log('按钮CSS状态:', {
      pointerEvents: styles.pointerEvents,
      display: styles.display,
      visibility: styles.visibility,
      zIndex: styles.zIndex,
      position: styles.position
    });
  }

  private triggerCardAction(cardId: string): void {
    (window as any).showDetailedContent(cardId);
  }
}