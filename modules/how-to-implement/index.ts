// modules/how-to-implement/: 只负责 HTML 结构和容器
// src/client/howToImplement/: 负责所有业务逻辑和渲染
// shared/scripts/generated/: 运行时打包代码

export const implementationModule = `
<section id="how-to-implement" class="content-section">
  <!-- 概览卡片容器 - 由新的模块化系统渲染 -->
  <div id="how-to-implement-overview-cards" class="overview-cards-container">
    <!-- 卡片内容将由 src/client/howToImplement 系统动态生成 -->
  </div>
  
  <!-- 文章内容容器 -->
  <div id="how-to-implement-content" class="content-container">
    <!-- 文章内容将根据导航动态加载 -->
  </div>
</section>`;