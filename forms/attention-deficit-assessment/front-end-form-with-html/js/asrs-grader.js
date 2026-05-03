// ASRS grader. Pure functions: take an `AssessmentData` object and return
// the Part A score, Part B score, total, subscores, classification, subtype
// and the list of rules that fired.
//
// Classification cutoffs (mirror SvelteKit reference):
//   Part A screener positive AND total >= 46  -> highly-likely
//   Part A screener positive AND total >= 28  -> likely
//   Part A screener positive OR total >= 24   -> possible
//   else                                       -> unlikely

(function () {
'use strict';
window.AttentionDeficitAssessment = window.AttentionDeficitAssessment || {};
const NS = window.AttentionDeficitAssessment;
const {
  asrsRules,
  sumScores,
  countPartAShadedItems,
  classifyFromTotal,
  determineSubtype
} = NS;

/** Pure function: evaluate ASRS scoring against patient data. */
function calculateASRS(data) {
  const partAScores = [
    data.asrsPartA.focusDifficulty,
    data.asrsPartA.organizationDifficulty,
    data.asrsPartA.rememberingDifficulty,
    data.asrsPartA.avoidingTasks,
    data.asrsPartA.fidgeting,
    data.asrsPartA.overlyActive
  ];
  const partAScore = sumScores(partAScores);

  const partBScores = [
    data.asrsPartB.carelessMistakes,
    data.asrsPartB.attentionDifficulty,
    data.asrsPartB.concentrationDifficulty,
    data.asrsPartB.misplacingThings,
    data.asrsPartB.distractedByNoise,
    data.asrsPartB.leavingSeat,
    data.asrsPartB.restlessness,
    data.asrsPartB.difficultyRelaxing,
    data.asrsPartB.talkingTooMuch,
    data.asrsPartB.finishingSentences,
    data.asrsPartB.difficultyWaiting,
    data.asrsPartB.interruptingOthers
  ];
  const partBScore = sumScores(partBScores);

  const asrsTotal = partAScore + partBScore;

  const shadedCount = countPartAShadedItems(
    data.asrsPartA.focusDifficulty,
    data.asrsPartA.organizationDifficulty,
    data.asrsPartA.rememberingDifficulty,
    data.asrsPartA.avoidingTasks,
    data.asrsPartA.fidgeting,
    data.asrsPartA.overlyActive
  );
  const partAScreenerPositive = shadedCount >= 4;

  const inattentiveSubscore = sumScores([
    data.asrsPartA.focusDifficulty,
    data.asrsPartA.organizationDifficulty,
    data.asrsPartA.rememberingDifficulty,
    data.asrsPartB.carelessMistakes,
    data.asrsPartB.attentionDifficulty,
    data.asrsPartB.concentrationDifficulty,
    data.asrsPartB.misplacingThings,
    data.asrsPartB.distractedByNoise
  ]);

  const hyperactiveImpulsiveSubscore = sumScores([
    data.asrsPartA.avoidingTasks,
    data.asrsPartA.fidgeting,
    data.asrsPartA.overlyActive,
    data.asrsPartB.leavingSeat,
    data.asrsPartB.restlessness,
    data.asrsPartB.difficultyRelaxing,
    data.asrsPartB.talkingTooMuch,
    data.asrsPartB.finishingSentences,
    data.asrsPartB.difficultyWaiting,
    data.asrsPartB.interruptingOthers
  ]);

  const classification = classifyFromTotal(asrsTotal, partAScreenerPositive);
  const subtype = determineSubtype(
    inattentiveSubscore,
    hyperactiveImpulsiveSubscore,
    classification
  );

  const firedRules = [];
  for (const rule of asrsRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          domain: rule.domain,
          description: rule.description,
          classification: rule.classification
        });
      }
    } catch (e) {
      console.warn(`ASRS rule ${rule.id} evaluation failed:`, e);
    }
  }

  return {
    asrsTotal,
    partAScore,
    partBScore,
    inattentiveSubscore,
    hyperactiveImpulsiveSubscore,
    partAScreenerPositive,
    shadedCount,
    classification,
    subtype,
    firedRules
  };
}

NS.calculateASRS = calculateASRS;
})();
