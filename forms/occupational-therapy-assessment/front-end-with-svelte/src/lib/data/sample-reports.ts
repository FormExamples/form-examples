import type { AssessmentData } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/copm-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	performanceScore: number;
	satisfactionScore: number;
	performanceCategory: string;
	satisfactionCategory: string;
	primaryDiagnosis: string;
	flagCount: number;
}

/** A good-outcome assessment: high COPM scores, minimal difficulty. */
function goodOutcome(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Elizabeth', lastName: 'Young', dateOfBirth: '1962-03-14', sex: 'female' };
	d.referralInfo = { ...d.referralInfo, referralSource: 'Orthopaedics', referringClinician: 'Mr A Khan', primaryDiagnosis: 'Knee replacement' };
	d.selfCareActivities.personalCare = { difficulty: 'none', details: 'Independent' };
	d.selfCareActivities.functionalMobility = { difficulty: 'some', details: 'Uses a stick outdoors' };
	d.performanceRatings = {
		activity1: { name: 'Climbing stairs', importance: 8, performanceScore: 8 },
		activity2: { name: 'Gardening', importance: 7, performanceScore: 9 },
		activity3: { name: 'Driving', importance: 9, performanceScore: 8 },
		activity4: { name: 'Shopping', importance: 6, performanceScore: 7 },
		activity5: { name: 'Walking the dog', importance: 7, performanceScore: 8 }
	};
	d.satisfactionRatings = {
		activity1: { name: 'Climbing stairs', satisfactionScore: 8 },
		activity2: { name: 'Gardening', satisfactionScore: 8 },
		activity3: { name: 'Driving', satisfactionScore: 9 },
		activity4: { name: 'Shopping', satisfactionScore: 8 },
		activity5: { name: 'Walking the dog', satisfactionScore: 7 }
	};
	d.goalsPriorities = { ...d.goalsPriorities, shortTermGoals: 'Return to independent stair use', longTermGoals: 'Resume rambling group' };
	return d;
}

/** A moderate assessment: mid-range COPM scores, some difficulty. */
function moderateOutcome(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1971-09-30', sex: 'female' };
	d.referralInfo = { ...d.referralInfo, referralSource: 'Rheumatology', referringClinician: 'Dr S Bose', primaryDiagnosis: 'Rheumatoid arthritis' };
	d.selfCareActivities.personalCare = { difficulty: 'some', details: 'Difficulty with fastenings' };
	d.productivityActivities.householdManagement = { difficulty: 'significant', details: 'Cannot manage heavy cleaning' };
	d.performanceRatings = {
		activity1: { name: 'Dressing', importance: 9, performanceScore: 6 },
		activity2: { name: 'Cooking', importance: 8, performanceScore: 7 },
		activity3: { name: 'Cleaning', importance: 6, performanceScore: 5 },
		activity4: { name: 'Knitting', importance: 7, performanceScore: 6 },
		activity5: { name: 'Working', importance: 8, performanceScore: 6 }
	};
	d.satisfactionRatings = {
		activity1: { name: 'Dressing', satisfactionScore: 5 },
		activity2: { name: 'Cooking', satisfactionScore: 6 },
		activity3: { name: 'Cleaning', satisfactionScore: 5 },
		activity4: { name: 'Knitting', satisfactionScore: 6 },
		activity5: { name: 'Working', satisfactionScore: 5 }
	};
	d.physicalCognitiveStatus = { ...d.physicalCognitiveStatus, pain: 'Moderate joint pain', upperExtremity: 'Reduced grip strength' };
	d.goalsPriorities = { ...d.goalsPriorities, shortTermGoals: 'Joint protection techniques', priorityAreas: 'Household management' };
	return d;
}

/** A significant-issue assessment: very low COPM scores, several safety flags. */
function significantOutcome(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female' };
	d.referralInfo = { ...d.referralInfo, referralSource: 'Stroke unit', referringClinician: 'Dr L Owen', primaryDiagnosis: 'Stroke - left hemiplegia' };
	d.selfCareActivities.personalCare = { difficulty: 'unable', details: 'Requires full assistance' };
	d.selfCareActivities.functionalMobility = { difficulty: 'unable', details: 'Hoist transfers' };
	d.leisureActivities.socialParticipation = { difficulty: 'unable', details: 'Housebound' };
	d.performanceRatings = {
		activity1: { name: 'Washing', importance: 10, performanceScore: 2 },
		activity2: { name: 'Dressing', importance: 9, performanceScore: 3 },
		activity3: { name: 'Transfers', importance: 10, performanceScore: 2 },
		activity4: { name: 'Eating', importance: 9, performanceScore: 1 },
		activity5: { name: 'Visiting family', importance: 8, performanceScore: 2 }
	};
	d.satisfactionRatings = {
		activity1: { name: 'Washing', satisfactionScore: 2 },
		activity2: { name: 'Dressing', satisfactionScore: 1 },
		activity3: { name: 'Transfers', satisfactionScore: 2 },
		activity4: { name: 'Eating', satisfactionScore: 2 },
		activity5: { name: 'Visiting family', satisfactionScore: 1 }
	};
	d.environmentalFactors = { ...d.environmentalFactors, homeEnvironment: 'Stairs are a barrier; trip hazards present', socialSupport: 'Limited - spouse only' };
	d.physicalCognitiveStatus = { ...d.physicalCognitiveStatus, lowerExtremity: 'Marked weakness', coordination: 'Poor', cognition: 'Mild impairment' };
	d.goalsPriorities = { ...d.goalsPriorities, shortTermGoals: 'Assisted sitting balance', longTermGoals: 'Supported transfers', dischargeGoals: 'Safe home environment' };
	return d;
}

/** A low-moderate assessment: chronic fatigue and pain limiting performance. */
function fatigueOutcome(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1979-11-03', sex: 'male' };
	d.referralInfo = { ...d.referralInfo, referralSource: 'Neurology', referringClinician: 'Dr P Hart', primaryDiagnosis: 'Multiple sclerosis' };
	d.selfCareActivities.personalCare = { difficulty: 'some', details: 'Slow, needs rest breaks' };
	d.productivityActivities.paidWork = { difficulty: 'unable', details: 'On long-term sick leave' };
	d.performanceRatings = {
		activity1: { name: 'Working at a desk', importance: 9, performanceScore: 4 },
		activity2: { name: 'Cooking a meal', importance: 8, performanceScore: 3 },
		activity3: { name: 'Showering', importance: 9, performanceScore: 5 },
		activity4: { name: 'Childcare', importance: 10, performanceScore: 4 },
		activity5: { name: 'Cycling', importance: 6, performanceScore: 3 }
	};
	d.satisfactionRatings = {
		activity1: { name: 'Working at a desk', satisfactionScore: 3 },
		activity2: { name: 'Cooking a meal', satisfactionScore: 4 },
		activity3: { name: 'Showering', satisfactionScore: 3 },
		activity4: { name: 'Childcare', satisfactionScore: 2 },
		activity5: { name: 'Cycling', satisfactionScore: 3 }
	};
	d.physicalCognitiveStatus = { ...d.physicalCognitiveStatus, fatigue: 'Severe daily fatigue', pain: 'Moderate neuropathic pain', vision: 'Intermittent blurring' };
	d.goalsPriorities = { ...d.goalsPriorities, shortTermGoals: 'Energy conservation plan', priorityAreas: 'Fatigue management and return to work' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OT-2026-0001', patientName: 'Young, Elizabeth', assessedDate: '2026-06-10', data: goodOutcome() },
	{ id: 'OT-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateOutcome() },
	{ id: 'OT-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: significantOutcome() },
	{ id: 'OT-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: fatigueOutcome() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		performanceScore: g.performanceScore,
		satisfactionScore: g.satisfactionScore,
		performanceCategory: g.performanceCategory,
		satisfactionCategory: g.satisfactionCategory,
		primaryDiagnosis: s.data.referralInfo.primaryDiagnosis,
		flagCount: g.additionalFlags.length
	};
});
