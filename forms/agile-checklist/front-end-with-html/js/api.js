(function () {
  'use strict';
  const NS = (window.AgileChecklistDashboard = window.AgileChecklistDashboard || {});
  const API_BASE = '/api/checklists';
  const CACHE_KEY = 'agile-checklist-dashboard:cache:v1';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

  function safeLs() { try { return window.localStorage; } catch (_) { return null; } }

  function readCache() {
    const ls = safeLs();
    if (!ls) return null;
    const raw = ls.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.rows)) return null;
      const fetchedAt = Number(parsed.fetchedAt) || 0;
      if (fetchedAt && Date.now() - fetchedAt > CACHE_TTL_MS) return null;
      return parsed;
    } catch (_) { return null; }
  }

  function writeCache(rows) {
    const ls = safeLs();
    if (!ls) return;
    try {
      ls.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), rows: rows }));
    } catch (_) { /* ignore */ }
  }

  function clearCache() {
    const ls = safeLs();
    if (!ls) return;
    try { ls.removeItem(CACHE_KEY); } catch (_) {}
  }

  /**
   * Returns { source: 'cache' | 'api' | 'sample', rows, fetchedAt? }.
   * Caller may call again to refresh after rendering the cached rows.
   */
  NS.fetchChecklists = function () {
    return fetch(API_BASE)
      .then(function (res) {
        if (!res.ok) throw new Error('API ' + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (Array.isArray(rows)) writeCache(rows);
        return { source: 'api', rows: rows };
      })
      .catch(function () {
        const cached = readCache();
        if (cached) return { source: 'cache', rows: cached.rows, fetchedAt: cached.fetchedAt };
        return { source: 'sample', rows: NS.SAMPLE_CHECKLISTS };
      });
  };

  NS.clearChecklistsCache = clearCache;
})();
