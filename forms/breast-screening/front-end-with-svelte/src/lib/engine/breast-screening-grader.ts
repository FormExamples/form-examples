import type { FiredRule, GradingResult, OutcomeBand, ScreeningData } from './types';
import { deriveEligibility, outcomeRules } from './breast-screening-rules';
import { detectFlaggedIssues } from './flagged-issues';

// Breast-screening grader. Pure functions: take a `ScreeningData` object, derive
// the eligibility status, then walk the ordered `outcomeRules` and take the
// FIRST match to fix the screening outcome and outcome band. This is a
// result-classification, not a numeric score.
//
// Classification algorithm (spec §4):
//   eligibilityStatus = deriveEligibility(d)   // symptomatic → higher-risk → age → eligible
//   For the outcome, in order:
//     symptomatic == 'yes'                          → symptomatic-pathway-referral / referral
//     readingOutcome == 'technical-repeat'          → technical-repeat / repeat
//     readingOutcome == 'normal-routine-recall'     → routine-recall / routine
//     readingOutcome == 'recall-for-assessment':
//       not assessed or classification null         → recall-to-assessment-clinic / assessment
//       classification 1–2                          → routine-recall / routine
//       classification 3                            → short-interval-follow-up / assessment
//       classification 4–5                          → urgent-breast-clinic / urgent
//     otherwise                                     → '' / incomplete
//
// Completeness: the record is `complete` when eligibility inputs, consent, the
// views taken, image adequacy, the reading outcome, and — after a recall — the
// imaging classification are all present; otherwise `incomplete`.

/** Determine whether every required input for a final classification is present. */
export function isComplete(d: ScreeningData): boolean {
	// A symptomatic record is a complete (short-circuit) classification.
	if (d.eligibility.symptomatic === 'yes') return true;

	if (d.eligibility.symptomatic === '') return false;
	if (d.eligibility.consentGiven === '') return false;
	if (d.mammogram.viewsTaken === '') return false;
	if (d.mammogram.imageAdequacy === '') return false;
	if (d.reading.readingOutcome === '') return false;

	// After a recall, a classification is required once assessment is performed.
	if (d.reading.readingOutcome === 'recall-for-assessment') {
		if (d.assessment.assessmentPerformed === 'yes' && d.assessment.imagingClassification === null) {
			return false;
		}
	}
	return true;
}

/**
 * Pure function: compute the full breast-screening classification for the
 * supplied data. This is a classification form — there is NO numeric total, no
 * cut-off, and no band table. A screening classification records the outcome and
 * next action; it is not a diagnosis.
 */
export function calculateGrade(data: ScreeningData): GradingResult {
	const eligibilityStatus = deriveEligibility(data);
	const timestamp = new Date().toISOString();

	const firedRules: FiredRule[] = [];

	let screeningOutcome: GradingResult['screeningOutcome'] = '';
	let outcomeBand: OutcomeBand = 'incomplete';

	for (const rule of outcomeRules) {
		let matched = false;
		try {
			matched = rule.evaluate(data);
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Breast-screening rule ${rule.id} evaluation failed:`, e);
		}
		if (matched) {
			screeningOutcome = rule.screeningOutcome;
			outcomeBand = rule.outcomeBand;
			firedRules.push({
				id: rule.id,
				category: rule.category,
				description: rule.description
			});
			break; // first-match pathway
		}
	}

	const status = isComplete(data) && screeningOutcome !== '' ? 'complete' : 'incomplete';

	// Record the derived eligibility decision as an audit row.
	firedRules.unshift({
		id: 'R-ELIGIBILITY-01',
		category: 'eligibility',
		description: `Eligibility status derived as "${eligibilityStatus}"`
	});

	return {
		eligibilityStatus,
		readingOutcome: data.reading.readingOutcome,
		imagingClassification: data.assessment.imagingClassification,
		screeningOutcome,
		outcomeBand,
		status,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data),
		timestamp
	};
}
