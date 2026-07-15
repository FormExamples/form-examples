import { hasAnyStatusFlag, hasText } from './types.js';

// Detects clinically significant issues in a WHO Counter-Referral Form
// submission. These are independent of pure completeness — for example, the
// patient may have an urgent follow-up timeframe (which still requires the
// primary care facility to be alerted in <24h), or the referral facility may
// have failed to discuss the patient's care with the receiving primary care
// provider before discharge.
//
// Priorities (urgent -> high -> medium -> low) drive sort order in the report.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Urgent follow-up timeframe (urgent) ──────────────────
  if (data.facilityDetails.followUpTimeframe === 'urgent-within-24-hours') {
    flags.push({
      id: 'FLAG-FU-001',
      category: 'Follow-up',
      message:
        'Urgent follow-up required within 24 hours — primary care facility must be alerted immediately.',
      priority: 'urgent'
    });
  }

  // ─── Missing deterioration instructions (urgent) ──────────
  if (!hasText(data.recommendations.deteriorationInstructions)) {
    flags.push({
      id: 'FLAG-DET-001',
      category: 'Deterioration plan',
      message:
        "No instructions provided for what to do if the patient's condition deteriorates.",
      priority: 'urgent'
    });
  }

  // ─── Communication breakdown (high) ───────────────────────
  if (
    !data.facilityDetails.communication.discussedWithPrimaryCareProvider &&
    !data.facilityDetails.communication.discussedWithInitiatingFacility
  ) {
    flags.push({
      id: 'FLAG-COM-001',
      category: 'Communication',
      message:
        'Referral facility did not discuss follow-up care with either the primary care provider or the initiating facility.',
      priority: 'high'
    });
  }

  // ─── Palliative care (high) ───────────────────────────────
  if (data.recommendations.statusFlags.palliativeCare) {
    flags.push({
      id: 'FLAG-PAL-001',
      category: 'Palliative care',
      message:
        'Patient is on a palliative care pathway — ensure goals of care and family wishes are documented and shared.',
      priority: 'high'
    });
  }

  // ─── Patient/family not informed (high) ───────────────────
  if (data.assessment.patientFamilyInformed === 'no') {
    flags.push({
      id: 'FLAG-INF-001',
      category: 'Patient communication',
      message:
        'Patient/family have not been informed of the diagnosis — primary care provider should follow up at first contact.',
      priority: 'high'
    });
  }

  // ─── ICU stay during admission (medium) ───────────────────
  if (data.situation.icuStay) {
    flags.push({
      id: 'FLAG-ICU-001',
      category: 'ICU stay',
      message: 'Patient was admitted to the ICU during the referral episode.',
      priority: 'medium'
    });
  }

  // ─── Surgery during admission (medium) ────────────────────
  if (data.situation.surgery) {
    flags.push({
      id: 'FLAG-SURG-001',
      category: 'Surgery',
      message:
        'Patient underwent surgery during the referral episode — review wound care and post-operative monitoring needs.',
      priority: 'medium'
    });
  }

  // ─── Pregnancy (medium) ───────────────────────────────────
  if (data.situation.pregnant === 'yes') {
    flags.push({
      id: 'FLAG-PREG-001',
      category: 'Pregnancy',
      message: 'Patient is pregnant — coordinate antenatal follow-up with primary care.',
      priority: 'medium'
    });
  }

  // ─── Cognitive impairment (medium) ────────────────────────
  if (data.recommendations.statusFlags.cognitiveImpairment) {
    flags.push({
      id: 'FLAG-COG-001',
      category: 'Cognitive impairment',
      message:
        'Cognitive impairment status flag set — ensure carer or family are present at follow-up appointments.',
      priority: 'medium'
    });
  }

  // ─── Carer-dependent (medium) ─────────────────────────────
  if (data.recommendations.statusFlags.carerDependent) {
    flags.push({
      id: 'FLAG-CAR-001',
      category: 'Carer-dependent',
      message: 'Patient is carer-dependent — confirm support is in place before discharge.',
      priority: 'medium'
    });
  }

  // ─── Spinal precautions (medium) ──────────────────────────
  if (data.recommendations.statusFlags.spinalPrecautions) {
    flags.push({
      id: 'FLAG-SPN-001',
      category: 'Spinal precautions',
      message:
        'Spinal precautions flagged — primary care should reinforce handling and mobilisation guidance.',
      priority: 'medium'
    });
  }

  // ─── Weight-bearing restrictions (medium) ─────────────────
  if (data.recommendations.statusFlags.weightBearingRestrictions) {
    flags.push({
      id: 'FLAG-WB-001',
      category: 'Weight-bearing',
      message:
        'Weight-bearing restrictions flagged — review with patient and arrange physiotherapy follow-up.',
      priority: 'medium'
    });
  }

  // ─── Pending investigations (low) ─────────────────────────
  if (hasText(data.recommendations.pendingInvestigations)) {
    flags.push({
      id: 'FLAG-INV-001',
      category: 'Pending investigations',
      message: 'Investigation results are still pending and require chase-up at follow-up.',
      priority: 'low'
    });
  }

  // ─── Hospitalised (low) ───────────────────────────────────
  if (
    data.situation.hospitalized &&
    !data.situation.icuStay &&
    !data.situation.surgery
  ) {
    flags.push({
      id: 'FLAG-HOSP-001',
      category: 'Hospitalisation',
      message: 'Patient was hospitalised during the referral episode.',
      priority: 'low'
    });
  }

  // ─── Any other status flag (low summary) — only emit when nothing else covered them. ───
  // Skip: cognitive/carer/spinal/wb/palliative are already individually flagged above.
  // Kept as a safety net for future status flag additions.
  if (
    hasAnyStatusFlag(data) &&
    !data.recommendations.statusFlags.cognitiveImpairment &&
    !data.recommendations.statusFlags.carerDependent &&
    !data.recommendations.statusFlags.spinalPrecautions &&
    !data.recommendations.statusFlags.weightBearingRestrictions &&
    !data.recommendations.statusFlags.palliativeCare
  ) {
    flags.push({
      id: 'FLAG-STAT-000',
      category: 'Status',
      message: 'A status flag is set for this patient — review recommendations carefully.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
