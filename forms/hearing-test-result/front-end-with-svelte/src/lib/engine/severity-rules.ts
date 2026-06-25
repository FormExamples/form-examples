import type {
	HearingResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, worstPureToneAverage } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the British
 * Society of Audiology audiometric descriptors derived from the pure-tone
 * average (PTA, dB HL):
 * - major: a critical finding, or a severe/profound loss (worst PTA >= 71).
 * - moderate: a moderate / moderately-severe loss (worst PTA 41–70) or an
 *   actionable structured finding (hearing loss present, conductive component).
 * - minor: a mild loss (worst PTA 21–40).
 * - none: normal hearing (worst PTA <= 20 or no abnormal finding).
 *
 * The `reportingCategory` is a short BSA audiometric descriptor suitable for
 * downstream structured-reporting workflows.
 */
export function gradeSeverity(
	r: HearingResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const pta = worstPureToneAverage(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (pta !== null && pta >= 71) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'severe-profound-loss',
			description:
				'Worst pure-tone average is 71 dB HL or greater (severe/profound); abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'severe-profound', firedRules };
	}

	if (pta !== null && pta >= 41) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'moderate-loss',
			description:
				'Worst pure-tone average is 41–70 dB HL (moderate / moderately-severe); severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'moderate-loss', firedRules };
	}

	const actionable = r.hearingLossPresent || r.conductiveComponent;
	if (actionable && (pta === null || pta >= 21)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (hearing loss present or conductive component) is present; severity graded moderate.'
		});
		const category = r.conductiveComponent ? 'conductive-component' : 'actionable-finding';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (pta !== null && pta >= 21) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'mild-loss',
			description: 'Worst pure-tone average is 21–40 dB HL (mild); abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'mild-loss', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive test; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'abnormal-finding',
			description: 'An abnormal structured finding is present; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
