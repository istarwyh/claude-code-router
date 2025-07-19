export const componentStyles = `
/* Navigation Styles */
.main-nav {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-tabs {
  display: flex;
  gap: 0;
}

.nav-tab {
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  position: relative;
}

.nav-tab:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.nav-tab.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
  background: var(--bg-secondary);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  font-size: 0.95rem;
}

/* Content Sections */
.content-section {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Best Practices Styles */
.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.practice-category {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.practice-category:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.category-header {
  margin-bottom: 1.5rem;
}

.category-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 1.3rem;
}

.category-icon {
  font-size: 1.4rem;
}

.category-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.practice-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.practice-item {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.practice-item:hover {
  border-color: var(--accent-color);
  background: var(--bg-hover);
}

.practice-item h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.practice-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.practice-status {
  display: inline-block;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.practices-footer {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.footer-note p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Implementation Styles */
.implementation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.impl-category {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.impl-category:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.impl-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.impl-item {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.impl-item:hover {
  border-color: var(--accent-color);
  background: var(--bg-hover);
}

.impl-item h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.impl-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.tech-badge {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.implementation-footer {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.code-example {
  margin-bottom: 2rem;
}

.code-example h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.code-block {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.footer-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.impl-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.impl-link:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .nav-tabs {
    flex-direction: column;
  }
  
  .nav-tab {
    padding: 0.75rem 1rem;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  
  .nav-tab.active {
    border-left-color: var(--accent-color);
    border-bottom-color: transparent;
  }
  
  .practices-grid,
  .implementation-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
  }
}

/* Sidebar Styles */
.sidebar-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    transition: var(--transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.sidebar-toggle:hover {
    background: var(--color-primary-dark);
    transform: scale(1.1);
}

.sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: var(--color-bg-primary);
    box-shadow: var(--shadow-xl);
    transition: right 0.3s ease-out;
    z-index: 999;
    overflow-y: auto;
    border-left: 1px solid var(--color-border-light);
}

.sidebar.open {
    right: 0;
}

.sidebar-header {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: var(--color-text-inverse);
    padding: var(--space-6);
    position: sticky;
    top: 0;
    z-index: 10;
}

.sidebar-close {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    background: none;
    border: none;
    color: var(--color-text-inverse);
    font-size: 24px;
    cursor: pointer;
    opacity: 0.8;
    transition: var(--transition-normal);
}

.sidebar-close:hover {
    opacity: 1;
    transform: scale(1.1);
}

.sidebar-content {
    padding: var(--space-6);
}

.sidebar-section {
    margin-bottom: var(--space-8);
}

.sidebar-section h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
    font-weight: 600;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: var(--space-2);
}

.sidebar-section h4 {
    color: var(--color-text-secondary);
    margin: var(--space-4) 0 var(--space-2) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
}

.sidebar .code-block {
    font-size: var(--font-size-xs);
    margin: var(--space-2) 0;
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-light);
}

.sidebar .note {
    margin: var(--space-3) 0;
    padding: var(--space-3);
    font-size: var(--font-size-sm);
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: var(--color-text-inverse);
    text-align: center;
    padding: var(--space-16) var(--space-6);
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
    opacity: 0.5;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    margin-bottom: var(--space-4);
    background: linear-gradient(45deg, #ffffff, #e0f2fe);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero .subtitle {
    font-size: var(--font-size-xl);
    opacity: 0.9;
    margin-bottom: var(--space-6);
    font-weight: 300;
}

.hero .badges {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
    margin-bottom: var(--space-8);
}

.badge {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--color-text-inverse);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-xl);
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: var(--transition-normal);
    cursor: pointer;
    text-decoration: none;
}

.badge:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
}

.badge.active {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Provider Grid */
.providers {
    padding: var(--space-12) var(--space-6);
    background: var(--color-bg-secondary);
}

.providers h2 {
    text-align: center;
    font-size: var(--font-size-3xl);
    color: var(--color-text-primary);
    margin-bottom: var(--space-8);
    font-weight: 600;
}

.provider-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-12);
}

.provider-card {
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    transition: var(--transition-normal);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.provider-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    opacity: 0;
    transition: var(--transition-normal);
}

.provider-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-light);
}

.provider-card:hover::before {
    opacity: 1;
}

.provider-card h3 {
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
    margin-bottom: var(--space-3);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.provider-icon {
    width: 24px;
    height: 24px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: var(--font-size-sm);
}

.provider-icon.deepseek { background: linear-gradient(45deg, #1a365d, #2d5aa0); }
.provider-icon.openai { background: linear-gradient(45deg, #10a37f, #16ba9a); }
.provider-icon.kimi { background: linear-gradient(45deg, #7c3aed, #a855f7); }
.provider-icon.openrouter { background: linear-gradient(45deg, #f59e0b, #f97316); }
.provider-icon.anyrouter { background: linear-gradient(45deg, #ef4444, #dc2626); }
.provider-icon.siliconflow { background: linear-gradient(45deg, #64748b, #94a3b8); }

.provider-card p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
    line-height: 1.6;
}

.provider-features {
    list-style: none;
    margin-bottom: var(--space-4);
}

.provider-features li {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-1);
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.provider-features li::before {
    content: '✓';
    color: var(--color-success);
    font-weight: bold;
}

.provider-links {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
}

.provider-links a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    font-size: var(--font-size-sm);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-light);
    transition: var(--transition-normal);
}

.provider-links a:hover {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* Provider example styling */
.provider-example {
    background: var(--color-bg-tertiary);
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    border-left: 3px solid var(--color-primary);
    word-break: break-all;
    overflow-wrap: break-word;
    margin-bottom: var(--space-4);
}

/* Provider badges */
.provider-badge {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.provider-badge.shared-ready {
    background: linear-gradient(135deg, var(--color-success), #059669);
    color: var(--color-text-inverse);
}

.provider-badge.deploy-required {
    background: linear-gradient(135deg, var(--color-warning), #f97316);
    color: var(--color-text-inverse);
}

/* Register bonus for promotional offers */
.register-bonus {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
    padding: var(--space-1) var(--space-2);
    background: linear-gradient(135deg, var(--color-success), #059669);
    color: var(--color-text-inverse);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-sm);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Setup and Deployment Sections */
.setup, .deployment {
    padding: var(--space-12) var(--space-6);
    background: var(--color-bg-primary);
}

.setup h2, .deployment h2 {
    text-align: center;
    font-size: var(--font-size-3xl);
    color: var(--color-text-primary);
    margin-bottom: var(--space-8);
    font-weight: 600;
}

.deployment-subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-10);
    font-size: var(--font-size-lg);
}

.important-notice, .deployment-reason {
    background: linear-gradient(135deg, var(--color-warning), #fbbf24);
    color: var(--color-text-inverse);
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-8);
    box-shadow: var(--shadow-md);
}

.important-notice h3, .deployment-reason h3 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-xl);
}

.setup-steps, .deployment-options {
    display: grid;
    gap: var(--space-6);
    margin-bottom: var(--space-8);
}

.steps {
    display: grid;
    gap: var(--space-8);
}

.step {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-6);
    align-items: start;
}

.step-number {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    color: var(--color-text-inverse);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: var(--font-size-lg);
    box-shadow: var(--shadow-md);
    flex-shrink: 0;
}

.step-content h3 {
    font-size: var(--font-size-xl);
    color: var(--color-text-primary);
    margin-bottom: var(--space-3);
    font-weight: 600;
}

.step-content p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
    line-height: 1.6;
}

/* Configuration tabs */
.config-tabs {
    margin: var(--space-4) 0;
}

.config-tab {
    margin-bottom: var(--space-4);
    padding: var(--space-4);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--color-primary);
}

.config-tab strong {
    color: var(--color-text-primary);
    display: block;
    margin-bottom: var(--space-2);
    font-size: var(--font-size-base);
}

.deployment-option {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    transition: var(--transition-normal);
}

.deployment-option:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-light);
}

.deployment-option h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
    font-size: var(--font-size-xl);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

/* Deployment specific styles */
.reason-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-4);
    margin-top: var(--space-4);
}

.reason-item {
    background: rgba(255, 255, 255, 0.1);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
}

.reason-item h4 {
    color: var(--color-text-inverse);
    margin-bottom: var(--space-2);
    font-size: var(--font-size-base);
    font-weight: 600;
}

.reason-item p {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    margin: 0;
}

.deployment-steps {
    display: grid;
    gap: var(--space-6);
}

.deployment-step {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    transition: var(--transition-normal);
}

.deployment-step:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-light);
}

.deployment-step h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
    font-size: var(--font-size-xl);
    font-weight: 600;
}

.deployment-step p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-4);
    line-height: 1.6;
}

/* Success section */
.success {
    background: linear-gradient(135deg, var(--color-success), #059669);
    color: var(--color-text-inverse);
    padding: var(--space-8);
    border-radius: var(--radius-xl);
    text-align: center;
    margin-top: var(--space-8);
    box-shadow: var(--shadow-lg);
}

.success h2 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-2xl);
    font-weight: 600;
}

.success p {
    font-size: var(--font-size-lg);
    opacity: 0.95;
    margin: 0;
}

/* Footer styles */
.footer {
    background: var(--color-bg-tertiary);
    padding: var(--space-8) var(--space-6);
    text-align: center;
    border-top: 1px solid var(--color-border-light);
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: var(--space-6);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
}

.footer-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition-normal);
}

.footer-links a:hover {
    color: var(--color-primary);
}

.footer-copyright {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
}

.code-block {
    background: var(--color-text-primary);
    color: var(--color-text-inverse);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    font-family: var(--font-family-mono);
    margin: var(--space-4) 0;
    overflow-x: auto;
    font-size: var(--font-size-sm);
    position: relative;
    border: 1px solid var(--color-border-medium);
}

.code-block::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
    pointer-events: none;
}

.note {
    background: var(--color-bg-accent);
    border: 1px solid var(--color-primary-light);
    color: var(--color-primary-dark);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    margin: var(--space-4) 0;
    font-size: var(--font-size-sm);
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
}

.note::before {
    content: 'ℹ️';
    flex-shrink: 0;
}

/* Important Notice */
.important-notice {
    background: linear-gradient(135deg, #fef3cd, #fde68a);
    border: 2px solid var(--color-warning);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
    margin-bottom: var(--space-10);
    box-shadow: var(--shadow-lg);
}

.important-notice h3 {
    color: #92400e;
    margin-bottom: var(--space-4);
    font-size: var(--font-size-xl);
    font-weight: 600;
    text-align: center;
}

.notice-content {
    display: grid;
    gap: var(--space-4);
}

.notice-item {
    background: rgba(255, 255, 255, 0.8);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--color-warning);
}

.notice-item strong {
    color: #92400e;
    display: block;
    margin-bottom: var(--space-2);
    font-weight: 600;
}

.notice-item p {
    color: #78350f;
    margin: 0;
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        right: -100%;
    }

    .sidebar-toggle {
        top: 10px;
        right: 10px;
        width: 45px;
        height: 45px;
        font-size: 18px;
    }

    .hero h1 {
        font-size: var(--font-size-3xl);
    }

    .hero .subtitle {
        font-size: var(--font-size-lg);
    }

    .provider-grid {
        grid-template-columns: 1fr;
    }

    .provider-links {
        justify-content: center;
    }

    .setup, .deployment, .providers {
        padding: var(--space-8) var(--space-4);
    }
}

/* Practice Item Enhanced Styles */
.practice-item.practice-advanced {
  border: 2px solid var(--accent-color);
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.05), rgba(var(--accent-rgb), 0.02));
}

.practice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.practice-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.practice-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-advanced {
  background: #dc3545;
  color: white;
}

.badge-automation {
  background: #28a745;
  color: white;
}

.badge-permissions {
  background: #ffc107;
  color: #212529;
}

.practice-description {
  margin: 1rem 0;
  line-height: 1.6;
}

.practice-description p {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

.practice-description p:first-child {
  color: var(--text-primary);
  font-weight: 500;
}

.practice-warning-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.75rem;
}

.warning-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.practice-details {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.command-container {
  margin-top: 1rem;
}

.command-block {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.command-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.copy-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1);
}

.copy-btn:active {
  transform: scale(0.95);
}

.command-block code {
  display: block;
  padding: 0.75rem;
  background: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: var(--accent-color);
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.shortcut-container {
  margin-top: 1rem;
}

.shortcut-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.shortcut-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  min-width: 60px;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.shortcut-keys kbd {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-family: monospace;
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcut-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-left: auto;
}

/* Removed scenario and warning styles - simplified design */

/* Responsive adjustments for practice items */
@media (max-width: 768px) {
  .practice-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .practice-badges {
    justify-content: flex-start;
  }
  
  .command-block code {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
  
  .shortcut-block {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .shortcut-desc {
    margin-left: 0;
    margin-top: 0.25rem;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .practice-warning {
    background: linear-gradient(135deg, #2d2a1f, #3d3a2f);
    border-color: #4d4a3f;
    color: #f4d03f;
  }
  
  .practice-warning code {
    background: rgba(244, 208, 63, 0.1);
    color: #f4d03f;
  }
  
  .command-block {
    background: var(--bg-secondary);
    border-color: var(--border-color);
  }
}

`;
