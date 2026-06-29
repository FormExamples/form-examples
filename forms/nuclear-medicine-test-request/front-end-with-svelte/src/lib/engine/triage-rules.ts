import type { CardiologyRequest, SafetyBand, TriageTier, FiredRule } from './types';
import { hasRedFlag } from './utils';

/**
 * Axis D — triage priority, plus the target timeframe.
 *
 * Escalation ladder (routine → urgent → emergency). A red flag (suspected acute
 * coronary syndrome, exertional syncope, new-onset heart failure) auto-escalates
 * the tier regardless of the requested urgency (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 *
 * The referrer's requested urgency can raise but never lower the computed tier.
 */
export function gradeTriage(
	r: CardiologyRequest,
	safetyBand: SafetyBand
): {
	triageTier: TriageTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	// ─── emergency: red-flag auto-escalation invariant ───
	if (r.suspectedAcs || r.troponinStatus === 'elevated') {
		firedRules.push({
			ruleId: 'R-TRIAGE-EMERGENCY-01',
			axis: 'triage',
			category: 'suspected-acs',
			description:
				'Suspected acute coronary syndrome / elevated troponin auto-escalates triage to emergency regardless of the requested urgency.'
		});
		return { triageTier: 'emergency', targetTimeframe: 'immediate (emergency pathway)', firedRules };
	}

	// ─── urgent: other red flags and acuity ───
	if (hasRedFlag(r)) {
		firedRules.push({
			ruleId: 'R-TRIAGE-URGENT-01',
			axis: 'triage',
			category: 'red-flag',
			description:
				'A red flag (exertional syncope or new-onset heart failure) auto-escalates triage to urgent.'
		});
		return { triageTier: 'urgent', targetTimeframe: 'within 2 weeks', firedRules };
	}

	if (safetyBand === 'red-flag') {
		firedRules.push({
			ruleId: 'R-TRIAGE-URGENT-02',
			axis: 'triage',
			category: 'safety-red-flag',
			description: 'Safety axis is red-flag (e.g. typical-angina chest pain); triage urgent.'
		});
		return { triageTier: 'urgent', targetTimeframe: 'within 2 weeks', firedRules };
	}

	if (r.urgency === 'emergency') {
		firedRules.push({
			ruleId: 'R-TRIAGE-URGENT-03',
			axis: 'triage',
			category: 'requested-emergency',
			description:
				'Referrer requested an emergency review without a coded ACS red flag; triage urgent pending vetting.'
		});
		return { triageTier: 'urgent', targetTimeframe: 'within 2 weeks', firedRules };
	}

	if (safetyBand === 'caution' || r.urgency === 'urgent') {
		firedRules.push({
			ruleId: 'R-TRIAGE-URGENT-04',
			axis: 'triage',
			category: 'acuity-or-requested-urgent',
			description:
				'Acuity signal present or urgent review requested; triage urgent.'
		});
		return { triageTier: 'urgent', targetTimeframe: 'within 2 weeks', firedRules };
	}

	// ─── routine: least-urgent band, no rule fired ───
	firedRules.push({
		ruleId: 'R-TRIAGE-ROUTINE-01',
		axis: 'triage',
		category: 'routine',
		description: 'No escalation rule fired; routine triage.'
	});
	return { triageTier: 'routine', targetTimeframe: 'within 6 weeks', firedRules };
}
