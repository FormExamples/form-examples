// Flagged-issue detection for the Fall Risk Assessment.
//
// Independent of the raw MFS score (which the grader computes), this module
// raises clinician-facing flags grouped by priority so that the report can
// surface items that influence — or do not influence — the MFS but still
// matter for fall-prevention planning.
//
// Priority bands:
//   high   - acute clinical risks (injurious fall, anticoagulant, severe
//            orthostatic hypotension, dementia, hip protectors absent for
//            a high-risk patient)
//   medium - modifiable contributing factors (polypharmacy, sedatives,
//            uncorrected vision, environmental hazards, footwear)
//   low    - care-process gaps (intervention declined, missed referral)
//
// Flags are sorted high -> medium -> low.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.FallRiskAssessment.
(function () {
'use strict';
window.FallRiskAssessment = window.FallRiskAssessment || {};
const { ancillaryRules, gradeFallRisk } = window.FallRiskAssessment;

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── HIGH priority ────────────────────────────────────────

  if (ancillaryRules.hasRecentInjuriousFall(data)) {
    const detail = data.fallHistory.mostRecentFallInjuryDetails;
    flags.push({
      id: 'FLAG-FALL-001',
      category: 'Fall History',
      message: `Recent injurious fall${detail ? `: ${detail}` : '.'}`,
      priority: 'high'
    });
  }

  if (ancillaryRules.isAnticoagulated(data)) {
    flags.push({
      id: 'FLAG-MED-001',
      category: 'Medications',
      message:
        'Patient is on anticoagulant therapy — markedly elevated bleeding risk if a fall occurs.',
      priority: 'high'
    });
  }

  if (ancillaryRules.hasSevereOrthostaticHypotension(data)) {
    flags.push({
      id: 'FLAG-MOB-001',
      category: 'Mobility',
      message:
        'Severe orthostatic hypotension — review antihypertensives and assess hydration / vasoactive medications.',
      priority: 'high'
    });
  }

  if (ancillaryRules.hasDementia(data)) {
    flags.push({
      id: 'FLAG-COG-001',
      category: 'Cognition',
      message:
        'Diagnosis of dementia — increased fall risk; consider supervision, environmental cues, and carer education.',
      priority: 'high'
    });
  }

  // Hip protectors absent for a high-risk MFS patient: only fire when the
  // grader is reachable; fall back to MFS>=45 check.
  if (ancillaryRules.hipProtectorsAbsent(data)) {
    let high = false;
    try {
      const { severity } = gradeFallRisk(data);
      high = severity === 'high' || severity === 'critical';
    } catch (e) {
      high = false;
    }
    if (high) {
      flags.push({
        id: 'FLAG-ENV-001',
        category: 'Environment',
        message:
          'High fall risk without hip protectors — consider hip protectors for fracture prevention.',
        priority: 'high'
      });
    }
  }

  // ─── MEDIUM priority ──────────────────────────────────────

  if (ancillaryRules.hasPolypharmacy(data)) {
    const count = (data.medicationReview.medications || []).length;
    flags.push({
      id: 'FLAG-MED-002',
      category: 'Medications',
      message:
        count >= 4
          ? `Polypharmacy detected (${count} medications) — schedule a medication review.`
          : 'Polypharmacy reported — schedule a medication review.',
      priority: 'medium'
    });
  }

  if (data.medicationReview.sedativesOrHypnotics === 'yes') {
    flags.push({
      id: 'FLAG-MED-003',
      category: 'Medications',
      message:
        'Sedatives or hypnotics in use — consider deprescribing; counsel on night-time fall risk.',
      priority: 'medium'
    });
  }

  if (
    data.visionSensory.visionImpairment === 'yes' &&
    data.visionSensory.visionCorrected !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-VIS-001',
      category: 'Vision',
      message:
        'Vision impairment uncorrected — refer for ophthalmology / optometry review.',
      priority: 'medium'
    });
  }

  // Environmental hazards: fire one combined flag listing the active
  // hazards, plus a separate footwear flag.
  /** @type {string[]} */
  const envHazards = [];
  if (data.environmental.loosThrowRugs === 'yes') envHazards.push('loose throw rugs');
  if (data.environmental.clutteredWalkways === 'yes') envHazards.push('cluttered walkways');
  if (data.environmental.poorLighting === 'yes') envHazards.push('poor lighting');
  if (data.environmental.stairsWithoutHandrails === 'yes') envHazards.push('stairs without handrails');
  if (data.environmental.bathroomGrabBarsAbsent === 'yes') envHazards.push('no bathroom grab bars');
  if (data.environmental.bedHeightProblem === 'yes') envHazards.push('unsuitable bed height');

  if (envHazards.length > 0) {
    flags.push({
      id: 'FLAG-ENV-002',
      category: 'Environment',
      message: `Environmental hazards present: ${envHazards.join(', ')}.`,
      priority: 'medium'
    });
  }

  if (data.environmental.unsuitableFootwear === 'yes') {
    flags.push({
      id: 'FLAG-ENV-003',
      category: 'Environment',
      message: 'Unsuitable footwear — recommend well-fitting non-slip shoes.',
      priority: 'medium'
    });
  }

  // ─── LOW priority ─────────────────────────────────────────

  if (data.previousInterventions.interventionDeclined === 'yes') {
    flags.push({
      id: 'FLAG-INT-001',
      category: 'Interventions',
      message:
        'Patient has declined a recommended fall-prevention intervention — document, educate, revisit.',
      priority: 'low'
    });
  }

  if (data.previousInterventions.missedReferral === 'yes') {
    flags.push({
      id: 'FLAG-INT-002',
      category: 'Interventions',
      message:
        'Previous referral missed — re-issue (falls clinic, physiotherapy, occupational therapy as appropriate).',
      priority: 'low'
    });
  }

  // Sort: high > medium > low (urgent reserved for future use, sorted first).
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.FallRiskAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
