import type { AssessmentData, FiredRule, GradingResult } from './types';
import {
	kdigoRules,
	resolveEgfr,
	resolveGfrCategory,
	resolveAlbuminuriaCategory,
	kdigoCompositeRisk
} from './kdigo-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Run the KDIGO classification against the supplied assessment data and produce
 * the resolved GFR category (G1–G5), albuminuria category (A1–A3), composite
 * risk level, the underlying numeric eGFR and ACR values, the per-rule audit
 * trail, and the safety-critical flags.
 *
 * Pure function: no side effects beyond a stable timestamp.
 *
 * Risk heatmap (KDIGO 2012/2024):
 *
 *                A1 (<3)   A2 (3-30)  A3 (>30)
 *   G1 (>=90)    Low       Moderate   High
 *   G2 (60-89)   Low       Moderate   High
 *   G3a (45-59)  Moderate  High       Very High
 *   G3b (30-44)  High      Very High  Very High
 *   G4 (15-29)   Very High Very High  Very High
 *   G5 (<15)     Very High Very High  Very High
 */
export function calculateKdigo(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	for (const rule of kdigoRules) {
		try {
			const value = rule.evaluate(data);
			if (value) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					value
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading
			console.warn(`KDIGO rule ${rule.id} evaluation failed:`, e);
		}
	}

	const gfrCategory = resolveGfrCategory(data) || '';
	const albuminuriaCategory = resolveAlbuminuriaCategory(data) || '';
	const riskLevel = kdigoCompositeRisk(gfrCategory, albuminuriaCategory);
	const egfr = resolveEgfr(data);
	const acr = typeof data.urineTests.acr === 'number' ? data.urineTests.acr : null;
	const additionalFlags = detectAdditionalFlags(data);

	return {
		gfrCategory,
		albuminuriaCategory,
		riskLevel,
		egfr,
		acr,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
