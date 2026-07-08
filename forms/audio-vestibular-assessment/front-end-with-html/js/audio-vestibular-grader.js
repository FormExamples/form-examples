// Audio-Vestibular Assessment grader. Pure functions: take an
// `AssessmentData` object, return:
//
//   - per-ear PTA averages (4-frequency: 0.5 + 1 + 2 + 4 kHz / 4)
//   - the better-ear PTA (smaller of the two)
//   - the WHO hearing-loss grade
//   - inter-aural asymmetry in dB
//   - the DHI total (0-100), per-subscale subtotals, and handicap level
//   - the per-item answered count for both instruments (audit trail)

(function () {
'use strict';
const NS = window.AudioVestibularAssessment = window.AudioVestibularAssessment || {};
const {
  DHI_ITEMS,
  calculatePtaFromThresholds,
  classifyHearingLossGrade,
  dhiAnswerScore,
  classifyDhiHandicap
} = NS;

/**
 * Compute pure-tone audiometry results: per-ear PTAs, better-ear PTA,
 * asymmetry, and the WHO hearing-loss grade.
 */
function calculatePureToneAudiometry(data) {
  const right = data.pureToneAudiometry.rightEar.airConduction;
  const left  = data.pureToneAudiometry.leftEar.airConduction;
  const rightPta = calculatePtaFromThresholds(right);
  const leftPta  = calculatePtaFromThresholds(left);

  let betterEarPta = null;
  if (rightPta != null && leftPta != null) {
    betterEarPta = Math.min(rightPta, leftPta);
  } else if (rightPta != null) {
    betterEarPta = rightPta;
  } else if (leftPta != null) {
    betterEarPta = leftPta;
  }

  const asymmetry = (rightPta != null && leftPta != null)
    ? Math.round(Math.abs(rightPta - leftPta) * 10) / 10
    : null;

  const grade = classifyHearingLossGrade(betterEarPta);

  // Per-ear grades, useful for the report.
  const rightGrade = classifyHearingLossGrade(rightPta);
  const leftGrade  = classifyHearingLossGrade(leftPta);

  return {
    rightPta,
    leftPta,
    betterEarPta,
    asymmetry,
    hearingLossGrade: grade,
    rightHearingLossGrade: rightGrade,
    leftHearingLossGrade: leftGrade
  };
}

/**
 * Compute the Dizziness Handicap Inventory total, per-subscale subtotals
 * (functional / emotional / physical), and the handicap level.
 */
function calculateDhi(data) {
  const answers = data.dizzinessHandicapInventory || {};
  let total = 0;
  let answeredCount = 0;
  let functional = 0;
  let emotional = 0;
  let physical = 0;
  /** @type {{ id: string, num: number, subscale: string, text: string, answer: string, score: number }[]} */
  const firedItems = [];

  for (const item of DHI_ITEMS) {
    const key = 'q' + item.num;
    const answer = answers[key] || '';
    if (answer !== '') answeredCount++;
    const score = dhiAnswerScore(answer);
    total += score;
    if (item.subscale === 'F') functional += score;
    else if (item.subscale === 'E') emotional += score;
    else if (item.subscale === 'P') physical  += score;
    firedItems.push({
      id: 'DHI-' + String(item.num).padStart(2, '0'),
      num: item.num,
      subscale: item.subscale,
      text: item.text,
      answer,
      score
    });
  }

  const handicapLevel = classifyDhiHandicap(total);

  return {
    total,
    answeredCount,
    functional,
    emotional,
    physical,
    handicapLevel,
    firedItems
  };
}

/**
 * Run the entire audio-vestibular grading pipeline against the supplied
 * assessment data and produce a flat `GradingResult` object.
 */
function grade(data) {
  const pta = calculatePureToneAudiometry(data);
  const dhi = calculateDhi(data);
  return {
    // PTA fields
    rightPta: pta.rightPta,
    leftPta: pta.leftPta,
    betterEarPta: pta.betterEarPta,
    asymmetry: pta.asymmetry,
    hearingLossGrade: pta.hearingLossGrade,
    rightHearingLossGrade: pta.rightHearingLossGrade,
    leftHearingLossGrade: pta.leftHearingLossGrade,
    // DHI fields
    dhiTotal: dhi.total,
    dhiAnsweredCount: dhi.answeredCount,
    dhiFunctional: dhi.functional,
    dhiEmotional: dhi.emotional,
    dhiPhysical: dhi.physical,
    dhiHandicapLevel: dhi.handicapLevel,
    dhiFiredItems: dhi.firedItems
  };
}

Object.assign(NS, {
  calculatePureToneAudiometry,
  calculateDhi,
  grade
});
})();
