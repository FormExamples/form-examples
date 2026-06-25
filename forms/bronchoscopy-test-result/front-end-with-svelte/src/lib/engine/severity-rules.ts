import type {
	BronchoscopyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in BTS
 * actionable-reporting principles and structured endobronchial-findings /
 * lung-cancer-pathway categories:
 * - major: a critical finding (suspected tumour, massive haemoptysis,
 *   pneumothorax), or extrinsic central-airway compression.
 * - moderate: an actionable abnormal finding (mucosal abnormality, foreign
 *   body).
 * - minor: purulent-secretions-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: BronchoscopyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		const category = r.endobronchialLesion ? 'suspected-malignancy' : 'critical-actionable';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (r.extrinsicCompression) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'extrinsic-compression',
			description: 'Extrinsic central-airway compression present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'central-airway-compromise', firedRules };
	}

	const actionable = r.mucosalAbnormality || r.foreignBody;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (mucosal abnormality or foreign body) is present; severity graded moderate.'
		});
		const category = r.foreignBody ? 'foreign-body' : 'mucosal-abnormality';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'incidental-finding',
			description: 'Purulent secretions only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'purulent-secretions', firedRules };
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
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
