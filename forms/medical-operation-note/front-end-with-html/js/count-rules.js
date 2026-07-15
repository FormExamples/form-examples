// Swab / needle / instrument count rules. Mirrors the SvelteKit
// `src/lib/engine/count-rules.ts`. Pure functions.
//
// Any unresolved discrepancy raises composite risk to at least
// High-risk (the canonical scoring table); a declared retained item is
// handled in `never-event-rules.js` and pushes the grade to Critical.

const COUNT_CHECKS = [
  {
    id: 'swab',
    label: 'Swab count',
    firstField: 'swabCountFirst',
    finalField: 'swabCountFinal',
    agreedField: 'swabCountAgreed'
  },
  {
    id: 'needle',
    label: 'Needle count',
    firstField: 'needleCountFirst',
    finalField: 'needleCountFinal',
    agreedField: 'needleCountAgreed'
  },
  {
    id: 'instrument',
    label: 'Instrument count',
    firstField: 'instrumentCountFirst',
    finalField: 'instrumentCountFinal',
    agreedField: 'instrumentCountAgreed'
  }
];

/** True when every entered count is explicitly agreed (or no counts entered). */
function countsAgreed(data) {
  for (const c of COUNT_CHECKS) {
    const agreed = data.safety[c.agreedField];
    if (agreed === 'no') return false;
  }
  return true;
}

/** Compose count-related FiredRules. */
function applyCountRules(data) {
  const fired = [];
  for (const c of COUNT_CHECKS) {
    const first = data.safety[c.firstField];
    const final = data.safety[c.finalField];
    const agreed = data.safety[c.agreedField];

    if (agreed === 'no') {
      fired.push({
        ruleId: `R-COUNT-${c.id}-disagreed`,
        instrument: 'count',
        grade: 'discrepancy',
        category: 'count',
        description: `${c.label} not agreed at sign-out (first=${first ?? '—'}, final=${final ?? '—'})`
      });
    } else if (first !== null && final !== null && Number(first) !== Number(final)) {
      // Numeric mismatch even though "agreed" wasn't set to 'no'.
      fired.push({
        ruleId: `R-COUNT-${c.id}-mismatch`,
        instrument: 'count',
        grade: 'mismatch',
        category: 'count',
        description: `${c.label} numeric mismatch (first=${first}, final=${final})`
      });
    }
  }
  return fired;
}

export { COUNT_CHECKS, countsAgreed, applyCountRules };
