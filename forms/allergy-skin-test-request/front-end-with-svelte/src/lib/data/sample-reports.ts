import type {
	RequestData,
	AppropriatenessBand,
	ValidityBand,
	TriageTier,
	Recommendation
} from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: RequestData;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	testType: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	validitySafetyBand: ValidityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	recommendationLabel: string;
	flagCount: number;
}

/** Accept / OK / routine: well-formed food-allergy skin-prick request. */
function acceptable(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr A. Okafor', clinicianRole: 'gp', registrationBody: 'GMC', registrationNumber: '7012345', siteName: 'Riverside Surgery', referralDate: '2026-06-10' };
	d.patient = { ...d.patient, firstName: 'John', lastName: 'Smith', dateOfBirth: '1990-04-12', nhsNumber: '485 777 3456' };
	d.test = { ...d.test, testType: 'skin-prick-test', allergenFood: true, allergenAeroallergens: true };
	d.indication = { ...d.indication, primaryIndication: 'suspected-food-allergy', clinicalQuestion: 'Confirm or exclude IgE-mediated peanut allergy.', clinicalDetails: 'Lip swelling and urticaria minutes after peanut exposure.' };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** Caution / urgent: anaphylaxis investigation with beta-blocker. */
function caution(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr P. Nair', clinicianRole: 'hospital-doctor', registrationBody: 'GMC', registrationNumber: '7098765', siteName: 'City Hospital', referralDate: '2026-06-12' };
	d.patient = { ...d.patient, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', nhsNumber: '485 111 2233' };
	d.test = { ...d.test, testType: 'skin-prick-test', allergenVenom: true };
	d.indication = { ...d.indication, primaryIndication: 'anaphylaxis-investigation', clinicalQuestion: 'Identify the trigger of a systemic reaction after a wasp sting.', clinicalDetails: 'Collapse and wheeze after a wasp sting; adrenaline given in ED.' };
	d.safety = { ...d.safety, previousAnaphylaxis: true, onBetaBlocker: true };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** Contraindicated / redirect: antihistamines invalidate the requested skin test. */
function contraindicated(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr L. Brown', clinicianRole: 'dermatologist', registrationBody: 'GMC', registrationNumber: '7055512', siteName: 'Dermatology Clinic', referralDate: '2026-06-15' };
	d.patient = { ...d.patient, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1972-01-22', nhsNumber: '485 909 8877' };
	d.test = { ...d.test, testType: 'skin-prick-test', allergenAeroallergens: true };
	d.indication = { ...d.indication, primaryIndication: 'rhinitis-asthma', clinicalQuestion: 'Identify aeroallergen sensitisation driving persistent rhinitis.', clinicalDetails: 'Year-round rhinitis; currently taking daily cetirizine.' };
	d.safety = { ...d.safety, onAntihistamines: true, currentSkinDisease: true };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** Query-referrer: mismatched test type for the indication, sparse details. */
function queryReferrer(): RequestData {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr D. Williams', clinicianRole: 'gp', registrationBody: 'GMC', registrationNumber: '7033321', siteName: 'Hillside Practice', referralDate: '2026-06-18' };
	d.patient = { ...d.patient, firstName: 'David', lastName: 'Williams', dateOfBirth: '1985-11-03' };
	d.test = { ...d.test, testType: 'specific-ige-blood', allergenContact: true };
	d.indication = { ...d.indication, primaryIndication: 'contact-dermatitis', clinicalQuestion: 'Identify the contact allergen causing a hand rash.' };
	d.triage = { ...d.triage, urgency: 'routine' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'AS-2026-0001', patientName: 'Smith, John', referralDate: '2026-06-10', data: acceptable() },
	{ id: 'AS-2026-0002', patientName: 'Patel, Priya', referralDate: '2026-06-12', data: caution() },
	{ id: 'AS-2026-0003', patientName: 'Jones, Margaret', referralDate: '2026-06-15', data: contraindicated() },
	{ id: 'AS-2026-0004', patientName: 'Williams, David', referralDate: '2026-06-18', data: queryReferrer() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		testType: s.data.test.testType,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		validitySafetyBand: g.validitySafetyBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		recommendationLabel: g.recommendationLabel,
		flagCount: g.flags.length
	};
});
