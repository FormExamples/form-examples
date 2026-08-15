import type { AssessmentData, UKMECCategory } from '#lib/engine/types.js';
import { gradeContraception } from '#lib/engine/ukmec-grader.js';
import { methodLabels } from '#lib/engine/ukmec-rules.js';
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
	ukmecCategory: UKMECCategory;
	preferredMethod: string;
	preferredMethodCategory: number | null;
	currentMethod: string;
	flagCount: number;
}

/** A UKMEC 1 assessment: healthy young woman, no restrictions. */
function noRestriction(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Emma', lastName: 'Lewis', dateOfBirth: '1998-03-14', sex: 'female' };
	d.reproductiveHistory = { ...d.reproductiveHistory, gravida: 0, para: 0, breastfeeding: 'no' };
	d.menstrualHistory = { ...d.menstrualHistory, cycleLength: 28, cycleDuration: 5, flowHeaviness: 'moderate', dysmenorrhea: 'mild' };
	d.currentContraception = { ...d.currentContraception, currentMethod: 'barrier' };
	d.medicalHistory = { hypertension: 'no', migraineWithAura: 'no', dvtHistory: 'no', breastCancer: 'no', liverDisease: 'no', diabetes: 'no', epilepsy: 'no', hiv: 'no', stiHistory: 'no' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bmi: 23.1, smoking: 'never', bloodPressureSystolic: 118, bloodPressureDiastolic: 74, familyHistoryCVD: 'no', lipidDisorders: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, smokingStatus: 'never', alcoholUse: 'occasional', drugUse: 'none' };
	d.preferencesPriorities = { ...d.preferencesPriorities, preferredMethod: 'combined-oral', efficacyPriority: 'high', conveniencePriority: 'high', hormoneFreePreference: 'no-preference' };
	d.familyPlanningGoals = { ...d.familyPlanningGoals, desireForChildren: 'yes-future', timeframe: '3-5-years', partnerInvolvement: 'involved' };
	return d;
}

/** A UKMEC 2 assessment: mostly safe, controlled hypertension noted. */
function advantagesOutweigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Lisa', lastName: 'Brown', dateOfBirth: '1990-07-22', sex: 'female' };
	d.reproductiveHistory = { ...d.reproductiveHistory, gravida: 2, para: 2, breastfeeding: 'no' };
	d.menstrualHistory = { ...d.menstrualHistory, cycleLength: 30, cycleDuration: 6, flowHeaviness: 'heavy', dysmenorrhea: 'moderate' };
	d.currentContraception = { ...d.currentContraception, currentMethod: 'combined-oral' };
	d.medicalHistory = { hypertension: 'no', migraineWithAura: 'no', dvtHistory: 'no', breastCancer: 'no', liverDisease: 'no', diabetes: 'no', epilepsy: 'no', hiv: 'no', stiHistory: 'no' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bmi: 27.5, smoking: 'former', bloodPressureSystolic: 128, bloodPressureDiastolic: 82, familyHistoryCVD: 'yes', lipidDisorders: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, smokingStatus: 'former', alcoholUse: 'moderate', drugUse: 'none' };
	d.preferencesPriorities = { ...d.preferencesPriorities, preferredMethod: 'lng-ius', efficacyPriority: 'very-high', periodControlPriority: 'high', hormoneFreePreference: 'no-preference' };
	d.breastCervicalScreening = { ...d.breastCervicalScreening, lastCervicalScreening: '2024-09-01', hpvVaccination: 'completed' };
	d.familyPlanningGoals = { ...d.familyPlanningGoals, desireForChildren: 'no', timeframe: 'not-applicable', partnerInvolvement: 'involved' };
	return d;
}

/** A UKMEC 3 assessment: BMI >= 35 and smoker aged >= 35; prefers COC. */
function risksOutweigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Grace', lastName: 'Okafor', dateOfBirth: '1986-11-05', sex: 'female' };
	d.reproductiveHistory = { ...d.reproductiveHistory, gravida: 3, para: 2, breastfeeding: 'no' };
	d.menstrualHistory = { ...d.menstrualHistory, cycleLength: 27, cycleDuration: 5, flowHeaviness: 'moderate', dysmenorrhea: 'mild' };
	d.currentContraception = { ...d.currentContraception, currentMethod: 'combined-oral', reasonForChange: 'Weight gain and BP concerns' };
	d.medicalHistory = { hypertension: 'yes', migraineWithAura: 'no', dvtHistory: 'no', breastCancer: 'no', liverDisease: 'no', diabetes: 'no', epilepsy: 'no', hiv: 'no', stiHistory: 'no' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bmi: 37.4, smoking: 'current-light', bloodPressureSystolic: 148, bloodPressureDiastolic: 92, familyHistoryCVD: 'yes', lipidDisorders: 'yes' };
	d.lifestyleFactors = { ...d.lifestyleFactors, smokingStatus: 'current-light', alcoholUse: 'occasional', drugUse: 'none' };
	d.preferencesPriorities = { ...d.preferencesPriorities, preferredMethod: 'combined-oral', efficacyPriority: 'high', conveniencePriority: 'high', hormoneFreePreference: 'no-preference' };
	d.breastCervicalScreening = { ...d.breastCervicalScreening, lastCervicalScreening: '2021-02-01', hpvVaccination: 'none' };
	d.familyPlanningGoals = { ...d.familyPlanningGoals, desireForChildren: 'no', timeframe: 'not-applicable', partnerInvolvement: 'involved' };
	return d;
}

/** A UKMEC 4 assessment: migraine with aura and DVT history; prefers COC. */
function unacceptableRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Sofia', lastName: 'Murray', dateOfBirth: '1982-05-18', sex: 'female' };
	d.reproductiveHistory = { ...d.reproductiveHistory, gravida: 1, para: 1, breastfeeding: 'no' };
	d.menstrualHistory = { ...d.menstrualHistory, cycleLength: 29, cycleDuration: 4, flowHeaviness: 'light', dysmenorrhea: 'none' };
	d.currentContraception = { ...d.currentContraception, currentMethod: 'combined-oral', reasonForChange: 'New migraine with aura' };
	d.medicalHistory = { hypertension: 'no', migraineWithAura: 'yes', dvtHistory: 'yes', breastCancer: 'no', liverDisease: 'no', diabetes: 'no', epilepsy: 'no', hiv: 'no', stiHistory: 'no' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bmi: 26.0, smoking: 'never', bloodPressureSystolic: 124, bloodPressureDiastolic: 78, familyHistoryCVD: 'yes', lipidDisorders: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, smokingStatus: 'never', alcoholUse: 'none', drugUse: 'none' };
	d.preferencesPriorities = { ...d.preferencesPriorities, preferredMethod: 'combined-oral', efficacyPriority: 'high', conveniencePriority: 'moderate', hormoneFreePreference: 'no-preference' };
	d.breastCervicalScreening = { ...d.breastCervicalScreening, lastCervicalScreening: '2025-01-10', hpvVaccination: 'completed' };
	d.familyPlanningGoals = { ...d.familyPlanningGoals, desireForChildren: 'unsure', timeframe: '1-3-years', partnerInvolvement: 'involved' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CN-2026-0001', patientName: 'Lewis, Emma', assessedDate: '2026-06-10', data: noRestriction() },
	{ id: 'CN-2026-0002', patientName: 'Brown, Lisa', assessedDate: '2026-06-12', data: advantagesOutweigh() },
	{ id: 'CN-2026-0003', patientName: 'Okafor, Grace', assessedDate: '2026-06-15', data: risksOutweigh() },
	{ id: 'CN-2026-0004', patientName: 'Murray, Sofia', assessedDate: '2026-06-18', data: unacceptableRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeContraception(s.data);
	const preferred = s.data.preferencesPriorities.preferredMethod;
	const current = s.data.currentContraception.currentMethod;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		ukmecCategory: g.overallHighestCategory,
		preferredMethod: preferred ? (methodLabels[preferred] ?? preferred) : 'None',
		preferredMethodCategory: g.preferredMethodCategory,
		currentMethod: current ? (methodLabels[current] ?? current) : 'None',
		flagCount: g.additionalFlags.length
	};
});
