// Safety-flag detection for the Medical Renal Transplant Recipient Request.
//
// Pure function returning flags using the grade_flag categories from the SQL
// schema. Each flag is { flagId, category, priority, description,
// suggestedAction }. Flag ids are stable and identical across every front-end
// and the back-end.

import type { IdentitySafetyBand, RenalRecipientRequest, SafetyFlag } from './types';
import { requiredSamples } from './rules';

/** Detect safety flags for a renal transplant recipient request. */
export function detectFlags(
  data: RenalRecipientRequest,
  context?: { identitySafetyBand?: IdentitySafetyBand }
): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const ctx = context || {};
  const t = data.tests;
  const h = data.history;

  if (t.deceasedDonorDayOfTransplant || t.livingDonorDayOfTransplant) {
    flags.push({
      flagId: 'F-DAY-OF-TRANSPLANT-001',
      category: 'day-of-transplant-stat',
      priority: 'high',
      description: 'Day-of-transplant crossmatch requested.',
      suggestedAction:
        'Telephone the laboratory now to confirm the sample is expected, and transport with minimum delay.'
    });
  }
  const monitoring =
    t.hlaMonitoringRoutineTransplantList ||
    t.hlaMonitoringRoutinePostTransplant ||
    t.hlaMonitoringPostTransfusion;
  if ((t.livingDonorVirtualCrossmatch || t.livingDonorMatchGrade) && !monitoring) {
    flags.push({
      flagId: 'F-VIRTUAL-XM-001',
      category: 'virtual-crossmatch-without-antibody-profile',
      priority: 'medium',
      description:
        'Virtual crossmatch or match grade requested without a current HLA-antibody monitoring request.',
      suggestedAction:
        'Confirm with the laboratory that a recent HLA-antibody profile exists for this recipient.'
    });
  }
  if (
    (h.previousTransplantCount ?? 0) > 0 ||
    (h.transfusionCount ?? 0) > 0 ||
    (h.pregnancyCount ?? 0) > 0
  ) {
    flags.push({
      flagId: 'F-SENSITISED-001',
      category: 'sensitised-recipient',
      priority: 'medium',
      description:
        'Recipient has a sensitizing event (previous transplant, transfusion or pregnancy).',
      suggestedAction:
        'Expect HLA antibodies; allow time for antibody characterization and unacceptable-mismatch assignment.'
    });
  }
  if (!data.clinical.recipientAboGroup || data.clinical.recipientAboGroup === 'unknown') {
    flags.push({
      flagId: 'F-MISSING-ABO-001',
      category: 'missing-abo-group',
      priority: 'medium',
      description: 'Recipient ABO group is unknown or not recorded.',
      suggestedAction: 'Record the ABO group; ABO compatibility is the first crossmatch gate.'
    });
  }
  if (t.aboIncompatibleMonitoring && !t.dfppStatus) {
    flags.push({
      flagId: 'F-ABOI-DFPP-001',
      category: 'abo-incompatible-without-dfpp-status',
      priority: 'medium',
      description:
        'ABO-incompatible monitoring requested without a DFPP status (pre, post or none).',
      suggestedAction: 'State whether the sample is pre-DFPP, post-DFPP or no DFPP.'
    });
  }
  if (
    requiredSamples(data).need.pink > 0 &&
    !((data.sample.samplesEdtaPinkHandLabelledCount ?? 0) > 0)
  ) {
    flags.push({
      flagId: 'F-HAND-LABELLED-001',
      category: 'hand-labelled-sample-required',
      priority: 'medium',
      description: 'The requested tests need a hand-labelled EDTA tube and none is recorded.',
      suggestedAction:
        'Send a hand-labelled EDTA tube; addressograph labels are not accepted for it.'
    });
  }
  if (ctx.identitySafetyBand === 'reject-risk') {
    flags.push({
      flagId: 'F-IDENTITY-001',
      category: 'identity-mismatch-risk',
      priority: 'high',
      description:
        'Fewer than 3 identifiers on the sample or form: the sample is at risk of being discarded.',
      suggestedAction: 'Re-label the sample and form with at least 3 matching identifiers.'
    });
  }
  if (t.urgentTesting && !String(t.urgentTestingReason || '').trim()) {
    flags.push({
      flagId: 'F-URGENT-REASON-001',
      category: 'urgent-without-reason',
      priority: 'low',
      description: 'Urgent testing requested without a reason.',
      suggestedAction: 'Give the reason so the laboratory can prioritize.'
    });
  }
  if (
    h.previousTransplantCount === null ||
    h.transfusionCount === null ||
    h.pregnancyCount === null
  ) {
    flags.push({
      flagId: 'F-SENSITISATION-UNKNOWN-001',
      category: 'missing-sensitisation-history',
      priority: 'low',
      description: 'Sensitization history is incomplete: unanswered is not the same as none.',
      suggestedAction: 'Enter 0 for none, or the count; leave blank only when unknown.'
    });
  }
  if (t.hlaMonitoringPostTransfusion && !String(t.postTransfusionDatesAndNumber || '').trim()) {
    flags.push({
      flagId: 'F-POST-TRANSFUSION-001',
      category: 'post-transfusion-without-dates',
      priority: 'low',
      description: 'Post-transfusion monitoring requested without transfusion dates and number.',
      suggestedAction: 'Give the date(s) and number of transfusions.'
    });
  }
  return flags;
}
