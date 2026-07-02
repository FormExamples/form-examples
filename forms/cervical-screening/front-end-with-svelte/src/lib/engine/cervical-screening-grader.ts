import type {
	AssessmentData,
	FiredRule,
	GradingResult,
	ManagementAction,
	ResultClass,
	Status
} from './types';
import { classificationRules } from './cervical-screening-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Completeness: the reached branch has its determining inputs present. A
 * result classification is `complete` when eligibility (age), consent, sample
 * adequacy, and the required result fields for the reached branch are all
 * recorded; otherwise `incomplete`.
 */
export function computeStatus(d: AssessmentData, resultClass: ResultClass): Status {
	const ageKnown = d.identification.age !== null;
	const ceased = d.eligibility.previouslyCeased === 'yes';
	const consentPresent = d.consent.consentGiven !== '';
	const adequacyPresent = d.adequacy.sampleAdequacy !== '';

	switch (resultClass) {
		case 'cease-not-eligible':
			// Determined once age is known or the person is recorded as ceased.
			return ageKnown || ceased ? 'complete' : 'incomplete';
		case 'inadequate':
		case 'hpv-negative':
		case 'hpv-positive-cytology-normal':
		case 'hpv-positive-cytology-abnormal-low':
		case 'hpv-positive-cytology-abnormal-high':
			return ageKnown && consentPresent && adequacyPresent ? 'complete' : 'incomplete';
		default:
			// pending / awaiting-cytology branches are inherently incomplete.
			return 'incomplete';
	}
}

/**
 * Pure function: compute the full cervical-screening classification for the
 * supplied screening data, applying the gated first-match classification
 * cascade in `classificationRules`. This is a result-classification outcome,
 * NOT a numeric score, cut-off, or band table.
 *
 * Classification algorithm (spec §4), applied top-to-bottom, first match wins:
 *   not eligible (age < 25 / age > 64, or ceased) -> cease-not-eligible / cease-screening
 *   sampleAdequacy == 'inadequate'                -> inadequate / repeat-sample-3-months
 *   hpvResult == 'negative'                       -> hpv-negative / routine-recall
 *   hpvResult == 'positive':
 *     cytologyGrade 'negative'                    -> hpv-positive-cytology-normal / early-repeat-12-months
 *     cytologyGrade 'borderline' | 'low-grade'    -> hpv-positive-cytology-abnormal-low / colposcopy-referral
 *     cytologyGrade 'high-grade'                  -> hpv-positive-cytology-abnormal-high / urgent-colposcopy-referral
 *     else                                        -> hpv-positive-cytology-pending / awaiting-cytology
 *   otherwise (hrHPV missing / not-tested)        -> pending / awaiting-result
 */
export function calculateGrade(data: AssessmentData): GradingResult {
	const timestamp = new Date().toISOString();

	let winner = classificationRules[classificationRules.length - 1];
	for (const rule of classificationRules) {
		try {
			if (rule.evaluate(data)) {
				winner = rule;
				break;
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Cervical-screening rule ${rule.id} evaluation failed:`, e);
		}
	}

	const resultClass: ResultClass = winner.resultClass;
	const managementAction: ManagementAction = winner.managementAction;
	const status = computeStatus(data, resultClass);

	const firedRules: FiredRule[] = [
		{
			id: winner.id,
			category: winner.category,
			resultClass: winner.resultClass,
			managementAction: winner.managementAction,
			description: winner.description
		}
	];

	return {
		resultClass,
		managementAction,
		status,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, { resultClass, managementAction, status }),
		timestamp
	};
}
