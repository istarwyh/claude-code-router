import { sidebarScript } from './sidebar';
import { navigationScript } from './navigation';
import { codeExamplesScript } from './codeExamples';
import { bestPracticesClientScript } from './generated/bestPracticesBundle';

export const allScripts = `
${sidebarScript}
${navigationScript}
${codeExamplesScript}
${bestPracticesClientScript}
`;
