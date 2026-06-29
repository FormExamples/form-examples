// Audio-Vestibular Assessment grader. Pure functions: take an `AssessmentData`
// object, return per-ear PTA averages, the better-ear PTA, the WHO hearing-loss
// grade, inter-aural asymmetry, the DHI total (0-100) with per-subscale
// subtotals and handicap level, and the clinician-facing flags.

import type { AssessmentData, DhiFiredItem, GradingResult } from './types';
import {
	DHI_ITEMS,
	calculatePtaFromThresholds,
	classifyDhiHandicap,
	classifyHearingLossGrade,
	dhiAnswerScore
} from './rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Compute pure-tone audiometry results: per-ear PTAs, better-ear PTA,
 * asymmetry, and the WHO hearing-loss grade.
 */
export function calculatePureToneAudiometry(data: AssessmentData) {
	const right = data.pureToneAudiometry.rightEar.airConduction;
	const left = data.pureToneAudiometry.leftEar.airConduction;
	const rightPta = calculatePtaFromThresholds(right);
	const leftPta = calculatePtaFromThresholds(left);

	let betterEarPta: number | null = null;
	if (rightPta != null && leftPta != null) {
		betterEarPta = Math.min(rightPta, leftPta);
	} else if (rightPta != null) {
		betterEarPta = rightPta;
	} else if (leftPta != null) {
		betterEarPta = leftPta;
	}

	const asymmetry =
		rightPta != null && leftPta != null
			? Math.round(Math.abs(rightPta - leftPta) * 10) / 10
			: null;

	return {
		rightPta,
		leftPta,
		betterEarPta,
		asymmetry,
		hearingLossGrade: classifyHearingLossGrade(betterEarPta),
		rightHearingLossGrade: classifyHearingLossGrade(rightPta),
		leftHearingLossGrade: classifyHearingLossGrade(leftPta)
	};
}

/**
 * Compute the Dizziness Handicap Inventory total, per-subscale subtotals
 * (functional / emotional / physical), and the handicap level.
 */
export function calculateDhi(data: AssessmentData) {
	const answers = data.dizzinessHandicapInventory || {};
	let total = 0;
	let answeredCount = 0;
	let functional = 0;
	let emotional = 0;
	let physical = 0;
	const firedItems: DhiFiredItem[] = [];

	for (const item of DHI_ITEMS) {
		const key = 'q' + item.num;
		const answer = answers[key] || '';
		if (answer !== '') answeredCount++;
		const score = dhiAnswerScore(answer);
		total += score;
		if (item.subscale === 'F') functional += score;
		else if (item.subscale === 'E') emotional += score;
		else if (item.subscale === 'P') physical += score;
		firedItems.push({
			id: 'DHI-' + String(item.num).padStart(2, '0'),
			num: item.num,
			subscale: item.subscale,
			text: item.text,
			answer,
			score
		});
	}

	return {
		total,
		answeredCount,
		functional,
		emotional,
		physical,
		handicapLevel: classifyDhiHandicap(total),
		firedItems
	};
}

/**
 * Run the entire audio-vestibular grading pipeline against the supplied
 * assessment data and produce a flat `GradingResult` object.
 */
export function grade(data: AssessmentData): GradingResult {
	const pta = calculatePureToneAudiometry(data);
	const dhi = calculateDhi(data);
	const result: GradingResult = {
		rightPta: pta.rightPta,
		leftPta: pta.leftPta,
		betterEarPta: pta.betterEarPta,
		asymmetry: pta.asymmetry,
		hearingLossGrade: pta.hearingLossGrade,
		rightHearingLossGrade: pta.rightHearingLossGrade,
		leftHearingLossGrade: pta.leftHearingLossGrade,
		dhiTotal: dhi.total,
		dhiAnsweredCount: dhi.answeredCount,
		dhiFunctional: dhi.functional,
		dhiEmotional: dhi.emotional,
		dhiPhysical: dhi.physical,
		dhiHandicapLevel: dhi.handicapLevel,
		dhiFiredItems: dhi.firedItems,
		additionalFlags: [],
		timestamp: new Date().toISOString()
	};
	result.additionalFlags = detectAdditionalFlags(data, result);
	return result;
}
