import type { AssessmentData, CamVariant, Classification, MotoricSubtype } from '#lib/engine/types.js';
import { calculateCamGrade } from '#lib/engine/cam-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	patientIdentifier: string;
	patientName: string;
	wardUnit: string;
	camVariant: CamVariant;
	classification: Classification;
	motoricSubtype: MotoricSubtype;
	deliriumFlag: boolean;
	positiveCount: number;
	flagCount: number;
	assessedDate: string;
}

/** Delirium present — standard CAM, hypoactive subtype (features 1, 2, 3). */
function presentHypoactive(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Staff Nurse J. Okoro',
		assessorRole: 'nurse',
		assessedAt: '2026-06-24T09:30',
		wardUnit: 'Care of the Elderly, Ward 12',
		camVariant: 'cam'
	};
	d.identification = {
		patientIdentifier: 'MRN-482201',
		ageBand: '75-plus',
		sex: 'female',
		cognitiveBaseline: 'independent',
		collateralSource: 'family'
	};
	d.feature1 = { acuteOnsetFluctuating: 'present', onsetTiming: 'days' };
	d.feature2 = { inattention: 'present', attentionTest: 'months-backwards' };
	d.feature3 = { disorganisedThinking: 'present' };
	d.feature4 = { alteredConsciousness: 'present', consciousnessLevel: 'lethargic', rassScore: null };
	d.observations = {
		motoricSubtype: 'hypoactive',
		hallucinations: false,
		delusions: false,
		sleepWakeDisturbance: true,
		deliriogenicMedication: true,
		deliriogenicMedicationDetail: 'Oxycodone started for hip pain 48h ago.'
	};
	d.result = {
		suspectedPrecipitants: 'Opioid analgesia, dehydration, constipation.',
		recommendedActions: 'PINCH ME screen; medication review; hydration and mobilisation.',
		clinicalNote: 'Quiet and withdrawn on the round; missed at earlier observations.'
	};
	return d;
}

/** Delirium absent — standard CAM, negative screen (only feature 1). */
function absentScreen(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr I. Mackenzie',
		assessorRole: 'doctor',
		assessedAt: '2026-06-25T14:10',
		wardUnit: 'Orthogeriatrics, Ward 7',
		camVariant: 'cam'
	};
	d.identification = {
		patientIdentifier: 'MRN-573110',
		ageBand: '60-74',
		sex: 'male',
		cognitiveBaseline: 'independent',
		collateralSource: 'nurse'
	};
	d.feature1 = { acuteOnsetFluctuating: 'present', onsetTiming: 'hours' };
	d.feature2 = { inattention: 'absent', attentionTest: 'digit-span' };
	d.feature3 = { disorganisedThinking: 'absent' };
	d.feature4 = { alteredConsciousness: 'absent', consciousnessLevel: 'alert', rassScore: null };
	d.observations = {
		motoricSubtype: 'normal',
		hallucinations: false,
		delusions: false,
		sleepWakeDisturbance: false,
		deliriogenicMedication: false,
		deliriogenicMedicationDetail: ''
	};
	d.result = {
		suspectedPrecipitants: '',
		recommendedActions: 'Continue routine care; re-screen each shift.',
		clinicalNote: 'Brief drowsiness post-op, now fully alert and attentive.'
	};
	return d;
}

/** Unable to assess — CAM-ICU, unrousable (RASS -4). */
function unableToAssessIcu(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr Z. Nowak',
		assessorRole: 'liaison-psychiatrist',
		assessedAt: '2026-06-26T07:45',
		wardUnit: 'Intensive Care Unit',
		camVariant: 'cam-icu'
	};
	d.identification = {
		patientIdentifier: 'ICU-100517',
		ageBand: '60-74',
		sex: 'female',
		cognitiveBaseline: 'unknown',
		collateralSource: 'notes'
	};
	d.feature1 = { acuteOnsetFluctuating: 'present', onsetTiming: 'unknown' };
	d.feature2 = { inattention: '', attentionTest: 'not-completable' };
	d.feature3 = { disorganisedThinking: '' };
	d.feature4 = { alteredConsciousness: 'present', consciousnessLevel: 'coma', rassScore: -4 };
	d.observations = {
		motoricSubtype: '',
		hallucinations: false,
		delusions: false,
		sleepWakeDisturbance: false,
		deliriogenicMedication: true,
		deliriogenicMedicationDetail: 'Sedation infusion (propofol) running.'
	};
	d.result = {
		suspectedPrecipitants: '',
		recommendedActions: 'Re-assess when sedation lightened and arousal improves.',
		clinicalNote: 'Deeply sedated; CAM-ICU arousal gate reached.'
	};
	return d;
}

/** Delirium present — CAM-ICU, hyperactive subtype (features 1, 2, 4). */
function presentIcuHyperactive(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr B. Ahmed',
		assessorRole: 'doctor',
		assessedAt: '2026-06-26T21:15',
		wardUnit: 'Intensive Care Unit',
		camVariant: 'cam-icu'
	};
	d.identification = {
		patientIdentifier: 'ICU-880204',
		ageBand: '40-59',
		sex: 'male',
		cognitiveBaseline: 'independent',
		collateralSource: 'nurse'
	};
	d.feature1 = { acuteOnsetFluctuating: 'present', onsetTiming: 'hours' };
	d.feature2 = { inattention: 'present', attentionTest: 'attention-screening-examination' };
	d.feature3 = { disorganisedThinking: 'absent' };
	d.feature4 = { alteredConsciousness: 'present', consciousnessLevel: 'vigilant', rassScore: 2 };
	d.observations = {
		motoricSubtype: 'hyperactive',
		hallucinations: true,
		delusions: true,
		sleepWakeDisturbance: true,
		deliriogenicMedication: false,
		deliriogenicMedicationDetail: ''
	};
	d.result = {
		suspectedPrecipitants: 'Sepsis, sleep disruption.',
		recommendedActions: 'Non-pharmacological measures; treat sepsis; review sedation.',
		clinicalNote: 'Agitated, pulling at lines; one-to-one nursing in place.'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CAM-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: presentHypoactive() },
	{ id: 'CAM-2026-0002', patientName: 'Mackenzie, Ian', assessedDate: '2026-06-25', data: absentScreen() },
	{ id: 'CAM-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: unableToAssessIcu() },
	{
		id: 'CAM-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: presentIcuHyperactive()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCamGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		wardUnit: s.data.context.wardUnit,
		camVariant: s.data.context.camVariant,
		classification: g.classification,
		motoricSubtype: g.motoricSubtype,
		deliriumFlag: g.classification === 'present',
		positiveCount: g.positiveFeatures.length,
		flagCount: g.flaggedIssues.length,
		assessedDate: s.assessedDate
	};
});
