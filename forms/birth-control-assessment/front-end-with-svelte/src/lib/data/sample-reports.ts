import type { AssessmentData, MethodMEC, RiskLevel } from '#lib/engine/types.js';
import { calculateMECGrade } from '#lib/engine/mec-grader.js';
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
	cocMEC: MethodMEC['coc'];
	popMEC: MethodMEC['pop'];
	riskLevel: RiskLevel;
	vteFlag: boolean;
	smokerFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: young, healthy, no contraindications (UK MEC 1). */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Emily', lastName: 'Clarke', dateOfBirth: '2000-03-14', sex: 'female', weight: 62, height: 168, bmi: 22.0 };
	d.menstrualHistory = { ...d.menstrualHistory, cycleRegularity: 'regular', cycleLengthDays: 28, flowHeaviness: 'moderate' };
	d.lifestyleAssessment = { ...d.lifestyleAssessment, smoking: 'never', alcohol: 'within-guidelines', exerciseFrequency: 'regular', sexualActivity: 'yes', numberOfPartners: 'one' };
	d.contraceptivePreferences = { ...d.contraceptivePreferences, preferredMethod: 'coc', hormonalAcceptable: 'yes', dailyPillAcceptable: 'yes', fertilityPlans: 'no-plans' };
	return d;
}

/** A moderate-risk assessment: BMI 30-34 and current smoker under 35 (UK MEC 2). */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Sofia', lastName: 'Martins', dateOfBirth: '1995-07-22', sex: 'female', weight: 88, height: 165, bmi: 32.3 };
	d.menstrualHistory = { ...d.menstrualHistory, cycleRegularity: 'irregular', cycleLengthDays: 35, flowHeaviness: 'heavy' };
	d.medicalHistory = { ...d.medicalHistory, migraine: 'yes', migraineWithAura: 'no', migraineFrequency: 'monthly', breastCancer: 'no', liverDisease: 'no', diabetes: 'no' };
	d.lifestyleAssessment = { ...d.lifestyleAssessment, smoking: 'current', cigarettesPerDay: 8, alcohol: 'within-guidelines', exerciseFrequency: 'occasional', sexualActivity: 'yes', numberOfPartners: 'one' };
	d.contraceptivePreferences = { ...d.contraceptivePreferences, preferredMethod: 'coc', hormonalAcceptable: 'yes', dailyPillAcceptable: 'yes', fertilityPlans: '1-5-years' };
	return d;
}

/** A high-risk assessment: family history of VTE, moderate hypertension (UK MEC 3 for COC). */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Rachel', lastName: 'Okafor', dateOfBirth: '1985-11-09', sex: 'female', weight: 96, height: 162, bmi: 36.6 };
	d.menstrualHistory = { ...d.menstrualHistory, cycleRegularity: 'regular', cycleLengthDays: 30, flowHeaviness: 'heavy' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, hypertension: 'yes', systolicBP: 148, diastolicBP: 94, bpControlled: 'no', familyHistoryVTE: 'yes', familyHistoryCVD: 'yes', familyCVDDetails: 'Mother DVT age 48' };
	d.currentMedications = { ...d.currentMedications, enzymeInducingDrugs: 'yes', enzymeInducingDetails: 'Carbamazepine for epilepsy' };
	d.medicalHistory = { ...d.medicalHistory, epilepsy: 'yes', breastCancer: 'no', liverDisease: 'no', diabetes: 'no' };
	d.lifestyleAssessment = { ...d.lifestyleAssessment, smoking: 'ex-smoker', alcohol: 'within-guidelines', exerciseFrequency: 'occasional', sexualActivity: 'yes', numberOfPartners: 'one' };
	d.contraceptivePreferences = { ...d.contraceptivePreferences, preferredMethod: 'ius', hormonalAcceptable: 'yes', longActingAcceptable: 'yes', intrauterineAcceptable: 'yes', fertilityPlans: 'completed-family' };
	return d;
}

/** A critical assessment: migraine with aura and previous DVT (UK MEC 4 for COC). */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Hannah', lastName: 'Wright', dateOfBirth: '1979-02-18', sex: 'female', weight: 78, height: 160, bmi: 30.5 };
	d.menstrualHistory = { ...d.menstrualHistory, cycleRegularity: 'regular', cycleLengthDays: 28, flowHeaviness: 'heavy', postcoitalBleeding: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, migraine: 'yes', migraineWithAura: 'yes', migraineFrequency: 'weekly', breastCancer: 'no', liverDisease: 'no', diabetes: 'no' };
	d.thromboembolismRisk = { ...d.thromboembolismRisk, previousDVT: 'yes', dvtDetails: 'Left leg DVT 2019 post-surgery', knownThrombophilia: 'yes', thrombophiliaType: 'factor-v-leiden' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, hypertension: 'yes', systolicBP: 164, diastolicBP: 102, bpControlled: 'no' };
	d.lifestyleAssessment = { ...d.lifestyleAssessment, smoking: 'current', cigarettesPerDay: 20, ageOver35Smoker: 'yes', alcohol: 'above-guidelines', alcoholUnitsPerWeek: 18, exerciseFrequency: 'none', sexualActivity: 'yes', numberOfPartners: 'multiple' };
	d.contraceptivePreferences = { ...d.contraceptivePreferences, preferredMethod: 'unsure', hormonalAcceptable: 'no', longActingAcceptable: 'yes', intrauterineAcceptable: 'yes', fertilityPlans: 'completed-family' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BC-2026-0001', patientName: 'Clarke, Emily', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'BC-2026-0002', patientName: 'Martins, Sofia', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'BC-2026-0003', patientName: 'Okafor, Rachel', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'BC-2026-0004', patientName: 'Wright, Hannah', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMECGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		cocMEC: g.methodMEC.coc,
		popMEC: g.methodMEC.pop,
		riskLevel: g.overallRisk,
		vteFlag: s.data.thromboembolismRisk.previousDVT === 'yes' || s.data.thromboembolismRisk.previousPE === 'yes' || s.data.thromboembolismRisk.knownThrombophilia === 'yes',
		smokerFlag: s.data.lifestyleAssessment.smoking === 'current',
		flagCount: g.additionalFlags.length
	};
});
