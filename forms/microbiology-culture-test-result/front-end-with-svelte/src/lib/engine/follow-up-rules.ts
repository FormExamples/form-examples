import type {
	MicrobiologyCultureResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	FiredRule
} from './types';
import { hasCriticalOrganism, hasResistanceMarker } from './utils';

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical organism / result auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant — RCPath critical-result communication). The
 * least-urgent band is chosen only when no rule fires.
 */
export function gradeFollowUp(
	r: MicrobiologyCultureResult,
	classification: ResultClassification,
	severity: AbnormalitySeverity
): {
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	recommendedAction: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	// ─── critical-alert: auto-escalation invariant ───
	if (hasCriticalOrganism(r) || classification === 'critical') {
		firedRules.push({
			ruleId: 'R-FU-CRITICAL-01',
			axis: 'follow-up',
			category: 'critical-result',
			description:
				'Critical organism / result auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
		});
		return {
			followUpUrgency: 'critical-alert',
			targetTimeframe: 'immediate',
			recommendedAction:
				'Telephone the critical result to the requesting / infection team now and document the conversation.',
			firedRules
		};
	}

	// ─── urgent ───
	if (severity === 'major') {
		firedRules.push({
			ruleId: 'R-FU-URGENT-01',
			axis: 'follow-up',
			category: 'major-abnormality',
			description: 'Major abnormality present; follow-up urgency graded urgent.'
		});
		return {
			followUpUrgency: 'urgent',
			targetTimeframe: 'within 24 hours',
			recommendedAction:
				'Arrange urgent clinical / infection review and expedite antimicrobial advice.',
			firedRules
		};
	}

	// ─── recommended ───
	if (severity === 'moderate') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-01',
			axis: 'follow-up',
			category: 'moderate-abnormality',
			description: 'Moderate abnormality present; follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 48 hours',
			recommendedAction:
				'Recommend targeted antimicrobial therapy and clinical review as indicated.',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-02',
			axis: 'follow-up',
			category: 'inconclusive',
			description: 'Inconclusive result; repeat specimen recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'within 48 hours',
			recommendedAction:
				'Recommend a repeat / fresh specimen to resolve the inconclusive result.',
			firedRules
		};
	}

	if (hasResistanceMarker(r)) {
		firedRules.push({
			ruleId: 'R-FU-RECOMMENDED-03',
			axis: 'follow-up',
			category: 'resistance-marker',
			description:
				'A resistance marker is present; infection-prevention follow-up recommended.'
		});
		return {
			followUpUrgency: 'recommended',
			targetTimeframe: 'per local IPC policy',
			recommendedAction:
				'Manage per local infection-prevention-and-control (IPC) policy for the resistance marker.',
			firedRules
		};
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-FU-ROUTINE-01',
		axis: 'follow-up',
		category: 'normal',
		description: 'No escalation rule fired; routine follow-up only.'
	});
	return {
		followUpUrgency: 'routine',
		targetTimeframe: 'no specific follow-up',
		recommendedAction: 'No specific microbiology follow-up required; manage per usual care.',
		firedRules
	};
}
