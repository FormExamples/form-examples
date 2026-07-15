import { detectFlaggedIssues } from './flags.js';
import { gradeClinical, gradeMax, gradeOperational, gradePREM, gradePROM, promisGphTScore, promisMhTScore } from './rules.js';

// Four-domain grader for the Outpatient Outcome Composite Grade (OOCG).
//
// Composes the domain graders in rules.js and the flagged issues in flags.js
// into a single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)` (aliased `gradeOOCG`). The overall grade is the worst
// of the four domain grades ("highest severity wins"). Output shape, rule IDs,
// and flag IDs are identical across every front-end and the back-end.
//
// Wrapped in an IIFE; published via `window.OutpatientOutcome`.

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the assessment data model from emptyAssessment()
 * @returns {{
 *   overallGrade:string,
 *   clinicalGrade:string,
 *   promGrade:string,
 *   premGrade:string,
 *   operationalGrade:string,
 *   firedRules:object[],
 *   flaggedIssues:object[],
 *   timestamp:string
 * }}
 */
function calculateGrade(data) {
  

  // Enrich with derived PROMIS T-scores before grading.
  const enrichedData = {
    ...data,
    promPromis: {
      ...data.promPromis,
      globalPhysicalHealthTScore: promisGphTScore(data.promPromis),
      globalMentalHealthTScore: promisMhTScore(data.promPromis)
    }
  };

  const clinical = gradeClinical(enrichedData);
  const prom = gradePROM(enrichedData);
  const prem = gradePREM(enrichedData);
  const operational = gradeOperational(enrichedData);

  const overallGrade = gradeMax([
    clinical.grade,
    prom.grade,
    prem.grade,
    operational.grade
  ]);

  const firedRules = [
    ...clinical.rules,
    ...prom.rules,
    ...prem.rules,
    ...operational.rules
  ];

  const flaggedIssues = detectFlaggedIssues(enrichedData, clinical.grade, prem.grade);

  return {
    overallGrade,
    clinicalGrade: clinical.grade,
    promGrade: prom.grade,
    premGrade: prem.grade,
    operationalGrade: operational.grade,
    firedRules,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
}

export const gradeOOCG = calculateGrade;

export { calculateGrade };
