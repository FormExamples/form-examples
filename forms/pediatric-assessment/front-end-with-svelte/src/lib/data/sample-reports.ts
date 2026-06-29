import type { AssessmentData, OverallResult } from '$lib/engine/types';
import { calculatePediatricGrade } from '$lib/engine/dev-grader';
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
	overallResult: OverallResult;
	immunizationUpToDate: boolean;
	growthFlag: boolean;
	allergyFlag: boolean;
	flagCount: number;
}

/** A normal screen: milestones on track, well-grown, fully immunised. */
function normal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		childFirstName: 'Emma',
		childLastName: 'Smith',
		dateOfBirth: '2024-12-01',
		sex: 'female',
		parentGuardianName: 'Sarah Smith'
	};
	d.birthHistory = { ...d.birthHistory, gestationalAge: 40, apgarFiveMinutes: 9, nicuStay: 'no' };
	d.growthNutrition = {
		...d.growthNutrition,
		weightPercentile: 55,
		heightPercentile: 60,
		headCircumferencePercentile: 50,
		feedingType: 'breast',
		failureToThrive: 'no'
	};
	d.developmentalMilestones = {
		...d.developmentalMilestones,
		grossMotor: 'pass',
		fineMotor: 'pass',
		language: 'pass',
		socialEmotional: 'pass',
		cognitive: 'pass'
	};
	d.immunizationStatus = { ...d.immunizationStatus, upToDate: 'yes', adverseReactions: 'no' };
	return d;
}

/** A developmental concern: one domain flagged as a concern. */
function concern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		childFirstName: 'Arjun',
		childLastName: 'Patel',
		dateOfBirth: '2024-06-15',
		sex: 'male',
		parentGuardianName: 'Priya Patel'
	};
	d.birthHistory = { ...d.birthHistory, gestationalAge: 36, apgarFiveMinutes: 8, nicuStay: 'no' };
	d.growthNutrition = {
		...d.growthNutrition,
		weightPercentile: 30,
		heightPercentile: 35,
		headCircumferencePercentile: 40,
		feedingType: 'mixed',
		failureToThrive: 'no'
	};
	d.developmentalMilestones = {
		...d.developmentalMilestones,
		grossMotor: 'pass',
		fineMotor: 'pass',
		language: 'concern',
		languageNotes: 'Fewer than expected words for age',
		socialEmotional: 'pass',
		cognitive: 'pass'
	};
	d.immunizationStatus = { ...d.immunizationStatus, upToDate: 'yes', adverseReactions: 'no' };
	d.socialEnvironmental = { ...d.socialEnvironmental, screenTimeHoursPerDay: 5 };
	return d;
}

/** A developmental delay: a failed domain, growth concern, missed vaccines. */
function delay(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		childFirstName: 'Oliver',
		childLastName: 'Jones',
		dateOfBirth: '2023-06-10',
		sex: 'male',
		parentGuardianName: 'Margaret Jones'
	};
	d.birthHistory = {
		...d.birthHistory,
		gestationalAge: 30,
		apgarFiveMinutes: 6,
		nicuStay: 'yes',
		nicuDuration: 21,
		birthComplications: 'yes',
		birthComplicationDetails: 'Respiratory distress'
	};
	d.growthNutrition = {
		...d.growthNutrition,
		weightPercentile: 2,
		heightPercentile: 5,
		headCircumferencePercentile: 8,
		feedingType: 'solid',
		failureToThrive: 'no'
	};
	d.developmentalMilestones = {
		...d.developmentalMilestones,
		grossMotor: 'fail',
		grossMotorNotes: 'Not yet walking at 36 months',
		fineMotor: 'concern',
		language: 'fail',
		languageNotes: 'No two-word phrases',
		socialEmotional: 'concern',
		cognitive: 'concern'
	};
	d.immunizationStatus = {
		...d.immunizationStatus,
		upToDate: 'no',
		missingVaccinations: 'MMR'
	};
	return d;
}

/** A severe delay with safeguarding and allergy alerts. */
function severeDelay(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		childFirstName: 'Liam',
		childLastName: 'Brown',
		dateOfBirth: '2022-06-05',
		sex: 'male',
		parentGuardianName: 'Hannah Brown'
	};
	d.birthHistory = { ...d.birthHistory, gestationalAge: 27, apgarFiveMinutes: 5, nicuStay: 'yes', nicuDuration: 60 };
	d.growthNutrition = {
		...d.growthNutrition,
		weightPercentile: 1,
		heightPercentile: 2,
		headCircumferencePercentile: 1,
		feedingType: 'solid',
		failureToThrive: 'yes'
	};
	d.developmentalMilestones = {
		...d.developmentalMilestones,
		grossMotor: 'fail',
		fineMotor: 'fail',
		language: 'fail',
		socialEmotional: 'fail',
		cognitive: 'fail'
	};
	d.immunizationStatus = {
		...d.immunizationStatus,
		upToDate: 'no',
		missingVaccinations: 'DTP, Polio',
		adverseReactions: 'no'
	};
	d.medicalHistory = {
		...d.medicalHistory,
		chronicConditions: 'yes',
		chronicConditionDetails: 'Epilepsy',
		recurringInfections: 'yes',
		infectionDetails: 'Recurrent chest infections'
	};
	d.currentMedications = {
		...d.currentMedications,
		allergies: [{ allergen: 'Penicillin', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }]
	};
	d.familyHistory = { ...d.familyHistory, geneticConditions: 'yes', geneticConditionDetails: 'Cystic fibrosis', consanguinity: 'yes' };
	d.socialEnvironmental = {
		...d.socialEnvironmental,
		safeguardingConcerns: 'yes',
		safeguardingDetails: 'Neglect concerns raised by health visitor',
		behaviouralConcerns: 'yes',
		behaviouralConcernDetails: 'Marked aggression'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Smith, Emma', assessedDate: '2026-06-10', data: normal() },
	{ id: 'PA-2026-0002', patientName: 'Patel, Arjun', assessedDate: '2026-06-12', data: concern() },
	{ id: 'PA-2026-0003', patientName: 'Jones, Oliver', assessedDate: '2026-06-15', data: delay() },
	{ id: 'PA-2026-0004', patientName: 'Brown, Liam', assessedDate: '2026-06-18', data: severeDelay() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePediatricGrade(s.data);
	const wp = s.data.growthNutrition.weightPercentile;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		overallResult: g.overallResult,
		immunizationUpToDate: s.data.immunizationStatus.upToDate === 'yes',
		growthFlag: s.data.growthNutrition.failureToThrive === 'yes' || (wp !== null && wp < 3),
		allergyFlag: s.data.currentMedications.allergies.length > 0,
		flagCount: g.additionalFlags.length
	};
});
