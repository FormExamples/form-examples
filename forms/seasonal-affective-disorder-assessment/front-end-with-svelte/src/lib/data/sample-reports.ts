import type { AssessmentData, CombinedSeverity, SpaqBand, Phq9Band } from '$lib/engine/types';
import { calculateSadGrade } from '$lib/engine/sad-grader';
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
	spaqScore: number;
	spaqBand: SpaqBand;
	phq9Score: number;
	phq9Band: Phq9Band;
	combinedSeverity: CombinedSeverity;
	riskFlag: boolean;
	flagCount: number;
}

/** A no-SAD assessment: minimal seasonality, no depression, no risk. */
function noSad(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Olivia',
		lastName: 'Bennett',
		dateOfBirth: '1990-03-14',
		sex: 'female',
		latitude: '40.7N',
		country: 'United States',
		yearsAtCurrentLatitude: 10
	};
	d.seasonalPatternHistory = {
		...d.seasonalPatternHistory,
		symptomsRecurAnnually: 'no',
		familyHistorySad: 'no'
	};
	d.currentMood.phq9 = { ...d.currentMood.phq9, q1: 1, q2: 0, q3: 1, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };
	d.sleepEnergy.spaq = { sleepLength: 1, energyLevel: 1 };
	d.appetiteWeight.spaq = { appetite: 0, weight: 1 };
	d.socialOccupational.spaq = { mood: 1, socialActivity: 1 };
	d.lightExposure = { ...d.lightExposure, dailyOutdoorMinutes: 60, workIndoors: 'no', lightTherapyAccess: 'yes' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'no', selfHarm: 'no', previousAttempt: 'no', safetyPlanInPlace: 'yes' };
	return d;
}

/** A mild assessment: subsyndromal seasonality + mild depression. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Daniel',
		lastName: 'Foster',
		dateOfBirth: '1985-11-02',
		sex: 'male',
		latitude: '47.6N',
		country: 'United States',
		yearsAtCurrentLatitude: 6
	};
	d.seasonalPatternHistory = {
		...d.seasonalPatternHistory,
		symptomsRecurAnnually: 'yes',
		worstMonths: 'Nov-Jan',
		bestMonths: 'May-Aug',
		yearsAffected: 3,
		familyHistorySad: 'no'
	};
	d.currentMood.phq9 = { ...d.currentMood.phq9, q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0, q7: 1, q8: 0, q9: 0 };
	d.currentMood.difficultyLevel = 'somewhat';
	d.sleepEnergy.spaq = { sleepLength: 2, energyLevel: 2 };
	d.appetiteWeight.spaq = { appetite: 1, weight: 1 };
	d.socialOccupational.spaq = { mood: 2, socialActivity: 1 };
	d.lightExposure = { ...d.lightExposure, dailyOutdoorMinutes: 25, workIndoors: 'yes', lightTherapyAccess: 'yes' };
	d.appetiteWeight.carbohydrateCraving = 'yes';
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'no', selfHarm: 'no', previousAttempt: 'no', safetyPlanInPlace: 'yes' };
	return d;
}

/** A moderate assessment: SAD likely, moderate depression, no acute risk. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Sophie',
		lastName: 'Larsen',
		dateOfBirth: '1978-07-21',
		sex: 'female',
		latitude: '55.7N',
		country: 'Denmark',
		yearsAtCurrentLatitude: 20
	};
	d.seasonalPatternHistory = {
		...d.seasonalPatternHistory,
		symptomsRecurAnnually: 'yes',
		worstMonths: 'Oct-Feb',
		bestMonths: 'Jun-Aug',
		yearsAffected: 8,
		familyHistorySad: 'yes',
		firstOnsetAge: '28'
	};
	d.currentMood.phq9 = { ...d.currentMood.phq9, q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 1, q7: 1, q8: 1, q9: 0 };
	d.currentMood.difficultyLevel = 'very';
	d.sleepEnergy.spaq = { sleepLength: 3, energyLevel: 3 };
	d.sleepEnergy = { ...d.sleepEnergy, spaq: d.sleepEnergy.spaq, hypersomnia: 'yes', morningFatigue: 'yes' };
	d.appetiteWeight.spaq = { appetite: 2, weight: 2 };
	d.appetiteWeight.carbohydrateCraving = 'yes';
	d.socialOccupational.spaq = { mood: 3, socialActivity: 3 };
	d.socialOccupational = { ...d.socialOccupational, spaq: d.socialOccupational.spaq, workImpaired: 'yes', socialWithdrawal: 'yes' };
	d.lightExposure = { ...d.lightExposure, dailyOutdoorMinutes: 15, workIndoors: 'yes', curtainsClosedDaytime: 'yes', lightTherapyAccess: 'no' };
	d.previousTreatments = { ...d.previousTreatments, currentTreatment: 'no' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'no', selfHarm: 'no', previousAttempt: 'no', safetyPlanInPlace: 'yes' };
	return d;
}

/** A critical assessment: SAD likely, severe depression, active risk. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Markus',
		lastName: 'Eriksson',
		dateOfBirth: '1969-12-09',
		sex: 'male',
		latitude: '63.8N',
		country: 'Sweden',
		yearsAtCurrentLatitude: 30
	};
	d.seasonalPatternHistory = {
		...d.seasonalPatternHistory,
		symptomsRecurAnnually: 'yes',
		worstMonths: 'Nov-Feb',
		bestMonths: 'Jun-Jul',
		yearsAffected: 15,
		familyHistorySad: 'yes',
		firstOnsetAge: '35'
	};
	d.currentMood.phq9 = { ...d.currentMood.phq9, q1: 3, q2: 3, q3: 3, q4: 3, q5: 2, q6: 3, q7: 2, q8: 2, q9: 2 };
	d.currentMood.difficultyLevel = 'extremely';
	d.sleepEnergy.spaq = { sleepLength: 4, energyLevel: 4 };
	d.sleepEnergy = { ...d.sleepEnergy, spaq: d.sleepEnergy.spaq, hypersomnia: 'yes', morningFatigue: 'yes' };
	d.appetiteWeight.spaq = { appetite: 3, weight: 3 };
	d.appetiteWeight.carbohydrateCraving = 'yes';
	d.socialOccupational.spaq = { mood: 4, socialActivity: 4 };
	d.socialOccupational = { ...d.socialOccupational, spaq: d.socialOccupational.spaq, workImpaired: 'yes', relationshipsImpaired: 'yes', socialWithdrawal: 'yes' };
	d.lightExposure = { ...d.lightExposure, dailyOutdoorMinutes: 5, workIndoors: 'yes', curtainsClosedDaytime: 'yes', lightTherapyAccess: 'no' };
	d.previousTreatments = { ...d.previousTreatments, antidepressants: 'yes', currentTreatment: 'no' };
	d.riskAssessment = {
		...d.riskAssessment,
		suicidalIdeation: 'yes',
		suicidalIntent: 'no',
		suicidalPlan: '',
		selfHarm: 'no',
		previousAttempt: 'yes',
		safetyPlanInPlace: 'no'
	};
	d.treatmentPlan = { ...d.treatmentPlan, planCrisisReferral: 'yes', planLightTherapy: 'yes', planAntidepressant: 'yes', followUpInterval: '2-weeks' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SAD-2026-0001', patientName: 'Bennett, Olivia', assessedDate: '2026-01-08', data: noSad() },
	{ id: 'SAD-2026-0002', patientName: 'Foster, Daniel', assessedDate: '2026-01-12', data: mild() },
	{ id: 'SAD-2026-0003', patientName: 'Larsen, Sophie', assessedDate: '2026-01-15', data: moderate() },
	{ id: 'SAD-2026-0004', patientName: 'Eriksson, Markus', assessedDate: '2026-01-19', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSadGrade(s.data);
	const risk = s.data.riskAssessment;
	const q9 = s.data.currentMood.phq9.q9;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		spaqScore: g.spaqScore,
		spaqBand: g.spaqBand,
		phq9Score: g.phq9Score,
		phq9Band: g.phq9Band,
		combinedSeverity: g.combinedSeverity,
		riskFlag:
			risk.suicidalIdeation === 'yes' ||
			risk.suicidalIntent === 'yes' ||
			risk.selfHarm === 'yes' ||
			risk.previousAttempt === 'yes' ||
			(typeof q9 === 'number' && q9 >= 1),
		flagCount: g.additionalFlags.length
	};
});
