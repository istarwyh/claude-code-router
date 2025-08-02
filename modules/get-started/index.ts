import { setupComponent } from './components/setup';
import { deploymentComponent } from './components/deployment';

// 供应商详情客户端脚本将在构建时注入

export const getStartedModule = `
<section class="content-section" id="get-started">
    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-content">
            <h1>Claude-Code-Router</h1>
            <p class="subtitle">Universal Claude API Proxy for Multiple Providers</p>
            <div class="badges">
                <a href="javascript:void(0)" class="badge" data-provider="anthropic" onclick="scrollToProvider('anthropic')">Anthropic</a>
                <a href="javascript:void(0)" class="badge" data-provider="deepseek" onclick="scrollToProvider('deepseek')">DeepSeek</a>
                <a href="javascript:void(0)" class="badge" data-provider="openai" onclick="scrollToProvider('openai')">OpenAI</a>
                <a href="javascript:void(0)" class="badge" data-provider="kimi" onclick="scrollToProvider('kimi')">Kimi</a>
                <a href="javascript:void(0)" class="badge" data-provider="openrouter" onclick="scrollToProvider('openrouter')">OpenRouter</a>
                <a href="javascript:void(0)" class="badge" data-provider="anyrouter" onclick="scrollToProvider('anyrouter')">AnyRouter</a>
                <a href="javascript:void(0)" class="badge" data-provider="siliconflow" onclick="scrollToProvider('siliconflow')">SiliconFlow</a>
                <a href="javascript:void(0)" class="badge" data-provider="qwen3-coder" onclick="scrollToProvider('qwen3-coder')">Qwen3-Coder</a>
                <a href="javascript:void(0)" class="badge" data-provider="aicodewith" onclick="scrollToProvider('aicodewith')">AICodeWith</a>
            </div>
        </div>
    </div>

    ${setupComponent}
    ${deploymentComponent}
</section>

<!-- 供应商详情客户端脚本 -->
<script>
// 这里将在构建时注入供应商详情处理脚本
var ProviderDetailsApp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shared/scripts/providerDetails.ts
  var providerDetails_exports = {};
  __export(providerDetails_exports, {
    hideProviderDetails: () => hideProviderDetails,
    showProviderDetails: () => showProviderDetails
  });

  // modules/get-started/types/provider.ts
  var providers = [
    {
      id: "anthropic",
      name: "Anthropic",
      displayName: "Anthropic (\u5B98\u65B9)",
      icon: "AN",
      color: "linear-gradient(45deg, #5436DA, #7B61FF)",
      description: "\u5B98\u65B9Claude API\uFF0C\u65E0\u9700\u4EE3\u7406\uFF0C\u4F46\u9700\u8981\u89E3\u51B3\u4E2D\u56FD\u5927\u9646\u8D26\u53F7\u5145\u503C\u95EE\u9898\u3002",
      isDirectlyUsable: true,
      originalUrl: "https://api.anthropic.com",
      apiKeyUrl: "https://claude.ai",
      features: ["\u5B98\u65B9API", "\u65E0\u9700\u4EE3\u7406", "\u7A33\u5B9A\u53EF\u9760"],
      specialConfig: {
        envVars: {},
        notes: "\u{1F504} \u4E2D\u56FD\u5927\u9646\u5145\u503C\u65B9\u6CD5\uFF1A<br>1. \u5F04\u4E2A\u7F8E\u533AApple ID\u4E0B\u8F7DClaude Code<br>2. \u652F\u4ED8\u5B9D\u5B9A\u4F4D\u5207\u5230\u65E7\u91D1\u5C71\uFF0C\u4F7F\u7528\u5C0F\u7A0B\u5E8FPockytShop\u4E7020\u5200\u7684\u82F9\u679C\u793C\u54C1\u5361<br>3. \u7528\u793C\u54C1\u5361\u53BB\u82F9\u679CApp Store\u5145\u503C<br>4. \u5728Claude Code\u4E2D\u5B8C\u6210\u8BA2\u9605"
      }
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      displayName: "DeepSeek",
      icon: "DS",
      description: "High-performance reasoning models with excellent cost efficiency. Perfect for complex coding tasks.",
      isDirectlyUsable: true,
      proxyUrl: "https://cc.xiaohui.cool",
      originalUrl: "https://api.deepseek.com",
      aliasCommand: 'alias deepseek="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://cc.xiaohui.cool claude"',
      apiKeyUrl: "https://platform.deepseek.com",
      features: ["High reasoning capability", "Cost efficient", "Fast response"]
    },
    {
      id: "anyrouter",
      name: "AnyRouter",
      displayName: "AnyRouter",
      icon: "AR",
      description: "Model proxy service - Provides access to Claude and other models. Click to register and get $100 free credits!",
      isDirectlyUsable: true,
      proxyUrl: "https://anyrouter.top",
      originalUrl: "https://anyrouter.top",
      aliasCommand: 'alias anyrouter="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://anyrouter.top claude"',
      apiKeyUrl: "https://anyrouter.top/console/token?aff=4Ly0",
      features: ["$100 free credits", "Multiple models", "Easy setup"],
      specialConfig: {
        envVars: {},
        notes: "\u{1F381} Register to get $100 free credits"
      }
    },
    {
      id: "kimi",
      name: "Kimi",
      displayName: "Kimi (Moonshot AI)",
      icon: "KM",
      description: "Advanced Chinese AI models with strong multilingual capabilities and long context support.",
      isDirectlyUsable: true,
      proxyUrl: "https://api.moonshot.cn/anthropic",
      originalUrl: "https://api.moonshot.cn/v1",
      aliasCommand: 'alias kimi="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic claude"',
      apiKeyUrl: "https://platform.moonshot.cn",
      features: ["Chinese AI models", "Multilingual support", "Long context"]
    },
    {
      id: "siliconflow",
      name: "SiliconFlow",
      displayName: "SiliconFlow",
      icon: "SF",
      description: "Chinese AI infrastructure platform providing access to various domestic and international models.",
      isDirectlyUsable: true,
      proxyUrl: "https://api.siliconflow.cn/",
      originalUrl: "https://api.siliconflow.cn/v1",
      aliasCommand: 'alias siliconflow="ANTHROPIC_BASE_URL=https://api.siliconflow.cn/ ANTHROPIC_API_KEY=sk-your-siliconflow-key ANTHROPIC_MODEL=Pro/moonshotai/Kimi-K2-Instruct claude"',
      apiKeyUrl: "https://siliconflow.cn",
      features: ["Chinese platform", "Multiple models", "Domestic & international"],
      specialConfig: {
        envVars: {
          "ANTHROPIC_BASE_URL": "https://api.siliconflow.cn/",
          "ANTHROPIC_API_KEY": "sk-your-siliconflow-key",
          "ANTHROPIC_MODEL": "Pro/moonshotai/Kimi-K2-Instruct"
        },
        notes: "Uses special environment variable format"
      }
    },
    {
      id: "qwen3-coder",
      name: "Qwen3-Coder",
      displayName: "Qwen3-Coder",
      icon: "Q3C",
      description: "Advanced coding model from Alibaba Cloud with strong programming capabilities and Chinese language support.",
      isDirectlyUsable: true,
      proxyUrl: "https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy",
      originalUrl: "https://dashscope.aliyuncs.com/api/v1",
      aliasCommand: 'alias qwen3-coder="ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy ANTHROPIC_AUTH_TOKEN=your-dashscope-apikey claude"',
      apiKeyUrl: "https://dashscope.console.aliyun.com",
      features: ["Programming focused", "Chinese language support", "Alibaba OpenSource"],
      specialConfig: {
        envVars: {
          "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy",
          "ANTHROPIC_AUTH_TOKEN": "your-dashscope-apikey"
        },
        notes: "Qwen3-Coder may be expensive according to some feedbacks"
      }
    },
    {
      id: "aicodewith",
      name: "AICodeWith",
      displayName: "AICodeWith",
      icon: "ACW",
      description: "AI coding assistant platform providing direct Claude Code API access. Get 2000 free credits upon registration!",
      isDirectlyUsable: true,
      proxyUrl: "https://api.aicodewith.com",
      originalUrl: "https://api.aicodewith.com",
      aliasCommand: 'alias aicodewith="ANTHROPIC_AUTH_TOKEN=xxx ANTHROPIC_BASE_URL=https://api.aicodewith.com claude --dangerously-skip-permissions"',
      apiKeyUrl: "https://aicodewith.com/?invitation=VI84XXSW",
      features: ["2000 free credits", "Direct API access", "No deployment needed"],
      specialConfig: {
        envVars: {
          "ANTHROPIC_AUTH_TOKEN": "xxx",
          "ANTHROPIC_BASE_URL": "https://api.aicodewith.com"
        },
        notes: "\u{1F381} Get 2000 free credits (~10 conversations) upon registration"
      }
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      displayName: "OpenRouter",
      icon: "OR",
      description: "Access to multiple AI models through a single API, including Claude, GPT, and open-source models.",
      isDirectlyUsable: false,
      originalUrl: "https://openrouter.ai/api/v1",
      apiKeyUrl: "https://openrouter.ai",
      features: ["Multiple models", "Single API", "Open-source models"]
    },
    {
      id: "openai",
      name: "OpenAI",
      displayName: "OpenAI",
      icon: "AI",
      description: "Industry-leading GPT models including GPT-4o and GPT-4o-mini for diverse AI applications.",
      isDirectlyUsable: false,
      originalUrl: "https://api.openai.com/v1",
      apiKeyUrl: "https://platform.openai.com",
      features: ["GPT-4o models", "Industry leading", "Diverse applications"]
    }
  ];

  // shared/scripts/providerDetails.ts
  function createAliasCommandElement(aliasCommand) {
    const aliasDiv = document.createElement("div");
    aliasDiv.className = "alias-command";
    const labelDiv = document.createElement("div");
    labelDiv.className = "alias-label";
    labelDiv.textContent = "\u{1F680} \u5FEB\u901F\u914D\u7F6E\u547D\u4EE4\uFF1A";
    const codeDiv = document.createElement("div");
    codeDiv.className = "alias-code";
    const codeElement = document.createElement("code");
    codeElement.textContent = aliasCommand;
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => {
      if (typeof window.copyToClipboard === "function") {
        window.copyToClipboard(aliasCommand);
      }
    };
    codeDiv.appendChild(codeElement);
    codeDiv.appendChild(copyBtn);
    aliasDiv.appendChild(labelDiv);
    aliasDiv.appendChild(codeDiv);
    return aliasDiv;
  }
  function createDeployNoticeElement() {
    const noticeDiv = document.createElement("div");
    noticeDiv.className = "deploy-notice";
    const iconDiv = document.createElement("div");
    iconDiv.className = "notice-icon";
    iconDiv.textContent = "\u26A0\uFE0F";
    const contentDiv = document.createElement("div");
    contentDiv.className = "notice-content";
    const strongP = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = "\u9700\u8981\u90E8\u7F72\u4EE3\u7406\u670D\u52A1";
    strongP.appendChild(strong);
    const descP = document.createElement("p");
    descP.textContent = "\u8BE5\u4F9B\u5E94\u5546\u9700\u8981\u60A8\u81EA\u5DF1\u90E8\u7F72\u4EE3\u7406\u670D\u52A1\u3002\u8BF7\u53C2\u8003\u4E0B\u65B9\u7684\u90E8\u7F72\u6307\u5357\u3002";
    contentDiv.appendChild(strongP);
    contentDiv.appendChild(descP);
    noticeDiv.appendChild(iconDiv);
    noticeDiv.appendChild(contentDiv);
    return noticeDiv;
  }
  function createSpecialConfigElement(notes) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "special-note";
    const iconSpan = document.createElement("span");
    iconSpan.className = "note-icon";
    iconSpan.textContent = "\u2139\uFE0F";
    noteDiv.appendChild(iconSpan);
    noteDiv.innerHTML += " " + notes;
    return noteDiv;
  }
  function createFeatureListElement(features) {
    const featuresDiv = document.createElement("div");
    featuresDiv.className = "provider-features";
    const title = document.createElement("h5");
    title.textContent = "\u2728 \u7279\u6027\u4EAE\u70B9\uFF1A";
    const featureList = document.createElement("div");
    featureList.className = "feature-list";
    features.forEach((feature) => {
      const tag = document.createElement("span");
      tag.className = "feature-tag";
      tag.textContent = feature;
      featureList.appendChild(tag);
    });
    featuresDiv.appendChild(title);
    featuresDiv.appendChild(featureList);
    return featuresDiv;
  }
  function createApiKeyLinkElement(apiKeyUrl) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "provider-links";
    const link = document.createElement("a");
    link.href = apiKeyUrl;
    link.target = "_blank";
    link.className = "api-key-btn";
    link.textContent = "\u{1F511} \u83B7\u53D6 API Key \u2192";
    linksDiv.appendChild(link);
    return linksDiv;
  }
  function generateProviderDetailsContent(provider) {
    const container = document.createElement("div");
    const description = document.createElement("p");
    description.className = "provider-description";
    description.textContent = provider.description;
    container.appendChild(description);
    if (provider.aliasCommand) {
      container.appendChild(createAliasCommandElement(provider.aliasCommand));
    } else if (!provider.isDirectlyUsable) {
      container.appendChild(createDeployNoticeElement());
    }
    if (provider.specialConfig?.notes) {
      container.appendChild(createSpecialConfigElement(provider.specialConfig.notes));
    }
    container.appendChild(createFeatureListElement(provider.features));
    container.appendChild(createApiKeyLinkElement(provider.apiKeyUrl));
    return container;
  }
  function showProviderDetails(providerId) {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider)
      return;
    const detailsElement = document.getElementById("provider-details");
    const titleElement = document.getElementById("details-title");
    const contentElement = document.getElementById("details-content");
    if (!detailsElement || !titleElement || !contentElement)
      return;
    titleElement.textContent = provider.displayName;
    contentElement.innerHTML = "";
    const detailsContent = generateProviderDetailsContent(provider);
    contentElement.appendChild(detailsContent);
    detailsElement.style.display = "block";
    detailsElement.scrollIntoView({ behavior: "smooth" });
  }
  function hideProviderDetails() {
    const detailsElement = document.getElementById("provider-details");
    if (detailsElement) {
      detailsElement.style.display = "none";
    }
  }
  if (typeof window !== "undefined") {
    window.showProviderDetails = showProviderDetails;
    window.hideProviderDetails = hideProviderDetails;
  }
  return __toCommonJS(providerDetails_exports);
})();

</script>
`;

export * from './components/setup';
export * from './components/deployment';
