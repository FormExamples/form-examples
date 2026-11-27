// Four-axis rule catalogue for the Medical Renal Living Donor Request.
//
// (A) test-selection appropriateness 1-9 + band, anchored on laboratory
// standards (EFI, BSHI / BTS) because no published score exists; (B) identity /
// sample safety band ok / caution / reject-risk; (C) completeness over
// weighted mandatory fields; (D) triage tier. Rule ids are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-ID-*, R-COMP-*,
// R-TRIAGE-*). Turnaround targets and tube volumes are local policy defaults
// kept in one place (TARGETS and TEST_DEFINITIONS) so a laboratory can change
// them.

import { selectedTests } from './types.js';

// Local-policy turnaround targets (editable).
const TARGETS = {
  routine: '5 working days (local policy)',
  urgent: '1 working day (local policy)',
  stat: 'same day, hours (local policy)'
};

function rule(ruleId, axis, category, description) {
  return { ruleId, axis, category, description };
}

function bandForScore(score) {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

const known = (abo) => ['a', 'b', 'ab', 'o'].includes(abo);

/** ABO compatibility of a donor group giving to a recipient group (both known). */
function aboCompatible(donor, recipient) {
  if (donor === 'o') return true;
  if (donor === 'a') return recipient === 'a' || recipient === 'ab';
  if (donor === 'b') return recipient === 'b' || recipient === 'ab';
  if (donor === 'ab') return recipient === 'ab';
  return true;
}

/** True when both groups are known and the donor cannot give to the recipient. */
function aboIncompatiblePair(data) {
  const { donorAboGroup: d, recipientAboGroup: r } = data.pathway;
  return known(d) && known(r) && !aboCompatible(d, r);
}

// ----------------------------------------------------------------------
// Axis A - test-selection appropriateness
// ----------------------------------------------------------------------

/** @returns {{ score:number, band:string, firedRules:object[] }} */
function scoreAppropriateness(data) {
  const t = data.tests;
  const p = data.pathway;
  const fired = [];

  if (selectedTests(data).length === 0) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRules: [rule('R-APPROP-UNSPECIFIED', 'appropriateness', 'unspecified', 'No test selected yet: provisional appropriateness.')]
    };
  }

  let score = 8;
  const cap = (value, r) => {
    fired.push(r);
    if (value < score) score = value;
  };

  const altruistic = p.donationPathway === 'altruistic';
  if ((t.livingDonorVirtualCrossmatch || t.livingDonorMatchGrade) && !altruistic && !known(p.recipientAboGroup)) {
    cap(5, rule('R-APPROP-01', 'appropriateness', 'virtual-crossmatch', 'Virtual crossmatch or match grade relies on recipient information; the recipient ABO group is not known.'));
  }
  if (altruistic && (t.livingDonorFullCrossmatch || t.livingDonorVirtualCrossmatch || t.livingDonorMatchGrade)) {
    cap(2, rule('R-APPROP-02', 'appropriateness', 'altruistic-crossmatch', 'An altruistic donor has no recipient, so a crossmatch or match grade cannot be done.'));
  }
  if (aboIncompatiblePair(data) && !t.aboTitresOnly) {
    cap(5, rule('R-APPROP-03', 'appropriateness', 'abo-incompatible', 'Known ABO-incompatible pair without ABO titres requested.'));
  }
  return { score, band: bandForScore(score), firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis B - identity / sample safety
// ----------------------------------------------------------------------

/** Sample tubes needed: the largest requirement per tube type across tests. */
function requiredSamples(data) {
  const need = { edta: 0, pink: 0, abo: 0 };
  for (const test of selectedTests(data)) {
    for (const k of Object.keys(need)) {
      if ((test.samples[k] || 0) > need[k]) need[k] = test.samples[k];
    }
  }
  const parts = [];
  if (need.edta) parts.push(need.edta + ' mL EDTA');
  if (need.pink) parts.push(need.pink + ' mL EDTA hand-labelled');
  if (need.abo) parts.push(need.abo + ' mL EDTA (potential ABO titres)');
  return { need, summary: parts.join('; ') };
}

/** @returns {{ band:string, firedRules:object[] }} */
function scoreIdentitySafety(data) {
  const s = data.sample;
  const fired = [];
  let band = 'ok';
  const raise = (to) => {
    const order = { ok: 0, caution: 1, 'reject-risk': 2 };
    if (order[to] > order[band]) band = to;
  };

  if (s.identifiersOnSampleCount === null || s.identifiersOnFormCount === null) {
    fired.push(rule('R-ID-3PT-02', 'identity', 'identifiers', 'Number of identifiers on sample and form not recorded.'));
    raise('caution');
  } else if (s.identifiersOnSampleCount < 3 || s.identifiersOnFormCount < 3) {
    fired.push(rule('R-ID-3PT-01', 'identity', 'identifiers', 'Fewer than 3 identifiers on the sample or the form: samples not labelled correctly are discarded.'));
    raise('reject-risk');
  }
  if (s.sampleAndFormDetailsMatch !== true) {
    fired.push(rule('R-ID-MATCH-01', 'identity', 'match', 'Match between sample and form details not confirmed.'));
    raise('caution');
  }
  if (requiredSamples(data).need.pink > 0 && !(s.samplesEdtaPinkHandLabelledCount > 0)) {
    fired.push(rule('R-ID-HAND-01', 'identity', 'hand-labelled', 'The tests need a hand-labelled EDTA tube and none is recorded.'));
    raise('caution');
  }
  if (data.requester.consentAndIdentityConfirmed !== true) {
    fired.push(rule('R-ID-CONSENT-01', 'identity', 'consent', 'Donor consent and identity verification not confirmed by the requester.'));
    raise('caution');
  }
  return { band, firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis C - completeness
// ----------------------------------------------------------------------

const filled = (v) => v !== null && v !== undefined && String(v).trim() !== '';

const COMPLETENESS_FIELDS = [
  ['pathway', 'donation pathway', 15, (d) => filled(d.pathway.donationPathway)],
  ['tests', 'at least one test', 20, (d) => selectedTests(d).length > 0],
  ['donor', 'donor identity (name, birth date, identifier)', 20,
    (d) => filled(d.donor.familyName) && filled(d.donor.birthDate) &&
      (filled(d.donor.nationalHealthIdentifier) || filled(d.donor.medicalRecordNumber))],
  ['abo', 'donor ABO group', 10, (d) => known(d.pathway.donorAboGroup)],
  ['recipient', 'recipient identity (not needed for an altruistic donor)', 10,
    (d) => d.pathway.donationPathway === 'altruistic' || (filled(d.recipient.familyName) && filled(d.recipient.birthDate))],
  ['relationship', 'relationship of donor to recipient (not needed for an altruistic donor)', 5,
    (d) => d.pathway.donationPathway === 'altruistic' || filled(d.pathway.relationshipOfDonorToRecipient)],
  ['sample', 'sample collection details', 10,
    (d) => filled(d.sample.sampleCollectorName) && filled(d.sample.sampleCollectedAt) && d.sample.identifiersOnSampleCount !== null],
  ['requester', 'requester and signature', 10, (d) => filled(d.requester.clinicianName) && filled(d.requester.requestedBySignedAt)]
];

/** @returns {{ percent:number, missing:object[] }} */
function scoreCompleteness(data) {
  let percent = 0;
  const missing = [];
  for (const [key, label, weight, present] of COMPLETENESS_FIELDS) {
    if (present(data)) percent += weight;
    else missing.push(rule('R-COMP-' + key.toUpperCase(), 'completeness', key, 'Missing: ' + label + ' (weight ' + weight + ').'));
  }
  return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis D - triage
// ----------------------------------------------------------------------

/** @returns {{ tier:string, targetTimeframe:string, firedRules:object[] }} */
function scoreTriage(data) {
  const t = data.tests;
  const fired = [];
  let tier = 'routine';
  let targetTimeframe = TARGETS.routine;
  if (t.dayOfTransplantSamples) {
    fired.push(rule('R-TRIAGE-01', 'triage', 'day-of-transplant', 'Day-of-transplant samples: a transplant is imminent.'));
    tier = 'stat';
    targetTimeframe = TARGETS.stat;
  }
  if (t.urgentTesting && tier !== 'stat') {
    fired.push(rule('R-TRIAGE-02', 'triage', 'urgent', 'Urgent testing requested.'));
    tier = 'urgent';
    targetTimeframe = TARGETS.urgent;
  }
  if (fired.length === 0) {
    fired.push(rule('R-TRIAGE-03', 'triage', 'routine', 'No urgency indicators: routine.'));
  }
  return { tier, targetTimeframe, firedRules: fired };
}

export {
  scoreAppropriateness, scoreIdentitySafety, scoreCompleteness, scoreTriage,
  requiredSamples, bandForScore, aboIncompatiblePair, TARGETS, COMPLETENESS_FIELDS
};
