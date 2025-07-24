export class TemplateEngine {
  public static renderContainer(containerId: string, content: string): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      return;
    }
    container.innerHTML = content;
  }

  public static findContainer(containerId: string): HTMLElement | null {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container not found: ${containerId}`);
      return null;
    }
    return container;
  }

  public static logContainerStatus(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.log(`Container not found: ${containerId}`);
      return;
    }
    
    const buttons = container.querySelectorAll('.overview-card__action-btn');
    console.log(`Container found: ${containerId}`);
    console.log(`Buttons found: ${buttons.length}`);
    
    buttons.forEach((btn, index) => {
      const button = btn as HTMLElement;
      console.log(`Button ${index + 1}:`, {
        class: button.className,
        cardId: button.getAttribute('data-card-id'),
        text: button.textContent?.trim()
      });
    });
  }
}