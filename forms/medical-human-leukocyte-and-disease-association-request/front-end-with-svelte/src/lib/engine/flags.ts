// Safety-flag detection for the Medical Human Leukocyte and Disease Association
// Request.
//
// Pure function returning flags using the grade_flag categories from the SQL
// schema. Each flag is { flagId, category, priority, description,
// suggestedAction }. Flag ids are stable and identical across every front-end
// and the back-end.

import type { HlaAssociationRequest, IdentitySafetyBand, SafetyFlag } from './types';

const filled = (v: unknown): boolean => String(v ?? '').trim() !== '';

/** Detect every safety flag the request raises. */
export function detectFlags(
  data: HlaAssociationRequest,
  context: { identitySafetyBand?: IdentitySafetyBand } = {}
): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const t = data.tests;
  const c = data.clinical;

  if (!filled(c.clinicalDetails)) {
    flags.push({
      flagId: 'F-NO-DETAILS-001',
      category: 'no-clinical-details',
      priority: 'medium',
      description: 'No clinical details were given.',
      suggestedAction:
        'Give the suspected condition or the reason for the test so the laboratory can vet the request.'
    });
  }
  if (t.hlaB5701 && filled(c.plannedDrug)) {
    flags.push({
      flagId: 'F-ABACAVIR-001',
      category: 'abacavir-start-pending',
      priority: 'high',
      description:
        'HLA-B*57:01 requested with a planned drug (' +
        String(c.plannedDrug).trim() +
        '): the prescription waits for the result.',
      suggestedAction:
        'Treat as a time-critical pre-prescribing test and do not start the drug until the result is back.'
    });
  }
  if (c.previousHlaTypingKnown === true) {
    flags.push({
      flagId: 'F-PREVIOUS-HLA-001',
      category: 'previous-hla-result-possible-duplicate',
      priority: 'medium',
      description: 'The patient has already been HLA typed; an HLA type is lifelong.',
      suggestedAction: 'Ask the laboratory for the earlier result before sending a new sample.'
    });
  }
  if (data.urgency.highRiskSample === true) {
    flags.push({
      flagId: 'F-HIGH-RISK-001',
      category: 'high-risk-sample',
      priority: 'high',
      description:
        'The sample is flagged as high risk' +
        (filled(data.urgency.highRiskDescription)
          ? ': ' + String(data.urgency.highRiskDescription).trim()
          : '') +
        '.',
      suggestedAction:
        'Confirm the sample is labelled and packaged as high risk, and warn the laboratory.'
    });
  }
  if (context.identitySafetyBand === 'reject-risk') {
    flags.push({
      flagId: 'F-IDENTITY-001',
      category: 'identity-mismatch-risk',
      priority: 'high',
      description:
        'Fewer than 3 identifiers on the sample or form: the sample is at risk of being discarded.',
      suggestedAction: 'Re-label the sample and form with at least 3 matching identifiers.'
    });
  }
  if (!filled(data.referrer.reportEmail) && !filled(data.referrer.copyOfReportTo)) {
    flags.push({
      flagId: 'F-REPORT-DEST-001',
      category: 'report-destination-missing',
      priority: 'low',
      description: 'No report email or copy-to destination given.',
      suggestedAction: 'Give an authorized secure email address or a copy-to name for the report.'
    });
  }
  if (t.hlaDqa105) {
    flags.push({
      flagId: 'F-LIMITED-EVIDENCE-001',
      category: 'other',
      priority: 'low',
      description: 'HLA-DQA1*05 for anti-TNF response is an emerging use with limited evidence.',
      suggestedAction: 'Confirm the result will change management before sending the sample.'
    });
  }
  if (data.urgency.urgentTesting && !filled(data.urgency.urgentTestingReason)) {
    flags.push({
      flagId: 'F-URGENT-REASON-001',
      category: 'other',
      priority: 'low',
      description: 'Urgent testing requested without a reason.',
      suggestedAction: 'Give the reason so the laboratory can prioritize.'
    });
  }
  return flags;
}
