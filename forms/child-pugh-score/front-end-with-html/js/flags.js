// Flagged-issue detection (red flags). Independent of the total Child-Pugh
// score (which the grader produces), this module raises clinician-facing safety
// flags per spec §5:
//
//   - Decompensated cirrhosis (high)  — childPughClass == 'C'
//   - Transplant consideration (high) — childPughClass == 'C'
//   - High surgical risk (high)       — childPughClass == 'C'
//   - Moderate surgical risk (medium) — childPughClass == 'B'
//   - Hepatic encephalopathy (high)   — encephalopathyPoint >= 2
//   - Refractory ascites (high)       — ascitesPoint == 3
//   - Severe coagulopathy (medium)    — coagulationPoint == 3
//   - Incomplete assessment (low)     — any of the five parameter inputs missing
//
// Rows here mirror the `child_pugh_score_grade_flag` SQL table (flag_id,
// category, priority, description, suggested_action). Categories are drawn from
// the SQL CHECK constraint: class-c-decompensated, high-surgical-risk,
// encephalopathy, refractory-ascites, incomplete-assessment, other.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ChildPughScore.

/**
 * @param {AssessmentData} data
 * @param {import('./grader.js')} grade - grading result from calculateChildPughGrade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const {
    childPughClass,
    childPughScore,
    coagulationPoint,
    ascitesPoint,
    encephalopathyPoint,
    complete
  } = grade;

  // ─── Decompensated cirrhosis (HIGH) ─────────────────────────
  if (childPughClass === 'C' && complete) {
    flags.push({
      id: 'F-CLASS-C-DECOMPENSATED-001',
      category: 'class-c-decompensated',
      priority: 'high',
      description: `Child-Pugh Class C (score ${childPughScore}) — decompensated cirrhosis with poor prognosis (~45% one-year survival).`,
      suggestedAction:
        'Review goals of care, optimise management of decompensation, and involve the hepatology team.'
    });

    // ─── Transplant consideration (HIGH) ──────────────────────
    flags.push({
      id: 'F-TRANSPLANT-CONSIDERATION-001',
      category: 'class-c-decompensated',
      priority: 'high',
      description: 'Class C signals advanced liver disease — liver-transplant assessment may be appropriate.',
      suggestedAction:
        'Refer for transplant assessment where clinically appropriate, and calculate MELD / UKELD for allocation.'
    });
  }

  // ─── Surgical risk (HIGH for C, MEDIUM for B) ────────────────
  if (childPughClass === 'C' && complete) {
    flags.push({
      id: 'F-HIGH-SURGICAL-RISK-001',
      category: 'high-surgical-risk',
      priority: 'high',
      description: 'High peri-operative mortality (~80%) — elective surgery carries prohibitive risk in Class C.',
      suggestedAction:
        'Avoid elective surgery; if surgery is unavoidable, involve senior anaesthetic and hepatology teams and counsel on risk.'
    });
  } else if (childPughClass === 'B' && complete) {
    flags.push({
      id: 'F-MODERATE-SURGICAL-RISK-001',
      category: 'high-surgical-risk',
      priority: 'medium',
      description: 'Moderate peri-operative mortality (~30%) — elective surgery carries raised risk in Class B.',
      suggestedAction:
        'Optimise before elective surgery, involve anaesthetics early, and discuss risk with the patient.'
    });
  }

  // ─── Hepatic encephalopathy (HIGH) ───────────────────────────
  if (encephalopathyPoint !== null && encephalopathyPoint >= 2) {
    flags.push({
      id: 'F-ENCEPHALOPATHY-001',
      category: 'encephalopathy',
      priority: 'high',
      description: 'Overt hepatic encephalopathy present (grade 1 or worse).',
      suggestedAction:
        'Identify and treat precipitants, start / optimise lactulose ± rifaximin, and assess for aspiration risk.'
    });
  }

  // ─── Refractory ascites (HIGH) ───────────────────────────────
  if (ascitesPoint === 3) {
    flags.push({
      id: 'F-REFRACTORY-ASCITES-001',
      category: 'refractory-ascites',
      priority: 'high',
      description: 'Moderate-to-severe (diuretic-refractory) ascites.',
      suggestedAction:
        'Review diuretic therapy, consider paracentesis, and assess for spontaneous bacterial peritonitis and TIPSS candidacy.'
    });
  }

  // ─── Severe coagulopathy (MEDIUM) ────────────────────────────
  if (coagulationPoint === 3) {
    flags.push({
      id: 'F-SEVERE-COAGULOPATHY-001',
      category: 'other',
      priority: 'medium',
      description: 'Markedly prolonged INR / prothrombin time (3-point coagulation band).',
      suggestedAction:
        'Assess bleeding risk before invasive procedures; standard clotting products correct laboratory values only transiently.'
    });
  }

  // ─── Incomplete assessment (LOW) ─────────────────────────────
  if (!complete) {
    const missing = [];
    if (grade.bilirubinPoint === null) missing.push('total bilirubin');
    if (grade.albuminPoint === null) missing.push('serum albumin');
    if (grade.coagulationPoint === null) missing.push('coagulation (INR or prothrombin time)');
    if (grade.ascitesPoint === null) missing.push('ascites');
    if (grade.encephalopathyPoint === null) missing.push('hepatic encephalopathy');
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing parameter input(s): ${missing.join(', ')} — the score and class are provisional.`,
      suggestedAction:
        'Record the missing parameter(s) and re-score; a Child-Pugh total is only valid once all five parameters are answered.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
