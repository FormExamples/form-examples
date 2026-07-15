// Flagged-issue detection (clinical flags). Independent of the completeness
// status (which the grader produces), this module raises clinician-facing flags
// per spec §5, each with a priority:
//
//   - STOMP — psychotropic without clear indication or review (high)
//   - No Health Action Plan (high)
//   - Unaddressed physical-health issue (high)
//   - Dysphagia / choking risk (high)
//   - Constipation risk (medium)
//   - Missing screening uptake (medium)
//   - Reasonable adjustments not recorded (medium)
//   - Incomplete check (low)
//
// Categories mirror the `learning_disability_annual_health_check_grade_flag`
// SQL CHECK constraint (stomp, no-health-action-plan, unaddressed-physical-health,
// dysphagia-risk, constipation-risk, missing-screening-uptake,
// reasonable-adjustments-not-recorded, incomplete, other).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * Detect the clinical flags raised by the annual-health-check findings.
 *
 * @param {AssessmentData} data
 * @param {{ status: 'complete' | 'incomplete' }} [grade]  - completeness grade;
 *        the `incomplete` flag fires when `grade.status === 'incomplete'`.
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const adj = data.adjustments;
  const ph = data.physical;
  const sc = data.screening;
  const med = data.medication;
  const plan = data.plan;

  // ─── STOMP — psychotropic without clear indication or review (HIGH) ───
  // Fires when a psychotropic is prescribed AND any of: no documented
  // indication, STOMP not discussed, or no last-review date (spec §5).
  if (med.psychotropicPrescribed === 'yes') {
    const noIndication = med.psychotropicIndication.trim() === '';
    const notDiscussed = med.stompDiscussed === 'no';
    const noReviewDate =
      med.psychotropicLastReviewed === '' ||
      med.psychotropicLastReviewed === null ||
      med.psychotropicLastReviewed === undefined;
    if (noIndication || notDiscussed || noReviewDate) {
      const reasons = [];
      if (noIndication) reasons.push('no documented indication');
      if (notDiscussed) reasons.push('STOMP not discussed');
      if (noReviewDate) reasons.push('no last-review date');
      flags.push({
        id: 'F-STOMP-001',
        category: 'stomp',
        priority: 'high',
        description: `Psychotropic medicine prescribed with ${reasons.join(', ')}`,
        suggestedAction:
          'Undertake a medication review under STOMP: confirm the indication, discuss stopping or reducing over-medication with the person and carer, and record a review date.'
      });
    }
  }

  // ─── No Health Action Plan (HIGH) ─────────────────────────────
  if (plan.healthActionPlanProduced !== 'yes') {
    flags.push({
      id: 'F-NO-HEALTH-ACTION-PLAN-001',
      category: 'no-health-action-plan',
      priority: 'high',
      description:
        'The check recorded findings but no Health Action Plan was produced',
      suggestedAction:
        'Produce a Health Action Plan collating the actions from this check and share a copy the person can keep.'
    });
  }

  // ─── Unaddressed physical-health issue (HIGH) ─────────────────
  // Any physical-health component records a problem but no action was recorded.
  const physicalProblems = [];
  if (ph.bloodPressureStatus === 'raised') physicalProblems.push('raised blood pressure');
  if (ph.epilepsyStatus === 'not-reviewed') physicalProblems.push('epilepsy not reviewed');
  if (ph.constipationStatus === 'present') physicalProblems.push('constipation');
  if (ph.dysphagiaStatus === 'present') physicalProblems.push('dysphagia');
  if (ph.continenceStatus === 'issue') physicalProblems.push('continence issue');
  if (ph.mobilityFallsStatus === 'issue') physicalProblems.push('mobility / falls issue');
  if (ph.dentalStatus === 'issue') physicalProblems.push('dental issue');
  if (ph.visionStatus === 'issue') physicalProblems.push('vision issue');
  if (ph.hearingStatus === 'issue') physicalProblems.push('hearing issue');
  if (ph.footHealthStatus === 'issue') physicalProblems.push('foot-health issue');
  if (ph.skinStatus === 'issue') physicalProblems.push('skin issue');
  if (physicalProblems.length > 0 && ph.physicalHealthActions.trim() === '') {
    flags.push({
      id: 'F-UNADDRESSED-PHYSICAL-HEALTH-001',
      category: 'unaddressed-physical-health',
      priority: 'high',
      description: `Physical-health problem(s) recorded without any action: ${physicalProblems.join(', ')}`,
      suggestedAction:
        'Record a clear action for each physical-health problem and add it to the Health Action Plan.'
    });
  }

  // ─── Dysphagia / choking risk (HIGH) ──────────────────────────
  if (ph.dysphagiaStatus === 'present') {
    flags.push({
      id: 'F-DYSPHAGIA-RISK-001',
      category: 'dysphagia-risk',
      priority: 'high',
      description: 'Swallowing difficulty (dysphagia) recorded — choking / aspiration risk',
      suggestedAction:
        'Refer for a swallowing (SALT) assessment and provide eating and drinking guidance to the person and carers.'
    });
  }

  // ─── Constipation risk (MEDIUM) ───────────────────────────────
  if (ph.constipationStatus === 'present') {
    flags.push({
      id: 'F-CONSTIPATION-RISK-001',
      category: 'constipation-risk',
      priority: 'medium',
      description:
        'Constipation recorded — a serious risk for people with a learning disability, especially with psychotropic or anticholinergic medicines',
      suggestedAction:
        'Assess bowel health, review contributing medicines, and start a management plan with monitoring.'
    });
  }

  // ─── Missing screening uptake (MEDIUM) ────────────────────────
  if (sc.cancerScreeningStatus === 'not-recorded' || sc.immunisationStatus === 'not-recorded') {
    const missing = [];
    if (sc.cancerScreeningStatus === 'not-recorded') missing.push('cancer screening');
    if (sc.immunisationStatus === 'not-recorded') missing.push('immunisations');
    flags.push({
      id: 'F-MISSING-SCREENING-UPTAKE-001',
      category: 'missing-screening-uptake',
      priority: 'medium',
      description: `Uptake not recorded for: ${missing.join(', ')}`,
      suggestedAction:
        'Record whether each eligible screen or immunisation is up to date, declined with a reason, or not eligible.'
    });
  }

  // ─── Reasonable adjustments not recorded (MEDIUM) ─────────────
  if (adj.reasonableAdjustmentsRecorded === 'no' || adj.communicationNeeds.trim() === '') {
    flags.push({
      id: 'F-REASONABLE-ADJUSTMENTS-NOT-RECORDED-001',
      category: 'reasonable-adjustments-not-recorded',
      priority: 'medium',
      description:
        'No reasonable adjustments or communication needs captured, contrary to the Accessible Information Standard',
      suggestedAction:
        'Record the person’s communication needs and the reasonable adjustments the practice will make.'
    });
  }

  // ─── Incomplete check (LOW) ───────────────────────────────────
  if (grade && grade.status === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'One or more required components was not completed, or no Health Action Plan was produced — the check is incomplete',
      suggestedAction:
        'Complete the outstanding components and produce the Health Action Plan so the annual health check is whole.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
