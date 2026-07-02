import type { FiredRule, GradingResult, ReviewData } from './types';
import {
	anticholinergicBandFor,
	burdenBandFor,
	collectCriterionFlags,
	polypharmacyBandFor,
	requiredSectionsComplete,
	sumAnticholinergicBurden
} from './structured-medication-review-rules';
import {
	anticholinergicBandLabel,
	burdenBandLabel,
	polypharmacyBandLabel,
	reviewStatusLabel
} from './utils';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Structured Medication Review grader. Pure function: takes a `ReviewData`
 * object (a parent review plus its repeating medicine list) and derives the
 * documentation-form outputs (spec §4). This is NOT a single numeric score — it
 * emits per-record counts, bands, a review STATUS, and per-medicine flags:
 *
 *   medicineCount              = count(medicines)
 *   regularMedicineCount       = count(medicines where isRegular == 'yes')
 *   anticholinergicBurdenScore = sum(medicine.anticholinergicBurdenPoints ?? 0)
 *   polypharmacyBand           = none | polypharmacy | hyperpolypharmacy
 *   anticholinergicBand        = low | significant   (significant at ACB >= 3)
 *   burdenBand                 = low | moderate | high  (max of the two bands)
 *   reviewStatus               = complete | incomplete
 *   stopFlags[]                = one per medicine with a non-empty stoppCriterion
 *   startFlags[]               = one per medicine with a non-empty startCriterion
 *
 * The firedRules audit trail mirrors the grade_rule SQL table.
 */
export function calculateReview(data: ReviewData): Omit<GradingResult, 'flaggedIssues' | 'timestamp'> {
	const medicines = data.medicines || [];

	const medicineCount = medicines.length;
	const regularMedicineCount = medicines.filter((m) => m.isRegular === 'yes').length;
	const anticholinergicBurdenScore = sumAnticholinergicBurden(medicines);

	const polypharmacyBand = polypharmacyBandFor(regularMedicineCount);
	const anticholinergicBand = anticholinergicBandFor(anticholinergicBurdenScore);
	const burdenBand = burdenBandFor(regularMedicineCount, anticholinergicBurdenScore);

	const reviewStatus = requiredSectionsComplete(data) ? 'complete' : 'incomplete';

	const stopFlags = collectCriterionFlags(medicines, 'stoppCriterion');
	const startFlags = collectCriterionFlags(medicines, 'startCriterion');

	// Audit trail mirroring the grade_rule table.
	const firedRules: FiredRule[] = [
		{
			id: 'R-POLYPHARMACY-01',
			category: 'polypharmacy',
			description: `${regularMedicineCount} regular medicine(s) — ${polypharmacyBandLabel(polypharmacyBand)}`
		},
		{
			id: 'R-ANTICHOLINERGIC-BURDEN-01',
			category: 'anticholinergic-burden',
			description: `Anticholinergic burden score ${anticholinergicBurdenScore} — ${anticholinergicBandLabel(anticholinergicBand)}`
		},
		{
			id: 'R-BURDEN-BAND-01',
			category: 'burden-band',
			description: `Composite ${burdenBandLabel(burdenBand)} (worse of polypharmacy and anticholinergic bands)`
		},
		{
			id: 'R-REVIEW-STATUS-01',
			category: 'review-status',
			description: `Review status: ${reviewStatusLabel(reviewStatus)}`
		}
	];
	for (const f of stopFlags) {
		firedRules.push({
			id: 'R-STOPP-01',
			category: 'stopp',
			description: `STOPP — ${f.drugName}: ${f.criterion}`
		});
	}
	for (const f of startFlags) {
		firedRules.push({
			id: 'R-START-01',
			category: 'start',
			description: `START — ${f.drugName}: ${f.criterion}`
		});
	}

	return {
		medicineCount,
		regularMedicineCount,
		anticholinergicBurdenScore,
		polypharmacyBand,
		anticholinergicBand,
		burdenBand,
		reviewStatus,
		stopFlags,
		startFlags,
		firedRules
	};
}

/**
 * Full grade: counts + bands + status + flagged issues + timestamp. This is the
 * value the wizard stores in `assessment.result` and renders on the report.
 */
export function gradeReview(data: ReviewData): GradingResult {
	const grade = calculateReview(data);
	const flaggedIssues = detectFlaggedIssues(data, grade);
	return {
		...grade,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
