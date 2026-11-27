// Four-axis rule catalogue for the Medical Renal Transplant Recipient Request.
//
// (A) test-selection appropriateness 1-9 + band, anchored on laboratory
// standards (EFI, BSHI / BTS) because no published score exists; (B) identity /
// sample safety band ok / caution / reject-risk; (C) completeness over
// weighted mandatory fields; (D) triage tier. Rule ids are stable and identical
// across every front-end and the back-end (R-APPROP-*, R-ID-*, R-COMP-*,
// R-TRIAGE-*). Turnaround targets and tube volumes are local policy defaults
// kept in one place (TARGETS and TEST_DEFINITIONS) so a laboratory can change
// them.

import { selectedTests } from './tests';
import type {
  AppropriatenessBand,
  FiredRule,
  IdentitySafetyBand,
  RenalRecipientRequest,
  TriageTier,
  TubeNeeds
} from './types';

type Data = RenalRecipientRequest;

// Local-policy turnaround targets (editable).
export const TARGETS = {
  routine: '5 working days (local policy)',
  urgent: '1 working day (local policy)',
  rejection: '3-5 working days (local policy)',
  stat: 'same day, hours (local policy)'
};

const MONITORING_FIELDS = [
  'hlaMonitoringRoutineTransplantList',
  'hlaMonitoringRoutinePostTransplant',
  'hlaMonitoringPostTransfusion'
] as const;

function rule(ruleId: string, axis: string, category: string, description: string): FiredRule {
  return { ruleId, axis, category, description };
}

export function bandForScore(score: number): AppropriatenessBand {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

// ----------------------------------------------------------------------
// Axis A - test-selection appropriateness
// ----------------------------------------------------------------------

/** Axis A. */
export function scoreAppropriateness(data: Data): {
  score: number;
  band: AppropriatenessBand;
  firedRules: FiredRule[];
} {
  const t = data.tests;
  const h = data.history;
  const fired: FiredRule[] = [];

  if (selectedTests(data).length === 0) {
    return {
      score: 5,
      band: 'may-be-appropriate',
      firedRules: [
        rule(
          'R-APPROP-UNSPECIFIED',
          'appropriateness',
          'unspecified',
          'No test selected yet: provisional appropriateness.'
        )
      ]
    };
  }

  let score = 8;
  const cap = (value: number, r: FiredRule) => {
    fired.push(r);
    if (value < score) score = value;
  };

  const monitoring = MONITORING_FIELDS.some((f) => t[f] === true);
  if ((t.livingDonorVirtualCrossmatch || t.livingDonorMatchGrade) && !monitoring) {
    cap(
      5,
      rule(
        'R-APPROP-01',
        'appropriateness',
        'virtual-crossmatch',
        'Virtual crossmatch or match grade relies on a current HLA-antibody profile; none is requested.'
      )
    );
  }
  const hasTransplant =
    data.clinical.dialysisMode === 'failing-transplant' ||
    (h.previousTransplantCount !== null && h.previousTransplantCount > 0);
  if (t.hlaRejectionInvestigation && !hasTransplant) {
    cap(
      2,
      rule(
        'R-APPROP-02',
        'appropriateness',
        'rejection-investigation',
        'Rejection investigation requested for a recipient with no transplant recorded.'
      )
    );
  }
  if (t.hlaMonitoringPostTransfusion && !((h.transfusionCount ?? 0) > 0)) {
    cap(
      5,
      rule(
        'R-APPROP-03',
        'appropriateness',
        'post-transfusion',
        'Post-transfusion monitoring requested but no transfusion is recorded.'
      )
    );
  }
  if (t.aboIncompatibleMonitoring && !t.dfppStatus) {
    cap(
      5,
      rule(
        'R-APPROP-04',
        'appropriateness',
        'abo-incompatible',
        'ABO-incompatible monitoring without a DFPP status.'
      )
    );
  }
  return { score, band: bandForScore(score), firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis B - identity / sample safety
// ----------------------------------------------------------------------

/** Sample tubes needed: the largest requirement per tube type across tests. */
export function requiredSamples(data: Data): {
  need: Required<TubeNeeds>;
  summary: string;
} {
  const need: Required<TubeNeeds> = { edta: 0, pink: 0, serum: 0, abo: 0 };
  for (const test of selectedTests(data)) {
    for (const k of Object.keys(need) as (keyof TubeNeeds)[]) {
      const v = test.samples[k] || 0;
      if (v > need[k]) need[k] = v;
    }
  }
  const parts: string[] = [];
  if (need.edta) parts.push(need.edta + ' mL EDTA');
  if (need.pink) parts.push(need.pink + ' mL EDTA hand-labelled');
  if (need.serum) parts.push(need.serum + ' mL serum');
  if (need.abo) parts.push(need.abo + ' mL EDTA (potential ABO titres)');
  return { need, summary: parts.join('; ') };
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
  if (requiredSamples(data).need.pink > 0 && !((s.samplesEdtaPinkHandLabelledCount ?? 0) > 0)) {
    fired.push(
      rule(
        'R-ID-HAND-01',
        'identity',
        'hand-labelled',
        'The tests need a hand-labelled EDTA tube and none is recorded.'
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

const filled = (v: unknown) => v !== null && v !== undefined && String(v).trim() !== '';

export const COMPLETENESS_FIELDS: [string, string, number, (d: Data) => boolean][] = [
  ['organ', 'organ required', 15, (d: Data) => filled(d.history.organRequired)],
  ['tests', 'at least one test', 20, (d: Data) => selectedTests(d).length > 0],
  [
    'sensitisation',
    'sensitization counts (transplants, transfusions, pregnancies)',
    15,
    (d: Data) =>
      d.history.previousTransplantCount !== null &&
      d.history.transfusionCount !== null &&
      d.history.pregnancyCount !== null
  ],
  [
    'abo',
    'recipient ABO group',
    10,
    (d: Data) => filled(d.clinical.recipientAboGroup) && d.clinical.recipientAboGroup !== 'unknown'
  ],
  [
    'identity',
    'recipient identity (name, birth date, identifier)',
    15,
    (d: Data) =>
      filled(d.recipient.familyName) &&
      filled(d.recipient.birthDate) &&
      (filled(d.recipient.nationalHealthIdentifier) || filled(d.recipient.medicalRecordNumber))
  ],
  [
    'sample',
    'sample collection details',
    10,
    (d: Data) =>
      filled(d.sample.sampleCollectorName) &&
      filled(d.sample.sampleCollectedAt) &&
      d.sample.identifiersOnSampleCount !== null
  ],
  [
    'requester',
    'requester and signature',
    10,
    (d: Data) => filled(d.requester.clinicianName) && filled(d.requester.requestedBySignedAt)
  ],
  ['dialysis', 'mode of dialysis', 5, (d: Data) => filled(d.clinical.dialysisMode)]
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
  const t = data.tests;
  const fired: FiredRule[] = [];
  let tier: TriageTier = 'routine';
  let targetTimeframe = TARGETS.routine;
  if (t.deceasedDonorDayOfTransplant || t.livingDonorDayOfTransplant) {
    fired.push(
      rule(
        'R-TRIAGE-01',
        'triage',
        'day-of-transplant',
        'Day-of-transplant test: a donor organ or transplant is imminent.'
      )
    );
    tier = 'stat';
    targetTimeframe = TARGETS.stat;
  }
  if (t.urgentTesting && tier !== 'stat') {
    fired.push(rule('R-TRIAGE-02', 'triage', 'urgent', 'Urgent testing requested.'));
    tier = 'urgent';
    targetTimeframe = TARGETS.urgent;
  }
  if (t.hlaRejectionInvestigation && tier === 'routine') {
    fired.push(
      rule(
        'R-TRIAGE-03',
        'triage',
        'rejection',
        'HLA rejection investigation: prioritized work-up.'
      )
    );
    tier = 'urgent';
    targetTimeframe = TARGETS.rejection;
  }
  if (fired.length === 0) {
    fired.push(rule('R-TRIAGE-04', 'triage', 'routine', 'No urgency indicators: routine.'));
  }
  return { tier, targetTimeframe, firedRules: fired };
}
