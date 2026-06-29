import type { AssessmentData, ValidityStatus } from '$lib/engine/types';
import { calculateValidity } from '$lib/engine/validity-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
import { hasLifeSustainingRefusal } from '$lib/engine/utils';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample ADRT: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	createdDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	createdDate: string;
	validityStatus: ValidityStatus;
	lifeSustainingRefusal: boolean;
	witnessed: boolean;
	flagCount: number;
}

/**
 * A fully valid ADRT: capacity confirmed, life-sustaining refusal correctly
 * witnessed with the "even if life is at risk" statement, signed and reviewed.
 */
function validAdrt(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullLegalName: 'Margaret Eleanor Hughes',
		dateOfBirth: '1948-03-14',
		nhsNumber: '943 476 5919',
		address: '12 Orchard Lane, Bristol',
		postcode: 'BS1 4ST',
		telephone: '0117 555 0101',
		email: 'm.hughes@example.com',
		gpName: 'Dr A Okafor',
		gpPractice: 'Orchard Surgery',
		gpAddress: '1 Orchard Lane, Bristol',
		gpTelephone: '0117 555 0199'
	};
	d.capacityDeclaration = {
		...d.capacityDeclaration,
		confirmsCapacity: 'yes',
		understandsConsequences: 'yes',
		noUndueInfluence: 'yes',
		professionalCapacityAssessment: 'yes',
		assessedByName: 'Dr A Okafor',
		assessedByRole: 'General Practitioner',
		assessmentDate: '2026-05-02',
		assessmentDetails: 'Capacity assessed and confirmed under MCA 2005.'
	};
	d.circumstances = {
		...d.circumstances,
		specificCircumstances: 'If I have advanced, irreversible disease with no prospect of recovery.',
		medicalConditions: 'Metastatic breast cancer',
		situationsDescription: 'When I am unable to communicate my wishes.'
	};
	d.treatmentsRefusedGeneral = {
		...d.treatmentsRefusedGeneral,
		antibiotics: { treatment: 'Antibiotics', refused: 'yes', specification: 'For life-threatening infection only.' }
	};
	d.treatmentsRefusedLifeSustaining = {
		...d.treatmentsRefusedLifeSustaining,
		cpr: { treatment: 'CPR', refused: 'yes', evenIfLifeAtRisk: 'yes', specification: 'I do not want resuscitation.' }
	};
	d.exceptionsConditions = { ...d.exceptionsConditions, hasExceptions: 'no', hasTimeLimitations: 'no' };
	d.healthcareProfessionalReview = {
		...d.healthcareProfessionalReview,
		reviewedByClinicianName: 'Dr A Okafor',
		reviewedByClinicianRole: 'General Practitioner',
		reviewDate: '2026-05-02',
		clinicalOpinionOnCapacity: 'Has capacity; decision is settled and informed.',
		anyConcerns: 'no'
	};
	d.legalSignatures = {
		...d.legalSignatures,
		patientSignature: 'yes',
		patientStatementOfUnderstanding: 'yes',
		patientSignatureDate: '2026-05-02',
		witnessSignature: 'yes',
		witnessName: 'Sarah Hughes',
		witnessAddress: '12 Orchard Lane, Bristol',
		witnessSignatureDate: '2026-05-02',
		lifeSustainingWrittenStatement: 'yes',
		lifeSustainingStatementText: 'I refuse this treatment even if my life is at risk.',
		lifeSustainingSignature: 'yes',
		lifeSustainingWitnessSignature: 'yes',
		lifeSustainingWitnessName: 'Sarah Hughes',
		lifeSustainingWitnessAddress: '12 Orchard Lane, Bristol'
	};
	return d;
}

/**
 * A complete ADRT (all required sections filled, only recommendations
 * outstanding): general refusals, signed and witnessed, but no professional
 * capacity assessment and no HCP review.
 */
function completeAdrt(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullLegalName: 'David John Reynolds',
		dateOfBirth: '1955-11-22',
		nhsNumber: '912 345 6789',
		address: '4 Meadow Close, Leeds',
		postcode: 'LS2 9JT',
		telephone: '0113 555 0123',
		gpName: 'Dr B Shah',
		gpPractice: 'Meadow Medical Centre'
	};
	d.capacityDeclaration = {
		...d.capacityDeclaration,
		confirmsCapacity: 'yes',
		understandsConsequences: 'yes',
		noUndueInfluence: 'yes',
		professionalCapacityAssessment: 'no'
	};
	d.circumstances = {
		...d.circumstances,
		specificCircumstances: 'If I am permanently unconscious with no prospect of recovery.'
	};
	d.treatmentsRefusedGeneral = {
		...d.treatmentsRefusedGeneral,
		bloodTransfusion: { treatment: 'Blood Transfusion', refused: 'yes', specification: 'On religious grounds.' },
		dialysis: { treatment: 'Dialysis', refused: 'yes', specification: '' }
	};
	d.exceptionsConditions = { ...d.exceptionsConditions, hasExceptions: 'no', hasTimeLimitations: 'no' };
	d.legalSignatures = {
		...d.legalSignatures,
		patientSignature: 'yes',
		patientStatementOfUnderstanding: 'yes',
		patientSignatureDate: '2026-05-10',
		witnessSignature: 'yes',
		witnessName: 'Helen Reynolds',
		witnessAddress: '4 Meadow Close, Leeds',
		witnessSignatureDate: '2026-05-10'
	};
	return d;
}

/**
 * An invalid ADRT: refuses a life-sustaining treatment but is missing the
 * witness signature and the "even if life is at risk" written statement, so it
 * is not legally valid for life-sustaining treatment.
 */
function invalidAdrt(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = {
		...d.personalInformation,
		fullLegalName: 'Priya Anand Patel',
		dateOfBirth: '1962-07-08',
		address: '88 Station Road, Manchester',
		postcode: 'M1 2WX'
	};
	d.capacityDeclaration = {
		...d.capacityDeclaration,
		confirmsCapacity: 'yes',
		understandsConsequences: 'yes',
		noUndueInfluence: 'yes'
	};
	d.circumstances = {
		...d.circumstances,
		specificCircumstances: 'If I develop end-stage dementia and cannot recognise my family.'
	};
	d.treatmentsRefusedLifeSustaining = {
		...d.treatmentsRefusedLifeSustaining,
		artificialNutritionHydration: {
			treatment: 'Artificial Nutrition/Hydration',
			refused: 'yes',
			evenIfLifeAtRisk: 'yes',
			specification: 'I do not want clinically assisted nutrition.'
		}
	};
	d.legalSignatures = {
		...d.legalSignatures,
		patientSignature: 'yes',
		patientStatementOfUnderstanding: 'yes',
		patientSignatureDate: '2026-05-14'
		// No witness, no life-sustaining witness, no written statement -> invalid.
	};
	return d;
}

/** A draft ADRT: almost nothing filled in, still in progress. */
function draftAdrt(): AssessmentData {
	const d = createDefaultAssessment();
	d.personalInformation = { ...d.personalInformation, fullLegalName: '', dateOfBirth: '' };
	return d;
}

/** The sample ADRTs, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ADRT-2026-0001', patientName: 'Hughes, Margaret', createdDate: '2026-05-02', data: validAdrt() },
	{ id: 'ADRT-2026-0002', patientName: 'Reynolds, David', createdDate: '2026-05-10', data: completeAdrt() },
	{ id: 'ADRT-2026-0003', patientName: 'Patel, Priya', createdDate: '2026-05-14', data: invalidAdrt() },
	{ id: 'ADRT-2026-0004', patientName: 'Draft (in progress)', createdDate: '2026-05-18', data: draftAdrt() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { validityStatus } = calculateValidity(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		createdDate: s.createdDate,
		validityStatus,
		lifeSustainingRefusal: hasLifeSustainingRefusal(s.data),
		witnessed: s.data.legalSignatures.witnessSignature === 'yes',
		flagCount: flags.length
	};
});
