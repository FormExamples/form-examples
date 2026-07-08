(function (root) {
  const ns = (root.MedicalWaitingListCard = root.MedicalWaitingListCard || {});

  // Maximum permitted wait in weeks, mirroring the SvelteKit engine.
  ns.PRIORITY_TARGET_WEEKS = {
    P1a: 1 / 7,
    P1b: 3 / 7,
    P2: 4,
    P3: 12,
    P4: 18,
    P5: 26,
    P6: null
  };

  ns.RTT_BREACH_WEEKS = 18;
  ns.LONG_WAIT_WEEKS = 52;
  ns.APPROACHING_BREACH_WINDOW_WEEKS = 4;

  ns.targetWaitWeeks = function targetWaitWeeks(priority) {
    if (!priority || priority === 'P6') return null;
    return ns.PRIORITY_TARGET_WEEKS[priority];
  };

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  ns.parseIsoDate = function parseIsoDate(iso) {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00Z');
    return Number.isNaN(d.getTime()) ? null : d;
  };

  ns.daysBetween = function daysBetween(fromIso, toIso) {
    const from = ns.parseIsoDate(fromIso);
    const to = ns.parseIsoDate(toIso);
    if (!from || !to) return null;
    return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
  };

  ns.weeksBetween = function weeksBetween(fromIso, toIso) {
    const d = ns.daysBetween(fromIso, toIso);
    return d === null ? null : Math.round((d / 7) * 10) / 10;
  };

  ns.todayIso = function todayIso(now) {
    return (now || new Date()).toISOString().slice(0, 10);
  };
})(window);
