// Flagged-issue detection (action flags). Independent of the grades (which the
// grader produces), this module raises clinician-facing flags per spec §5:
//
//   - Escalate therapy (high)        — abeGroup == 'E' (frequent exacerbations)
//   - Smoking cessation (high)       — smokingStatus == 'current'
//   - Poor inhaler technique (high)  — technique not adequate or not checked
//   - Missing vaccinations (medium)  — any of flu / pneumococcal / COVID not up-to-date
//   - Pulmonary-rehab candidate (medium) — MRC ≥ 3 and not completed / referred
//   - Incomplete review (low)        — any core review element missing
//
// Rows here mirror the `..._grade_flag` SQL table (flag_id, category, priority,
// description, suggested_action).

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ChronicObstructivePulmonaryDiseaseReview.
(function () {
'use strict';
window.ChronicObstructivePulmonaryDiseaseReview =
  window.ChronicObstructivePulmonaryDiseaseReview || {};

/**
 * @param {ReviewData} data
 * @param {{ abeGroup: ('A'|'B'|'E'|null), reviewStatus: ('complete'|'partial'|'incomplete') }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const mod = data.exacerbations.exacerbationsLast12m;
  const hosp = data.exacerbations.hospitalisationsLast12m;
  const smoking = data.smoking.smokingStatus;
  const checked = data.inhaler.inhalerTechniqueChecked;
  const adequate = data.inhaler.inhalerTechniqueAdequate;
  const mrc = data.symptoms.mrcGrade;
  const rehab = data.rehab.pulmonaryRehabStatus;
  const vax = data.vaccinations;

  // ─── Escalate therapy — high exacerbation risk (HIGH) ─────────
  if (grade.abeGroup === 'E') {
    const detail = [];
    if (mod !== null && mod >= 2) detail.push(`${mod} moderate exacerbation(s)`);
    if (hosp !== null && hosp >= 1) detail.push(`${hosp} hospitalised exacerbation(s)`);
    flags.push({
      id: 'F-ESCALATE-THERAPY-001',
      category: 'escalate-therapy',
      priority: 'high',
      description:
        `High exacerbation risk (ABE group E${detail.length ? ': ' + detail.join(', ') : ''}) in the past 12 months`,
      suggestedAction:
        'Review maintenance inhaled therapy and consider escalation (e.g. LABA+LAMA, or add ICS per phenotype); reinforce the self-management / rescue-pack plan.'
    });
  }

  // ─── Current smoker (HIGH) ────────────────────────────────────
  if (smoking === 'current') {
    flags.push({
      id: 'F-SMOKING-CESSATION-001',
      category: 'smoking-cessation',
      priority: 'high',
      description:
        'Patient is a current smoker — the single most effective intervention in COPD is smoking cessation',
      suggestedAction:
        'Offer very-brief advice and refer to stop-smoking support with pharmacotherapy (e.g. NRT, varenicline).'
    });
  }

  // ─── Poor / unchecked inhaler technique (HIGH) ────────────────
  if (adequate === 'no' || checked === 'no') {
    const detail =
      adequate === 'no'
        ? 'Inhaler technique assessed as not adequate'
        : 'Inhaler technique not checked this review';
    flags.push({
      id: 'F-POOR-INHALER-TECHNIQUE-001',
      category: 'poor-inhaler-technique',
      priority: 'high',
      description: `${detail} — poor technique undermines inhaled-therapy effectiveness`,
      suggestedAction:
        'Re-educate on device technique, re-assess, and consider a device better suited to the patient.'
    });
  }

  // ─── Missing vaccinations (MEDIUM) ────────────────────────────
  const dueVax = [];
  if (vax.influenzaVaccine !== '' && vax.influenzaVaccine !== 'up-to-date') dueVax.push('influenza');
  if (vax.pneumococcalVaccine !== '' && vax.pneumococcalVaccine !== 'up-to-date') dueVax.push('pneumococcal');
  if (vax.covidVaccine !== '' && vax.covidVaccine !== 'up-to-date') dueVax.push('COVID-19');
  if (dueVax.length > 0) {
    flags.push({
      id: 'F-MISSING-VACCINATIONS-001',
      category: 'missing-vaccinations',
      priority: 'medium',
      description: `Vaccination(s) not up to date: ${dueVax.join(', ')}`,
      suggestedAction:
        'Offer or recall the outstanding vaccination(s); record declines with the reason.'
    });
  }

  // ─── Pulmonary-rehab candidate (MEDIUM) ───────────────────────
  if (mrc !== null && mrc >= 3 && rehab !== 'completed' && rehab !== 'referred') {
    flags.push({
      id: 'F-PULMONARY-REHAB-001',
      category: 'pulmonary-rehab',
      priority: 'medium',
      description:
        `MRC dyspnoea grade ${mrc} (≥ 3) without a completed or in-progress pulmonary-rehabilitation referral`,
      suggestedAction:
        'Refer for pulmonary rehabilitation — it improves exercise capacity, symptoms, and quality of life.'
    });
  }

  // ─── Incomplete review (LOW) ──────────────────────────────────
  if (grade.reviewStatus === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-REVIEW-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'One or more core review elements are missing — the classification may not reflect the full picture',
      suggestedAction:
        'Complete the outstanding core element(s) (spirometry, symptom measure, exacerbation history, smoking, inhaler check, vaccinations, pulmonary-rehab status, self-management plan) and re-grade.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.ChronicObstructivePulmonaryDiseaseReview.detectFlaggedIssues =
  detectFlaggedIssues;
})();
