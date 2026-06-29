import type { AssessmentData, DonorType, Eligibility, RiskLevel } from '$lib/engine/types';
import { gradeDonor } from '$lib/engine/donation-grader';
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
	donorType: DonorType;
	eligibility: Eligibility;
	riskLevel: RiskLevel;
	infectionFlag: boolean;
	immunoFlag: boolean;
	flagCount: number;
}

/** Suitable / low risk: ideal living donor, ASA I, all screens negative, consent complete. */
function suitableLowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Aisha', lastName: 'Khan', dateOfBirth: '1986-02-18', sex: 'female', weight: 64, height: 165, bmi: 23.5, ethnicity: 'British Pakistani' };
	d.donorTypeRegistration = { ...d.donorTypeRegistration, donorType: 'living', registeredOnDonorRegister: 'yes', recipientRelationship: 'sibling', recipientName: 'Imran Khan', previousDonation: 'no', intendedOrgans: 'Left kidney' };
	d.organFunction = { ...d.organFunction, creatinine: 70, egfr: 105, kidneyImaging: 'normal', alt: 22, ast: 24, bilirubin: 9, liverImaging: 'normal', ejectionFraction: 62, echocardiogram: 'normal' };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'negative', hbsAg: 'negative', hbcAb: 'negative', hcvAb: 'negative', htlvStatus: 'negative', syphilisScreen: 'negative', tuberculosisScreen: 'negative' };
	d.immunologicalAssessment = { ...d.immunologicalAssessment, donorBloodGroup: 'O+', recipientBloodGroup: 'O+', aboCompatibility: 'compatible', hlaMatchLevel: '4-of-6', crossmatchResult: 'compatible', pra: 0, donorSpecificAntibodies: 'no' };
	d.surgicalAssessment = { ...d.surgicalAssessment, asaGrade: 'I', previousAnaesthetic: 'no', anaestheticComplications: 'no', mallampatiScore: 'I', airwayConcerns: 'no', surgicalFitness: 'normal', plannedProcedure: 'Laparoscopic donor nephrectomy', smokingStatus: 'never', alcoholUse: 'none' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, mentalCapacityConfirmed: 'yes', understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', ambivalence: 'no', anxietyAboutProcedure: 'mild', supportNetwork: 'yes', willingToProceed: 'yes' };
	d.ethicalLegalRequirements = { ...d.ethicalLegalRequirements, htaAct2004Compliant: 'yes', independentAssessorReview: 'yes', informedConsentGiven: 'yes', consentFormSigned: 'yes', informationLeafletProvided: 'yes', questionsAnswered: 'yes', financialRewardCheck: 'yes', ethicsCommitteeApproval: 'yes' };
	d.eligibilityAllocation = { ...d.eligibilityAllocation, eligibilityDecision: 'suitable', allocatedOrgans: 'Left kidney', assessorName: 'Dr R. Mehta', assessmentDate: '2026-06-08' };
	return d;
}

/** Conditionally suitable / moderate: expanded-criteria living donor (diabetes, hypertension). */
function conditionalModerate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'George', lastName: 'Wright', dateOfBirth: '1962-11-04', sex: 'male', weight: 92, height: 174, bmi: 30.4, ethnicity: 'White British' };
	d.donorTypeRegistration = { ...d.donorTypeRegistration, donorType: 'living', registeredOnDonorRegister: 'yes', recipientRelationship: 'spouse-partner', recipientName: 'Helen Wright', previousDonation: 'no', intendedOrgans: 'Right kidney' };
	d.medicalHistory = { ...d.medicalHistory, hasDiabetes: 'yes', diabetesDetails: 'Type 2, diet-controlled', hasHypertension: 'yes', hypertensionDetails: 'Well controlled on ramipril' };
	d.organFunction = { ...d.organFunction, creatinine: 84, egfr: 78, kidneyImaging: 'normal', alt: 30, ejectionFraction: 58, echocardiogram: 'normal', hba1c: 6.2 };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'negative', hbsAg: 'negative', hcvAb: 'negative', cmvStatus: 'positive', syphilisScreen: 'negative', tuberculosisScreen: 'negative' };
	d.immunologicalAssessment = { ...d.immunologicalAssessment, donorBloodGroup: 'A+', recipientBloodGroup: 'A+', aboCompatibility: 'compatible', hlaMatchLevel: '3-of-6', crossmatchResult: 'compatible', pra: 5, donorSpecificAntibodies: 'no' };
	d.surgicalAssessment = { ...d.surgicalAssessment, asaGrade: 'II', previousAnaesthetic: 'yes', anaestheticComplications: 'no', mallampatiScore: 'II', surgicalFitness: 'normal', plannedProcedure: 'Laparoscopic donor nephrectomy', smokingStatus: 'ex', alcoholUse: 'occasional' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, mentalCapacityConfirmed: 'yes', understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', ambivalence: 'no', anxietyAboutProcedure: 'mild', supportNetwork: 'yes', willingToProceed: 'yes' };
	d.ethicalLegalRequirements = { ...d.ethicalLegalRequirements, htaAct2004Compliant: 'yes', independentAssessorReview: 'yes', informedConsentGiven: 'yes', consentFormSigned: 'yes', informationLeafletProvided: 'yes', questionsAnswered: 'yes', financialRewardCheck: 'yes', ethicsCommitteeApproval: 'yes' };
	d.eligibilityAllocation = { ...d.eligibilityAllocation, eligibilityDecision: 'conditionally-suitable', eligibilityConditions: 'Optimise glycaemic control; nephrology review of remaining kidney reserve', assessorName: 'Dr R. Mehta', assessmentDate: '2026-06-11' };
	return d;
}

/** Conditionally suitable / high: marginal organ function (renal dysfunction, IV drug history). */
function conditionalHigh(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Tomasz', lastName: 'Nowak', dateOfBirth: '1971-07-22', sex: 'male', weight: 80, height: 178, bmi: 25.2, ethnicity: 'White Polish' };
	d.donorTypeRegistration = { ...d.donorTypeRegistration, donorType: 'deceased', registeredOnDonorRegister: 'yes', previousDonation: 'no', intendedOrgans: 'Liver, both kidneys' };
	d.medicalHistory = { ...d.medicalHistory, hasAutoimmuneDisease: 'no', ivDrugUseHistory: 'yes' };
	d.organFunction = { ...d.organFunction, creatinine: 140, egfr: 52, kidneyImaging: 'abnormal', kidneyNotes: 'Mild cortical scarring on imaging', alt: 60, ast: 55, bilirubin: 14, liverImaging: 'normal', ejectionFraction: 55, echocardiogram: 'normal', pao2Fio2Ratio: 380 };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'negative', hbsAg: 'negative', hbcAb: 'positive', hcvAb: 'negative', htlvStatus: 'negative', syphilisScreen: 'negative', tuberculosisScreen: 'negative' };
	d.immunologicalAssessment = { ...d.immunologicalAssessment, donorBloodGroup: 'B+', aboCompatibility: 'pending', crossmatchResult: 'pending', pra: 0, donorSpecificAntibodies: 'no' };
	d.surgicalAssessment = { ...d.surgicalAssessment, asaGrade: 'III', surgicalFitness: 'normal', smokingStatus: 'ex', alcoholUse: 'moderate' };
	d.eligibilityAllocation = { ...d.eligibilityAllocation, eligibilityDecision: 'conditionally-suitable', eligibilityConditions: 'Extended NAT viral screening; allocate kidneys to consenting recipients with informed risk discussion', assessorName: 'Dr L. Owusu', assessmentDate: '2026-06-14' };
	return d;
}

/** Unsuitable / critical: absolute contraindication (active malignancy + ABO incompatibility). */
function unsuitableCritical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Doyle', dateOfBirth: '1949-03-30', sex: 'female', weight: 68, height: 160, bmi: 26.6, ethnicity: 'White Irish' };
	d.donorTypeRegistration = { ...d.donorTypeRegistration, donorType: 'living', registeredOnDonorRegister: 'no', recipientRelationship: 'child', recipientName: 'Sean Doyle', previousDonation: 'no', intendedOrgans: 'Liver lobe' };
	d.medicalHistory = { ...d.medicalHistory, hasMalignancy: 'yes', malignancyDetails: 'Active colorectal carcinoma, under treatment', hasCnsMalignancy: 'no', hasHypertension: 'yes' };
	d.organFunction = { ...d.organFunction, creatinine: 90, egfr: 72, alt: 40, ejectionFraction: 56, echocardiogram: 'normal' };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'negative', hbsAg: 'negative', hcvAb: 'negative', syphilisScreen: 'negative', tuberculosisScreen: 'negative' };
	d.immunologicalAssessment = { ...d.immunologicalAssessment, donorBloodGroup: 'A+', recipientBloodGroup: 'B+', aboCompatibility: 'incompatible', crossmatchResult: 'incompatible', pra: 60, donorSpecificAntibodies: 'yes', dsaDetails: 'Anti-B DSA, high MFI' };
	d.surgicalAssessment = { ...d.surgicalAssessment, asaGrade: 'III', surgicalFitness: 'abnormal', surgicalFitnessNotes: 'Active oncological treatment', smokingStatus: 'ex', alcoholUse: 'none' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, mentalCapacityConfirmed: 'yes', understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', ambivalence: 'no', willingToProceed: 'yes', supportNetwork: 'yes' };
	d.ethicalLegalRequirements = { ...d.ethicalLegalRequirements, htaAct2004Compliant: 'yes', independentAssessorReview: 'no', informedConsentGiven: 'no', consentFormSigned: 'no', financialRewardCheck: 'yes' };
	d.eligibilityAllocation = { ...d.eligibilityAllocation, eligibilityDecision: 'unsuitable', deferralReason: 'Active malignancy and ABO incompatibility — absolute contraindications', deferralDuration: 'permanent', assessorName: 'Dr L. Owusu', assessmentDate: '2026-06-17' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OD-2026-0001', donorName: 'Khan, Aisha', assessedDate: '2026-06-08', data: suitableLowRisk() },
	{ id: 'OD-2026-0002', donorName: 'Wright, George', assessedDate: '2026-06-11', data: conditionalModerate() },
	{ id: 'OD-2026-0003', donorName: 'Nowak, Tomasz', assessedDate: '2026-06-14', data: conditionalHigh() },
	{ id: 'OD-2026-0004', donorName: 'Doyle, Margaret', assessedDate: '2026-06-17', data: unsuitableCritical() }
];

/** Whether any infectious-disease screen returned positive. */
function hasInfectionPositive(d: AssessmentData): boolean {
	const id = d.infectiousDiseaseScreening;
	return (
		[
			id.hivStatus,
			id.hbsAg,
			id.hbcAb,
			id.hcvAb,
			id.htlvStatus,
			id.cmvStatus,
			id.ebvStatus,
			id.syphilisScreen,
			id.toxoplasmaStatus,
			id.tuberculosisScreen
		].some((v) => v === 'positive')
	);
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeDonor(s.data);
	return {
		id: s.id,
		donorName: s.donorName,
		assessedDate: s.assessedDate,
		donorType: s.data.donorTypeRegistration.donorType,
		eligibility: g.eligibility,
		riskLevel: g.riskLevel,
		infectionFlag: hasInfectionPositive(s.data),
		immunoFlag:
			s.data.immunologicalAssessment.aboCompatibility === 'incompatible' ||
			s.data.immunologicalAssessment.crossmatchResult === 'incompatible',
		flagCount: g.additionalFlags.length
	};
});
