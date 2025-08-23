export const navigationScript = `
// Navigation tab switching
function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const contentSections = document.querySelectorAll('.content-section, .practices-page');
  
  function showSection(sectionId) {
    // Remove active class from all tabs
    navTabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to corresponding tab
    const activeTab = document.querySelector('[data-section="' + sectionId + '"]');
    if (activeTab) {
      activeTab.classList.add('active');
    }
    
    // Hide all content sections
    contentSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Show corresponding content section
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.style.display = 'block';
    }
    
    // Special handling for best-practices section
    if (sectionId === 'best-practices') {
      // Ensure we show the overview when navigating to best-practices
      if (window.showBestPracticesOverview) {
        setTimeout(() => {
          window.showBestPracticesOverview();
        }, 100);
      }
    }
  }
  
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      showSection(targetSection);
      // Update URL hash
      window.location.hash = targetSection;
    });
  });
  
  // Handle initial hash or default to first section
  const hash = window.location.hash.slice(1); // Remove # from hash
  const initialSection = hash || 'get-started';
  showSection(initialSection);
  
  // Handle hash changes (back/forward navigation)
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.slice(1) || 'get-started';
    showSection(newHash);
  });
}

// Copy command function
function copyCommand(button) {
  const commandBlock = button.closest('.command-block');
  const command = commandBlock.dataset.command;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(command).then(() => {
      showCopySuccess(button);
    }).catch(() => {
      fallbackCopyTextToClipboard(command, button);
    });
  } else {
    fallbackCopyTextToClipboard(command, button);
  }
}

// Show copy success feedback
function showCopySuccess(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '✓';
  button.style.color = '#28a745';
  
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.color = '';
  }, 2000);
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button);
    }
  } catch (err) {
    console.error('Failed to copy command:', err);
  }
  
  document.body.removeChild(textArea);
}

// Enhanced navigation functions for article display
function toggleFooterVisibility(isArticleView) {
  const footer = document.querySelector('.practices-footer');
  if (footer) {
    footer.style.display = isArticleView ? 'none' : 'block';
  }
}

function updateBreadcrumb(isArticleView, articleTitle = '') {
  const header = document.querySelector('.practices-page__header');
  if (!header) return;
  
  if (isArticleView && articleTitle) {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'practices-page__breadcrumb';
    breadcrumb.innerHTML = \`
      <button class="breadcrumb-back" onclick="showBestPracticesOverview()">
        ← 返回概览
      </button>
      <span class="breadcrumb-path">如何用好 CC > \${articleTitle}</span>
    \`;
    
    // Remove existing breadcrumb if any
    const existing = header.querySelector('.practices-page__breadcrumb');
    if (existing) {
      existing.remove();
    }
    
    header.appendChild(breadcrumb);
  } else {
    // Remove breadcrumb when showing overview
    const breadcrumb = header.querySelector('.practices-page__breadcrumb');
    if (breadcrumb) {
      breadcrumb.remove();
    }
  }
}

// Make functions globally available
window.copyCommand = copyCommand;
window.toggleFooterVisibility = toggleFooterVisibility;
window.updateBreadcrumb = updateBreadcrumb;

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);
`;
