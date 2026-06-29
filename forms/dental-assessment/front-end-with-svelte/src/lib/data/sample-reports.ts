import type { AssessmentData, DMFTCategory } from '$lib/engine/types';
import { calculateDMFT } from '$lib/engine/dmft-grader';
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
	dmftScore: number;
	dmftCategory: DMFTCategory;
	periodontalStatus: string;
	anticoagulantFlag: boolean;
	flagCount: number;
}

/** Caries-free / very-low: routine check-up, healthy periodontium. */
function cariesFree(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1990-04-12', sex: 'male', emergencyContactName: 'Jane Smith', emergencyContactPhone: '07700 900111' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Routine check-up', painSeverity: 0 };
	d.dentalHistory = { ...d.dentalHistory, visitFrequency: 'every-6-months', brushingFrequency: 'twice-daily', flossingFrequency: 'daily', dentalAnxietyLevel: 'none' };
	d.dmftAssessment = { ...d.dmftAssessment, decayedTeeth: 0, missingTeeth: 0, filledTeeth: 0 };
	d.periodontalAssessment = { ...d.periodontalAssessment, gumBleeding: 'no', pocketDepthsAboveNormal: 'no', gumRecession: 'no', toothMobility: 'no', furcationInvolvement: 'no' };
	d.oralExamination = { ...d.oralExamination, occlusion: 'class-I', oralHygieneIndex: 'good' };
	return d;
}

/** Low DMFT: minor caries, mild gingivitis, otherwise well. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1985-11-03', sex: 'male', emergencyContactName: 'Sarah Williams', emergencyContactPhone: '07700 900222' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Sensitivity to cold', painLocation: 'Upper left', painSeverity: 3, painDuration: '2 weeks' };
	d.dentalHistory = { ...d.dentalHistory, visitFrequency: 'annually', brushingFrequency: 'once-daily', flossingFrequency: 'occasionally', dentalAnxietyLevel: 'mild' };
	d.dmftAssessment = { ...d.dmftAssessment, decayedTeeth: 2, missingTeeth: 1, filledTeeth: 5 };
	d.periodontalAssessment = { ...d.periodontalAssessment, gumBleeding: 'yes', pocketDepthsAboveNormal: 'no', gumRecession: 'no', toothMobility: 'no', furcationInvolvement: 'no' };
	d.oralExamination = { ...d.oralExamination, occlusion: 'class-I', oralHygieneIndex: 'fair' };
	return d;
}

/** Moderate DMFT: several decayed/filled teeth, periodontitis, medical history. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female', emergencyContactName: 'Robert Jones', emergencyContactPhone: '07700 900333' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Gum bleeding and loose tooth', painLocation: 'Lower right', painSeverity: 5, painDuration: '1 month' };
	d.dentalHistory = { ...d.dentalHistory, visitFrequency: 'rarely', brushingFrequency: 'once-daily', flossingFrequency: 'rarely', dentalAnxietyLevel: 'moderate' };
	d.dmftAssessment = { ...d.dmftAssessment, decayedTeeth: 4, missingTeeth: 4, filledTeeth: 6 };
	d.periodontalAssessment = { ...d.periodontalAssessment, gumBleeding: 'yes', pocketDepthsAboveNormal: 'yes', pocketDepthDetails: '5-6mm pockets molars', gumRecession: 'yes', toothMobility: 'yes', mobilityDetails: 'Grade I LR6', furcationInvolvement: 'no' };
	d.oralExamination = { ...d.oralExamination, occlusion: 'class-II', oralHygieneIndex: 'poor' };
	d.medicalHistory = { ...d.medicalHistory, diabetes: 'yes', diabetesType: 'type2', diabetesControlled: 'no', cardiovascularDisease: 'yes', cardiovascularDetails: 'Hypertension' };
	d.radiographicFindings = { ...d.radiographicFindings, boneLossPattern: 'horizontal', boneLossDetails: '30% generalised' };
	return d;
}

/** Very high DMFT: extensive caries, severe periodontitis, multiple alerts. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Sarah', lastName: 'Brown', dateOfBirth: '1949-07-18', sex: 'female', emergencyContactName: 'Michael Brown', emergencyContactPhone: '07700 900444' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Severe pain, multiple teeth', painLocation: 'Generalised', painSeverity: 9, painOnset: 'Sudden', painDuration: '3 days' };
	d.dentalHistory = { ...d.dentalHistory, visitFrequency: 'never', brushingFrequency: 'rarely', flossingFrequency: 'never', dentalAnxietyLevel: 'severe' };
	d.dmftAssessment = { ...d.dmftAssessment, decayedTeeth: 8, missingTeeth: 10, filledTeeth: 4 };
	d.periodontalAssessment = { ...d.periodontalAssessment, gumBleeding: 'yes', pocketDepthsAboveNormal: 'yes', pocketDepthDetails: '7mm+ generalised', gumRecession: 'yes', toothMobility: 'yes', mobilityDetails: 'Grade II-III multiple', furcationInvolvement: 'yes', furcationDetails: 'Grade II molars' };
	d.oralExamination = { ...d.oralExamination, occlusion: 'class-III', oralHygieneIndex: 'poor' };
	d.medicalHistory = { ...d.medicalHistory, bisphosphonateUse: 'yes', bisphosphonateDetails: 'IV zoledronate', radiationTherapyHeadNeck: 'yes', radiationDetails: 'Oropharyngeal 2019', bleedingDisorder: 'no', immunosuppression: 'no' };
	d.currentMedications = { ...d.currentMedications, anticoagulantUse: 'yes', anticoagulantType: 'Warfarin', bisphosphonateCurrentUse: 'yes', bisphosphonateName: 'Zoledronate', allergyToAnaesthetics: 'yes', anaestheticAllergyDetails: 'Articaine — urticaria' };
	d.radiographicFindings = { ...d.radiographicFindings, boneLossPattern: 'combined', boneLossDetails: '>50% generalised, periapical lesions' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'DA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: cariesFree() },
	{ id: 'DA-2026-0002', patientName: 'Williams, David', assessedDate: '2026-06-12', data: lowRisk() },
	{ id: 'DA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateRisk() },
	{ id: 'DA-2026-0004', patientName: 'Brown, Sarah', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Derive a coarse periodontal status label from the periodontal section. */
function periodontalStatus(d: AssessmentData): string {
	const p = d.periodontalAssessment;
	if (p.furcationInvolvement === 'yes' || p.toothMobility === 'yes') return 'Periodontitis';
	if (p.pocketDepthsAboveNormal === 'yes' || p.gumRecession === 'yes') return 'Moderate';
	if (p.gumBleeding === 'yes') return 'Gingivitis';
	return 'Healthy';
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateDMFT(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		dmftScore: g.dmftScore,
		dmftCategory: g.dmftCategory,
		periodontalStatus: periodontalStatus(s.data),
		anticoagulantFlag: s.data.currentMedications.anticoagulantUse === 'yes',
		flagCount: flags.length
	};
});
