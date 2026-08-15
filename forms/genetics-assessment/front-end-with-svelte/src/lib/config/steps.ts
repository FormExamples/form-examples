import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Proband Demographics', shortTitle: 'Proband', section: 'probandDemographics' },
	{ number: 2, title: 'Presenting Concern', shortTitle: 'Concern', section: 'presentingConcern' },
	{
		number: 3,
		title: 'Personal Medical History',
		shortTitle: 'History',
		section: 'personalMedicalHistory'
	},
	{
		number: 4,
		title: 'Three-Generation Family Pedigree',
		shortTitle: 'Pedigree',
		section: 'familyPedigree'
	},
	{
		number: 5,
		title: 'Consanguinity & Ancestry',
		shortTitle: 'Ancestry',
		section: 'consanguinityAncestry'
	},
	{
		number: 6,
		title: 'Targeted Risk Scoring',
		shortTitle: 'Scoring',
		section: 'targetedRiskScoring'
	},
	{
		number: 7,
		title: 'Prior Genetic Testing',
		shortTitle: 'Prior testing',
		section: 'priorGeneticTesting'
	},
	{
		number: 8,
		title: 'Patient Understanding & Concerns',
		shortTitle: 'Understanding',
		section: 'patientUnderstandingConcerns'
	},
	{
		number: 9,
		title: 'Recommendation & Referral Plan',
		shortTitle: 'Plan',
		section: 'recommendationReferralPlan'
	}
];
