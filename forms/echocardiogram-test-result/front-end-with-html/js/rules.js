// Declarative four-axis grading rules for the Echocardiogram Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `echocardiogram_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').EchocardiogramResult} EchocardiogramResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').ValveGrade} ValveGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * All four valve grades, for convenience iteration.
 * @param {EchocardiogramResult} r
 * @returns {ValveGrade[]}
 */
function valveGrades(r) {
  return [r.aorticStenosis, r.aorticRegurgitation, r.mitralStenosis, r.mitralRegurgitation];
}

/**
 * Whether any valve lesion is graded severe.
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasSevereValveDisease(r) {
  return valveGrades(r).some((g) => g === 'severe');
}

/**
 * Whether any valve lesion is graded moderate (and none severe).
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasModerateValveDisease(r) {
  return valveGrades(r).some((g) => g === 'moderate');
}

/**
 * Whether any valve lesion is graded mild or worse.
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasAnyValveDisease(r) {
  return valveGrades(r).some((g) => g === 'mild' || g === 'moderate' || g === 'severe');
}

/**
 * Whether left-ventricular systolic function is severely impaired (by
 * qualitative grade or EF).
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasSevereLvImpairment(r) {
  return (
    r.lvFunction === 'severely-impaired' ||
    (r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 30)
  );
}

/**
 * Whether left-ventricular systolic function is impaired to any degree.
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasAnyLvImpairment(r) {
  return (
    r.lvFunction === 'mildly-impaired' ||
    r.lvFunction === 'moderately-impaired' ||
    r.lvFunction === 'severely-impaired' ||
    (r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 50)
  );
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: severe valve disease, a valvular vegetation (suspected
 * endocarditis), a pericardial effusion (tamponade risk), severe LV
 * impairment, or an intracardiac thrombus.
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    hasSevereValveDisease(r) ||
    r.vegetation ||
    r.pericardialEffusion ||
    hasSevereLvImpairment(r) ||
    r.intracardiacThrombus
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {EchocardiogramResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    hasAnyValveDisease(r) ||
    hasAnyLvImpairment(r) ||
    r.lvHypertrophy ||
    r.regionalWallMotionAbnormality ||
    r.pericardialEffusion ||
    r.vegetation ||
    r.intracardiacThrombus
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (severe valve disease, vegetation,
 *   pericardial effusion, severe LV impairment, intracardiac thrombus) is present.
 * - inconclusive: the study was poor quality, or limited with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {EchocardiogramResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-finding',
      description:
        'A critical structured finding (severe valve disease, vegetation, pericardial effusion, severe LV impairment, or intracardiac thrombus) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.studyQuality === 'poor') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'poor-quality',
      description: 'Study quality was poor; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.studyQuality === 'limited' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'limited-no-impression',
      description:
        'Study was limited and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description: 'One or more abnormal structured findings are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable study; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the ASE/EACVI
 * chamber-quantification and valve-disease severity-grading conventions and the
 * British Society of Echocardiography minimum dataset:
 * - major: a critical finding (severe valve disease, vegetation, pericardial
 *   effusion, severe LV impairment, intracardiac thrombus).
 * - moderate: moderate valve disease or moderate LV impairment, or a regional
 *   wall-motion abnormality.
 * - minor: mild valve disease, mild LV impairment, or LV hypertrophy only.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {EchocardiogramResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    const category = hasSevereValveDisease(r)
      ? 'severe-valve-disease'
      : hasSevereLvImpairment(r)
        ? 'severe-lv-impairment'
        : 'critical-actionable';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasModerateValveDisease(r) || r.lvFunction === 'moderately-impaired') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'moderate-abnormality',
      description:
        'Moderate valve disease or moderate LV impairment is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'moderate-abnormality', firedRules };
  }

  if (r.regionalWallMotionAbnormality) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'regional-wall-motion',
      description: 'A regional wall-motion abnormality is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'regional-wall-motion', firedRules };
  }

  const minor =
    hasAnyValveDisease(r) || hasAnyLvImpairment(r) || r.lvHypertrophy;

  if (minor) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'minor-abnormality',
      description:
        'Mild valve disease, mild LV impairment, or LV hypertrophy only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'minor-abnormality', firedRules };
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
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The six mandatory report sections per the British Society of Echocardiography
 * minimum dataset: clinical history, LV function, valves, pulmonary pressure,
 * findings narrative, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: EchocardiogramResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-LV-FUNCTION-01',
    category: 'lv-function',
    label: 'left-ventricular function',
    present: (r) => r.lvFunction !== '' || r.lvEjectionFractionPercent !== null
  },
  {
    ruleId: 'R-COMP-VALVES-01',
    category: 'valves',
    label: 'valve assessment',
    present: (r) =>
      r.aorticStenosis !== '' ||
      r.aorticRegurgitation !== '' ||
      r.mitralStenosis !== '' ||
      r.mitralRegurgitation !== ''
  },
  {
    ruleId: 'R-COMP-PULMONARY-01',
    category: 'pulmonary-pressure',
    label: 'pulmonary artery systolic pressure',
    present: (r) => r.pulmonaryArterySystolicPressureMmhg !== null
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
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {EchocardiogramResult} r
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
        description: 'Mandatory report section missing: ' + section.label + '.'
      });
    }
  }

  const reportCompletenessPercent =
    Math.round((presentCount / completenessSections.length) * 100);
  return { reportCompletenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up urgency (mirrors `follow-up-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {EchocardiogramResult} r
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
        'Critical finding auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now and document the conversation.',
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
      targetTimeframe: 'within 24 hours',
      recommendedAction: 'Arrange urgent cardiology review and expedite onward referral.',
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
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend cardiology review or surveillance echo as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative imaging recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction:
        'Recommend a repeat or alternative study (e.g. TOE or contrast echo) to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Minor abnormality; surveillance follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per surveillance guidance',
      recommendedAction:
        'Arrange surveillance echo per the relevant valve-disease / cardiomyopathy pathway.',
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
    recommendedAction: 'No specific echocardiographic follow-up required; manage per usual care.',
    firedRules
  };
}

export { valveGrades, hasSevereValveDisease, hasModerateValveDisease, hasAnyValveDisease, hasSevereLvImpairment, hasAnyLvImpairment, hasCriticalFinding, hasAnyAbnormalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
