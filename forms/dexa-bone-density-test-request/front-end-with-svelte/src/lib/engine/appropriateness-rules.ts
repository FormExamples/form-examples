import type { DexaRequest, AppropriatenessBand, Indication, ScanRegion, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis A — Appropriateness (NICE CG146 / NOGG / FRAX, 1–9 ordinal)
//
// Each indication has an ideal scan region (or set of regions). DEXA of the hip
// and/or spine is the standard diagnostic site, so most osteoporosis indications
// score high (7–9) with a hip-and-spine or hip request. Forearm and whole-body
// are plausible-but-suboptimal for most diagnostic indications and score in the
// 4–6 may-be-appropriate band. A FRAX 10-year major-fracture probability near or
// above the NOGG intervention threshold raises appropriateness; a clearly low
// FRAX with no other indication can lower it. Rule IDs are stable and identical
// across every front-end and the back-end.
// ──────────────────────────────────────────────

/** Map of indication → { ideal, plausible } scan regions. */
const INDICATION_REGION_MAP: Record<string, { ideal: string[]; plausible: string[] }> = {
	'osteoporosis-screening': { ideal: ['hip-and-spine', 'hip'], plausible: ['spine', 'forearm'] },
	'fragility-fracture': { ideal: ['hip-and-spine', 'hip', 'spine'], plausible: ['forearm'] },
	'long-term-steroids': { ideal: ['hip-and-spine', 'spine'], plausible: ['hip', 'forearm'] },
	'early-menopause': { ideal: ['hip-and-spine', 'hip'], plausible: ['spine'] },
	'high-frax-risk': { ideal: ['hip-and-spine', 'hip'], plausible: ['spine', 'forearm'] },
	'monitoring-treatment': { ideal: ['hip-and-spine', 'spine'], plausible: ['hip'] },
	'secondary-osteoporosis': { ideal: ['hip-and-spine', 'forearm'], plausible: ['hip', 'spine'] },
	other: { ideal: [], plausible: [] }
};

// NOGG / FRAX 10-year major osteoporotic fracture intervention guide.
export const FRAX_INTERVENTION_THRESHOLD = 20;
export const FRAX_HIGH_THRESHOLD = 30;

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}

/**
 * Axis A — score appropriateness (1–9) for an indication × scanRegion pairing,
 * then nudge by the FRAX major-fracture probability. Defaults to a neutral
 * may-be-appropriate when the indication or region has not yet been chosen.
 */
export function gradeAppropriateness(r: DexaRequest): {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	firedRules: FiredRule[];
} {
	const indication: Indication = r.request.primaryIndication;
	const scanRegion: ScanRegion = r.request.scanRegion;
	const fraxPercent = r.riskFactors.fraxMajorFracturePercent;
	const firedRules: FiredRule[] = [];

	if (!indication || !scanRegion) {
		firedRules.push({
			ruleId: 'R-APPROP-UNSPECIFIED',
			axis: 'appropriateness',
			category: indication || 'unspecified',
			description: 'Indication or scan region not yet specified — provisional appropriateness.'
		});
		return { appropriatenessScore: 5, appropriatenessBand: 'may-be-appropriate', firedRules };
	}

	const map = INDICATION_REGION_MAP[indication] || { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');

	let score: number;

	if (map.ideal.includes(scanRegion)) {
		score = 8;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-IDEAL`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${scanRegion} DEXA is the recommended site for "${indication}".`
		});
	} else if (map.plausible.includes(scanRegion)) {
		score = 5;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${scanRegion} DEXA may be appropriate for "${indication}" but is not the first-line site.`
		});
	} else if (indication === 'other') {
		score = 5;
		firedRules.push({
			ruleId: 'R-APPROP-OTHER',
			axis: 'appropriateness',
			category: 'other',
			description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
		});
	} else {
		score = 2;
		firedRules.push({
			ruleId: `R-APPROP-${indicationKey}-MISMATCH`,
			axis: 'appropriateness',
			category: indication,
			description: `Requested ${scanRegion} DEXA is not usually the appropriate site for "${indication}"; query the referrer.`
		});
	}

	// FRAX adjustment (NOGG / FRAX intervention thresholds).
	if (fraxPercent !== null && fraxPercent !== undefined) {
		const frax = Number(fraxPercent);
		if (!Number.isNaN(frax)) {
			if (frax >= FRAX_INTERVENTION_THRESHOLD) {
				score = Math.min(9, score + 1);
				firedRules.push({
					ruleId: 'R-APPROP-FRAX-ABOVE-THRESHOLD',
					axis: 'appropriateness',
					category: 'frax',
					description: `FRAX major-fracture probability (${frax}%) is at or above the NOGG intervention threshold; DEXA strongly supported.`
				});
			} else if (frax < 5 && indication === 'osteoporosis-screening') {
				score = Math.max(1, score - 2);
				firedRules.push({
					ruleId: 'R-APPROP-FRAX-LOW',
					axis: 'appropriateness',
					category: 'frax',
					description: `Low FRAX major-fracture probability (${frax}%) for a screening request; reassess whether DEXA is required now.`
				});
			}
		}
	}

	return { appropriatenessScore: score, appropriatenessBand: appropriatenessBand(score), firedRules };
}
