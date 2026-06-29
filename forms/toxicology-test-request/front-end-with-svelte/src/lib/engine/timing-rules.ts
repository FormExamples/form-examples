import type { ToxicologyRequest, TimingBand, FiredRule } from './types';

/**
 * Axis B — ingestion-timing validity (paracetamol nomogram ≥ 4 h).
 *
 * - ok      — assay can be interpreted at the stated ingestion time.
 * - caution — borderline or serial sampling advisable (very early or staggered
 *   ingestion, or a paracetamol level with an unknown ingestion time).
 * - invalid — cannot be interpreted, e.g. a paracetamol level taken < 4 h
 *   post-ingestion (the UK nomogram starts at 4 h / 100 mg/L).
 */
export const PARACETAMOL_NOMOGRAM_HOURS = 4;
const TIMING_CAUTION_HOURS = 2;

/** Evaluate ingestion-timing validity for the requested assays. */
export function evaluateTiming(r: ToxicologyRequest): {
	band: TimingBand;
	firedRules: FiredRule[];
} {
	const wantsParacetamol = r.assays.paracetamolLevel === true;
	const hours = r.clinical.timeSinceIngestionHours;
	const hasHours = hours !== null && hours !== undefined;

	// Paracetamol level requested with a known sub-4h ingestion time is invalid
	// for nomogram interpretation — the strongest timing signal.
	if (wantsParacetamol && hasHours && Number(hours) < PARACETAMOL_NOMOGRAM_HOURS) {
		return {
			band: 'invalid',
			firedRules: [
				{
					ruleId: 'R-TIMING-PARACETAMOL-INVALID',
					axis: 'timing',
					category: 'paracetamol-nomogram',
					description: `Paracetamol level requested at ${Number(hours)} h post-ingestion; the treatment nomogram is not interpretable before ${PARACETAMOL_NOMOGRAM_HOURS} h. Repeat at >= ${PARACETAMOL_NOMOGRAM_HOURS} h.`
				}
			]
		};
	}

	// Very early ingestion (any time-critical assay) — advise serial / repeat.
	if (hasHours && Number(hours) >= 0 && Number(hours) < TIMING_CAUTION_HOURS) {
		return {
			band: 'caution',
			firedRules: [
				{
					ruleId: 'R-TIMING-EARLY',
					axis: 'timing',
					category: 'early-sampling',
					description: `Ingestion only ${Number(hours)} h ago — early levels may be unreliable; consider serial sampling.`
				}
			]
		};
	}

	// Paracetamol requested but ingestion time unknown — cannot validate timing.
	if (wantsParacetamol && !hasHours) {
		return {
			band: 'caution',
			firedRules: [
				{
					ruleId: 'R-TIMING-PARACETAMOL-UNKNOWN',
					axis: 'timing',
					category: 'paracetamol-nomogram',
					description:
						'Paracetamol level requested but time since ingestion is unknown; confirm timing for nomogram interpretation.'
				}
			]
		};
	}

	return {
		band: 'ok',
		firedRules: [
			{
				ruleId: 'R-TIMING-OK',
				axis: 'timing',
				category: 'timing',
				description: 'Ingestion timing is compatible with interpretation of the requested assays.'
			}
		]
	};
}
