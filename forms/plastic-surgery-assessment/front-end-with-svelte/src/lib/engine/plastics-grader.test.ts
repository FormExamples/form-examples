import { describe, it, expect } from 'vitest';
import { calculatePlasticsGrade } from './plastics-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { plasticsRules } from './plastics-rules';
import type { AssessmentData } from './types';

/** A blank assessment with all fields at their unanswered defaults. */
function blank(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null },
		reasonForReferral: {
			referralType: '', referralTypeOther: '', urgency: '', primaryComplaint: '', affectedBodyArea: '',
			affectedBodyAreaOther: '', laterality: '', durationOfCondition: '', previousConsultations: '', previousConsultationsDetails: ''
		},
		medicalSurgicalHistory: {
			previousPlasticSurgery: '', previousPlasticSurgeryDetails: '', previousGeneralSurgery: '', previousGeneralSurgeryDetails: '',
			woundHealingProblems: '', woundHealingDetails: '', keloidScarring: '', scarringDetails: '', diabetes: '', diabetesControlled: '',
			hypertension: '', cardiacDisease: '', cardiacDiseaseDetails: '', respiratoryDisease: '', respiratoryDiseaseDetails: '',
			autoimmuneDisease: '', autoimmuneDiseaseDetails: '', bleedingDisorder: '', bleedingDisorderDetails: '', immunosuppressed: '',
			immunosuppressedDetails: '', cancerHistory: '', cancerHistoryDetails: ''
		},
		currentCondition: {
			conditionCategory: '', conditionDescription: '', lesionLengthMm: null, lesionWidthMm: null, lesionDepthMm: null,
			tissueLoss: '', tissueLossPercentage: null, functionalImpairment: '', functionalImpairmentDetails: '', painLevel: null,
			cosmeticConcern: '', impactOnDailyActivities: ''
		},
		woundTissueAssessment: {
			hasOpenWound: '', woundClassification: '', woundAge: '', woundAetiology: '', woundBedTissue: '', woundExudate: '',
			woundInfectionSigns: '', woundInfectionDetails: '', tissueViability: '', surroundingSkin: '', vascularSupply: '',
			sensoryStatus: '', previousWoundTreatments: ''
		},
		psychologicalAssessment: {
			bodyDysmorphicConcern: '', bodyDysmorphicDetails: '', realisticExpectations: '', expectationsDetails: '', motivation: '',
			motivationOther: '', previousMentalHealth: '', mentalHealthDetails: '', anxietyLevel: '', depressionScreen: '',
			socialImpact: '', socialImpactDetails: '', psychologicalReferralNeeded: ''
		},
		anaestheticRisk: {
			asaClass: '', previousAnaesthetic: '', anaestheticComplications: '', anaestheticComplicationsDetails: '', difficultAirway: '',
			difficultAirwayDetails: '', malignantHyperthermiaRisk: '', familyAnaestheticProblems: '', familyAnaestheticDetails: '',
			smokingStatus: '', packYears: null, alcoholConsumption: '', recreationalDrugs: '', recreationalDrugsDetails: '',
			obstructiveSleepApnoea: '', anaestheticPreference: ''
		},
		photographyDocumentation: {
			clinicalPhotosTaken: '', photoConsentObtained: '', numberOfPhotos: null, photoViewsTaken: '', standardisedViews: '',
			measurementsRecorded: '', measurementDetails: '', diagramsDrawn: '', diagramNotes: '', previousImaging: '',
			previousImagingType: '', previousImagingFindings: ''
		},
		medicationsAllergies: {
			onAnticoagulants: '', anticoagulantDetails: '', onAntiplatelets: '', antiplateletDetails: '', onSteroids: '', steroidDetails: '',
			onImmunosuppressants: '', immunosuppressantDetails: '', onChemotherapy: '', chemotherapyDetails: '', onHormoneTherapy: '',
			hormoneTherapyDetails: '', otherMedications: '', hasDrugAllergies: '', allergies: [], latexAllergy: '', adhesiveAllergy: '', otherAllergies: ''
		},
		procedurePlanningConsent: {
			proposedProcedure: '', procedureComplexity: '', surgicalApproach: '', expectedDurationMinutes: null, expectedHospitalStay: '',
			flapType: '', implantRequired: '', implantDetails: '', vteRisk: '', antibioticProphylaxis: '', anticipatedRisks: '',
			alternativeTreatments: '', consentDiscussion: '', consentFormSigned: '', coolingOffPeriodOffered: '', followUpPlan: ''
		}
	};
}

function lowRiskPatient(): AssessmentData {
	const d = blank();
	d.demographics = { ...d.demographics, firstName: 'Low', lastName: 'Risk', dateOfBirth: '1990-01-01', sex: 'female' };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'aesthetic', urgency: 'elective' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, woundClassification: 'clean', tissueViability: 'viable', vascularSupply: 'adequate' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '1', smokingStatus: 'never' };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, procedureComplexity: '1', consentFormSigned: 'yes' };
	return d;
}

function criticalPatient(): AssessmentData {
	const d = blank();
	d.demographics = { ...d.demographics, firstName: 'High', lastName: 'Risk', dateOfBirth: '1955-01-01', sex: 'male' };
	d.reasonForReferral = { ...d.reasonForReferral, referralType: 'trauma', urgency: 'emergency' };
	d.woundTissueAssessment = { ...d.woundTissueAssessment, woundClassification: 'dirty', woundInfectionSigns: 'yes', tissueViability: 'non-viable', vascularSupply: 'absent' };
	d.anaestheticRisk = { ...d.anaestheticRisk, asaClass: '4', difficultAirway: 'yes', malignantHyperthermiaRisk: 'yes', smokingStatus: 'current' };
	d.procedurePlanningConsent = { ...d.procedurePlanningConsent, procedureComplexity: '4', consentFormSigned: 'no' };
	return d;
}

describe('calculatePlasticsGrade', () => {
	it('grades a healthy elective patient as low risk', () => {
		const result = calculatePlasticsGrade(lowRiskPatient());
		expect(result.asaClass).toBe(1);
		expect(result.woundClass).toBe(1);
		expect(result.complexityScore).toBe(1);
		expect(result.overallRisk).toBe('low');
	});

	it('grades an emergency dirty-wound ASA IV patient as critical', () => {
		const result = calculatePlasticsGrade(criticalPatient());
		expect(result.asaClass).toBe(4);
		expect(result.woundClass).toBe(4);
		expect(result.complexityScore).toBe(4);
		expect(result.overallRisk).toBe('critical');
	});

	it('returns a timestamp and fired rules array', () => {
		const result = calculatePlasticsGrade(lowRiskPatient());
		expect(typeof result.timestamp).toBe('string');
		expect(Array.isArray(result.firedRules)).toBe(true);
	});
});

describe('detectAdditionalFlags', () => {
	it('flags emergency referral, difficult airway, and MH risk as high priority', () => {
		const flags = detectAdditionalFlags(criticalPatient());
		const ids = flags.map((f) => f.id);
		expect(ids).toContain('FLAG-EMERG-001');
		expect(ids).toContain('FLAG-AIRWAY-001');
		expect(ids).toContain('FLAG-MH-001');
		expect(flags.every((f) => ['high', 'medium', 'low'].includes(f.priority))).toBe(true);
	});

	it('produces no flags for a clean low-risk patient', () => {
		const flags = detectAdditionalFlags(lowRiskPatient());
		expect(flags.length).toBe(0);
	});
});

describe('plasticsRules', () => {
	it('every rule has a unique id', () => {
		const ids = plasticsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
