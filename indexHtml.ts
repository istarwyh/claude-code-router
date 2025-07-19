import { faviconDataUrl } from './faviconServer';
import { allStyles } from './styles';
import { allScripts } from './scripts';
import {
  createHead,
  sidebarComponent,
  heroComponent,
  providersComponent,
  setupComponent,
  deploymentComponent
} from './components';

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
${createHead(faviconDataUrl)}
<style>
${allStyles}
</style>
<body>
${sidebarComponent}

<div class="container">
${heroComponent}
${providersComponent}
${setupComponent}
${deploymentComponent}
</div>

<script>
${allScripts}
</script>
</body>
</html>`;
