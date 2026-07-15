// Never-event rules. Mirrors the SvelteKit
// `src/lib/engine/never-event-rules.ts`. Pure functions.
//
// NHS England Never Events Policy and Framework (2018) — wrong-site
// surgery, wrong implant, retained foreign object. Any fired never-event
// rule forces composite risk = Critical and triggers a statutory
// notification flag.

const NEVER_EVENT_TYPES = {
  'wrong-site':      'Wrong-site surgery',
  'wrong-side':      'Wrong-side surgery',
  'wrong-patient':   'Wrong-patient surgery',
  'wrong-procedure': 'Wrong-procedure surgery',
  'wrong-implant':   'Wrong-implant',
  'retained-item':   'Retained foreign object'
};

/** Compose never-event FiredRules. */
function applyNeverEventRules(data) {
  const fired = [];

  if (data.safety.neverEventFlagged === 'yes') {
    const type = data.safety.neverEventType;
    const description = NEVER_EVENT_TYPES[type] || 'Never-event candidate (type unspecified)';
    fired.push({
      ruleId: `R-NE-${type || 'unspecified'}`,
      instrument: 'never-event',
      grade: 'never-event',
      category: 'never-event',
      description: `${description} — statutory NHS England notification required`
    });
  }

  if (data.safety.retainedItemSuspected === 'yes') {
    fired.push({
      ruleId: 'R-NE-retained-item',
      instrument: 'never-event',
      grade: 'never-event',
      category: 'never-event',
      description: 'Retained foreign object suspected'
    });
  }

  return fired;
}

/** True when any never-event candidate has been flagged. */
function hasNeverEvent(data) {
  return (
    data.safety.neverEventFlagged === 'yes' ||
    data.safety.retainedItemSuspected === 'yes'
  );
}

export { NEVER_EVENT_TYPES, applyNeverEventRules, hasNeverEvent };
