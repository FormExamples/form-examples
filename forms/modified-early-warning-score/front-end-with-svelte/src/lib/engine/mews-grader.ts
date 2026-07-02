// MEWS grader. Pure functions: take an `AssessmentData` object, score each of
// the five parameters via the Subbe (2001) band tables in `mews-rules.ts`, sum
// the aggregate (0-14), derive the risk band, and detect the single-parameter=3
// trigger with the recommended monitoring frequency and escalation response.
//
// Grading algorithm (spec §4):
//   1. Score each parameter to 0-3 (temperature caps at 2).
//   2. mewsScore = sum of the five parameter subscores (nulls contribute 0).
//   3. riskBand = mewsScore >= 5 ? 'high' : mewsScore >= 2 ? 'medium' : 'low'.
//   4. singleParameterTrigger = true when any single subscore == 3.
//   5. Unanswered parameters contribute 0 to the sum but mark the grade
//      incomplete; `flagged-issues.ts` raises a data-completeness flag separately.
//
// Both riskBand == 'high' and singleParameterTrigger indicate urgent medical
// review / critical-care outreach.

import type { AssessmentData, RiskBand, Subscores, FiredRule, GradingResult } from './types';
import {
	scoreSystolicBloodPressure,
	scoreHeartRate,
	scoreRespiratoryRate,
	scoreTemperature,
	scoreAvpu
} from './mews-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** The five scored physiological parameters. */
const SUBSCORE_KEYS: (keyof Subscores)[] = [
	'systolicBloodPressure',
	'heartRate',
	'respiratoryRate',
	'temperature',
	'avpu'
];

/** Compute the five subscores for the supplied assessment data. */
export function computeSubscores(data: AssessmentData): Subscores {
	return {
		systolicBloodPressure: scoreSystolicBloodPressure(data.bloodPressure.systolicBloodPressure),
		heartRate: scoreHeartRate(data.heartRate.heartRate),
		respiratoryRate: scoreRespiratoryRate(data.respiratory.respiratoryRate),
		temperature: scoreTemperature(data.temperature.temperature),
		avpu: scoreAvpu(data.consciousness.avpu)
	};
}

/** Derive the risk band from the aggregate. */
export function aggregateBand(mewsScore: number): RiskBand {
	if (mewsScore >= 5) return 'high';
	if (mewsScore >= 2) return 'medium';
	return 'low';
}

/** Monitoring frequency + recommendation for the final band. */
function response(band: RiskBand): { monitoringFrequency: string; recommendation: string } {
	switch (band) {
		case 'high':
			return {
				monitoringFrequency: 'Continuous monitoring',
				recommendation:
					'Urgent medical review; consider critical-care outreach and continuous ' +
					'monitoring of vital signs.'
			};
		case 'medium':
			return {
				monitoringFrequency: 'Increased frequency (minimum 1-4 hourly)',
				recommendation:
					'Increase observation frequency; inform the nurse in charge; consider ' +
					'medical review.'
			};
		case 'low':
		default:
			return {
				monitoringFrequency: 'Routine ward frequency',
				recommendation: 'Routine observations at the standard ward frequency.'
			};
	}
}

/**
 * Collect an audit row per parameter that contributed points, plus the
 * aggregate and (when present) single-parameter-trigger rows. Mirrors the
 * grade_rule table.
 */
function collectFiredRules(
	s: Subscores,
	mewsScore: number,
	singleParameterTrigger: boolean,
	band: RiskBand
): FiredRule[] {
	const fired: FiredRule[] = [];
	const rows: [string, string, number | null, string][] = [
		['R-SBP', 'systolic-blood-pressure', s.systolicBloodPressure, 'blood-pressure'],
		['R-HR', 'heart-rate', s.heartRate, 'heart-rate'],
		['R-RR', 'respiratory-rate', s.respiratoryRate, 'respiratory-rate'],
		['R-TEMP', 'temperature', s.temperature, 'temperature'],
		['R-AVPU', 'avpu', s.avpu, 'consciousness']
	];
	for (const [idBase, instrument, points, category] of rows) {
		if (points === null || points === 0) continue;
		fired.push({
			id: `${idBase}-${points}-01`,
			instrument,
			band: points === 3 ? 'high' : points === 2 ? 'medium' : 'low',
			points,
			category,
			description: `${instrument} scored ${points}`
		});
	}
	if (singleParameterTrigger) {
		fired.push({
			id: 'R-SINGLE-PARAMETER-3-01',
			instrument: 'single-parameter',
			band: 'high',
			points: 3,
			category: 'single-parameter-trigger',
			description:
				'A single parameter scored the maximum 3 — urgent medical review regardless of the aggregate.'
		});
	}
	fired.push({
		id: 'R-AGGREGATE-01',
		instrument: 'aggregate',
		band,
		points: mewsScore,
		category: 'aggregate',
		description: `Aggregate MEWS ${mewsScore} of 14 — ${band} risk band.`
	});
	return fired;
}

/** Compute the full MEWS grade for the supplied assessment data. */
export function gradeMews(data: AssessmentData): GradingResult {
	const subscores = computeSubscores(data);

	// Aggregate = sum of the five parameter subscores; nulls contribute 0.
	const mewsScore = SUBSCORE_KEYS.reduce((sum, k) => sum + (subscores[k] ?? 0), 0);

	const singleParameterTrigger = SUBSCORE_KEYS.some((k) => subscores[k] === 3);
	const riskBand = aggregateBand(mewsScore);
	const { monitoringFrequency, recommendation } = response(riskBand);

	// Complete when every parameter has a recorded value.
	const complete = SUBSCORE_KEYS.every((k) => subscores[k] !== null);

	const firedRules = collectFiredRules(subscores, mewsScore, singleParameterTrigger, riskBand);
	const flaggedIssues = detectFlaggedIssues(data, {
		subscores,
		mewsScore,
		singleParameterTrigger
	});

	return {
		subscores,
		mewsScore,
		riskBand,
		singleParameterTrigger,
		monitoringFrequency,
		recommendation,
		complete,
		firedRules,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
