import { describe, it, expect } from 'vitest';
import { gradeDonor } from './donation-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { donationRules } from './donation-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment with all fields at their unanswered defaults. Defined
 * locally (rather than importing the store's `createDefaultAssessment`) so the
 * engine tests stay free of `$app` and Svelte-runes module dependencies.
 */
function blankAssessment(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null, ethnicity: '' },
		donorTypeRegistration: { donorType: '', registeredOnDonorRegister: '', registryName: '', registrationDate: '', recipientRelationship: '', recipientName: '', previousDonation: '', previousDonationDetails: '', intendedOrgans: '' },
		medicalHistory: { hasMalignancy: '', malignancyDetails: '', hasCnsMalignancy: '', hasAutoimmuneDisease: '', autoimmuneDetails: '', hasDiabetes: '', diabetesDetails: '', hasHypertension: '', hypertensionDetails: '', hasCardiovascularDisease: '', cardiovascularDetails: '', hasActiveInfection: '', activeInfectionDetails: '', hasUncontrolledSepsis: '', hasCjdRisk: '', cjdDetails: '', ivDrugUseHistory: '', currentMedications: '', previousSurgery: '', surgeryDetails: '' },
		organFunction: { creatinine: null, egfr: null, kidneyImaging: '', kidneyNotes: '', alt: null, ast: null, bilirubin: null, liverImaging: '', liverNotes: '', ejectionFraction: null, echocardiogram: '', cardiacNotes: '', pao2Fio2Ratio: null, chestImaging: '', pulmonaryNotes: '', fastingGlucose: null, hba1c: null, pancreaticNotes: '', severeOrganFailure: '', severeOrganFailureDetails: '' },
		infectiousDiseaseScreening: { hivStatus: '', hbsAg: '', hbcAb: '', hcvAb: '', htlvStatus: '', cmvStatus: '', ebvStatus: '', syphilisScreen: '', toxoplasmaStatus: '', tuberculosisScreen: '', recentTravel: '', travelDetails: '', recentInfection: '', infectionDetails: '' },
		immunologicalAssessment: { donorBloodGroup: '', recipientBloodGroup: '', aboCompatibility: '', hlaA: '', hlaB: '', hlaC: '', hlaDr: '', hlaDq: '', hlaDp: '', hlaMatchLevel: '', crossmatchResult: '', pra: null, donorSpecificAntibodies: '', dsaDetails: '' },
		surgicalAssessment: { asaGrade: '', previousAnaesthetic: '', anaestheticComplications: '', complicationDetails: '', mallampatiScore: '', airwayConcerns: '', airwayDetails: '', surgicalFitness: '', surgicalFitnessNotes: '', plannedProcedure: '', smokingStatus: '', alcoholUse: '' },
		psychologicalAssessment: { mentalCapacityConfirmed: '', understandsProcedure: '', understandsRisks: '', voluntaryDecision: '', coercionConcerns: '', coercionDetails: '', ambivalence: '', ambivalenceDetails: '', anxietyAboutProcedure: '', previousPsychologicalIssues: '', psychologicalIssueDetails: '', supportNetwork: '', willingToProceed: '' },
		ethicalLegalRequirements: { htaAct2004Compliant: '', independentAssessorReview: '', independentAssessorName: '', independentAssessorDate: '', informedConsentGiven: '', consentFormSigned: '', consentDate: '', witnessName: '', witnessRole: '', informationLeafletProvided: '', questionsAnswered: '', financialRewardCheck: '', ethicsCommitteeApproval: '', ethicsApprovalReference: '' },
		eligibilityAllocation: { eligibilityDecision: '', eligibilityConditions: '', deferralReason: '', deferralDuration: '', allocatedOrgans: '', intendedRecipientCentre: '', assessorName: '', assessorRole: '', assessmentDate: '', additionalNotes: '' }
	};
}

/** An ideal living donor: ASA I, all screens negative, consent complete. */
function createIdealLivingDonor(): AssessmentData {
	const d = blankAssessment();
	d.demographics = { ...d.demographics, firstName: 'Alex', lastName: 'Ng', dateOfBirth: '1985-03-10', sex: 'male', weight: 75, height: 180, bmi: 23.1 };
	d.donorTypeRegistration = { ...d.donorTypeRegistration, donorType: 'living', registeredOnDonorRegister: 'yes' };
	d.organFunction = { ...d.organFunction, egfr: 100, alt: 25, ejectionFraction: 60 };
	d.infectiousDiseaseScreening = { ...d.infectiousDiseaseScreening, hivStatus: 'negative', hbsAg: 'negative', hcvAb: 'negative' };
	d.immunologicalAssessment = { ...d.immunologicalAssessment, aboCompatibility: 'compatible', crossmatchResult: 'compatible' };
	d.surgicalAssessment = { ...d.surgicalAssessment, asaGrade: 'I' };
	d.psychologicalAssessment = { ...d.psychologicalAssessment, mentalCapacityConfirmed: 'yes', understandsProcedure: 'yes', understandsRisks: 'yes', voluntaryDecision: 'yes', coercionConcerns: 'no', ambivalence: 'no', willingToProceed: 'yes', supportNetwork: 'yes' };
	d.ethicalLegalRequirements = { ...d.ethicalLegalRequirements, htaAct2004Compliant: 'yes', independentAssessorReview: 'yes', informedConsentGiven: 'yes', consentFormSigned: 'yes', financialRewardCheck: 'yes', questionsAnswered: 'yes', ethicsCommitteeApproval: 'yes' };
	return d;
}

describe('Organ Donation Grading Engine', () => {
	it('classifies an ideal donor as suitable / low risk with no penalty rules', () => {
		const result = gradeDonor(createIdealLivingDonor());
		expect(result.suggestedEligibility).toBe('suitable');
		expect(result.eligibility).toBe('suitable');
		expect(result.riskLevel).toBe('low');
		// Only the positive ASA-I ideal-donor marker fires; it is excluded from penalties.
		expect(result.firedRules.every((r) => r.id === 'SU-001')).toBe(true);
	});

	it('classifies a Grade-2 finding as conditionally-suitable / moderate', () => {
		const d = createIdealLivingDonor();
		d.medicalHistory.hasDiabetes = 'yes';
		const result = gradeDonor(d);
		expect(result.suggestedEligibility).toBe('conditionally-suitable');
		expect(result.riskLevel).toBe('moderate');
	});

	it('classifies a Grade-3 finding as conditionally-suitable / high', () => {
		const d = createIdealLivingDonor();
		d.organFunction.egfr = 45; // OF-002 grade 3
		const result = gradeDonor(d);
		expect(result.suggestedEligibility).toBe('conditionally-suitable');
		expect(result.riskLevel).toBe('high');
	});

	it('classifies a Grade-4 contraindication as unsuitable / critical', () => {
		const d = createIdealLivingDonor();
		d.infectiousDiseaseScreening.hivStatus = 'positive'; // ID-001 grade 4
		const result = gradeDonor(d);
		expect(result.suggestedEligibility).toBe('unsuitable');
		expect(result.riskLevel).toBe('critical');
	});

	it('honours an explicit assessor eligibility decision while preserving risk', () => {
		const d = createIdealLivingDonor();
		d.medicalHistory.hasDiabetes = 'yes'; // moderate risk
		d.eligibilityAllocation.eligibilityDecision = 'unsuitable';
		const result = gradeDonor(d);
		expect(result.eligibility).toBe('unsuitable');
		expect(result.suggestedEligibility).toBe('conditionally-suitable');
		expect(result.riskLevel).toBe('moderate');
	});

	it('has unique rule IDs', () => {
		const ids = donationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Organ Donation Flagged Issues Detection', () => {
	it('raises no flags for an ideal donor', () => {
		expect(detectAdditionalFlags(createIdealLivingDonor())).toHaveLength(0);
	});

	it('flags a positive HIV screen as high priority', () => {
		const d = createIdealLivingDonor();
		d.infectiousDiseaseScreening.hivStatus = 'positive';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-ID-hivStatus' && f.priority === 'high')).toBe(true);
	});

	it('flags coercion concerns for a living donor', () => {
		const d = createIdealLivingDonor();
		d.psychologicalAssessment.coercionConcerns = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-PS-001')).toBe(true);
	});

	it('does not raise living-donor psychological flags for deceased donors', () => {
		const d = createIdealLivingDonor();
		d.donorTypeRegistration.donorType = 'deceased';
		d.psychologicalAssessment.coercionConcerns = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-PS-001')).toBe(false);
	});

	it('sorts flags high → medium → low', () => {
		const d = createIdealLivingDonor();
		d.infectiousDiseaseScreening.hivStatus = 'positive'; // high
		d.medicalHistory.hasDiabetes = 'yes'; // medium
		d.medicalHistory.hasHypertension = 'yes'; // low
		const flags = detectAdditionalFlags(d);
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
