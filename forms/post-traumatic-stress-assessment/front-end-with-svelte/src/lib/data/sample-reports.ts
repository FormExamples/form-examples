import type { AssessmentData, SeverityCategory } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/pcl5-grader';
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
	totalScore: number;
	category: SeverityCategory;
	probableDsm5: boolean;
	clusterB: number;
	clusterC: number;
	clusterD: number;
	clusterE: number;
	flagCount: number;
}

/** Minimal — few, mild symptoms; below clinical concern. */
function minimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1986-04-12',
		sex: 'male'
	};
	d.traumaEvent = {
		eventDescription: 'Road traffic collision (witness), 2024',
		eventDate: '2024-03-02',
		isOngoing: false
	};
	d.clusterBIntrusion = {
		item1RepeatedDisturbingMemories: 1,
		item2RepeatedDisturbingDreams: 0,
		item3FeelingReliving: 0,
		item4FeelingUpsetByReminders: 1,
		item5StrongPhysicalReactions: 0
	};
	d.clusterCAvoidance = {
		item6AvoidingMemoriesThoughtsFeelings: 1,
		item7AvoidingExternalReminders: 0
	};
	d.clusterDNegativeAlterations = {
		item8TroubleRememberingImportantParts: 0,
		item9StrongNegativeBeliefs: 0,
		item10BlamingSelfOrOthers: 0,
		item11StrongNegativeFeelings: 1,
		item12LossOfInterest: 0,
		item13FeelingDistantFromOthers: 0,
		item14TroubleExperiencingPositiveFeelings: 0
	};
	d.clusterEArousalReactivity = {
		item15IrritableOrAggressive: 1,
		item16RecklessOrSelfDestructive: 0,
		item17SuperAlertOrOnGuard: 1,
		item18JumpyOrEasilyStartled: 0,
		item19DifficultyConcentrating: 0,
		item20TroubleSleeping: 1
	};
	return d;
}

/** Mild — sub-threshold symptom burden; monitor and support. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1979-09-30',
		sex: 'female'
	};
	d.traumaEvent = {
		eventDescription: 'Workplace assault, 2023',
		eventDate: '2023-11-18',
		isOngoing: false
	};
	d.clusterBIntrusion = {
		item1RepeatedDisturbingMemories: 2,
		item2RepeatedDisturbingDreams: 1,
		item3FeelingReliving: 1,
		item4FeelingUpsetByReminders: 2,
		item5StrongPhysicalReactions: 1
	};
	d.clusterCAvoidance = {
		item6AvoidingMemoriesThoughtsFeelings: 2,
		item7AvoidingExternalReminders: 2
	};
	d.clusterDNegativeAlterations = {
		item8TroubleRememberingImportantParts: 1,
		item9StrongNegativeBeliefs: 1,
		item10BlamingSelfOrOthers: 1,
		item11StrongNegativeFeelings: 2,
		item12LossOfInterest: 1,
		item13FeelingDistantFromOthers: 1,
		item14TroubleExperiencingPositiveFeelings: 1
	};
	d.clusterEArousalReactivity = {
		item15IrritableOrAggressive: 2,
		item16RecklessOrSelfDestructive: 0,
		item17SuperAlertOrOnGuard: 2,
		item18JumpyOrEasilyStartled: 1,
		item19DifficultyConcentrating: 1,
		item20TroubleSleeping: 2
	};
	return d;
}

/** Moderate — meets the provisional PTSD cut-off and DSM-5 pattern. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1968-01-22',
		sex: 'female'
	};
	d.traumaEvent = {
		eventDescription: 'House fire, 2022',
		eventDate: '2022-08-09',
		isOngoing: false
	};
	d.clusterBIntrusion = {
		item1RepeatedDisturbingMemories: 2,
		item2RepeatedDisturbingDreams: 2,
		item3FeelingReliving: 2,
		item4FeelingUpsetByReminders: 2,
		item5StrongPhysicalReactions: 2
	};
	d.clusterCAvoidance = {
		item6AvoidingMemoriesThoughtsFeelings: 2,
		item7AvoidingExternalReminders: 2
	};
	d.clusterDNegativeAlterations = {
		item8TroubleRememberingImportantParts: 2,
		item9StrongNegativeBeliefs: 2,
		item10BlamingSelfOrOthers: 1,
		item11StrongNegativeFeelings: 2,
		item12LossOfInterest: 1,
		item13FeelingDistantFromOthers: 2,
		item14TroubleExperiencingPositiveFeelings: 1
	};
	d.clusterEArousalReactivity = {
		item15IrritableOrAggressive: 2,
		item16RecklessOrSelfDestructive: 1,
		item17SuperAlertOrOnGuard: 2,
		item18JumpyOrEasilyStartled: 2,
		item19DifficultyConcentrating: 1,
		item20TroubleSleeping: 2
	};
	return d;
}

/** Severe — high symptom burden with safety-critical flags. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1990-11-03',
		sex: 'male'
	};
	d.traumaEvent = {
		eventDescription: 'Combat exposure during deployment, 2019',
		eventDate: '2019-05-21',
		isOngoing: false
	};
	d.clusterBIntrusion = {
		item1RepeatedDisturbingMemories: 4,
		item2RepeatedDisturbingDreams: 3,
		item3FeelingReliving: 4,
		item4FeelingUpsetByReminders: 4,
		item5StrongPhysicalReactions: 3
	};
	d.clusterCAvoidance = {
		item6AvoidingMemoriesThoughtsFeelings: 4,
		item7AvoidingExternalReminders: 4
	};
	d.clusterDNegativeAlterations = {
		item8TroubleRememberingImportantParts: 3,
		item9StrongNegativeBeliefs: 4,
		item10BlamingSelfOrOthers: 3,
		item11StrongNegativeFeelings: 4,
		item12LossOfInterest: 3,
		item13FeelingDistantFromOthers: 4,
		item14TroubleExperiencingPositiveFeelings: 4
	};
	d.clusterEArousalReactivity = {
		item15IrritableOrAggressive: 3,
		item16RecklessOrSelfDestructive: 3,
		item17SuperAlertOrOnGuard: 4,
		item18JumpyOrEasilyStartled: 4,
		item19DifficultyConcentrating: 3,
		item20TroubleSleeping: 4
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PT-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: minimal() },
	{ id: 'PT-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mild() },
	{ id: 'PT-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderate() },
	{ id: 'PT-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severe() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		totalScore: g.totalScore,
		category: g.category,
		probableDsm5: g.probableDsm5Diagnosis,
		clusterB: g.clusterScores.b,
		clusterC: g.clusterScores.c,
		clusterD: g.clusterScores.d,
		clusterE: g.clusterScores.e,
		flagCount: g.additionalFlags.length
	};
});
