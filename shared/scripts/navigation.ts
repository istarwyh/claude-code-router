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

// Make functions globally available
window.copyCommand = copyCommand;

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);
`;
