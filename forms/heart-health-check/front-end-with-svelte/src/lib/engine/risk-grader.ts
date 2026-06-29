import type { AssessmentData, FiredRule, GradingResult } from './types';
import { evaluateRules } from './risk-rules';
import { estimateTenYearRisk, calculateHeartAge } from './risk-calculator';
import { detectAdditionalFlags } from './flagged-issues';
import { isLikelyDraft } from './utils';

export interface RiskResult {
	riskCategory: string;
	tenYearRiskPercent: number;
	heartAge: number | null;
	firedRules: FiredRule[];
}

export function calculateRisk(data: AssessmentData): RiskResult {
	if (isLikelyDraft(data)) {
		return { riskCategory: 'draft', tenYearRiskPercent: 0, heartAge: null, firedRules: [] };
	}

	const tenYearRisk = estimateTenYearRisk(data);
	const heartAge = calculateHeartAge(data, tenYearRisk);
	const firedRules = evaluateRules(data, tenYearRisk, heartAge);

	let category: string;
	if (tenYearRisk >= 20) {
		category = 'high';
	} else if (tenYearRisk >= 10) {
		category = 'moderate';
	} else {
		category = 'low';
	}

	return { riskCategory: category, tenYearRiskPercent: tenYearRisk, heartAge, firedRules };
}

/**
 * Full grading entry point: combines the risk calculation, fired rules, and
 * additional clinical flags into a single `GradingResult` with a timestamp.
 * This is the shared engine output rendered by both the wizard report and the
 * clinician dashboard.
 */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const risk = calculateRisk(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		riskCategory: risk.riskCategory,
		tenYearRiskPercent: risk.tenYearRiskPercent,
		heartAge: risk.heartAge,
		firedRules: risk.firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
