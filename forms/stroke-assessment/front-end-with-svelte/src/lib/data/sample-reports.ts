import type { AssessmentData } from '$lib/engine/types';
import { calculateNIHSS } from '$lib/engine/nihss-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
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
	nihssScore: number;
	strokeSeverity: string;
	atrialFibrillationFlag: boolean;
	anticoagulantFlag: boolean;
	flagCount: number;
}

/** A minor stroke: a couple of low-grade deficits. */
function minor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male' };
	d.symptomOnset = { onsetTime: '2026-06-10T08:15', lastKnownWell: '2026-06-10T07:30', symptomProgression: 'sudden', modeOfArrival: 'ambulance' };
	d.levelOfConsciousness = { loc: 0, locQuestions: 0, locCommands: 0 };
	d.bestGazeVisual = { bestGaze: 0, visual: 0 };
	d.facialPalsy = { facialPalsy: 1, leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0 };
	d.limbAtaxiaSensory = { limbAtaxia: 0, sensory: 1 };
	d.languageDysarthria = { bestLanguage: 0, dysarthria: 0 };
	d.extinctionInattention = { extinctionInattention: 0 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', diabetes: 'no', atrialFibrillation: 'no', previousStroke: 'no', smoking: 'no', hyperlipidemia: 'no', familyHistory: 'no' };
	d.currentMedications = { ...d.currentMedications, antiplatelets: 'yes', antiplateletDetails: 'Aspirin 75 mg' };
	return d;
}

/** A moderate stroke with cardioembolic risk factors. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female' };
	d.symptomOnset = { onsetTime: '2026-06-12T06:30', lastKnownWell: '2026-06-12T05:00', symptomProgression: 'sudden', modeOfArrival: 'ambulance' };
	d.levelOfConsciousness = { loc: 1, locQuestions: 0, locCommands: 0 };
	d.bestGazeVisual = { bestGaze: 1, visual: 0 };
	d.facialPalsy = { facialPalsy: 2, leftArm: 0, rightArm: 3, leftLeg: 0, rightLeg: 0 };
	d.limbAtaxiaSensory = { limbAtaxia: 0, sensory: 0 };
	d.languageDysarthria = { bestLanguage: 1, dysarthria: 0 };
	d.extinctionInattention = { extinctionInattention: 0 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', diabetes: 'yes', atrialFibrillation: 'yes', previousStroke: 'no', smoking: 'no', hyperlipidemia: 'yes', familyHistory: 'no' };
	d.currentMedications = { ...d.currentMedications, anticoagulants: 'yes', anticoagulantDetails: 'Apixaban 5 mg BD' };
	return d;
}

/** A moderate-to-severe stroke in a patient with prior stroke. */
function moderateSevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female' };
	d.symptomOnset = { onsetTime: '2026-06-15T23:45', lastKnownWell: '2026-06-15T21:00', symptomProgression: 'sudden', modeOfArrival: 'ambulance' };
	d.levelOfConsciousness = { loc: 2, locQuestions: 2, locCommands: 0 };
	d.bestGazeVisual = { bestGaze: 2, visual: 0 };
	d.facialPalsy = { facialPalsy: 3, leftArm: 0, rightArm: 4, leftLeg: 0, rightLeg: 4 };
	d.limbAtaxiaSensory = { limbAtaxia: 0, sensory: 0 };
	d.languageDysarthria = { bestLanguage: 1, dysarthria: 0 };
	d.extinctionInattention = { extinctionInattention: 0 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', diabetes: 'no', atrialFibrillation: 'no', previousStroke: 'yes', smoking: 'no', hyperlipidemia: 'yes', familyHistory: 'yes' };
	d.currentMedications = { ...d.currentMedications, antiplatelets: 'yes', antiplateletDetails: 'Clopidogrel 75 mg' };
	return d;
}

/** A severe stroke with maximal deficits and an anaphylaxis history. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male' };
	d.symptomOnset = { onsetTime: '2026-06-18T02:00', lastKnownWell: '2026-06-18T01:00', symptomProgression: 'sudden', modeOfArrival: 'ambulance' };
	d.levelOfConsciousness = { loc: 3, locQuestions: 2, locCommands: 2 };
	d.bestGazeVisual = { bestGaze: 2, visual: 3 };
	d.facialPalsy = { facialPalsy: 3, leftArm: 4, rightArm: 4, leftLeg: 4, rightLeg: 4 };
	d.limbAtaxiaSensory = { limbAtaxia: 2, sensory: 2 };
	d.languageDysarthria = { bestLanguage: 3, dysarthria: 2 };
	d.extinctionInattention = { extinctionInattention: 2 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', diabetes: 'yes', atrialFibrillation: 'yes', previousStroke: 'no', smoking: 'yes', hyperlipidemia: 'yes', familyHistory: 'no' };
	d.currentMedications = {
		...d.currentMedications,
		anticoagulants: 'yes',
		anticoagulantDetails: 'Warfarin (INR 2.5)',
		allergies: [{ allergen: 'Iodinated contrast', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }]
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ST-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: minor() },
	{ id: 'ST-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'ST-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateSevere() },
	{ id: 'ST-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severe() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { nihssScore, nihssCategoryLabel } = calculateNIHSS(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		nihssScore,
		strokeSeverity: nihssCategoryLabel,
		atrialFibrillationFlag: s.data.riskFactors.atrialFibrillation === 'yes',
		anticoagulantFlag: s.data.currentMedications.anticoagulants === 'yes',
		flagCount: flags.length
	};
});
