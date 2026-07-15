import { countAdjustments } from './rules.js';

// Safety-flag ("flagged issues for occupational health") detection for the
// Return to Work engine.
//
// Ported byte-for-byte from the Svelte engine
// (`src/lib/engine/flagged-issues.ts`). Each flag is
// { id, category, message, priority }. Flag IDs (FLAG-*) are stable and
// identical across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.ReturnToWork`.

/** True if any high-risk adjustment requiring a formal risk assessment is set. */
function hasHighRiskAdjustment(data) {
  const a = data.adjustments;
  return (
    a.noWorkingAtHeight ||
    a.noOperatingMachinery ||
    a.noLoneWorking ||
    a.noPatientContact ||
    a.noExposure.trim() !== ''
  );
}

/**
 * Detects safety flags for the occupational-health team, computed
 * independently of the fitness statement. Priority: high / medium / low.
 *
 * @param {object} data - the assessment data model
 * @returns {object[]} additional flags
 */
function detectAdditionalFlags(data) {
  const flags = [];

  // ─── Safety-critical role with active restriction (HIGH) ────────
  if (data.job.safetyCritical === 'yes' && countAdjustments(data) >= 1) {
    flags.push({
      id: 'FLAG-SAFETY-001',
      category: 'Safety-critical role',
      message: 'Safety-critical role with an active restriction — formal risk assessment required.',
      priority: 'high'
    });
  }

  // ─── DVLA-notifiable role (HIGH) ────────────────────────────────
  if (data.job.dvlaNotifiableRole === 'yes') {
    flags.push({
      id: 'FLAG-DVLA-001',
      category: 'DVLA',
      message: 'DVLA-notifiable role — confirm fitness to drive and notification status.',
      priority: 'high'
    });
  }

  // ─── Workplace cause without RIDDOR reference (HIGH) ─────────────
  if (data.diagnosis.workplaceCause === 'yes' && data.diagnosis.riddorReference.trim() === '') {
    flags.push({
      id: 'FLAG-RIDDOR-001',
      category: 'RIDDOR',
      message: 'Workplace cause recorded with no RIDDOR reference — check reporting obligation.',
      priority: 'high'
    });
  }

  // ─── Mental-health diagnosis without follow-up (HIGH) ───────────
  if (data.diagnosis.mechanism === 'mental-health' && data.followUp.reviewDate === '') {
    flags.push({
      id: 'FLAG-MH-001',
      category: 'Mental health',
      message: 'Mental-health diagnosis with no review date set — arrange follow-up.',
      priority: 'high'
    });
  }

  // ─── Phased return without target date (MEDIUM) ─────────────────
  if (data.phasedReturn.applicable === 'yes' && data.phasedReturn.targetFullHoursDate === '') {
    flags.push({
      id: 'FLAG-PHASED-001',
      category: 'Phased return',
      message: 'Phased return selected without a target full-hours date.',
      priority: 'medium'
    });
  }

  // ─── High-risk adjustment without risk-assessment trigger (MEDIUM)
  if (hasHighRiskAdjustment(data) && data.adjustments.workstationReviewRequired === 'no') {
    flags.push({
      id: 'FLAG-RA-001',
      category: 'Risk assessment',
      message: 'High-risk adjustment selected but no workplace review requested.',
      priority: 'medium'
    });
  }

  // ─── Incapacity > 28 days without OH referral (MEDIUM) ──────────
  if (
    data.absence.totalDaysAbsent !== null &&
    data.absence.totalDaysAbsent > 28 &&
    data.followUp.ohReferralMade !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-OH-001',
      category: 'Occupational health',
      message: `Absence of ${data.absence.totalDaysAbsent} days with no occupational-health referral.`,
      priority: 'medium'
    });
  }

  // ─── Pregnancy-related absence without maternity flag (MEDIUM) ───
  if (data.diagnosis.mechanism === 'pregnancy-related' && data.absence.priorMed3Ref.trim() === '') {
    flags.push({
      id: 'FLAG-MAT-001',
      category: 'Maternity',
      message: 'Pregnancy-related absence with no MAT B1 / prior certificate reference on file.',
      priority: 'medium'
    });
  }

  // ─── Clinician confidence "low" without review (LOW) ────────────
  if (data.fitness.clinicianConfidence === 'low' && data.followUp.reviewDate === '') {
    flags.push({
      id: 'FLAG-CONF-001',
      category: 'Clinician confidence',
      message: 'Clinician confidence marked low without a follow-up review date.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags, hasHighRiskAdjustment };
