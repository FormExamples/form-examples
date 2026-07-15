import { isComplete } from './grader.js';

// Flagged-issue detection (red flags). Independent of the derived screening
// outcome (which the grader produces), this module raises clinician-facing
// safety flags per spec §5:
//
//   - Symptomatic — wrong pathway (high)   — symptomatic == 'yes'
//   - Suspicious / malignant (high)        — imagingClassification 4 or 5
//   - Recall for assessment (medium)       — recall-for-assessment, not yet assessed
//   - Indeterminate result (medium)        — imagingClassification == 3
//   - Technical repeat (medium)            — technical-repeat or image inadequate
//   - Consent not given (medium)           — consentGiven answered and not 'yes'
//   - Outside eligible age range (low)     — routine episode, age < 50 or > 70
//   - Overdue (low)                        — last screened > ~36 months ago
//   - Incomplete record (low)              — any required input missing
//
// Rows here mirror the `breast_screening_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').ScreeningData} ScreeningData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.BreastScreening.

// Roughly the recall interval, in whole months.
const OVERDUE_MONTHS = 36;

/**
 * Whole months between an ISO date string and now (positive when in the past).
 * Returns null when the date is missing or unparseable.
 * @param {string} isoDate
 * @returns {number | null}
 */
function monthsSince(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (isNaN(then.getTime())) return null;
  const now = new Date();
  let months =
    (now.getFullYear() - then.getFullYear()) * 12 +
    (now.getMonth() - then.getMonth());
  if (now.getDate() < then.getDate()) months -= 1;
  return months;
}

/**
 * @param {ScreeningData} data
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const symptomatic = data.eligibility.symptomatic;
  const consent = data.eligibility.consentGiven;
  const adequacy = data.mammogram.imageAdequacy;
  const readingOutcome = data.reading.readingOutcome;
  const assessed = data.assessment.assessmentPerformed;
  const cls = data.assessment.imagingClassification;
  const episodeType = data.context.episodeType;
  const age = data.identification.ageYears;

  // ─── Symptomatic — wrong pathway (HIGH) ─────────────────────
  if (symptomatic === 'yes') {
    flags.push({
      id: 'F-SYMPTOMATIC-WRONG-PATHWAY-001',
      category: 'symptomatic-wrong-pathway',
      priority: 'high',
      description: 'A breast symptom is reported — screening is not the correct pathway',
      suggestedAction:
        'Refer via the symptomatic breast pathway (two-week-wait as appropriate), not the screening programme.'
    });
  }

  // ─── Suspicious / malignant (HIGH) ──────────────────────────
  if (cls === 4 || cls === 5) {
    flags.push({
      id: 'F-SUSPICIOUS-MALIGNANT-001',
      category: 'suspicious-malignant',
      priority: 'high',
      description: `Imaging classification ${cls} — ${cls === 5 ? 'malignant' : 'suspicious'} appearance`,
      suggestedAction:
        'Urgent breast-clinic referral: obtain tissue diagnosis and discuss at the breast MDT.'
    });
  }

  // ─── Recall for assessment (MEDIUM) ─────────────────────────
  if (readingOutcome === 'recall-for-assessment' && assessed !== 'yes') {
    flags.push({
      id: 'F-RECALL-FOR-ASSESSMENT-001',
      category: 'recall-for-assessment',
      priority: 'medium',
      description: 'Reading outcome is recall for assessment and the assessment clinic is not yet attended',
      suggestedAction: 'Book the woman into an assessment clinic and record the assessment result.'
    });
  }

  // ─── Indeterminate result (MEDIUM) ──────────────────────────
  if (cls === 3) {
    flags.push({
      id: 'F-INDETERMINATE-RESULT-001',
      category: 'indeterminate-result',
      priority: 'medium',
      description: 'Imaging classification 3 — indeterminate / probably benign',
      suggestedAction: 'Short-interval follow-up or biopsy per local protocol.'
    });
  }

  // ─── Technical repeat (MEDIUM) ──────────────────────────────
  if (readingOutcome === 'technical-repeat' || adequacy === 'inadequate') {
    flags.push({
      id: 'F-TECHNICAL-REPEAT-001',
      category: 'technical-repeat',
      priority: 'medium',
      description: adequacy === 'inadequate'
        ? 'Image adequacy is inadequate — the mammogram cannot be reported reliably'
        : 'Reading outcome is technical repeat',
      suggestedAction: 'Repeat the mammogram, addressing positioning, exposure, or movement.'
    });
  }

  // ─── Consent not given (MEDIUM) ─────────────────────────────
  if (consent !== '' && consent !== 'yes') {
    flags.push({
      id: 'F-CONSENT-NOT-GIVEN-001',
      category: 'consent-not-given',
      priority: 'medium',
      description: `Consent recorded as "${consent}" — informed consent to image was not given`,
      suggestedAction: 'Do not proceed; record the declination and offer information and a further appointment.'
    });
  }

  // ─── Outside eligible age range (LOW) ───────────────────────
  if (episodeType === 'routine-recall' && age !== null && (age < 50 || age > 70)) {
    flags.push({
      id: 'F-OUTSIDE-AGE-RANGE-001',
      category: 'outside-age-range',
      priority: 'low',
      description: `Age ${age} is outside the routine eligible range (50–70) for a routine-recall episode`,
      suggestedAction: 'Confirm eligibility and route to the correct pathway or invitation cohort.'
    });
  }

  // ─── Overdue (LOW) ──────────────────────────────────────────
  const monthsAgo = monthsSince(data.identification.lastScreenedDate);
  if (monthsAgo !== null && monthsAgo > OVERDUE_MONTHS) {
    flags.push({
      id: 'F-OVERDUE-001',
      category: 'overdue',
      priority: 'low',
      description: `Last screened about ${monthsAgo} months ago — beyond the ~${OVERDUE_MONTHS}-month recall interval`,
      suggestedAction: 'Confirm the woman is due and issue the recall invitation.'
    });
  }

  // ─── Incomplete record (LOW) ────────────────────────────────
  if (!isComplete(data)) {
    flags.push({
      id: 'F-INCOMPLETE-RECORD-001',
      category: 'incomplete-record',
      priority: 'low',
      description: 'One or more required inputs are missing — the outcome cannot be finalised',
      suggestedAction: 'Complete eligibility, consent, views, image adequacy, the reading outcome, and (after a recall) the imaging classification.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
