import type { BloodTestRequest, FiredRule, PreanalyticalBand } from './types';
import { PANELS } from './panels';

const PREANALYTICAL_ORDER: PreanalyticalBand[] = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two pre-analytical bands is more severe. */
export function worseBand(a: PreanalyticalBand, b: PreanalyticalBand): PreanalyticalBand {
	return PREANALYTICAL_ORDER.indexOf(a) >= PREANALYTICAL_ORDER.indexOf(b) ? a : b;
}

/**
 * Axis B — pre-analytical / specimen safety (ok / caution / reject-risk).
 *
 * A fasting-required test collected non-fasting (or with unknown fasting
 * status) forces a fasting violation and lowers the band. A specimen recorded
 * as collected without a collection date/time, or known difficult access, adds
 * caution. The most-severe band wins; `ok` only when nothing fires.
 */
export function scorePreanalytical(data: BloodTestRequest): {
	band: PreanalyticalBand;
	fastingViolation: boolean;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let band: PreanalyticalBand = 'ok';
	let fastingViolation = false;

	const pre = data.preanalytical;
	const panels = data.panels;

	// Does any selected panel benefit from fasting, or was fasting flagged?
	const fastingPanel = PANELS.some((p) => p.fasting && panels[p.field]);
	const fastingNeeded = pre.fastingRequired || fastingPanel;

	if (fastingNeeded) {
		if (pre.fastingStatus === 'non-fasting') {
			fastingViolation = true;
			band = worseBand(band, 'reject-risk');
			firedRules.push({
				ruleId: 'R-PREANALYTICAL-FASTING-NOT-MET',
				axis: 'preanalytical',
				category: 'fasting',
				description: 'A fasting-required test was collected non-fasting — fasting violation.'
			});
		} else if (pre.fastingStatus === '' || pre.fastingStatus === 'unknown') {
			fastingViolation = true;
			band = worseBand(band, 'caution');
			firedRules.push({
				ruleId: 'R-PREANALYTICAL-FASTING-UNKNOWN',
				axis: 'preanalytical',
				category: 'fasting',
				description: 'A fasting-required test was ordered but fasting status is unknown.'
			});
		}
	}

	// Specimen recorded collected but with no collection timestamp.
	if (pre.specimenCollected === 'yes' && !pre.collectionDate) {
		band = worseBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-NO-COLLECTION-TIME',
			axis: 'preanalytical',
			category: 'specimen',
			description: 'Specimen marked collected but no collection date/time recorded.'
		});
	}

	// Difficult venous access flagged — pre-analytical caution.
	if (data.safety.difficultVenousAccess) {
		band = worseBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-DIFFICULT-ACCESS',
			axis: 'preanalytical',
			category: 'specimen',
			description: 'Difficult venous access — risk of a haemolysed or short sample.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-OK',
			axis: 'preanalytical',
			category: 'specimen',
			description: 'No pre-analytical / specimen-safety concerns detected.'
		});
	}

	return { band, fastingViolation, firedRules };
}
