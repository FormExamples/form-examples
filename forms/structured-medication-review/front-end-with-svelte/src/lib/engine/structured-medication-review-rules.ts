import type {
	AnticholinergicBand,
	BurdenBand,
	Medicine,
	MedicineFlag,
	PolypharmacyBand,
	ReviewData
} from './types';

/**
 * Declarative SMR scoring rules and banding functions (pure functions).
 *
 * The Structured Medication Review is a documentation form with PARTIAL
 * SCORING: rather than one numeric score, the engine derives a review status,
 * an anticholinergic burden sum + band, a polypharmacy band, a composite burden
 * band, and per-medicine STOPP/START flags. The banding boundaries below
 * implement spec §4.
 *
 * Boundaries (spec §4):
 *   polypharmacyBand    = regular >= 10 ? 'hyperpolypharmacy'
 *                       : regular >= 5  ? 'polypharmacy' : 'none'
 *   anticholinergicBand = acbScore >= 3 ? 'significant' : 'low'
 *   burdenBand          = (regular >= 10 || acbScore >= 3) ? 'high'
 *                       : (regular >= 5)                   ? 'moderate' : 'low'
 */

/** Polypharmacy boundary thresholds (regular-medicine count). */
export const POLYPHARMACY_THRESHOLD = 5;
export const HYPERPOLYPHARMACY_THRESHOLD = 10;

/** Anticholinergic burden significance threshold (ACB sum). */
export const ACB_SIGNIFICANT_THRESHOLD = 3;

/** Band the regular-medicine count into a polypharmacy band. */
export function polypharmacyBandFor(regularCount: number): PolypharmacyBand {
	if (regularCount >= HYPERPOLYPHARMACY_THRESHOLD) return 'hyperpolypharmacy';
	if (regularCount >= POLYPHARMACY_THRESHOLD) return 'polypharmacy';
	return 'none';
}

/** Band the anticholinergic burden sum. Significant at 3 or more. */
export function anticholinergicBandFor(acbScore: number): AnticholinergicBand {
	return acbScore >= ACB_SIGNIFICANT_THRESHOLD ? 'significant' : 'low';
}

/**
 * Composite burden band — the worse of the polypharmacy and anticholinergic
 * bands (max-band algorithm).
 */
export function burdenBandFor(regularCount: number, acbScore: number): BurdenBand {
	if (regularCount >= HYPERPOLYPHARMACY_THRESHOLD || acbScore >= ACB_SIGNIFICANT_THRESHOLD) {
		return 'high';
	}
	if (regularCount >= POLYPHARMACY_THRESHOLD) return 'moderate';
	return 'low';
}

/**
 * Sum the per-medicine anticholinergic burden points. A null / missing value
 * contributes 0.
 */
export function sumAnticholinergicBurden(medicines: Medicine[]): number {
	let total = 0;
	for (const m of medicines) {
		const p = m.anticholinergicBurdenPoints;
		if (typeof p === 'number' && !Number.isNaN(p)) {
			total += p;
		}
	}
	return total;
}

/** Collect one flag per medicine carrying a non-empty STOPP / START criterion. */
export function collectCriterionFlags(
	medicines: Medicine[],
	key: 'stoppCriterion' | 'startCriterion'
): MedicineFlag[] {
	const flags: MedicineFlag[] = [];
	medicines.forEach((m, idx) => {
		const criterion = (m[key] || '').trim();
		if (criterion !== '') {
			flags.push({ drugName: m.drugName || `Medicine ${idx + 1}`, criterion });
		}
	});
	return flags;
}

/**
 * Determine whether the required sections are complete (spec §4). The review is
 * `complete` only when: the problems section is filled; every medicine has a
 * non-empty indication and an adherence other than unknown; the monitoring
 * section is reviewed; whatMattersToPatient and sharedDecisions are recorded;
 * and reviewCompleted == 'yes'.
 */
export function requiredSectionsComplete(data: ReviewData): boolean {
	const problemsFilled = (data.problems.presentingProblems || '').trim() !== '';
	const medicines = data.medicines || [];
	const everyMedicineDocumented =
		medicines.length > 0 &&
		medicines.every(
			(m) => (m.indication || '').trim() !== '' && m.adherence !== '' && m.adherence !== 'unknown'
		);
	const monitoringReviewed = (data.monitoring.monitoringDue || '').trim() !== '';
	const whatMattersRecorded = (data.problems.whatMattersToPatient || '').trim() !== '';
	const sharedDecisionsRecorded = (data.goals.sharedDecisions || '').trim() !== '';
	const reviewMarkedDone = data.plan.reviewCompleted === 'yes';

	return (
		problemsFilled &&
		everyMedicineDocumented &&
		monitoringReviewed &&
		whatMattersRecorded &&
		sharedDecisionsRecorded &&
		reviewMarkedDone
	);
}
