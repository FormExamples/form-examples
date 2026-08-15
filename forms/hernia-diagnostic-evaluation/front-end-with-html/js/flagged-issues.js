// Safety-flag detection.
//
// Plain-JavaScript port of
// ../front-end-with-svelte/src/lib/engine/flagged-issues.ts — same flag IDs,
// same categories, same priorities.
//
// Flags fire independently of the urgency band and are never suppressed by a
// clinician override of the urgency band — see ../../doc/safety-case-notes.md
// hazard H-01. Flag IDs are stable and identical across every front-end and
// the back-end.

/**
 * Detect safety flags for a hernia diagnostic evaluation, most severe first.
 * @param {import('./types.js').HerniaDiagnosticEvaluation} data
 * @param {{ reducibility: ReturnType<typeof import('./classification-rules.js').assessReducibility>, redFlag: ReturnType<typeof import('./classification-rules.js').screenRedFlags>, age: number|null }} context
 * @returns {import('./types.js').AdditionalFlag[]}
 */
function detectFlags(data, context) {
  const flags = [];
  const push = (flagId, category, priority, description, suggestedAction) =>
    flags.push({ flagId, category, priority, description, suggestedAction });

  const { reducibility, redFlag, age } = context;

  // --- Strangulation / incarceration ---------------------------------------
  if (reducibility.status === 'irreducible' || reducibility.status === 'incarcerated') {
    if (redFlag.anyRedFlag) {
      push(
        'F-STRANGULATION-SUSPECTED-001',
        'strangulation-suspected',
        'high',
        `The hernia is ${reducibility.status} with ${redFlag.positiveFlags.join(', ')}.`,
        'Refer for emergency surgical assessment today; keep the patient nil by mouth and start intravenous fluids pending review.'
      );
    } else {
      push(
        'F-INCARCERATION-RISK-001',
        'incarceration-risk',
        'high',
        `The hernia is ${reducibility.status} with no red-flag symptoms currently present.`,
        'Attempt gentle reduction only per local protocol, and arrange urgent surgical review the same day; safety-net the patient to return immediately if pain, vomiting, or fever develop.'
      );
    }
  }

  // --- Emergency referral ----------------------------------------------------
  if (redFlag.anyRedFlag) {
    push(
      'F-EMERGENCY-SURGICAL-REFERRAL-001',
      'emergency-surgical-referral',
      'high',
      `Red-flag symptom screen positive: ${redFlag.positiveFlags.join(', ')}.`,
      'Refer immediately for emergency surgical assessment; do not delay for outpatient imaging.'
    );
  }

  // --- Atypical presentation / occult hernia ----------------------------------
  const examInconclusive =
    data.palpation.palpableMass !== 'yes' || data.palpation.coughImpulsePositive !== 'yes';
  const imagingRequested =
    data.imaging.ultrasoundPerformed === 'yes' ||
    data.imaging.ctPerformed === 'yes' ||
    data.imaging.mriPerformed === 'yes';
  const imagingInconclusive =
    (data.imaging.ultrasoundPerformed === 'yes' && data.imaging.ultrasoundFindings === 'inconclusive') ||
    (data.imaging.ctPerformed === 'yes' && data.imaging.ctFindings === 'inconclusive') ||
    (data.imaging.mriPerformed === 'yes' && data.imaging.mriFindings === 'inconclusive');

  if (imagingRequested && imagingInconclusive) {
    push(
      'F-ATYPICAL-PRESENTATION-001',
      'atypical-presentation',
      'medium',
      'Imaging remains inconclusive after an atypical or inconclusive examination.',
      'Consider a second imaging modality or a specialist surgical opinion; reassess if symptoms change.'
    );
  } else if (
    !imagingRequested &&
    examInconclusive &&
    (data.history.painScore0To10 !== null || data.inspection.bulgeVisibleAtRest === 'yes')
  ) {
    push(
      'F-OCCULT-HERNIA-SUSPECTED-001',
      'occult-hernia-suspected',
      'medium',
      'Clinical suspicion of a hernia with a negative or inconclusive examination, and imaging not yet performed.',
      'Arrange dynamic ultrasound (or MRI/CT if ultrasound is unavailable or inconclusive) to confirm an occult hernia before discharge.'
    );
  }

  // --- Recurrence -------------------------------------------------------------
  if (data.history.priorHerniaRepair === 'yes' && String(data.history.priorHerniaRepairSite || '').trim() !== '') {
    push(
      'F-RECURRENT-HERNIA-001',
      'recurrent-hernia',
      'medium',
      `A prior hernia repair is recorded at ${data.history.priorHerniaRepairSite}.`,
      'Note the recurrence and the mesh status in the referral; recurrent repairs are technically more complex and may need a specialist hernia service.'
    );
  }

  // --- Life stage ---------------------------------------------------------------
  if (age !== null && age < 16) {
    push(
      'F-PAEDIATRIC-001',
      'paediatric',
      'high',
      `The patient is ${age} years old.`,
      'Refer to a paediatric surgical service; examination technique and the threshold for repair differ from adult practice.'
    );
  }
  if (data.riskFactors.riskPregnancy === 'yes') {
    push(
      'F-PREGNANCY-001',
      'pregnancy',
      'medium',
      'The patient is pregnant.',
      'Favour conservative management where safe, and involve obstetric and surgical teams jointly when repair or emergency assessment is needed.'
    );
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export { detectFlags };
