import type { EyeVisionRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: EyeVisionRequest;
}

/**
 * A routine, appropriate request: suspected glaucoma with tonometry, complete.
 * Grades to accept / routine / low priority.
 */
function routineGlaucomaRequest(): EyeVisionRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Mr Adeola Okafor';
	r.clinician.clinicianRole = 'Optometrist';
	r.clinician.registrationBody = 'GOC';
	r.clinician.registrationNumber = '01-12345';
	r.clinician.requesterContact = 'a.okafor@nhs.net · 0117 000000';
	r.clinician.siteName = 'Bristol Community Optometry';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.request.testType = 'tonometry';
	r.request.laterality = 'both';
	r.request.primaryIndication = 'suspected-glaucoma';
	r.request.clinicalQuestion =
		'Raised IOP on screening — please assess for chronic open-angle glaucoma.';
	r.request.relevantHistory = 'Family history of glaucoma; IOP 26 mmHg bilaterally on screening.';
	r.riskFactors.knownGlaucoma = false;
	r.triage.urgency = 'routine';
	r.triage.setting = 'community-optometry';
	return r;
}

/**
 * An urgent request: reduced vision in a diabetic patient. Reduced-vision
 * symptom escalates triage to urgent and raises clinical priority.
 */
function urgentReducedVisionRequest(): EyeVisionRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'GP';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net';
	r.clinician.siteName = 'Headington Medical Practice';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1949-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.request.testType = 'fundus-examination';
	r.request.laterality = 'both';
	r.request.primaryIndication = 'diabetic-retinopathy-screening';
	r.request.clinicalQuestion =
		'Diabetic with recently reduced vision — please assess for diabetic retinopathy.';
	r.request.relevantHistory = 'Type 2 diabetes 12 years; HbA1c 72; gradual blurring over 6 weeks.';
	r.symptoms.reducedVision = true;
	r.riskFactors.diabetes = true;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'gp-surgery';
	return r;
}

/**
 * An emergency request: sudden visual loss. Auto-escalates triage to emergency
 * and clinical priority to high regardless of the requested urgency.
 */
function emergencySuddenLossRequest(): EyeVisionRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'Emergency medicine registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.supervisingConsultant = 'Dr H Patel';
	r.clinician.requesterContact = 'ED bleep 1234';
	r.clinician.siteName = 'City General ED';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.patient.dateOfBirth = '1965-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.request.testType = 'fundus-examination';
	r.request.laterality = 'right';
	r.request.primaryIndication = 'sudden-visual-loss';
	r.request.clinicalQuestion =
		'Sudden painless loss of vision in the right eye this morning — please review urgently.';
	r.request.relevantHistory = 'Hypertensive; sudden curtain-like loss of vision 2 hours ago.';
	r.symptoms.suddenLoss = true;
	r.symptoms.reducedVision = true;
	r.triage.urgency = 'emergency';
	r.triage.setting = 'emergency-eye-clinic';
	return r;
}

/**
 * A query-referrer request: a mismatched indication x test pairing with no
 * clinical question. Grades to usually-not-appropriate → query the referrer.
 */
function queryReferrerRequest(): EyeVisionRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Mr Tom Reid';
	r.clinician.clinicianRole = 'Optometrist';
	r.clinician.registrationBody = 'GOC';
	r.clinician.referralDate = '2026-06-14';
	r.patient.firstName = 'Joan';
	r.patient.lastName = 'Carter';
	r.patient.dateOfBirth = '1972-09-30';
	r.patient.nhsNumber = '511 230 8842';
	r.request.testType = 'orthoptic-assessment';
	r.request.laterality = 'left';
	r.request.primaryIndication = 'red-eye';
	r.request.clinicalQuestion = '';
	r.request.relevantHistory = 'Persistent left red eye for one week.';
	r.symptoms.redEye = true;
	r.triage.urgency = 'routine';
	r.triage.setting = 'community-optometry';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'EV-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineGlaucomaRequest()
	},
	{
		id: 'EV-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentReducedVisionRequest()
	},
	{
		id: 'EV-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencySuddenLossRequest()
	},
	{
		id: 'EV-2026-0004',
		patientName: 'Joan Carter',
		referralDate: '2026-06-14',
		request: queryReferrerRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: `${s.request.patient.firstName} ${s.request.patient.lastName}`.trim(),
		testType: s.request.request.testType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
