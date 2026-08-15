// Boundary tests for the Cataract Diagnostic Evaluation vanilla-JS scoring
// engine (js/composite-grader.js, js/locs-rules.js, js/flagged-issues.js,
// js/types.js).
//
// Ported one-for-one from
// ../../front-end-with-svelte/src/lib/engine/grader.test.ts so the two
// implementations cannot silently diverge. The LOCS III severity-band
// thresholds (3.0 / 5.0) and the surgical-candidacy acuity thresholds
// (LogMAR 0.30 / 0.48) are exactly the places a grading tool goes wrong, so
// each boundary is asserted on both sides.
//
// Run with plain Node (no build step, no test framework dependency):
//   node forms/cataract-diagnostic-evaluation/front-end-with-html/test/engine.test.mjs

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateCataractEvaluation } from '../js/composite-grader.js';
import { emptyEvaluation } from '../js/types.js';

function blank() {
  return emptyEvaluation();
}

function withSlitLamp(right) {
  const d = blank();
  if (right.no !== undefined) d.slitLamp.locsIiiNoRight = right.no;
  if (right.nc !== undefined) d.slitLamp.locsIiiNcRight = right.nc;
  if (right.c !== undefined) d.slitLamp.locsIiiCRight = right.c;
  if (right.p !== undefined) d.slitLamp.locsIiiPRight = right.p;
  return d;
}

// --- empty evaluation --------------------------------------------------

test('empty evaluation grades nothing and raises nothing', () => {
  const r = calculateCataractEvaluation(blank());
  assert.equal(r.locsIIISeverityRight, '');
  assert.equal(r.locsIIISeverityLeft, '');
  assert.equal(r.computedSurgicalCandidacy, 'not-indicated');
  assert.equal(r.finalSurgicalCandidacy, 'not-indicated');
  assert.equal(r.functionalImpactScore, null);
  assert.equal(r.flags.length, 0);
});

// --- LOCS III severity band — nuclear opalescence subscore -------------

for (const [no, expected] of [
  [0.1, 'mild'],
  [1.0, 'mild'],
  [2.9, 'mild'], // just below the moderate boundary
  [3.0, 'moderate'], // inclusive lower bound of moderate
  [4.9, 'moderate'], // just below the severe boundary
  [5.0, 'severe'], // inclusive lower bound of severe
  [6.9, 'severe']
]) {
  test(`LOCS III severity — NO ${no} grades ${expected}`, () => {
    const r = calculateCataractEvaluation(withSlitLamp({ no }));
    assert.equal(r.locsIIISeverityRight, expected);
  });
}

// --- LOCS III severity band — cortical subscore (5.9 ceiling) ----------

for (const [c, expected] of [
  [2.9, 'mild'],
  [3.0, 'moderate'],
  [4.9, 'moderate'],
  [5.0, 'severe'],
  [5.9, 'severe']
]) {
  test(`LOCS III severity — C ${c} grades ${expected}`, () => {
    const r = calculateCataractEvaluation(withSlitLamp({ c }));
    assert.equal(r.locsIIISeverityRight, expected);
  });
}

// --- LOCS III severity band — worst subscore wins -----------------------

test('a single severe subscore overrides three mild subscores', () => {
  const r = calculateCataractEvaluation(withSlitLamp({ no: 1.0, nc: 1.0, c: 1.0, p: 5.0 }));
  assert.equal(r.locsIIISeverityRight, 'severe');
});

test('a single moderate subscore overrides three mild subscores', () => {
  const r = calculateCataractEvaluation(withSlitLamp({ no: 1.0, nc: 1.0, c: 3.5, p: 1.0 }));
  assert.equal(r.locsIIISeverityRight, 'moderate');
});

// --- LOCS III severity band — left eye graded independently -------------

test('grades each eye from its own subscores', () => {
  const d = blank();
  d.slitLamp.locsIiiNoRight = 1.0;
  d.slitLamp.locsIiiNoLeft = 5.5;
  const r = calculateCataractEvaluation(d);
  assert.equal(r.locsIIISeverityRight, 'mild');
  assert.equal(r.locsIIISeverityLeft, 'severe');
});

// --- surgical candidacy — not-indicated ----------------------------------

test('mild severity both eyes with 6/12-or-better acuity both eyes stays not-indicated', () => {
  const d = blank();
  d.slitLamp.locsIiiNoRight = 1.0;
  d.slitLamp.locsIiiNoLeft = 1.0;
  d.acuity.bestCorrectedVaLogmarRight = 0.3; // exactly 6/12
  d.acuity.bestCorrectedVaLogmarLeft = 0.0;
  const r = calculateCataractEvaluation(d);
  assert.equal(r.computedSurgicalCandidacy, 'not-indicated');
});

// --- surgical candidacy — acuity worse than 6/12 boundary ----------------

for (const [logmar, expected] of [
  [0.3, 'not-indicated'], // 6/12 exactly: not worse than 6/12
  [0.31, 'consider'] // just worse than 6/12
]) {
  test(`best-corrected LogMAR ${logmar} yields ${expected} (6/12 boundary)`, () => {
    const d = blank();
    d.acuity.bestCorrectedVaLogmarRight = logmar;
    d.acuity.bestCorrectedVaLogmarLeft = 0.0;
    const r = calculateCataractEvaluation(d);
    assert.equal(r.computedSurgicalCandidacy, expected);
  });
}

// --- surgical candidacy — acuity worse than 6/18 boundary ----------------

for (const [logmar, expected] of [
  [0.47, 'consider'], // just short of the 6/18 threshold, only "consider"
  [0.48, 'indicated'] // inclusive lower bound of indicated
]) {
  test(`best-corrected LogMAR ${logmar} yields ${expected} (6/18 boundary)`, () => {
    const d = blank();
    d.acuity.bestCorrectedVaLogmarRight = logmar;
    d.acuity.bestCorrectedVaLogmarLeft = 0.0;
    const r = calculateCataractEvaluation(d);
    assert.equal(r.computedSurgicalCandidacy, expected);
  });
}

// --- surgical candidacy — LOCS III severity drives the recommendation ---

test('moderate severity yields consider', () => {
  const r = calculateCataractEvaluation(withSlitLamp({ no: 3.5 }));
  assert.equal(r.computedSurgicalCandidacy, 'consider');
});

test('severe severity yields indicated', () => {
  const r = calculateCataractEvaluation(withSlitLamp({ no: 5.5 }));
  assert.equal(r.computedSurgicalCandidacy, 'indicated');
});

// --- surgical candidacy — severe glare impact independently indicates ---

test('a mild LOCS III grade with severe glare impact still yields indicated', () => {
  const d = withSlitLamp({ no: 1.0 });
  d.glare.glareFunctionalImpact = 'severe';
  const r = calculateCataractEvaluation(d);
  assert.equal(r.computedSurgicalCandidacy, 'indicated');
});

// --- safety flags — competing pathology suspected ------------------------

test('competing pathology fires when glaucoma is suspected and overrides candidacy to urgent-referral', () => {
  const d = blank();
  d.differential.glaucomaSuspected = 'yes';
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.map((f) => f.category).includes('competing-pathology-suspected'));
  assert.equal(r.computedSurgicalCandidacy, 'urgent-referral');
});

// --- safety flags — raised intraocular pressure ---------------------------

for (const [iop, shouldFire] of [
  [21, false],
  [21.1, true]
]) {
  test(`IOP ${iop} mmHg fires=${shouldFire}`, () => {
    const d = blank();
    d.tonometry.intraocularPressureRightMmhg = iop;
    const r = calculateCataractEvaluation(d);
    assert.equal(r.flags.some((f) => f.category === 'raised-iop'), shouldFire);
  });
}

// --- safety flags — view obscured, fundus not assessed --------------------

test('fires when the cataract obscures the view and no dilated exam was performed', () => {
  const d = blank();
  d.fundus.viewObscuredByCataractRight = 'yes';
  d.fundus.dilatedFundusExamPerformed = 'no';
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.some((f) => f.category === 'view-obscured-fundus-not-assessed'));
});

test('view-obscured does not fire when the dilated exam was performed', () => {
  const d = blank();
  d.fundus.viewObscuredByCataractRight = 'yes';
  d.fundus.dilatedFundusExamPerformed = 'yes';
  const r = calculateCataractEvaluation(d);
  assert.equal(r.flags.some((f) => f.category === 'view-obscured-fundus-not-assessed'), false);
});

// --- safety flags — rapid progression --------------------------------------

test('rapid progression fires with less than 3 months duration and a severe grade', () => {
  const d = withSlitLamp({ no: 5.5 });
  d.symptoms.symptomDurationMonths = 2;
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.some((f) => f.category === 'rapid-progression'));
});

test('rapid progression does not fire at exactly 3 months', () => {
  const d = withSlitLamp({ no: 5.5 });
  d.symptoms.symptomDurationMonths = 3;
  const r = calculateCataractEvaluation(d);
  assert.equal(r.flags.some((f) => f.category === 'rapid-progression'), false);
});

// --- safety flags — biometry incomplete for surgical planning -------------

test('fires when a surgical referral is recommended without biometry', () => {
  const d = blank();
  d.management.managementRecommendation = 'surgical-referral-routine';
  d.biometry.biometryPerformed = 'no';
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.some((f) => f.category === 'biometry-incomplete-for-surgical-planning'));
});

test('does not fire once biometry is performed', () => {
  const d = blank();
  d.management.managementRecommendation = 'surgical-referral-urgent';
  d.biometry.biometryPerformed = 'yes';
  const r = calculateCataractEvaluation(d);
  assert.equal(r.flags.some((f) => f.category === 'biometry-incomplete-for-surgical-planning'), false);
});

// --- safety flags — paediatric ---------------------------------------------

test('paediatric fires for a patient under 16 and overrides candidacy to urgent-referral', () => {
  const d = blank();
  d.clinician.assessmentDate = '2026-01-01';
  d.patient.birthDate = '2015-06-01'; // 10 years old at assessment
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.some((f) => f.category === 'paediatric'));
  assert.equal(r.computedSurgicalCandidacy, 'urgent-referral');
});

test('paediatric does not fire at exactly 16', () => {
  const d = blank();
  d.clinician.assessmentDate = '2026-01-01';
  d.patient.birthDate = '2010-01-01'; // exactly 16 years old
  const r = calculateCataractEvaluation(d);
  assert.equal(r.flags.some((f) => f.category === 'paediatric'), false);
});

// --- functional impact score -----------------------------------------------

test('functional impact score sums the three 0-4 sub-scores', () => {
  const d = blank();
  d.functional.functionalDifficultyReading = 3;
  d.functional.functionalDifficultyDriving = 4;
  d.functional.functionalDifficultyDailyActivities = 2;
  const r = calculateCataractEvaluation(d);
  assert.equal(r.functionalImpactScore, 9);
});

test('functional impact score is null when nothing is answered', () => {
  const r = calculateCataractEvaluation(blank());
  assert.equal(r.functionalImpactScore, null);
});

// --- clinician override -----------------------------------------------------

test('the override changes the final recommendation and records a reason', () => {
  const d = withSlitLamp({ no: 5.5 }); // computed: indicated
  d.summary.overrideSurgicalCandidacy = 'consider';
  d.summary.overrideReason = 'Patient prefers to defer surgery for now.';
  const r = calculateCataractEvaluation(d);
  assert.equal(r.computedSurgicalCandidacy, 'indicated');
  assert.equal(r.finalSurgicalCandidacy, 'consider');
  assert.equal(r.overrideReason, 'Patient prefers to defer surgery for now.');
});

test('safety flags are never suppressed by the override', () => {
  const d = blank();
  d.differential.glaucomaSuspected = 'yes';
  d.summary.overrideSurgicalCandidacy = 'not-indicated';
  d.summary.overrideReason = 'Attempted override.';
  const r = calculateCataractEvaluation(d);
  assert.ok(r.flags.some((f) => f.category === 'competing-pathology-suspected'));
  assert.equal(r.finalSurgicalCandidacy, 'not-indicated');
});

test('no override reason is recorded when the final value matches the computed value', () => {
  const d = withSlitLamp({ no: 5.5 });
  d.summary.overrideSurgicalCandidacy = 'indicated';
  d.summary.overrideReason = 'Should be ignored.';
  const r = calculateCataractEvaluation(d);
  assert.equal(r.overrideReason, '');
});
