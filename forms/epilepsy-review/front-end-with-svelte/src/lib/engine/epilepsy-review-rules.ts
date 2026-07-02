import type { AssessmentData, ComponentRule, SeizureControl } from './types';
import { filled } from './utils';

// Epilepsy-review classification rules (NICE NG217). Pure helper functions, no
// I/O. This module owns the domain logic the grader orchestrates:
//
//   classifyControl(data)      -> seizure-free | controlled | uncontrolled
//   COMPONENTS + satisfied     -> review-completeness domains
//   componentApplicable(...)   -> applicable-only domains (childbearing)
//
// The engine is a control-classification and documentation-completeness tool,
// NOT a numeric score. See spec §4.

/**
 * Classify seizure control from the worst finding (spec §4.1).
 *
 * uncontrolled = increasing trend, OR any status epilepticus, OR weekly/daily
 *                seizure frequency.
 * seizure-free = not uncontrolled AND (no seizures OR a seizure-free trend).
 * controlled   = seizures present but stable/decreasing (everything else).
 */
export function classifyControl(data: AssessmentData): SeizureControl {
	const s = data.seizures;
	const uncontrolled =
		s.seizureTrend === 'increasing' ||
		data.injuries.statusEpilepticus === 'yes' ||
		s.seizureFrequency === 'weekly' ||
		s.seizureFrequency === 'daily';

	const seizureFree =
		!uncontrolled && (s.seizureFrequency === 'none' || s.seizureTrend === 'seizure-free');

	return uncontrolled ? 'uncontrolled' : seizureFree ? 'seizure-free' : 'controlled';
}

/**
 * The required review domains graded for completeness (spec §4.2). Seizure and
 * medication are the gates: their absence forces `incomplete`. The remaining
 * domains contribute to complete vs partial. The valproate / PPP and folic-acid
 * domains are applicable only when the patient is a woman of childbearing
 * potential.
 */
export const COMPONENTS: ComponentRule[] = [
	{
		component: 'seizure',
		label: 'Seizure type and frequency',
		gate: true,
		satisfied: (d) => filled(d.seizures.seizureFrequency)
	},
	{
		component: 'medication',
		label: 'Anti-seizure medication and adherence',
		gate: true,
		satisfied: (d) => filled(d.medication.asmAdherence)
	},
	{
		component: 'triggers',
		label: 'Triggers',
		satisfied: (d) => filled(d.triggers.triggers)
	},
	{
		component: 'sudep',
		label: 'SUDEP risk discussion',
		satisfied: (d) => filled(d.sudep.sudepDiscussed)
	},
	{
		component: 'injuries-status',
		label: 'Injuries and status epilepticus',
		satisfied: (d) => filled(d.injuries.statusEpilepticus) || filled(d.injuries.seizureInjury)
	},
	{
		component: 'safety',
		label: 'Safety (DVLA driving / bathing)',
		satisfied: (d) =>
			filled(d.safety.dvlaEligible) ||
			filled(d.safety.currentlyDriving) ||
			filled(d.safety.bathingAdviceGiven)
	},
	{
		component: 'mental-health',
		label: 'Mental health',
		satisfied: (d) => filled(d.mentalHealth.mentalHealthConcern)
	},
	{
		component: 'care-plan',
		label: 'Care plan',
		satisfied: (d) => filled(d.summary.carePlan) || filled(d.summary.nextReviewDue)
	},
	{
		component: 'valproate-ppp',
		label: 'Valproate and pregnancy prevention',
		applicable: (d) => d.childbearing.womanOfChildbearingPotential === 'yes',
		satisfied: (d) => filled(d.childbearing.onValproate)
	},
	{
		component: 'folic-acid',
		label: 'Folic acid',
		applicable: (d) => d.childbearing.womanOfChildbearingPotential === 'yes',
		satisfied: (d) => filled(d.childbearing.folicAcid)
	}
];

/** Whether a component is required (applicable) for the given data. */
export function componentApplicable(component: ComponentRule, data: AssessmentData): boolean {
	return component.applicable ? component.applicable(data) === true : true;
}
