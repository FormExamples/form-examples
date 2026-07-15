// Flagged-issue detection (red flags). Emitted independently of the risk tier
// (which the grader derives), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Immediate safety / crisis referral (high) — riskTier == 'high'
//   - Active plan and intent (high)             — activeIdeationPlan == 'yes' (level 5)
//   - Recent suicide attempt (high)             — actualAttempt within 3 months
//   - High-lethality attempt (high)             — actual >= 3 or potential == 2
//   - Access to lethal means (high)             — accessToLethalMeans == 'yes'
//   - Safety plan needed (medium)               — riskTier != 'low'
//   - Recent preparatory acts (medium)          — preparatoryActs == 'yes'
//   - Non-suicidal self-injury (medium)         — nonSuicidalSelfInjury == 'yes'
//   - Incomplete assessment (low)               — required ideation/behaviour fields missing
//
// Rows here mirror the `columbia_suicide_severity_rating_scale_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {{ ideationLevel: number, suicidalBehaviourPresent: boolean,
 *           recentBehaviour: boolean, highLethality: boolean,
 *           riskTier: ('low'|'moderate'|'high') }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const ide = data.ideation;
  const beh = data.behaviour;
  const let_ = data.lethality;
  const means = data.means;
  const recent = beh.behaviourRecency === 'within-3-months';

  // ─── Immediate safety / crisis referral (HIGH) ──────────────
  if (grade.riskTier === 'high') {
    flags.push({
      id: 'F-CRISIS-RESPONSE-001',
      category: 'immediate-safety-crisis-response',
      priority: 'high',
      description:
        'High-risk screen — urgent psychiatric or crisis-service response indicated.',
      suggestedAction:
        'Do not leave the person alone. Ensure immediate safety, restrict access to lethal means, and arrange an emergency mental-health evaluation per local protocol.'
    });
  }

  // ─── Active plan and intent (HIGH) ──────────────────────────
  if (ide.activeIdeationPlan === 'yes') {
    flags.push({
      id: 'F-ACTIVE-PLAN-INTENT-001',
      category: 'active-plan-and-intent',
      priority: 'high',
      description:
        'Active suicidal ideation with a specific plan and intent to act (ideation level 5).',
      suggestedAction:
        'Treat as an acute risk. Ensure constant observation and immediate specialist review.'
    });
  }

  // ─── Recent suicide attempt (HIGH) ──────────────────────────
  if (beh.actualAttempt === 'yes' && recent) {
    flags.push({
      id: 'F-RECENT-ATTEMPT-001',
      category: 'recent-attempt',
      priority: 'high',
      description:
        'An actual suicide attempt within the past 3 months — a strong predictor of further attempts.',
      suggestedAction:
        'Arrange urgent psychiatric assessment; review means access and precipitating factors.'
    });
  }

  // ─── High-lethality attempt (HIGH) ──────────────────────────
  if (grade.highLethality) {
    const detail =
      let_.actualLethality !== null && let_.actualLethality >= 3
        ? `actual lethality ${let_.actualLethality} (significant medical damage)`
        : 'potential lethality 2 (the attempt could plausibly have caused death)';
    flags.push({
      id: 'F-HIGH-LETHALITY-001',
      category: 'high-lethality-attempt',
      priority: 'high',
      description: `High-lethality attempt — ${detail}.`,
      suggestedAction:
        'Ensure medical stabilisation and urgent specialist psychiatric evaluation; escalate per local protocol.'
    });
  }

  // ─── Access to lethal means (HIGH) ──────────────────────────
  if (means.accessToLethalMeans === 'yes') {
    flags.push({
      id: 'F-ACCESS-TO-MEANS-001',
      category: 'access-to-means',
      priority: 'high',
      description:
        'The person has access to lethal means — a modifiable, high-impact risk factor.',
      suggestedAction:
        'Undertake means-restriction counselling; remove or secure access to lethal means with the person and their carers.'
    });
  }

  // ─── Safety plan needed (MEDIUM) ────────────────────────────
  if (grade.riskTier !== 'low') {
    flags.push({
      id: 'F-SAFETY-PLAN-NEEDED-001',
      category: 'safety-plan-needed',
      priority: 'medium',
      description:
        'Moderate or high risk — a collaborative safety plan should be completed.',
      suggestedAction:
        'Complete a safety plan covering warning signs, coping strategies, supports, means restriction, and crisis contacts.'
    });
  }

  // ─── Recent preparatory acts (MEDIUM) ───────────────────────
  if (beh.preparatoryActs === 'yes') {
    const when = recent ? ' within the past 3 months' : '';
    flags.push({
      id: 'F-PREPARATORY-ACTS-001',
      category: 'preparatory-acts',
      priority: 'medium',
      description: `Preparatory acts or behaviour recorded${when} (e.g. acquiring means or writing a note).`,
      suggestedAction:
        'Explore intent and means; raise the level of monitoring and review the safety plan.'
    });
  }

  // ─── Non-suicidal self-injury (MEDIUM) ──────────────────────
  if (beh.nonSuicidalSelfInjury === 'yes') {
    flags.push({
      id: 'F-NON-SUICIDAL-SELF-INJURY-001',
      category: 'non-suicidal-self-injury',
      priority: 'medium',
      description:
        'Non-suicidal self-injury reported — recorded separately from suicidal behaviour, but still a clinical concern.',
      suggestedAction:
        'Assess function and triggers of the self-injury; offer appropriate psychological support.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  const ideationAnswered =
    ide.wishToBeDead !== '' ||
    ide.nonSpecificActiveThoughts !== '' ||
    ide.activeIdeationMethods !== '' ||
    ide.activeIdeationIntent !== '' ||
    ide.activeIdeationPlan !== '';
  if (!ideationAnswered) missing.push('suicidal-ideation items (Q1-Q5)');
  const behaviourAnswered =
    beh.actualAttempt !== '' ||
    beh.interruptedAttempt !== '' ||
    beh.abortedAttempt !== '' ||
    beh.preparatoryActs !== '' ||
    beh.nonSuicidalSelfInjury !== '';
  if (!behaviourAnswered) missing.push('suicidal-behaviour items');
  if (grade.suicidalBehaviourPresent && beh.behaviourRecency === '') {
    missing.push('behaviour recency window');
  }
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing input(s): ${missing.join(', ')} — the risk tier may understate risk.`,
      suggestedAction:
        'Record the missing item(s) and re-assess; a Low tier does not exclude risk.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
