---
name: shares-presentation-platform-technical-plan
status: complete
created: 2026-09-12T10:04:49Z
updated: 2026-09-13T03:09:33Z
---

# Public Shares 与演示文稿发布平台技术方案

## 1. 完成状态

AI Speeds 已完成可复用的 Public Shares 平台，并将「构建 Agent Native Product」AI
Maker 上海分享作为首个完全公开的 Share 发布到生产环境。

规范页面：

```text
https://aispeeds.me/shares
https://aispeeds.me/shares/agent-native-product-ai-maker-shanghai
https://aispeeds.me/shares/agent-native-product-ai-maker-shanghai/deck
```

备用 Worker 域名：

```text
https://cc.xiaohui.cool
```

不可变媒体前缀：

```text
https://assets.aispeeds.me/shares/agent-native-product-ai-maker-shanghai/v4
```

最终状态：

- Share 状态为 `public`，发布时间和内容更新时间均为 `2026-09-12T14:25:21Z`。
- 已发布 40 页 WebP 在线 deck、40 张缩略图、封面、40 页 PDF、清理后的公开 PPTX 衍生文件、40 节 Markdown
  transcript 和 manifest。
- R2 v4 前缀已由远端 `manifest.json` 封存；不得覆盖或删除。
- 当前生产 Worker deployment 为 `f0a2e72c-060c-4b61-849c-534ab87d5dec`。
- 当前生产 Worker version 为
  `11dcc9e3-10d9-4311-a16e-313adacf07f3`，承载 100% 流量。
- 生产自动验收共 274 项断言，结果为 274 pass、0 fail、0 skip。
- 生产桌面、移动竖屏和移动横屏浏览器验收通过。
- 未执行 Git commit、push 或 PR；生产部署来自经过验证的工作树。

## 2. 产品范围与设计原则

### 2.1 顶层内容模型

顶层实体是一次
**Share（公开分享）**，不是一个孤立的 PPTX 文件。一次 Share 可以组合：

- 在线演示文稿。
- PDF。
- 清理后的公开 PPTX 衍生文件。
- Transcript 或讲义。
- 视频。
- 代码仓库。
- 文章和外部资源。

当前发布实现了前四类资源；内容模型和 UI 已保留后续扩展空间。

### 2.2 信息架构

```text
/shares
└── /shares/[slug]
    ├── /shares/[slug]/deck
    ├── PDF 下载
    ├── PPTX 下载
    └── Transcript 下载与逐页正文
```

`https://lovstudio.ai/shares`
仅作为目录优先、Share 详情承载多种资源、16:9 封面预览等信息架构参考。视觉实现继续使用 AI
Speeds 的暖色科技感、浅色玻璃表面、大圆角、珊瑚色强调和语义 Tailwind
token，没有复制 Lovstudio 品牌样式。

### 2.3 首发范围

- 权威版本：v4。
- 物理页数：40 页，编号 `001`–`040`。
- 访问策略：完全公开。
- 规范站点：`https://aispeeds.me`。
- 媒体域名：`https://assets.aispeeds.me`。
- 活动日期没有可靠输入，因此没有虚构日期；注册表的 `publishedAt`
  表示本次在线发布时间。
- 已拒绝使用同目录中的 v8 图片、PDF 或 41 页 v8 PPTX 作为 v4 发布源。

## 3. 最终架构

```text
用户浏览器
   │
   ├── aispeeds.me/shares/... ───────────────┐
   │                                         │
   │                            Next.js 15 App Router
   │                            OpenNext / Cloudflare Worker
   │                                         │
   │                            TypeScript Share Registry
   │                            静态页面与静态 RSC 缓存
   │
   └── assets.aispeeds.me/shares/... ────────┐
                                             │
                                    Cloudflare Cache
                                             │
                                       R2 Bucket
```

职责边界：

**Next.js / Worker：**

- Share 注册表和公开状态。
- 目录、详情、transcript 和 deck 页面。
- SEO、canonical、sitemap、robots 和无障碍文本。
- Deck 交互和资源 URL 生成。

**R2：**

- 封面、主幻灯片和缩略图。
- PDF。
- 清理后的 PPTX 公开衍生文件。
- Transcript 下载文件。
- 发布 manifest。

浏览器直接访问 R2 Custom Domain。当前不使用应用 Worker 的 R2
binding，也不使用 R2 作为 OpenNext 增量缓存；Share 页面是构建期静态内容。

## 4. 内容注册表与页面实现

### 4.1 注册表

最终目录：

```text
src/content/shares/
├── types.ts
├── agent-native-product-ai-maker-shanghai.ts
├── registry.ts
└── index.ts
```

注册表提供：

```typescript
getPublicShares;
getShareBySlug;
getPublicShareBySlug;
getDeckArtifact;
getCoverUrl;
getSlideUrl;
getThumbnailUrl;
getManifestUrl;
getPdfUrl;
getPptxUrl;
getTranscriptUrl;
getResourceByKind;
getResourceUrl;
getResourceUrls;
validateShareRegistry;
```

关键约束：

- slug 必须唯一且为 ASCII kebab-case。
- 时间必须为严格 ISO 8601 UTC。
- 版本号使用确定性的 ASCII 校验。
- `public` Share 必须包含完整封面、deck、PDF、PPTX、transcript 和 manifest。
- 幻灯片必须连续覆盖 `1..N`，且 `slideCount` 与数组长度一致。
- 公开 URL 只允许 `https://assets.aispeeds.me`。
- 拒绝 HTTP、R2 API 域名、本地或绝对路径、路径穿越和畸形 URL。
- 标题、描述和 transcript 不能为空，并扫描本地路径与 secret-like 模式。
- 索引读取使用 `.at()`，避免不安全的动态属性访问。

注册表 smoke validation 通过 34 项检查。

### 4.2 App Router 路由

```text
src/app/(main)/shares/page.tsx
src/app/(main)/shares/[slug]/layout.tsx
src/app/(main)/shares/[slug]/page.tsx
src/app/(main)/shares/[slug]/deck/page.tsx
```

实现策略：

- `/shares`、详情和 transcript 为服务端渲染的静态页面。
- `DeckViewer.tsx` 是唯一主要客户端交互岛。
- `generateStaticParams()` 和 `dynamicParams = false` 位于共享
  `[slug]/layout.tsx`。
- Next.js 15 的 Promise `params` 均被正确 `await`。
- 未注册、非公开或无 deck 的 slug 返回 404。

### 4.3 Deck Viewer

最终 viewer 支持：

- `#12` 等 1-based 深链接。
- 首次加载非法 hash 归一化。
- 超范围数字 hash 向合法边界收敛，例如 `#999` 到 `#40`。
- History API、浏览器前进/后退、`hashchange` 和 `popstate`。
- Arrow、PageUp/PageDown、Space、Home、End 和 `F`。
- 对交互控件和可编辑目标不拦截全局翻页按键。
- 指针/触摸水平滑动，并保留垂直滚动和 pinch zoom。
- `?present=1` 演示模式。
- Fullscreen API 进入、退出、拒绝处理和状态同步。
- 当前页大图、相邻页预加载、缩略图 lazy loading。
- 图片错误、重试和返回详情操作。
- `aria-live` 页码公告、语义按钮、可见焦点和 `aria-current`。
- 至少 44×44 CSS 像素的主要控制项。
- reduced-motion 和 safe-area 处理。
- 隐藏的演示控件同时使用 `aria-hidden` 与 `inert`；Tab 会恢复控件并移动焦点。

浏览器会根据自身 lazy-load 距离策略加载较多缩略图，但没有一次性加载全部 40 张全分辨率主图；DOM 只挂载当前主图，客户端只预加载相邻主图。

### 4.4 视觉与无障碍 token

新增了适合浅色背景小字号文字的 `primary-ink`：

```text
#b24b37
```

测得对比度：

- 对白色：5.31:1。
- 对暖白背景：5.19:1。
- 对 10% 珊瑚色叠加白色：4.83:1。
- 对 10% 珊瑚色叠加暖白：4.72:1。

目录和详情页修复后 Lighthouse 结果：Accessibility、Best Practices、SEO、Agentic
Browsing 均为 100。Deck SEO 分数受有意设置的 `noindex` 影响，不作为缺陷。

### 4.5 首页浮动菜单

首页增加公开分享入口，同时修复移动横屏菜单溢出：

- 根据按钮位置和剩余 viewport 空间计算 popover 最大高度。
- 菜单使用 `overflow-y-auto` 和 `overscroll-contain`。
- 保留可拖动浮动菜单和朝可用空间更大一侧展开的行为。

生产 `844×390` 横屏验收中，菜单内部滚动后“公开分享”可见并可成功导航到
`/shares`；页面没有水平溢出。

## 5. SEO、metadata 与发现

规范站点常量：

```typescript
export const CANONICAL_SITE_URL = 'https://aispeeds.me';
```

最终规则：

| 页面                  | Robots            | Canonical                    |
| --------------------- | ----------------- | ---------------------------- |
| `/shares`             | `index, follow`   | `https://aispeeds.me/shares` |
| `/shares/[slug]`      | `index, follow`   | 对应规范详情 URL             |
| `/shares/[slug]/deck` | `noindex, follow` | 对应规范详情 URL             |

即使从 `cc.xiaohui.cool` 访问，canonical、robots 中的 sitemap
URL 和 sitemap 内 Share URL 仍固定指向 `https://aispeeds.me`。

`sitemap.xml` 包含：

```text
https://aispeeds.me/shares
https://aispeeds.me/shares/agent-native-product-ai-maker-shanghai
```

Deck 不进入 sitemap。详情页有独立 title、description、Open Graph 和 Twitter
metadata，封面来自公开 R2 Custom Domain。

首页菜单初始关闭，因此“公开分享”不是初始 HTML 中的可见 anchor，而是在 hydration 后的菜单中生成。这在自动 HTTP 验收中记录为两个低级别提示；真实桌面和移动浏览器均已打开菜单并成功导航，因此不是发布故障。

## 6. v4 媒体准备与清理

### 6.1 权威源

```text
../quartz/content/slide-deck/agent-native-ai-maker-shanghai/构建 Agent Native Product-AI Maker 上海-晓灰-v4.pptx
```

源文件冻结信息：

| 项目        | 值                                                                 |
| ----------- | ------------------------------------------------------------------ |
| SHA-256     | `d2a8f210a4904bfbe8d157f7a7014380164cc4dc3f8abd4341746fc9bf7ac44f` |
| 大小        | 53,592,988 bytes                                                   |
| 物理页数    | 40                                                                 |
| 比例        | 16:9                                                               |
| Notes pages | 39                                                                 |

OOXML paragraph 级检查发现：

- 96 个包含本地路径的 notes 段落。
- 15 个唯一的本地路径。
- 97 次路径出现；其中包含物理 slide 33 的内联路径。

这些内容仅用于本地审核，没有直接进入公开 PPTX 或 transcript。

### 6.2 生成工具

```text
scripts/sanitize-share-pptx.py
scripts/prepare-share-assets.mjs
scripts/validate-share-assets.ts
scripts/publish-share-assets.mjs
```

处理顺序：

1. 校验权威源 SHA-256 和依赖工具。
2. 检查 OOXML
   ZIP 路径穿越、宏、外部关系、comments、隐藏页、ActiveX/OLE、嵌入对象、自定义 XML 和 secret-like 文本。
3. 将 notes 提取到本地审核材料。
4. 生成去除 speaker notes、comments、作者/公司/custom
   metadata 的确定性 PPTX 公开衍生文件。
5. 使用 LibreOffice 从清理后的衍生文件重新生成 40 页 PDF。
6. 生成 1920×1080 WebP 主图、480×270 缩略图和 1200×675 封面，并清除图片元数据。
7. 从已经审核的 TypeScript 注册表生成 transcript，保证页面正文和下载文件同源。
8. 检查 40 页 montage，并全尺寸复核物理页 `003`、`033`–`035` 和 `040`。
9. 计算大小、MIME 和 SHA-256，最后生成本地 manifest。

最后一页二维码解码为：

```text
http://weixin.qq.com/r/mp/vURnf3LEQC8-rTYc9xGv
```

这只记录技术解码结果，不代表对目标内容作长期可用性或权利背书。

### 6.3 公开对象组成

```text
cover.webp                                      1
slides/001.webp ... slides/040.webp            40
thumbnails/001.webp ... thumbnails/040.webp    40
deck.pdf                                        1
source.pptx                                     1
transcript.md                                   1
manifest.json                                   1
```

合计 85 个对象：84 个 payload，加最后上传的 manifest。

本地 release summary：

| 项目           | 值                                                 |
| -------------- | -------------------------------------------------- |
| Payload 数量   | 84                                                 |
| 总对象数       | 85                                                 |
| Payload 总大小 | 71,386,833 bytes                                   |
| 对象前缀       | `shares/agent-native-product-ai-maker-shanghai/v4` |

本地 manifest 保持
`sealed: false`；远端 manifest 的存在才代表不可变前缀已经封存。

### 6.4 核心文件完整性

| 文件            |             大小 | SHA-256                                                            | 验证                                                      |
| --------------- | ---------------: | ------------------------------------------------------------------ | --------------------------------------------------------- |
| `manifest.json` |     32,823 bytes | `21ead62b9c987e244b38261c0481ac64a79285ef587eaf04e1d691c0e1908169` | schema、对象清单和公开 GET 通过                           |
| `deck.pdf`      | 10,136,194 bytes | `0010b5cca6115ea75d56a021477eae4caec2fa20ef27a2a1618b688890dc425f` | 40 页                                                     |
| `source.pptx`   | 53,499,207 bytes | `0e791db2bb32a94dd86573d9cda58f99b8dad7e42046b0ca07a9895f4cfa6c45` | 40 slides、136 package entries、sanitizer validation 通过 |
| `transcript.md` |     24,774 bytes | `195f01f51aa8bdce1fdc2f32afa1d6e55b1dcd2ea73e18d55b7af987693a659b` | 40 个连续 slide section                                   |

`source.pptx`
**不是私有原始 PPTX 的原样副本**。它是为了公开下载而生成的清理后衍生文件，已移除私有 speaker
notes、comments 和不应公开的文档元数据。私有权威源只用于本地生成与哈希追溯。

## 7. R2 发布与不可变保护

### 7.1 基础设施

| 项目                   | 值                                                  |
| ---------------------- | --------------------------------------------------- |
| Bucket                 | `assets-aispeeds-me`                                |
| S3-compatible endpoint | `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`  |
| Region                 | `auto`                                              |
| Public Custom Domain   | `https://assets.aispeeds.me`                        |
| 固定前缀               | `shares/agent-native-product-ai-maker-shanghai/v4/` |

S3-compatible
endpoint 只用于本地或受控 CI 的授权对象操作，绝不作为公开媒体 URL，也不在应用代码中保存实际账户 endpoint。

### 7.2 Publisher 保护

- 默认 dry-run，只有显式 `--apply` 才写入。
- 只操作 manifest 声明的目标前缀，不提供 delete 流程。
- 检测远端 manifest；已封存前缀默认拒绝再次发布。
- 每个对象先 Head，内容不同立即失败。
- 只有显式 `--resume` 才允许跳过完全一致的现有 payload。
- 上传使用 `IfNoneMatch: '*'`、`ChecksumSHA256` 和自定义 SHA metadata。
- Payload 先上传并验证，manifest 最后上传。
- 所有对象使用：

```http
Cache-Control: public, max-age=31536000, immutable
```

- 精确设置 MIME 和 Content-Disposition。
- 公共验证强制 `Accept-Encoding: identity`，拒绝意外 `Content-Encoding`。
- R2 Custom Domain 可能省略 `x-amz-meta-sha256`；因此公开 metadata
  SHA 可选，但认证 S3 checksum/Get hash 和公开 body hash 仍为强制验证。

实际发布使用：

```bash
pnpm run shares:publish -- --apply --resume --timeout-ms 120000
```

结果：84 个 payload 全部与已上传对象一致并通过 resume 验证，随后 manifest 上传并封存前缀。没有覆盖差异对象，没有删除对象。

临时 R2 凭据只在本地受控环境中使用；凭据值没有进入聊天、仓库、技术文档或公开日志，临时凭据文件已删除。

## 8. OpenNext 生产路由事故与修复

### 8.1 第一次部署失败

第一次 Share 应用部署：

| 项目       | 值                                     |
| ---------- | -------------------------------------- |
| Deployment | `b6935645-8b49-4390-baa3-70a7f49912a3` |
| Version    | `34e37ad7-3da7-42b9-ab42-d8f77d121357` |
| 时间       | `2026-09-12T15:52:24.863601Z`          |

现象：

- `/shares` 目录可访问。
- 合法的 Share 详情页和 deck 返回 404。
- 浏览器详情 RSC prefetch 返回 404，导航进入 Next.js framework 404。
- Next 和 OpenNext 构建中实际存在对应静态参数和 prerender 记录。

发现回归后没有宣称部署成功，并立即执行回滚。

### 8.2 成功回滚

| 项目                | 值                                     |
| ------------------- | -------------------------------------- |
| Rollback deployment | `f10c8153-c576-4899-9775-767177a6d922` |
| 恢复 version        | `d5e9fa89-f5ea-4606-b8f7-ffaf9efb371e` |
| 时间                | `2026-09-12T15:56:20.604392Z`          |

回滚恢复了之前的稳定生产版本，R2 v4 媒体前缀不受影响。

### 8.3 根因

原 `open-next.config.ts` 没有配置 `incrementalCache`。OpenNext 因此生成 dummy
incremental-cache adapter：

- `.open-next/cache` 中存在详情和 deck 的转换后 prerender 记录。
- Worker 运行时的 dummy adapter 无法读取这些记录。
- 这些缓存文件也不在 Worker 可访问的 `ASSETS` binding 路径中。
- `dynamicParams = false` 对缺失具体缓存记录使用
  `fallback: false`，最终表现为合法路由 404。

这不是 `generateStaticParams()`、Share 注册表或路由结构错误。

### 8.4 修复

最终 `open-next.config.ts`：

```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
```

OpenNext `build` 先在 `.open-next/cache` 生成转换后的构建期缓存记录；随后由
`preview`、`deploy`、`upload` 隐式调用的 `populateCache` 阶段，或显式的
`populateCache local`，将 static-assets incremental cache 复制到：

```text
.open-next/assets/cdn-cgi/_next_cache
```

因此不能仅凭 `cf:build` 后该目录尚未出现就判定部署链路失败；正式
`opennextjs-cloudflare deploy` 会在调用 Wrangler 前执行对应的 cache
population。Worker 通过已有 `ASSETS`
binding 读取复制后的记录。`enableCacheInterception`
提供静态页面拦截路径。当前 Share 不使用 ISR，因此无需增加 R2 incremental-cache
binding。

修复在本地 Cloudflare
preview 中验证了目录、详情、deck、无效 slug 和浏览器形式 RSC 请求，之后重新运行全部 release
gates。PR 合并前还显式执行了
`populateCache local`，确认详情和 deck 的具体缓存记录被复制到上述 static-assets 路径。

### 8.5 正式修复部署

| 项目       | 值                                     |
| ---------- | -------------------------------------- |
| Deployment | `f0a2e72c-060c-4b61-849c-534ab87d5dec` |
| Version    | `11dcc9e3-10d9-4311-a16e-313adacf07f3` |
| 时间       | `2026-09-12T16:49:27.738271Z`          |
| Traffic    | 100%                                   |

生产上两个应用域名的详情与 deck RSC 请求均为
`200 text/x-component`，且连续请求返回 `x-opennext-cache: HIT`。

## 9. `aispeeds.me` Apex DNS 事故与修复

### 9.1 现象

正式修复 Worker 部署后：

- `cc.xiaohui.cool` 可以正常访问 Share 页面。
- Workers Custom Domain API 显示 `aispeeds.me` 已启用、关联正确服务和 production
  environment，证书已签发。
- 但 `aispeeds.me` 没有公开 A、AAAA、CNAME、HTTPS 或 SVCB 回答。
- Cloudflare Dashboard 只显示四条 DNS 记录，并提示访问者无法访问 apex。

因此问题定位为缺失 Worker 管理的 apex
DNS 记录，而不是 Worker 代码、部署或证书对象问题。

本机 DNS 会返回 `198.18.0.0/15`
fake-IP 地址，不能用作权威结论；生产判断改用公共 DoH。

### 9.2 无效的幂等修复尝试

以下操作都成功更新或重申了 Custom Domain 关联，但没有恢复缺失 DNS 记录：

1. 通过官方 Workers Domains
   API 将同一 hostname 重新关联到同一 Worker 和 production environment。
2. 在 Cloudflare Dashboard 的 Worker
   Domains 页面执行“添加域名”，再次提交同一 apex 和 Worker。

即使重新签发证书、Zone SOA
serial 变化，公共 DoH 仍返回 NODATA。这证明单纯幂等 reattach 不会重建缺失的 managed
record。

### 9.3 最终修复

只删除了损坏的 `aispeeds.me` Custom Domain
association，随后立即以相同 hostname、Worker service 和 production
environment 重新创建。没有删除 Zone、Worker
service、生产 deployment 或 R2 资源。

结果：

- Dashboard DNS 记录数从 4 变为 5。
- 出现只读的 Worker managed record。
- 该记录在 Cloudflare 内部表现为 proxied `AAAA`、content `100::`，并带有
  `origin_worker_id` metadata。
- Cloudflare、Google、AliDNS 和 DNSPod 四个独立公共 DoH
  resolver 均恢复一致答案。

最终公共 DNS：

```text
A     104.21.42.187
A     172.67.208.92
AAAA  2606:4700:3033::ac43:d05c
AAAA  2606:4700:3031::6815:2abb
```

DNS 恢复后，新的隔离浏览器上下文成功加载规范域名 Share 目录、详情和 deck。

## 10. 验证结果

### 10.1 本地 release gates

项目没有配置测试框架，因此按项目规则通过 test-runner
agent 使用真实服务、无 mock、详细日志执行命令门禁：

```bash
pnpm run lint:check
pnpm run shares:validate
pnpm run build
pnpm run typecheck
pnpm run shares:validate -- --remote --timeout-ms 60000
pnpm run cf:build
pnpm exec opennextjs-cloudflare populateCache local
```

并完成：

- Share 注册表 smoke validation。
- 本地媒体完整性和隐私扫描。
- PDF 页数检查。
- 清理后 PPTX OOXML validation。
- OpenNext prerender/cache 产物检查。
- `populateCache local` 后详情和 deck static-assets cache 复制检查。
- 当前 TypeScript 注册表生成的 transcript SHA-256 与 manifest `transcript.md`
  payload SHA-256 一致性检查。
- 使用仅存在于任务临时目录的变更版注册表执行负向验证，准确拒绝 registry、manifest 和远端 transcript 漂移。
- Cloudflare preview 路由和浏览器形式 RSC 检查。

以上均通过。合并前最终运行的七个正向命令全部返回 0；负向 transcript smoke
test 按预期返回非零并给出明确的不一致错误。ESLint 返回 0
errors 和 8 个位于本次 Share 改动之外的既有 warnings，不影响本次发布。

### 10.2 生产自动 HTTP 验收

执行时间：

```text
2026-09-12T17:35:19Z — 2026-09-12T17:36:43Z
```

结果：

| 项目                                   |          结果 |
| -------------------------------------- | ------------: |
| 总断言                                 |           274 |
| Pass                                   |           274 |
| Fail                                   |             0 |
| Skip                                   |             0 |
| Critical / High / Medium / Low failure | 0 / 0 / 0 / 0 |
| 独立 HTTP 请求                         |            35 |
| TLS 验证成功                           |            35 |
| 5xx                                    |             0 |
| 非预期 redirect                        |             0 |

覆盖范围：

- 两个应用域名的首页、目录、详情和 deck。
- 两个域名的无效 Share slug 404。
- 详情与 deck 的浏览器形式 RSC 请求、MIME、稳定 body hash 和 OpenNext cache
  HIT。
- Canonical、robots metadata、sitemap 和 `robots.txt`。
- 首页 hydration 后的 Shares 导航配置。
- Manifest、封面、slides `001`、`003`、`033`–`035`、`040`。
- PDF、PPTX 和 transcript 的链接、状态、MIME、Cache-Control、Content-Disposition、长度和 body
  SHA-256。
- 清理后 PPTX 的 40-slide validation。
- 当前 Worker deployment 和 100% version。
- Git HEAD、working-tree status、tracked diff 和 cached diff fingerprint。

所有公开媒体响应都没有意外
`Content-Encoding`。封面、抽样主图、PDF 和 PPTX 观察到 Cloudflare cache
HIT；manifest 和 transcript 即使观察为 DYNAMIC，也携带正确的不可变 Cache-Control，且缓存状态不是发布正确性的硬门禁。

自动验收仅产生两项 low warning：两个域名的首页菜单初始关闭，Shares
link 不在初始服务端 HTML 中，而存在于 hydration 后的菜单 bundle。真实浏览器菜单导航已通过，因此这些提示不改变 PASS 结果。

### 10.3 生产浏览器验收

**规范域名桌面：**

- `/shares` 目录显示 1 个公开 Share。
- 详情页显示标题、副标题、作者、活动、地点、下载入口和 40 节 transcript。
- 从 transcript 第 12 页链接进入 `deck#12`，显示正确第 12 页和 R2 主图。
- 下一页 `#12 → #13`，浏览器后退恢复 `#12`。
- 非交互焦点下 ArrowRight 正确翻页。
- `?present=1` 演示模式进入和退出正常。
- 控件静置后同时具备 `aria-hidden` 和
  `inert`；Tab 恢复控件并聚焦“返回分享详情”。
- 应用按钮可进入和退出 fullscreen。
- 触摸指针 swipe 可翻页。
- 新鲜直接访问非法 hash 归一化为 `#1`；`#999` 收敛为 `#40`。
- 目录、详情和 deck 没有观察到 console error、warning 或 browser issue。

**移动 viewport：**

- `390×844`
  竖屏 deck 无水平溢出；主图保持在 viewport 内；主要 controls 至少 44px。
- 竖屏首页菜单可找到并进入“公开分享”。
- `844×390` 横屏首页菜单启用内部滚动，滚动后“公开分享”可见并可进入目录。
- 竖屏和横屏目录均无水平溢出或 console error。

**备用域名：**

- 清除旧失败部署遗留 document 后，详情页加载正确标题和完整内容。
- `deck#12` 显示正确页码、标题和 `slides/012.webp`。
- 下一页导航到 `#13`，加载正确 `slides/013.webp`，同时预加载相邻页。
- 页面、RSC 和媒体网络请求成功，没有 console error、warning 或 browser issue。

本次浏览器证据来自真实 Chromium/CDP 桌面环境和真实页面的移动 viewport 仿真。没有声称独立完成原生 Safari、Firefox 或实体 iOS/Android 设备兼容性测试。

### 10.4 生产元数据证据

两个应用域名均返回：

```text
Catalog canonical: https://aispeeds.me/shares
Detail canonical:  https://aispeeds.me/shares/agent-native-product-ai-maker-shanghai
Deck canonical:    https://aispeeds.me/shares/agent-native-product-ai-maker-shanghai
Catalog robots:    index, follow
Detail robots:     index, follow
Deck robots:       noindex, follow
Sitemap:            https://aispeeds.me/sitemap.xml
```

### 10.5 Git 完整性

生产验收结束时：

| 项目                     | 实际值                                                             | 结果                             |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------- |
| HEAD                     | `02379071099f8fb461a5a305c0b9b63c81167032`                         | 与部署前记录一致                 |
| Tracked diff SHA-256     | `da491adf0ef11e399eade2933615b303e621bfb96a2830b10015447e6be7a1de` | 与部署前记录一致                 |
| Cached diff SHA-256      | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | 空 staged diff，与部署前记录一致 |
| `git status --porcelain` | byte-identical                                                     | 是                               |

因此部署和生产验收没有引入额外 Git 写入，也没有 commit、push 或 PR。

## 11. 主要代码与配置

```text
src/content/shares/
src/components/features/shares/
src/app/(main)/shares/
src/config/features.ts
src/config/site-url.ts
src/config/ui-texts.ts
src/app/layout.tsx
src/app/sitemap.ts
src/app/robots.ts
src/app/globals.css
src/components/HomePageWithNav.tsx
src/styles/designTokens.ts
tailwind.config.ts
open-next.config.ts
scripts/sanitize-share-pptx.py
scripts/prepare-share-assets.mjs
scripts/validate-share-assets.ts
scripts/publish-share-assets.mjs
```

CI/CD 配置更新：

```text
.github/workflows/pr-check.yml
.github/workflows/deploy.yml
package.json
pnpm-lock.yaml
eslint.config.js
```

CI 调整包括 frozen
install、非变更型 lint、Share 注册表/公开媒体 validation、Next
build、显式 typecheck、OpenNext build 和 pinned local deployment
path。媒体上传仍与应用部署解耦，PR workflow 不接触 R2 写凭据。

## 12. 运行和发布命令

本地媒体准备：

```bash
pnpm run shares:prepare
```

本地/公开资源验证：

```bash
pnpm run shares:validate
```

R2 dry-run：

```bash
pnpm run shares:publish
```

新版本首次写入：

```bash
pnpm run shares:publish -- --apply
```

仅在中断发布且现有 payload 与 manifest 预期完全一致时：

```bash
pnpm run shares:publish -- --apply --resume
```

应用 release gates：

```bash
pnpm run lint:check
pnpm run shares:validate
pnpm run build
pnpm run typecheck
pnpm run cf:build
```

生产部署：

```bash
pnpm run cf:deploy
```

任何未来部署都必须先保证注册表引用的媒体版本已经完整上传并验证，不能把媒体上传隐式耦合进 Worker 部署。

## 13. 后续 Share 发布流程

1. 在 `src/content/shares/` 新增 Share，并保持 `status: 'draft'`。
2. 选择新的不可变媒体版本目录。
3. 对权威源执行 hash 冻结、OOXML 安全/隐私检查和人工内容复核。
4. 生成并验证全部本地 payload。
5. 上传 payload；认证和公共验证通过后最后上传 manifest。
6. 确认远端 manifest 已封存新前缀。
7. 才能将 Share 切换为 `public`，填写真实 UTC 发布/更新时间。
8. 执行全部 release gates、Cloudflare preview 和真实浏览器验收。
9. 部署应用并验证两个应用域名、规范 metadata、无效 slug、RSC 和媒体下载。
10. 发生应用回归时回滚 Worker；发生媒体缺陷时发布新版本前缀，绝不覆盖已封存版本。

## 14. 回滚策略

### 14.1 应用回归

- 使用 Wrangler deployment/version 历史恢复部署前的稳定 Worker version。
- 验证首页、API 和 Share 路由恢复。
- 保留失败版本和日志用于定位。

本次第一次部署已经验证了该路径：合法详情/deck 404 后，成功回滚到
`d5e9fa89-f5ea-4606-b8f7-ffaf9efb371e`。

### 14.2 媒体缺陷

- 不覆盖、不删除 `v4`。
- 生成新的不可变版本，例如 `v4-r2` 或新的正式版本号。
- 上传和封存新前缀。
- 修改注册表指向新版本，再部署 Worker。
- 旧版本至少保留到新版本完成生产验收。

### 14.3 DNS / Custom Domain

- 先区分 Worker deployment、Custom Domain 对象、证书和 Worker managed DNS
  record。
- 使用公共 DoH，而不是受 fake-IP 影响的本机 resolver，判断公网状态。
- 幂等 reattach 不一定重建缺失 managed record。
- 只有在确认 association 已损坏且同一 hostname/service/environment 可立即恢复时，才删除并重建单个 Custom
  Domain association。
- 不删除 Zone、Worker service、生产 deployment 或无关 DNS 记录。

## 15. 安全、隐私与权利边界

已完成的技术检查：

- 本地绝对路径、本地文件 URI 和 secret-like 文本扫描。
- Notes paragraph 级提取和人工内容复核。
- Speaker notes 和 comments 清理。
- Core、extended 和 custom document metadata 中的敏感字段清理。
- OOXML 外部关系、宏、ActiveX/OLE、嵌入对象、隐藏页和异常 custom XML 检查。
- 图片元数据清理。
- Transcript 与注册表同源生成和连续编号验证。
- 二维码目标技术解码。
- 公开文件 SHA-256、长度、MIME、Content-Disposition 和 body hash 验证。

没有独立完成、也不在本文声称完成的事项：

- 对所有第三方图片、截图、Logo、照片、引用、字体或数据的法律权利审计。
- 对第三方链接或二维码目标的长期运营、内容变化或合规保证。
- 对公开下载后的二次传播控制。

完全公开意味着知道 URL 的任何人均可下载和转发文件。未来的私有资料必须使用私有 bucket、Worker 鉴权、签名 URL、Cloudflare
Access 或站点登录授权，不能放入当前公开前缀。

## 16. 最终验收清单

### 平台与路由

- [x] `/shares` 公开目录上线。
- [x] Share 详情页上线并包含 40 节可索引 transcript。
- [x] Deck 页面上线并支持主要演示交互。
- [x] 两个应用域名的合法路由均返回 200。
- [x] 两个应用域名的无效 slug 均返回 404。
- [x] 浏览器形式 RSC 详情和 deck 请求均为 200、`text/x-component`、OpenNext
      cache HIT。

### 媒体

- [x] v4 权威源 SHA-256 冻结。
- [x] 40 张主图和 40 张缩略图连续无缺号。
- [x] Slide `003`、`033`–`035`、`040` 全尺寸复核。
- [x] PDF 为 40 页。
- [x] 公开 PPTX 衍生文件为 40 slides，且不包含私有 notes。
- [x] Transcript 为 40 节，且不包含已知本地路径。
- [x] 85 个 R2 对象完成认证和公共验证。
- [x] v4 远端 manifest 最后上传并封存前缀。

### SEO 与无障碍

- [x] Canonical 始终固定为 `https://aispeeds.me`。
- [x] 目录和详情可索引，deck 为 `noindex, follow`。
- [x] Sitemap 包含目录与详情，不包含 deck。
- [x] 详情有唯一 metadata 和可公开访问的 OG cover。
- [x] 键盘、焦点、页码公告、控制项名称和 44px targets 验收通过。
- [x] Catalog/detail Lighthouse Accessibility、Best Practices、SEO、Agentic
      Browsing 均为 100。

### 浏览器与响应式

- [x] 真实 Chromium 桌面生产验收。
- [x] `390×844` 移动竖屏生产验收。
- [x] `844×390` 移动横屏生产验收。
- [x] 规范域名和备用域名均完成详情/deck 网络与 console 检查。
- [x] 首页浮动菜单在桌面、竖屏和横屏可进入“公开分享”。
- [x] 无观察到 hydration、CORS、媒体 404 或 console error。
- [ ] 原生 Safari、Firefox 和实体 iOS/Android 独立兼容性矩阵未执行，本文不作相应声明。

### 生产与运维

- [x] 第一次失败部署已及时回滚。
- [x] OpenNext dummy cache 根因已修复。
- [x] 修复版本已部署并承载 100% 流量。
- [x] `aispeeds.me` 缺失 Worker managed apex DNS 记录已修复。
- [x] 四个公共 DoH resolver 返回一致 A/AAAA。
- [x] 生产自动验收 274/274 通过。
- [x] Git fingerprint 与部署前基线一致。
- [x] 未 commit、push 或创建 PR。

## 17. 结论

Public
Shares 首发版本已经完成实现、媒体清理、不可变 R2 发布、应用部署、故障回滚、OpenNext 缓存修复、apex
DNS 修复、自动 HTTP 验收和真实浏览器验收。

当前可对外使用的规范入口为：

```text
https://aispeeds.me/shares
```

首个 Share 的页面、40 页在线 deck、PDF、清理后的公开 PPTX 衍生文件和 transcript 均已完成生产验证。后续内容应复用同一注册表、路由、媒体 manifest 和不可变发布流程。
