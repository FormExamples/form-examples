// ASRS (Adult ADHD Self-Report Scale v1.1) rule definitions.
//
// Each rule evaluates the assessment data and returns true when its
// pattern of responses is present. The grader collects every rule that
// fires; the audit table in the report shows the rule id, domain,
// description, and tentative ADHD classification associated with it.

// Wrapped in an IIFE; published via window.AttentionDeficitAssessment.
(function () {
'use strict';
window.AttentionDeficitAssessment = window.AttentionDeficitAssessment || {};
const { sumScores, countPartAShadedItems } = window.AttentionDeficitAssessment;

const asrsRules = [
  // ─── Part A screener ─────────────────────────────────────
  {
    id: 'ASRS-PA-001',
    domain: 'Part A Screener',
    description: 'Part A screener positive (4+ items in shaded range)',
    classification: 'likely',
    evaluate: (d) => {
      const a = d.asrsPartA;
      return countPartAShadedItems(
        a.focusDifficulty, a.organizationDifficulty, a.rememberingDifficulty,
        a.avoidingTasks, a.fidgeting, a.overlyActive
      ) >= 4;
    }
  },
  {
    id: 'ASRS-PA-002',
    domain: 'Part A Screener',
    description: 'Part A screener borderline (3 items in shaded range)',
    classification: 'possible',
    evaluate: (d) => {
      const a = d.asrsPartA;
      return countPartAShadedItems(
        a.focusDifficulty, a.organizationDifficulty, a.rememberingDifficulty,
        a.avoidingTasks, a.fidgeting, a.overlyActive
      ) === 3;
    }
  },

  // ─── Inattentive domain ──────────────────────────────────
  {
    id: 'ASRS-IN-001',
    domain: 'Inattentive',
    description: 'High inattentive symptom frequency (Part A Q1-3 + Part B Q7-11 total >= 20)',
    classification: 'likely',
    evaluate: (d) => {
      const total = sumScores([
        d.asrsPartA.focusDifficulty,
        d.asrsPartA.organizationDifficulty,
        d.asrsPartA.rememberingDifficulty,
        d.asrsPartB.carelessMistakes,
        d.asrsPartB.attentionDifficulty,
        d.asrsPartB.concentrationDifficulty,
        d.asrsPartB.misplacingThings,
        d.asrsPartB.distractedByNoise
      ]);
      return total >= 20;
    }
  },
  {
    id: 'ASRS-IN-002',
    domain: 'Inattentive',
    description: 'Moderate inattentive symptom frequency (inattentive subscore 14-19)',
    classification: 'possible',
    evaluate: (d) => {
      const total = sumScores([
        d.asrsPartA.focusDifficulty,
        d.asrsPartA.organizationDifficulty,
        d.asrsPartA.rememberingDifficulty,
        d.asrsPartB.carelessMistakes,
        d.asrsPartB.attentionDifficulty,
        d.asrsPartB.concentrationDifficulty,
        d.asrsPartB.misplacingThings,
        d.asrsPartB.distractedByNoise
      ]);
      return total >= 14 && total < 20;
    }
  },

  // ─── Hyperactive-impulsive domain ────────────────────────
  {
    id: 'ASRS-HI-001',
    domain: 'Hyperactive-Impulsive',
    description: 'High hyperactive-impulsive symptom frequency (Part A Q4-6 + Part B Q12-18 total >= 20)',
    classification: 'likely',
    evaluate: (d) => {
      const total = sumScores([
        d.asrsPartA.avoidingTasks,
        d.asrsPartA.fidgeting,
        d.asrsPartA.overlyActive,
        d.asrsPartB.leavingSeat,
        d.asrsPartB.restlessness,
        d.asrsPartB.difficultyRelaxing,
        d.asrsPartB.talkingTooMuch,
        d.asrsPartB.finishingSentences,
        d.asrsPartB.difficultyWaiting,
        d.asrsPartB.interruptingOthers
      ]);
      return total >= 20;
    }
  },
  {
    id: 'ASRS-HI-002',
    domain: 'Hyperactive-Impulsive',
    description: 'Moderate hyperactive-impulsive symptom frequency (hyperactive subscore 14-19)',
    classification: 'possible',
    evaluate: (d) => {
      const total = sumScores([
        d.asrsPartA.avoidingTasks,
        d.asrsPartA.fidgeting,
        d.asrsPartA.overlyActive,
        d.asrsPartB.leavingSeat,
        d.asrsPartB.restlessness,
        d.asrsPartB.difficultyRelaxing,
        d.asrsPartB.talkingTooMuch,
        d.asrsPartB.finishingSentences,
        d.asrsPartB.difficultyWaiting,
        d.asrsPartB.interruptingOthers
      ]);
      return total >= 14 && total < 20;
    }
  },

  // ─── Total score thresholds ──────────────────────────────
  {
    id: 'ASRS-TOT-001',
    domain: 'Total Score',
    description: 'ASRS total score highly elevated (>= 46 of 72)',
    classification: 'highly-likely',
    evaluate: (d) => allASRSScores(d).total >= 46
  },
  {
    id: 'ASRS-TOT-002',
    domain: 'Total Score',
    description: 'ASRS total score elevated (28-45 of 72)',
    classification: 'likely',
    evaluate: (d) => {
      const t = allASRSScores(d).total;
      return t >= 28 && t < 46;
    }
  },
  {
    id: 'ASRS-TOT-003',
    domain: 'Total Score',
    description: 'ASRS total score mildly elevated (24-27 of 72)',
    classification: 'possible',
    evaluate: (d) => {
      const t = allASRSScores(d).total;
      return t >= 24 && t < 28;
    }
  },

  // ─── Childhood onset ─────────────────────────────────────
  {
    id: 'ASRS-CH-001',
    domain: 'Childhood History',
    description: 'Childhood symptoms confirmed with onset before age 12',
    classification: 'likely',
    evaluate: (d) =>
      d.childhoodHistory.childhoodSymptoms === 'yes' &&
      d.childhoodHistory.onsetBeforeAge12 === 'yes'
  },
  {
    id: 'ASRS-CH-002',
    domain: 'Childhood History',
    description: 'Childhood symptoms present but onset age uncertain',
    classification: 'possible',
    evaluate: (d) =>
      d.childhoodHistory.childhoodSymptoms === 'yes' &&
      d.childhoodHistory.onsetBeforeAge12 !== 'yes'
  },

  // ─── Functional impact ───────────────────────────────────
  {
    id: 'ASRS-FI-001',
    domain: 'Functional Impact',
    description: 'Severe functional impairment in 2+ domains',
    classification: 'likely',
    evaluate: (d) => {
      const severeCount = [
        d.functionalImpact.workAcademicImpact,
        d.functionalImpact.relationshipImpact,
        d.functionalImpact.dailyLivingImpact,
        d.functionalImpact.financialManagementImpact,
        d.functionalImpact.timeManagementImpact
      ].filter((v) => v === 'severe').length;
      return severeCount >= 2;
    }
  },
  {
    id: 'ASRS-FI-002',
    domain: 'Functional Impact',
    description: 'Moderate functional impairment in 2+ domains',
    classification: 'possible',
    evaluate: (d) => {
      const moderateOrSevere = [
        d.functionalImpact.workAcademicImpact,
        d.functionalImpact.relationshipImpact,
        d.functionalImpact.dailyLivingImpact,
        d.functionalImpact.financialManagementImpact,
        d.functionalImpact.timeManagementImpact
      ].filter((v) => v === 'moderate' || v === 'severe').length;
      return moderateOrSevere >= 2;
    }
  }
];

/** Convenience helper used by the total-score rules. */
function allASRSScores(d) {
  const partA = sumScores([
    d.asrsPartA.focusDifficulty,
    d.asrsPartA.organizationDifficulty,
    d.asrsPartA.rememberingDifficulty,
    d.asrsPartA.avoidingTasks,
    d.asrsPartA.fidgeting,
    d.asrsPartA.overlyActive
  ]);
  const partB = sumScores([
    d.asrsPartB.carelessMistakes,
    d.asrsPartB.attentionDifficulty,
    d.asrsPartB.concentrationDifficulty,
    d.asrsPartB.misplacingThings,
    d.asrsPartB.distractedByNoise,
    d.asrsPartB.leavingSeat,
    d.asrsPartB.restlessness,
    d.asrsPartB.difficultyRelaxing,
    d.asrsPartB.talkingTooMuch,
    d.asrsPartB.finishingSentences,
    d.asrsPartB.difficultyWaiting,
    d.asrsPartB.interruptingOthers
  ]);
  return { partA, partB, total: partA + partB };
}

window.AttentionDeficitAssessment.asrsRules = asrsRules;
})();
