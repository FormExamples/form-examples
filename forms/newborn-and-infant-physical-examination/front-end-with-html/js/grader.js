import { LOW_SAT, nipeReferRules } from './rules.js';

// NIPE grader. Pure functions: take an `ExaminationData` object, classify each
// of the four key screening components, roll the applicable components up into
// an overall screening outcome, compute completeness, and emit the referral
// pathways plus an audit trail of the classification rules that fired.
//
// Classification algorithm (spec §4):
//   eyesResult   = eyes refer trigger        ? 'refer'
//                : all eyes obs unexamined    ? 'not-examined' : 'satisfactory'
//   heartResult  = heart refer trigger       ? 'refer'
//                : all heart obs unexamined   ? 'not-examined' : 'satisfactory'
//   hipsResult   = hips refer trigger        ? 'refer'
//                : all hip manoeuvres unexam. ? 'not-examined' : 'satisfactory'
//   testesResult = sex != 'male'             ? 'not-applicable'
//                : testes refer trigger       ? 'refer'
//                : both testes unexamined     ? 'not-examined' : 'satisfactory'
//
//   overallOutcome (over applicable components; testes excluded when N/A):
//     any 'refer'        -> 'refer'
//     any 'not-examined' -> 'incomplete'
//     otherwise          -> 'satisfactory'
//
//   completeness        = any applicable 'not-examined' ? 'incomplete' : 'complete'
//   completenessPercent = examined applicable / total applicable * 100
//
// A screening classification records whether onward referral is indicated; it
// is not a diagnosis.

/**
 * @typedef {import('./types.js').ExaminationData} ExaminationData
 * @typedef {import('./types.js').ComponentResult} ComponentResult
 * @typedef {import('./types.js').TestesResult} TestesResult
 * @typedef {import('./types.js').OverallOutcome} OverallOutcome
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.NewbornAndInfantPhysicalExamination.

/** An enum observation counts as unexamined when blank or explicitly not-examined. */
function enumUnexamined(v) {
  return v === '' || v === 'not-examined' || v === null || v === undefined;
}

/** True when every eyes observation is unexamined. */
function eyesAllUnexamined(d) {
  return (
    enumUnexamined(d.eyes.eyesRedReflexRight) &&
    enumUnexamined(d.eyes.eyesRedReflexLeft) &&
    enumUnexamined(d.eyes.eyesAppearance)
  );
}

/** True when every heart observation (enums + both saturations) is unexamined. */
function heartAllUnexamined(d) {
  return (
    enumUnexamined(d.heart.heartMurmur) &&
    enumUnexamined(d.heart.femoralPulsesRight) &&
    enumUnexamined(d.heart.femoralPulsesLeft) &&
    enumUnexamined(d.heart.centralCyanosis) &&
    d.heart.oxygenSaturationPreductal === null &&
    d.heart.oxygenSaturationPostductal === null
  );
}

/** True when every hip manoeuvre is unexamined (risk factors excluded). */
function hipsAllUnexamined(d) {
  return (
    enumUnexamined(d.hips.barlowTest) &&
    enumUnexamined(d.hips.ortolaniTest) &&
    enumUnexamined(d.hips.hipAbduction)
  );
}

/** True when both testes are unexamined. */
function testesBothUnexamined(d) {
  return (
    enumUnexamined(d.testes.testisRight) &&
    enumUnexamined(d.testes.testisLeft)
  );
}

/** Did a given component's refer rule fire? */
function componentRefers(d, component) {
  const rule = nipeReferRules.find((r) => r.component === component);
  return rule ? rule.evaluate(d) : false;
}

/** Is the heart refer critical (same-day) rather than routine? */
function heartCritical(d) {
  return (
    d.heart.centralCyanosis === 'present' ||
    d.heart.femoralPulsesRight === 'weak' ||
    d.heart.femoralPulsesRight === 'absent' ||
    d.heart.femoralPulsesLeft === 'weak' ||
    d.heart.femoralPulsesLeft === 'absent' ||
    (d.heart.oxygenSaturationPreductal !== null &&
      d.heart.oxygenSaturationPreductal < LOW_SAT) ||
    (d.heart.oxygenSaturationPostductal !== null &&
      d.heart.oxygenSaturationPostductal < LOW_SAT)
  );
}

/** Is the hip refer driven by an abnormal exam (vs a risk factor only)? */
function hipsAbnormalExam(d) {
  return (
    d.hips.barlowTest === 'positive' ||
    d.hips.ortolaniTest === 'positive' ||
    d.hips.hipAbduction === 'limited'
  );
}

/** Are both testes undescended / not palpable (bilateral)? */
function testesBilateral(d) {
  const bad = (v) => v === 'undescended' || v === 'not-palpable';
  return bad(d.testes.testisRight) && bad(d.testes.testisLeft);
}

/**
 * Classify a three-state key component.
 * @returns {ComponentResult}
 */
function classifyComponent(refers, allUnexamined) {
  if (refers) return 'refer';
  if (allUnexamined) return 'not-examined';
  return 'satisfactory';
}

/**
 * Compute the full NIPE classification for the supplied examination data.
 * @param {ExaminationData} data
 * @returns {{ eyesResult: ComponentResult, heartResult: ComponentResult,
 *             hipsResult: ComponentResult, testesResult: TestesResult,
 *             overallOutcome: OverallOutcome, completeness: ('complete'|'incomplete'),
 *             completenessPercent: number, referrals: Referral[],
 *             firedRules: FiredRule[] }}
 */
function calculateNipeGrade(data) {
  const d = data;

  const eyesResult = classifyComponent(
    componentRefers(d, 'eyes'), eyesAllUnexamined(d));
  const heartResult = classifyComponent(
    componentRefers(d, 'heart'), heartAllUnexamined(d));
  const hipsResult = classifyComponent(
    componentRefers(d, 'hips'), hipsAllUnexamined(d));

  /** @type {TestesResult} */
  let testesResult;
  if (d.identification.sex !== 'male') {
    testesResult = 'not-applicable';
  } else {
    testesResult = classifyComponent(
      componentRefers(d, 'testes'), testesBothUnexamined(d));
  }

  // Applicable components for the roll-up (testes excluded when not-applicable).
  const applicable = [eyesResult, heartResult, hipsResult];
  if (testesResult !== 'not-applicable') applicable.push(testesResult);

  /** @type {OverallOutcome} */
  let overallOutcome;
  if (applicable.some((r) => r === 'refer')) {
    overallOutcome = 'refer';
  } else if (applicable.some((r) => r === 'not-examined')) {
    overallOutcome = 'incomplete';
  } else {
    overallOutcome = 'satisfactory';
  }

  const anyNotExamined = applicable.some((r) => r === 'not-examined');
  const completeness = anyNotExamined ? 'incomplete' : 'complete';
  const examined = applicable.filter((r) => r !== 'not-examined').length;
  const completenessPercent =
    applicable.length > 0
      ? Math.round((examined / applicable.length) * 100)
      : 0;

  // ─── Referral pathways (one per refer component) ────────────────
  /** @type {Referral[]} */
  const referrals = [];
  if (eyesResult === 'refer') {
    referrals.push({
      component: 'eyes',
      pathway: 'Urgent ophthalmology — suspected congenital cataract',
      urgency: 'within-2-weeks'
    });
  }
  if (heartResult === 'refer') {
    referrals.push({
      component: 'heart',
      pathway: heartCritical(d)
        ? 'Urgent cardiac / neonatal review — possible critical congenital heart disease'
        : 'Cardiac / neonatal assessment per local pathway',
      urgency: heartCritical(d) ? 'same-day' : 'within-2-weeks'
    });
  }
  if (hipsResult === 'refer') {
    referrals.push({
      component: 'hips',
      pathway: 'Hip ultrasound (developmental dysplasia of the hip)',
      urgency: hipsAbnormalExam(d) ? 'within-2-weeks' : 'by-6-weeks'
    });
  }
  if (testesResult === 'refer') {
    referrals.push({
      component: 'testes',
      pathway: testesBilateral(d)
        ? 'Same-day senior / endocrine review — possible disorder of sex development'
        : 'Senior / urology review; refer if persistent',
      urgency: testesBilateral(d) ? 'same-day' : 'review-6-8-weeks'
    });
  }

  // ─── Audit trail of fired classification rules ──────────────────
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const rule of nipeReferRules) {
    if (rule.component === 'testes' && testesResult === 'not-applicable') continue;
    try {
      if (rule.evaluate(d)) {
        firedRules.push({
          id: rule.id,
          component: rule.component,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`NIPE rule ${rule.id} evaluation failed:`, e);
    }
  }
  firedRules.push({
    id: 'R-OVERALL-01',
    component: 'overall',
    category: 'outcome-rollup',
    description:
      overallOutcome === 'refer'
        ? 'One or more key components classed Refer — referral pathway triggered'
        : overallOutcome === 'incomplete'
        ? 'One or more applicable key components Not examined — screen must be completed'
        : 'All applicable key components examined and Satisfactory'
  });

  return {
    eyesResult,
    heartResult,
    hipsResult,
    testesResult,
    overallOutcome,
    completeness,
    completenessPercent,
    referrals,
    firedRules
  };
}

export { calculateNipeGrade, heartCritical, hipsAbnormalExam, testesBilateral };
