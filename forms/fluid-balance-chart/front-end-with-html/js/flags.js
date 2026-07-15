import { num } from './grader.js';
import { ANURIA_ABSOLUTE_ML, ANURIA_MIN_HOURS, ANURIA_RATE_ML_PER_KG_PER_HOUR, OLIGURIA_MIN_HOURS, OLIGURIA_RATE_ML_PER_KG_PER_HOUR } from './rules.js';

// Flagged-issue detection (safety flags). Emitted independently of the
// fluid-status classification (spec §5). Each flag mirrors a category in the
// `fluid_balance_chart_grade_flag` SQL table:
//
//   - fluid-overload-risk       (high)   — netBalanceMl >= +positiveThreshold
//   - dehydration-hypovolaemia  (high)   — netBalanceMl <= -negativeThreshold
//   - oliguria                  (high)   — urineRate < 0.5 mL/kg/h over >= 6 h
//   - anuria                    (high)   — urineRate < 0.05 mL/kg/h, or
//                                          urineOutputMl < 100 mL over >= 12 h
//   - incomplete-recording      (low/medium) — weight missing (medium), no
//                                          entries (medium), any volumeMl
//                                          missing (low)

/**
 * @typedef {import('./types.js').ChartData} ChartData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {ChartData} data
 * @param {GradingResult} grade  - result from gradeFluidBalance
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const entries = data.entries || [];
  const rate = grade.urineOutputRateMlPerKgPerHour;

  // ─── Fluid-overload risk (HIGH) ─────────────────────────────
  if (grade.netBalanceMl >= grade.positiveThresholdMl) {
    flags.push({
      id: 'F-FLUID-OVERLOAD-001',
      category: 'fluid-overload-risk',
      priority: 'high',
      description: `Significant positive balance (net ${grade.netBalanceMl >= 0 ? '+' : ''}${grade.netBalanceMl} mL, at or above the ${Math.round(grade.positiveThresholdMl)} mL threshold)`,
      suggestedAction:
        'Review for pulmonary or peripheral oedema; reassess the fluid prescription and consider restriction or diuresis.'
    });
  }

  // ─── Dehydration / hypovolaemia (HIGH) ──────────────────────
  if (grade.netBalanceMl <= -grade.negativeThresholdMl) {
    flags.push({
      id: 'F-DEHYDRATION-001',
      category: 'dehydration-hypovolaemia',
      priority: 'high',
      description: `Significant negative balance (net ${grade.netBalanceMl} mL, at or below the -${Math.round(grade.negativeThresholdMl)} mL threshold)`,
      suggestedAction:
        'Review perfusion and volume status; consider fluid replacement and investigate ongoing losses.'
    });
  }

  // ─── Oliguria (HIGH) ────────────────────────────────────────
  if (
    rate !== null &&
    grade.hoursObserved >= OLIGURIA_MIN_HOURS &&
    rate < OLIGURIA_RATE_ML_PER_KG_PER_HOUR
  ) {
    flags.push({
      id: 'F-OLIGURIA-001',
      category: 'oliguria',
      priority: 'high',
      description: `Urine output ${rate.toFixed(2)} mL/kg/h is below the KDIGO oliguria threshold of ${OLIGURIA_RATE_ML_PER_KG_PER_HOUR} mL/kg/h over ${grade.hoursObserved} h`,
      suggestedAction:
        'Assess for acute kidney injury; review fluid status, catheter patency, and nephrotoxic medicines.'
    });
  }

  // ─── Anuria (HIGH) ──────────────────────────────────────────
  const anuriaByRate = rate !== null && rate < ANURIA_RATE_ML_PER_KG_PER_HOUR;
  const anuriaByAbsolute =
    grade.hoursObserved >= ANURIA_MIN_HOURS && grade.urineOutputMl < ANURIA_ABSOLUTE_ML;
  if (anuriaByRate || anuriaByAbsolute) {
    const parts = [];
    if (anuriaByRate) parts.push(`urine output rate ${rate.toFixed(2)} mL/kg/h (< ${ANURIA_RATE_ML_PER_KG_PER_HOUR})`);
    if (anuriaByAbsolute) parts.push(`only ${grade.urineOutputMl} mL of urine over ${grade.hoursObserved} h`);
    flags.push({
      id: 'F-ANURIA-001',
      category: 'anuria',
      priority: 'high',
      description: `Effectively no urine output: ${parts.join('; ')}`,
      suggestedAction:
        'Urgent review for obstruction and acute kidney injury; escalate to the responsible clinician immediately.'
    });
  }

  // ─── Incomplete recording (MEDIUM / LOW) ────────────────────
  if (num(data.patient.weightKg) === null) {
    flags.push({
      id: 'F-INCOMPLETE-WEIGHT-001',
      category: 'incomplete-recording',
      priority: 'medium',
      description: 'Patient weight is missing — the urine output rate in mL/kg/h cannot be computed',
      suggestedAction:
        'Record the patient weight to enable the weight-indexed urine-output calculation.'
    });
  }
  if (entries.length === 0) {
    flags.push({
      id: 'F-INCOMPLETE-NO-ENTRIES-001',
      category: 'incomplete-recording',
      priority: 'medium',
      description: 'No intake or output entries have been recorded — the balance is unreliable',
      suggestedAction:
        'Record the timed intake and output volumes for the charting period.'
    });
  } else {
    const missingVolume = entries.filter((e) => num(e.volumeMl) === null).length;
    if (missingVolume > 0) {
      flags.push({
        id: 'F-INCOMPLETE-MISSING-VOLUME-001',
        category: 'incomplete-recording',
        priority: 'low',
        description: `${missingVolume} entry / entries have no recorded volume and contribute nothing to the balance`,
        suggestedAction:
          'Enter a volume in millilitres for every recorded intake and output line, or remove the empty rows.'
      });
    }
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
