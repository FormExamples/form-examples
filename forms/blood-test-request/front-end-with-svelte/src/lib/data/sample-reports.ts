import type { BloodTestRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patient: string;
	nhs: string;
	referralDate: string;
	request: BloodTestRequest;
}

/**
 * A routine, appropriate monitoring request: FBC + U&E + LFT for an annual
 * review with full clinical context. Grades to accept / routine.
 */
function routineMonitoring(): BloodTestRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr H Iqbal',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'h.iqbal@nhs.net',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-05-04'
	};
	d.patient = {
		firstName: 'Amara',
		lastName: 'Okafor',
		dateOfBirth: '1962-08-19',
		nhsNumber: '401 234 5678'
	};
	d.panels.fullBloodCount = true;
	d.panels.ureaElectrolytes = true;
	d.panels.liverFunction = true;
	d.clinical = {
		primaryIndication: 'routine-monitoring',
		clinicalDetails: 'Annual review of long-term hypertension; stable on treatment.',
		relevantMedications: 'Ramipril 5 mg OD, amlodipine 5 mg OD.'
	};
	d.triage.urgency = 'routine';
	d.triage.setting = 'gp-surgery';
	return d;
}

/**
 * A diabetes-monitoring request with a fasting lipid profile collected
 * non-fasting — forces a fasting violation and reject-risk pre-analytical band.
 */
function fastingViolation(): BloodTestRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr K Mensah',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'k.mensah@nhs.net',
		siteName: 'Selly Oak Surgery',
		referralDate: '2026-05-05'
	};
	d.patient = {
		firstName: 'Sofia',
		lastName: 'Bianchi',
		dateOfBirth: '1971-02-03',
		nhsNumber: '402 345 6789'
	};
	d.panels.hba1cMonitoring = true;
	d.panels.lipidProfile = true;
	d.clinical = {
		primaryIndication: 'diabetes-monitoring',
		clinicalDetails: 'Type 2 diabetes review; assess glycaemic and lipid control.',
		relevantMedications: 'Metformin 1 g BD, atorvastatin 20 mg ON.'
	};
	d.preanalytical = {
		...d.preanalytical,
		fastingStatus: 'non-fasting',
		specimenCollected: 'yes',
		collectionDate: '2026-05-05',
		collectionTime: '14:30'
	};
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	return d;
}

/**
 * An emergency department request including troponin — a critical test that
 * auto-escalates triage to stat.
 */
function statCritical(): BloodTestRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr L Romano',
		clinicianRole: 'Emergency medicine registrar',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		supervisingConsultant: 'Dr H Patel',
		requesterContact: 'ED bleep 1234',
		siteName: 'City General ED',
		referralDate: '2026-05-05'
	};
	d.patient = {
		firstName: 'Petra',
		lastName: 'Novak',
		dateOfBirth: '1959-12-30',
		nhsNumber: '403 456 7890'
	};
	d.panels.fullBloodCount = true;
	d.panels.troponin = true;
	d.panels.dDimer = true;
	d.clinical = {
		primaryIndication: 'infection',
		clinicalDetails: 'Acute chest pain and breathlessness; exclude ACS and PE.',
		relevantMedications: 'Aspirin 75 mg OD.'
	};
	d.preanalytical = {
		...d.preanalytical,
		specimenCollected: 'yes',
		collectionDate: '2026-05-05',
		collectionTime: '02:10'
	};
	d.triage.urgency = 'stat';
	d.triage.setting = 'emergency';
	return d;
}

/**
 * An incomplete request: no panel selected and no indication. Grades to reject
 * with safety flags.
 */
function noTestSelected(): BloodTestRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr H Iqbal',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		referralDate: '2026-05-06'
	};
	d.patient = {
		firstName: 'Niamh',
		lastName: 'Connolly',
		dateOfBirth: '1990-06-11',
		nhsNumber: '405 678 9012'
	};
	d.triage.urgency = 'routine';
	d.triage.setting = 'gp-surgery';
	return d;
}

/** The sample requests used by the dashboard and to seed the wizard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'BTR-2026-0001',
		patient: 'Okafor, Amara',
		nhs: '401 234 5678',
		referralDate: '2026-05-04',
		request: routineMonitoring()
	},
	{
		id: 'BTR-2026-0002',
		patient: 'Bianchi, Sofia',
		nhs: '402 345 6789',
		referralDate: '2026-05-05',
		request: fastingViolation()
	},
	{
		id: 'BTR-2026-0003',
		patient: 'Novak, Petra',
		nhs: '403 456 7890',
		referralDate: '2026-05-05',
		request: statCritical()
	},
	{
		id: 'BTR-2026-0004',
		patient: 'Connolly, Niamh',
		nhs: '405 678 9012',
		referralDate: '2026-05-06',
		request: noTestSelected()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		referralDate: s.referralDate,
		patient: s.patient,
		nhs: s.nhs,
		testsSelectedCount: g.testsSelectedCount,
		indication: s.request.clinical.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		preanalyticalBand: g.preanalyticalBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
