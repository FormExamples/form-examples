import type { BronchoscopyRequest, AppropriatenessBand, FiredRule, Procedure } from './types';

/**
 * Axis A — appropriateness (BTS flexible bronchoscopy + indication match, 1–9).
 *
 * Each indication has an ideal procedure (or set of procedures). When the
 * requested procedure matches the indication well the request scores high
 * (7–9, usually-appropriate). Plausible-but-suboptimal pairings score in the
 * 4–6 may-be-appropriate band; clearly mismatched pairings score 1–3.
 */
const INDICATION_PROCEDURE_MAP: Record<string, { ideal: Procedure[]; plausible: Procedure[] }> = {
	'suspected-lung-cancer': {
		ideal: ['flexible-bronchoscopy', 'ebus'],
		plausible: ['rigid-bronchoscopy']
	},
	'lung-mass-on-imaging': {
		ideal: ['flexible-bronchoscopy', 'ebus'],
		plausible: ['rigid-bronchoscopy', 'bronchoalveolar-lavage']
	},
	'mediastinal-lymphadenopathy': { ideal: ['ebus'], plausible: ['flexible-bronchoscopy'] },
	haemoptysis: { ideal: ['flexible-bronchoscopy'], plausible: ['rigid-bronchoscopy', 'ebus'] },
	'persistent-cough': { ideal: ['flexible-bronchoscopy'], plausible: ['bronchoalveolar-lavage'] },
	'infection-sampling': {
		ideal: ['bronchoalveolar-lavage', 'flexible-bronchoscopy'],
		plausible: ['ebus']
	},
	'foreign-body': { ideal: ['rigid-bronchoscopy'], plausible: ['flexible-bronchoscopy'] },
	stridor: { ideal: ['flexible-bronchoscopy', 'rigid-bronchoscopy'], plausible: ['ebus'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Score appropriateness (1–9) for an indication × procedure pairing and return
 * the band plus the audit-trail rule that fired. Defaults to a neutral
 * may-be-appropriate when the indication or procedure has not yet been chosen.
 *
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function gradeAppropriateness(r: BronchoscopyRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.request.primaryIndication;
	const procedure = r.request.procedure;

	if (!indication || !procedure) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description: 'Indication or procedure not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_PROCEDURE_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = (indication as string).toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(procedure)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${procedure} is the recommended procedure for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(procedure)) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${procedure} may be appropriate for "${indication}" but is not the first-line procedure.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-OTHER',
					axis: 'appropriateness',
					category: 'other',
					description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
				}
			]
		};
	}
	return {
		appropriatenessScore: 2,
		appropriatenessBand: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${procedure} is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}

export { INDICATION_PROCEDURE_MAP };
