import type { AssessmentData, MRSSeverity, HRTRiskClassification } from '$lib/engine/types';
import { calculateMRS, classifyHRTRisk } from '$lib/engine/mrs-grader';
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
	mrsScore: number;
	severity: MRSSeverity;
	riskClassification: HRTRiskClassification;
	currentHRTFlag: boolean;
	flagCount: number;
}

/** Favourable: mild symptoms, no contraindications or caution factors. */
function favourable(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1972-04-12', sex: 'female', weight: 65, height: 165, bmi: 23.9 };
	d.menopauseStatus = { ...d.menopauseStatus, menopausalStatus: 'peri', ageAtMenopause: null, surgicalMenopause: 'no', prematureOvarianInsufficiency: 'no' };
	d.mrsSymptomScale = { ...d.mrsSymptomScale, hotFlushes: 2, sleepProblems: 2, irritability: 1, fatigue: 1, vaginalDryness: 0 };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, smoking: 'never', diabetes: 'no', qriskScore: 5 };
	d.breastHealth = { ...d.breastHealth, mammogramResult: 'normal', familyHistoryBreastCancer: 'no', familyHistoryOvarianCancer: 'no', brcaStatus: 'not-tested' };
	d.currentMedications = { ...d.currentMedications, currentHRT: 'no', previousHRT: 'no' };
	d.contraindicationsScreen = { ...d.contraindicationsScreen, vteHistory: 'no', breastCancerHistory: 'no', liverDisease: 'no', undiagnosedVaginalBleeding: 'no', pregnancy: 'no', activeCardiovascularDisease: 'no' };
	return d;
}

/** Acceptable: moderate symptoms, one caution factor (family history breast cancer). */
function acceptable(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1965-09-30', sex: 'female', weight: 72, height: 160, bmi: 28.1 };
	d.menopauseStatus = { ...d.menopauseStatus, menopausalStatus: 'post', ageAtMenopause: 52, surgicalMenopause: 'no', prematureOvarianInsufficiency: 'no' };
	d.mrsSymptomScale = { ...d.mrsSymptomScale, hotFlushes: 3, sleepProblems: 2, jointPain: 2, depressiveMood: 2, vaginalDryness: 2 };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, smoking: 'never', diabetes: 'no', qriskScore: 7 };
	d.breastHealth = { ...d.breastHealth, mammogramResult: 'normal', familyHistoryBreastCancer: 'yes', familyHistoryOvarianCancer: 'no', brcaStatus: 'negative' };
	d.currentMedications = { ...d.currentMedications, currentHRT: 'yes', currentHRTDetails: 'Estradiol gel 0.06%', previousHRT: 'no' };
	d.contraindicationsScreen = { ...d.contraindicationsScreen, vteHistory: 'no', breastCancerHistory: 'no', liverDisease: 'no', undiagnosedVaginalBleeding: 'no', pregnancy: 'no', activeCardiovascularDisease: 'no' };
	return d;
}

/** Cautious: severe symptoms, two caution factors (VTE history + high QRISK). */
function cautious(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female', weight: 80, height: 162, bmi: 30.5 };
	d.menopauseStatus = { ...d.menopauseStatus, menopausalStatus: 'post', ageAtMenopause: 50, surgicalMenopause: 'no', prematureOvarianInsufficiency: 'no' };
	d.mrsSymptomScale = { ...d.mrsSymptomScale, hotFlushes: 4, heartDiscomfort: 3, sleepProblems: 3, jointPain: 3, depressiveMood: 3, irritability: 2, anxiety: 2, fatigue: 2 };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, smoking: 'current', diabetes: 'yes', diabetesType: 'type2', qriskScore: 14 };
	d.breastHealth = { ...d.breastHealth, mammogramResult: 'normal', familyHistoryBreastCancer: 'no', familyHistoryOvarianCancer: 'no', brcaStatus: 'not-tested' };
	d.currentMedications = { ...d.currentMedications, currentHRT: 'no', previousHRT: 'yes', previousHRTReason: 'Discontinued due to VTE' };
	d.contraindicationsScreen = { ...d.contraindicationsScreen, vteHistory: 'yes', vteDetails: 'DVT 2019', breastCancerHistory: 'no', liverDisease: 'no', undiagnosedVaginalBleeding: 'no', pregnancy: 'no', activeCardiovascularDisease: 'no' };
	return d;
}

/** Contraindicated: absolute contraindication (breast cancer history). */
function contraindicated(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Elizabeth', lastName: 'Brown', dateOfBirth: '1960-11-03', sex: 'female', weight: 68, height: 158, bmi: 27.2 };
	d.menopauseStatus = { ...d.menopauseStatus, menopausalStatus: 'post', ageAtMenopause: 49, surgicalMenopause: 'no', prematureOvarianInsufficiency: 'no' };
	d.mrsSymptomScale = { ...d.mrsSymptomScale, hotFlushes: 3, sleepProblems: 3, vaginalDryness: 3, bladderProblems: 2 };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, smoking: 'ex', diabetes: 'no', qriskScore: 9 };
	d.breastHealth = { ...d.breastHealth, mammogramResult: 'abnormal', familyHistoryBreastCancer: 'yes', familyHistoryOvarianCancer: 'no', brcaStatus: 'positive', brcaType: 'BRCA1' };
	d.currentMedications = { ...d.currentMedications, currentHRT: 'no', previousHRT: 'yes', previousHRTReason: 'Stopped at cancer diagnosis' };
	d.contraindicationsScreen = { ...d.contraindicationsScreen, vteHistory: 'no', breastCancerHistory: 'yes', breastCancerDetails: 'ER+ ductal carcinoma 2022', liverDisease: 'no', undiagnosedVaginalBleeding: 'no', pregnancy: 'no', activeCardiovascularDisease: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HRT-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-06-10', data: favourable() },
	{ id: 'HRT-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: acceptable() },
	{ id: 'HRT-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: cautious() },
	{ id: 'HRT-2026-0004', patientName: 'Brown, Elizabeth', assessedDate: '2026-06-18', data: contraindicated() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { mrsResult } = calculateMRS(s.data);
	const riskClassification = classifyHRTRisk(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		mrsScore: mrsResult.totalScore,
		severity: mrsResult.severity,
		riskClassification,
		currentHRTFlag: s.data.currentMedications.currentHRT === 'yes',
		flagCount: flags.length
	};
});
