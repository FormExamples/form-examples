import type {
	DexaBoneDensityResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { effectiveWhoClassification, hasCriticalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * The severity ladder (none → minor → moderate → major) is grounded in the WHO
 * densitometric classification, and the `reportingCategory` **carries the WHO
 * class** (normal / osteopenia / osteoporosis / severe-osteoporosis) for
 * downstream structured-reporting workflows:
 * - major: severe (established) or plain osteoporosis (T ≤ −2.5).
 * - moderate: osteopenia (low bone mass).
 * - none: normal bone density.
 *
 * The recorded / derived WHO classification is the structured-reporting label.
 */
export function gradeSeverity(
	r: DexaBoneDensityResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const who = effectiveWhoClassification(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'severe-osteoporosis',
			description:
				'Severe (established) osteoporosis; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: 'severe-osteoporosis',
			firedRules
		};
	}

	if (who === 'osteoporosis') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'osteoporosis',
			description: 'Osteoporosis (T ≤ −2.5); abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'osteoporosis', firedRules };
	}

	if (who === 'osteopenia') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'osteopenia',
			description: 'Osteopenia (low bone mass); abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'osteopenia', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive study; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'normal-bone-density',
		description: 'Normal bone density; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
