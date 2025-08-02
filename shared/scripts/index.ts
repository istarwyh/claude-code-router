import { sidebarScript } from './sidebar';
import { navigationScript } from './navigation';
import { codeExamplesScript } from './codeExamples';
import { bestPracticesClientScript } from './generated/bestPracticesBundle';
import { providerScripts } from './providers';

export const allScripts = `
${providerScripts}
${sidebarScript}
${navigationScript}
${codeExamplesScript}
${bestPracticesClientScript}
`;
