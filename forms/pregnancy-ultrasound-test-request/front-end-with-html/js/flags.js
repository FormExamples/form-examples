// Safety-flag detection for the Pregnancy Ultrasound Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-ectopic, heavy-bleeding, severe-pain,
// haemodynamic-instability, reduced-fetal-movements, suspected-praevia,
// suspected-severe-fgr, pre-eclampsia, missing-indication,
// missing-clinical-question, window-mismatch, incomplete-dating.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.PregnancyUltrasoundTestRequest`.

/**
 * Detect safety flags for an obstetric ultrasound request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ windowFit })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Red-flag symptom categories -----------------------------------
  if (data.symptoms.suspectedEctopic === true) {
    flags.push({
      flagId: 'F-SUSPECTED-ECTOPIC-001',
      category: 'suspected-ectopic',
      priority: 'high',
      description: 'Ectopic pregnancy is suspected.',
      suggestedAction: 'Arrange same-day emergency assessment in EPAU; do not delay for routine booking.'
    });
  }
  if (data.symptoms.haemodynamicallyUnstable === true) {
    flags.push({
      flagId: 'F-HAEMODYNAMIC-INSTABILITY-001',
      category: 'haemodynamic-instability',
      priority: 'high',
      description: 'Patient is haemodynamically unstable.',
      suggestedAction: 'Immediate clinical review and resuscitation; emergency scan alongside obstetric / gynaecology team.'
    });
  }
  if (data.symptoms.vaginalBleeding === 'heavy') {
    flags.push({
      flagId: 'F-HEAVY-BLEEDING-001',
      category: 'heavy-bleeding',
      priority: 'high',
      description: 'Heavy vaginal bleeding reported.',
      suggestedAction: 'Urgent assessment; exclude miscarriage, ectopic, and antepartum haemorrhage.'
    });
  }
  if (data.symptoms.abdominalPain === 'severe') {
    flags.push({
      flagId: 'F-SEVERE-PAIN-001',
      category: 'severe-pain',
      priority: 'high',
      description: 'Severe abdominal pain reported.',
      suggestedAction: 'Urgent assessment; exclude ectopic, abruption, and surgical causes.'
    });
  }
  if (data.symptoms.reducedFetalMovements === true) {
    flags.push({
      flagId: 'F-REDUCED-FETAL-MOVEMENTS-001',
      category: 'reduced-fetal-movements',
      priority: 'high',
      description: 'Reduced fetal movements reported.',
      suggestedAction: 'Urgent assessment per RCOG GTG 57; CTG if viable gestation and growth / wellbeing scan.'
    });
  }

  // --- Pattern-based clinical concerns -------------------------------
  if (
    data.symptoms.vaginalBleeding === 'heavy' &&
    (data.request.primaryIndication === 'antepartum-haemorrhage' ||
      data.request.requestedScanType === 'placental-location')
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-PRAEVIA-001',
      category: 'suspected-praevia',
      priority: 'high',
      description: 'Antepartum haemorrhage with placental-location query — possible placenta praevia.',
      suggestedAction: 'Avoid digital vaginal examination until praevia excluded; confirm placental site.'
    });
  }
  if (
    data.request.primaryIndication === 'growth-restriction' &&
    (data.riskFactors.previousGrowthRestriction === true ||
      data.symptoms.reducedFetalMovements === true)
  ) {
    flags.push({
      flagId: 'F-SUSPECTED-SEVERE-FGR-001',
      category: 'suspected-severe-fgr',
      priority: 'medium',
      description: 'Growth-restriction indication with additional risk factors.',
      suggestedAction: 'Prioritise growth + umbilical-artery Doppler; consider fetal-medicine referral.'
    });
  }
  if (
    data.riskFactors.hypertension === true &&
    (data.request.primaryIndication === 'maternal-condition' ||
      data.request.primaryIndication === 'growth-restriction')
  ) {
    flags.push({
      flagId: 'F-PRE-ECLAMPSIA-001',
      category: 'pre-eclampsia',
      priority: 'medium',
      description: 'Maternal hypertension with a growth / maternal-condition indication.',
      suggestedAction: 'Assess for pre-eclampsia; include growth, liquor, and Doppler surveillance.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the scan should answer.'
    });
  }
  if (ctx.windowFit === 'outside-window') {
    flags.push({
      flagId: 'F-WINDOW-MISMATCH-001',
      category: 'window-mismatch',
      priority: 'medium',
      description: 'Requested scan type does not fit the gestational-age window.',
      suggestedAction: ctx.recommendedScanType
        ? `Consider redirecting to a ${ctx.recommendedScanType} scan for this gestation.`
        : 'Confirm the requested scan type is appropriate for this gestation.'
    });
  }
  if (datingIncomplete(data)) {
    flags.push({
      flagId: 'F-INCOMPLETE-DATING-001',
      category: 'incomplete-dating',
      priority: 'low',
      description: 'Pregnancy dating is incomplete (no gestational age, LMP, or EDD).',
      suggestedAction: 'Confirm dating; many scan windows depend on accurate gestational age.'
    });
  }

  return flags;
}

function datingIncomplete(d) {
  const hasGa =
    d.dating.gestationalAgeWeeks !== null &&
    d.dating.gestationalAgeWeeks !== undefined &&
    d.dating.gestationalAgeWeeks !== '';
  const hasLmp = !!d.dating.lastMenstrualPeriodDate;
  const hasEdd = !!d.dating.estimatedDueDate;
  return !hasGa && !hasLmp && !hasEdd;
}

export { detectFlags };
