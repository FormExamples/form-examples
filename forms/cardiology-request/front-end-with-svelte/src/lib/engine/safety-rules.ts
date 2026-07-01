import type { CardiologyRequest, SafetyBand, FiredRule } from './types';
import { hasRedFlag, hasTypicalAngina } from './utils';

/**
 * Axis B — safety / red-flag.
 *
 * Escalation ladder (ok → caution → red-flag):
 * - red-flag: any acute red flag (suspected acute coronary syndrome, exertional
 *   syncope, new-onset heart failure), an elevated troponin, or typical-angina
 *   chest pain. These drive the safety axis and auto-escalate the triage tier.
 * - caution: softer acuity signals (elevated BNP, NYHA III–IV breathlessness,
 *   syncope, palpitations with no red flag).
 * - ok: no safety signal.
 *
 * The least-alarming band is chosen only when no rule fires.
 */
export function gradeSafety(r: CardiologyRequest): {
	safetyBand: SafetyBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	// ─── red-flag ───
	if (r.suspectedAcs) {
		firedRules.push({
			ruleId: 'R-SAFETY-ACS-01',
			axis: 'safety',
			category: 'suspected-acs',
			description:
				'Suspected acute coronary syndrome; emergency pathway warranted, not a routine cardiology referral.'
		});
	}
	if (r.exertionalSyncope) {
		firedRules.push({
			ruleId: 'R-SAFETY-EXERTIONAL-SYNCOPE-01',
			axis: 'safety',
			category: 'exertional-syncope',
			description:
				'Exertional syncope; possible structural or arrhythmic cause requiring urgent assessment.'
		});
	}
	if (r.newOnsetHeartFailure) {
		firedRules.push({
			ruleId: 'R-SAFETY-NEW-HF-01',
			axis: 'safety',
			category: 'new-onset-heart-failure',
			description: 'New-onset heart failure; warrants urgent assessment per NICE NG106.'
		});
	}
	if (r.troponinStatus === 'elevated') {
		firedRules.push({
			ruleId: 'R-SAFETY-TROPONIN-01',
			axis: 'safety',
			category: 'elevated-troponin',
			description: 'Elevated troponin recorded; treat as an acute coronary presentation.'
		});
	}
	if (hasTypicalAngina(r)) {
		firedRules.push({
			ruleId: 'R-SAFETY-TYPICAL-ANGINA-01',
			axis: 'safety',
			category: 'red-flag-chest-pain',
			description: 'Typical-angina chest pain; vet for urgent rather than routine review.'
		});
	}

	if (hasRedFlag(r) || r.troponinStatus === 'elevated' || hasTypicalAngina(r)) {
		return { safetyBand: 'red-flag', firedRules };
	}

	// ─── caution ───
	const cautionSignals =
		r.bnpStatus === 'elevated' ||
		r.nyhaClass === 'iii' ||
		r.nyhaClass === 'iv' ||
		r.symptomSyncope ||
		r.symptomPalpitations;

	if (cautionSignals) {
		firedRules.push({
			ruleId: 'R-SAFETY-CAUTION-01',
			axis: 'safety',
			category: 'acuity-signal',
			description:
				'Softer acuity signal present (elevated BNP, NYHA III–IV, syncope, or palpitations); manage with caution.'
		});
		return { safetyBand: 'caution', firedRules };
	}

	// ─── ok: least-alarming band, no rule fired ───
	firedRules.push({
		ruleId: 'R-SAFETY-OK-01',
		axis: 'safety',
		category: 'no-red-flag',
		description: 'No red flag or acuity signal; safety band OK.'
	});
	return { safetyBand: 'ok', firedRules };
}
