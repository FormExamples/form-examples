// Pure scoring engine — port of `src/lib/engine/endo-grader.ts`. Evaluates
// all rules, derives ASRM stage, computes ASRM points, EHP-30 average, and
// overall severity. No side effects.
(function () {
'use strict';
const NS = window.EndometriosisAssessment;
const { endoRules, calculateEHP30Total } = NS;

/** Pure: evaluate all endo rules; compute stage, points, EHP-30 average, severity. */
function calculateEndoGrade(data) {
  const firedRules = [];
  for (const rule of endoRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`Endo rule ${rule.id} evaluation failed:`, e);
    }
  }

  const asrmStage = deriveASRMStage(data, firedRules);
  const asrmPoints = calculateASRMPoints(firedRules, data);
  const ehp30Score = calculateEHP30Total(
    data.qualityOfLife.painDomainScore,
    data.qualityOfLife.controlPowerlessnessScore,
    data.qualityOfLife.emotionalWellbeingScore,
    data.qualityOfLife.socialSupportScore,
    data.qualityOfLife.selfImageScore
  );
  const overallSeverity = deriveOverallSeverity(firedRules, asrmStage, ehp30Score);

  // Additional flags injected by app.js (separately for parity with TS layout).
  return {
    asrmStage,
    asrmPoints,
    ehp30Score,
    overallSeverity,
    firedRules,
    timestamp: new Date().toISOString()
  };
}

/** Derive ASRM Stage from surgical history or symptom burden. */
function deriveASRMStage(data, firedRules) {
  const surgicalStage = data.surgicalHistory.asrmStageAtSurgery;
  if (surgicalStage === 'I') return 1;
  if (surgicalStage === 'II') return 2;
  if (surgicalStage === 'III') return 3;
  if (surgicalStage === 'IV') return 4;

  const maxGrade = firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 0;
  const totalGrade = firedRules.reduce((sum, r) => sum + r.grade, 0);

  if (maxGrade >= 4 || totalGrade > 40) return 4;
  if (maxGrade >= 3 || totalGrade > 15) return 3;
  if (maxGrade >= 2 || totalGrade > 5) return 2;
  if (firedRules.length > 0) return 1;
  return null;
}

/** Approximate ASRM points from fired rules + organ involvement extras. */
function calculateASRMPoints(firedRules, data) {
  let points = 0;
  for (const rule of firedRules) {
    switch (rule.grade) {
      case 1: points += 1; break;
      case 2: points += 4; break;
      case 3: points += 8; break;
      case 4: points += 16; break;
    }
  }
  if (data.gastrointestinalSymptoms.bowelObstructionSymptoms === 'yes') points += 10;
  if (data.urinarySymptoms.urinaryObstructionSymptoms === 'yes') points += 10;
  if (data.surgicalHistory.endometriomaDrained === 'yes') points += 5;
  return points;
}

/** Severity from rules, ASRM stage, and EHP-30. */
function deriveOverallSeverity(firedRules, asrmStage, ehp30Score) {
  const maxGrade = firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 0;
  if (maxGrade >= 4 || asrmStage === 4) return 'critical';
  if (maxGrade >= 3 || asrmStage === 3 || (ehp30Score !== null && ehp30Score > 75)) return 'severe';
  if (maxGrade >= 2 || asrmStage === 2 || (ehp30Score !== null && ehp30Score > 50)) return 'moderate';
  return 'mild';
}

Object.assign(window.EndometriosisAssessment, {
  calculateEndoGrade,
  deriveASRMStage,
  calculateASRMPoints,
  deriveOverallSeverity
});
})();
