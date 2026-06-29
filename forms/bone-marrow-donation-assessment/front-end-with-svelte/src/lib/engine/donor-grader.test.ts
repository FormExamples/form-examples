import { describe, it, expect } from 'vitest';
import { calculateDonorGrade } from './donor-grader';
import type { AssessmentData } from './types';

/** A blank assessment built inline (no store import — keeps vitest free of $app). */
function base(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null },
		donorRegistrationHlaTyping: {
			donorRegistry: '', donorRegistryId: '', registrationDate: '', donationType: '', recipientRelationship: '',
			hlaA: '', hlaB: '', hlaC: '', hlaDrb1: '', hlaDqb1: '', hlaDpb1: '', hlaMatchLevel: '',
			crossmatchResult: '', previousDonation: '', previousDonationDetails: ''
		},
		medicalHistory: {
			hasAutoimmuneDisease: '', autoimmuneDetails: '', hasMalignancy: '', malignancyDetails: '',
			hasCardiovascularDisease: '', cardiovascularDetails: '', hasRespiratoryDisease: '', respiratoryDetails: '',
			hasRenalDisease: '', renalDetails: '', hasHepaticDisease: '', hepaticDetails: '', hasBleedingDisorder: '',
			bleedingDisorderDetails: '', hasNeurologicalCondition: '', neurologicalDetails: '', currentMedications: '',
			drugAllergies: '', previousSurgery: '', surgeryDetails: ''
		},
		physicalExamination: {
			bpSystolic: null, bpDiastolic: null, heartRate: null, temperature: null, respiratoryRate: null,
			oxygenSaturation: null, generalAppearance: '', cardiovascularExamination: '', cardiovascularFindings: '',
			respiratoryExamination: '', respiratoryFindings: '', abdominalExamination: '', abdominalFindings: '',
			venousAccessAssessment: '', posteriorIliacCrestAssessment: ''
		},
		haematologicalAssessment: {
			haemoglobin: null, whiteCellCount: null, plateletCount: null, neutrophilCount: null, lymphocyteCount: null,
			haematocrit: null, mcv: null, bloodGroup: '', coagulationScreen: '', coagulationDetails: '', ferritin: null,
			creatinine: null, liverFunction: '', liverFunctionDetails: ''
		},
		infectiousDiseaseScreening: {
			hivStatus: '', hepatitisBSurfaceAntigen: '', hepatitisBCoreAntibody: '', hepatitisCAbntibody: '', htlvStatus: '',
			syphilisScreen: '', cmvStatus: '', ebvStatus: '', toxoplasmaStatus: '', tuberculosisScreen: '', recentTravel: '',
			travelDetails: '', recentInfection: '', infectionDetails: '', vaccinationUpToDate: ''
		},
		anaestheticAssessment: {
			asaGrade: '', previousAnaesthetic: '', anaestheticComplications: '', complicationDetails: '',
			familyAnaestheticProblems: '', familyProblemDetails: '', mallampatiScore: '', airwayConcerns: '', airwayDetails: '',
			nilByMouthConfirmed: '', smokingStatus: '', alcoholUse: '', anaestheticPlan: ''
		},
		collectionMethodAssessment: {
			preferredMethod: '', recipientPreference: '', finalCollectionMethod: '', gcsfEligible: '', gcsfContraindications: '',
			venousAccessSuitableForApheresis: '', centralLineRequired: '', estimatedDonorWeightKg: null, targetCd34Dose: null,
			estimatedCollectionDays: null, boneMarrowHarvestVolumeMl: null, autologousBloodDonation: ''
		},
		psychologicalReadiness: {
			understandsProcedure: '', understandsRisks: '', voluntaryDecision: '', coercionConcerns: '', coercionDetails: '',
			anxietyAboutProcedure: '', previousPsychologicalIssues: '', psychologicalIssueDetails: '', supportNetwork: '',
			timeOffWorkArranged: '', donorAdvocateConsulted: '', willingToProceed: ''
		},
		consentEligibility: {
			informedConsentGiven: '', consentFormSigned: '', consentDate: '', witnessName: '', witnessRole: '',
			informationLeafletProvided: '', questionsAnswered: '', eligibilityDecision: '', eligibilityConditions: '',
			deferralReason: '', deferralDuration: '', assessorName: '', assessorRole: '', assessmentDate: ''
		}
	};
}

describe('calculateDonorGrade', () => {
	it('grades an ideal donor as suitable / low risk', () => {
		const d = base();
		d.donorRegistrationHlaTyping.hlaMatchLevel = '10-of-10';
		d.anaestheticAssessment.asaGrade = 'I';
		const g = calculateDonorGrade(d);
		expect(g.overallRisk).toBe('low');
		expect(g.eligibility).toBe('suitable');
	});

	it('fires HLA and anaesthetic rules and derives moderate risk for a 9/10 ASA II donor', () => {
		const d = base();
		d.donorRegistrationHlaTyping.hlaMatchLevel = '9-of-10';
		d.anaestheticAssessment.asaGrade = 'II';
		const g = calculateDonorGrade(d);
		expect(g.firedRules.some((r) => r.id === 'HLA-002')).toBe(true);
		expect(g.overallRisk).toBe('moderate');
		expect(g.eligibility).toBe('conditionally-suitable');
	});

	it('grades a critical contraindication as critical risk / unsuitable', () => {
		const d = base();
		d.infectiousDiseaseScreening.hivStatus = 'positive';
		const g = calculateDonorGrade(d);
		expect(g.overallRisk).toBe('critical');
		expect(g.eligibility).toBe('unsuitable');
		expect(g.firedRules.some((r) => r.id === 'ID-001')).toBe(true);
	});

	it('honours an explicit eligibility decision over the derived value', () => {
		const d = base();
		d.donorRegistrationHlaTyping.hlaMatchLevel = '10-of-10';
		d.consentEligibility.eligibilityDecision = 'unsuitable';
		const g = calculateDonorGrade(d);
		expect(g.eligibility).toBe('unsuitable');
	});

	it('reports a positive crossmatch as a high-priority flag', () => {
		const d = base();
		d.donorRegistrationHlaTyping.crossmatchResult = 'positive';
		const g = calculateDonorGrade(d);
		expect(g.additionalFlags.some((f) => f.id === 'FLAG-XM-001' && f.priority === 'high')).toBe(true);
	});

	it('exposes the HLA match and collection method labels', () => {
		const d = base();
		d.donorRegistrationHlaTyping.hlaMatchLevel = '8-of-10';
		d.collectionMethodAssessment.finalCollectionMethod = 'bone-marrow';
		const g = calculateDonorGrade(d);
		expect(g.hlaMatchLevel).toContain('8/10');
		expect(g.collectionMethod).toContain('Bone Marrow');
	});
});
