// Anaesthetic-event rules. Mirrors the SvelteKit
// `src/lib/engine/anaesthetic-event-rules.ts`. Pure functions.
//
// The anaesthetist selects an event type (or 'none') on step 5; this
// catalogue surfaces it as a FiredRule. Severe events (failed
// intubation, anaphylaxis, malignant hyperthermia, suxamethonium
// apnoea, intra-op cardiac/respiratory arrest, awareness under
// anaesthesia) raise composite risk to at least High-risk, and arrest
// pushes it to Critical.

const ANAESTHETIC_EVENTS = {
  'none': {
    label: 'No anaesthetic event',
    severity: 'none'
  },
  'failed-intubation': {
    label: 'Failed intubation',
    severity: 'high'
  },
  'awareness': {
    label: 'Awareness under anaesthesia',
    severity: 'high'
  },
  'anaphylaxis': {
    label: 'Anaphylaxis',
    severity: 'high'
  },
  'malignant-hyperthermia': {
    label: 'Malignant hyperthermia',
    severity: 'critical'
  },
  'sux-apnoea': {
    label: 'Suxamethonium apnoea',
    severity: 'high'
  },
  'aspiration': {
    label: 'Pulmonary aspiration',
    severity: 'high'
  },
  'dental-injury': {
    label: 'Dental injury',
    severity: 'low'
  },
  'hypotension': {
    label: 'Sustained intra-op hypotension',
    severity: 'low'
  },
  'other': {
    label: 'Other anaesthetic event',
    severity: 'low'
  }
};

/** Compose anaesthetic-event FiredRules. */
function applyAnaestheticEventRules(data) {
  const fired = [];
  const event = data.anaesthesia.anaestheticEvent;
  if (event && event !== 'none') {
    const meta = ANAESTHETIC_EVENTS[event] || { label: event, severity: 'low' };
    fired.push({
      ruleId: `R-AE-${event}`,
      instrument: 'anaesthetic-event',
      grade: meta.severity,
      category: 'anaesthetic-event',
      description: meta.label
    });
  }

  if (data.safety.intraOpArrest === 'yes') {
    fired.push({
      ruleId: 'R-AE-intra-op-arrest',
      instrument: 'anaesthetic-event',
      grade: 'critical',
      category: 'anaesthetic-event',
      description: 'Intra-operative cardiac or respiratory arrest'
    });
  }

  return fired;
}

export { ANAESTHETIC_EVENTS, applyAnaestheticEventRules };
