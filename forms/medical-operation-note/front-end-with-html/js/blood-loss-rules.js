// Estimated-blood-loss (EBL) banding rules. Mirrors the SvelteKit
// `src/lib/engine/blood-loss-rules.ts`. Pure functions.
//
// Bands (from the form's index.md):
//   minimal  ≤ 100   mL
//   mild     101-500 mL
//   moderate 501-1500 mL
//   severe   1501-3000 mL
//   massive  > 3000 mL

/** Classify an EBL value (mL) into a band; null → 'minimal'. */
function classifyBloodLoss(ml) {
  const v = Number(ml);
  if (ml === null || ml === undefined || Number.isNaN(v)) return 'minimal';
  if (v <= 100) return 'minimal';
  if (v <= 500) return 'mild';
  if (v <= 1500) return 'moderate';
  if (v <= 3000) return 'severe';
  return 'massive';
}

/**
 * Surface the EBL band as a fired rule (when EBL has been entered).
 * The band itself drives the composite risk via `eblToCompositeRisk`.
 */
function applyBloodLossRules(data) {
  const ml = data.safety.estimatedBloodLossMl;
  if (ml === null || ml === undefined) return [];
  const band = classifyBloodLoss(ml);
  return [{
    ruleId: `R-EBL-${band}`,
    instrument: 'blood-loss',
    grade: band,
    category: 'haemorrhage',
    description: `Estimated blood loss ${ml} mL — band: ${band}`
  }];
}

export { classifyBloodLoss, applyBloodLossRules };
