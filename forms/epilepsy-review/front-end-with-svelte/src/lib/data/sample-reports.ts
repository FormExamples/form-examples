import type { AssessmentData, ReviewStatus, SeizureControl } from '$lib/engine/types';
import { review } from '$lib/engine/epilepsy-review-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample review: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	reviewedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	careSetting: string;
	seizureControl: SeizureControl;
	reviewStatus: ReviewStatus;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/** Seizure-free, complete — well-controlled, every domain documented. */
function seizureFreeComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		reviewerName: 'PN J. Okonkwo',
		reviewerRole: 'practice-nurse',
		reviewedAt: '2026-06-22',
		careSetting: 'general-practice',
		reviewType: 'annual',
		monthsSinceLastReview: 12
	};
	d.profile = {
		patientIdentifier: 'NHS 943 476 5919',
		ageBand: '40-59',
		sex: 'male',
		epilepsyType: 'focal',
		ageAtOnset: 22,
		yearsSinceDiagnosis: 20,
		learningDisability: 'no'
	};
	d.seizures = {
		seizureTypes: 'Focal impaired awareness seizures.',
		seizureFrequency: 'none',
		lastSeizureDate: '2024-01-10',
		seizureFreeMonths: 29,
		seizureTrend: 'seizure-free'
	};
	d.medication = {
		currentAsms: 'Lamotrigine 200 mg BD.',
		asmAdherence: 'good',
		asmSideEffects: 'none',
		drugLevel: null
	};
	d.triggers = { triggers: 'Sleep deprivation avoided; no other triggers identified.' };
	d.sudep = { sudepDiscussed: 'yes' };
	d.injuries = { statusEpilepticus: 'no', seizureInjury: 'no' };
	d.safety = { dvlaEligible: 'eligible', currentlyDriving: 'yes', bathingAdviceGiven: 'yes' };
	d.childbearing = {
		womanOfChildbearingPotential: 'not-applicable',
		onValproate: '',
		pregnancyPreventionProgramme: '',
		folicAcid: '',
		contraceptionInteractionReviewed: ''
	};
	d.mentalHealth = { mentalHealthConcern: 'none' };
	d.summary = {
		specialistReviewNeeded: 'no',
		nextReviewDue: '2027-06-01',
		carePlan: 'Continue lamotrigine; maintain good sleep hygiene; 12-month recall.',
		reviewContext: 'Long-standing seizure freedom on monotherapy. Routine annual review.'
	};
	return d;
}

/** Uncontrolled, complete — valproate in a woman of childbearing potential without a PPP. */
function uncontrolledValproate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		reviewerName: 'Dr A. Rahman',
		reviewerRole: 'neurologist',
		reviewedAt: '2026-06-24',
		careSetting: 'epilepsy-clinic',
		reviewType: 'annual',
		monthsSinceLastReview: 11
	};
	d.profile = {
		patientIdentifier: 'NHS 611 208 3344',
		ageBand: '18-39',
		sex: 'female',
		epilepsyType: 'generalised',
		ageAtOnset: 15,
		yearsSinceDiagnosis: 12,
		learningDisability: 'no'
	};
	d.seizures = {
		seizureTypes: 'Generalised tonic-clonic seizures.',
		seizureFrequency: 'weekly',
		lastSeizureDate: '2026-06-18',
		seizureFreeMonths: null,
		seizureTrend: 'increasing'
	};
	d.medication = {
		currentAsms: 'Sodium valproate 600 mg BD.',
		asmAdherence: 'partial',
		asmSideEffects: 'mild',
		drugLevel: null
	};
	d.triggers = { triggers: 'Missed doses, stress, and irregular sleep.' };
	d.sudep = { sudepDiscussed: 'yes' };
	d.injuries = { statusEpilepticus: 'no', seizureInjury: 'yes' };
	d.safety = { dvlaEligible: 'not-eligible', currentlyDriving: 'no', bathingAdviceGiven: 'yes' };
	d.childbearing = {
		womanOfChildbearingPotential: 'yes',
		onValproate: 'yes',
		pregnancyPreventionProgramme: 'not-in-place',
		folicAcid: 'no',
		contraceptionInteractionReviewed: 'no'
	};
	d.mentalHealth = { mentalHealthConcern: 'anxiety' };
	d.summary = {
		specialistReviewNeeded: 'yes',
		nextReviewDue: '2026-09-01',
		carePlan:
			'Urgent valproate PPP; discuss switching agent; adherence support; early specialist follow-up.',
		reviewContext:
			'Increasing generalised seizures on valproate in a woman of childbearing potential without a PPP.'
	};
	return d;
}

/** Controlled, partial — stable seizures but several domains outstanding. */
function controlledPartial(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		reviewerName: 'Dr I. Mackenzie',
		reviewerRole: 'gp',
		reviewedAt: '2026-06-24',
		careSetting: 'community',
		reviewType: 'annual',
		monthsSinceLastReview: 13
	};
	d.profile = {
		patientIdentifier: 'NHS 330 149 7720',
		ageBand: '60-79',
		sex: 'male',
		epilepsyType: 'focal',
		ageAtOnset: 58,
		yearsSinceDiagnosis: 6,
		learningDisability: 'no'
	};
	d.seizures = {
		seizureTypes: 'Focal aware seizures.',
		seizureFrequency: 'monthly',
		lastSeizureDate: '2026-05-30',
		seizureFreeMonths: null,
		seizureTrend: 'stable'
	};
	d.medication = {
		currentAsms: 'Levetiracetam 1 g BD.',
		asmAdherence: 'good',
		asmSideEffects: 'mild',
		drugLevel: null
	};
	d.triggers = { triggers: '' };
	d.sudep = { sudepDiscussed: 'no' };
	d.injuries = { statusEpilepticus: 'no', seizureInjury: 'no' };
	d.safety = { dvlaEligible: '', currentlyDriving: '', bathingAdviceGiven: '' };
	d.mentalHealth = { mentalHealthConcern: 'low-mood' };
	d.summary = {
		specialistReviewNeeded: 'no',
		nextReviewDue: '',
		carePlan: '',
		reviewContext: 'Stable focal seizures; several review domains outstanding and review overdue.'
	};
	return d;
}

/** Incomplete — a core gate (seizure / medication) not recorded. */
function incompleteReview(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		reviewerName: 'Dr Z. Nowak',
		reviewerRole: 'epilepsy-nurse',
		reviewedAt: '2026-06-28',
		careSetting: 'epilepsy-clinic',
		reviewType: 'interim',
		monthsSinceLastReview: 4
	};
	d.profile = {
		patientIdentifier: 'NHS 204 815 5528',
		ageBand: '18-39',
		sex: 'male',
		epilepsyType: 'combined',
		ageAtOnset: 19,
		yearsSinceDiagnosis: 5,
		learningDisability: 'yes'
	};
	d.seizures = {
		seizureTypes: 'Combined focal and generalised.',
		seizureFrequency: '',
		lastSeizureDate: '',
		seizureFreeMonths: null,
		seizureTrend: ''
	};
	d.medication = {
		currentAsms: '',
		asmAdherence: '',
		asmSideEffects: '',
		drugLevel: null
	};
	d.summary = {
		specialistReviewNeeded: '',
		nextReviewDue: '',
		carePlan: '',
		reviewContext:
			'Interim contact only; seizure frequency and medication not yet recorded this visit.'
	};
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'EPR-2026-0001',
		patientName: 'Okafor, Chidi',
		reviewedDate: '2026-06-22',
		data: seizureFreeComplete()
	},
	{
		id: 'EPR-2026-0002',
		patientName: 'Doyle, Aoife',
		reviewedDate: '2026-06-24',
		data: uncontrolledValproate()
	},
	{
		id: 'EPR-2026-0003',
		patientName: 'Nowak, Piotr',
		reviewedDate: '2026-06-24',
		data: controlledPartial()
	},
	{
		id: 'EPR-2026-0004',
		patientName: 'Sato, Kenji',
		reviewedDate: '2026-06-28',
		data: incompleteReview()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = review(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.profile.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		seizureControl: g.seizureControl,
		reviewStatus: g.reviewStatus,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		reviewedDate: s.reviewedDate
	};
});
