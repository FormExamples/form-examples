import type {
	NerveConductionStudyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the AANEM
 * severity descriptors (e.g. CTS mild / moderate / severe; axonal vs
 * demyelinating polyneuropathy):
 * - major: a critical finding, or a severe abnormality.
 * - moderate: an abnormal finding of moderate severity (or unspecified severity).
 * - minor: an abnormal finding of mild severity.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows; the report's own free-text category is used
 * when present.
 */
export function gradeSeverity(
	r: NerveConductionStudyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const category = deriveReportingCategory(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasAnyAbnormalFinding(r) && r.severity === 'severe') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'severe-abnormality',
			description: 'Severe electrodiagnostic abnormality present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasAnyAbnormalFinding(r) && r.severity === 'mild') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'mild-abnormality',
			description: 'Mild electrodiagnostic abnormality present; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'abnormal-finding',
			description:
				'An abnormal structured finding is present; abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
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

/**
 * Derives a short structured-reporting label. Prefers the report's own free-text
 * reporting category; otherwise summarises the predominant structured finding,
 * pattern, and severity.
 */
function deriveReportingCategory(r: NerveConductionStudyResult): string {
	if (r.reportingCategory.trim() !== '') return r.reportingCategory.trim();

	const parts: string[] = [];
	if (r.motorNeuroneDiseaseFeatures) parts.push('motor-neurone-disease');
	else if (r.carpalTunnelSyndrome) parts.push('carpal-tunnel-syndrome');
	else if (r.peripheralNeuropathy) parts.push('peripheral-neuropathy');
	else if (r.radiculopathy) parts.push('radiculopathy');
	else if (r.myopathy) parts.push('myopathy');
	else if (r.neuromuscularJunctionDisorder) parts.push('neuromuscular-junction-disorder');

	if (parts.length === 0) return 'normal';

	if (r.severity && r.severity !== 'not-applicable') parts.push(r.severity);
	if (r.pattern && r.pattern !== 'not-applicable') parts.push(r.pattern);
	return parts.join('-');
}
