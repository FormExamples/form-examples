import type { CytologyRequest, PreanalyticalBand, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis B — Pre-analytical specimen adequacy (RCPath cytopathology)
//
// Based on whether the specimen has been collected, the time elapsed since
// collection (degradation risk), and timing. Three bands: ok, caution,
// reject-risk. Rule IDs are stable across every front-end and the back-end.
// ──────────────────────────────────────────────

/** Beyond this elapsed time the specimen is treated as reject-risk. */
export const STALE_HOURS = 48;
/** Beyond this elapsed time the specimen is treated as caution. */
export const CAUTION_HOURS = 24;

/** Hours elapsed between a collection ISO date-time and now; null if unknown. */
export function hoursSinceCollection(collectionDatetime: string): number | null {
	if (!collectionDatetime) return null;
	const t = Date.parse(collectionDatetime);
	if (Number.isNaN(t)) return null;
	return (Date.now() - t) / (1000 * 60 * 60);
}

/** Evaluate pre-analytical specimen adequacy. */
export function evaluatePreanalytical(data: CytologyRequest): {
	band: PreanalyticalBand;
	firedRule: FiredRule | null;
} {
	const collected = data.collection.specimenCollected;

	if (collected !== 'yes') {
		// Specimen not yet collected: no degradation risk, but flagged elsewhere.
		return {
			band: 'ok',
			firedRule: {
				ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
				axis: 'preanalytical',
				category: 'collection',
				description:
					'Specimen not yet collected — pre-analytical adequacy assessed at collection.'
			}
		};
	}

	const elapsed = hoursSinceCollection(data.collection.collectionDatetime);

	if (elapsed === null) {
		return {
			band: 'caution',
			firedRule: {
				ruleId: 'R-PREANALYTICAL-NO-TIMING',
				axis: 'preanalytical',
				category: 'timing',
				description:
					'Specimen collected but collection date-time is missing — confirm timing and fixation.'
			}
		};
	}

	if (elapsed > STALE_HOURS) {
		return {
			band: 'reject-risk',
			firedRule: {
				ruleId: 'R-PREANALYTICAL-STALE',
				axis: 'preanalytical',
				category: 'timing',
				description: `Specimen collected more than ${STALE_HOURS}h ago — degradation risk; confirm fixation or recollect.`
			}
		};
	}

	if (elapsed > CAUTION_HOURS) {
		return {
			band: 'caution',
			firedRule: {
				ruleId: 'R-PREANALYTICAL-AGEING',
				axis: 'preanalytical',
				category: 'timing',
				description: `Specimen collected more than ${CAUTION_HOURS}h ago — process promptly; confirm fixation.`
			}
		};
	}

	return {
		band: 'ok',
		firedRule: {
			ruleId: 'R-PREANALYTICAL-FRESH',
			axis: 'preanalytical',
			category: 'timing',
			description: 'Specimen collected recently and within acceptable pre-analytical window.'
		}
	};
}
