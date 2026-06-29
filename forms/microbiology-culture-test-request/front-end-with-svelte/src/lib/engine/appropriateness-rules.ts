import type {
	AppropriatenessBand,
	FiredRule,
	PrimaryIndication,
	SpecimenType,
	TestsSection
} from './types';
import { anyTestSelected } from './utils';

// ----------------------------------------------------------------------
// Axis A — Appropriateness (UKHSA SMI specimen / indication match, 1-9)
// ----------------------------------------------------------------------
//
// Each indication has an ideal specimen type (or set of types). When the
// specimen matches the indication well, the request scores high (7-9,
// usually-appropriate). Plausible-but-suboptimal pairings score 4-6
// may-be-appropriate; clearly mismatched pairings score 1-3. If no test is
// selected the request cannot be appropriate regardless of the pairing.

/** Map of indication → { ideal, plausible } specimen types. */
export const INDICATION_SPECIMEN_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'suspected-sepsis': { ideal: ['blood-culture'], plausible: ['urine', 'csf', 'wound-swab', 'sputum'] },
	'urinary-tract-infection': { ideal: ['urine'], plausible: ['catheter-tip', 'blood-culture'] },
	'wound-infection': { ideal: ['wound-swab', 'tissue'], plausible: ['blood-culture'] },
	'respiratory-infection': { ideal: ['sputum', 'throat-swab'], plausible: ['blood-culture'] },
	gastroenteritis: { ideal: ['stool'], plausible: ['blood-culture'] },
	meningitis: { ideal: ['csf', 'blood-culture'], plausible: [] },
	'sti-screen': { ideal: ['genital-swab'], plausible: ['urine'] },
	'pyrexia-unknown-origin': { ideal: ['blood-culture'], plausible: ['urine', 'sputum', 'csf', 'wound-swab'] },
	'infection-screening': { ideal: ['wound-swab', 'urine'], plausible: ['genital-swab', 'catheter-tip', 'sputum'] },
	other: { ideal: [], plausible: [] }
};

/**
 * Axis A — score appropriateness (1-9) for an indication × specimen-type pairing
 * and return the fired rule. Defaults to a neutral may-be-appropriate when the
 * indication or specimen type has not yet been chosen. When no test is selected
 * the score is forced low regardless of the pairing.
 */
export function scoreAppropriateness(
	indication: PrimaryIndication,
	specimenType: SpecimenType,
	tests: TestsSection
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	if (!anyTestSelected(tests)) {
		return {
			score: 2,
			band: 'usually-not-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-NO-TEST',
				axis: 'appropriateness',
				category: 'no-test-selected',
				description:
					'No microbiology test selected — the request cannot be processed; query the referrer.'
			}
		};
	}

	if (!indication || !specimenType) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: indication || 'unspecified',
				description:
					'Indication or specimen type not yet specified — provisional appropriateness.'
			}
		};
	}

	const map = INDICATION_SPECIMEN_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	if (map.ideal.includes(specimenType)) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${specimenType} specimen is the recommended sample for "${indication}".`
			}
		};
	}
	if (map.plausible.includes(specimenType)) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `A ${specimenType} specimen may be appropriate for "${indication}" but is not the first-line sample.`
			}
		};
	}
	if (indication === 'other') {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-OTHER',
				axis: 'appropriateness',
				category: 'other',
				description: 'Indication recorded as "other"; appropriateness requires laboratory vetting.'
			}
		};
	}
	return {
		score: 2,
		band: 'usually-not-appropriate',
		firedRule: {
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `A ${specimenType} specimen is not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1-9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
