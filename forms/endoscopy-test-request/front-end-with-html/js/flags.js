// Safety-flag detection for the Endoscopy Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: acute-gi-bleed, suspected-cancer-2ww,
// high-bleeding-risk-anticoag, asa-iv, unfit-for-prep, infection-precaution,
// missing-indication, missing-clinical-question, missing-fit, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.EndoscopyTestRequest`.

const LOWER_GI_INDICATIONS = [
  'rectal-bleeding', 'change-in-bowel-habit', 'positive-fit',
  'ibd-surveillance', 'polyp-surveillance'
];

const HIGH_RISK_PROCEDURES = ['ercp', 'eus'];

/**
 * Detect safety flags for a GI endoscopy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 *   ({ twoWeekWaitEligible, twoWeekWaitRationale, riskBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Acute red flags -----------------------------------------------
  if (data.redFlags.redFlagGiBleeding === true) {
    flags.push({
      flagId: 'F-ACUTE-GI-BLEED-001',
      category: 'acute-gi-bleed',
      priority: 'high',
      description: 'Active gastrointestinal bleeding reported.',
      suggestedAction: 'Assess haemodynamics and resuscitate; arrange urgent inpatient endoscopy (OGD within 24 hours for upper-GI bleeding).'
    });
  }

  // --- Suspected-cancer two-week-wait --------------------------------
  if (ctx.twoWeekWaitEligible === true) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: ctx.twoWeekWaitRationale && ctx.twoWeekWaitRationale.trim() !== ''
        ? ctx.twoWeekWaitRationale.trim()
        : 'Suspected-cancer two-week-wait criteria met (NICE NG12 / DG56).',
      suggestedAction: 'Book on the suspected-cancer two-week-wait pathway; perform the endoscopy within 14 days.'
    });
  }

  // --- High bleeding risk on anticoagulant / antiplatelet ------------
  const highProcedure = HIGH_RISK_PROCEDURES.includes(data.request.requestedProcedure);
  if (
    (data.medication.takingAnticoagulant === true && (highProcedure || ctx.riskBand === 'high')) ||
    (data.medication.takingAntiplatelet === true && highProcedure &&
      data.medication.antiplateletAgent !== '' && data.medication.antiplateletAgent !== 'none' && data.medication.antiplateletAgent !== 'aspirin')
  ) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: 'Anticoagulant / antiplatelet therapy with a high-bleeding-risk procedure.',
      suggestedAction: 'Plan peri-procedure anticoagulation per BSG/ESGE; confirm thrombotic risk and bridging need before booking.'
    });
  }

  // --- ASA IV / V ----------------------------------------------------
  if (data.comorbidities.asaGrade === 'IV' || data.comorbidities.asaGrade === 'V') {
    flags.push({
      flagId: 'F-ASA-IV-001',
      category: 'asa-iv',
      priority: 'high',
      description: `ASA physical-status grade ${data.comorbidities.asaGrade}.`,
      suggestedAction: 'Consultant anaesthetic / sedation review; consider procedure in a setting with full resuscitation support.'
    });
  }

  // --- Unfit for bowel prep (lower-GI procedures) --------------------
  const lowerGiProcedure = ['colonoscopy', 'flexible-sigmoidoscopy'].includes(data.request.requestedProcedure);
  if (lowerGiProcedure && data.infectionPrep.fitForBowelPrep === false) {
    flags.push({
      flagId: 'F-UNFIT-FOR-PREP-001',
      category: 'unfit-for-prep',
      priority: 'medium',
      description: 'Patient not assessed as fit for bowel preparation for a lower-GI procedure.',
      suggestedAction: 'Review renal function, cardiac status, and frailty; consider modified prep or inpatient preparation.'
    });
  }

  // --- Infection precautions -----------------------------------------
  if (
    data.infectionPrep.vcjdRisk === true ||
    data.infectionPrep.cpeCarriage === true ||
    data.infectionPrep.mrsa === true ||
    data.infectionPrep.bloodBorneVirus === true
  ) {
    const precautions = [];
    if (data.infectionPrep.vcjdRisk) precautions.push('vCJD');
    if (data.infectionPrep.cpeCarriage) precautions.push('CPE');
    if (data.infectionPrep.mrsa) precautions.push('MRSA');
    if (data.infectionPrep.bloodBorneVirus) precautions.push('blood-borne virus');
    flags.push({
      flagId: 'F-INFECTION-PRECAUTION-001',
      category: 'infection-precaution',
      priority: 'medium',
      description: `Infection-control flag(s): ${precautions.join(', ')}.`,
      suggestedAction: 'Schedule at the end of the list; apply enhanced decontamination / single-use or quarantined instruments per local policy.'
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
      suggestedAction: 'Query the referrer for the specific question the procedure should answer.'
    });
  }
  if (
    LOWER_GI_INDICATIONS.includes(data.request.primaryIndication) &&
    (data.redFlags.fitResultUgG === null || data.redFlags.fitResultUgG === undefined || data.redFlags.fitResultUgG === '')
  ) {
    flags.push({
      flagId: 'F-MISSING-FIT-001',
      category: 'missing-fit',
      priority: 'low',
      description: 'Lower-GI indication without a FIT result.',
      suggestedAction: 'Request a FIT result (NICE DG56); FIT >= 10 ug/g triggers the colorectal-cancer pathway.'
    });
  }

  return flags;
}

export { detectFlags };
