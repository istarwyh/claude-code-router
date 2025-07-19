export const sidebarScript = `
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Close sidebar when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
});

// Close sidebar on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSidebar();
    }
});

// Provider card interactions
function showProviderInfo(providerId) {
    const cards = document.querySelectorAll('.provider-card');
    cards.forEach(card => {
        if (card.id === providerId) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        }
    });
}

// Badge interactions
document.addEventListener('DOMContentLoaded', function() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('click', function() {
            const providerId = this.getAttribute('data-provider');
            if (providerId) {
                showProviderInfo(providerId);
            }
        });
    });
});
`;
