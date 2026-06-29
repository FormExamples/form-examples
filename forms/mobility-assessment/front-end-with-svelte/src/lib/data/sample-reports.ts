import type { AssessmentData } from '$lib/engine/types';
import { gradeMobility } from '$lib/engine/tinetti-grader';
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
	tinettiTotal: number;
	fallRisk: string;
	tugSeconds: number | null;
	fallsLastYear: number | null;
	assistiveDevice: boolean;
	flagCount: number;
}

/** A low-risk assessment: near-perfect Tinetti, brisk TUG, no falls. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1955-04-12', sex: 'male', height: '178 cm', weight: '78 kg' };
	d.referralInfo = { ...d.referralInfo, referringProvider: 'Dr. Brown', referralReason: 'Routine mobility review', referralDate: '2026-06-01', primaryDiagnosis: 'Age-related mobility concern' };
	d.fallHistory = { ...d.fallHistory, fallsLastYear: 0, fearOfFalling: 'none' };
	d.balanceAssessment = { sittingBalance: 1, risesFromChair: 2, attemptingToRise: 2, immediateStandingBalance: 2, standingBalance: 2, nudgedBalance: 2, eyesClosed: 1, turning360: 2, sittingDown: 2 };
	d.gaitAssessment = { initiationOfGait: 1, stepLength: 1, stepHeight: 1, stepSymmetry: 1, stepContinuity: 1, path: 2, trunk: 2, walkingStance: 1 };
	d.timedUpAndGo = { ...d.timedUpAndGo, timeSeconds: 9, usedAssistiveDevice: 'no' };
	d.rangeOfMotion = { ...d.rangeOfMotion, hipFlexion: 'normal', hipExtension: 'normal', kneeFlexion: 'normal', kneeExtension: 'normal', ankleFlexion: 'normal', ankleExtension: 'normal' };
	d.functionalIndependence = { ...d.functionalIndependence, transfers: 'independent', ambulation: 'independent', stairs: 'independent', bathing: 'independent', dressing: 'independent' };
	return d;
}

/** A moderate-risk assessment: Tinetti in the 19-24 band, uses a cane. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1949-09-30', sex: 'female', height: '162 cm', weight: '82 kg' };
	d.referralInfo = { ...d.referralInfo, referringProvider: 'Dr. Lewis', referralReason: 'Unsteady gait', referralDate: '2026-06-04', primaryDiagnosis: 'Osteoarthritis' };
	d.fallHistory = { ...d.fallHistory, fallsLastYear: 1, lastFallDate: '2026-03-10', fearOfFalling: 'mild' };
	d.balanceAssessment = { sittingBalance: 1, risesFromChair: 1, attemptingToRise: 2, immediateStandingBalance: 1, standingBalance: 1, nudgedBalance: 1, eyesClosed: 1, turning360: 1, sittingDown: 1 };
	d.gaitAssessment = { initiationOfGait: 1, stepLength: 1, stepHeight: 1, stepSymmetry: 1, stepContinuity: 1, path: 1, trunk: 1, walkingStance: 1 };
	d.timedUpAndGo = { ...d.timedUpAndGo, timeSeconds: 13, usedAssistiveDevice: 'yes', deviceType: 'Single-point cane' };
	d.rangeOfMotion = { ...d.rangeOfMotion, hipFlexion: 'mildly-limited', hipExtension: 'normal', kneeFlexion: 'moderately-limited', kneeExtension: 'normal', ankleFlexion: 'normal', ankleExtension: 'mildly-limited' };
	d.assistiveDevices = { ...d.assistiveDevices, currentDevices: ['Cane'], deviceFitAdequate: 'yes', deviceCondition: 'Good' };
	d.currentMedications = { ...d.currentMedications, medications: [{ name: 'Amlodipine', dose: '5 mg', frequency: 'daily' }], fallRiskMedications: [] };
	d.functionalIndependence = { ...d.functionalIndependence, transfers: 'modified-independent', ambulation: 'supervision', stairs: 'supervision', bathing: 'modified-independent', dressing: 'independent' };
	return d;
}

/** A high-risk assessment: low Tinetti, recurrent falls, slow TUG. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1940-01-22', sex: 'female', height: '160 cm', weight: '70 kg' };
	d.referralInfo = { ...d.referralInfo, referringProvider: 'Dr. Khan', referralReason: 'Recurrent falls', referralDate: '2026-06-08', primaryDiagnosis: 'Parkinson disease' };
	d.fallHistory = { ...d.fallHistory, fallsLastYear: 3, lastFallDate: '2026-05-20', fallCircumstances: 'Tripped on rug', injuriesFromFalls: 'Wrist fracture', fearOfFalling: 'severe' };
	d.balanceAssessment = { sittingBalance: 1, risesFromChair: 0, attemptingToRise: 1, immediateStandingBalance: 0, standingBalance: 1, nudgedBalance: 0, eyesClosed: 0, turning360: 0, sittingDown: 1 };
	d.gaitAssessment = { initiationOfGait: 0, stepLength: 0, stepHeight: 0, stepSymmetry: 1, stepContinuity: 0, path: 1, trunk: 0, walkingStance: 0 };
	d.timedUpAndGo = { ...d.timedUpAndGo, timeSeconds: 22, usedAssistiveDevice: 'yes', deviceType: 'Wheeled walker' };
	d.rangeOfMotion = { ...d.rangeOfMotion, hipFlexion: 'moderately-limited', hipExtension: 'severely-limited', kneeFlexion: 'moderately-limited', kneeExtension: 'mildly-limited', ankleFlexion: 'severely-limited', ankleExtension: 'moderately-limited' };
	d.assistiveDevices = { ...d.assistiveDevices, currentDevices: ['Walker'], deviceFitAdequate: 'no', deviceCondition: 'Worn grips' };
	d.currentMedications = { ...d.currentMedications, medications: [{ name: 'Levodopa', dose: '100 mg', frequency: 'TDS' }, { name: 'Lorazepam', dose: '1 mg', frequency: 'nocte' }], fallRiskMedications: ['Lorazepam (benzodiazepine)'] };
	d.functionalIndependence = { ...d.functionalIndependence, transfers: 'minimal-assist', ambulation: 'moderate-assist', stairs: 'maximal-assist', bathing: 'moderate-assist', dressing: 'minimal-assist' };
	return d;
}

/** A severe assessment: very low Tinetti, no device despite high risk. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1938-11-03', sex: 'male', height: '175 cm', weight: '68 kg' };
	d.referralInfo = { ...d.referralInfo, referringProvider: 'Dr. Owen', referralReason: 'Marked decline in mobility', referralDate: '2026-06-12', primaryDiagnosis: 'Post-stroke hemiparesis' };
	d.fallHistory = { ...d.fallHistory, fallsLastYear: 5, lastFallDate: '2026-06-01', fallCircumstances: 'Loss of balance on standing', injuriesFromFalls: 'Head laceration', fearOfFalling: 'severe' };
	d.balanceAssessment = { sittingBalance: 0, risesFromChair: 0, attemptingToRise: 0, immediateStandingBalance: 0, standingBalance: 0, nudgedBalance: 0, eyesClosed: 0, turning360: 0, sittingDown: 0 };
	d.gaitAssessment = { initiationOfGait: 0, stepLength: 0, stepHeight: 0, stepSymmetry: 0, stepContinuity: 0, path: 0, trunk: 0, walkingStance: 0 };
	d.timedUpAndGo = { ...d.timedUpAndGo, timeSeconds: 35, usedAssistiveDevice: 'no' };
	d.rangeOfMotion = { ...d.rangeOfMotion, hipFlexion: 'severely-limited', hipExtension: 'severely-limited', kneeFlexion: 'severely-limited', kneeExtension: 'moderately-limited', ankleFlexion: 'severely-limited', ankleExtension: 'severely-limited' };
	d.assistiveDevices = { ...d.assistiveDevices, currentDevices: [], deviceFitAdequate: '' };
	d.currentMedications = { ...d.currentMedications, medications: [{ name: 'Aspirin', dose: '75 mg', frequency: 'daily' }, { name: 'Atorvastatin', dose: '40 mg', frequency: 'nocte' }, { name: 'Ramipril', dose: '5 mg', frequency: 'daily' }, { name: 'Codeine', dose: '30 mg', frequency: 'QDS' }, { name: 'Amitriptyline', dose: '25 mg', frequency: 'nocte' }], fallRiskMedications: ['Codeine (opioid)', 'Amitriptyline (sedative)'] };
	d.functionalIndependence = { ...d.functionalIndependence, transfers: 'maximal-assist', ambulation: 'dependent', stairs: 'dependent', bathing: 'dependent', dressing: 'maximal-assist' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'MA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'MA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'MA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severe() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeMobility(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		tinettiTotal: g.tinettiTotal,
		fallRisk: g.tinettiCategory,
		tugSeconds: s.data.timedUpAndGo.timeSeconds,
		fallsLastYear: s.data.fallHistory.fallsLastYear,
		assistiveDevice: s.data.assistiveDevices.currentDevices.length > 0,
		flagCount: g.additionalFlags.length
	};
});
