import type { SleepStudyRequest, PriorityBand, FiredRule } from './types';
import { EPWORTH_ABNORMAL, EPWORTH_SEVERE, STOP_BANG_HIGH_RISK } from './constants';

const PRIORITY_ORDER: PriorityBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is the more severe. */
export function maxPriority(a: PriorityBand, b: PriorityBand): PriorityBand {
	return PRIORITY_ORDER.indexOf(a) >= PRIORITY_ORDER.indexOf(b) ? a : b;
}

function epworthAtLeast(r: SleepStudyRequest, threshold: number): boolean {
	const v = r.scores.epworthScore;
	return v !== null && v !== undefined && Number(v) >= threshold;
}

function stopBangAtLeast(r: SleepStudyRequest, threshold: number): boolean {
	const v = r.scores.stopBangScore;
	return v !== null && v !== undefined && Number(v) >= threshold;
}

interface PriorityRule {
	ruleId: string;
	band: PriorityBand;
	fires: (r: SleepStudyRequest) => boolean;
	description: string;
}

const PRIORITY_RULES: PriorityRule[] = [
	{
		ruleId: 'R-PRIORITY-DRIVER-SLEEPINESS',
		band: 'high',
		fires: (r) => r.symptoms.occupationalDriver === true && epworthAtLeast(r, EPWORTH_ABNORMAL),
		description: 'Occupational driver with excessive daytime sleepiness — high priority (DVLA).'
	},
	{
		ruleId: 'R-PRIORITY-SEVERE-SLEEPINESS',
		band: 'high',
		fires: (r) => epworthAtLeast(r, EPWORTH_SEVERE),
		description: 'Severe excessive daytime sleepiness (Epworth ≥ 16) — high priority.'
	},
	{
		ruleId: 'R-PRIORITY-MODERATE-SLEEPINESS',
		band: 'moderate',
		fires: (r) => epworthAtLeast(r, EPWORTH_ABNORMAL),
		description: 'Abnormal daytime sleepiness (Epworth ≥ 11) — moderate priority.'
	},
	{
		ruleId: 'R-PRIORITY-OCCUPATIONAL-DRIVER',
		band: 'moderate',
		fires: (r) => r.symptoms.occupationalDriver === true,
		description: 'Occupational / vocational driver — moderate priority (DVLA relevance).'
	},
	{
		ruleId: 'R-PRIORITY-CARDIOVASCULAR',
		band: 'moderate',
		fires: (r) => r.symptoms.cardiovascularDisease === true,
		description: 'Established cardiovascular disease raises priority.'
	},
	{
		ruleId: 'R-PRIORITY-HIGH-OSA-RISK',
		band: 'moderate',
		fires: (r) => stopBangAtLeast(r, STOP_BANG_HIGH_RISK),
		description: 'High STOP-BANG (≥ 5) indicates high OSA risk — moderate priority.'
	}
];

/**
 * Axis B — clinical priority (low / moderate / high).
 *
 * Reflects how clinically pressing the study is, driven by occupational driving
 * with sleepiness, severe daytime sleepiness, and cardiovascular comorbidity.
 * The most-severe band that fires wins.
 */
export function gradePriority(r: SleepStudyRequest): {
	priorityBand: PriorityBand;
	firedRules: FiredRule[];
} {
	let band: PriorityBand = 'low';
	const firedRules: FiredRule[] = [];

	for (const rule of PRIORITY_RULES) {
		if (rule.fires(r)) {
			band = maxPriority(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'priority',
				category: 'clinical-priority',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BASELINE',
			axis: 'priority',
			category: 'clinical-priority',
			description: 'No priority drivers present; baseline low priority.'
		});
	}

	return { priorityBand: band, firedRules };
}
