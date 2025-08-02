import { faviconDataUrl } from './faviconServer';
import { createHead, sidebarComponent, navigationComponent, sideCardsComponent, allStyles, allScripts } from './shared';
import { getStartedModule } from './modules/get-started';
import { bestPracticesModule } from './modules/best-practices';
import { implementationModule } from './modules/how-to-implement';

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
${createHead(faviconDataUrl)}
<style>
${allStyles}
</style>
<body>
${sidebarComponent}
${navigationComponent}

<div class="container">
  ${getStartedModule}
  ${bestPracticesModule}
  ${implementationModule}
</div>

<script>
${allScripts}
</script>
</body>
</html>`;
