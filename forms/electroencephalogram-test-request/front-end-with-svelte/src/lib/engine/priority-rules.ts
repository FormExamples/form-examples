import type { EegRequest, PriorityBand, FiredRule } from './types';

/**
 * Axis D — clinical priority (acuity weighting of indication + context).
 *
 * Each priority rule contributes a band (low / moderate / high). The most
 * severe contributing band wins. High-acuity indications (status epilepticus,
 * encephalopathy) and red flags push priority high. The least-alarming band is
 * chosen only when no rule fires.
 */
const PRIORITY_ORDER: PriorityBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
export function maxPriority(a: PriorityBand, b: PriorityBand): PriorityBand {
	const ia = PRIORITY_ORDER.indexOf(a);
	const ib = PRIORITY_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

interface PriorityRule {
	ruleId: string;
	band: PriorityBand;
	fires: (d: EegRequest) => boolean;
	description: string;
}

const PRIORITY_RULES: PriorityRule[] = [
	{
		ruleId: 'R-PRIORITY-STATUS-EPILEPTICUS',
		band: 'high',
		fires: (d) =>
			d.redFlags.suspectedStatusEpilepticus === true ||
			d.request.primaryIndication === 'status-epilepticus',
		description: 'Suspected status epilepticus — highest clinical priority.'
	},
	{
		ruleId: 'R-PRIORITY-ENCEPHALOPATHY',
		band: 'high',
		fires: (d) => d.request.primaryIndication === 'encephalopathy',
		description: 'Encephalopathy — high priority to exclude non-convulsive status.'
	},
	{
		ruleId: 'R-PRIORITY-RECENT-FIRST-SEIZURE',
		band: 'moderate',
		fires: (d) =>
			d.redFlags.recentSeizure === true &&
			(d.context.firstSeizure === true || d.request.primaryIndication === 'first-seizure'),
		description: 'Recent first seizure — moderate priority.'
	},
	{
		ruleId: 'R-PRIORITY-FIRST-SEIZURE',
		band: 'moderate',
		fires: (d) =>
			d.context.firstSeizure === true || d.request.primaryIndication === 'first-seizure',
		description: 'First-seizure work-up — moderate priority.'
	},
	{
		ruleId: 'R-PRIORITY-PRE-SURGICAL',
		band: 'moderate',
		fires: (d) => d.request.primaryIndication === 'pre-surgical-evaluation',
		description: 'Pre-surgical evaluation — moderate priority.'
	}
];

/**
 * Compute the clinical-priority band and the fired priority rules.
 */
export function scorePriority(data: EegRequest): {
	band: PriorityBand;
	firedRules: FiredRule[];
} {
	let band: PriorityBand = 'low';
	const firedRules: FiredRule[] = [];

	for (const rule of PRIORITY_RULES) {
		if (rule.fires(data)) {
			band = maxPriority(band, rule.band);
			firedRules.push({
				ruleId: rule.ruleId,
				axis: 'priority',
				category: 'acuity',
				description: rule.description
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BASELINE',
			axis: 'priority',
			category: 'baseline',
			description: 'No high-acuity indication or red flag; routine clinical priority.'
		});
	}

	return { band, firedRules };
}
