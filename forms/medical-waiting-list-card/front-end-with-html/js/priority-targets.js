  

  // Maximum permitted wait in weeks, mirroring the SvelteKit engine.
  export const PRIORITY_TARGET_WEEKS = {
    P1a: 1 / 7,
    P1b: 3 / 7,
    P2: 4,
    P3: 12,
    P4: 18,
    P5: 26,
    P6: null
  };

  export const RTT_BREACH_WEEKS = 18;
  export const LONG_WAIT_WEEKS = 52;
  export const APPROACHING_BREACH_WINDOW_WEEKS = 4;

  export const targetWaitWeeks = function targetWaitWeeks(priority) {
    if (!priority || priority === 'P6') return null;
    return PRIORITY_TARGET_WEEKS[priority];
  };

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  export const parseIsoDate = function parseIsoDate(iso) {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00Z');
    return Number.isNaN(d.getTime()) ? null : d;
  };

  export const daysBetween = function daysBetween(fromIso, toIso) {
    const from = parseIsoDate(fromIso);
    const to = parseIsoDate(toIso);
    if (!from || !to) return null;
    return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
  };

  export const weeksBetween = function weeksBetween(fromIso, toIso) {
    const d = daysBetween(fromIso, toIso);
    return d === null ? null : Math.round((d / 7) * 10) / 10;
  };

  export const todayIso = function todayIso(now) {
    return (now || new Date()).toISOString().slice(0, 10);
  };
