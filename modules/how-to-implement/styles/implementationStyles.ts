export const implementationStyles = `
/* How to Implement Claude Code - 实现指南样式 */
.implementation-guide {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--color-text-primary);
}

.guide-header {
    text-align: center;
    margin-bottom: 3rem;
}

.guide-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
}

.architecture-section,
.implementation-steps,
.code-examples,
.quick-start,
.core-components {
    margin-bottom: 3rem;
}

.architecture-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.layer {
    background: var(--color-bg-primary);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border-light);
    text-align: center;
}

.layer h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-accent);
}

.layer p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.component-card {
    background: var(--color-bg-secondary);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border-light);
    text-align: center;
    transition: transform 0.2s ease;
}

.component-card:hover {
    transform: translateY(-2px);
}

.component-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-accent);
}

.component-card p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.quick-start {
    padding: 2rem;
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-light);
}

.start-command {
    position: relative;
    margin: 1rem 0;
}

.start-command code {
    display: block;
    background: var(--color-bg-primary);
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    overflow-x: auto;
}

.start-note {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    font-style: italic;
}

.start-note code {
    background: var(--color-bg-primary);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.architecture-section h2,
.implementation-steps h2,
.code-examples h2,
.deployment-guide h2,
.best-practices h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
}

.ascii-diagram {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    overflow-x: auto;
    border: 1px solid var(--color-border-light);
}

.ascii-diagram pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
    color: var(--color-text-primary);
}

.step-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.step-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.step-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
}

.step-content p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
}

.code-block {
    position: relative;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
}

.code-block code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--color-text-primary);
    white-space: pre;
    display: block;
}

.copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
}

.example-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border-light);
}

.tab-btn {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    color: var(--color-text-secondary);
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: var(--color-accent);
    color: white;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.deploy-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.step-number {
    background: var(--color-accent);
    color: white;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-content h4 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary);
}

.practices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.practice-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.practice-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.practice-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
}

.practice-card ul {
    list-style: none;
    padding: 0;
}

.practice-card li {
    padding: 0.25rem 0;
    color: var(--color-text-secondary);
}

.practice-card li:before {
    content: "✓";
    color: var(--color-accent);
    margin-right: 0.5rem;
}

@media (max-width: 768px) {
    .implementation-guide {
        padding: 1rem;
    }
    
    .guide-header h1 {
        font-size: 2rem;
    }
    
    .deploy-steps {
        grid-template-columns: 1fr;
    }
    
    .practices-grid {
        grid-template-columns: 1fr;
    }
}
`;