export const baseStyles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family-primary);
    line-height: 1.6;
    color: var(--color-text-primary);
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    min-height: 100vh;
    padding: var(--space-4);
    overflow-x: hidden;
}

.container {
    max-width: 1400px;
    width: 92%;
    margin: 0 auto;
    background: var(--color-bg-primary);
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    position: relative;
    padding-bottom: var(--space-8);
}

@media (max-width: 1600px) {
    .container {
        max-width: 1300px;
    }
}

@media (max-width: 1400px) {
    .container {
        max-width: 1100px;
        width: 95%;
    }
}

@media (max-width: 768px) {
    .container {
        width: 95%;
        border-radius: var(--radius-2xl);
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-normal);
}

.overlay.active {
    opacity: 1;
    visibility: visible;
}
`;
