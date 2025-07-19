import { faviconDataUrl } from './faviconServer';
import { allStyles } from './styles';
import { allScripts } from './scripts';
import {
  createHead,
  sidebarComponent,
  navigationComponent,
  getStartedComponent,
  bestPracticesComponent,
  implementationComponent
} from './components';

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
${getStartedComponent}
${bestPracticesComponent}
${implementationComponent}
</div>

<script>
${allScripts}
</script>
</body>
</html>`;
