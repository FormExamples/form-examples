import type {
	GeneticResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasPathogenicVariant, hasVus } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the ACMG/AMP
 * (ACGS) five-tier variant classification:
 * - major: a pathogenic variant (Class 5 — pathogenic).
 * - moderate: a likely-pathogenic variant (Class 4), or a positive carrier
 *   status / secondary finding requiring action.
 * - minor: a variant of uncertain significance (Class 3 — VUS).
 * - none: a benign / likely-benign result, or no variant detected.
 *
 * The `reportingCategory` is a short ACMG class label suitable for downstream
 * structured-reporting workflows; an explicitly entered category is preserved.
 */
export function gradeSeverity(
	r: GeneticResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const explicit = r.reportingCategory.trim();

	if (r.variantClassification === 'pathogenic') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'pathogenic',
			description: 'Pathogenic variant (ACMG Class 5); abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: explicit || 'Class 5 — pathogenic',
			firedRules
		};
	}

	if (r.variantClassification === 'likely-pathogenic' || hasPathogenicVariant(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'likely-pathogenic',
			description:
				'Likely-pathogenic actionable variant (ACMG Class 4); abnormality severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: explicit || 'Class 4 — likely pathogenic',
			firedRules
		};
	}

	if (r.secondaryFinding || r.carrierStatusPositive) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'A secondary finding or positive carrier status is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: explicit || 'actionable-finding',
			firedRules
		};
	}

	if (hasVus(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'variant-uncertain-significance',
			description:
				'Variant of uncertain significance (ACMG Class 3); abnormality severity graded minor.'
		});
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: explicit || 'Class 3 — uncertain significance',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive result; abnormality severity not established.'
		});
		return {
			abnormalitySeverity: 'none',
			reportingCategory: explicit || 'indeterminate',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-significant-variant',
		description: 'No clinically significant variant; abnormality severity graded none.'
	});
	return {
		abnormalitySeverity: 'none',
		reportingCategory: explicit || 'Class 1/2 — benign / no variant',
		firedRules
	};
}
