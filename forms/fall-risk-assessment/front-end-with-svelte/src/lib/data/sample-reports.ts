import type { AssessmentData, Severity } from '$lib/engine/types';
import { calculateFallRiskGrade } from '$lib/engine/fall-risk-grader';
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
	careSetting: string;
	mfsScore: number;
	severity: Severity;
	anticoagulantFlag: boolean;
	recurrentFallsFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: no falls, independent, oriented. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1952-04-12', sex: 'male', age: 74, careSetting: 'community', primaryDiagnosis: 'Hypertension' };
	d.fallHistory = { ...d.fallHistory, hasFallenInPastYear: 'no', recurrentFallsWithInjury: 'no', fearOfFalling: 'no' };
	d.mfs = { historyOfFalling: 0, secondaryDiagnosis: 15, ambulatoryAid: 0, ivOrHeparinLock: 0, gaitTransferring: 0, mentalStatus: 0 };
	d.mobilityGait = { ...d.mobilityGait, mobilityLevel: 'independent', assistiveDeviceUsed: 'none', unsteadyGait: 'no', balanceImpairment: 'no' };
	d.environmental = { ...d.environmental, hipProtectorsUsed: 'no' };
	return d;
}

/** A moderate-risk assessment: prior fall, uses a cane, weak gait. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1948-09-30', sex: 'female', age: 77, careSetting: 'outpatient', primaryDiagnosis: 'Osteoarthritis' };
	d.fallHistory = { ...d.fallHistory, hasFallenInPastYear: 'yes', numberOfFallsPastYear: 1, mostRecentFallInjurious: 'no', recurrentFallsWithInjury: 'no', fearOfFalling: 'yes' };
	d.mfs = { historyOfFalling: 25, secondaryDiagnosis: 0, ambulatoryAid: 15, ivOrHeparinLock: 0, gaitTransferring: 10, mentalStatus: 0 };
	d.mobilityGait = { ...d.mobilityGait, mobilityLevel: 'supervision', assistiveDeviceUsed: 'cane', unsteadyGait: 'yes', balanceImpairment: 'yes', weaknessLowerExtremity: 'yes' };
	d.medicationReview = { ...d.medicationReview, polypharmacy: 'no', sedativesOrHypnotics: 'yes', antihypertensives: 'yes' };
	d.visionSensory = { ...d.visionSensory, visionImpairment: 'yes', visionCorrected: 'no' };
	d.environmental = { ...d.environmental, loosThrowRugs: 'yes', poorLighting: 'yes', hipProtectorsUsed: 'no' };
	return d;
}

/** A high-risk assessment: high MFS total, impaired gait, environmental hazards. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1940-01-22', sex: 'female', age: 86, careSetting: 'inpatient', primaryDiagnosis: 'Stroke' };
	d.fallHistory = { ...d.fallHistory, hasFallenInPastYear: 'yes', numberOfFallsPastYear: 3, mostRecentFallInjurious: 'no', recurrentFallsWithInjury: 'no', fearOfFalling: 'yes' };
	d.mfs = { historyOfFalling: 25, secondaryDiagnosis: 15, ambulatoryAid: 15, ivOrHeparinLock: 0, gaitTransferring: 20, mentalStatus: 0 };
	d.mobilityGait = { ...d.mobilityGait, mobilityLevel: 'assistance-1', assistiveDeviceUsed: 'walker', unsteadyGait: 'yes', balanceImpairment: 'yes', weaknessLowerExtremity: 'yes', orthostaticHypotension: 'yes', orthostaticHypotensionSevere: 'no' };
	d.medicationReview = { ...d.medicationReview, medications: [{ name: 'Amlodipine', dose: '5 mg', frequency: 'Daily' }, { name: 'Furosemide', dose: '40 mg', frequency: 'Daily' }, { name: 'Zopiclone', dose: '7.5 mg', frequency: 'Nightly' }, { name: 'Sertraline', dose: '50 mg', frequency: 'Daily' }], polypharmacy: 'yes', sedativesOrHypnotics: 'yes', diuretics: 'yes' };
	d.visionSensory = { ...d.visionSensory, visionImpairment: 'yes', visionCorrected: 'no', cataracts: 'yes' };
	d.environmental = { ...d.environmental, clutteredWalkways: 'yes', poorLighting: 'yes', bathroomGrabBarsAbsent: 'yes', unsuitableFootwear: 'yes', hipProtectorsUsed: 'no' };
	d.previousInterventions = { ...d.previousInterventions, missedReferral: 'yes' };
	return d;
}

/** A critical assessment: recurrent injurious falls, anticoagulated, dementia. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1938-11-03', sex: 'male', age: 87, careSetting: 'long-term-care', primaryDiagnosis: 'Dementia' };
	d.fallHistory = { ...d.fallHistory, hasFallenInPastYear: 'yes', numberOfFallsPastYear: 5, lastFallDate: '2026-05-20', mostRecentFallInjurious: 'yes', mostRecentFallInjuryDetails: 'Wrist fracture', recurrentFallsWithInjury: 'yes', fearOfFalling: 'yes' };
	d.mfs = { historyOfFalling: 25, secondaryDiagnosis: 15, ambulatoryAid: 30, ivOrHeparinLock: 20, gaitTransferring: 20, mentalStatus: 15 };
	d.mobilityGait = { ...d.mobilityGait, mobilityLevel: 'assistance-2', assistiveDeviceUsed: 'walker', unsteadyGait: 'yes', balanceImpairment: 'yes', weaknessLowerExtremity: 'yes', orthostaticHypotension: 'yes', orthostaticHypotensionSevere: 'yes' };
	d.medicationReview = { ...d.medicationReview, medications: [{ name: 'Warfarin', dose: '3 mg', frequency: 'Daily' }, { name: 'Bisoprolol', dose: '2.5 mg', frequency: 'Daily' }, { name: 'Donepezil', dose: '10 mg', frequency: 'Daily' }, { name: 'Quetiapine', dose: '25 mg', frequency: 'Nightly' }], polypharmacy: 'yes', sedativesOrHypnotics: 'yes', anticoagulants: 'yes', antipsychotics: 'yes' };
	d.visionSensory = { ...d.visionSensory, visionImpairment: 'yes', visionCorrected: 'no', macularDegeneration: 'yes' };
	d.environmental = { ...d.environmental, poorLighting: 'yes', bathroomGrabBarsAbsent: 'yes', unsuitableFootwear: 'yes', hipProtectorsUsed: 'no' };
	d.cognitive = { ...d.cognitive, dementiaDiagnosis: 'yes', confusionOrDisorientation: 'yes', impulsivity: 'yes', overestimatesAbility: 'yes' };
	d.previousInterventions = { ...d.previousInterventions, interventionDeclined: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FR-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'FR-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'FR-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'FR-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateFallRiskGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.demographics.careSetting,
		mfsScore: g.mfsScore,
		severity: g.severity,
		anticoagulantFlag: s.data.medicationReview.anticoagulants === 'yes',
		recurrentFallsFlag: s.data.fallHistory.recurrentFallsWithInjury === 'yes',
		flagCount: g.additionalFlags.length
	};
});
