export const navigationScript = `
// Navigation tab switching
function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const contentSections = document.querySelectorAll('.content-section');
  
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      navTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all content sections
      contentSections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Show corresponding content section
      const targetSection = tab.dataset.section;
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.style.display = 'block';
      }
    });
  });
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);
`;
