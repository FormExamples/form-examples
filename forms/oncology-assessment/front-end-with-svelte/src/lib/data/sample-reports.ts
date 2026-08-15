import type { AssessmentData, ECOGGrade } from '#lib/engine/types.js';
import { calculateECOG } from '#lib/engine/ecog-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
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
	patientName: string;
	assessedDate: string;
	ecogGrade: ECOGGrade;
	cancerType: string;
	overallStage: string;
	responseAssessment: string;
	flagCount: number;
}

/** ECOG 0 — fully active: early-stage disease in complete response. */
function ecog0(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Eleanor', lastName: 'Smith', dateOfBirth: '1972-03-18', sex: 'female', weight: 68, height: 165, bmi: 25.0, ecogPerformanceStatus: '0' };
	d.cancerDiagnosis = { ...d.cancerDiagnosis, cancerType: 'breast', primarySite: 'Right breast', histology: 'invasive-ductal-carcinoma', stageT: '1', stageN: '0', stageM: '0', overallStage: 'I', grade: '2', dateOfDiagnosis: '2025-09-10' };
	d.treatmentHistory = { ...d.treatmentHistory, previousSurgery: 'yes', surgeryDetails: 'Wide local excision', previousRadiation: 'yes', radiationDetails: 'Adjuvant whole-breast' };
	d.currentTreatment = { ...d.currentTreatment, responseAssessment: 'complete-response' };
	return d;
}

/** ECOG 1 — restricted strenuous activity: Stage II with mild symptom burden. */
function ecog1(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Rajesh', lastName: 'Patel', dateOfBirth: '1958-11-05', sex: 'male', weight: 74, height: 172, bmi: 25.0, ecogPerformanceStatus: '1' };
	d.cancerDiagnosis = { ...d.cancerDiagnosis, cancerType: 'lung', primarySite: 'Left upper lobe', histology: 'adenocarcinoma', stageT: '2', stageN: '0', stageM: '0', overallStage: 'II', grade: '2', dateOfDiagnosis: '2026-01-20' };
	d.currentTreatment = { ...d.currentTreatment, activeRegimen: 'Carboplatin + pemetrexed', cycleNumber: 2, responseAssessment: 'partial-response' };
	d.symptomAssessment = { ...d.symptomAssessment, painNRS: 3, fatigue: 'moderate', nausea: 'mild', appetite: 'decreased' };
	d.sideEffects = { ...d.sideEffects, anaemia: 'yes' };
	d.laboratoryResults = { ...d.laboratoryResults, haemoglobin: 112, neutrophils: 2.4, platelets: 180 };
	return d;
}

/** ECOG 2 — ambulatory, self-care: Stage III on treatment with moderate toxicity. */
function ecog2(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1951-06-28', sex: 'female', weight: 61, height: 160, bmi: 23.8, ecogPerformanceStatus: '2' };
	d.cancerDiagnosis = { ...d.cancerDiagnosis, cancerType: 'colorectal', primarySite: 'Sigmoid colon', histology: 'adenocarcinoma', stageT: '3', stageN: '2', stageM: '0', overallStage: 'III', grade: '2', dateOfDiagnosis: '2025-12-02' };
	d.treatmentHistory = { ...d.treatmentHistory, previousSurgery: 'yes', surgeryDetails: 'Anterior resection', previousChemotherapy: 'yes', chemotherapyRegimens: 'FOLFOX' };
	d.currentTreatment = { ...d.currentTreatment, activeRegimen: 'FOLFOX', cycleNumber: 6, responseAssessment: 'stable-disease' };
	d.symptomAssessment = { ...d.symptomAssessment, painNRS: 5, fatigue: 'moderate', nausea: 'moderate', appetite: 'decreased', weightChange: 'losing-5-10' };
	d.sideEffects = { ...d.sideEffects, neuropathy: '3', neuropathyDetails: 'Oxaliplatin-induced', anaemia: 'yes' };
	d.laboratoryResults = { ...d.laboratoryResults, haemoglobin: 95, neutrophils: 1.4, platelets: 110 };
	return d;
}

/** ECOG 3 — limited self-care: metastatic disease with progression. */
function ecog3(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1949-02-14', sex: 'male', weight: 58, height: 175, bmi: 18.9, ecogPerformanceStatus: '3' };
	d.cancerDiagnosis = { ...d.cancerDiagnosis, cancerType: 'pancreatic', primarySite: 'Pancreatic head', histology: 'adenocarcinoma', stageT: '4', stageN: '1', stageM: '1', overallStage: 'IV', grade: '3', dateOfDiagnosis: '2025-10-15' };
	d.treatmentHistory = { ...d.treatmentHistory, previousChemotherapy: 'yes', chemotherapyRegimens: 'FOLFIRINOX' };
	d.currentTreatment = { ...d.currentTreatment, activeRegimen: 'Gemcitabine + nab-paclitaxel', cycleNumber: 3, responseAssessment: 'progressive-disease' };
	d.symptomAssessment = { ...d.symptomAssessment, painNRS: 8, fatigue: 'severe', nausea: 'moderate', appetite: 'severely-decreased', weightChange: 'losing-more-10' };
	d.sideEffects = { ...d.sideEffects, neutropenia: 'yes', anaemia: 'yes', organToxicityGrade: '3', organToxicityDetails: 'Hepatic toxicity' };
	d.laboratoryResults = { ...d.laboratoryResults, haemoglobin: 78, neutrophils: 0.8, platelets: 90, albumin: 24, calcium: 2.9 };
	d.psychosocial = { ...d.psychosocial, distressThermometer: 8, anxiety: 'moderate', depression: 'moderate', advanceCarePlanning: 'yes', advanceCareDetails: 'Preferred place of care: home' };
	d.functionalNutritional = { ...d.functionalNutritional, nutritionalStatus: 'malnourished', weightTrajectory: 'decreasing-rapidly' };
	return d;
}

/** ECOG 4 — completely disabled: end-stage disease, palliative care. */
function ecog4(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Catherine', lastName: 'Evans', dateOfBirth: '1944-08-09', sex: 'female', weight: 52, height: 158, bmi: 20.8, ecogPerformanceStatus: '4' };
	d.cancerDiagnosis = { ...d.cancerDiagnosis, cancerType: 'brain', primarySite: 'Frontal lobe', histology: 'glioblastoma', stageT: '4', stageN: 'X', stageM: '1', overallStage: 'IV', grade: '4', dateOfDiagnosis: '2025-08-01' };
	d.currentTreatment = { ...d.currentTreatment, responseAssessment: 'progressive-disease' };
	d.symptomAssessment = { ...d.symptomAssessment, painNRS: 7, fatigue: 'severe', appetite: 'severely-decreased', weightChange: 'losing-more-10' };
	d.laboratoryResults = { ...d.laboratoryResults, haemoglobin: 88, platelets: 45, calcium: 3.0 };
	d.psychosocial = { ...d.psychosocial, distressThermometer: 9, depression: 'severe', advanceCarePlanning: 'yes' };
	d.functionalNutritional = { ...d.functionalNutritional, karnofskyScore: 20, nutritionalStatus: 'malnourished', weightTrajectory: 'decreasing-rapidly' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OA-2026-0001', patientName: 'Smith, Eleanor', assessedDate: '2026-06-10', data: ecog0() },
	{ id: 'OA-2026-0002', patientName: 'Patel, Rajesh', assessedDate: '2026-06-12', data: ecog1() },
	{ id: 'OA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: ecog2() },
	{ id: 'OA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: ecog3() },
	{ id: 'OA-2026-0005', patientName: 'Evans, Catherine', assessedDate: '2026-06-20', data: ecog4() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { ecogGrade } = calculateECOG(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		ecogGrade,
		cancerType: s.data.cancerDiagnosis.cancerType,
		overallStage: s.data.cancerDiagnosis.overallStage,
		responseAssessment: s.data.currentTreatment.responseAssessment,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
