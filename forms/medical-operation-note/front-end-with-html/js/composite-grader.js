// Composite grader for the medical operation note. Implements the
// max-grade algorithm: the worst finding sets the composite grade;
// Routine is the default when no rules fire.
//
// Mirrors the SvelteKit `src/lib/engine/composite-grader.ts`. Pure
// functions; public entry point is `calculateOperationGrade(data)`.

(function () {
'use strict';
window.MedicalOperationNote =
  window.MedicalOperationNote || {};
const NS = window.MedicalOperationNote;
const {
  maxCompositeRisk,
  clavienToCompositeRisk,
  eblToCompositeRisk,
  classifyBloodLoss,
  applyClavienDindoRules,
  applyBloodLossRules,
  applyCountRules,
  countsAgreed,
  applyNeverEventRules,
  hasNeverEvent,
  applyAnaestheticEventRules,
  ANAESTHETIC_EVENTS
} = NS;

/**
 * Compute the composite-risk band by folding every fired rule through
 * the max-grade algorithm.
 */
function computeCompositeRisk(data, firedRules) {
  let risk = 'routine';

  // Clavien-Dindo grade → composite-risk band
  const cd = data.safety.clavienDindoGrade;
  if (cd) risk = maxCompositeRisk(risk, clavienToCompositeRisk(cd));

  // EBL band → composite-risk band
  const ebl = data.safety.estimatedBloodLossMl;
  if (ebl !== null && ebl !== undefined) {
    risk = maxCompositeRisk(risk, eblToCompositeRisk(classifyBloodLoss(ebl)));
  }

  // Count discrepancy → at least High-risk
  if (!countsAgreed(data)) {
    risk = maxCompositeRisk(risk, 'high-risk');
  }

  // Never event / retained item → Critical
  if (hasNeverEvent(data)) {
    risk = maxCompositeRisk(risk, 'critical');
  }

  // Conversion to open → at least Complicated
  if (data.safety.conversionToOpen === 'yes') {
    risk = maxCompositeRisk(risk, 'complicated');
  }

  // Intra-op arrest → Critical
  if (data.safety.intraOpArrest === 'yes') {
    risk = maxCompositeRisk(risk, 'critical');
  }

  // Massive transfusion (≥ 4 units PRBC or MHP activated) → High-risk
  const prbc = Number(data.safety.transfusionPrbcUnits) || 0;
  if (prbc >= 4 || data.safety.massiveHaemorrhageProtocolActivated === 'yes') {
    risk = maxCompositeRisk(risk, 'high-risk');
  }

  // Unplanned step-up to ICU / HDU → at least High-risk
  if (isUnplannedStepUp(data)) {
    risk = maxCompositeRisk(risk, 'high-risk');
  }

  // Severe / critical anaesthetic events
  const ae = data.anaesthesia.anaestheticEvent;
  if (ae && ae !== 'none') {
    const sev = (ANAESTHETIC_EVENTS[ae] || {}).severity || 'low';
    if (sev === 'critical') risk = maxCompositeRisk(risk, 'critical');
    else if (sev === 'high') risk = maxCompositeRisk(risk, 'high-risk');
  }

  // ASA carry-over context: V or VI alone pushes to Critical, IV to High
  const asa = data.summary.asaPhysicalStatus;
  if (asa === 5 || asa === 6) risk = maxCompositeRisk(risk, 'critical');
  else if (asa === 4) risk = maxCompositeRisk(risk, 'high-risk');

  // Any fired rule whose grade reads 'critical' / 'high-risk' / etc.
  for (const r of firedRules) {
    if (r.grade === 'critical') risk = maxCompositeRisk(risk, 'critical');
    else if (r.grade === 'high-risk') risk = maxCompositeRisk(risk, 'high-risk');
  }

  return risk;
}

/**
 * True when the actual recovery destination is a step-up from the
 * pre-op plan (e.g. planned PACU but ended up in ICU).
 */
function isUnplannedStepUp(data) {
  const order = ['day-case', 'ward', 'pacu', 'enhanced-care', 'hdu', 'icu'];
  const planned = order.indexOf(data.postOp.preOpPlannedDestination);
  const actual = order.indexOf(data.postOp.recoveryDestination);
  if (planned < 0 || actual < 0) return false;
  return actual > planned;
}

/**
 * Public entry point. Returns the full GradingResult mirroring the
 * SvelteKit `calculateOperationGrade()` shape.
 */
function calculateOperationGrade(data) {
  const clavienFired = applyClavienDindoRules(data);
  const bloodLossFired = applyBloodLossRules(data);
  const countFired = applyCountRules(data);
  const neverEventFired = applyNeverEventRules(data);
  const anaestheticFired = applyAnaestheticEventRules(data);

  const firedRules = [
    ...clavienFired,
    ...bloodLossFired,
    ...countFired,
    ...neverEventFired,
    ...anaestheticFired
  ];

  let compositeRisk = computeCompositeRisk(data, firedRules);

  // Surgeon override (step 12) — both computed and final stored
  const computedCompositeRisk = compositeRisk;
  const surgeonOverride = data.summary.surgeonOverrideGrade;
  if (surgeonOverride) compositeRisk = surgeonOverride;

  const additionalFlags = NS.detectAdditionalFlags
    ? NS.detectAdditionalFlags(data)
    : [];

  return {
    compositeRisk,
    computedCompositeRisk,
    surgeonOverride: surgeonOverride || null,
    surgeonOverrideReason: data.summary.surgeonOverrideReason || '',
    clavienDindoGrade: data.safety.clavienDindoGrade || '0',
    asaPhysicalStatus: data.summary.asaPhysicalStatus,
    bloodLossBand: classifyBloodLoss(data.safety.estimatedBloodLossMl),
    estimatedBloodLossMl: data.safety.estimatedBloodLossMl,
    countsAgreed: countsAgreed(data),
    firedRules,
    additionalFlags
  };
}

Object.assign(NS, {
  computeCompositeRisk,
  isUnplannedStepUp,
  calculateOperationGrade
});
})();
