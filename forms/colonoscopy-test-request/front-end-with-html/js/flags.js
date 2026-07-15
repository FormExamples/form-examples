// Safety-flag detection for the Colonoscopy Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, high-bleeding-risk-anticoag,
// unfit-for-prep, asa-iv, missing-fit, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a colonoscopy request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 *   ({ twoWeekWaitEligible, twoWeekWaitRationale })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Suspected cancer (two-week-wait) ------------------------------
  if (ctx.twoWeekWaitEligible === true) {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: ctx.twoWeekWaitRationale ||
        'Request meets NICE NG12 / DG56 suspected-cancer two-week-wait criteria.',
      suggestedAction: 'Book on the suspected-cancer two-week-wait pathway; ensure the patient is informed and tracked.'
    });
  }

  // --- High bleeding risk on anticoagulant ---------------------------
  if (data.medication.takingAnticoagulant === true) {
    flags.push({
      flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
      category: 'high-bleeding-risk-anticoag',
      priority: 'high',
      description: data.medication.anticoagulantAgent
        ? `Patient is taking an anticoagulant (${data.medication.anticoagulantAgent}).`
        : 'Patient is taking an anticoagulant.',
      suggestedAction: 'Plan periprocedural anticoagulant management per BSG / ESGE before booking a high-risk lower-GI procedure.'
    });
  }

  // --- Unfit for bowel preparation -----------------------------------
  if (data.fitness.fitForBowelPrep === false) {
    flags.push({
      flagId: 'F-UNFIT-FOR-PREP-001',
      category: 'unfit-for-prep',
      priority: 'medium',
      description: 'Patient is not assessed as fit to take bowel preparation.',
      suggestedAction: 'Confirm bowel-prep fitness; consider CT colonography or an adjusted regimen for frail / renal-impaired patients.'
    });
  }

  // --- ASA IV (or V) -------------------------------------------------
  if (data.fitness.asaGrade === 'IV' || data.fitness.asaGrade === 'V') {
    flags.push({
      flagId: 'F-ASA-IV-001',
      category: 'asa-iv',
      priority: 'high',
      description: `ASA physical-status grade ${data.fitness.asaGrade} — severe systemic disease.`,
      suggestedAction: 'Seek senior / anaesthetic review before sedation; consider an alternative or deferred procedure.'
    });
  }

  // --- Missing FIT ---------------------------------------------------
  if (!fitRecorded(data) && fitExpected(data)) {
    flags.push({
      flagId: 'F-MISSING-FIT-001',
      category: 'missing-fit',
      priority: 'medium',
      description: 'No FIT result recorded for a symptomatic lower-GI referral.',
      suggestedAction: 'Request a quantitative FIT to guide the colorectal-cancer pathway (NICE DG56).'
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

  return flags;
}

/** True when a FIT result has been recorded. */
function fitRecorded(d) {
  return (
    d.redFlags.fitResultUgG !== null &&
    d.redFlags.fitResultUgG !== undefined &&
    d.redFlags.fitResultUgG !== ''
  );
}

/**
 * True when a FIT result would normally be expected — symptomatic lower-GI
 * indications where FIT triages the cancer pathway.
 */
function fitExpected(d) {
  const ind = d.request.primaryIndication;
  const symptomatic = [
    'rectal-bleeding',
    'change-in-bowel-habit',
    'iron-deficiency-anaemia',
    'positive-fit',
    'chronic-diarrhoea',
    'abdominal-mass'
  ];
  if (symptomatic.includes(ind)) return true;
  return d.redFlags.weightLoss || d.redFlags.anaemia ||
    d.redFlags.abdominalMass || d.redFlags.rectalBleeding;
}

export { detectFlags };
