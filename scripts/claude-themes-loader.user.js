// DEPRECATED: DO NOT INSTALL. claude.ai's CSP omits 'unsafe-eval'; Chromium MV3 enforces it
// inside userscript worlds, so eval/new Function on fetched text cannot execute here.
// Canonical delivery is direct install of claude-themes.user.js (Tampermonkey auto-update).
// Retained for reference only.
// ==UserScript==
// @name         Claude Project Themes (Loader)
// @namespace    mihnea-claude-themes
// @version      1.1.0
// @description  Loader: fetches and executes the canonical theme script from the cl-themes delivery mirror.
// @match        https://claude.ai/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @downloadURL  https://raw.githubusercontent.com/randombits-lab/cl-themes/main/scripts/claude-themes-loader.user.js
// @updateURL    https://raw.githubusercontent.com/randombits-lab/cl-themes/main/scripts/claude-themes-loader.user.js
// ==/UserScript==
(function () {
  'use strict';
  const SCRIPT_URL = 'https://raw.githubusercontent.com/randombits-lab/cl-themes/main/scripts/claude-themes.user.js';
  const CACHE_KEY = 'claude-themes-cached-script';
  const CACHE_TS_KEY = 'claude-themes-cached-ts';
  const CACHE_TTL = 6 * 60 * 60 * 1000;

  function execute(code) {
    try { new Function(code)(); }
    catch (e) { console.error('[Claude Themes Loader] Execution error:', e); }
  }
  function runCached() {
    const cached = GM_getValue(CACHE_KEY, null);
    if (cached) { execute(cached); return true; }
    return false;
  }

  const age = Date.now() - GM_getValue(CACHE_TS_KEY, 0);
  if (age < CACHE_TTL) { runCached(); return; }

  const hadCache = runCached();
  GM_xmlhttpRequest({
    method: 'GET',
    url: SCRIPT_URL + '?t=' + Date.now(),
    onload: function (resp) {
      if (resp.status === 200 && resp.responseText && resp.responseText.length > 500) {
        GM_setValue(CACHE_KEY, resp.responseText);
        GM_setValue(CACHE_TS_KEY, Date.now());
        if (!hadCache) execute(resp.responseText);
      }
    },
    onerror: function (err) { console.warn('[Claude Themes Loader] Fetch failed, using cache if available.', err); }
  });
})();
