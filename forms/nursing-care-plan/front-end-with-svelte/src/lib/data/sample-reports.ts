import type { CarePlan, CareSetting, PlanStatus, PlanType, Problem } from '$lib/engine/types';
import { gradeCarePlan } from '$lib/engine/nursing-care-plan-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample care plan: an identifier and the full data the engine grades. */
export interface SampleCarePlan {
	id: string;
	patientName: string;
	authoredDate: string;
	data: CarePlan;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	authoredDate: string;
	planType: PlanType;
	careSetting: CareSetting;
	problemCount: number;
	completenessPercent: number;
	status: PlanStatus;
	flagCount: number;
}

/** Build a fully-specified problem literal (stable ids for seeding). */
function problem(over: Partial<Problem> & { id: string }): Problem {
	return {
		problemStatement: '',
		adlCategory: '',
		actualOrPotential: '',
		assessmentData: '',
		linkedRisk: 'none',
		goals: [],
		interventions: [],
		evaluationNote: '',
		goalMet: '',
		nextReviewDate: '',
		...over
	};
}

/** Complete — an admission plan, every problem fully worked through ADPIE. */
function completePlan(): CarePlan {
	const d = createDefaultAssessment();
	d.planContext = {
		nurseName: 'Sarah Okoro',
		nurseRole: 'registered-nurse',
		nmcNumber: '12A3456B',
		authoredAt: '2026-06-22T09:30',
		careSetting: 'hospital-ward',
		planType: 'admission',
		modelUsed: 'Roper–Logan–Tierney'
	};
	d.patient = {
		patientIdentifier: 'MRN-448210',
		patientName: 'Beatrice Okafor',
		dateOfBirth: '1948-03-11',
		sex: 'female',
		wardLocation: 'Ward 12, Bay 3'
	};
	d.fallsRisk = { done: 'yes', level: 'medium', assessedOn: '2026-06-22', actioned: 'yes' };
	d.pressureUlcerRisk = { done: 'yes', level: 'low', assessedOn: '2026-06-22', actioned: 'yes' };
	d.problems = [
		problem({
			id: 'p-c1',
			problemStatement: 'Risk of falls due to unsteady gait',
			adlCategory: 'mobilising',
			actualOrPotential: 'potential',
			assessmentData: 'Unsteady on standing; uses a frame at home.',
			linkedRisk: 'falls',
			goals: [
				{
					id: 'g-c1',
					goalText: 'Mobilise 10 m with a frame twice daily by 30 Jun',
					targetDate: '2026-06-30',
					met: 'partially-met'
				}
			],
			interventions: [
				{
					id: 'i-c1',
					interventionText: 'Assist with supervised mobilisation twice daily using a frame',
					carriedOut: 'yes'
				}
			],
			evaluationNote: 'Mobilising with supervision; steadier over 48 h.',
			goalMet: 'partially-met',
			nextReviewDate: '2026-06-30'
		}),
		problem({
			id: 'p-c2',
			problemStatement: 'Reduced oral intake',
			adlCategory: 'eating-drinking',
			actualOrPotential: 'actual',
			assessmentData: 'Eating half of meals; MUST score 1.',
			linkedRisk: 'nutrition',
			goals: [
				{ id: 'g-c2', goalText: 'Meet 75% of nutritional target daily', targetDate: '2026-06-29', met: 'met' }
			],
			interventions: [
				{ id: 'i-c2', interventionText: 'Offer fortified diet and record food chart', carriedOut: 'yes' }
			],
			evaluationNote: 'Intake improved to 80% of target.',
			goalMet: 'met',
			nextReviewDate: '2026-06-29'
		})
	];
	d.summary = {
		handoverNote: 'All problems worked through the nursing process; review at 30 Jun.',
		reviewDate: '2026-06-30'
	};
	return d;
}

/** Partial — an ongoing plan; one problem complete, one goal-only. */
function partialPlan(): CarePlan {
	const d = createDefaultAssessment();
	d.planContext = {
		nurseName: 'Tom Blake',
		nurseRole: 'nursing-associate',
		nmcNumber: '',
		authoredAt: '2026-06-23T14:10',
		careSetting: 'community',
		planType: 'ongoing',
		modelUsed: 'Roper–Logan–Tierney'
	};
	d.patient = {
		patientIdentifier: 'MRN-551903',
		patientName: 'Harold Whitfield',
		dateOfBirth: '1955-11-02',
		sex: 'male',
		wardLocation: 'Community — home visit'
	};
	d.pressureUlcerRisk = { done: 'yes', level: 'medium', assessedOn: '2026-06-20', actioned: 'yes' };
	d.problems = [
		problem({
			id: 'p-p1',
			problemStatement: 'Grade 2 sacral pressure ulcer',
			adlCategory: 'personal-cleansing-dressing',
			actualOrPotential: 'actual',
			assessmentData: 'Grade 2 sacral ulcer noted on district visit.',
			linkedRisk: 'pressure-ulcer',
			goals: [
				{ id: 'g-p1', goalText: 'Ulcer shows signs of healing by 07 Jul', targetDate: '2026-07-07', met: 'partially-met' }
			],
			interventions: [
				{ id: 'i-p1', interventionText: 'Dress with hydrocolloid; reposition 2-hourly', carriedOut: 'yes' }
			],
			evaluationNote: 'Wound bed clean; no deterioration.',
			goalMet: 'partially-met',
			nextReviewDate: '2026-07-07'
		}),
		problem({
			id: 'p-p2',
			problemStatement: 'Difficulty sleeping',
			adlCategory: 'sleeping',
			actualOrPotential: 'actual',
			assessmentData: 'Reports waking frequently overnight.',
			linkedRisk: 'none',
			goals: [{ id: 'g-p2', goalText: 'Sleeps 6 hours per night', targetDate: '2026-07-10', met: '' }],
			interventions: [],
			evaluationNote: '',
			goalMet: '',
			nextReviewDate: '2026-07-10'
		})
	];
	d.summary = { handoverNote: 'Sleep problem needs interventions and evaluation at next visit.', reviewDate: '2026-07-07' };
	return d;
}

/** Incomplete — a new admission with problems recorded but not yet worked up. */
function incompletePlan(): CarePlan {
	const d = createDefaultAssessment();
	d.planContext = {
		nurseName: 'Aoife Byrne',
		nurseRole: 'student-nurse',
		nmcNumber: '',
		authoredAt: '2026-06-24T08:05',
		careSetting: 'hospital-ward',
		planType: 'admission',
		modelUsed: 'Roper–Logan–Tierney'
	};
	d.patient = {
		patientIdentifier: 'MRN-100442',
		patientName: 'Irena Nowak',
		dateOfBirth: '1970-07-19',
		sex: 'female',
		wardLocation: 'Ward 4, Bay 1'
	};
	d.problems = [
		problem({
			id: 'p-i1',
			problemStatement: 'Acute confusion on admission',
			adlCategory: 'communication',
			actualOrPotential: 'actual',
			assessmentData: 'Disoriented to time and place.',
			linkedRisk: 'none'
		}),
		problem({
			id: 'p-i2',
			problemStatement: 'Pain on movement',
			adlCategory: 'mobilising',
			actualOrPotential: 'actual',
			assessmentData: 'Reports 6/10 pain on transfer.',
			linkedRisk: 'none'
		})
	];
	d.summary = { handoverNote: 'Problems identified on admission; goals and interventions to follow.', reviewDate: '' };
	return d;
}

/** Partial with a high flag — high falls risk not actioned, no linked intervention. */
function highFlagPlan(): CarePlan {
	const d = createDefaultAssessment();
	d.planContext = {
		nurseName: 'Yusuf Ahmed',
		nurseRole: 'registered-nurse',
		nmcNumber: '55C7788D',
		authoredAt: '2026-06-25T11:45',
		careSetting: 'care-home',
		planType: 'ongoing',
		modelUsed: 'Roper–Logan–Tierney'
	};
	d.patient = {
		patientIdentifier: 'MRN-204981',
		patientName: 'Doris Campbell',
		dateOfBirth: '1939-01-27',
		sex: 'female',
		wardLocation: 'Room 7'
	};
	d.fallsRisk = { done: 'yes', level: 'high', assessedOn: '2026-06-25', actioned: 'no' };
	d.problems = [
		problem({
			id: 'p-h1',
			problemStatement: 'Impaired skin integrity — heels',
			adlCategory: 'personal-cleansing-dressing',
			actualOrPotential: 'potential',
			assessmentData: 'Waterlow 18; reddened heels.',
			linkedRisk: 'pressure-ulcer',
			goals: [{ id: 'g-h1', goalText: 'Heels remain intact', targetDate: '2026-07-02', met: 'met' }],
			interventions: [{ id: 'i-h1', interventionText: 'Heel offloading and repositioning chart', carriedOut: 'yes' }],
			evaluationNote: 'Heels intact; no breakdown.',
			goalMet: 'met',
			nextReviewDate: '2026-07-02'
		})
	];
	d.summary = { handoverNote: 'High falls risk not yet actioned — escalate for falls-prevention measures.', reviewDate: '2026-07-02' };
	return d;
}

/** The sample care plans, keyed by stable id (used to seed the wizard). */
export const sampleCarePlans: SampleCarePlan[] = [
	{ id: 'NCP-2026-0001', patientName: 'Okafor, Beatrice', authoredDate: '2026-06-22', data: completePlan() },
	{ id: 'NCP-2026-0002', patientName: 'Whitfield, Harold', authoredDate: '2026-06-23', data: partialPlan() },
	{ id: 'NCP-2026-0003', patientName: 'Nowak, Irena', authoredDate: '2026-06-24', data: incompletePlan() },
	{ id: 'NCP-2026-0004', patientName: 'Campbell, Doris', authoredDate: '2026-06-25', data: highFlagPlan() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCarePlanRows: DashboardRow[] = sampleCarePlans.map((s) => {
	const g = gradeCarePlan(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.patient.patientIdentifier,
		patientName: s.patientName,
		authoredDate: s.authoredDate,
		planType: s.data.planContext.planType,
		careSetting: s.data.planContext.careSetting,
		problemCount: s.data.problems.length,
		completenessPercent: g.completenessPercent,
		status: g.status,
		flagCount: g.flags.length
	};
});
