// ==UserScript==
// @name         Claude Project Themes
// @namespace    mihnea-claude-themes
// @version      6.13.2
// @description  Per-project backgrounds, character overlays, sidebar coloring, project card theming, multi-voice character/accent swapping, state-based character swapping, quick-nav bar, and usage meter for claude.ai.
// @match        https://claude.ai/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://raw.githubusercontent.com/randombits-lab/cl-themes/main/scripts/claude-themes.user.js
// @updateURL    https://raw.githubusercontent.com/randombits-lab/cl-themes/main/scripts/claude-themes.user.js
// ==/UserScript==

(function () {
  'use strict';

  const CHARACTERS_ENABLED = window.__CLAUDE_THEMES_SPRITES !== undefined ? window.__CLAUDE_THEMES_SPRITES : GM_getValue('sprites_enabled', false);
  const SCRIPT_VERSION = '6.13.2';

  const BASE = 'https://raw.githubusercontent.com/randombits-lab/cl-themes/main/';

  const TOMOE_CHAT = BASE + 'tomoe_chat.png';
  const TOMOE_HOME = BASE + 'tomoe_project.png';
  const TOMOE_BG   = BASE + 'tomoe_background.png';
  const TOMOE_CARD = BASE + 'tomoe_card.png';

  const PRISM_CHAT = BASE + 'prism_chat.png';
  const PRISM_HOME = BASE + 'prism_project.png';
  const PRISM_BG   = BASE + 'prism_background.png';
  const PRISM_CARD = BASE + 'prism_card.png';

  const FAITH_CHAT = BASE + 'faith_chat.png';
  const FAITH_HOME = BASE + 'faith_project.png';
  const FAITH_BG   = BASE + 'faith_background.png';
  const FAITH_CARD = BASE + 'faith_card.png';

  const ALFRED_CHAT = BASE + 'alfred_chat.png';
  const ALFRED_HOME = BASE + 'alfred_project.png';
  const ALFRED_BG   = BASE + 'alfred_background.png';
  const ALFRED_CARD = BASE + 'alfred_card.png';

  const NABU_CHAT = BASE + 'nabu_chat.png';
  const NABU_HOME = BASE + 'nabu_project.png';
  const NABU_BG   = BASE + 'nabu_background.png';
  const NABU_CARD = BASE + 'nabu_card.png';

  const WORKSHOP_BG   = BASE + 'workshop_background.png';
  const WORKSHOP_CARD = BASE + 'workshop_card.png';

  const FACTORY_BG   = BASE + 'factory_background.png';
  const FACTORY_CARD = BASE + 'factory_card.png';

  const CRUCIBLE_SYLVANAS_CHAT       = BASE + 'crucible_sylvanas_chat.png';
  const CRUCIBLE_GROM_CHAT           = BASE + 'crucible_grom_chat.png';
  const CRUCIBLE_FAITH_SYLVANAS_CHAT = BASE + 'crucible_faith_sylvanas_chat.png';
  const CRUCIBLE_FAITH_GROM_CHAT     = BASE + 'crucible_faith_grom_chat.png';
  const CRUCIBLE_FAITH_COUNCIL_CHAT  = BASE + 'crucible_faith_council_chat.png';
  const CRUCIBLE_GROM_SYLVANAS_CHAT  = BASE + 'crucible_grom_sylvanas_chat.png';
  const CRUCIBLE_HOME                = BASE + 'crucible_project.png';
  const CRUCIBLE_BG                  = BASE + 'crucible_background.png';
  const CRUCIBLE_CARD                = BASE + 'crucible_card.png';

  const FOUNDRY_BG   = BASE + 'foundry_background.png';
  const FOUNDRY_CARD = BASE + 'foundry_card.png';

  const ANASTERIA_CHAT = BASE + 'anasteria_chat.png';
  const ANASTERIA_HOME = BASE + 'anasteria_project.png';
  const ANASTERIA_BG   = BASE + 'anasteria_background.png';
  const ANASTERIA_CARD = BASE + 'anasteria_card.png';

  const VADIM_AUTORITAR   = BASE + 'vadim_autoritar.png';
  const VADIM_DEZGUSTAT   = BASE + 'vadim_dezgustat.png';
  const VADIM_MULTUMIT    = BASE + 'vadim_multumit.png';
  const VADIM_IMPRESIONAT = BASE + 'vadim_impresionat.png';
  const VADIM_HOME        = BASE + 'vadim_project.png';
  const VADIM_BG          = BASE + 'vadim_background.png';
  const VADIM_CARD        = BASE + 'vadim_card.png';
  const STEWARD_CHAT = BASE + 'steward_chat.png';
  const STEWARD_HOME = BASE + 'steward_project.png';
  const STEWARD_BG   = BASE + 'steward_background.png';
  const STEWARD_CARD = BASE + 'steward_card.png';

  const PREFIX_COLORS = { 'meta': '#c45c4c' };
  function mix(c, p) { return `color-mix(in srgb, ${c} ${p}%, transparent)`; }

  // =========================================================================
  // USAGE METER — reads from DOM on /settings/usage, caches in localStorage
  // No network requests. Only reads pages the user has already navigated to.
  // =========================================================================
  const USAGE_KEY = 'claude-theme-usage';
  const USAGE_ID  = 'claude-theme-usage-meter';
  const UTILBAR_ID = 'claude-theme-utilbar';

  const RESEARCH_TEMPLATE = `I need you to generate a research prompt that I will run in ChatGPT Deep Research.

Context: [CONTEXT — what project this is for, what you already know, what triggered the research need]

Research question: [QUESTION — the specific thing you need answered]

Decision this supports: [DECISION — the choice or action this research must inform]

Task type: [TYPE — one of: competitive teardown / regulatory analysis / technical architecture comparison / market positioning / other (describe)]

Output I need from the research: [OUTPUT — e.g. comparison matrix, risk register, executive summary, triage framework, vendor scorecard]

Generate a complete ChatGPT Deep Research prompt that includes: a task statement, goal, scope, source priorities with specific domains, method constraints (separate facts from inference, flag contradictions, flag inaccessible sources), and an explicit output structure. Do not include preamble or explanation; output only the prompt I will paste into ChatGPT. Below is an example of the minimum requirements, over which you can build using what you know about me.

---

Task
Run deep research on [QUESTION — the research question, one sentence].

Goal
The decision this research must support is [DECISION — the specific choice or action].

Scope
- [Determined by Claude]

Method constraints
- Separate documented facts from vendor claims, estimates, and inference. Label each.
- Flag contradictions explicitly in a dedicated section rather than smoothing them into consensus.
- If a source is inaccessible, paywalled, or unclear, say so rather than omitting silently.
- Distinguish current state from roadmap or announced-but-unshipped capabilities.
- Provide a confidence level (high / medium / low) for each major claim.

Output
Produce:
1. Executive summary (max 300 words)
2. Detailed analysis (structured prose with section headers)
3. [OUTPUT ARTIFACT — e.g. comparison matrix / vendor scorecard / risk register / feature table / triage framework]
4. Contradictions and unresolved questions
5. Validation checklist (claims the reader should verify independently)
6. Source appendix with access dates

Do not blend evidence and recommendation into the same paragraph. Analysis first, then recommendation.`;

  function usageBarColor(pct) {
    if (pct >= 80) return '#c45c4c';
    if (pct >= 50) return '#c9a84c';
    return '#4a7ac8';
  }

  function readUsageFromPage() {
    if (!window.location.pathname.startsWith('/settings')) return;
    const bars = document.querySelectorAll('div[aria-valuenow]');
    if (bars.length < 2) return;
    const session = parseInt(bars[0].getAttribute('aria-valuenow')) || 0;
    const weekly = parseInt(bars[1].getAttribute('aria-valuenow')) || 0;

    let sessionReset = '', weeklyReset = '';
    const resetEls = document.querySelectorAll('p');
    for (const el of resetEls) {
      const t = (el.textContent || '').trim();
      if (t.startsWith('Resets in') && !sessionReset) sessionReset = t;
      else if (t.startsWith('Resets') && !t.startsWith('Resets in') && !weeklyReset) weeklyReset = t;
    }

    const data = { session, weekly, sessionReset, weeklyReset, ts: Date.now() };
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function getUsageData() {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  let lastUsageHash = '';
  function buildUsageMeter(container) {
    const data = getUsageData();
    const hash = data ? `${data.session}:${data.weekly}:${(Date.now()-data.ts) < 3600000 ? 'f' : 's'}` : 'none';
    if (hash === lastUsageHash && document.getElementById(USAGE_ID)) return;
    lastUsageHash = hash;
    let meter = document.getElementById(USAGE_ID);

    if (!data) {
      if (!meter) {
        meter = document.createElement('a');
        meter.id = USAGE_ID;
        meter.href = '/settings/usage';
        meter.title = 'Visit to load usage data';
        meter.style.cssText = 'display:flex;flex-direction:column;gap:2px;justify-content:center;padding:2px 8px;border-radius:4px;text-decoration:none;opacity:0.4;cursor:pointer;';
        meter.innerHTML = '<div style="width:100px;height:6px;background:#ffffff20;border-radius:3px;border:1px solid #ffffff15;"></div><div style="width:100px;height:4px;background:#ffffff15;border-radius:2px;border:1px solid #ffffff10;"></div>';
        container.insertBefore(meter, container.children[1] || null);
      }
      return;
    }

    const age = Date.now() - data.ts;
    const ageMin = Math.floor(age / 60000);
    const fresh = age < 3600000;
    const ageText = ageMin < 60 ? `${ageMin}m ago` : `${Math.floor(ageMin/60)}h ago`;

    const sColor = usageBarColor(data.session);
    const wColor = usageBarColor(data.weekly);

    if (!meter) {
      meter = document.createElement('a');
      meter.id = USAGE_ID;
      meter.href = '/settings/usage';
      meter.style.cssText = 'display:flex;align-items:center;gap:6px;padding:2px 8px;border-radius:4px;text-decoration:none;cursor:pointer;transition:opacity 0.2s;';
      meter.addEventListener('mouseenter', () => { meter.style.opacity = '1'; });
      meter.addEventListener('mouseleave', () => { meter.style.opacity = fresh ? '0.6' : '0.95'; });
      container.insertBefore(meter, container.children[1] || null);
    }

    meter.style.opacity = fresh ? '0.6' : '0.95';
    meter.title = `Session: ${data.session}% (${data.sessionReset})\nWeekly: ${data.weekly}% (${data.weeklyReset})\nUpdated: ${ageText}`;

    meter.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:2px;justify-content:center;">
        <div style="width:100px;height:6px;background:#ffffff20;border-radius:3px;overflow:hidden;border:1px solid #ffffff15;" title="Session: ${data.session}%">
          <div style="width:${data.session}%;height:100%;background:${sColor};border-radius:3px;transition:width 0.3s;"></div>
        </div>
        <div style="width:100px;height:4px;background:#ffffff15;border-radius:2px;overflow:hidden;border:1px solid #ffffff10;" title="Weekly: ${data.weekly}%">
          <div style="width:${data.weekly}%;height:100%;background:${wColor};border-radius:2px;transition:width 0.3s;"></div>
        </div>
      </div>
      <div style="width:${fresh ? '6px' : '10px'};height:${fresh ? '6px' : '10px'};border-radius:50%;background:${fresh ? '#4a7ac820' : '#c9a84c'};flex-shrink:0;transition:all 0.3s;${fresh ? '' : 'box-shadow:0 0 4px #c9a84c80;'}" title="${ageText}"></div>
    `;
  }

  // =========================================================================
  // QUICK-NAV — pinned project shortcuts, always visible
  // =========================================================================
  const NAV_ID = 'claude-theme-quicknav';
  const QUICK_NAV = [
    {
      label: 'Prism',
      url: '/project/019d4919-fdb8-70a6-9ab0-742306733d2c',
      color: '#00e5ff',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 3,20 21,20" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.7"/><line x1="6" y1="13" x2="2" y2="11" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><line x1="6" y1="13" x2="1" y2="14" stroke="currentColor" stroke-width="1.2" opacity="0.4"/><line x1="6" y1="13" x2="2" y2="17" stroke="currentColor" stroke-width="1.2" opacity="0.3"/><line x1="16" y1="13" x2="22" y2="9" stroke="currentColor" stroke-width="1" opacity="0.8"/><line x1="16" y1="13" x2="23" y2="12" stroke="currentColor" stroke-width="1" opacity="0.6"/><line x1="16" y1="13" x2="22" y2="15" stroke="currentColor" stroke-width="1" opacity="0.5"/><line x1="16" y1="13" x2="21" y2="18" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>',
    },
    {
      label: 'Workshop',
      url: '/project/019c9ef3-69c4-70de-a65e-9a3c0225188b',
      color: '#c47832',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17h18v3H3z" fill="currentColor" opacity="0.5"/><path d="M5 13h14c1.1 0 2 .9 2 2v2H3v-2c0-1.1.9-2 2-2z" fill="currentColor"/><path d="M7 9h10v4H7z" fill="currentColor" opacity="0.85"/><path d="M10 3h4v2h-4z" fill="currentColor" opacity="0.7"/><path d="M11 5h2v4h-2z" fill="currentColor" opacity="0.6"/></svg>',
    },
    {
      label: 'Code Foundry',
      url: '/project/019d638f-5d0b-72d1-b060-96438a50d1b7',
      color: '#4a7ac8',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" opacity="0.35"/><rect x="6" y="4" width="12" height="4" rx="1" fill="currentColor" opacity="0.7"/><rect x="6" y="10" width="12" height="4" rx="1" fill="currentColor" opacity="0.7"/><rect x="6" y="16" width="12" height="4" rx="1" fill="currentColor" opacity="0.7"/><circle cx="8.5" cy="6" r="1" fill="currentColor"/><circle cx="8.5" cy="12" r="1" fill="currentColor"/><circle cx="8.5" cy="18" r="1" fill="currentColor"/><rect x="13" y="5.5" width="3" height="1" rx="0.5" fill="currentColor"/><rect x="13" y="11.5" width="3" height="1" rx="0.5" fill="currentColor"/><rect x="13" y="17.5" width="3" height="1" rx="0.5" fill="currentColor"/></svg>',
    },
    {
      label: 'Factory',
      url: '/project/019c9f87-1b6d-7146-b3b8-a03ebcc80e91',
      color: '#4a9a7a',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="5" rx="6" ry="2.5" fill="currentColor" opacity="0.6"/><path d="M6 5v14c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/><ellipse cx="12" cy="19" rx="6" ry="2.5" fill="currentColor" opacity="0.4"/><ellipse cx="12" cy="14" rx="3.5" ry="5" fill="currentColor" opacity="0.3"/><ellipse cx="12" cy="13" rx="2" ry="3" fill="currentColor" opacity="0.6"/></svg>',
    },
  ];

  function injectQuickNav() {
    if (document.getElementById(NAV_ID)) return;
    const bar = document.createElement('div');
    bar.id = NAV_ID;
    bar.style.cssText = 'position:fixed;top:8px;right:140px;z-index:100;display:flex;flex-wrap:nowrap;gap:6px;align-items:center;pointer-events:auto;transition:right 0.2s ease;';

    for (const item of QUICK_NAV) {
      const isActive = window.location.pathname.includes(item.url);
      const a = document.createElement('a');
      a.href = item.url;
      a.title = item.label;
      a.style.cssText = `display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;color:${item.color};opacity:${isActive ? '1' : '0.65'};transition:opacity 0.2s,background 0.2s;background:${isActive ? mix(item.color, 15) : mix(item.color, 8)};border:1px solid ${isActive ? mix(item.color, 30) : mix(item.color, 20)};text-decoration:none;`;
      a.innerHTML = item.svg;
      a.querySelector('svg').style.cssText = 'width:22px;height:22px;';
      a.addEventListener('mouseenter', () => { a.style.opacity = '1'; a.style.background = mix(item.color, 20); a.style.borderColor = mix(item.color, 40); });
      a.addEventListener('mouseleave', () => {
        const active = window.location.pathname.includes(item.url);
        a.style.opacity = active ? '1' : '0.65';
        a.style.background = active ? mix(item.color, 15) : mix(item.color, 8);
        a.style.borderColor = active ? mix(item.color, 30) : mix(item.color, 20);
      });
      bar.appendChild(a);
    }

    const ver = document.createElement('span');
    ver.textContent = 'v' + SCRIPT_VERSION;
    ver.style.cssText = 'font-size:9px;opacity:0.35;color:#ffffff;pointer-events:none;user-select:none;letter-spacing:0.5px;padding-left:2px;';
    bar.appendChild(ver);

    document.body.appendChild(bar);
    buildUsageMeter(bar);
  }

  function refreshQuickNav() {
    const bar = document.getElementById(NAV_ID);
    if (!bar) { injectQuickNav(); return; }
    const panelOpen = isSidePanelOpen();
    bar.style.right = panelOpen ? '50%' : '140px';
    const links = bar.querySelectorAll('a:not(#' + USAGE_ID + ')');
    links.forEach((a, i) => {
      const item = QUICK_NAV[i];
      if (!item) return;
      const isActive = window.location.pathname.includes(item.url);
      a.style.opacity = isActive ? '1' : '0.65';
      a.style.background = isActive ? mix(item.color, 15) : mix(item.color, 8);
      a.style.borderColor = isActive ? mix(item.color, 30) : mix(item.color, 20);
    });
    readUsageFromPage();
    buildUsageMeter(bar);
  }

  // =========================================================================
  // UTILITY BAR — chat-only toolbar overlaying the disclaimer strip
  // =========================================================================
  function findDisclaimer() {
    for (const el of document.querySelectorAll('div')) {
      if (el.children.length > 3) continue;
      if (!(el.textContent || '').includes('can make mistakes')) continue;
      const r = el.getBoundingClientRect();
      if (r.height > 15 && r.height < 60 && r.width > 400) return el;
    }
    return null;
  }

  function refreshUtilBar() {
    const disclaimer = findDisclaimer();
    let bar = document.getElementById(UTILBAR_ID);
    if (!disclaimer) { if (bar) bar.style.display = 'none'; return; }
    const r = disclaimer.getBoundingClientRect();
    if (!bar) {
      bar = document.createElement('div');
      bar.id = UTILBAR_ID;
      bar.style.cssText = 'position:fixed;z-index:6;display:flex;align-items:center;gap:8px;pointer-events:auto;';
      const counter = document.createElement('span');
      counter.id = UTILBAR_ID + '-counter';
      counter.style.cssText = 'font-size:11px;color:#8a8a9a;opacity:0.6;letter-spacing:0.3px;font-variant-numeric:tabular-nums;padding-left:8px;white-space:nowrap;';
      bar.appendChild(counter);
      const spacerL = document.createElement('div');
      spacerL.style.flex = '1';
      bar.appendChild(spacerL);
      const btn = document.createElement('button');
      btn.title = 'Copy research prompt template';
      btn.style.cssText = 'display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;border:1px solid #ffffff15;background:#ffffff08;color:#8a8a9a;cursor:pointer;transition:all 0.2s;padding:0;';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M6 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="15" y2="15"/></svg>';
      btn.addEventListener('mouseenter', () => { btn.style.background = '#ffffff15'; btn.style.color = '#b0b0b0'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = '#ffffff08'; btn.style.color = '#8a8a9a'; btn.style.borderColor = '#ffffff15'; });
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(RESEARCH_TEMPLATE).then(() => {
          btn.style.borderColor = '#4a9a7a'; btn.style.color = '#4a9a7a';
          setTimeout(() => { btn.style.borderColor = '#ffffff15'; btn.style.color = '#8a8a9a'; }, 600);
        }).catch(() => {
          btn.style.borderColor = '#c45c4c'; btn.style.color = '#c45c4c';
          setTimeout(() => { btn.style.borderColor = '#ffffff15'; btn.style.color = '#8a8a9a'; }, 600);
        });
      });
      bar.appendChild(btn);
      const spacerR = document.createElement('div');
      spacerR.style.flex = '1';
      bar.appendChild(spacerR);
      const tokCounter = document.createElement('span');
      tokCounter.id = UTILBAR_ID + '-tokens';
      tokCounter.style.cssText = 'font-size:11px;color:#8a8a9a;opacity:0.6;letter-spacing:0.3px;font-variant-numeric:tabular-nums;padding-right:8px;white-space:nowrap;';
      bar.appendChild(tokCounter);
      document.body.appendChild(bar);
    }
    bar.style.display = 'flex';
    bar.style.left = r.left + 'px';
    bar.style.top = r.top + 'px';
    bar.style.width = r.width + 'px';
    bar.style.height = r.height + 'px';
    bar.style.background = getComputedStyle(disclaimer).backgroundColor;
    const counterEl = document.getElementById(UTILBAR_ID + '-counter');
    if (counterEl) {
      const human = document.querySelectorAll('[data-testid="user-message"]').length;
      const assist = document.querySelectorAll('[data-testid="action-bar-retry"]').length;
      counterEl.textContent = human + ' ↕ ' + assist;
      counterEl.title = human + ' human messages, ' + assist + ' assistant responses';
    }
    const tokEl = document.getElementById(UTILBAR_ID + '-tokens');
    if (tokEl) {
      const chatEl = findMainChatContainer();
      const chars = chatEl ? (chatEl.textContent || '').length : 0;
      const tokens = Math.round(chars / 4);
      let tokText;
      if (tokens < 1000) tokText = '~' + tokens;
      else if (tokens < 10000) tokText = '~' + (tokens / 1000).toFixed(1) + 'k';
      else tokText = '~' + Math.round(tokens / 1000) + 'k';
      tokEl.textContent = tokText;
      tokEl.title = 'Estimated ~' + tokens.toLocaleString() + ' tokens (' + chars.toLocaleString() + ' chars ÷ 4)';
    }
  }

  function destroyUtilBar() { document.getElementById(UTILBAR_ID)?.remove(); }

  // =========================================================================
  // PROJECT CONFIGS
  // =========================================================================
  const BASE_THEMES = {
    'foundry': {
      accentColor: '#4a7ac8',
      chatBackground: 'linear-gradient(160deg, #0a0c10 0%, #0c1018 30%, #090c14 60%, #070810 100%)',
      card: { imageUrl: FOUNDRY_CARD, titleColor: '#4a7ac8', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: FOUNDRY_BG, characterUrl: null, characterOpacity: 1.0, characterHeight: '0', characterBottom: '0', characterRight: '0' },
      homepage: { backgroundImage: FOUNDRY_BG, characterUrl: null, characterOpacity: 1.0, characterWidth: '0', characterBottom: '0', characterRight: '0' },
    },
  };

  function resolveTheme(config) {
    if (!config.extends) return config;
    const base = BASE_THEMES[config.extends];
    if (!base) return config;
    const resolved = {};
    for (const key of Object.keys(base)) {
      if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
        resolved[key] = { ...base[key], ...(config[key] || {}) };
      } else {
        resolved[key] = key in config ? config[key] : base[key];
      }
    }
    for (const key of Object.keys(config)) {
      if (!(key in resolved)) resolved[key] = config[key];
    }
    return resolved;
  }

  const PROJECTS = [
    {
      id: 'tomoe', projectId: '019d05dc-759a-7319-849f-c79a47909884', label: 'Tomoe',
      accentColor: '#c9a84c', interjectionColor: '#e0d0a0', interjectionBorder: '#c9a84c', chatBackground: 'linear-gradient(160deg, #0e0d08 0%, #1a1a0e 30%, #12130c 60%, #0a0a06 100%)',
      card: { imageUrl: TOMOE_CARD, titleColor: '#c9a84c', letterSpacing: '1px', textTransform: 'uppercase' },
      chat: { backgroundImage: TOMOE_BG, characterUrl: TOMOE_CHAT, characterOpacity: 1.0, characterHeight: '76vh', characterBottom: '-100px', characterRight: '-200px' },
      homepage: { backgroundImage: TOMOE_BG, characterUrl: TOMOE_HOME, characterOpacity: 1.0, characterWidth: '650px', characterBottom: '-40px', characterRight: '-20px' },
    },
    {
      id: 'prism', projectId: '019d4919-fdb8-70a6-9ab0-742306733d2c', label: 'Prism',
      accentColor: '#00e5ff', interjectionColor: '#a0e8f0', interjectionBorder: '#00e5ff', chatBackground: 'linear-gradient(160deg, #0a0e14 0%, #0d1a24 30%, #0a1218 60%, #080c10 100%)',
      card: { imageUrl: PRISM_CARD, titleColor: '#00e5ff', letterSpacing: '0.8px', textTransform: null },
      chat: { backgroundImage: PRISM_BG, characterUrl: PRISM_CHAT, characterOpacity: 1.0, characterHeight: '76vh', characterBottom: '-100px', characterRight: '-200px' },
      homepage: { backgroundImage: PRISM_BG, characterUrl: PRISM_HOME, characterOpacity: 1.0, characterWidth: '450px', characterBottom: '-40px', characterRight: '-20px' },
    },
    {
      id: 'faith', projectId: '019ce6da-3c0d-72ab-ad7e-245a15e093c5', label: 'Faith',
      accentColor: '#c4877a', interjectionColor: '#e0c4b8', interjectionBorder: '#c4877a', chatBackground: 'linear-gradient(160deg, #1a1410 0%, #2a1f18 30%, #1e1812 60%, #141010 100%)',
      card: { imageUrl: FAITH_CARD, titleColor: '#c4877a', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: FAITH_BG, characterUrl: FAITH_CHAT, characterOpacity: 1.0, characterHeight: '66vh', characterBottom: '-80px', characterRight: '-200px' },
      homepage: { backgroundImage: FAITH_BG, characterUrl: FAITH_HOME, characterOpacity: 1.0, characterWidth: '600px', characterBottom: '-40px', characterRight: '-20px' },
    },
    {
      id: 'alfred', projectId: '019d14b7-0d31-723e-b526-4fb064ce241f', label: 'Alfred',
      accentColor: '#5a7a9a', interjectionColor: '#a8c0d4', interjectionBorder: '#5a7a9a', chatBackground: 'linear-gradient(160deg, #1a1209 0%, #0f0d0a 30%, #0a0f14 60%, #0d1117 100%)',
      card: { imageUrl: ALFRED_CARD, titleColor: '#5a7a9a', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: ALFRED_BG, characterUrl: ALFRED_CHAT, characterOpacity: 1.0, characterHeight: '76vh', characterBottom: '-100px', characterRight: '-200px' },
      homepage: { backgroundImage: ALFRED_BG, characterUrl: ALFRED_HOME, characterOpacity: 1.0, characterWidth: '700px', characterBottom: '-80px', characterRight: '-60px' },
    },
    {
      id: 'nabu', projectId: '019cb41e-993e-7236-bf04-f40c21d82d2f', label: "N'abu",
      accentColor: '#9a8a5a', interjectionColor: '#d4c8a0', interjectionBorder: '#9a8a5a', chatBackground: 'linear-gradient(160deg, #14120e 0%, #221e16 30%, #1a1610 60%, #100e0a 100%)',
      card: { imageUrl: NABU_CARD, titleColor: '#9a8a5a', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: NABU_BG, characterUrl: NABU_CHAT, characterOpacity: 1.0, characterHeight: '76vh', characterBottom: '-60px', characterRight: '-180px' },
      homepage: { backgroundImage: NABU_BG, characterUrl: NABU_HOME, characterOpacity: 1.0, characterWidth: '500px', characterBottom: '-60px', characterRight: '-40px' },
    },
    {
      id: 'workshop', projectId: '019c9ef3-69c4-70de-a65e-9a3c0225188b', label: 'Workshop',
      accentColor: '#c47832', chatBackground: 'linear-gradient(160deg, #141210 0%, #1a1714 30%, #12110f 60%, #0d0c0a 100%)',
      card: { imageUrl: WORKSHOP_CARD, titleColor: '#c47832', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: WORKSHOP_BG, characterUrl: null, characterOpacity: 1.0, characterHeight: '0', characterBottom: '0', characterRight: '0' },
      homepage: { backgroundImage: WORKSHOP_BG, characterUrl: null, characterOpacity: 1.0, characterWidth: '0', characterBottom: '0', characterRight: '0' },
    },
    {
      id: 'factory', projectId: '019c9f87-1b6d-7146-b3b8-a03ebcc80e91', label: 'Factory',
      accentColor: '#4a9a7a', chatBackground: 'linear-gradient(160deg, #0c1210 0%, #0e1a18 30%, #0b1412 60%, #080e0c 100%)',
      card: { imageUrl: FACTORY_CARD, titleColor: '#4a9a7a', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: FACTORY_BG, characterUrl: null, characterOpacity: 1.0, characterHeight: '0', characterBottom: '0', characterRight: '0' },
      homepage: { backgroundImage: FACTORY_BG, characterUrl: null, characterOpacity: 1.0, characterWidth: '0', characterBottom: '0', characterRight: '0' },
    },
    {
      id: 'crucible', projectId: '019d59ce-c7d6-7584-bee7-455cc8147931', label: 'Crucible',
      accentColor: '#c44828', chatBackground: 'linear-gradient(160deg, #1a1008 0%, #241408 30%, #1a0e06 60%, #100a04 100%)',
      voices: {
        'faith':    { accentColor: '#d4956a', textColor: '#e0c4a0', characterUrl: FAITH_CHAT, characterHeight: '66vh', characterBottom: '-80px', characterRight: '-160px' },
        'sylvanas': { accentColor: '#8b7abd', textColor: '#b8aad4', characterUrl: CRUCIBLE_SYLVANAS_CHAT, characterHeight: '76vh', characterBottom: '-100px', characterRight: '-200px' },
        'grom':     { accentColor: '#b83a2a', textColor: '#d4a090', characterUrl: CRUCIBLE_GROM_CHAT, characterHeight: '68vh', characterBottom: '-100px', characterRight: '-180px' },
      },
      voiceCombos: {
        'faith_sylvanas': { characterUrl: CRUCIBLE_FAITH_SYLVANAS_CHAT, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-160px' },
        'faith_grom':     { characterUrl: CRUCIBLE_FAITH_GROM_CHAT, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-180px' },
        'grom_sylvanas':  { characterUrl: CRUCIBLE_GROM_SYLVANAS_CHAT, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-180px' },
        'council':        { characterUrl: CRUCIBLE_FAITH_COUNCIL_CHAT, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-160px' },
      },
      card: { imageUrl: CRUCIBLE_CARD, titleColor: '#c44828', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: CRUCIBLE_BG, characterUrl: null, characterOpacity: 1.0, characterHeight: '0', characterBottom: '0', characterRight: '0' },
      homepage: { backgroundImage: CRUCIBLE_BG, characterUrl: CRUCIBLE_HOME, characterOpacity: 1.0, characterWidth: '500px', characterBottom: '-40px', characterRight: '-20px' },
    },
    { id: 'foundry', projectId: '019d638f-5d0b-72d1-b060-96438a50d1b7', label: 'Foundry', extends: 'foundry' },
    { id: 'licitapp', projectId: '019d26a7-d716-7675-af51-76dd9d2ce4eb', label: 'LicitApp', extends: 'foundry' },
    { id: 'vesper', projectId: '019da196-0cff-74af-9b38-ee2f3701579c', label: 'Vesper', extends: 'foundry' },
    { id: 'aiprojectsconsole', projectId: '019dc9fc-5001-741a-9648-4788558df268', label: 'AI Projects Console', extends: 'foundry' },
    {
      id: 'anasteria', projectId: '019d6e94-5386-7432-898a-8d4408cd98b6', label: 'Anasteria',
      accentColor: '#b05a78', interjectionColor: '#d4a0b8', interjectionBorder: '#b05a78', chatBackground: 'linear-gradient(160deg, #1a0c0e 0%, #241014 30%, #1a0c10 60%, #10080a 100%)',
      card: { imageUrl: ANASTERIA_CARD, titleColor: '#b05a78', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: ANASTERIA_BG, characterUrl: ANASTERIA_CHAT, characterOpacity: 1.0, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-180px' },
      homepage: { backgroundImage: ANASTERIA_BG, characterUrl: ANASTERIA_HOME, characterOpacity: 1.0, characterWidth: '350px', characterBottom: '-40px', characterRight: '-20px' },
    },
    {
      id: 'vadim', projectId: '019db6df-1df1-73ba-bd38-b41cf419cbe3', label: 'Vadim',
      accentColor: '#6a7a3c', interjectionColor: '#b0c490', interjectionBorder: '#6a7a3c',
      chatBackground: 'linear-gradient(160deg, #12140e 0%, #1a1c14 30%, #14160f 60%, #0c0e0a 100%)',
      states: {
        'autoritar':   { characterUrl: VADIM_AUTORITAR },
        'dezgustat':   { characterUrl: VADIM_DEZGUSTAT },
        'multumit':    { characterUrl: VADIM_MULTUMIT },
        'impresionat': { characterUrl: VADIM_IMPRESIONAT },
      },
      defaultState: 'autoritar',
      card: { imageUrl: VADIM_CARD, titleColor: '#6a7a3c', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: VADIM_BG, characterUrl: VADIM_AUTORITAR, characterOpacity: 1.0, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-180px' },
      homepage: { backgroundImage: VADIM_BG, characterUrl: VADIM_HOME, characterOpacity: 1.0, characterWidth: '450px', characterBottom: '-40px', characterRight: '-20px' },
    },
    {
      id: 'steward', projectId: '019e1478-d849-71ee-ad74-bc96ffedf585', label: 'Steward',
      accentColor: '#7a5a8c', interjectionColor: '#b8a0c8', interjectionBorder: '#7a5a8c',
      chatBackground: 'linear-gradient(160deg, #0e0a12 0%, #14101a 30%, #100c16 60%, #0a080e 100%)',
      card: { imageUrl: STEWARD_CARD, titleColor: '#7a5a8c', letterSpacing: '0.5px', textTransform: null },
      chat: { backgroundImage: STEWARD_BG, characterUrl: STEWARD_CHAT, characterOpacity: 1.0, characterHeight: '72vh', characterBottom: '-90px', characterRight: '-180px' },
      homepage: { backgroundImage: STEWARD_BG, characterUrl: STEWARD_HOME, characterOpacity: 1.0, characterWidth: '450px', characterBottom: '-40px', characterRight: '-20px' },
    },
  ];

  for (let i = 0; i < PROJECTS.length; i++) {
    PROJECTS[i] = resolveTheme(PROJECTS[i]);
  }

  const STYLE_ID       = 'claude-theme-style';
  const CHARACTER_ID   = 'claude-theme-character';
  const BG_ID          = 'claude-theme-bg';
  const CARD_STYLE_ID  = 'claude-theme-cards-style';
  const VOICE_STYLE_ID = 'claude-theme-voice-style';
  const THEME_ATTR     = 'data-claude-theme';
  const SIDEBAR_ATTR   = 'data-theme-colored';

  let currentThemeKey = null, currentProject = null, currentMode = null;
  let currentComboKey = null, voiceCharReady = false;
  let currentStateName = null;
  let themedContainer = null, topBarEl = null, origTopBar = null;

  function detectContext() {
    const url = window.location.pathname;
    for (const p of PROJECTS) {
      if (p.projectId && url.includes('/project/' + p.projectId)) return { project: p, mode: 'homepage' };
    }
    if (!url.includes('/chat/')) return null;
    const links = document.querySelectorAll('a[href*="/project/"]');
    for (const link of links) {
      if (link.closest('nav') || link.closest('[class*="sidebar"]') || link.closest('#' + NAV_ID)) continue;
      const r = link.getBoundingClientRect();
      if (r.top < 80 && r.top >= 0) {
        const href = link.getAttribute('href') || '';
        for (const p of PROJECTS) {
          if (p.projectId && href.includes('/project/' + p.projectId)) return { project: p, mode: 'chat' };
        }
      }
    }
    return null;
  }

  let cachedMainContainer = null;
  function findMainChatContainer(forceRescan) {
    if (!forceRescan && cachedMainContainer && document.body.contains(cachedMainContainer)) return cachedMainContainer;
    const vh = window.innerHeight;
    let best = null, bestS = 0;
    let scrollBest = null, scrollBestS = 0;
    document.querySelectorAll('div[class*="overflow"]').forEach(el => {
      const s = window.getComputedStyle(el);
      if (s.overflowY !== 'auto' && s.overflowY !== 'scroll') return;
      const r = el.getBoundingClientRect();
      if (r.width > 400 && r.height > 300 && r.height <= vh * 1.5) {
        const sc = r.width * r.height;
        if (el.scrollHeight > el.clientHeight + 20) {
          if (sc > scrollBestS) { scrollBestS = sc; scrollBest = el; }
        }
        if (sc > bestS) { bestS = sc; best = el; }
      }
    });
    cachedMainContainer = scrollBest || best;
    return cachedMainContainer;
  }

  function findTopBar() {
    const vw = window.innerWidth;
    let best = null, bestScore = -1;
    document.querySelectorAll('div, nav, header').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top >= 0 && r.top < 20 && r.height > 20 && r.height < 70 && r.width > vw * 0.5) {
        const score = r.width * 1000 - r.height;
        if (score > bestScore) { bestScore = score; best = el; }
      }
    });
    return best;
  }

  function isSidePanelOpen() {
    const panel = document.querySelector('div[class*="z-20"]');
    if (!panel) return false;
    const r = panel.getBoundingClientRect();
    return r.width > 200 && r.height > 400;
  }

  // =========================================================================
  // MULTI-VOICE DETECTION (Crucible-type projects)
  // =========================================================================
  function detectVoiceState(project) {
    if (!project.voices) return null;
    const container = themedContainer || document.querySelector('[' + THEME_ATTR + ']');
    if (!container) return null;
    const voiceNames = Object.keys(project.voices);
    const markerStrings = voiceNames.map(n => n.charAt(0).toUpperCase() + n.slice(1) + ':');
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const events = [];
    let textOffset = 0, node;
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      const inBQ = !!node.parentElement?.closest('blockquote');
      for (let i = 0; i < voiceNames.length; i++) {
        let from = 0;
        while (true) {
          const idx = text.indexOf(markerStrings[i], from);
          if (idx === -1) break;
          events.push({ name: voiceNames[i], inBlockquote: inBQ, offset: textOffset + idx });
          from = idx + markerStrings[i].length;
        }
      }
      textOffset += text.length;
    }
    if (!events.length) return null;
    events.sort((a, b) => a.offset - b.offset);
    let primaryIdx = -1;
    for (let i = events.length - 1; i >= 0; i--) { if (!events[i].inBlockquote) { primaryIdx = i; break; } }
    if (primaryIdx === -1) return null;
    const primary = events[primaryIdx].name;
    const interjectors = new Set();
    for (let i = primaryIdx - 1; i >= 0; i--) {
      const e = events[i];
      if (e.inBlockquote) { if (e.name !== primary) interjectors.add(e.name); }
      else if (e.name !== primary) { interjectors.add(e.name); break; }
    }
    for (let i = primaryIdx + 1; i < events.length; i++) {
      if (events[i].inBlockquote && events[i].name !== primary) interjectors.add(events[i].name);
    }
    return { primary, interjectors: [...interjectors].sort() };
  }

  function getComboKey(state) {
    if (!state) return null;
    if (state.interjectors.length === 0) return state.primary;
    if (state.interjectors.length >= 2) return 'council';
    return state.primary + '_' + state.interjectors[0];
  }

  function resolveVoiceConfig(project, comboKey, primaryName) {
    if (project.voiceCombos?.[comboKey]) {
      const accent = primaryName ? project.voices[primaryName]?.accentColor : project.accentColor;
      return { sprite: project.voiceCombos[comboKey], accent: accent || project.accentColor };
    }
    if (comboKey?.includes('_')) {
      const parts = comboKey.split('_'), reversed = parts[1] + '_' + parts[0];
      if (project.voiceCombos?.[reversed]) {
        const accent = primaryName ? project.voices[primaryName]?.accentColor : project.accentColor;
        return { sprite: project.voiceCombos[reversed], accent: accent || project.accentColor };
      }
    }
    if (comboKey?.includes('_') && project.voiceCombos?.council) {
      const accent = primaryName ? project.voices[primaryName]?.accentColor : project.accentColor;
      return { sprite: project.voiceCombos.council, accent: accent || project.accentColor };
    }
    if (project.voices[comboKey]) return { sprite: project.voices[comboKey], accent: project.voices[comboKey].accentColor };
    if (primaryName && project.voices[primaryName]) return { sprite: project.voices[primaryName], accent: project.voices[primaryName].accentColor };
    return null;
  }

  function preloadVoiceImages(project) {
    if (project.voices) for (const v of Object.values(project.voices)) { if (v.characterUrl) new Image().src = v.characterUrl; }
    if (project.voiceCombos) for (const c of Object.values(project.voiceCombos)) { if (c.characterUrl) new Image().src = c.characterUrl; }
  }

  function colorVoiceText(project) {
    if (!project.voices) return;
    const container = themedContainer || document.querySelector('[' + THEME_ATTR + ']');
    if (!container) return;
    const voiceNames = Object.keys(project.voices);
    const ATTR = 'data-voice-colored';
    for (const el of container.querySelectorAll('strong, b')) {
      if (el.hasAttribute(ATTR)) continue;
      const text = (el.textContent || '').trim();
      for (const name of voiceNames) {
        const marker = name.charAt(0).toUpperCase() + name.slice(1) + ':';
        if (text === marker || text.startsWith(marker)) { el.style.color = project.voices[name].accentColor; el.setAttribute(ATTR, name); break; }
      }
    }
    for (const bq of container.querySelectorAll('blockquote')) {
      if (bq.hasAttribute(ATTR)) continue;
      const text = bq.textContent || '';
      for (const name of voiceNames) {
        const marker = name.charAt(0).toUpperCase() + name.slice(1) + ':';
        if (text.includes(marker)) { bq.style.color = project.voices[name].textColor || project.voices[name].accentColor; bq.style.borderLeftColor = project.voices[name].accentColor; bq.setAttribute(ATTR, name); break; }
      }
    }
  }

  // === SINGLE-VOICE INTERJECTION COLORING ===
  function colorInterjections(project) {
    if (!project.interjectionColor || project.voices) return;
    const container = themedContainer || document.querySelector('[' + THEME_ATTR + ']');
    if (!container) return;
    const ATTR = 'data-voice-colored';
    for (const bq of container.querySelectorAll('blockquote')) {
      if (bq.hasAttribute(ATTR)) continue;
      bq.style.color = project.interjectionColor;
      if (project.interjectionBorder) bq.style.borderLeftColor = project.interjectionBorder;
      bq.setAttribute(ATTR, project.id);
    }
  }

  function applyVoiceState(project, comboKey, accent, sprite) {
    if (!comboKey || !sprite) return;
    const changed = currentComboKey !== comboKey;
    currentComboKey = comboKey;
    let vs = document.getElementById(VOICE_STYLE_ID);
    if (!vs) { vs = document.createElement('style'); vs.id = VOICE_STYLE_ID; document.head.appendChild(vs); }
    if (changed) {
      vs.textContent = `:root { --tm-accent: ${accent}; }`;
    }
    if (topBarEl && changed) topBarEl.style.borderBottom = '2px solid var(--tm-accent)';
    if (!CHARACTERS_ENABLED || !sprite.characterUrl) { const el = document.getElementById(CHARACTER_ID); if (el) el.style.display = 'none'; return; }
    let charEl = document.getElementById(CHARACTER_ID);
    const isNew = !charEl;
    if (isNew) {
      charEl = document.createElement('div'); charEl.id = CHARACTER_ID;
      for (const layer of ['a', 'b']) {
        const img = document.createElement('img');
        img.alt = ''; img.draggable = false; img.dataset.layer = layer;
        img.style.height = '100%'; img.style.width = 'auto';
        img.onerror = () => { charEl.style.display = 'none'; };
        charEl.appendChild(img);
      }
      document.body.appendChild(charEl);
    }
    charEl.style.cssText = `position:fixed;pointer-events:none;z-index:-1;user-select:none;height:${sprite.characterHeight||'76vh'};width:auto;bottom:${sprite.characterBottom||'-100px'};right:${sprite.characterRight||'-200px'};`;
    if (isNew) {
      const first = charEl.querySelector('img[data-layer="a"]');
      first.src = sprite.characterUrl;
      first.classList.add('is-active');
      charEl.style.opacity = '0'; charEl.style.animation = 'thm-char-in 400ms ease-out 150ms forwards'; voiceCharReady = true;
    } else if (changed) {
      swapCharacterImage(sprite.characterUrl, charEl);
    }
    charEl.style.display = isSidePanelOpen() ? 'none' : '';
  }

  // =========================================================================
  // STATE-BASED CHARACTER SWAPPING (Vadim-type projects)
  // =========================================================================
  function detectStateMarker(project) {
    if (!project.states) return null;
    const container = themedContainer || document.querySelector('[' + THEME_ATTR + ']');
    if (!container) return null;
    const stateNames = Object.keys(project.states);
    const allText = container.textContent || '';
    let lastState = null, lastIdx = -1;
    for (const name of stateNames) {
      const marker = '[' + name.toUpperCase() + ']';
      const idx = allText.lastIndexOf(marker);
      if (idx > lastIdx) { lastIdx = idx; lastState = name; }
    }
    return lastState;
  }

  function hideStateMarkers(project) {
    if (!project.states) return;
    const container = themedContainer || document.querySelector('[' + THEME_ATTR + ']');
    if (!container) return;
    const stateNames = Object.keys(project.states);
    const ATTR = 'data-state-hidden';
    for (const p of container.querySelectorAll('p')) {
      if (p.hasAttribute(ATTR)) continue;
      const text = (p.textContent || '').trim();
      for (const name of stateNames) {
        if (text === '[' + name.toUpperCase() + ']') {
          p.style.display = 'none';
          p.setAttribute(ATTR, '1');
          break;
        }
      }
    }
  }

  function preloadStateImages(project) {
    if (!project.states) return;
    for (const s of Object.values(project.states)) { if (s.characterUrl) new Image().src = s.characterUrl; }
  }

  function refreshStateCharacter(project) {
    if (!project.states || currentMode !== 'chat') return;
    const detected = detectStateMarker(project);
    const stateName = detected || project.defaultState || Object.keys(project.states)[0];
    if (stateName === currentStateName) return;
    currentStateName = stateName;
    const stateConfig = project.states[stateName];
    if (!stateConfig || !CHARACTERS_ENABLED) return;
    const charEl = document.getElementById(CHARACTER_ID);
    if (!charEl) return;
    if (stateConfig.characterUrl) swapCharacterImage(stateConfig.characterUrl, charEl);
    if (stateConfig.characterHeight) charEl.style.height = stateConfig.characterHeight;
    if (stateConfig.characterBottom) charEl.style.bottom = stateConfig.characterBottom;
    if (stateConfig.characterRight) charEl.style.right = stateConfig.characterRight;
  }

  // =========================================================================
  // THEME LIFECYCLE
  // =========================================================================
  function cleanup() {
    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(CHARACTER_ID)?.remove();
    document.getElementById(BG_ID)?.remove();
    document.getElementById(VOICE_STYLE_ID)?.remove();
    if (themedContainer) themedContainer.removeAttribute(THEME_ATTR);
    if (topBarEl && origTopBar !== null) topBarEl.style.borderBottom = origTopBar;
    themedContainer = null; topBarEl = null; origTopBar = null;
    currentThemeKey = null; currentProject = null; currentMode = null;
    currentComboKey = null; voiceCharReady = false;
    currentStateName = null;
    cachedMainContainer = null;
  }

  function swapCharacterImage(newSrc, charEl) {
    if (!charEl) return;
    const current = charEl.querySelector('img.is-active');
    const staging = charEl.querySelector('img:not(.is-active)');
    if (!current || !staging) return;
    if (current.src === newSrc) return;
    staging.src = newSrc;
    staging.decode().then(() => {
      staging.classList.add('is-active');
      current.classList.remove('is-active');
    }).catch(() => {
      staging.classList.add('is-active');
      current.classList.remove('is-active');
    });
  }

  function injectBackground(project, cfg) {
    if (document.getElementById(BG_ID)) return;
    const bgDiv = document.createElement('div'); bgDiv.id = BG_ID;
    if (cfg.backgroundImage && project.chatBackground) {
      const img = new Image();
      img.onerror = () => { bgDiv.style.backgroundImage = 'none'; bgDiv.style.background = project.chatBackground; };
      img.src = cfg.backgroundImage;
    }
    document.body.appendChild(bgDiv);
  }

  function injectCharacter(cfg) {
    if (!CHARACTERS_ENABLED || !cfg.characterUrl || document.getElementById(CHARACTER_ID)) return;
    const d = document.createElement('div'); d.id = CHARACTER_ID;
    for (const layer of ['a', 'b']) {
      const img = document.createElement('img');
      img.alt = ''; img.draggable = false; img.dataset.layer = layer;
      img.onerror = () => { d.style.display = 'none'; };
      d.appendChild(img);
    }
    const first = d.querySelector('img[data-layer="a"]');
    first.src = cfg.characterUrl;
    first.classList.add('is-active');
    document.body.appendChild(d);
  }

  function applyTheme(project, mode) {
    const key = project.id + ':' + mode;
    if (currentThemeKey === key) return;
    cleanup();
    currentThemeKey = key; currentProject = project; currentMode = mode;
    const cfg = project[mode]; if (!cfg) return;
    const isVoiceChat = !!(project.voices && mode === 'chat');
    const isStateChat = !!(project.states && mode === 'chat');
    let bgCSS = '';
    if (cfg.backgroundImage) bgCSS = `background-image:url("${cfg.backgroundImage}");background-size:cover;background-position:center;background-repeat:no-repeat;`;
    else if (project.chatBackground) bgCSS = `background:${project.chatBackground};`;
    const hasStaticChar = CHARACTERS_ENABLED && !!cfg.characterUrl && !isVoiceChat;
    const isChat = mode === 'chat';
    const sizing = isChat ? `height:${cfg.characterHeight};width:auto;` : `width:${cfg.characterWidth};height:auto;`;
    const imgSizing = isChat ? 'height:100%;width:auto;' : 'width:100%;height:auto;';
    const accent = project.accentColor;
    const st = document.createElement('style'); st.id = STYLE_ID;
    st.textContent = `
      body { position:relative !important; z-index:0 !important; background-color:transparent !important; }
      header { background-color:transparent !important; }
      @keyframes thm-bg-in { from{opacity:0} to{opacity:1} }
      @keyframes thm-char-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      #${BG_ID} { position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-2;pointer-events:none;opacity:0;animation:thm-bg-in 300ms ease-out forwards;${bgCSS} }
      [${THEME_ATTR}] { background:transparent !important;background-color:transparent !important;background-image:none !important; }
      [${THEME_ATTR}] > * { background-color:transparent !important; }
      :root { --tm-accent: ${accent}; }
      [${THEME_ATTR}] { scrollbar-color:color-mix(in srgb, var(--tm-accent) 65%, transparent) transparent !important;scrollbar-width:thin !important; }
      [${THEME_ATTR}]::-webkit-scrollbar { width:8px; }
      [${THEME_ATTR}]::-webkit-scrollbar-track { background:transparent; }
      [${THEME_ATTR}]::-webkit-scrollbar-thumb { background:color-mix(in srgb, var(--tm-accent) 65%, transparent);border-radius:4px; }
      [${THEME_ATTR}]::-webkit-scrollbar-thumb:hover { background:color-mix(in srgb, var(--tm-accent) 85%, transparent); }
      [${THEME_ATTR}] fieldset { box-shadow:0 0 0 1px color-mix(in srgb, var(--tm-accent) 9%, transparent), 0 0 12px color-mix(in srgb, var(--tm-accent) 3%, transparent) !important;border-color:color-mix(in srgb, var(--tm-accent) 13%, transparent) !important; }
      #${CHARACTER_ID} img { display:block;object-fit:contain;transition:opacity 200ms ease; }
      #${CHARACTER_ID} img.is-active { opacity:1; }
      #${CHARACTER_ID} img:not(.is-active) { opacity:0;position:absolute;top:0;right:0; }
      ${hasStaticChar ? `
      #${CHARACTER_ID} { position:fixed;bottom:${cfg.characterBottom};right:${cfg.characterRight};${sizing}pointer-events:none;z-index:-1;opacity:0;animation:thm-char-in 400ms ease-out 150ms forwards;user-select:none; }
      #${CHARACTER_ID} img { ${imgSizing} }` : ''}
      @keyframes tm-breathe { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.006) translateY(-0.12rem)} }
      #${CHARACTER_ID} img { animation:tm-breathe 5s ease-in-out infinite; }
    `;
    document.head.appendChild(st);
    const cc = findMainChatContainer(true);
    if (cc) { themedContainer = cc; cc.setAttribute(THEME_ATTR, project.id); }
    injectBackground(project, cfg);
    if (!isVoiceChat) injectCharacter(cfg);
    if (isVoiceChat) preloadVoiceImages(project);
    if (isStateChat) preloadStateImages(project);
    if (mode === 'chat') {
      const tb = findTopBar();
      if (tb) { topBarEl = tb; origTopBar = tb.style.borderBottom; tb.style.borderBottom = '2px solid var(--tm-accent)'; }
      else { let tbR = 0; const tbP = setInterval(() => { const t = findTopBar(); if (t) { topBarEl = t; origTopBar = t.style.borderBottom; t.style.borderBottom = '2px solid var(--tm-accent)'; clearInterval(tbP); } if (++tbR > 6) clearInterval(tbP); }, 500); }
    }
  }

  function refreshTheme() {
    if (!currentProject || !currentMode) return;
    const cfg = currentProject[currentMode]; if (!cfg) return;
    const isVoiceChat = !!(currentProject.voices && currentMode === 'chat');
    const isStateChat = !!(currentProject.states && currentMode === 'chat');
    const cc = findMainChatContainer();
    if (cc && cc !== themedContainer) {
      if (themedContainer) themedContainer.removeAttribute(THEME_ATTR);
      themedContainer = cc; cc.setAttribute(THEME_ATTR, currentProject.id);
    }
    if (themedContainer && !themedContainer.hasAttribute(THEME_ATTR)) themedContainer.setAttribute(THEME_ATTR, currentProject.id);
    if (!document.getElementById(BG_ID)) injectBackground(currentProject, cfg);
    if (isVoiceChat) {
      const state = detectVoiceState(currentProject);
      if (state) {
        const comboKey = getComboKey(state);
        const resolved = resolveVoiceConfig(currentProject, comboKey, state.primary);
        if (resolved) applyVoiceState(currentProject, comboKey, resolved.accent, resolved.sprite);
      }
      if (!state && !currentComboKey) { const el = document.getElementById(CHARACTER_ID); if (el) el.style.display = 'none'; }
      if (!state && currentComboKey) { const el = document.getElementById(CHARACTER_ID); if (el) el.style.display = isSidePanelOpen() ? 'none' : ''; }
      colorVoiceText(currentProject);
    } else if (isStateChat) {
      refreshStateCharacter(currentProject);
      hideStateMarkers(currentProject);
      if (CHARACTERS_ENABLED && cfg.characterUrl && !document.getElementById(CHARACTER_ID)) injectCharacter(cfg);
      const el = document.getElementById(CHARACTER_ID); if (el) el.style.display = isSidePanelOpen() ? 'none' : '';
    } else {
      if (CHARACTERS_ENABLED && cfg.characterUrl && !document.getElementById(CHARACTER_ID)) injectCharacter(cfg);
      const el = document.getElementById(CHARACTER_ID); if (el) el.style.display = isSidePanelOpen() ? 'none' : '';
    }
    if (currentMode === 'chat') {
      const tb = findTopBar();
      if (tb && tb !== topBarEl) {
        if (topBarEl && origTopBar !== null) topBarEl.style.borderBottom = origTopBar;
        topBarEl = tb; origTopBar = tb.style.borderBottom;
        tb.style.borderBottom = '2px solid var(--tm-accent)';
      } else if (topBarEl && topBarEl.style.borderBottom !== '2px solid var(--tm-accent)') {
        topBarEl.style.borderBottom = '2px solid var(--tm-accent)';
      }
    }
  }

  function manageCardStyles() {
    const onP = window.location.pathname === '/projects';
    const ex = document.getElementById(CARD_STYLE_ID);
    if (!onP) { if (ex) ex.remove(); return; }
    if (!ex) {
      let css = '';
      for (const p of PROJECTS) {
        if (!p.projectId || !p.card) continue;
        const sel = `a[href*="/project/${p.projectId}"]`;
        if (p.card.imageUrl) {
          css += `${sel}{background:url("${p.card.imageUrl}") center/cover no-repeat !important;border:1px solid ${mix(p.accentColor, 25)} !important;position:relative !important;overflow:hidden !important;}`;
          css += `${sel}::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.35) 40%,rgba(0,0,0,.45) 65%,rgba(0,0,0,.78) 100%);pointer-events:none;border-radius:inherit;z-index:0;}`;
          css += `${sel}>*{position:relative !important;z-index:1 !important;}`;
        } else { css += `${sel}{border:1px solid ${mix(p.accentColor, 20)} !important;}`; }
      }
      const s = document.createElement('style'); s.id = CARD_STYLE_ID; s.textContent = css; document.head.appendChild(s);
    }
    styleProjectCardText();
  }

  function styleProjectCardText() {
    for (const p of PROJECTS) {
      if (!p.projectId || !p.card) continue;
      const cards = document.querySelectorAll(`a[href*="/project/${p.projectId}"]`);
      for (const card of cards) {
        const allEls = card.querySelectorAll('*');
        let titleFound = false;
        for (const el of allEls) {
          if (titleFound) break;
          const fw = parseInt(getComputedStyle(el).fontWeight) || 400; if (fw < 600) continue;
          let hasText = false;
          for (const c of el.childNodes) { if (c.nodeType === Node.TEXT_NODE && c.textContent.trim()) { hasText = true; break; } }
          if (hasText) {
            if (p.card.titleColor) el.style.color = p.card.titleColor;
            if (p.card.letterSpacing) el.style.letterSpacing = p.card.letterSpacing;
            if (p.card.textTransform) el.style.textTransform = p.card.textTransform;
            titleFound = true;
          }
        }
        for (const el of allEls) { if (!el.children.length && el.textContent?.includes('Updated')) el.style.opacity = '0.5'; }
        for (const el of allEls) {
          if (el.children.length > 0) continue;
          const t = (el.textContent||'').trim(); if (!t || el.style.color === p.card.titleColor || t.includes('Updated')) continue;
          if (t.length > 30) el.style.opacity = '0.85';
        }
      }
    }
  }

  function colorChatLinks() {
    const colorMap = {};
    for (const p of PROJECTS) colorMap[p.label.toLowerCase()] = p.accentColor;
    for (const [k, v] of Object.entries(PREFIX_COLORS)) colorMap[k.toLowerCase()] = v;
    for (const link of document.querySelectorAll('nav a[href*="/chat/"], [class*="sidebar"] a[href*="/chat/"]')) {
      const text = (link.textContent||'').trim(), si = text.indexOf('|');
      if (si === -1) { if (link.hasAttribute(SIDEBAR_ATTR)) { link.style.color = ''; link.removeAttribute(SIDEBAR_ATTR); } continue; }
      const prefix = text.substring(0, si).trim().toLowerCase(), color = colorMap[prefix];
      if (color) { link.style.color = color; link.setAttribute(SIDEBAR_ATTR, prefix); }
      else if (link.hasAttribute(SIDEBAR_ATTR)) { link.style.color = ''; link.removeAttribute(SIDEBAR_ATTR); }
    }
    if (window.location.pathname === '/recents') {
      for (const link of document.querySelectorAll('a[href*="/chat/"]')) {
        if (link.closest('nav') || link.closest('[class*="sidebar"]')) continue;
        let titleEl = null;
        for (const el of link.querySelectorAll('*')) {
          const fw = parseInt(getComputedStyle(el).fontWeight)||400; if (fw < 500) continue;
          for (const c of el.childNodes) { if (c.nodeType === Node.TEXT_NODE && c.textContent.includes('|')) { titleEl = el; break; } }
          if (titleEl) break;
        }
        if (!titleEl) { if (!(link.textContent||'').includes('|')) continue; titleEl = link; }
        const text = (titleEl.textContent||'').trim(), si = text.indexOf('|'); if (si === -1) continue;
        const prefix = text.substring(0, si).trim().toLowerCase(), color = colorMap[prefix];
        if (color) { titleEl.style.color = color; titleEl.setAttribute(SIDEBAR_ATTR, prefix); }
        else if (titleEl.hasAttribute(SIDEBAR_ATTR)) { titleEl.style.color = ''; titleEl.removeAttribute(SIDEBAR_ATTR); }
      }

      // Project-label coloring on recents (non-pipe rows)
      for (const link of document.querySelectorAll('a[href*="/chat/"]')) {
        if (link.closest('nav') || link.closest('[class*="sidebar"]')) continue;
        if (link.hasAttribute(SIDEBAR_ATTR)) continue;
        const timeEl = link.querySelector('time');
        if (!timeEl) continue;
        const labelSpan = timeEl.nextElementSibling;
        if (!labelSpan || labelSpan.tagName !== 'SPAN') continue;
        const labelText = (labelSpan.textContent || '').trim().toLowerCase();
        if (!labelText) continue;
        let matched = null;
        for (const p of PROJECTS) {
          if (labelText === p.label.toLowerCase() || labelText.includes(p.label.toLowerCase())) {
            matched = p; break;
          }
        }
        if (!matched) continue;
        const titleSpan = link.querySelector('span');
        if (titleSpan && titleSpan !== labelSpan) titleSpan.style.color = matched.accentColor;
        labelSpan.style.color = matched.accentColor;
        labelSpan.style.opacity = '0.7';
        link.setAttribute(SIDEBAR_ATTR, matched.id);
      }
    }
  }

  let slowCycleTimer = null;
  function slowCycle() {
    colorChatLinks();
    if (currentProject && currentMode && !currentProject.voices) colorInterjections(currentProject);
    if (window.location.pathname === '/projects') styleProjectCardText();
  }

  function check() {
    manageCardStyles();
    refreshQuickNav();
    const ctx = detectContext();
    if (ctx) { const key = ctx.project.id + ':' + ctx.mode; if (currentThemeKey !== key) applyTheme(ctx.project, ctx.mode); else refreshTheme(); }
    else if (currentThemeKey) cleanup();
    if (window.location.pathname.includes('/chat/')) refreshUtilBar(); else destroyUtilBar();
    if (!slowCycleTimer) { slowCycleTimer = setTimeout(() => { slowCycleTimer = null; slowCycle(); }, 2000); }
  }

  let checkTimer = null;
  function scheduleCheck() {
    if (checkTimer) return;
    checkTimer = setTimeout(() => { checkTimer = null; check(); }, 500);
  }

  new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type !== 'childList') continue;
      const dominated = [...m.addedNodes, ...m.removedNodes].every(n => n.id === STYLE_ID || n.id === CHARACTER_ID || n.id === BG_ID || n.id === CARD_STYLE_ID || n.id === VOICE_STYLE_ID || n.id === NAV_ID || n.id === UTILBAR_ID);
      if (!dominated) { scheduleCheck(); return; }
    }
  }).observe(document.body, { childList: true, subtree: true });

  const oPS = history.pushState; history.pushState = function() { oPS.apply(this, arguments); setTimeout(check, 300); };
  const oRS = history.replaceState; history.replaceState = function() { oRS.apply(this, arguments); setTimeout(check, 300); };
  window.addEventListener('popstate', () => setTimeout(check, 300));
  setInterval(check, 10000);
  setInterval(slowCycle, 2000);
  setTimeout(check, 1000);
})();
