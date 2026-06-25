import type {
	LumbarPunctureResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, culturePositive } from './utils';

/**
 * Derives the structured-reporting category (CSF pattern label) for downstream
 * structured-reporting workflows.
 */
function deriveReportingCategory(r: LumbarPunctureResult): string {
	if (r.bacterialMeningitisPattern || culturePositive(r)) return 'bacterial-pattern';
	if (r.subarachnoidHaemorrhageSuggested || r.xanthochromia === 'positive') return 'SAH-pattern';
	if (r.viralPattern) return 'viral-pattern';
	if (r.oligoclonalBands === 'positive') return 'inflammatory-demyelinating';
	if (r.pleocytosis) return 'pleocytosis';
	if (r.raisedProtein) return 'raised-protein';
	if (r.normalCsf) return 'normal';
	return 'indeterminate';
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in standard CSF
 * interpretation and NICE NG240 / UK NEQAS thresholds:
 * - major: a critical CSF result (bacterial meningitis pattern, suggested SAH,
 *   or positive culture).
 * - moderate: an actionable abnormal pattern (viral pattern, low glucose, or
 *   combined pleocytosis with raised protein).
 * - minor: an isolated single abnormality (raised protein only, isolated
 *   pleocytosis, or positive oligoclonal bands).
 * - none: a normal CSF analysis.
 */
export function gradeSeverity(
	r: LumbarPunctureResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const reportingCategory = r.reportingCategory.trim() !== '' ? r.reportingCategory : deriveReportingCategory(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-result',
			description: 'Critical CSF result present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory, firedRules };
	}

	const moderate =
		r.viralPattern ||
		r.lowGlucose ||
		(r.pleocytosis && r.raisedProtein) ||
		r.xanthochromia === 'positive';

	if (moderate) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-pattern',
			description:
				'An actionable abnormal CSF pattern (viral pattern, low glucose, combined pleocytosis with raised protein, or positive xanthochromia) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
	}

	const minor =
		r.raisedProtein ||
		r.pleocytosis ||
		r.oligoclonalBands === 'positive';

	if (minor) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'isolated-abnormality',
			description: 'An isolated single CSF abnormality is present; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive analysis; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal CSF finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: reportingCategory || 'normal', firedRules };
}
