import type {
	ElectrocardiogramResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasAbnormalRhythm } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in AHA/ACCF/HRS
 * standardised interpretation statements and recognised acute-ischaemia
 * categories:
 * - major: a critical finding (STEMI / VT / complete heart block / prolonged
 *   QTc), or an acute ischaemic pattern.
 * - moderate: an actionable abnormal finding (ST depression, pathological Q
 *   waves, bundle branch block) or an abnormal non-critical rhythm.
 * - minor: an isolated minor finding (T-wave inversion or LVH only).
 * - none: a normal trace.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: ElectrocardiogramResult,
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
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (r.ischaemia) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'ischaemia',
			description: 'An ischaemic pattern is present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'acute-ischaemia', firedRules };
	}

	const actionable =
		r.stDepression || r.pathologicalQWaves || r.bundleBranchBlock || hasAbnormalRhythm(r);

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (ST depression, pathological Q waves, bundle branch block, or abnormal rhythm) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'actionable-finding', firedRules };
	}

	if (r.tWaveInversion || r.leftVentricularHypertrophy) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-finding',
			description:
				'An isolated minor finding (T-wave inversion or left ventricular hypertrophy) is present; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'minor-finding', firedRules };
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
