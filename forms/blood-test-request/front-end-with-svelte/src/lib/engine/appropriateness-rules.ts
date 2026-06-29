import type { AppropriatenessBand, FiredRule, PanelsSection, PrimaryIndication } from './types';
import { countSelectedPanels, selectedPanels, INDICATION_PANEL_MAP } from './panels';

/**
 * Axis A — appropriateness (1–9 ordinal) + band.
 *
 * Anchored on RCPath National Minimum Retesting Intervals appropriateness and
 * indication match. When the requested panels match the indication well the
 * request scores high (7–9, usually-appropriate); plausible-but-broad ordering
 * scores 4–6 (may-be-appropriate); a clear mismatch or no indication scores
 * 1–3 (usually-not-appropriate). A request with no panels selected cannot be
 * appropriate and is forced to the bottom band. Rule IDs are stable and
 * identical across every front-end and the back-end.
 */
export function scoreAppropriateness(
	indication: PrimaryIndication,
	panels: PanelsSection
): { score: number; band: AppropriatenessBand; firedRule: FiredRule | null } {
	const selectedCount = countSelectedPanels(panels);

	if (selectedCount === 0) {
		return {
			score: 1,
			band: 'usually-not-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-NO-TEST',
				axis: 'appropriateness',
				category: 'no-test-selected',
				description: 'No test panel selected — the request cannot be actioned.'
			}
		};
	}

	if (!indication) {
		return {
			score: 4,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: 'R-APPROP-UNSPECIFIED',
				axis: 'appropriateness',
				category: 'unspecified',
				description: 'Primary indication not yet specified — provisional appropriateness.'
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
				description: 'Indication recorded as "other"; appropriateness requires clinician vetting.'
			}
		};
	}

	const map = INDICATION_PANEL_MAP[indication] ?? { ideal: [], plausible: [] };
	const indicationKey = indication.toUpperCase().replace(/[^A-Z]+/g, '-');
	const selected = selectedPanels(panels).map((p) => p.field);

	const matchesIdeal = map.ideal.some((f) => selected.includes(f));
	const matchesPlausible = map.plausible.some((f) => selected.includes(f));

	if (matchesIdeal) {
		return {
			score: 8,
			band: 'usually-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-IDEAL`,
				axis: 'appropriateness',
				category: indication,
				description: `Selected panels include the recommended tests for "${indication}".`
			}
		};
	}
	if (matchesPlausible) {
		return {
			score: 5,
			band: 'may-be-appropriate',
			firedRule: {
				ruleId: `R-APPROP-${indicationKey}-PLAUSIBLE`,
				axis: 'appropriateness',
				category: indication,
				description: `Selected panels may be appropriate for "${indication}" but are not the first-line tests.`
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
			description: `Selected panels are not usually appropriate for "${indication}"; query the referrer.`
		}
	};
}

/** Map a 1–9 appropriateness score to its band. */
export function appropriatenessBand(score: number): AppropriatenessBand {
	if (score >= 7) return 'usually-appropriate';
	if (score >= 4) return 'may-be-appropriate';
	return 'usually-not-appropriate';
}
