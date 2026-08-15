import type { AssessmentData, CFSScore } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/cfs-grader.js';
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
	cfsScore: CFSScore;
	cognitiveStatus: string;
	fallsFlag: boolean;
	polypharmacyFlag: boolean;
	flagCount: number;
}

/** A very fit, fully independent older adult — defaults to CFS 1. */
function veryFit(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Thompson', dateOfBirth: '1948-03-15', sex: 'female', weight: 65, height: 160, bmi: 25.4, livingSituation: 'independent' };
	d.functionalAssessment = {
		bathingADL: 'independent', dressingADL: 'independent', toiletingADL: 'independent', transferringADL: 'independent', feedingADL: 'independent',
		cookingIADL: 'independent', cleaningIADL: 'independent', shoppingIADL: 'independent', financesIADL: 'independent', medicationManagementIADL: 'independent'
	};
	d.cognitiveScreen = { ...d.cognitiveScreen, mmseScore: 29, mocaScore: 28, orientationIntact: 'yes', memoryImpairment: 'no', executiveFunctionImpairment: 'no', deliriumRisk: 'no', cognitiveStatus: 'normal' };
	d.mobilityFalls = { ...d.mobilityFalls, gaitAssessment: 'normal', balanceAssessment: 'normal', fallHistory: 'no', fearOfFalling: 'no', mobilityAids: 'no', timedUpAndGo: 9 };
	d.nutrition = { ...d.nutrition, weightChangeLastSixMonths: 'no', appetite: 'normal', swallowingDifficulties: 'no', dentalStatus: 'good', mnaScore: 28 };
	d.polypharmacyReview = { ...d.polypharmacyReview, numberOfMedications: 2, highRiskMedications: 'no', beersCriteriaFlags: 'no', medicationAdherence: 'good' };
	return d;
}

/** A vulnerable older adult: mild cognitive impairment, some help with ADLs — CFS 4. */
function vulnerable(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Harold', lastName: 'Williams', dateOfBirth: '1944-07-02', sex: 'male', weight: 80, height: 175, bmi: 26.1, livingSituation: 'with-family' };
	d.functionalAssessment = {
		bathingADL: 'needs-assistance', dressingADL: 'independent', toiletingADL: 'independent', transferringADL: 'independent', feedingADL: 'independent',
		cookingIADL: 'needs-assistance', cleaningIADL: 'needs-assistance', shoppingIADL: 'needs-assistance', financesIADL: 'needs-assistance', medicationManagementIADL: 'needs-assistance'
	};
	d.cognitiveScreen = { ...d.cognitiveScreen, mmseScore: 24, mocaScore: 22, orientationIntact: 'yes', memoryImpairment: 'yes', executiveFunctionImpairment: 'no', deliriumRisk: 'no', cognitiveStatus: 'mild-impairment' };
	d.mobilityFalls = { ...d.mobilityFalls, gaitAssessment: 'unsteady', balanceAssessment: 'impaired', fallHistory: 'no', fearOfFalling: 'yes', mobilityAids: 'yes', mobilityAidType: 'Walking stick', timedUpAndGo: 13 };
	d.nutrition = { ...d.nutrition, weightChangeLastSixMonths: 'no', appetite: 'normal', swallowingDifficulties: 'no', dentalStatus: 'fair', mnaScore: 25 };
	d.polypharmacyReview = { ...d.polypharmacyReview, numberOfMedications: 6, highRiskMedications: 'no', beersCriteriaFlags: 'no', medicationAdherence: 'fair' };
	d.medications = [
		{ name: 'Amlodipine', dose: '5 mg', frequency: 'OD' },
		{ name: 'Atorvastatin', dose: '20 mg', frequency: 'OD' }
	];
	return d;
}

/** A moderately frail older adult: dependent ADLs, falls, depression — CFS 6. */
function moderatelyFrail(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Dorothy', lastName: 'Jones', dateOfBirth: '1939-11-20', sex: 'female', weight: 58, height: 158, bmi: 23.2, livingSituation: 'assisted-living' };
	d.functionalAssessment = {
		bathingADL: 'dependent', dressingADL: 'dependent', toiletingADL: 'needs-assistance', transferringADL: 'dependent', feedingADL: 'needs-assistance',
		cookingIADL: 'dependent', cleaningIADL: 'dependent', shoppingIADL: 'dependent', financesIADL: 'dependent', medicationManagementIADL: 'dependent'
	};
	d.cognitiveScreen = { ...d.cognitiveScreen, mmseScore: 20, mocaScore: 18, orientationIntact: 'no', memoryImpairment: 'yes', executiveFunctionImpairment: 'yes', deliriumRisk: 'yes', cognitiveStatus: 'moderate-impairment' };
	d.mobilityFalls = { ...d.mobilityFalls, gaitAssessment: 'unsteady', balanceAssessment: 'impaired', fallHistory: 'yes', fallsLastYear: 4, fearOfFalling: 'yes', mobilityAids: 'yes', mobilityAidType: 'Walking frame', timedUpAndGo: 22 };
	d.nutrition = { ...d.nutrition, weightChangeLastSixMonths: 'yes', weightChangeKg: 4, weightChangeDirection: 'loss', appetite: 'reduced', swallowingDifficulties: 'no', dentalStatus: 'poor', mnaScore: 19 };
	d.polypharmacyReview = { ...d.polypharmacyReview, numberOfMedications: 11, highRiskMedications: 'yes', highRiskMedicationDetails: 'Warfarin, Diazepam', beersCriteriaFlags: 'yes', beersCriteriaDetails: 'Long-acting benzodiazepine', medicationAdherence: 'poor' };
	d.psychosocial = { ...d.psychosocial, depressionScreen: 'moderate', gds15Score: 9, socialIsolation: 'moderate', hasCaregiver: 'yes', caregiverDetails: 'Care home staff', advanceDirectives: 'no' };
	d.continenceSkin = { ...d.continenceSkin, urinaryIncontinence: 'urge', urinaryIncontinenceFrequency: 'frequent', faecalIncontinence: 'no', bradenScale: 14, pressureInjuryPresent: 'no', skinIntegrity: 'intact' };
	d.medications = [
		{ name: 'Warfarin', dose: '3 mg', frequency: 'OD' },
		{ name: 'Diazepam', dose: '5 mg', frequency: 'ON' },
		{ name: 'Furosemide', dose: '40 mg', frequency: 'OD' }
	];
	return d;
}

/** A very severely frail older adult: fully dependent, bedbound, severe dementia — CFS 8. */
function verySeverelyFrail(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Stanley', lastName: 'Robinson', dateOfBirth: '1934-01-08', sex: 'male', weight: 52, height: 170, bmi: 18.0, livingSituation: 'nursing-home' };
	d.functionalAssessment = {
		bathingADL: 'dependent', dressingADL: 'dependent', toiletingADL: 'dependent', transferringADL: 'dependent', feedingADL: 'dependent',
		cookingIADL: 'dependent', cleaningIADL: 'dependent', shoppingIADL: 'dependent', financesIADL: 'dependent', medicationManagementIADL: 'dependent'
	};
	d.cognitiveScreen = { ...d.cognitiveScreen, mmseScore: 6, mocaScore: 4, orientationIntact: 'no', memoryImpairment: 'yes', executiveFunctionImpairment: 'yes', deliriumRisk: 'yes', cognitiveStatus: 'severe-impairment' };
	d.mobilityFalls = { ...d.mobilityFalls, gaitAssessment: 'unable', balanceAssessment: 'severely-impaired', fallHistory: 'yes', fallsLastYear: 2, fearOfFalling: 'no', mobilityAids: 'yes', mobilityAidType: 'Hoist', timedUpAndGo: null };
	d.nutrition = { ...d.nutrition, weightChangeLastSixMonths: 'yes', weightChangeKg: 7, weightChangeDirection: 'loss', appetite: 'poor', swallowingDifficulties: 'yes', dentalStatus: 'edentulous', mnaScore: 11 };
	d.polypharmacyReview = { ...d.polypharmacyReview, numberOfMedications: 9, highRiskMedications: 'yes', highRiskMedicationDetails: 'Opioid analgesia', beersCriteriaFlags: 'no', medicationAdherence: 'fair' };
	d.psychosocial = { ...d.psychosocial, depressionScreen: 'severe', gds15Score: 12, socialIsolation: 'severe', hasCaregiver: 'yes', caregiverDetails: 'Nursing home staff', advanceDirectives: 'yes', advanceDirectiveDetails: 'DNACPR in place' };
	d.continenceSkin = { ...d.continenceSkin, urinaryIncontinence: 'functional', urinaryIncontinenceFrequency: 'continuous', faecalIncontinence: 'yes', faecalIncontinenceFrequency: 'frequent', bradenScale: 10, pressureInjuryPresent: 'yes', pressureInjuryStage: '3', skinIntegrity: 'wound-present' };
	d.comorbidities = { ...d.comorbidities, cardiovascularDisease: 'yes', cardiovascularDetails: 'Heart failure', diabetes: 'no', renalDisease: 'yes', renalDetails: 'CKD stage 4', visualDeficit: 'yes', hearingDeficit: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GA-2026-0001', patientName: 'Thompson, Margaret', assessedDate: '2026-06-10', data: veryFit() },
	{ id: 'GA-2026-0002', patientName: 'Williams, Harold', assessedDate: '2026-06-12', data: vulnerable() },
	{ id: 'GA-2026-0003', patientName: 'Jones, Dorothy', assessedDate: '2026-06-15', data: moderatelyFrail() },
	{ id: 'GA-2026-0004', patientName: 'Robinson, Stanley', assessedDate: '2026-06-18', data: verySeverelyFrail() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		cfsScore: g.cfsScore,
		cognitiveStatus: s.data.cognitiveScreen.cognitiveStatus || 'normal',
		fallsFlag: s.data.mobilityFalls.fallHistory === 'yes',
		polypharmacyFlag:
			s.data.polypharmacyReview.numberOfMedications !== null &&
			s.data.polypharmacyReview.numberOfMedications >= 5,
		flagCount: g.additionalFlags.length
	};
});
