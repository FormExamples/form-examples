import type { PetScanRequest, AppropriatenessBand, FiredRule, Indication, ScanType } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (ACR Appropriateness Criteria / RCR iRefer 1-9)
// ──────────────────────────────────────────────
//
// Each indication has an ideal tracer / scan type (or set of types). When the
// requested scan type matches the indication well, the request scores high
// (7-9, usually-appropriate). Plausible-but-suboptimal pairings score in the
// 4-6 may-be-appropriate band; clearly mismatched pairings score 1-3.

/** Map of indication -> { ideal:[scanType], plausible:[scanType] }. */
export const INDICATION_SCAN_MAP: Record<string, { ideal: ScanType[]; plausible: ScanType[] }> = {
	'cancer-staging': { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
	'cancer-restaging': { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
	'treatment-response': { ideal: ['fdg-pet-ct'], plausible: ['psma-pet', 'dotatate-pet'] },
	'suspected-recurrence': { ideal: ['fdg-pet-ct', 'psma-pet', 'dotatate-pet'], plausible: [] },
	'solitary-pulmonary-nodule': { ideal: ['fdg-pet-ct'], plausible: [] },
	lymphoma: { ideal: ['fdg-pet-ct'], plausible: [] },
	'cardiac-viability': { ideal: ['cardiac-pet'], plausible: ['fdg-pet-ct'] },
	'infection-inflammation': { ideal: ['fdg-pet-ct'], plausible: [] },
	'neurology-dementia': { ideal: ['amyloid-pet'], plausible: ['fdg-pet-ct'] },
	other: { ideal: [], plausible: [] }
};

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Axis A — score appropriateness (1-9) for an indication × scanType pairing and
 * return the band plus the fired rule. Defaults to a neutral may-be-appropriate
 * when the indication or scan type has not yet been chosen. Rule IDs are stable
 * and identical across every front-end and the back-end.
 */
export function scoreAppropriateness(
	indication: Indication,
	scanType: ScanType
): { score: number; band: AppropriatenessBand; firedRules: FiredRule[] } {
	if (!indication || !scanType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: 'R-APPROP-UNSPECIFIED',
					axis: 'appropriateness',
					category: indication || 'unspecified',
					description: 'Indication or scan type not yet specified — provisional appropriateness.'
				}
			]
		};
	}

	const map = INDICATION_SCAN_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(scanType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-IDEAL`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${scanType} study is the recommended examination for "${indication}".`
				}
			]
		};
	}
	if (map.plausible.includes(scanType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRules: [
				{
					ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
					axis: 'appropriateness',
					category: indication,
					description: `Requested ${scanType} study may be appropriate for "${indication}" but is not the first-line examination.`
				}
			]
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
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
		score: 2,
		band: 'usually-not-appropriate',
		firedRules: [
			{
				ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
				axis: 'appropriateness',
				category: indication,
				description: `Requested ${scanType} study is not usually appropriate for "${indication}"; query the referrer.`
			}
		]
	};
}
