// Four-axis rule catalogue for the Medical Human Leukocyte and Disease
// Association Request.
//
// (A) test-selection appropriateness 1-9 + band, anchored on laboratory
// standards and published guidance on each HLA association (there is no
// published score); (B) identity / sample safety band ok / caution /
// reject-risk; (C) completeness over weighted mandatory fields; (D) triage
// tier. Rule ids are stable and identical across every front-end and the
// back-end (R-APPROP-*, R-ID-*, R-COMP-*, R-TRIAGE-*). Turnaround targets and
// tube volumes are local policy defaults kept in one place (TARGETS,
// VOLUME_RANGE_ML and TEST_DEFINITIONS) so a laboratory can change them.

import { selectedTests } from './tests';
import type {
  AppropriatenessBand,
  FiredRule,
  HlaAssociationRequest,
  IdentitySafetyBand,
  TriageTier,
  TubeNeeds
} from './types';

type Data = HlaAssociationRequest;

// Local-policy turnaround targets (editable).
export const TARGETS = {
  routine: '10 working days (local policy)',
  urgent: '2 working days (local policy)'
};

// Local-policy EDTA volume range (mL).
export const VOLUME_RANGE_ML = { min: 5, max: 10 };

function rule(ruleId: string, axis: string, category: string, description: string): FiredRule {
  return { ruleId, axis, category, description };
}

export function bandForScore(score: number): AppropriatenessBand {
  if (score >= 7) return 'usually-appropriate';
  if (score >= 4) return 'may-be-appropriate';
  return 'usually-not-appropriate';
}

const filled = (v: unknown): boolean => v !== null && v !== undefined && String(v).trim() !== '';

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
  const c = data.clinical;
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

  if (!filled(c.clinicalDetails)) {
    cap(
      5,
      rule(
        'R-APPROP-01',
        'appropriateness',
        'no-clinical-details',
        'No clinical details: the laboratory cannot judge whether the test fits the question.'
      )
    );
  }
  if (c.previousHlaTypingKnown === true) {
    cap(
      2,
      rule(
        'R-APPROP-02',
        'appropriateness',
        'previous-typing',
        'The patient has been HLA typed before: an HLA type is lifelong, so a repeat is usually unnecessary.'
      )
    );
  }
  if (t.hlaB5701 && !filled(c.plannedDrug) && !filled(c.indicationCategory)) {
    cap(
      5,
      rule(
        'R-APPROP-03',
        'appropriateness',
        'hla-b-57-01',
        'HLA-B*57:01 requested with no planned drug and no indication.'
      )
    );
  }
  if (t.otherHlaDiseaseAssociation && !filled(t.testDetail)) {
    cap(
      5,
      rule(
        'R-APPROP-04',
        'appropriateness',
        'other-hla',
        'Other HLA association requested with no allele or antigen specified.'
      )
    );
  }
  if (t.hlaDqa105) {
    cap(
      6,
      rule(
        'R-APPROP-05',
        'appropriateness',
        'hla-dqa1-05',
        'HLA-DQA1*05 for anti-TNF response is an emerging use with limited evidence.'
      )
    );
  }
  return { score, band: bandForScore(score), firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis B - identity / sample safety
// ----------------------------------------------------------------------

/** Sample tube needed: the largest requirement across the tests. */
export function requiredSamples(data: Data): {
  need: Required<TubeNeeds>;
  summary: string;
} {
  const need: Required<TubeNeeds> = { edta: 0 };
  for (const test of selectedTests(data)) {
    const v = test.samples.edta || 0;
    if (v > need.edta) need.edta = v;
  }
  const summary = need.edta
    ? VOLUME_RANGE_ML.min +
      '-' +
      VOLUME_RANGE_ML.max +
      ' mL EDTA blood (one tube serves every test)'
    : '';
  return { need, summary };
}

/** Axis B. */
export function scoreIdentitySafety(data: Data): {
  band: IdentitySafetyBand;
  firedRules: FiredRule[];
} {
  const s = data.sample;
  const u = data.urgency;
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
  if (
    s.sampleVolumeMl !== null &&
    (s.sampleVolumeMl < VOLUME_RANGE_ML.min || s.sampleVolumeMl > VOLUME_RANGE_ML.max)
  ) {
    fired.push(
      rule(
        'R-ID-VOL-01',
        'identity',
        'volume',
        'EDTA volume ' +
          s.sampleVolumeMl +
          ' mL is outside the expected ' +
          VOLUME_RANGE_ML.min +
          '-' +
          VOLUME_RANGE_ML.max +
          ' mL.'
      )
    );
    raise('caution');
  }
  if (u.highRiskSample === true && !filled(u.highRiskDescription)) {
    fired.push(
      rule(
        'R-ID-RISK-01',
        'identity',
        'high-risk',
        'High-risk sample without a description of the risk.'
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
        'Informed consent (including for genetic testing) and identity verification not confirmed by the requester.'
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
  ['tests', 'at least one test', 20, (d) => selectedTests(d).length > 0],
  ['clinical', 'clinical details', 20, (d) => filled(d.clinical.clinicalDetails)],
  ['indication', 'indication category', 10, (d) => filled(d.clinical.indicationCategory)],
  [
    'identity',
    'patient identity (name, birth date, identifier)',
    15,
    (d) =>
      filled(d.patient.familyName) &&
      filled(d.patient.birthDate) &&
      (filled(d.patient.nationalHealthIdentifier) || filled(d.patient.medicalRecordNumber))
  ],
  [
    'ethnicity',
    'ethnicity (allele frequencies differ by population)',
    5,
    (d) => filled(d.patient.ethnicity)
  ],
  [
    'report',
    'report destination (email or copy-to)',
    10,
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
  const fired: FiredRule[] = [];
  let tier: TriageTier = 'routine';
  let targetTimeframe = TARGETS.routine;
  const preTreatment =
    data.clinical.indicationCategory === 'pre-treatment-drug-hypersensitivity' ||
    (data.tests.hlaB5701 === true && filled(data.clinical.plannedDrug));
  if (preTreatment) {
    fired.push(
      rule(
        'R-TRIAGE-01',
        'triage',
        'pre-treatment',
        'Pre-treatment drug-hypersensitivity test: the drug start waits for the result.'
      )
    );
    tier = 'urgent';
    targetTimeframe = TARGETS.urgent;
  }
  if (data.urgency.urgentTesting) {
    fired.push(rule('R-TRIAGE-02', 'triage', 'urgent', 'Urgent testing requested.'));
    tier = 'urgent';
    targetTimeframe = TARGETS.urgent;
  }
  if (fired.length === 0) {
    fired.push(rule('R-TRIAGE-03', 'triage', 'routine', 'No urgency indicators: routine.'));
  }
  return { tier, targetTimeframe, firedRules: fired };
}
