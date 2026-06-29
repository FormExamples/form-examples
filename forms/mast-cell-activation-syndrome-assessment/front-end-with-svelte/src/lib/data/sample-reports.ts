import type { AssessmentData } from '$lib/engine/types';
import { calculateMCASGrade } from '$lib/engine/symptom-grader';
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
	symptomScore: number;
	mcasCategory: string;
	organSystemsAffected: number;
	tryptaseLevel: number | null;
	tryptaseFlag: boolean;
	anaphylaxisFlag: boolean;
	flagCount: number;
}

/** A minimal-burden assessment: isolated mild symptoms, normal labs. */
function minimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1986-04-12', sex: 'male' };
	d.symptomOverview = { onsetDate: '2025-09-01', symptomDuration: '6 months', symptomFrequency: 'rarely', qualityOfLife: 'mild' };
	d.dermatologicalSymptoms.flushing = { severity: 1, frequency: 'sometimes' };
	d.dermatologicalSymptoms.pruritus = { severity: 1, frequency: 'rarely' };
	d.triggersPatterns = { ...d.triggersPatterns, foodTriggers: 'Aged cheese', stressTriggers: 'yes', exerciseTrigger: 'no', temperatureTrigger: 'no' };
	d.laboratoryResults = { serumTryptase: 6.2, histamine: 0.6, prostaglandinD2: 0.1, chromograninA: null };
	d.currentTreatment = { antihistamines: 'yes', mastCellStabilizers: 'no', leukotrienInhibitors: 'no', epinephrine: 'no' };
	return d;
}

/** A mild-burden assessment: a few moderate symptoms across two systems. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1979-09-30', sex: 'female' };
	d.symptomOverview = { onsetDate: '2024-01-15', symptomDuration: '2 years', symptomFrequency: 'often', qualityOfLife: 'moderate' };
	d.dermatologicalSymptoms.flushing = { severity: 2, frequency: 'often' };
	d.dermatologicalSymptoms.urticaria = { severity: 2, frequency: 'sometimes' };
	d.gastrointestinalSymptoms.abdominalPain = { severity: 2, frequency: 'often' };
	d.gastrointestinalSymptoms.bloating = { severity: 2, frequency: 'daily' };
	d.neurologicalSymptoms.fatigue = { severity: 2, frequency: 'daily' };
	d.triggersPatterns = { ...d.triggersPatterns, foodTriggers: 'Shellfish, alcohol', environmentalTriggers: 'Pollen', stressTriggers: 'yes', exerciseTrigger: 'no', temperatureTrigger: 'yes' };
	d.laboratoryResults = { serumTryptase: 9.8, histamine: 0.9, prostaglandinD2: 0.2, chromograninA: null };
	d.currentTreatment = { antihistamines: 'yes', mastCellStabilizers: 'no', leukotrienInhibitors: 'no', epinephrine: 'no' };
	return d;
}

/** A moderate-burden assessment: several moderate symptoms, elevated tryptase. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Helen', lastName: 'Davies', dateOfBirth: '1968-06-02', sex: 'female' };
	d.symptomOverview = { onsetDate: '2022-03-10', symptomDuration: '4 years', symptomFrequency: 'daily', qualityOfLife: 'moderate' };
	d.dermatologicalSymptoms.flushing = { severity: 2, frequency: 'daily' };
	d.dermatologicalSymptoms.urticaria = { severity: 2, frequency: 'often' };
	d.dermatologicalSymptoms.pruritus = { severity: 2, frequency: 'daily' };
	d.gastrointestinalSymptoms.abdominalPain = { severity: 2, frequency: 'daily' };
	d.gastrointestinalSymptoms.nausea = { severity: 2, frequency: 'often' };
	d.gastrointestinalSymptoms.diarrhea = { severity: 2, frequency: 'often' };
	d.cardiovascularSymptoms.tachycardia = { severity: 2, frequency: 'often' };
	d.respiratorySymptoms.nasalCongestion = { severity: 2, frequency: 'daily' };
	d.neurologicalSymptoms.brainFog = { severity: 2, frequency: 'daily' };
	d.neurologicalSymptoms.fatigue = { severity: 3, frequency: 'daily' };
	d.triggersPatterns = { ...d.triggersPatterns, foodTriggers: 'Histamine-rich foods', environmentalTriggers: 'Heat, fragrance', stressTriggers: 'yes', exerciseTrigger: 'yes', temperatureTrigger: 'yes', medicationTriggers: 'NSAIDs' };
	d.laboratoryResults = { serumTryptase: 15.2, histamine: 1.4, prostaglandinD2: 0.4, chromograninA: 95 };
	d.currentTreatment = { antihistamines: 'yes', mastCellStabilizers: 'yes', leukotrienInhibitors: 'no', epinephrine: 'no' };
	return d;
}

/** A severe-burden assessment: widespread severe symptoms, anaphylaxis risk. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'George', lastName: 'Clark', dateOfBirth: '1959-11-03', sex: 'male' };
	d.symptomOverview = { onsetDate: '2019-05-20', symptomDuration: '7 years', symptomFrequency: 'daily', qualityOfLife: 'severe' };
	d.dermatologicalSymptoms.flushing = { severity: 3, frequency: 'daily' };
	d.dermatologicalSymptoms.urticaria = { severity: 3, frequency: 'daily' };
	d.dermatologicalSymptoms.angioedema = { severity: 2, frequency: 'often' };
	d.dermatologicalSymptoms.pruritus = { severity: 3, frequency: 'daily' };
	d.gastrointestinalSymptoms.abdominalPain = { severity: 3, frequency: 'daily' };
	d.gastrointestinalSymptoms.nausea = { severity: 2, frequency: 'daily' };
	d.gastrointestinalSymptoms.diarrhea = { severity: 3, frequency: 'daily' };
	d.cardiovascularSymptoms.tachycardia = { severity: 3, frequency: 'daily' };
	d.cardiovascularSymptoms.hypotension = { severity: 2, frequency: 'often' };
	d.cardiovascularSymptoms.presyncope = { severity: 2, frequency: 'often' };
	d.cardiovascularSymptoms.syncope = { severity: 2, frequency: 'sometimes' };
	d.respiratorySymptoms.wheezing = { severity: 2, frequency: 'often' };
	d.respiratorySymptoms.dyspnea = { severity: 2, frequency: 'often' };
	d.respiratorySymptoms.throatTightening = { severity: 2, frequency: 'sometimes' };
	d.neurologicalSymptoms.brainFog = { severity: 2, frequency: 'daily' };
	d.neurologicalSymptoms.fatigue = { severity: 3, frequency: 'daily' };
	d.triggersPatterns = { ...d.triggersPatterns, foodTriggers: 'Multiple foods', environmentalTriggers: 'Heat, exercise, fragrance', stressTriggers: 'yes', exerciseTrigger: 'yes', temperatureTrigger: 'yes', medicationTriggers: 'Opioids, NSAIDs, contrast' };
	d.laboratoryResults = { serumTryptase: 28.4, histamine: 2.6, prostaglandinD2: 0.8, chromograninA: 160 };
	d.currentTreatment = { antihistamines: 'yes', mastCellStabilizers: 'yes', leukotrienInhibitors: 'yes', epinephrine: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MCAS-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: minimal() },
	{ id: 'MCAS-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mild() },
	{ id: 'MCAS-2026-0003', patientName: 'Davies, Helen', assessedDate: '2026-06-15', data: moderate() },
	{ id: 'MCAS-2026-0004', patientName: 'Clark, George', assessedDate: '2026-06-18', data: severe() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMCASGrade(s.data);
	const tryptase = s.data.laboratoryResults.serumTryptase;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		symptomScore: g.symptomScore,
		mcasCategory: g.mcasCategory,
		organSystemsAffected: g.organSystemsAffected,
		tryptaseLevel: tryptase,
		tryptaseFlag: tryptase !== null && tryptase > 11.4,
		anaphylaxisFlag: g.additionalFlags.some((f) => f.category === 'Anaphylaxis Risk'),
		flagCount: g.additionalFlags.length
	};
});
