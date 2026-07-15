import { hasNumber } from './grader.js';
import { INADEQUATE_SAMPLE } from './rules.js';

// Flagged-issue detection (red flags). Fired independently of the result class
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Positive screen (high)             — resultClass == 'positive'
//   - Symptomatic suspected cancer (high)— redFlagSymptoms == 'yes'
//   - Kit not returned / overdue (medium)— kitReturned == 'no'
//   - Spoilt / inadequate kit (medium)   — sampleAdequacy in (spoilt/insufficient/expired)
//   - Incomplete result (low)            — returned & adequate but faecalHb missing
//
// Rows here mirror the `bowel_cancer_screening_fit_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). Note that the
// symptomatic-suspected-cancer flag is orthogonal to the FIT result: a negative
// screen does not exclude cancer in a symptomatic participant.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @param {{ resultClass: string, symptomaticPathway: boolean, status: string }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const kitReturned = data.kit.kitReturned;
  const sampleAdequacy = data.kit.sampleAdequacy;
  const faecalHb = data.result.faecalHaemoglobinUgG;
  const redFlagSymptoms = data.symptoms.redFlagSymptoms;

  // ─── Positive screen (HIGH) ─────────────────────────────────
  if (grade.resultClass === 'positive') {
    const shown = hasNumber(faecalHb) ? `${faecalHb} ug Hb/g` : 'above threshold';
    flags.push({
      id: 'F-POSITIVE-COLONOSCOPY-001',
      category: 'positive-colonoscopy-referral',
      priority: 'high',
      description: `Faecal haemoglobin ${shown} at or above the programme threshold — positive screen`,
      suggestedAction:
        'Refer for colonoscopy via the screening colonoscopy pathway and inform the participant of the positive result.'
    });
  }

  // ─── Symptomatic — suspected cancer (HIGH) ──────────────────
  if (redFlagSymptoms === 'yes') {
    flags.push({
      id: 'F-SYMPTOMATIC-SUSPECTED-CANCER-001',
      category: 'symptomatic-suspected-cancer',
      priority: 'high',
      description:
        'Red-flag symptoms reported — route to the urgent suspected-cancer pathway regardless of the FIT result; a negative screen does not exclude cancer',
      suggestedAction:
        'Refer on the urgent suspected lower-gastrointestinal cancer pathway per NICE NG12 / NG151 and correlate with the symptomatic FIT threshold (NICE DG56).'
    });
  }

  // ─── Kit not returned / overdue (MEDIUM) ────────────────────
  if (kitReturned === 'no') {
    flags.push({
      id: 'F-NON-RETURN-001',
      category: 'non-return',
      priority: 'medium',
      description: 'FIT kit not returned — no sample to classify',
      suggestedAction:
        'Send a reminder and reissue the FIT kit; record the non-participation for the screening episode.'
    });
  }

  // ─── Spoilt / inadequate kit (MEDIUM) ───────────────────────
  if (INADEQUATE_SAMPLE.indexOf(sampleAdequacy) !== -1) {
    const reason = data.kit.spoiltReason ? ` (${data.kit.spoiltReason})` : '';
    flags.push({
      id: 'F-SPOILT-KIT-001',
      category: 'spoilt-kit',
      priority: 'medium',
      description: `Sample ${sampleAdequacy}${reason} — no valid faecal haemoglobin result`,
      suggestedAction:
        'Reissue a FIT kit with instructions to avoid the spoilage cause and repeat the test.'
    });
  }

  // ─── Incomplete result (LOW) ────────────────────────────────
  if (grade.status === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'Kit returned and adequate but no faecal haemoglobin value recorded — the result cannot be classified',
      suggestedAction:
        'Obtain the assay value from the laboratory, then re-run the classification.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
