// PAR-Q+ (Physical Activity Readiness Questionnaire for Everyone), 2011
// revision, PAR-Q+ Collaboration / CSEP. Ports
// front-end-with-svelte/src/lib/engine/parq-rules.ts line for line. See
// doc/parq-plus-and-auditc.md for the full instrument reference and rule IDs.

/** The 7 PAR-Q+ general health items, in instrument order. */
function parqItems(data) {
  const p = data.parq;
  return [
    p.parqDiagnosedHeartCondition,
    p.parqChestPainAtRest,
    p.parqChestPainDuringActivity,
    p.parqDizzinessOrLossOfConsciousness,
    p.parqOtherChronicMedicalCondition,
    p.parqPrescribedMedicationForChronicCondition,
    p.parqBoneOrJointProblem
  ];
}

/**
 * PAR-Q+ clearance: 'cleared' when all 7 items are answered 'no'.
 * 'further-assessment-required' when any item is 'yes'. '' when the screen
 * has not been started.
 */
function computeParqPlusClearance(data) {
  const items = parqItems(data);
  if (items.every((v) => v === '')) return '';
  if (items.some((v) => v === 'yes')) return 'further-assessment-required';
  if (items.every((v) => v === 'no')) return 'cleared';
  return '';
}

/** Fired-rule audit trail for the PAR-Q+ screen. */
function evaluateParqPlus(data) {
  const clearance = computeParqPlusClearance(data);
  if (!clearance) return [];
  return [
    {
      ruleId: 'R-PARQ-CLEARANCE',
      instrument: 'parq-plus',
      component: 'PAR-Q+ general health screen',
      score: null,
      band: clearance,
      category: 'parq-plus-clearance',
      description:
        clearance === 'cleared'
          ? 'All 7 PAR-Q+ general health items are no: cleared for general physical activity.'
          : 'At least one PAR-Q+ general health item is yes: further assessment required before starting.'
    }
  ];
}

export { parqItems, computeParqPlusClearance, evaluateParqPlus };
