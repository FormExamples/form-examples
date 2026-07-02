import type {
	AssessmentData,
	FiredRule,
	GradingResult,
	ManagementAction,
	ResultClass
} from './types';
import {
	DEFAULT_THRESHOLD,
	INADEQUATE_SAMPLE,
	classificationRules,
	type BranchKey
} from './bowel-fit-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** True when a numeric value is present (not null/undefined/NaN). */
export function hasNumber(n: number | null | undefined): n is number {
	return n !== null && n !== undefined && !Number.isNaN(n);
}

/**
 * Pure function: compute the FIT classification for the supplied assessment
 * data.
 *
 * Classification algorithm (spec §4), first match wins:
 *   if kitReturned == 'no':
 *       resultClass = '';        managementAction = 'repeat-kit'   (non-return)
 *   elif sampleAdequacy in (spoilt, insufficient, expired):
 *       resultClass = 'spoilt';  managementAction = 'repeat-kit'
 *   elif faecalHb != null && faecalHb >= thresholdApplied:
 *       resultClass = 'positive'; managementAction = 'refer-colonoscopy'
 *   elif faecalHb != null && faecalHb < thresholdApplied:
 *       resultClass = 'negative'; managementAction = 'routine-recall'
 *   else:  // returned & adequate but no numeric result
 *       resultClass = '';        managementAction = 'repeat-kit'   (incomplete)
 *
 *   symptomaticPathway = redFlagSymptoms == 'yes'   (independent of the result)
 *
 * The applied threshold defaults to 120 µg Hb/g (screening); configuring it to
 * 10 yields the NICE DG56 symptomatic behaviour with the same engine. A missing
 * faecal haemoglobin on a returned, adequate kit is treated as incomplete (not
 * negative) and drives the incomplete-result flag.
 */
export function gradeFit(data: AssessmentData): GradingResult {
	const kitReturned = data.kit.kitReturned;
	const sampleAdequacy = data.kit.sampleAdequacy;
	const faecalHb = data.result.faecalHaemoglobinUgG;
	const threshold = hasNumber(data.result.thresholdApplied)
		? data.result.thresholdApplied
		: DEFAULT_THRESHOLD;
	const redFlagSymptoms = data.symptoms.redFlagSymptoms;

	const firedRules: FiredRule[] = [];

	let resultClass: ResultClass = '';
	let managementAction: ManagementAction = '';
	let status: 'complete' | 'incomplete' | '' = '';

	const push = (key: BranchKey) => {
		firedRules.push(classificationRules[key]);
	};

	// ─── Priority-ordered classification (first match wins) ─────────
	if (kitReturned === 'no') {
		resultClass = '';
		managementAction = 'repeat-kit';
		status = 'complete';
		push('non-return');
	} else if (INADEQUATE_SAMPLE.indexOf(sampleAdequacy) !== -1) {
		resultClass = 'spoilt';
		managementAction = 'repeat-kit';
		status = 'complete';
		push('spoilt');
	} else if (hasNumber(faecalHb) && faecalHb >= threshold) {
		resultClass = 'positive';
		managementAction = 'refer-colonoscopy';
		status = 'complete';
		push('positive');
	} else if (hasNumber(faecalHb) && faecalHb < threshold) {
		resultClass = 'negative';
		managementAction = 'routine-recall';
		status = 'complete';
		push('negative');
	} else {
		// Returned (or return unknown) and not inadequate, but no numeric result.
		resultClass = '';
		managementAction = 'repeat-kit';
		status = 'incomplete';
		push('incomplete');
	}

	// ─── Symptomatic pathway (independent of the numeric result) ────
	const symptomaticPathway = redFlagSymptoms === 'yes';
	if (symptomaticPathway) push('symptomatic');

	return {
		resultClass,
		managementAction,
		symptomaticPathway,
		status,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, { resultClass, symptomaticPathway, status }),
		timestamp: new Date().toISOString()
	};
}
