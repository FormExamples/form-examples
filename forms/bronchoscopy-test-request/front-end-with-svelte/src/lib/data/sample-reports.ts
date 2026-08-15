import type { BronchoscopyRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: BronchoscopyRequest;
}

/**
 * A routine, appropriate request: persistent cough routed to flexible
 * bronchoscopy, complete, no bleeding or procedural risk. Grades to accept /
 * routine / low risk.
 */
function routineRequest(): BronchoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'Respiratory physician';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	r.clinician.siteName = 'Oxford Respiratory Clinic';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.bodyMassIndex = 27;
	r.request.procedure = 'flexible-bronchoscopy';
	r.request.primaryIndication = 'persistent-cough';
	r.request.clinicalQuestion =
		'Persistent cough for 10 weeks despite treatment — assess the airway for an endobronchial cause.';
	r.request.relevantHistory = 'Ex-smoker, 15 pack-years. No haemoptysis.';
	r.symptoms.symptomCough = true;
	r.symptoms.imagingFindings = 'CT chest: no focal mass; mild bronchial wall thickening.';
	r.procedural.asaGrade = 'II';
	r.procedural.sedation = 'conscious';
	r.triage.urgency = 'routine';
	r.triage.setting = 'day-case';
	return r;
}

/**
 * A two-week-wait request: suspected lung cancer with mediastinal nodes routed
 * to EBUS, plus weight loss. Grades onto the NICE NG12 two-week-wait pathway.
 */
function cancerPathwayRequest(): BronchoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'Oncologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'james.carter@nhs.net · 0121 000000';
	r.clinician.siteName = 'Queen Elizabeth Hospital — Rapid-access lung clinic';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1949-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.patient.bodyMassIndex = 23;
	r.request.procedure = 'ebus';
	r.request.primaryIndication = 'suspected-lung-cancer';
	r.request.clinicalQuestion =
		'Right hilar mass with enlarged mediastinal nodes — EBUS sampling for staging and diagnosis.';
	r.request.relevantHistory = 'Current smoker, 40 pack-years. Three-week history of weight loss.';
	r.symptoms.symptomCough = true;
	r.symptoms.symptomWeightLoss = true;
	r.symptoms.imagingFindings = 'CT chest: 3.5 cm right hilar mass; subcarinal and paratracheal nodes.';
	r.bleeding.takingAntiplatelet = true;
	r.bleeding.antiplateletAgent = 'aspirin';
	r.bleeding.plateletCount = 220;
	r.procedural.asaGrade = 'III';
	r.procedural.sedation = 'conscious';
	r.triage.urgency = 'two-week-wait';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A high-risk emergency request: massive haemoptysis in a patient on an
 * anticoagulant who is oxygen-dependent. Auto-escalates to emergency / high
 * risk.
 */
function emergencyHaemoptysisRequest(): BronchoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'Respiratory registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.supervisingConsultant = 'Dr H Patel';
	r.clinician.requesterContact = 'Respiratory bleep 1234';
	r.clinician.siteName = 'City General — Acute medical unit';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.patient.dateOfBirth = '1955-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.patient.bodyMassIndex = 31;
	r.request.procedure = 'rigid-bronchoscopy';
	r.request.primaryIndication = 'haemoptysis';
	r.request.clinicalQuestion = 'Massive haemoptysis — locate and control the bleeding source urgently.';
	r.request.relevantHistory = 'Known bronchiectasis. On apixaban for atrial fibrillation.';
	r.symptoms.symptomHaemoptysis = true;
	r.symptoms.haemoptysisSeverity = 'massive';
	r.symptoms.symptomBreathlessness = true;
	r.symptoms.imagingFindings = 'CXR: right lower-lobe opacification.';
	r.bleeding.takingAnticoagulant = true;
	r.bleeding.anticoagulantAgent = 'apixaban';
	r.bleeding.plateletCount = 180;
	r.procedural.oxygenDependent = true;
	r.procedural.asaGrade = 'IV';
	r.procedural.sedation = 'general-anaesthetic';
	r.procedural.haemodynamicallyUnstable = true;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'inpatient';
	return r;
}

/**
 * An incomplete, mismatched request that should be queried: a foreign-body
 * indication routed to bronchoalveolar lavage, with no clinical question and no
 * imaging. Grades to usually-not-appropriate → query the referrer.
 */
function incompleteRequest(): BronchoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Tom Hughes';
	r.clinician.clinicianRole = 'GP';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7333221';
	r.clinician.requesterContact = 'tom.hughes@nhs.net';
	r.clinician.siteName = 'Cowley Road Surgery';
	r.clinician.referralDate = '2026-06-14';
	r.patient.firstName = 'Eleanor';
	r.patient.lastName = 'Price';
	r.patient.dateOfBirth = '1971-02-09';
	r.patient.nhsNumber = '512 004 7781';
	r.request.procedure = 'bronchoalveolar-lavage';
	r.request.primaryIndication = 'foreign-body';
	r.request.clinicalQuestion = '';
	r.request.relevantHistory = 'Possible inhaled foreign body after a choking episode.';
	r.symptoms.symptomCough = true;
	r.symptoms.imagingFindings = '';
	r.triage.urgency = 'urgent';
	r.triage.setting = 'outpatient';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'BR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'BR-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: cancerPathwayRequest()
	},
	{
		id: 'BR-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyHaemoptysisRequest()
	},
	{
		id: 'BR-2026-0004',
		patientName: 'Eleanor Price',
		referralDate: '2026-06-14',
		request: incompleteRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		procedure: s.request.request.procedure,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		riskBand: g.riskBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
