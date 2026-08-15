import type { PulmonaryFunctionTestRequest, DashboardRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: PulmonaryFunctionTestRequest;
}

/**
 * A routine, appropriate request: suspected COPD with first-line spirometry,
 * complete, ex-smoker. Grades to accept / routine, contraindication OK.
 */
function routineCopdRequest(): PulmonaryFunctionTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	r.clinician.siteName = 'Headington Medical Practice';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.heightCm = 162;
	r.patient.weightKg = 71;
	r.request.testType = 'spirometry';
	r.request.primaryIndication = 'suspected-copd';
	r.request.clinicalQuestion =
		'Confirm post-bronchodilator airflow obstruction in a long-term smoker with progressive breathlessness.';
	r.request.relevantHistory = '35 pack-year history, exertional breathlessness over 12 months.';
	r.symptoms.breathlessness = true;
	r.symptoms.cough = true;
	r.background.smokingStatus = 'ex';
	r.background.currentInhalers = 'Salbutamol PRN.';
	r.triage.urgency = 'routine';
	r.triage.setting = 'community';
	return r;
}

/**
 * A pre-operative request: full lung function ahead of major surgery, complete.
 * Appropriate, but the pre-operative indication auto-escalates triage to urgent
 * to avoid delaying surgery. Accept / urgent, contraindication OK.
 */
function preOperativeRequest(): PulmonaryFunctionTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'hospital-doctor';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'pre-op assessment unit · bleep 2210';
	r.clinician.supervisingConsultant = 'Mr A Shah';
	r.clinician.siteName = 'City General Pre-operative Assessment';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1949-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.patient.heightCm = 178;
	r.patient.weightKg = 94;
	r.request.testType = 'full-lung-function';
	r.request.primaryIndication = 'pre-operative';
	r.request.clinicalQuestion =
		'Assess lung function and gas transfer before planned major abdominal surgery.';
	r.request.relevantHistory = 'Ex-smoker, reduced exercise tolerance; surgery scheduled in 3 weeks.';
	r.symptoms.breathlessness = true;
	r.background.smokingStatus = 'ex';
	r.triage.urgency = 'routine';
	r.triage.requestedByDate = '2026-07-01';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A contraindicated request: suspected asthma with first-line spirometry-with-
 * reversibility, but haemoptysis of unknown origin is reported. Forced
 * expiration is contraindicated → defer / redirect, triage urgent.
 */
function haemoptysisRequest(): PulmonaryFunctionTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'respiratory-physician';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.requesterContact = 'respiratory clinic · ext 4400';
	r.clinician.siteName = 'City General Respiratory Clinic';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.patient.dateOfBirth = '1965-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.patient.heightCm = 175;
	r.patient.weightKg = 82;
	r.request.testType = 'spirometry-with-reversibility';
	r.request.primaryIndication = 'suspected-asthma';
	r.request.clinicalQuestion =
		'Assess for reversible airflow obstruction; note new haemoptysis under investigation.';
	r.request.relevantHistory = 'Wheeze and episodic breathlessness; two episodes of haemoptysis.';
	r.symptoms.breathlessness = true;
	r.symptoms.wheeze = true;
	r.symptoms.cough = true;
	r.background.smokingStatus = 'current';
	r.safety.haemoptysis = true;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A low-appropriateness, incomplete request: a restrictive-disease indication
 * sent for peak flow (a mismatch), missing smoking status, anthropometry, and
 * referral date. Usually-not-appropriate → query the referrer.
 */
function mismatchRequest(): PulmonaryFunctionTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Helen Ward';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.patient.firstName = 'Susan';
	r.patient.lastName = 'Clarke';
	r.patient.nhsNumber = '517 220 6643';
	r.request.testType = 'peak-flow';
	r.request.primaryIndication = 'restrictive-disease';
	r.request.clinicalQuestion = 'Query restrictive lung disease.';
	r.triage.urgency = 'routine';
	r.triage.setting = 'community';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'PF-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineCopdRequest()
	},
	{
		id: 'PF-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: preOperativeRequest()
	},
	{
		id: 'PF-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: haemoptysisRequest()
	},
	{
		id: 'PF-2026-0004',
		patientName: 'Susan Clarke',
		referralDate: '2026-06-14',
		request: mismatchRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		testType: s.request.request.testType,
		primaryIndication: s.request.request.primaryIndication,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		contraindicationBand: g.contraindicationBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
