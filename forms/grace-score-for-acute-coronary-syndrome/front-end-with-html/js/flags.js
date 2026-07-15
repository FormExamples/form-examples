import { normaliseCreatinine } from './rules.js';

// Flagged-issue detection (red flags). Independent of the GRACE point total
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - High-risk category (high)   — riskCategory == 'high'
//   - Cardiac arrest (high)       — cardiacArrestAtAdmission == 'yes'
//   - Killip class >= II (high)   — killipClass in {II, III, IV}
//   - Hypotension (high)          — systolicBloodPressure < 90
//   - Renal impairment (medium)   — normalised creatinine >= 2.0 mg/dL
//   - ST-segment deviation (med)  — stSegmentDeviation == 'yes'
//   - Incomplete assessment (low) — any GRACE variable input missing
//
// Rows here mirror the `grace_score_for_acute_coronary_syndrome_grade_flag`
// SQL table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {'low' | 'intermediate' | 'high'} riskCategory  - overall category from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, riskCategory) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const age = data.identification.ageYears;
  const hr = data.haemodynamics.heartRate;
  const sbp = data.haemodynamics.systolicBloodPressure;
  const creatRaw = data.renal.serumCreatinine;
  const creatUnit = data.renal.serumCreatinineUnit;
  const creatMgdl = normaliseCreatinine(creatRaw, creatUnit);
  const killip = data.heartFailure.killipClass;
  const arrest = data.highRiskFeatures.cardiacArrestAtAdmission;
  const stDeviation = data.highRiskFeatures.stSegmentDeviation;
  const enzymes = data.highRiskFeatures.elevatedCardiacEnzymes;

  // ─── High-risk category (HIGH) ──────────────────────────────
  if (riskCategory === 'high') {
    flags.push({
      id: 'F-HIGH-RISK-CATEGORY-001',
      category: 'high-risk-category',
      priority: 'high',
      description: 'High GRACE risk category — increased in-hospital and 6-month mortality',
      suggestedAction:
        'Recommend an early invasive strategy: coronary angiography within 24 hours, with senior cardiology review.'
    });
  }

  // ─── Cardiac arrest at admission (HIGH) ─────────────────────
  if (arrest === 'yes') {
    flags.push({
      id: 'F-CARDIAC-ARREST-001',
      category: 'cardiac-arrest',
      priority: 'high',
      description: 'Cardiac arrest at admission — arrest survivor',
      suggestedAction:
        'Urgent senior review; consider the post-cardiac-arrest care pathway and early coronary angiography.'
    });
  }

  // ─── Killip class >= II (HIGH) ──────────────────────────────
  if (killip === 'II' || killip === 'III' || killip === 'IV') {
    flags.push({
      id: 'F-KILLIP-CLASS-001',
      category: 'heart-failure',
      priority: 'high',
      description: `Killip class ${killip} — clinical heart failure to cardiogenic shock`,
      suggestedAction:
        'Escalate: assess perfusion and oxygenation, treat heart failure, and involve critical care as needed.'
    });
  }

  // ─── Hypotension (HIGH) ─────────────────────────────────────
  if (sbp !== null && sbp < 90) {
    flags.push({
      id: 'F-HYPOTENSION-001',
      category: 'hypotension',
      priority: 'high',
      description: `Systolic blood pressure ${sbp} mmHg (below 90) — haemodynamic compromise`,
      suggestedAction:
        'Reassess perfusion, consider fluid or inotropic support, and monitor continuously.'
    });
  }

  // ─── Renal impairment (MEDIUM) ──────────────────────────────
  if (creatMgdl !== null && creatMgdl >= 2.0) {
    flags.push({
      id: 'F-RENAL-IMPAIRMENT-001',
      category: 'renal-impairment',
      priority: 'medium',
      description: `Serum creatinine ${creatMgdl.toFixed(2)} mg/dL (>= 2.0) — significant renal impairment`,
      suggestedAction:
        'Account for contrast nephropathy risk and adjust antithrombotic and contrast dosing.'
    });
  }

  // ─── ST-segment deviation (MEDIUM) ──────────────────────────
  if (stDeviation === 'yes') {
    flags.push({
      id: 'F-ST-DEVIATION-001',
      category: 'st-deviation',
      priority: 'medium',
      description: 'ST-segment deviation on the admission ECG — dynamic ischaemia',
      suggestedAction:
        'Repeat the ECG, expedite review, and treat as high-risk ischaemia.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (age === null) missing.push('age');
  if (hr === null) missing.push('heart rate');
  if (sbp === null) missing.push('systolic blood pressure');
  if (creatRaw === null || creatUnit === '') missing.push('serum creatinine (value and unit)');
  if (killip === '') missing.push('Killip class');
  if (arrest === '') missing.push('cardiac arrest at admission');
  if (stDeviation === '') missing.push('ST-segment deviation');
  if (enzymes === '') missing.push('elevated cardiac enzymes');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing GRACE variable input(s): ${missing.join(', ')} — the score may understate risk`,
      suggestedAction:
        'Record the missing admission finding(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
