// Declarative ABPM interpretation rules — the four grading axes.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/utils.ts` (clinical thresholds + predicates),
// `classification-rules.ts` (Axis A), `severity-rules.ts` (Axis B),
// `completeness-rules.ts` (Axis C), and `follow-up-rules.ts` (Axis D).
// Rule IDs are stable and identical across every front-end and the back-end;
// rows mirror the `ambulatory_blood_pressure_test_result_grade_rule` SQL
// table (rule_id, axis, category, description).

/**
 * @typedef {import('./types.js').AmbulatoryBloodPressureResult} AmbulatoryBloodPressureResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Clinical thresholds (NICE NG136 / BIHS / ESH ABPM averages, mmHg)
// ----------------------------------------------------------------------

/** Daytime average hypertension threshold (>= 135/85). */
const DAYTIME_HTN_SYSTOLIC = 135;
const DAYTIME_HTN_DIASTOLIC = 85;
/** 24-hour average hypertension threshold (>= 130/80). */
const TWENTY_FOUR_HOUR_HTN_SYSTOLIC = 130;
const TWENTY_FOUR_HOUR_HTN_DIASTOLIC = 80;
/** Nighttime / nocturnal hypertension threshold (>= 120/70). */
const NIGHTTIME_HTN_SYSTOLIC = 120;
const NIGHTTIME_HTN_DIASTOLIC = 70;
/** Severe-hypertension threshold (ABPM average >= 150/95, ~ clinic >= 180/120). */
const SEVERE_HTN_SYSTOLIC = 150;
const SEVERE_HTN_DIASTOLIC = 95;
/** Stage-2 hypertension threshold (ABPM daytime average >= 150/95, NICE banding). */
const STAGE2_HTN_SYSTOLIC = 150;
const STAGE2_HTN_DIASTOLIC = 95;
/** Recording adequacy threshold (>= 70% valid readings). */
const ADEQUATE_READINGS_PERCENT = 70;

// ----------------------------------------------------------------------
// Structured / threshold predicates
// ----------------------------------------------------------------------

/**
 * Whether the daytime average meets or exceeds the hypertension threshold
 * (>= 135/85). Either component crossing is sufficient.
 * @param {AmbulatoryBloodPressureResult} r
 */
function daytimeHypertensive(r) {
  return (
    (r.daytimeAverageSystolic !== null &&
      r.daytimeAverageSystolic >= DAYTIME_HTN_SYSTOLIC) ||
    (r.daytimeAverageDiastolic !== null &&
      r.daytimeAverageDiastolic >= DAYTIME_HTN_DIASTOLIC)
  );
}

/**
 * Whether the 24-hour average meets or exceeds the threshold (>= 130/80).
 * @param {AmbulatoryBloodPressureResult} r
 */
function twentyFourHourHypertensive(r) {
  return (
    (r.twentyFourHourAverageSystolic !== null &&
      r.twentyFourHourAverageSystolic >= TWENTY_FOUR_HOUR_HTN_SYSTOLIC) ||
    (r.twentyFourHourAverageDiastolic !== null &&
      r.twentyFourHourAverageDiastolic >= TWENTY_FOUR_HOUR_HTN_DIASTOLIC)
  );
}

/**
 * Whether the nighttime average meets or exceeds the threshold (>= 120/70).
 * @param {AmbulatoryBloodPressureResult} r
 */
function nighttimeHypertensive(r) {
  return (
    (r.nighttimeAverageSystolic !== null &&
      r.nighttimeAverageSystolic >= NIGHTTIME_HTN_SYSTOLIC) ||
    (r.nighttimeAverageDiastolic !== null &&
      r.nighttimeAverageDiastolic >= NIGHTTIME_HTN_DIASTOLIC)
  );
}

/**
 * Whether the study shows severe hypertension by the averaged measurements
 * (any average >= 150/95). Mirrors the structured `severeHypertension` boolean.
 * @param {AmbulatoryBloodPressureResult} r
 */
function severeByAverages(r) {
  const sys = [
    r.daytimeAverageSystolic,
    r.nighttimeAverageSystolic,
    r.twentyFourHourAverageSystolic
  ];
  const dia = [
    r.daytimeAverageDiastolic,
    r.nighttimeAverageDiastolic,
    r.twentyFourHourAverageDiastolic
  ];
  return (
    sys.some((v) => v !== null && v >= SEVERE_HTN_SYSTOLIC) ||
    dia.some((v) => v !== null && v >= SEVERE_HTN_DIASTOLIC)
  );
}

/**
 * A critical (severe-hypertension) result auto-escalates Axis D to
 * critical-alert. Either the structured boolean or the averaged measurements
 * can fire it. Mirrors the back-end invariant.
 * @param {AmbulatoryBloodPressureResult} r
 */
function hasCriticalFinding(r) {
  return r.severeHypertension || severeByAverages(r);
}

/**
 * Whether any structured abnormal interpretation is present.
 * @param {AmbulatoryBloodPressureResult} r
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.hypertensionConfirmed ||
    r.maskedHypertension ||
    r.severeHypertension ||
    r.nocturnalHypertension ||
    daytimeHypertensive(r) ||
    twentyFourHourHypertensive(r)
  );
}

/**
 * Whether the recording met the adequacy threshold (>= 70% valid readings).
 * @param {AmbulatoryBloodPressureResult} r
 */
function recordingIsAdequate(r) {
  if (r.recordingAdequate) return true;
  return (
    r.validReadingsPercent !== null &&
    r.validReadingsPercent >= ADEQUATE_READINGS_PERCENT
  );
}

/**
 * Whether the recording is inadequate (low valid-readings percentage).
 * @param {AmbulatoryBloodPressureResult} r
 */
function recordingIsInadequate(r) {
  return (
    !r.recordingAdequate &&
    r.validReadingsPercent !== null &&
    r.validReadingsPercent < ADEQUATE_READINGS_PERCENT
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification
// ----------------------------------------------------------------------

/**
 * Determines the overall reporting conclusion:
 * - critical: a severe-hypertension result (structured boolean or ABPM average
 *   >= 150/95, equivalent to clinic >= 180/120) is present.
 * - inconclusive: the recording was inadequate (< 70% valid readings) with no
 *   confident impression.
 * - abnormal: any abnormal interpretation (hypertension confirmed, masked,
 *   nocturnal, or a raised average) is present; a white-coat effect is also
 *   reported abnormal (not a normal study).
 * - normal: no abnormal interpretation on an adequate recording.
 *
 * @param {AmbulatoryBloodPressureResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'severe-hypertension',
      description:
        'A severe-hypertension result (ABPM average >= 150/95, equivalent to clinic >= 180/120) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (recordingIsInadequate(r) && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'inadequate-recording',
      description:
        'Recording was inadequate (< 70% valid readings) and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'One or more abnormal interpretations (raised average or confirmed/masked/nocturnal hypertension) are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.whiteCoatEffect) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'white-coat-effect',
      description:
        'White-coat effect present (raised clinic BP but normal ambulatory averages); classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal interpretation on an adequate recording; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity & structured-reporting category
// ----------------------------------------------------------------------

/**
 * Severity ladder (none -> minor -> moderate -> major), grounded in the NICE
 * NG136 / BIHS / ESH ABPM hypertension stage banding. The `reportingCategory`
 * carries the hypertension stage label suitable for downstream structured
 * reporting:
 * - major / severe: a severe-hypertension result (ABPM average >= 150/95).
 * - moderate / stage-2: ABPM daytime average >= 150/95, or confirmed / masked
 *   hypertension.
 * - minor / stage-1: a raised average below the stage-2 threshold, white-coat
 *   effect, or isolated nocturnal hypertension.
 * - none / normotensive: a normal study.
 *
 * @param {AmbulatoryBloodPressureResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'severe-hypertension',
      description: 'Severe hypertension present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'severe', firedRules };
  }

  const daytimeStage2 =
    (r.daytimeAverageSystolic !== null &&
      r.daytimeAverageSystolic >= STAGE2_HTN_SYSTOLIC) ||
    (r.daytimeAverageDiastolic !== null &&
      r.daytimeAverageDiastolic >= STAGE2_HTN_DIASTOLIC);

  if (daytimeStage2 || r.hypertensionConfirmed || r.maskedHypertension) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'stage-2-hypertension',
      description:
        'Stage 2 hypertension (ABPM daytime average >= 150/95) or confirmed / masked hypertension present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'stage-2', firedRules };
  }

  if (daytimeHypertensive(r) || twentyFourHourHypertensive(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'stage-1-hypertension',
      description:
        'Raised ambulatory average below the stage-2 threshold; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'stage-1', firedRules };
  }

  if (r.nocturnalHypertension || nighttimeHypertensive(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'nocturnal-hypertension',
      description: 'Isolated nocturnal hypertension present; severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: 'nocturnal-hypertension',
      firedRules
    };
  }

  if (r.whiteCoatEffect) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-03',
      axis: 'severity',
      category: 'white-coat-effect',
      description: 'White-coat effect present; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'white-coat', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normotensive', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per NICE NG136 / BIHS ABPM reporting:
 * clinical history, the averaged measurements, nocturnal dipping, findings,
 * and impression.
 *
 * @type {{ ruleId: string, category: string, label: string,
 *          present: (r: AmbulatoryBloodPressureResult) => boolean }[]}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-AVERAGES-01',
    category: 'averages',
    label: 'averaged blood-pressure measurements',
    present: (r) =>
      (r.daytimeAverageSystolic !== null && r.daytimeAverageDiastolic !== null) ||
      (r.twentyFourHourAverageSystolic !== null &&
        r.twentyFourHourAverageDiastolic !== null)
  },
  {
    ruleId: 'R-COMP-DIPPING-01',
    category: 'dipping',
    label: 'nocturnal dipping',
    present: (r) => r.nocturnalDipPercent !== null || r.dipperStatus !== ''
  },
  {
    ruleId: 'R-COMP-FINDINGS-01',
    category: 'findings',
    label: 'findings narrative',
    present: (r) => r.findingsNarrative.trim() !== ''
  },
  {
    ruleId: 'R-COMP-IMPRESSION-01',
    category: 'impression',
    label: 'impression',
    present: (r) => r.impression.trim() !== ''
  }
];

/**
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {AmbulatoryBloodPressureResult} r
 * @returns {{ reportCompletenessPercent: number, firedRules: FiredRule[] }}
 */
function gradeCompleteness(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let presentCount = 0;

  for (const section of completenessSections) {
    if (section.present(r)) {
      presentCount += 1;
    } else {
      firedRules.push({
        ruleId: section.ruleId,
        axis: 'completeness',
        category: section.category,
        description: `Mandatory report section missing: ${section.label}.`
      });
    }
  }

  const reportCompletenessPercent = Math.round(
    (presentCount / completenessSections.length) * 100
  );
  return { reportCompletenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up urgency, target timeframe, recommended action
// ----------------------------------------------------------------------

/**
 * Escalation ladder (routine -> recommended -> urgent -> critical-alert). A
 * severe-hypertension result auto-escalates to critical-alert regardless of
 * the other axes (the safety invariant; NICE NG136 same-day specialist
 * review). The least-urgent band is chosen only when no rule fires.
 *
 * @param {AmbulatoryBloodPressureResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalFinding(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Severe hypertension auto-escalates follow-up urgency to critical-alert regardless of the other axes (NICE NG136 same-day specialist review).'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'same-day',
      recommendedAction:
        'Arrange same-day specialist review and communicate the critical result directly to the referrer now; document the conversation.',
      firedRules
    };
  }

  // ─── urgent ───
  if (severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'major-abnormality',
      description: 'Major abnormality present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 1 week',
      recommendedAction:
        'Arrange urgent clinical review and expedite treatment escalation.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'moderate') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'moderate-abnormality',
      description: 'Moderate abnormality present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend antihypertensive treatment initiation or review per NICE NG136.',
      firedRules
    };
  }

  if (classification === 'inconclusive' || recordingIsInadequate(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inadequate-recording',
      description: 'Inconclusive or inadequate recording; repeat monitoring recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend repeat ambulatory or home monitoring to obtain an adequate study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description:
        'Minor abnormality (stage 1, nocturnal, or white-coat); structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction:
        'Recommend lifestyle advice and follow-up monitoring per NICE NG136; consider treatment by cardiovascular risk.',
      firedRules
    };
  }

  // ─── routine: least-urgent band, no rule fired ───
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'No escalation rule fired; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction: 'No specific follow-up required; manage per usual care.',
    firedRules
  };
}

export { DAYTIME_HTN_SYSTOLIC, DAYTIME_HTN_DIASTOLIC, TWENTY_FOUR_HOUR_HTN_SYSTOLIC, TWENTY_FOUR_HOUR_HTN_DIASTOLIC, NIGHTTIME_HTN_SYSTOLIC, NIGHTTIME_HTN_DIASTOLIC, SEVERE_HTN_SYSTOLIC, SEVERE_HTN_DIASTOLIC, STAGE2_HTN_SYSTOLIC, STAGE2_HTN_DIASTOLIC, ADEQUATE_READINGS_PERCENT, daytimeHypertensive, twentyFourHourHypertensive, nighttimeHypertensive, severeByAverages, hasCriticalFinding, hasAnyAbnormalFinding, recordingIsAdequate, recordingIsInadequate, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
