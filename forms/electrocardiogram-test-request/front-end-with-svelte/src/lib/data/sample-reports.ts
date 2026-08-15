import type { EcgRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full record the engine grades. */
export interface SampleReferral {
	id: string;
	patientName: string;
	referralDate: string;
	request: EcgRequest;
}

/**
 * A routine, appropriate request: stable chest pain, resting 12-lead ECG, fully
 * complete. Grades to accept / routine / low priority.
 */
function routineRequest(): EcgRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.clinicianRole = 'GP';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.ecgType = 'resting-12-lead';
	d.request.primaryIndication = 'chest-pain';
	d.request.clinicalQuestion = 'Is there evidence of ischaemia? Please risk-stratify.';
	d.request.relevantHistory = 'Intermittent exertional chest tightness over 3 months, relieved by rest.';
	d.medications.relevantMedications = 'Amlodipine 5 mg OD, atorvastatin 20 mg ON.';
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	d.triage.siteName = 'Headington Medical Practice';
	return d;
}

/**
 * An emergency request: suspected acute coronary syndrome with active chest
 * pain. Auto-escalates triage to emergency and clinical priority to high.
 */
function emergencyAcsRequest(): EcgRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Priya Nair';
	d.clinician.clinicianRole = 'Emergency medicine registrar';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7456120';
	d.clinician.supervisingConsultant = 'Dr H Patel';
	d.clinician.requesterContact = 'ED bleep 1234';
	d.clinician.siteName = 'City General ED';
	d.clinician.referralDate = '2026-06-13';
	d.patient.firstName = 'Anthony';
	d.patient.lastName = 'Brooks';
	d.patient.dateOfBirth = '1965-07-21';
	d.patient.nhsNumber = '309 552 0148';
	d.request.ecgType = 'resting-12-lead';
	d.request.primaryIndication = 'suspected-mi-acs';
	d.request.clinicalQuestion = 'Central crushing chest pain with rising troponin — please review urgently.';
	d.request.relevantHistory = 'One hour of central crushing chest pain radiating to the left arm, diaphoretic.';
	d.symptoms.symptomChestPain = true;
	d.symptoms.currentlySymptomatic = true;
	d.symptoms.suspectedAcs = true;
	d.medications.relevantMedications = 'Aspirin, bisoprolol, atorvastatin.';
	d.triage.urgency = 'emergency';
	d.triage.setting = 'emergency';
	d.triage.siteName = 'City General ED';
	return d;
}

/**
 * An urgent request: syncope worked up with a resting 12-lead ECG. The syncope
 * red flag escalates triage to urgent and raises a high-priority flag.
 */
function urgentSyncopeRequest(): EcgRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr James Carter';
	d.clinician.clinicianRole = 'Hospital doctor';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7099887';
	d.clinician.requesterContact = 'james.carter@nhs.net · 0121 000000';
	d.clinician.siteName = 'Acute Medical Unit';
	d.clinician.referralDate = '2026-06-12';
	d.patient.firstName = 'Derek';
	d.patient.lastName = 'Mensah';
	d.patient.dateOfBirth = '1949-11-02';
	d.patient.nhsNumber = '402 118 9921';
	d.request.ecgType = 'resting-12-lead';
	d.request.primaryIndication = 'syncope';
	d.request.clinicalQuestion = 'Transient loss of consciousness — please exclude an arrhythmic cause.';
	d.request.relevantHistory = 'Unheralded collapse while standing, no prodrome, brief loss of consciousness.';
	d.symptoms.symptomSyncope = true;
	d.symptoms.symptomDizziness = true;
	d.medications.relevantMedications = 'Ramipril 5 mg OD.';
	d.triage.urgency = 'urgent';
	d.triage.setting = 'inpatient';
	d.triage.siteName = 'Acute Medical Unit';
	return d;
}

/**
 * A usually-not-appropriate, partially complete request: an event recorder
 * requested for hypertension, with no clinical question. Grades to
 * query-referrer with moderate priority.
 */
function inappropriateRequest(): EcgRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr Helen Frost';
	d.clinician.clinicianRole = 'GP';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7211003';
	d.clinician.siteName = 'Riverside Surgery';
	d.clinician.referralDate = '2026-06-14';
	d.patient.firstName = 'Olivia';
	d.patient.lastName = 'Reed';
	d.patient.dateOfBirth = '1972-09-30';
	d.patient.nhsNumber = '551 230 7788';
	d.request.ecgType = 'event-recorder';
	d.request.primaryIndication = 'hypertension';
	d.request.clinicalQuestion = '';
	d.request.relevantHistory = 'Newly diagnosed hypertension.';
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	d.triage.siteName = 'Riverside Surgery';
	return d;
}

/** The sample requests used by the dashboard. */
export const sampleReferrals: SampleReferral[] = [
	{
		id: 'EC-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'EC-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyAcsRequest()
	},
	{
		id: 'EC-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentSyncopeRequest()
	},
	{
		id: 'EC-2026-0004',
		patientName: 'Olivia Reed',
		referralDate: '2026-06-14',
		request: inappropriateRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleReferralRows: RequestRow[] = sampleReferrals.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		ecgType: s.request.request.ecgType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
