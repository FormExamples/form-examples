import type {
	AbpmRequest,
	AppropriatenessBand,
	Recommendation,
	SuitabilityBand,
	TriageTier
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/request.svelte.js';

/** A sample ABPM request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: AbpmRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	clinicBp: string;
	appropriatenessBand: AppropriatenessBand;
	suitabilityBand: SuitabilityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}

/** A1 — routine, well-formed diagnose-hypertension request (accept). */
function diagnoseRoutine(): AbpmRequest {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr H Iqbal', clinicianRole: 'gp', registrationBody: 'GMC', registrationNumber: '7011223', siteName: 'Riverside Surgery', referralDate: '2026-05-04' };
	d.patient = { ...d.patient, firstName: 'Amara', lastName: 'Okafor', dateOfBirth: '1979-02-11', nhsNumber: '401 234 5678', bodyMassIndex: 27.4 };
	d.request = { ...d.request, testType: '24-hour-abpm', primaryIndication: 'diagnose-hypertension', clinicalQuestion: 'Confirm a new diagnosis of hypertension before starting treatment.' };
	d.bloodPressure = { ...d.bloodPressure, clinicBpSystolic: 152, clinicBpDiastolic: 96 };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-05-25', setting: 'community' };
	return d;
}

/** A2 — severe clinic BP auto-escalating triage to urgent. */
function severeUrgent(): AbpmRequest {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr K Mensah', clinicianRole: 'hospital-doctor', registrationBody: 'GMC', registrationNumber: '7088445', siteName: 'City Hospital', referralDate: '2026-05-05' };
	d.patient = { ...d.patient, firstName: 'Sofia', lastName: 'Bianchi', dateOfBirth: '1962-07-19', nhsNumber: '402 345 6789', bodyMassIndex: 29.1 };
	d.request = { ...d.request, testType: '24-hour-abpm', primaryIndication: 'diagnose-hypertension', clinicalQuestion: 'Confirm severe clinic readings out of office.' };
	d.bloodPressure = { ...d.bloodPressure, clinicBpSystolic: 186, clinicBpDiastolic: 124, onAntihypertensives: true, currentMedications: 'Amlodipine 10 mg OD' };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** A3 — resistant hypertension with atrial fibrillation (suitability limited → redirect). */
function afLimited(): AbpmRequest {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr L Romano', clinicianRole: 'cardiologist', registrationBody: 'GMC', registrationNumber: '7099337', siteName: 'Cardiology Outpatients', referralDate: '2026-05-05' };
	d.patient = { ...d.patient, firstName: 'Petra', lastName: 'Novak', dateOfBirth: '1955-03-02', nhsNumber: '403 456 7890', bodyMassIndex: 31.8 };
	d.request = { ...d.request, testType: '24-hour-abpm', primaryIndication: 'resistant-hypertension', clinicalQuestion: 'Assess true BP control on triple therapy.' };
	d.bloodPressure = { ...d.bloodPressure, clinicBpSystolic: 158, clinicBpDiastolic: 92, onAntihypertensives: true, currentMedications: 'Ramipril, Amlodipine, Indapamide' };
	d.symptoms = { ...d.symptoms, atrialFibrillation: true };
	d.triage = { ...d.triage, urgency: 'routine', setting: 'outpatient' };
	return d;
}

/** A4 — treatment monitoring with clinic BP missing (incomplete → query referrer). */
function incompleteQuery(): AbpmRequest {
	const d = createDefaultRequest();
	d.clinician = { ...d.clinician, clinicianName: 'Dr R Ahmed', clinicianRole: 'nurse', registrationBody: 'NMC', registrationNumber: 'NN55221', siteName: 'Meadow Health Centre', referralDate: '2026-05-06' };
	d.patient = { ...d.patient, firstName: 'Niamh', lastName: 'Connolly', dateOfBirth: '1971-11-23', nhsNumber: '405 678 9012', bodyMassIndex: 24.0 };
	d.request = { ...d.request, testType: '24-hour-abpm', primaryIndication: 'treatment-monitoring', clinicalQuestion: '' };
	d.triage = { ...d.triage, urgency: 'routine' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'AB-2026-0001', patientName: 'Okafor, Amara', referralDate: '2026-05-04', data: diagnoseRoutine() },
	{ id: 'AB-2026-0002', patientName: 'Bianchi, Sofia', referralDate: '2026-05-05', data: severeUrgent() },
	{ id: 'AB-2026-0003', patientName: 'Novak, Petra', referralDate: '2026-05-05', data: afLimited() },
	{ id: 'AB-2026-0004', patientName: 'Connolly, Niamh', referralDate: '2026-05-06', data: incompleteQuery() }
];

/** Format clinic BP for a dashboard cell. */
function clinicBp(d: AbpmRequest): string {
	const s = d.bloodPressure.clinicBpSystolic;
	const dia = d.bloodPressure.clinicBpDiastolic;
	if (s === null || dia === null) return '—';
	return `${s}/${dia}`;
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		clinicBp: clinicBp(s.data),
		appropriatenessBand: g.appropriatenessBand,
		suitabilityBand: g.suitabilityBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
