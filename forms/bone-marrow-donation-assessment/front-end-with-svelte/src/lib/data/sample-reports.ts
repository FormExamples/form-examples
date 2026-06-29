import type { AssessmentData, Eligibility, RiskLevel } from '$lib/engine/types';
import { calculateDonorGrade } from '$lib/engine/donor-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	donorName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	donorName: string;
	assessedDate: string;
	eligibility: Eligibility;
	riskLevel: RiskLevel;
	hlaMatchLevel: string;
	collectionMethod: string;
	flagCount: number;
}

/** A suitable donor: full match, healthy, no contraindications. */
function suitable(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Olivia', lastName: 'Bennett', dateOfBirth: '1990-03-14', sex: 'female', weight: 68, height: 168, bmi: 24.1 };
	d.donorRegistrationHlaTyping = { ...d.donorRegistrationHlaTyping, donorRegistry: 'Anthony Nolan', donorRegistryId: 'AN-44213', donationType: 'allogeneic', recipientRelationship: 'unrelated', hlaMatchLevel: '10-of-10', crossmatchResult: 'negative', previousDonation: 'no' };
	d.anaestheticAssessment = { ...d.anaestheticAssessment, asaGrade: 'I', mallampatiScore: 'I', anaestheticComplications: 'no' };
	d.haematologicalAssessment = { ...d.haematologicalAssessment, haemoglobin: 14.2, plateletCount: 280, bloodGroup: 'O+', coagulationScreen: 'normal', liverFunction: 'normal', creatinine: 72 };
	d.physicalExamination = { ...d.physicalExamination, generalAppearance: 'well', cardiovascularExamination: 'normal', respiratoryExamination: 'normal', oxygenSaturation: 99, posteriorIliacCrestAssessment: 'suitable' };
	d.collectionMethodAssessment = { ...d.collectionMethodAssessment, finalCollectionMethod: 'pbsc', gcsfEligible: 'yes', venousAccessSuitableForApheresis: 'yes', centralLineRequired: 'no' };
	d.psychologicalReadiness = { ...d.psychologicalReadiness, understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', anxietyAboutProcedure: 'none', supportNetwork: 'yes', willingToProceed: 'yes' };
	d.consentEligibility = { ...d.consentEligibility, informedConsentGiven: 'yes', consentFormSigned: 'yes' };
	return d;
}

/** A conditionally-suitable donor: 9/10 match, minor findings. */
function conditional(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Marcus', lastName: 'Chen', dateOfBirth: '1962-07-22', sex: 'male', weight: 88, height: 176, bmi: 28.4 };
	d.donorRegistrationHlaTyping = { ...d.donorRegistrationHlaTyping, donorRegistry: 'DKMS', donorRegistryId: 'DK-90817', donationType: 'allogeneic', recipientRelationship: 'unrelated', hlaMatchLevel: '9-of-10', crossmatchResult: 'negative', previousDonation: 'no' };
	d.medicalHistory = { ...d.medicalHistory, hasRespiratoryDisease: 'yes', respiratoryDetails: 'Mild asthma', drugAllergies: 'Penicillin' };
	d.anaestheticAssessment = { ...d.anaestheticAssessment, asaGrade: 'II', mallampatiScore: 'II', familyAnaestheticProblems: 'yes', smokingStatus: 'ex' };
	d.haematologicalAssessment = { ...d.haematologicalAssessment, haemoglobin: 13.1, plateletCount: 210, bloodGroup: 'A+', coagulationScreen: 'normal', liverFunction: 'abnormal', creatinine: 96 };
	d.physicalExamination = { ...d.physicalExamination, generalAppearance: 'well', cardiovascularExamination: 'normal', respiratoryExamination: 'normal', oxygenSaturation: 97, posteriorIliacCrestAssessment: 'suitable' };
	d.collectionMethodAssessment = { ...d.collectionMethodAssessment, finalCollectionMethod: 'pbsc', gcsfEligible: 'yes', venousAccessSuitableForApheresis: 'yes', centralLineRequired: 'yes' };
	d.psychologicalReadiness = { ...d.psychologicalReadiness, understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', anxietyAboutProcedure: 'mild', supportNetwork: 'yes', willingToProceed: 'yes' };
	d.consentEligibility = { ...d.consentEligibility, informedConsentGiven: 'yes', consentFormSigned: 'yes' };
	return d;
}

/** A high-risk donor: 8/10 match, renal disease, abnormal coagulation. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Sofia', lastName: 'Rossi', dateOfBirth: '1958-11-05', sex: 'female', weight: 74, height: 160, bmi: 28.9 };
	d.donorRegistrationHlaTyping = { ...d.donorRegistrationHlaTyping, donorRegistry: 'WMDA', donorRegistryId: 'WM-33120', donationType: 'allogeneic', recipientRelationship: 'related', hlaMatchLevel: '8-of-10', crossmatchResult: 'negative', previousDonation: 'no' };
	d.medicalHistory = { ...d.medicalHistory, hasRenalDisease: 'yes', renalDetails: 'CKD stage 2', hasCardiovascularDisease: 'yes', cardiovascularDetails: 'Hypertension' };
	d.anaestheticAssessment = { ...d.anaestheticAssessment, asaGrade: 'II', mallampatiScore: 'III', anaestheticComplications: 'yes', complicationDetails: 'PONV', smokingStatus: 'ex' };
	d.haematologicalAssessment = { ...d.haematologicalAssessment, haemoglobin: 11.6, plateletCount: 140, bloodGroup: 'B+', coagulationScreen: 'abnormal', liverFunction: 'normal', creatinine: 135 };
	d.physicalExamination = { ...d.physicalExamination, generalAppearance: 'well', cardiovascularExamination: 'abnormal', cardiovascularFindings: 'Soft systolic murmur', respiratoryExamination: 'normal', oxygenSaturation: 96, posteriorIliacCrestAssessment: 'suitable' };
	d.collectionMethodAssessment = { ...d.collectionMethodAssessment, finalCollectionMethod: 'bone-marrow', gcsfEligible: 'no', gcsfContraindications: 'Renal impairment', venousAccessSuitableForApheresis: 'no', centralLineRequired: 'yes' };
	d.psychologicalReadiness = { ...d.psychologicalReadiness, understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', anxietyAboutProcedure: 'moderate', supportNetwork: 'yes', willingToProceed: 'yes' };
	d.consentEligibility = { ...d.consentEligibility, informedConsentGiven: 'yes', consentFormSigned: 'yes' };
	return d;
}

/** An unsuitable donor: critical contraindications. */
function unsuitable(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'James', lastName: 'Okafor', dateOfBirth: '1949-02-18', sex: 'male', weight: 80, height: 178, bmi: 25.2 };
	d.donorRegistrationHlaTyping = { ...d.donorRegistrationHlaTyping, donorRegistry: 'Anthony Nolan', donorRegistryId: 'AN-77541', donationType: 'allogeneic', recipientRelationship: 'unrelated', hlaMatchLevel: '7-of-10', crossmatchResult: 'positive', previousDonation: 'no' };
	d.medicalHistory = { ...d.medicalHistory, hasMalignancy: 'yes', malignancyDetails: 'Treated colorectal cancer 2019', hasBleedingDisorder: 'yes', bleedingDisorderDetails: 'Von Willebrand' };
	d.anaestheticAssessment = { ...d.anaestheticAssessment, asaGrade: 'III', mallampatiScore: 'IV', anaestheticComplications: 'yes', smokingStatus: 'current' };
	d.haematologicalAssessment = { ...d.haematologicalAssessment, haemoglobin: 9.4, plateletCount: 110, bloodGroup: 'AB-', coagulationScreen: 'abnormal', liverFunction: 'abnormal', creatinine: 142 };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'positive', hepatitisCAbntibody: 'positive', recentInfection: 'yes', infectionDetails: 'Chest infection', vaccinationUpToDate: 'no' };
	d.physicalExamination = { ...d.physicalExamination, generalAppearance: 'acutely-unwell', cardiovascularExamination: 'abnormal', respiratoryExamination: 'abnormal', oxygenSaturation: 92, posteriorIliacCrestAssessment: 'unsuitable' };
	d.collectionMethodAssessment = { ...d.collectionMethodAssessment, finalCollectionMethod: 'bone-marrow', gcsfEligible: 'no', venousAccessSuitableForApheresis: 'no', centralLineRequired: 'yes' };
	d.psychologicalReadiness = { ...d.psychologicalReadiness, understandsProcedure: 'no', understandsRisks: 'no', voluntaryDecision: 'no', coercionConcerns: 'yes', coercionDetails: 'Family pressure reported', anxietyAboutProcedure: 'severe', supportNetwork: 'no', willingToProceed: 'no' };
	d.consentEligibility = { ...d.consentEligibility, informedConsentGiven: 'no', eligibilityDecision: 'unsuitable', deferralReason: 'Multiple contraindications', deferralDuration: 'permanent' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BM-2026-0001', donorName: 'Bennett, Olivia', assessedDate: '2026-06-10', data: suitable() },
	{ id: 'BM-2026-0002', donorName: 'Chen, Marcus', assessedDate: '2026-06-12', data: conditional() },
	{ id: 'BM-2026-0003', donorName: 'Rossi, Sofia', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'BM-2026-0004', donorName: 'Okafor, James', assessedDate: '2026-06-18', data: unsuitable() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateDonorGrade(s.data);
	return {
		id: s.id,
		donorName: s.donorName,
		assessedDate: s.assessedDate,
		eligibility: g.eligibility,
		riskLevel: g.overallRisk,
		hlaMatchLevel: g.hlaMatchLevel,
		collectionMethod: g.collectionMethod,
		flagCount: g.additionalFlags.length
	};
});
