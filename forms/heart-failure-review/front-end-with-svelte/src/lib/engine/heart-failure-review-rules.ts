import type { AssessmentData, DomainRule, Pillar } from './types';

/**
 * The four pillars of guideline-directed medical therapy, in order. Each entry
 * names the medication section prefix and a human-readable label used across
 * the optimisation grade and the report.
 */
export const PILLARS: { key: Pillar; label: string; short: string }[] = [
	{
		key: 'raasInhibitor',
		label: 'ACEi / ARB / ARNI (renin–angiotensin system inhibitor)',
		short: 'RAAS inhibitor'
	},
	{ key: 'betaBlocker', label: 'Beta-blocker licensed for heart failure', short: 'Beta-blocker' },
	{ key: 'mra', label: 'Mineralocorticoid receptor antagonist (MRA)', short: 'MRA' },
	{ key: 'sglt2Inhibitor', label: 'SGLT2 inhibitor', short: 'SGLT2 inhibitor' }
];

/** True when a text / enum value is non-blank. */
export function filled(v: unknown): boolean {
	return v !== null && v !== undefined && String(v).trim() !== '';
}

/** True when a numeric value has been recorded. */
export function num(v: unknown): boolean {
	return v !== null && v !== undefined && (v as unknown) !== '';
}

/**
 * The six required review domains (spec §4). Each domain is documented when its
 * predicate returns true. The grader counts documented domains to derive the
 * completeness score and the complete / partial / incomplete review status.
 * Rows mirror the `heart_failure_review_grade_rule` SQL table.
 */
export const reviewDomainRules: DomainRule[] = [
	{
		id: 'R-DOMAIN-01-FUNCTIONAL',
		domain: 'functional-status',
		category: 'domain-documentation',
		label: 'Functional status',
		description: 'NYHA functional class recorded',
		satisfied: (d: AssessmentData) => num(d.functional.nyhaClass)
	},
	{
		id: 'R-DOMAIN-02-FLUID',
		domain: 'fluid-status',
		category: 'domain-documentation',
		label: 'Fluid status',
		description: 'Weight or a fluid-status sign (oedema / JVP) recorded',
		satisfied: (d: AssessmentData) =>
			num(d.fluid.weightKg) || filled(d.fluid.peripheralOedema) || filled(d.fluid.raisedJvp)
	},
	{
		id: 'R-DOMAIN-03-BLOODS',
		domain: 'monitoring-bloods',
		category: 'domain-documentation',
		label: 'Monitoring bloods',
		description: 'Potassium and eGFR recorded',
		satisfied: (d: AssessmentData) =>
			num(d.investigations.potassium) && num(d.investigations.egfr)
	},
	{
		id: 'R-DOMAIN-04-MEDICATION',
		domain: 'medication-review',
		category: 'domain-documentation',
		label: 'Medication review',
		description: 'All four medication pillars have a recorded status',
		satisfied: (d: AssessmentData) =>
			filled(d.medication.raasInhibitorStatus) &&
			filled(d.medication.betaBlockerStatus) &&
			filled(d.medication.mraStatus) &&
			filled(d.medication.sglt2InhibitorStatus)
	},
	{
		id: 'R-DOMAIN-05-VACCINATIONS',
		domain: 'vaccinations',
		category: 'domain-documentation',
		label: 'Vaccinations',
		description: 'Influenza vaccination status recorded',
		satisfied: (d: AssessmentData) => filled(d.vaccinations.influenzaVaccination)
	},
	{
		id: 'R-DOMAIN-06-SELF-MANAGEMENT',
		domain: 'self-management',
		category: 'domain-documentation',
		label: 'Self-management',
		description: 'Self-management plan status recorded',
		satisfied: (d: AssessmentData) => filled(d.vaccinations.selfManagementPlan)
	}
];

/**
 * The indicated medication-pillar keys for a heart-failure type (spec §4). All
 * four pillars are indicated in HFrEF; in HFmrEF / HFpEF only the SGLT2
 * inhibitor is the principal disease-modifying pillar; for unknown type none
 * apply.
 */
export function indicatedPillarKeys(heartFailureType: string): Pillar[] {
	if (heartFailureType === 'reduced') {
		return ['raasInhibitor', 'betaBlocker', 'mra', 'sglt2Inhibitor'];
	}
	if (heartFailureType === 'mildly-reduced' || heartFailureType === 'preserved') {
		return ['sglt2Inhibitor'];
	}
	return [];
}
