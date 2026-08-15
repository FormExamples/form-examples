import type { RequestRow, UltrasoundRequest } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full record the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: UltrasoundRequest;
}

/**
 * A routine, appropriate request: suspected gallstones routed to a liver /
 * biliary scan, fasting flagged, complete. Grades to accept / routine.
 */
function routineRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.clinicianRole = 'gp';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.patient.bodyMassIndex = 27;
	d.request.bodyRegion = 'liver-biliary';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'suspected-gallstones';
	d.request.clinicalQuestion = 'Confirm or exclude gallstones in a patient with right-upper-quadrant pain.';
	d.request.relevantHistory = 'Intermittent post-prandial RUQ pain over three months.';
	d.prep.fastingRequired = true;
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	d.triage.requestedByDate = '2026-07-15';
	return d;
}

/**
 * An urgent request: suspected DVT routed to a leg-vein Doppler. The red flag
 * auto-escalates triage to urgent.
 */
function urgentDvtRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr James Carter';
	d.clinician.clinicianRole = 'hospital-doctor';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7099887';
	d.clinician.requesterContact = 'ward bleep 2210';
	d.clinician.siteName = 'Selly Oak General';
	d.clinician.referralDate = '2026-06-12';
	d.patient.firstName = 'Derek';
	d.patient.lastName = 'Mensah';
	d.patient.dateOfBirth = '1949-11-02';
	d.patient.nhsNumber = '402 118 9921';
	d.patient.bodyMassIndex = 29;
	d.request.bodyRegion = 'dvt-leg';
	d.request.laterality = 'left';
	d.request.primaryIndication = 'suspected-dvt';
	d.request.clinicalQuestion = 'Unilateral calf swelling and tenderness — exclude proximal DVT.';
	d.request.relevantHistory = 'Recent long-haul flight; raised D-dimer.';
	d.redFlags.suspectedDvt = true;
	d.triage.urgency = 'urgent';
	d.triage.setting = 'inpatient';
	return d;
}

/**
 * An emergency request: suspected testicular torsion routed to a scrotal
 * Doppler. The red flag auto-escalates triage to emergency.
 */
function emergencyTorsionRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Priya Nair';
	d.clinician.clinicianRole = 'surgeon';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7456120';
	d.clinician.supervisingConsultant = 'Mr H Patel';
	d.clinician.requesterContact = 'ED bleep 1234';
	d.clinician.siteName = 'City General ED';
	d.clinician.referralDate = '2026-06-13';
	d.patient.firstName = 'Anthony';
	d.patient.lastName = 'Brooks';
	d.patient.dateOfBirth = '2006-07-21';
	d.patient.nhsNumber = '309 552 0148';
	d.patient.bodyMassIndex = 23;
	d.request.bodyRegion = 'scrotum-testes';
	d.request.laterality = 'right';
	d.request.primaryIndication = 'testicular-pain';
	d.request.clinicalQuestion = 'Acute right testicular pain with high-riding testis — exclude torsion.';
	d.request.relevantHistory = 'Sudden-onset severe pain two hours ago, nausea.';
	d.redFlags.suspectedTesticularTorsion = true;
	d.triage.urgency = 'emergency';
	d.triage.setting = 'emergency';
	return d;
}

/**
 * A request needing redirection: abdominal-pain abdomen scan in a patient with a
 * raised BMI and no fasting flagged. Technically limited → redirect / amend prep.
 */
function redirectAbdomenRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Helen Shaw';
	d.clinician.clinicianRole = 'gp';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7033221';
	d.clinician.requesterContact = 'helen.shaw@nhs.net';
	d.clinician.siteName = 'Northgate Surgery';
	d.clinician.referralDate = '2026-06-14';
	d.patient.firstName = 'Janet';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1971-02-09';
	d.patient.nhsNumber = '512 660 7788';
	d.patient.bodyMassIndex = 38;
	d.request.bodyRegion = 'abdomen';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'abdominal-pain';
	d.request.clinicalQuestion = 'Generalised abdominal pain — assess for an organic cause.';
	d.request.relevantHistory = 'Six-week history of intermittent central abdominal pain.';
	d.prep.fastingRequired = false;
	d.triage.urgency = 'routine';
	d.triage.setting = 'outpatient';
	return d;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'US-2026-0001', patientName: 'Margaret Hughes', referralDate: '2026-06-10', request: routineRequest() },
	{ id: 'US-2026-0002', patientName: 'Derek Mensah', referralDate: '2026-06-12', request: urgentDvtRequest() },
	{ id: 'US-2026-0003', patientName: 'Anthony Brooks', referralDate: '2026-06-13', request: emergencyTorsionRequest() },
	{ id: 'US-2026-0004', patientName: 'Janet Okafor', referralDate: '2026-06-14', request: redirectAbdomenRequest() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		bodyRegion: s.request.request.bodyRegion,
		primaryIndication: s.request.request.primaryIndication,
		urgency: s.request.triage.urgency,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		suitabilityBand: g.suitabilityBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
