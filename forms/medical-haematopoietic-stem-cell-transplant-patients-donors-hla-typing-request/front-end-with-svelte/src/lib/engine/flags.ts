// Safety-flag detection for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request.
//
// Pure function returning flags using the grade_flag categories from the SQL
// schema. Each flag is { flagId, category, priority, description,
// suggestedAction }. Flag ids are stable and identical across every front-end
// and the back-end.

import type { HsctTypingRequest, IdentitySafetyBand, SafetyFlag } from './types';
import { hasRecipientDetails, shortTubes } from './rules';

const filled = (v: unknown): boolean => String(v ?? '').trim() !== '';

/** Detect every safety flag the request raises. */
export function detectFlags(
  data: HsctTypingRequest,
  context: { identitySafetyBand?: IdentitySafetyBand } = {}
): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const q = data.request;

  if (q.subjectRole === 'potential-donor' && !hasRecipientDetails(data)) {
    flags.push({
      flagId: 'F-DONOR-NO-RECIPIENT-001',
      category: 'donor-without-recipient-details',
      priority: 'high',
      description: 'Potential donor with no recipient name and record number.',
      suggestedAction:
        'Give the recipient name, record number and relationship so the laboratory can pair the samples.'
    });
  }
  if (q.subjectRole && shortTubes(data).length > 0) {
    flags.push({
      flagId: 'F-VOLUME-001',
      category: 'sample-volume-insufficient',
      priority: 'medium',
      description:
        'Recorded volume is below the requirement for this role: ' +
        shortTubes(data).join(', ') +
        '.',
      suggestedAction:
        'Send the full volumes; the laboratory cannot type from an insufficient sample.'
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
  if (data.urgency.urgentTesting && !filled(data.urgency.urgentTestingReason)) {
    flags.push({
      flagId: 'F-URGENT-REASON-001',
      category: 'urgent-without-reason',
      priority: 'low',
      description: 'Urgent testing requested without a reason.',
      suggestedAction: 'Give the reason and telephone the laboratory so it can prioritize.'
    });
  }
  if (!filled(data.subject.ethnicity)) {
    flags.push({
      flagId: 'F-ETHNICITY-001',
      category: 'missing-ethnicity',
      priority: 'low',
      description: 'Ethnicity is blank; allele frequencies differ by population.',
      suggestedAction: 'Record the self-described ethnicity.'
    });
  }
  if (!filled(q.clinicalDetails)) {
    flags.push({
      flagId: 'F-NO-DETAILS-001',
      category: 'no-clinical-details',
      priority: 'medium',
      description: 'No clinical details were given.',
      suggestedAction: 'Give the disease and the indication for transplant or donation.'
    });
  }
  if (q.donorType === 'unrelated-volunteer' && filled(data.recipient.relationshipToRecipient)) {
    flags.push({
      flagId: 'F-UNRELATED-RELATIONSHIP-001',
      category: 'other',
      priority: 'low',
      description:
        'Donor type is unrelated volunteer but a relationship to the recipient is given.',
      suggestedAction: 'Correct the donor type or clear the relationship.'
    });
  }
  return flags;
}
