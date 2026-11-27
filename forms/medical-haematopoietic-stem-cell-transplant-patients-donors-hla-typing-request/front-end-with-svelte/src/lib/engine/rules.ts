// Four-axis rule catalogue for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request.
//
// (A) appropriateness 1-9 + band, anchored on laboratory standards (EFI,
// BSHI / BTS) because no published score exists; (B) identity / sample safety
// band ok / caution / reject-risk; (C) completeness over weighted mandatory
// fields; (D) triage tier. Rule ids are stable and identical across every
// front-end and the back-end. Turnaround targets and tube volumes are local
// policy defaults kept in one place (TARGETS and SAMPLE_REQUIREMENTS).

import type {
  AppropriatenessBand,
  FiredRule,
  HsctTypingRequest,
  IdentitySafetyBand,
  TriageTier,
  TubeNeeds
} from './types';

type Data = HsctTypingRequest;

/** Sample requirement per role: tube volumes in mL (local policy defaults). */
export const SAMPLE_REQUIREMENTS: Record<string, TubeNeeds> = {
  'hsct-recipient': { edtaPurple: 18, edtaPink: 6, clottedRed: 6 },
  'potential-donor': { edtaPurple: 10, edtaPink: 6, clottedRed: 0 }
};

// Local-policy turnaround targets (editable).
export const TARGETS = {
  routine: '10 working days (local policy)',
  urgent: '2 working days (local policy)'
};

function rule(ruleId: string, axis: string, category: string, description: string): FiredRule {
  return { ruleId, axis, category, description };
}

export function bandForScore(score: number): AppropriatenessBand {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

const filled = (v: unknown): boolean => v !== null && v !== undefined && String(v).trim() !== '';

/** True when the request names the recipient a donor sample belongs to. */
export function hasRecipientDetails(data: Data): boolean {
  const r = data.recipient;
  return filled(r.recipientFamilyName) && filled(r.recipientMedicalRecordNumber);
}

// ----------------------------------------------------------------------
// Axis A - appropriateness
// ----------------------------------------------------------------------

/** Axis A. */
export function scoreAppropriateness(data: Data): {
  score: number;
  band: AppropriatenessBand;
  firedRules: FiredRule[];
} {
  const q = data.request;
  const fired: FiredRule[] = [];

  if (!q.subjectRole) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRules: [
        rule(
          'R-APPROP-UNSPECIFIED',
          'appropriateness',
          'unspecified',
          'Role of the person sampled not chosen yet: provisional appropriateness.'
        )
      ]
    };
  }

  let score = 8;
  const cap = (value: number, r: FiredRule) => {
    fired.push(r);
    if (value < score) score = value;
  };

  if (q.subjectRole === 'potential-donor' && !hasRecipientDetails(data)) {
    cap(
      3,
      rule(
        'R-APPROP-01',
        'appropriateness',
        'donor-without-recipient',
        'Potential donor with no recipient details: the laboratory cannot pair or interpret the sample.'
      )
    );
  }
  if (!filled(q.clinicalDetails)) {
    cap(
      5,
      rule(
        'R-APPROP-02',
        'appropriateness',
        'no-clinical-details',
        'No clinical details: the laboratory cannot judge the request.'
      )
    );
  }
  if (q.donorType === 'unrelated-volunteer' && filled(data.recipient.relationshipToRecipient)) {
    cap(
      5,
      rule(
        'R-APPROP-03',
        'appropriateness',
        'unrelated-with-relationship',
        'Donor type is unrelated volunteer but a relationship to the recipient is given.'
      )
    );
  }
  return { score, band: bandForScore(score), firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis B - identity / sample safety
// ----------------------------------------------------------------------

/** Sample tubes the role needs, as a summary and per-tube volumes. */
export function requiredSamples(data: Data): { need: TubeNeeds; summary: string } {
  const need = SAMPLE_REQUIREMENTS[data.request.subjectRole] || {
    edtaPurple: 0,
    edtaPink: 0,
    clottedRed: 0
  };
  const parts: string[] = [];
  if (need.edtaPurple) parts.push(need.edtaPurple + ' mL EDTA (purple)');
  if (need.edtaPink) parts.push(need.edtaPink + ' mL EDTA (pink, hand-labelled)');
  if (need.clottedRed) parts.push(need.clottedRed + ' mL clotted (red)');
  return { need, summary: parts.join(' + ') };
}

/** Tubes whose recorded volume is below the role requirement. */
export function shortTubes(data: Data): string[] {
  const { need } = requiredSamples(data);
  const s = data.sample;
  const short: string[] = [];
  if (need.edtaPurple && (s.edtaPurpleVolumeMl ?? 0) < need.edtaPurple) short.push('purple EDTA');
  if (need.edtaPink && (s.edtaPinkVolumeMl ?? 0) < need.edtaPink) short.push('pink EDTA');
  if (need.clottedRed && (s.clottedRedVolumeMl ?? 0) < need.clottedRed) short.push('red clotted');
  return short;
}

/** Axis B. */
export function scoreIdentitySafety(data: Data): {
  band: IdentitySafetyBand;
  firedRules: FiredRule[];
} {
  const s = data.sample;
  const fired: FiredRule[] = [];
  let band: IdentitySafetyBand = 'ok';
  const raise = (to: IdentitySafetyBand) => {
    const order = { ok: 0, caution: 1, 'reject-risk': 2 };
    if (order[to] > order[band]) band = to;
  };

  if (s.identifiersOnSampleCount === null || s.identifiersOnFormCount === null) {
    fired.push(
      rule(
        'R-ID-3PT-02',
        'identity',
        'identifiers',
        'Number of identifiers on sample and form not recorded.'
      )
    );
    raise('caution');
  } else if (s.identifiersOnSampleCount < 3 || s.identifiersOnFormCount < 3) {
    fired.push(
      rule(
        'R-ID-3PT-01',
        'identity',
        'identifiers',
        'Fewer than 3 identifiers on the sample or the form: samples not labelled correctly are discarded.'
      )
    );
    raise('reject-risk');
  }
  if (s.sampleAndFormDetailsMatch !== true) {
    fired.push(
      rule(
        'R-ID-MATCH-01',
        'identity',
        'match',
        'Match between sample and form details not confirmed.'
      )
    );
    raise('caution');
  }
  const short = data.request.subjectRole ? shortTubes(data) : [];
  if (short.length > 0) {
    fired.push(
      rule(
        'R-ID-VOL-01',
        'identity',
        'volume',
        'Volume below the requirement for this role: ' + short.join(', ') + '.'
      )
    );
    raise('caution');
  }
  if (data.requester.consentAndIdentityConfirmed !== true) {
    fired.push(
      rule(
        'R-ID-CONSENT-01',
        'identity',
        'consent',
        'Informed consent and identity verification not confirmed by the requester.'
      )
    );
    raise('caution');
  }
  return { band, firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis C - completeness
// ----------------------------------------------------------------------

type CompletenessField = [string, string, number, (d: Data) => boolean];

export const COMPLETENESS_FIELDS: CompletenessField[] = [
  ['role', 'role of the person sampled', 10, (d) => filled(d.request.subjectRole)],
  [
    'identity',
    'identity (name, birth date, identifier)',
    20,
    (d) =>
      filled(d.subject.familyName) &&
      filled(d.subject.birthDate) &&
      (filled(d.subject.nationalHealthIdentifier) || filled(d.subject.medicalRecordNumber))
  ],
  ['sex', 'sex', 5, (d) => filled(d.subject.sex)],
  [
    'ethnicity',
    'ethnicity (allele frequencies differ by population)',
    10,
    (d) => filled(d.subject.ethnicity)
  ],
  ['clinical', 'clinical details', 15, (d) => filled(d.request.clinicalDetails)],
  [
    'donortype',
    'donor type',
    5,
    (d) => d.request.subjectRole !== 'potential-donor' || filled(d.request.donorType)
  ],
  [
    'recipient',
    'linked recipient (name, record number, relationship)',
    10,
    (d) =>
      d.request.subjectRole !== 'potential-donor' ||
      (hasRecipientDetails(d) &&
        (d.request.donorType === 'unrelated-volunteer' ||
          filled(d.recipient.relationshipToRecipient)))
  ],
  [
    'report',
    'report destination (email or copy-to)',
    5,
    (d) => filled(d.referrer.reportEmail) || filled(d.referrer.copyOfReportTo)
  ],
  [
    'sample',
    'sample collection details',
    10,
    (d) =>
      filled(d.sample.sampleCollectorName) &&
      filled(d.sample.sampleCollectedAt) &&
      d.sample.identifiersOnSampleCount !== null
  ],
  [
    'requester',
    'requester and signature',
    10,
    (d) => filled(d.referrer.clinicianName) && filled(d.requester.requestedBySignedAt)
  ]
];

/** Axis C. */
export function scoreCompleteness(data: Data): { percent: number; missing: FiredRule[] } {
  let percent = 0;
  const missing: FiredRule[] = [];
  for (const [key, label, weight, present] of COMPLETENESS_FIELDS) {
    if (present(data)) percent += weight;
    else
      missing.push(
        rule(
          'R-COMP-' + key.toUpperCase(),
          'completeness',
          key,
          'Missing: ' + label + ' (weight ' + weight + ').'
        )
      );
  }
  return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis D - triage
// ----------------------------------------------------------------------

/** Axis D. */
export function scoreTriage(data: Data): {
  tier: TriageTier;
  targetTimeframe: string;
  firedRules: FiredRule[];
} {
  if (data.urgency.urgentTesting) {
    return {
      tier: 'urgent',
      targetTimeframe: TARGETS.urgent,
      firedRules: [
        rule(
          'R-TRIAGE-01',
          'triage',
          'urgent',
          'Urgent testing requested: telephone the laboratory.'
        )
      ]
    };
  }
  return {
    tier: 'routine',
    targetTimeframe: TARGETS.routine,
    firedRules: [rule('R-TRIAGE-02', 'triage', 'routine', 'No urgency indicators: routine.')]
  };
}
