// Composite perioperative-risk grader.
//
// Runs the four sub-graders (ASA, Mallampati airway, RCRI, STOP-BANG),
// promotes the worst sub-risk to the overall risk level, collects every fired
// rule for the report's audit trail, and attaches the independent flagged
// issues.

import type { AssessmentData, FiredRule, GradingResult } from './types';
import { evaluateAsa } from './asa-rules';
import { evaluateAirway } from './mallampati-rules';
import { evaluateRcri } from './rcri-rules';
import { evaluateStopbang } from './stopbang-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { worstRisk } from './utils';

/**
 * Pure function: grades the assessment with all four instruments and returns
 * the composite perioperative risk, the fired-rule audit trail, and flags.
 */
export function gradeAssessment(d: AssessmentData): GradingResult {
	const asa = evaluateAsa(d);
	const airway = evaluateAirway(d);
	const rcri = evaluateRcri(d);
	const stopbang = evaluateStopbang(d);

	let overallRisk = worstRisk('low', asa.riskLevel);
	overallRisk = worstRisk(overallRisk, airway.riskLevel);
	overallRisk = worstRisk(overallRisk, rcri.riskLevel);
	overallRisk = worstRisk(overallRisk, stopbang.riskLevel);

	const firedRules: FiredRule[] = [
		...asa.firedRules,
		...airway.firedRules,
		...rcri.firedRules,
		...stopbang.firedRules
	];

	return {
		asa,
		airway,
		rcri,
		stopbang,
		overallRisk,
		firedRules,
		additionalFlags: detectAdditionalFlags(d),
		timestamp: new Date().toISOString()
	};
}
