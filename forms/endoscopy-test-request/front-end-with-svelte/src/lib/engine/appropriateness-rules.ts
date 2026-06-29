import type {
	EndoscopyRequest,
	AppropriatenessBand,
	FiredRule,
	PrimaryIndication,
	RequestedProcedure
} from './types';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (ACR / ASGE-AUC / EPAGE 1-9 ordinal)
// ----------------------------------------------------------------------
//
// Each indication has an ideal procedure (or set) and a set of
// plausible-but-suboptimal procedures. A good match scores 7-9
// (usually-appropriate); a plausible match scores 4-6 (may-be-appropriate);
// a clear mismatch scores 1-3 (usually-not-appropriate). Rule IDs are stable
// and identical across every front-end and the back-end (R-APPROP-*).

interface ProcedureMap {
	ideal: RequestedProcedure[];
	plausible: RequestedProcedure[];
}

const INDICATION_PROCEDURE_MAP: Record<string, ProcedureMap> = {
	dyspepsia: { ideal: ['ogd', 'gastroscopy'], plausible: [] },
	gord: { ideal: ['ogd', 'gastroscopy'], plausible: [] },
	dysphagia: { ideal: ['ogd', 'gastroscopy'], plausible: ['eus'] },
	'upper-gi-bleeding': { ideal: ['ogd', 'gastroscopy'], plausible: ['capsule'] },
	'iron-deficiency-anaemia': { ideal: ['ogd', 'gastroscopy', 'colonoscopy'], plausible: ['capsule'] },
	'weight-loss': { ideal: ['ogd', 'gastroscopy', 'colonoscopy'], plausible: ['eus'] },
	'suspected-malignancy': {
		ideal: ['ogd', 'gastroscopy', 'colonoscopy', 'eus'],
		plausible: ['flexible-sigmoidoscopy']
	},
	'barretts-surveillance': { ideal: ['ogd', 'gastroscopy'], plausible: [] },
	'h-pylori': { ideal: ['ogd', 'gastroscopy'], plausible: [] },
	'rectal-bleeding': { ideal: ['colonoscopy', 'flexible-sigmoidoscopy'], plausible: [] },
	'change-in-bowel-habit': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'positive-fit': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'ibd-surveillance': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'polyp-surveillance': { ideal: ['colonoscopy'], plausible: ['flexible-sigmoidoscopy'] },
	'abnormal-imaging': {
		ideal: ['colonoscopy', 'ogd', 'gastroscopy', 'ercp', 'eus'],
		plausible: ['flexible-sigmoidoscopy', 'capsule']
	},
	other: { ideal: [], plausible: [] }
};

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBandForScore(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Axis A — appropriateness.
 *
 * Score appropriateness (1-9) for an indication × procedure pairing and return
 * the band plus the fired rule. Defaults to a neutral may-be-appropriate when
 * the indication or procedure has not yet been chosen.
 */
export function gradeAppropriateness(r: EndoscopyRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication = r.request.primaryIndication;
	const procedure = r.request.requestedProcedure;

	if (!indication || !procedure) {
		return {
			appropriatenessScore: 5,
			appropriatenessBand: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description:
						'Indication or procedure not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map: ProcedureMap = INDICATION_PROCEDURE_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = (indication as string).toUpperCase().replace(/[^A-Z0-9]+/g, '-');

	if (map.ideal.includes(procedure)) {
		return {
			appropriatenessScore: 8,
			appropriatenessBand: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${procedure} procedure is the recommended examination for "${indication}".`
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
					description: `Requested ${procedure} procedure may be appropriate for "${indication}" but is not the first-line examination.`
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
					description:
						'Indication recorded as "other"; appropriateness requires clinician vetting.'
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
				description: `Requested ${procedure} procedure is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}

export { INDICATION_PROCEDURE_MAP };
export type { PrimaryIndication };
