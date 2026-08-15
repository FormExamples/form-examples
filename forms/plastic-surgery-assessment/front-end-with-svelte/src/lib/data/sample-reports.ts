import type { AssessmentData, ASAClass, WoundClass, ComplexityScore, RiskLevel } from '#lib/engine/types.js';
import { calculatePlasticsGrade } from '#lib/engine/plastics-grader.js';
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
	asaClass: ASAClass | null;
	woundClass: WoundClass | null;
	complexityScore: ComplexityScore | null;
	riskLevel: RiskLevel;
	smokerFlag: boolean;
	allergyFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: minor elective procedure, ASA I, clean wound. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Emily', lastName: 'Carter', dateOfBirth: '1990-03-14', sex: 'female', weight: 64, height: 168, bmi: 22.7 };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'aesthetic', urgency: 'elective', primaryComplaint: 'Small facial mole excision', affectedBodyArea: 'face', laterality: 'left', durationOfCondition: 'greater-12-months', previousConsultations: 'no' };
	d.currentCondition = { ...d.currentCondition, conditionCategory: 'skin-lesion', functionalImpairment: 'none', painLevel: 0, cosmeticConcern: 'mild', impactOnDailyActivities: 'none' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, hasOpenWound: 'no', woundClassification: 'clean', tissueViability: 'viable', vascularSupply: 'adequate', sensoryStatus: 'intact' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, bodyDysmorphicConcern: 'no', realisticExpectations: 'yes', motivation: 'cosmetic-improvement', anxietyLevel: 'none', psychologicalReferralNeeded: 'no' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '1', smokingStatus: 'never', alcoholConsumption: 'within-guidelines', anaestheticPreference: 'local' };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, proposedProcedure: 'Excision of benign facial naevus', procedureComplexity: '1', surgicalApproach: 'open', flapType: 'local', vteRisk: 'low', consentDiscussion: 'yes', consentFormSigned: 'yes' };
	return d;
}

/** A moderate-risk assessment: intermediate procedure, ASA II, controlled comorbidities. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Robert', lastName: 'Mason', dateOfBirth: '1968-07-22', sex: 'male', weight: 92, height: 175, bmi: 30.0 };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'reconstructive', urgency: 'urgent', primaryComplaint: 'Skin cancer reconstruction', affectedBodyArea: 'head-neck', laterality: 'right', durationOfCondition: '6-12-months', previousConsultations: 'yes', previousConsultationsDetails: 'Dermatology referral' };
	d.medicalSurgicalHistory = { ...d.medicalSurgicalHistory, diabetes: 'type-2', diabetesControlled: 'yes', hypertension: 'yes' };
	d.currentCondition = { ...d.currentCondition, conditionCategory: 'soft-tissue-defect', functionalImpairment: 'mild', painLevel: 3, cosmeticConcern: 'moderate', impactOnDailyActivities: 'mild' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, hasOpenWound: 'yes', woundClassification: 'clean-contaminated', woundAge: 'subacute', woundAetiology: 'surgical', woundBedTissue: 'granulation', tissueViability: 'viable', vascularSupply: 'adequate', sensoryStatus: 'intact' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, bodyDysmorphicConcern: 'no', realisticExpectations: 'yes', motivation: 'cancer-treatment', anxietyLevel: 'mild', psychologicalReferralNeeded: 'no' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '2', smokingStatus: 'ex-smoker', packYears: 15, alcoholConsumption: 'within-guidelines', anaestheticPreference: 'general' };
	d.medicationsAllergies = { ...d.medicationsAllergies, hasDrugAllergies: 'yes', allergies: [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }] };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, proposedProcedure: 'Local flap reconstruction of scalp defect', procedureComplexity: '2', surgicalApproach: 'open', flapType: 'local', vteRisk: 'moderate', antibioticProphylaxis: 'yes', consentDiscussion: 'yes', consentFormSigned: 'yes' };
	return d;
}

/** A high-risk assessment: major reconstruction, ASA III, current smoker. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Hughes', dateOfBirth: '1952-11-05', sex: 'female', weight: 96, height: 158, bmi: 38.5 };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'cancer', urgency: 'urgent', primaryComplaint: 'Breast reconstruction post-mastectomy', affectedBodyArea: 'breast', laterality: 'left', durationOfCondition: '1-6-months', previousConsultations: 'yes' };
	d.medicalSurgicalHistory = { ...d.medicalSurgicalHistory, diabetes: 'type-2', diabetesControlled: 'no', hypertension: 'yes', cardiacDisease: 'yes', cardiacDiseaseDetails: 'Stable angina', cancerHistory: 'yes', cancerHistoryDetails: 'Breast carcinoma', woundHealingProblems: 'yes' };
	d.currentCondition = { ...d.currentCondition, conditionCategory: 'breast', functionalImpairment: 'moderate', painLevel: 5, cosmeticConcern: 'severe', impactOnDailyActivities: 'moderate' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, hasOpenWound: 'yes', woundClassification: 'contaminated', woundAge: 'subacute', woundAetiology: 'surgical', woundBedTissue: 'slough', woundExudate: 'serous', tissueViability: 'compromised', vascularSupply: 'compromised', sensoryStatus: 'reduced' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, bodyDysmorphicConcern: 'no', realisticExpectations: 'partly', motivation: 'cancer-treatment', anxietyLevel: 'moderate', socialImpact: 'moderate', psychologicalReferralNeeded: 'yes' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '3', smokingStatus: 'current', packYears: 35, alcoholConsumption: 'within-guidelines', obstructiveSleepApnoea: 'yes', anaestheticPreference: 'general' };
	d.medicationsAllergies = { ...d.medicationsAllergies, onAnticoagulants: 'yes', anticoagulantDetails: 'Warfarin', hasDrugAllergies: 'no', latexAllergy: 'yes' };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, proposedProcedure: 'Free DIEP flap breast reconstruction', procedureComplexity: '3', surgicalApproach: 'microsurgical', flapType: 'free', vteRisk: 'high', antibioticProphylaxis: 'yes', consentDiscussion: 'yes', consentFormSigned: 'no' };
	return d;
}

/** A critical assessment: emergency reconstruction, ASA IV, dirty wound. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Okafor', dateOfBirth: '1959-02-18', sex: 'male', weight: 84, height: 180, bmi: 25.9 };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'trauma', urgency: 'emergency', primaryComplaint: 'Degloving injury lower limb with tissue loss', affectedBodyArea: 'lower-limb', laterality: 'right', durationOfCondition: 'acute', previousConsultations: 'no' };
	d.medicalSurgicalHistory = { ...d.medicalSurgicalHistory, diabetes: 'type-1', diabetesControlled: 'no', hypertension: 'yes', bleedingDisorder: 'yes', bleedingDisorderDetails: 'Haemophilia A', immunosuppressed: 'yes', immunosuppressedDetails: 'Long-term corticosteroids' };
	d.currentCondition = { ...d.currentCondition, conditionCategory: 'soft-tissue-defect', functionalImpairment: 'severe', tissueLoss: 'yes', tissueLossPercentage: 35, painLevel: 9, cosmeticConcern: 'moderate', impactOnDailyActivities: 'severe' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, hasOpenWound: 'yes', woundClassification: 'dirty', woundAge: 'acute', woundAetiology: 'traumatic', woundBedTissue: 'necrotic', woundExudate: 'purulent', woundInfectionSigns: 'yes', woundInfectionDetails: 'Cellulitis and purulent discharge', tissueViability: 'non-viable', vascularSupply: 'absent', sensoryStatus: 'absent' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, bodyDysmorphicConcern: 'no', realisticExpectations: 'partly', motivation: 'trauma-repair', anxietyLevel: 'severe', psychologicalReferralNeeded: 'yes' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '4', previousAnaesthetic: 'yes', difficultAirway: 'yes', difficultAirwayDetails: 'Limited neck extension', malignantHyperthermiaRisk: 'yes', smokingStatus: 'current', packYears: 40, alcoholConsumption: 'above-guidelines', anaestheticPreference: 'general' };
	d.medicationsAllergies = { ...d.medicationsAllergies, onAnticoagulants: 'yes', anticoagulantDetails: 'Therapeutic LMWH', onSteroids: 'yes', steroidDetails: 'Prednisolone 10 mg', hasDrugAllergies: 'yes', allergies: [{ allergen: 'Cephalosporins', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }], latexAllergy: 'yes' };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, proposedProcedure: 'Emergency debridement and free flap coverage', procedureComplexity: '4', surgicalApproach: 'microsurgical', flapType: 'free', vteRisk: 'high', antibioticProphylaxis: 'yes', consentDiscussion: 'yes', consentFormSigned: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PS-2026-0001', patientName: 'Carter, Emily', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'PS-2026-0002', patientName: 'Mason, Robert', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'PS-2026-0003', patientName: 'Hughes, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'PS-2026-0004', patientName: 'Okafor, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePlasticsGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		asaClass: g.asaClass,
		woundClass: g.woundClass,
		complexityScore: g.complexityScore,
		riskLevel: g.overallRisk,
		smokerFlag: s.data.anaestheticRisk.smokingStatus === 'current',
		allergyFlag:
			s.data.medicationsAllergies.hasDrugAllergies === 'yes' ||
			s.data.medicationsAllergies.allergies.length > 0,
		flagCount: g.additionalFlags.length
	};
});
