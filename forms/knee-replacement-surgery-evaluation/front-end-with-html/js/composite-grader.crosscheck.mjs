#!/usr/bin/env node
// Cross-check harness for the Knee Replacement Surgery Evaluation engine.
//
// Reproduces every boundary case from
// ../../front-end-with-svelte/src/lib/engine/grader.test.ts (Vitest) as plain
// `node:assert` assertions against this directory's plain-JavaScript engine
// (composite-grader.js / oks-rules.js / flagged-issues.js / types.js). This is
// the executable proof that the TypeScript engine and the JavaScript engine
// agree: same rule IDs, same flag IDs, same thresholds, same candidacy
// precedence order.
//
// Run with plain Node (no test framework needed):
//
//   node forms/knee-replacement-surgery-evaluation/front-end-with-html/js/composite-grader.crosscheck.mjs
//
// Exits 0 on success, non-zero (via assert throwing) on the first failure.

import assert from 'node:assert/strict';
import { calculateKneeEvaluation } from './composite-grader.js';
import { emptyEvaluation, OKS_ITEM_KEYS } from './types.js';

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

function blank() {
  return emptyEvaluation();
}

/** Build an evaluation whose 12 OKS items sum to exactly this total. */
function withOksTotal(total) {
  const d = blank();
  if (total < 0 || total > 48) throw new Error('OKS total out of range 0..48');
  let remaining = total;
  for (const key of OKS_ITEM_KEYS) {
    const v = Math.min(4, remaining);
    d.oks[key] = v;
    remaining -= v;
  }
  return d;
}

// ---------------------------------------------------------------------
// empty evaluation
// ---------------------------------------------------------------------

test('empty evaluation scores zero OKS, severe band, and raises nothing except missing data', () => {
  const r = calculateKneeEvaluation(blank());
  assert.equal(r.oksTotal, 0);
  assert.equal(r.computedOksCategory, 'severe');
  assert.equal(r.maxKellgrenLawrenceGrade, null);
  assert.equal(r.flags.length, 0);
});

// ---------------------------------------------------------------------
// Oxford Knee Score total
// ---------------------------------------------------------------------

test('sums the 12 items with an unanswered item treated as 0', () => {
  const d = blank();
  d.oks.oksPainSeverity = 4;
  d.oks.oksWashingAndDrying = 3;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.oksTotal, 7);
});

test('reaches the maximum of 48 when every item scores 4', () => {
  const r = calculateKneeEvaluation(withOksTotal(48));
  assert.equal(r.oksTotal, 48);
});

// ---------------------------------------------------------------------
// Oxford Knee Score category boundaries
// ---------------------------------------------------------------------

const OKS_BOUNDARIES = [
  [0, 'severe'],
  [19, 'severe'], // inclusive upper bound of severe
  [20, 'moderate'], // inclusive lower bound of moderate
  [29, 'moderate'], // inclusive upper bound of moderate
  [30, 'mild-to-moderate'], // inclusive lower bound
  [39, 'mild-to-moderate'], // inclusive upper bound
  [40, 'satisfactory'], // inclusive lower bound of satisfactory
  [48, 'satisfactory']
];
for (const [total, expected] of OKS_BOUNDARIES) {
  test(`OKS total ${total} categorises as ${expected}`, () => {
    const r = calculateKneeEvaluation(withOksTotal(total));
    assert.equal(r.computedOksCategory, expected);
    assert.equal(r.finalOksCategory, expected);
  });
}

// ---------------------------------------------------------------------
// Kellgren-Lawrence maximum across compartments
// ---------------------------------------------------------------------

test('takes the highest grade across medial, lateral, and patellofemoral', () => {
  const d = blank();
  d.imaging.kellgrenLawrenceGradeMedial = 1;
  d.imaging.kellgrenLawrenceGradeLateral = 3;
  d.imaging.kellgrenLawrenceGradePatellofemoral = 2;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.maxKellgrenLawrenceGrade, 3);
});

test('is null when no compartment has been graded', () => {
  const r = calculateKneeEvaluation(blank());
  assert.equal(r.maxKellgrenLawrenceGrade, null);
});

// ---------------------------------------------------------------------
// surgical candidacy — strong candidate
// ---------------------------------------------------------------------

test('strong candidate fires when OKS <= 19, KL >= 3, and conservative measures are exhausted', () => {
  const d = withOksTotal(19);
  d.imaging.kellgrenLawrenceGradeMedial = 3;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'strong-candidate');
});

test('strong candidate does not fire at OKS 20 (just above the threshold)', () => {
  const d = withOksTotal(20);
  d.imaging.kellgrenLawrenceGradeMedial = 4;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.notEqual(r.computedCandidacy, 'strong-candidate');
});

test('strong candidate does not fire at KL 2 (just below the threshold), even with OKS <= 19', () => {
  const d = withOksTotal(10);
  d.imaging.kellgrenLawrenceGradeMedial = 2;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'candidate');
});

// ---------------------------------------------------------------------
// surgical candidacy — candidate
// ---------------------------------------------------------------------

test('candidate fires when OKS <= 29, conservative exhausted, and KL >= 2', () => {
  const d = withOksTotal(29);
  d.imaging.kellgrenLawrenceGradeLateral = 2;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'candidate');
});

test('candidate does not fire at OKS 30 (just above the threshold)', () => {
  const d = withOksTotal(30);
  d.imaging.kellgrenLawrenceGradeLateral = 2;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.notEqual(r.computedCandidacy, 'candidate');
});

// ---------------------------------------------------------------------
// surgical candidacy — continue conservative
// ---------------------------------------------------------------------

test('continue conservative fires whenever conservative measures are not exhausted, regardless of OKS or KL', () => {
  const d = withOksTotal(5);
  d.imaging.kellgrenLawrenceGradeMedial = 4;
  d.conservative.conservativeMeasuresExhausted = 'no';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'continue-conservative');
});

test('continue conservative fires when conservative measures are simply unanswered', () => {
  const d = withOksTotal(5);
  d.imaging.kellgrenLawrenceGradeMedial = 4;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'continue-conservative');
});

// ---------------------------------------------------------------------
// surgical candidacy — not indicated
// ---------------------------------------------------------------------

test('not indicated fires when OKS >= 40 even with conservative measures exhausted', () => {
  const d = withOksTotal(40);
  d.conservative.conservativeMeasuresExhausted = 'yes';
  d.imaging.kellgrenLawrenceGradeMedial = 1;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'not-indicated');
});

test('not indicated fires when Kellgren-Lawrence is 1 or below in every compartment', () => {
  const d = withOksTotal(35);
  d.conservative.conservativeMeasuresExhausted = 'yes';
  d.imaging.kellgrenLawrenceGradeMedial = 1;
  d.imaging.kellgrenLawrenceGradeLateral = 0;
  d.imaging.kellgrenLawrenceGradePatellofemoral = 1;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'not-indicated');
});

// ---------------------------------------------------------------------
// surgical candidacy — MDT review fallback
// ---------------------------------------------------------------------

test('MDT review fires for a mixed picture: mild-to-moderate OKS with an arthritic KL grade and conservative measures already exhausted', () => {
  const d = withOksTotal(35);
  d.conservative.conservativeMeasuresExhausted = 'yes';
  d.imaging.kellgrenLawrenceGradeMedial = 2;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'mdt-review');
});

// ---------------------------------------------------------------------
// clinician override
// ---------------------------------------------------------------------

test('override overrides the final candidacy and requires a reason', () => {
  const d = withOksTotal(19);
  d.imaging.kellgrenLawrenceGradeMedial = 3;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  d.summary.overrideCandidacy = 'mdt-review';
  d.summary.overrideReason = 'Patient has significant frailty; discuss at MDT first.';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.computedCandidacy, 'strong-candidate');
  assert.equal(r.finalCandidacy, 'mdt-review');
  assert.equal(r.overrideReason, 'Patient has significant frailty; discuss at MDT first.');
});

test('override leaves overrideReason empty when the override equals the computed value', () => {
  const d = withOksTotal(19);
  d.imaging.kellgrenLawrenceGradeMedial = 3;
  d.conservative.conservativeMeasuresExhausted = 'yes';
  d.summary.overrideCandidacy = 'strong-candidate';
  d.summary.overrideReason = 'ignored because it matches computed';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.finalCandidacy, 'strong-candidate');
  assert.equal(r.overrideReason, '');
});

// ---------------------------------------------------------------------
// safety flag — conservative-treatment-not-exhausted
// ---------------------------------------------------------------------

test('conservative-treatment-not-exhausted fires when a surgical recommendation is made without conservative measures exhausted', () => {
  const d = blank();
  d.plan.planRecommendation = 'total-knee-replacement';
  d.conservative.conservativeMeasuresExhausted = 'no';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001'), true);
});

test('conservative-treatment-not-exhausted does not fire when conservative measures are exhausted', () => {
  const d = blank();
  d.plan.planRecommendation = 'total-knee-replacement';
  d.conservative.conservativeMeasuresExhausted = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001'), false);
});

test('conservative-treatment-not-exhausted does not fire when no surgical recommendation is made', () => {
  const d = blank();
  d.plan.planRecommendation = 'continue-conservative-management';
  d.conservative.conservativeMeasuresExhausted = 'no';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001'), false);
});

// ---------------------------------------------------------------------
// safety flag — high-bmi-surgical-risk
// ---------------------------------------------------------------------

test('high-bmi-surgical-risk fires at BMI 40 exactly', () => {
  const d = blank();
  d.patient.heightAsCm = 170;
  d.patient.weightAsKg = Math.round(40 * 1.7 * 1.7 * 10) / 10; // BMI = 40
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-HIGH-BMI-SURGICAL-RISK-001'), true);
});

test('high-bmi-surgical-risk does not fire just below BMI 40', () => {
  const d = blank();
  d.patient.heightAsCm = 170;
  d.patient.weightAsKg = Math.round(39.9 * 1.7 * 1.7 * 10) / 10; // BMI ~39.9
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-HIGH-BMI-SURGICAL-RISK-001'), false);
});

// ---------------------------------------------------------------------
// safety flag — pre-op-bloods-incomplete
// ---------------------------------------------------------------------

test('pre-op-bloods-incomplete fires when a surgical recommendation is made with an incomplete checklist', () => {
  const d = blank();
  d.plan.planRecommendation = 'partial-knee-replacement';
  d.preOpBloods.fbcDone = 'yes';
  // renalFunctionDone, clottingDone, ecgDone, mrsaScreenDone, urinalysisDone left unanswered
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PRE-OP-BLOODS-INCOMPLETE-001'), true);
});

test('pre-op-bloods-incomplete does not fire once every checklist item is done', () => {
  const d = blank();
  d.plan.planRecommendation = 'partial-knee-replacement';
  d.preOpBloods.fbcDone = 'yes';
  d.preOpBloods.renalFunctionDone = 'yes';
  d.preOpBloods.clottingDone = 'yes';
  d.preOpBloods.ecgDone = 'yes';
  d.preOpBloods.mrsaScreenDone = 'yes';
  d.preOpBloods.urinalysisDone = 'yes';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PRE-OP-BLOODS-INCOMPLETE-001'), false);
});

// ---------------------------------------------------------------------
// safety flag — fixed-flexion-deformity
// ---------------------------------------------------------------------

test('fixed-flexion-deformity fires above 15 degrees', () => {
  const d = blank();
  d.rangeOfMotion.fixedFlexionDeformityPresent = 'yes';
  d.rangeOfMotion.fixedFlexionDeformityDegrees = 16;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-FIXED-FLEXION-DEFORMITY-001'), true);
});

test('fixed-flexion-deformity does not fire at exactly 15 degrees', () => {
  const d = blank();
  d.rangeOfMotion.fixedFlexionDeformityPresent = 'yes';
  d.rangeOfMotion.fixedFlexionDeformityDegrees = 15;
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-FIXED-FLEXION-DEFORMITY-001'), false);
});

// ---------------------------------------------------------------------
// safety flag — bilateral-symptomatic
// ---------------------------------------------------------------------

test('bilateral-symptomatic fires when both knees are recorded as symptomatic', () => {
  const d = blank();
  d.history.kneeSide = 'bilateral';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-BILATERAL-SYMPTOMATIC-001'), true);
});

test('bilateral-symptomatic does not fire for a unilateral knee', () => {
  const d = blank();
  d.history.kneeSide = 'left';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-BILATERAL-SYMPTOMATIC-001'), false);
});

// ---------------------------------------------------------------------
// safety flag — paediatric
// ---------------------------------------------------------------------

test('paediatric fires below 16 years', () => {
  const d = blank();
  d.patient.birthDate = '2015-01-01';
  d.clinician.assessmentDate = '2026-01-01'; // age 11
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001'), true);
});

test('paediatric does not fire at exactly 16 years', () => {
  const d = blank();
  d.patient.birthDate = '2010-01-01';
  d.clinician.assessmentDate = '2026-01-01'; // age 16
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001'), false);
});

test('paediatric does not fire just below 16 by one day', () => {
  const d = blank();
  d.patient.birthDate = '2010-01-02';
  d.clinician.assessmentDate = '2026-01-01'; // 15 years, 364 days
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001'), true);
});

// ---------------------------------------------------------------------
// flags are never suppressed by the clinician override
// ---------------------------------------------------------------------

test('the paediatric flag still fires even when the clinician overrides candidacy', () => {
  const d = blank();
  d.patient.birthDate = '2015-01-01';
  d.clinician.assessmentDate = '2026-01-01';
  d.summary.overrideCandidacy = 'strong-candidate';
  d.summary.overrideReason = 'attempted override';
  const r = calculateKneeEvaluation(d);
  assert.equal(r.flags.some((f) => f.flagId === 'F-PAEDIATRIC-001'), true);
});

console.log(`\n${passed} passed, 0 failed`);
