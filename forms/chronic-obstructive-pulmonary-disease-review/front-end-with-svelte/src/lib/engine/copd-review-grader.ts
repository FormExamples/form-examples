import type {
	AbeGroup,
	AssessmentData,
	Axis,
	FiredRule,
	GoldGrade,
	GradingResult,
	ReviewStatus
} from './types';
import {
	abeGroupOf,
	coreComponents,
	copdRules,
	exacerbationRiskOf,
	goldGradeOf,
	supportingComponents,
	symptomBurdenOf
} from './copd-review-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Grading algorithm (spec §4):
 *   goldGrade        = FEV₁ % predicted banded ≥80→1, ≥50→2, ≥30→3, <30→4; null when unrecorded
 *   symptomBurden    = (mMRC ≥ 2) or (CAT ≥ 10)                     ? 'high' : 'low'
 *   exacerbationRisk = (≥ 2 moderate) or (≥ 1 hospitalised)          ? 'high' : 'low'
 *   abeGroup         = no axis data ? null : exac high ? 'E' : symptom high ? 'B' : 'A'
 *   reviewStatus     = any core missing ? 'incomplete'
 *                      : any supporting missing ? 'partial' : 'complete'
 *
 * A missing numeric input contributes nothing to its axis (treated as absent,
 * not as a normal value) and lowers the completeness grade. This is a
 * severity-classification / completeness instrument — there is NO numeric total.
 */

/**
 * Evaluate the declarative classification rules and collect the ones that fired
 * (one per gold / symptom / exacerbation / abe axis).
 */
export function evaluateRules(data: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of copdRules) {
		try {
			if (rule.evaluate(data)) {
				fired.push({
					id: rule.id,
					section: rule.section,
					category: rule.category,
					description: rule.description
				});
			}
		} catch (e) {
			console.warn(`COPD rule ${rule.id} evaluation failed:`, e);
		}
	}
	return fired;
}

/**
 * Grade review completeness and append a completeness audit row per missing
 * component (`fired` is mutated).
 */
export function computeReviewStatus(data: AssessmentData, fired: FiredRule[]): ReviewStatus {
	const missingCore = coreComponents.filter((c) => !c.present(data));
	const missingSupporting = supportingComponents.filter((c) => !c.present(data));

	for (const c of missingCore) {
		fired.push({
			id: `R-COMPLETENESS-CORE-${c.id.toUpperCase()}`,
			section: 'completeness',
			category: 'required-component',
			description: `Core review element missing: ${c.label}`
		});
	}
	for (const c of missingSupporting) {
		fired.push({
			id: `R-COMPLETENESS-SUPPORTING-${c.id.toUpperCase()}`,
			section: 'completeness',
			category: 'supporting-component',
			description: `Supporting review item missing: ${c.label}`
		});
	}

	let status: ReviewStatus;
	if (missingCore.length > 0) {
		status = 'incomplete';
	} else if (missingSupporting.length > 0) {
		status = 'partial';
	} else {
		status = 'complete';
	}

	fired.push({
		id: `R-COMPLETENESS-${status.toUpperCase()}-01`,
		section: 'completeness',
		category: 'review-status',
		description:
			status === 'complete'
				? 'All core and supporting review elements recorded — review is complete'
				: status === 'partial'
					? 'All core elements recorded but one or more supporting items missing — review is partial'
					: 'One or more core review elements missing — review is incomplete'
	});

	return status;
}

/** The grade portion (no flags yet): the four axes plus the completeness grade. */
export function calculateGrade(data: AssessmentData): {
	goldGrade: GoldGrade;
	symptomBurden: Axis;
	exacerbationRisk: Axis;
	abeGroup: AbeGroup;
	reviewStatus: ReviewStatus;
	firedRules: FiredRule[];
} {
	const firedRules = evaluateRules(data);
	const goldGrade = goldGradeOf(data);
	const symptomBurden = symptomBurdenOf(data);
	const exacerbationRisk = exacerbationRiskOf(data);
	const abeGroup = abeGroupOf(data);
	const reviewStatus = computeReviewStatus(data, firedRules);

	return { goldGrade, symptomBurden, exacerbationRisk, abeGroup, reviewStatus, firedRules };
}

/**
 * Pure function: compute the full COPD-review grade for the supplied review
 * data. This is the canonical engine entry point (spec §6). It derives the four
 * independent outputs plus the review-completeness grade, then raises
 * clinician-facing flags independently.
 */
export function gradeCopdReview(data: AssessmentData): GradingResult {
	const grade = calculateGrade(data);
	const flags = detectFlaggedIssues(data, {
		abeGroup: grade.abeGroup,
		reviewStatus: grade.reviewStatus
	});

	return {
		goldGrade: grade.goldGrade,
		symptomBurden: grade.symptomBurden,
		exacerbationRisk: grade.exacerbationRisk,
		abeGroup: grade.abeGroup,
		reviewStatus: grade.reviewStatus,
		firedRules: grade.firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
