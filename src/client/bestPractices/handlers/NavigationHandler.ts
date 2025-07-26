export class NavigationHandler {
  public bindEventListeners(): void {
    // 处理面包屑导航和其他导航相关事件
    this.bindBreadcrumbNavigation();
  }

  private bindBreadcrumbNavigation(): void {
    // 监听面包屑点击事件
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.matches('.breadcrumb-link')) {
        e.preventDefault();
        const targetId = target.getAttribute('data-target');
        if (targetId) {
          this.navigateToSection(targetId);
        }
      }
    });
  }

  private navigateToSection(sectionId: string): void {
    // 导航到指定部分
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
