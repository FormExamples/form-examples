// Safety-flag detection for the Medical Renal Living Donor Request.
//
// Pure function returning flags using the grade_flag categories from the SQL
// schema. Each flag is { flagId, category, priority, description,
// suggestedAction }. Flag ids are stable and identical across every front-end
// and the back-end.

import { aboIncompatiblePair, requiredSamples } from './rules.js';

const known = (abo) => ['a', 'b', 'ab', 'o'].includes(abo);

function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};
  const t = data.tests;
  const p = data.pathway;
  const altruistic = p.donationPathway === 'altruistic';
  const recipientNamed = String(data.recipient.familyName || '').trim() !== '';

  if ((t.livingDonorVirtualCrossmatch || t.livingDonorMatchGrade) && !altruistic && !known(p.recipientAboGroup)) {
    flags.push({
      flagId: 'F-VIRTUAL-XM-001',
      category: 'virtual-crossmatch-without-antibody-profile',
      priority: 'medium',
      description: 'Virtual crossmatch or match grade requested without recipient information (ABO group unknown).',
      suggestedAction: 'Record the recipient ABO group and confirm the laboratory holds a current recipient HLA-antibody profile.'
    });
  }
  if (aboIncompatiblePair(data) && !t.aboTitresOnly) {
    flags.push({
      flagId: 'F-ABO-INCOMPATIBLE-001',
      category: 'donor-recipient-abo-incompatible',
      priority: 'high',
      description: 'Donor and recipient ABO groups are incompatible and no ABO titres are requested.',
      suggestedAction: 'Request ABO titres; an ABO-incompatible pair may proceed by desensitization or paired exchange.'
    });
  }
  if (altruistic && recipientNamed) {
    flags.push({
      flagId: 'F-ALTRUISTIC-RECIPIENT-001',
      category: 'altruistic-donor-with-recipient',
      priority: 'medium',
      description: 'The pathway is altruistic but a recipient is recorded.',
      suggestedAction: 'Check the pathway: a directed or paired-exchange donation has a recipient; an altruistic donation does not.'
    });
  }
  if (recipientNamed && !altruistic) {
    flags.push({
      flagId: 'F-ONE-FORM-001',
      category: 'donor-and-recipient-on-one-form',
      priority: 'low',
      description: 'Donor and recipient are both identified, but the sample on this request is the donor\'s only.',
      suggestedAction: 'Send the recipient\'s samples on the recipient request; do not put recipient samples on this form.'
    });
  }
  if (!known(p.donorAboGroup)) {
    flags.push({
      flagId: 'F-MISSING-ABO-001',
      category: 'missing-abo-group',
      priority: 'medium',
      description: 'Donor ABO group is unknown or not recorded.',
      suggestedAction: 'Record the donor ABO group; ABO compatibility is the first crossmatch gate.'
    });
  }
  if (requiredSamples(data).need.pink > 0 && !(data.sample.samplesEdtaPinkHandLabelledCount > 0)) {
    flags.push({
      flagId: 'F-HAND-LABELLED-001',
      category: 'hand-labelled-sample-required',
      priority: 'medium',
      description: 'The requested tests need a hand-labelled EDTA tube and none is recorded.',
      suggestedAction: 'Send a hand-labelled EDTA tube; addressograph labels are not accepted for it.'
    });
  }
  if (ctx.identitySafetyBand === 'reject-risk') {
    flags.push({
      flagId: 'F-IDENTITY-001',
      category: 'identity-mismatch-risk',
      priority: 'high',
      description: 'Fewer than 3 identifiers on the sample or form: the sample is at risk of being discarded.',
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
  return flags;
}

export { detectFlags };
