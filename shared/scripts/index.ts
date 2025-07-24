import { sidebarScript } from './sidebar';
import { navigationScript } from './navigation';
import { codeExamplesScript } from './codeExamples';
import { bestPracticesOverviewCardsScript } from './bestPractices/bestPracticesCards';

export const allScripts = `
${sidebarScript}
${navigationScript}
${codeExamplesScript}
${bestPracticesOverviewCardsScript}
`;
