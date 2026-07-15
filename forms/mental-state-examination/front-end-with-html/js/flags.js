// Flagged-issue detection (safety flags). Independent of the completeness
// status (which the grader produces), this module raises clinician-facing
// safety flags per spec §5, each with a priority. The highest priority present
// determines the risk level (none / low / moderate / high) in `grader.js`.
//
//   - Suicidal ideation (high)          — suicidalIdeation active-no-plan / active-with-plan
//   - Homicidal ideation (high)         — homicidalIdeation thoughts / intent
//   - Command hallucinations (high)     — commandHallucinations == 'yes'
//   - Recent self-harm (high)           — selfHarmThoughts == 'recent-acts'
//   - Psychosis with risk (high)        — hallucinations/delusions present AND a high ideation flag
//   - Thoughts of self-harm (moderate)  — selfHarmThoughts == 'thoughts' or suicidalIdeation == 'passive'
//   - Delusional content (moderate)     — delusions other than none
//   - Lack of insight with risk (mod.)  — insight none + any flag, or treatment refuses + a mod/high flag
//   - Cognitive impairment (moderate)   — cognitiveImpression significant-concern or orientation global
//   - Agitation (low)                   — appearancePsychomotor == 'agitation'
//   - Low mood (low)                    — moodDescriptor == 'low' without an ideation flag
//   - Incomplete examination (low)      — status == 'partial'
//
// Categories mirror the `mental_state_examination_grade_flag` SQL CHECK
// constraint (suicidal-ideation, homicidal-ideation, command-hallucinations,
// self-harm, psychosis-with-risk, lack-of-insight-with-risk, cognitive-impairment,
// incomplete, other).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * Detect the safety flags raised by the examination findings.
 *
 * @param {AssessmentData} data
 * @param {{ status: 'complete' | 'partial' }} [grade]  - completeness grade; the
 *        `incomplete` flag fires when `grade.status === 'partial'`.
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const a = data.appearance;
  const e = data.emotion;
  const p = data.perception;
  const t = data.thought;
  const i = data.insight;
  const c = data.cognition;

  // ─── Raw finding predicates ────────────────────────────────
  const activeSuicidal =
    t.suicidalIdeation === 'active-no-plan' ||
    t.suicidalIdeation === 'active-with-plan';
  const passiveSuicidal = t.suicidalIdeation === 'passive';
  const homicidal =
    t.homicidalIdeation === 'thoughts' || t.homicidalIdeation === 'intent';
  const command = p.commandHallucinations === 'yes';
  const recentSelfHarm = t.selfHarmThoughts === 'recent-acts';
  const thoughtsSelfHarm = t.selfHarmThoughts === 'thoughts';
  const hallucinationsPresent =
    p.hallucinationsPresent !== '' && p.hallucinationsPresent !== 'none';
  const delusionsPresent = t.delusions !== '' && t.delusions !== 'none';

  // ─── Suicidal ideation (HIGH) ──────────────────────────────
  if (activeSuicidal) {
    flags.push({
      id: 'F-SUICIDAL-IDEATION-001',
      category: 'suicidal-ideation',
      priority: 'high',
      description:
        t.suicidalIdeation === 'active-with-plan'
          ? 'Active suicidal ideation with a plan'
          : 'Active suicidal ideation without a stated plan',
      suggestedAction:
        'Complete a full suicide-risk assessment now and escalate per local safety policy; do not leave the patient unobserved if risk is imminent.'
    });
  }

  // ─── Homicidal ideation / harm to others (HIGH) ────────────
  if (homicidal) {
    flags.push({
      id: 'F-HOMICIDAL-IDEATION-001',
      category: 'homicidal-ideation',
      priority: 'high',
      description:
        t.homicidalIdeation === 'intent'
          ? 'Homicidal ideation with intent to harm others'
          : 'Thoughts of harming others',
      suggestedAction:
        'Assess risk to identified others, consider a duty to warn / safeguarding referral, and escalate to senior clinical review.'
    });
  }

  // ─── Command hallucinations (HIGH) ─────────────────────────
  if (command) {
    flags.push({
      id: 'F-COMMAND-HALLUCINATIONS-001',
      category: 'command-hallucinations',
      priority: 'high',
      description: 'Command hallucinations reported',
      suggestedAction:
        'Establish the content and the patient’s ability to resist the commands; escalate for urgent psychiatric review.'
    });
  }

  // ─── Recent self-harm (HIGH) ───────────────────────────────
  if (recentSelfHarm) {
    flags.push({
      id: 'F-SELF-HARM-RECENT-001',
      category: 'self-harm',
      priority: 'high',
      description: 'Recent acts of self-harm',
      suggestedAction:
        'Assess injuries and intent, follow NICE NG225, and complete a full risk assessment before any disposition.'
    });
  }

  // ─── Psychosis with risk (HIGH) ────────────────────────────
  const anyHighIdeation =
    activeSuicidal || homicidal || command || recentSelfHarm;
  if ((hallucinationsPresent || delusionsPresent) && anyHighIdeation) {
    flags.push({
      id: 'F-PSYCHOSIS-WITH-RISK-001',
      category: 'psychosis-with-risk',
      priority: 'high',
      description:
        'Active psychotic phenomena (hallucinations and/or delusions) alongside a high-risk ideation flag',
      suggestedAction:
        'Treat as high risk: urgent psychiatric review, consider Mental Health Act assessment, and ensure a safe environment.'
    });
  }

  // ─── Thoughts of self-harm (MODERATE) ──────────────────────
  if (thoughtsSelfHarm || passiveSuicidal) {
    flags.push({
      id: 'F-SELF-HARM-THOUGHTS-001',
      category: 'self-harm',
      priority: 'moderate',
      description: passiveSuicidal
        ? 'Passive suicidal ideation (thoughts of being better off dead) without active plan'
        : 'Thoughts of self-harm without recent acts',
      suggestedAction:
        'Explore protective factors and intent; document a safety plan and arrange appropriate follow-up.'
    });
  }

  // ─── Delusional content (MODERATE) ─────────────────────────
  if (delusionsPresent) {
    flags.push({
      id: 'F-DELUSIONAL-CONTENT-001',
      category: 'other',
      priority: 'moderate',
      description: `Delusional content recorded (${t.delusions})`,
      suggestedAction:
        'Characterise the delusion and its impact on risk and function; consider psychiatric review.'
    });
  }

  // ─── Cognitive impairment (MODERATE) ───────────────────────
  if (c.cognitiveImpression === 'significant-concern' || c.orientation === 'global') {
    flags.push({
      id: 'F-COGNITIVE-IMPAIRMENT-001',
      category: 'cognitive-impairment',
      priority: 'moderate',
      description:
        c.orientation === 'global'
          ? 'Global disorientation on cognitive screening'
          : 'Significant cognitive concern on gross cognitive impression',
      suggestedAction:
        'Consider delirium and reversible causes; arrange formal cognitive testing (MMSE / MoCA) and appropriate investigation.'
    });
  }

  // ─── Lack of insight with risk (MODERATE) ──────────────────
  // Evaluated against the flags accumulated so far.
  const anyFlagSoFar = flags.length > 0;
  const anyModerateOrHigh = flags.some(
    (f) => f.priority === 'high' || f.priority === 'moderate'
  );
  if (
    (i.insightLevel === 'none' && anyFlagSoFar) ||
    (i.treatmentUnderstanding === 'refuses' && anyModerateOrHigh)
  ) {
    flags.push({
      id: 'F-LACK-OF-INSIGHT-WITH-RISK-001',
      category: 'lack-of-insight-with-risk',
      priority: 'moderate',
      description:
        i.insightLevel === 'none'
          ? 'No insight into illness alongside other risk findings'
          : 'Refusal of treatment alongside other risk findings',
      suggestedAction:
        'Assess capacity, consider the Mental Health Act / Mental Capacity Act framework, and involve senior clinicians in the disposition decision.'
    });
  }

  // ─── Agitation (LOW) ───────────────────────────────────────
  if (a.appearancePsychomotor === 'agitation') {
    flags.push({
      id: 'F-AGITATION-001',
      category: 'other',
      priority: 'low',
      description: 'Psychomotor agitation observed',
      suggestedAction:
        'Use de-escalation, ensure staff and patient safety, and monitor for escalation.'
    });
  }

  // ─── Low mood (LOW) ────────────────────────────────────────
  const anyIdeation =
    activeSuicidal || homicidal || passiveSuicidal ||
    thoughtsSelfHarm || recentSelfHarm;
  if (e.moodDescriptor === 'low' && !anyIdeation) {
    flags.push({
      id: 'F-LOW-MOOD-001',
      category: 'other',
      priority: 'low',
      description: 'Low / depressed mood without an ideation flag',
      suggestedAction:
        'Screen for depression severity and safety; arrange appropriate follow-up.'
    });
  }

  // ─── Incomplete examination (LOW) ──────────────────────────
  if (grade && grade.status === 'partial') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'One or more ASEPTIC domains are undocumented — the examination is partial',
      suggestedAction:
        'Complete the outstanding domains so the mental state record is whole.'
    });
  }

  // Sort: high > moderate > low.
  const priorityOrder = { high: 0, moderate: 1, low: 2 };
  flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

  return flags;
}

export { detectFlaggedIssues };
