import type { AssessmentData, GradingResult } from './types';
import { gradeClinical } from './clinical-domain';
import { gradePROM } from './prom-domain';
import { gradePREM } from './prem-domain';
import { gradeOperational } from './operational-domain';
import { detectFlaggedIssues } from './flagged-issues';
import { gradeMax, promisGphTScore, promisMhTScore } from './utils';

/**
 * Orchestrator: compute the full OOCG grading result from assessment data.
 *
 * The overall grade is the worst of the four domain grades ("highest severity wins").
 */
export function gradeOOCG(data: AssessmentData): GradingResult {
	// Update derived PROMIS T-scores before grading
	const enrichedData: AssessmentData = {
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
