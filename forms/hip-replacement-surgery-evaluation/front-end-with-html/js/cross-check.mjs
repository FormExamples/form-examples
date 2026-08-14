#!/usr/bin/env node
// Cross-check harness for the vanilla-JS engine (js/composite-grader.js,
// js/ohs-rules.js, js/flagged-issues.js) against the same boundary cases the
// TypeScript engine asserts in
// ../../front-end-with-svelte/src/lib/engine/grader.test.ts.
//
// Run with: node js/cross-check.mjs
//
// Pure Node.js, no test framework and no dependencies, so it runs without a
// build step alongside the rest of this no-build front-end.

import { emptyEvaluation } from './types.js';
import { calculateHipEvaluation, deriveCandidacy } from './composite-grader.js';
import { ohsCategoryFromTotal, scoreOhs } from './ohs-rules.js';

let pass = 0;
let fail = 0;

function assertEqual(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass += 1;
  } else {
    fail += 1;
    console.error(`FAIL: ${label}`);
    console.error(`  expected: ${JSON.stringify(expected)}`);
    console.error(`  actual:   ${JSON.stringify(actual)}`);
  }
}

function assertTrue(actual, label) {
  assertEqual(Boolean(actual), true, label);
}

function assertFalse(actual, label) {
  assertEqual(Boolean(actual), false, label);
}

/** Build a full evaluation with every OHS item set to the given value. */
function withOhsTotal(total) {
  const data = emptyEvaluation();
  const items = [
    'painSeverity', 'washingAndDrying', 'transport', 'dressingSocks',
    'shopping', 'walkingPain', 'limping', 'kneeling', 'nightPain',
    'workInterference', 'givingWay', 'stairs'
  ];
  let remaining = total;
  for (const key of items) {
    const value = Math.max(0, Math.min(4, remaining));
    data.ohs[key] = value;
    remaining -= value;
  }
  return data;
}

// ------------------------------------------------------------------
// scoreOhs
// ------------------------------------------------------------------

assertEqual(scoreOhs(withOhsTotal(24)).total, 24, 'scoreOhs sums the 12 items 0..48');
assertEqual(scoreOhs(emptyEvaluation()).total, 0, 'scoreOhs treats unanswered items as 0');
assertEqual(scoreOhs(withOhsTotal(48)).total, 48, 'scoreOhs caps at 48 when every item is 4');

// ------------------------------------------------------------------
// ohsCategoryFromTotal boundaries
// ------------------------------------------------------------------

assertEqual(ohsCategoryFromTotal(19), 'severe', '19 is severe');
assertEqual(ohsCategoryFromTotal(20), 'moderate', '20 is moderate');
assertEqual(ohsCategoryFromTotal(29), 'moderate', '29 is moderate');
assertEqual(ohsCategoryFromTotal(30), 'mild-to-moderate', '30 is mild-to-moderate');
assertEqual(ohsCategoryFromTotal(39), 'mild-to-moderate', '39 is mild-to-moderate');
assertEqual(ohsCategoryFromTotal(40), 'satisfactory', '40 is satisfactory');
assertEqual(ohsCategoryFromTotal(0), 'severe', '0 is severe');
assertEqual(ohsCategoryFromTotal(48), 'satisfactory', '48 is satisfactory');

// ------------------------------------------------------------------
// deriveCandidacy
// ------------------------------------------------------------------

assertEqual(
  deriveCandidacy(10, 4, 'no').candidacy,
  'continue-conservative',
  'conservative measures not exhausted always wins (1)'
);
assertEqual(
  deriveCandidacy(45, 0, 'no').candidacy,
  'continue-conservative',
  'conservative measures not exhausted always wins (2)'
);

assertEqual(deriveCandidacy(40, 4, 'yes').candidacy, 'not-indicated', 'not-indicated when OHS >= 40');
assertFalse(
  deriveCandidacy(39, 4, 'yes').candidacy === 'not-indicated',
  'not-indicated boundary: OHS 39 is not not-indicated'
);

assertEqual(deriveCandidacy(10, 1, 'yes').candidacy, 'not-indicated', 'not-indicated when KL <= 1');
assertFalse(
  deriveCandidacy(10, 2, 'yes').candidacy === 'not-indicated',
  'not-indicated boundary: KL 2 is not not-indicated'
);

assertEqual(
  deriveCandidacy(19, 3, 'yes').candidacy,
  'strong-candidate',
  'strong-candidate at OHS <= 19 and KL >= 3'
);
assertFalse(
  deriveCandidacy(20, 3, 'yes').candidacy === 'strong-candidate',
  'strong-candidate boundary: OHS 20 is not strong-candidate'
);
assertFalse(
  deriveCandidacy(19, 2, 'yes').candidacy === 'strong-candidate',
  'strong-candidate boundary: KL 2 is not strong-candidate'
);

assertEqual(
  deriveCandidacy(29, 2, 'yes').candidacy,
  'candidate',
  'candidate at OHS <= 29 and KL >= 2 (but not strong-candidate band)'
);
assertFalse(
  deriveCandidacy(30, 2, 'yes').candidacy === 'candidate',
  'candidate boundary: OHS 30 is not candidate'
);

assertEqual(
  deriveCandidacy(25, null, 'yes').candidacy,
  'mdt-review',
  'mdt-review is the fallback for a mixed picture'
);

assertFalse(
  deriveCandidacy(15, null, 'yes').candidacy === 'strong-candidate',
  'null KL grade never satisfies strong-candidate'
);
assertFalse(
  deriveCandidacy(15, null, 'yes').candidacy === 'candidate',
  'null KL grade never satisfies candidate'
);

// ------------------------------------------------------------------
// calculateHipEvaluation
// ------------------------------------------------------------------

{
  const data = withOhsTotal(15);
  data.imaging.kellgrenLawrenceGrade = 4;
  data.conservative.conservativeMeasuresExhausted = 'yes';
  const result = calculateHipEvaluation(data);
  assertEqual(result.ohsTotal, 15, 'end-to-end strong-candidate: ohsTotal');
  assertEqual(result.ohsCategory, 'severe', 'end-to-end strong-candidate: ohsCategory');
  assertEqual(result.computedCandidacy, 'strong-candidate', 'end-to-end strong-candidate: computedCandidacy');
  assertEqual(result.finalCandidacy, 'strong-candidate', 'end-to-end strong-candidate: finalCandidacy');
  assertEqual(result.overrideReason, '', 'end-to-end strong-candidate: overrideReason');
}

{
  const data = withOhsTotal(15);
  data.imaging.kellgrenLawrenceGrade = 4;
  data.conservative.conservativeMeasuresExhausted = 'yes';
  data.summary.overrideCandidacy = 'mdt-review';
  data.summary.overrideReason = 'Complex comorbidity requires multidisciplinary review.';
  const result = calculateHipEvaluation(data);
  assertEqual(result.computedCandidacy, 'strong-candidate', 'override: computedCandidacy unchanged');
  assertEqual(result.finalCandidacy, 'mdt-review', 'override: finalCandidacy applied');
  assertEqual(
    result.overrideReason,
    'Complex comorbidity requires multidisciplinary review.',
    'override: overrideReason recorded'
  );
}

{
  const data = emptyEvaluation();
  data.patient.heightAsCm = 170;
  data.patient.weightAsKg = 130;
  const result = calculateHipEvaluation(data);
  assertEqual(result.bmi, 45.0, 'BMI computed from height and weight');
}

{
  const below = emptyEvaluation();
  below.patient.heightAsCm = 170;
  below.patient.weightAsKg = 112; // BMI ~38.8
  assertFalse(
    calculateHipEvaluation(below).flags.some((f) => f.category === 'high-bmi-surgical-risk'),
    'high-bmi-surgical-risk does not fire below BMI 40'
  );

  const atThreshold = emptyEvaluation();
  atThreshold.patient.heightAsCm = 170;
  atThreshold.patient.weightAsKg = 116; // BMI ~40.1
  assertTrue(
    calculateHipEvaluation(atThreshold).flags.some((f) => f.category === 'high-bmi-surgical-risk'),
    'high-bmi-surgical-risk fires at BMI >= 40'
  );
}

{
  const data = emptyEvaluation();
  data.conservative.conservativeMeasuresExhausted = 'no';
  assertTrue(
    calculateHipEvaluation(data).flags.some((f) => f.category === 'conservative-treatment-not-exhausted'),
    'conservative-treatment-not-exhausted flag fires'
  );
}

{
  const data = emptyEvaluation();
  assertTrue(
    calculateHipEvaluation(data).flags.some((f) => f.category === 'pre-op-bloods-incomplete'),
    'pre-op-bloods-incomplete fires when tests are missing'
  );

  const complete = emptyEvaluation();
  complete.baselineTests = {
    fullBloodCountDone: 'yes',
    renalFunctionDone: 'yes',
    clottingOrInrDone: 'yes',
    ecgDone: 'yes',
    mrsaScreenDone: 'yes',
    urinalysisDone: 'yes'
  };
  assertFalse(
    calculateHipEvaluation(complete).flags.some((f) => f.category === 'pre-op-bloods-incomplete'),
    'pre-op-bloods-incomplete does not fire when all tests are done'
  );
}

{
  const atThreshold = emptyEvaluation();
  atThreshold.gait.legLengthDiscrepancyAsCm = 2;
  assertFalse(
    calculateHipEvaluation(atThreshold).flags.some((f) => f.category === 'leg-length-discrepancy-significant'),
    'leg-length-discrepancy-significant does not fire at exactly 2cm'
  );

  const above = emptyEvaluation();
  above.gait.legLengthDiscrepancyAsCm = 2.1;
  assertTrue(
    calculateHipEvaluation(above).flags.some((f) => f.category === 'leg-length-discrepancy-significant'),
    'leg-length-discrepancy-significant fires above 2cm'
  );
}

{
  const data = emptyEvaluation();
  data.gait.trendelenburgSign = 'yes';
  assertTrue(
    calculateHipEvaluation(data).flags.some((f) => f.category === 'trendelenburg-positive'),
    'trendelenburg-positive fires'
  );
}

{
  const data = emptyEvaluation();
  data.history.affectedSide = 'bilateral';
  assertTrue(
    calculateHipEvaluation(data).flags.some((f) => f.category === 'bilateral-symptomatic'),
    'bilateral-symptomatic fires'
  );
}

{
  const child = emptyEvaluation();
  child.clinician.assessmentDate = '2026-01-01';
  child.patient.birthDate = '2011-06-01'; // age 14 at assessment
  assertTrue(
    calculateHipEvaluation(child).flags.some((f) => f.category === 'paediatric'),
    'paediatric flag fires below 16 years'
  );

  const adult = emptyEvaluation();
  adult.clinician.assessmentDate = '2026-01-01';
  adult.patient.birthDate = '2010-01-01'; // age 16 at assessment
  assertFalse(
    calculateHipEvaluation(adult).flags.some((f) => f.category === 'paediatric'),
    'paediatric flag does not fire at exactly 16 years'
  );
}

{
  const data = withOhsTotal(15);
  data.imaging.kellgrenLawrenceGrade = 4;
  data.conservative.conservativeMeasuresExhausted = 'no';
  data.gait.trendelenburgSign = 'yes';
  data.summary.overrideCandidacy = 'strong-candidate';
  data.summary.overrideReason = 'Clinician judgement.';
  const result = calculateHipEvaluation(data);
  assertEqual(result.finalCandidacy, 'strong-candidate', 'override never suppresses flags: finalCandidacy');
  assertEqual(
    result.computedCandidacy,
    'continue-conservative',
    'override never suppresses flags: computedCandidacy'
  );
  assertTrue(
    result.flags.some((f) => f.category === 'conservative-treatment-not-exhausted'),
    'override never suppresses flags: conservative-treatment-not-exhausted still present'
  );
  assertTrue(
    result.flags.some((f) => f.category === 'trendelenburg-positive'),
    'override never suppresses flags: trendelenburg-positive still present'
  );
}

// ------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) {
  process.exitCode = 1;
}
