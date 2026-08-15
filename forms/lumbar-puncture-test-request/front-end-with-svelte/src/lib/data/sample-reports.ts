import type { LumbarPunctureRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: LumbarPunctureRequest;
}

/**
 * A routine, appropriate request: suspected multiple sclerosis, diagnostic LP,
 * no safety concerns, complete request. Grades to accept / routine.
 */
function routineMsRequest(): LumbarPunctureRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'Neurology registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · bleep 220';
	r.clinician.siteName = 'John Radcliffe Hospital';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1989-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.procedure.procedureIntent = 'diagnostic';
	r.procedure.primaryIndication = 'suspected-multiple-sclerosis';
	r.procedure.clinicalQuestion =
		'Unmatched oligoclonal bands in CSF to support a diagnosis of multiple sclerosis?';
	r.procedure.relevantHistory = 'Two episodes of optic neuritis; MRI shows periventricular lesions.';
	r.neuroSafety.ctHeadStatus = 'not-required';
	r.triage.openingPressureRequired = false;
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * An emergency request: suspected bacterial meningitis, diagnostic LP. Suspected
 * meningitis auto-escalates triage to emergency and raises a time-critical flag.
 */
function emergencyMeningitisRequest(): LumbarPunctureRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'Acute medicine registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.supervisingConsultant = 'Dr H Patel';
	r.clinician.requesterContact = 'AMU bleep 1234';
	r.clinician.siteName = 'City General AMU';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.patient.dateOfBirth = '1995-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.procedure.procedureIntent = 'diagnostic';
	r.procedure.primaryIndication = 'suspected-meningitis';
	r.procedure.clinicalQuestion =
		'CSF microscopy, culture, and PCR to confirm bacterial meningitis and guide antibiotics.';
	r.procedure.relevantHistory = 'Fever, neck stiffness, photophobia, and headache for 12 hours.';
	r.neuroSafety.ctHeadStatus = 'done-normal';
	r.triage.openingPressureRequired = true;
	r.triage.urgency = 'emergency';
	r.triage.setting = 'emergency';
	return r;
}

/**
 * A contraindicated request: idiopathic intracranial hypertension with suspected
 * raised ICP and new focal signs but only an awaited CT head. The raised-ICP
 * rule forces the contraindication band to contraindicated → reject.
 */
function contraindicatedRaisedIcpRequest(): LumbarPunctureRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'Neurology SHO';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'james.carter@nhs.net';
	r.clinician.siteName = 'Queen Elizabeth Hospital';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1991-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.procedure.procedureIntent = 'therapeutic';
	r.procedure.primaryIndication = 'idiopathic-intracranial-hypertension';
	r.procedure.clinicalQuestion = 'Therapeutic CSF drainage for medically-refractory IIH.';
	r.procedure.relevantHistory = 'Papilloedema with new sixth-nerve palsy and worsening visual fields.';
	r.neuroSafety.suspectedRaisedIntracranialPressure = true;
	r.neuroSafety.focalNeurologicalSigns = true;
	r.neuroSafety.ctHeadStatus = 'awaited';
	r.triage.openingPressureRequired = true;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'inpatient';
	return r;
}

/**
 * A caution request: suspected CNS malignancy, diagnostic LP, but the patient is
 * anticoagulated with a borderline INR. The bleeding rules force a caution band
 * → query the referrer.
 */
function cautionAnticoagRequest(): LumbarPunctureRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Aisha Khan';
	r.clinician.clinicianRole = 'Oncology registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7333210';
	r.clinician.requesterContact = 'aisha.khan@nhs.net';
	r.clinician.siteName = 'Churchill Hospital';
	r.clinician.referralDate = '2026-06-11';
	r.patient.firstName = 'Eleanor';
	r.patient.lastName = 'Price';
	r.patient.dateOfBirth = '1958-09-30';
	r.patient.nhsNumber = '517 004 2280';
	r.procedure.procedureIntent = 'diagnostic';
	r.procedure.primaryIndication = 'suspected-cns-malignancy';
	r.procedure.clinicalQuestion = 'CSF cytology to assess for leptomeningeal metastatic disease.';
	r.procedure.relevantHistory = 'Known metastatic breast cancer; new headache and cranial-nerve signs.';
	r.neuroSafety.ctHeadStatus = 'done-normal';
	r.bleeding.takingAnticoagulant = true;
	r.bleeding.anticoagulantAgent = 'Warfarin';
	r.bleeding.inr = 2.6;
	r.triage.openingPressureRequired = false;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'inpatient';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'LP-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineMsRequest()
	},
	{
		id: 'LP-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyMeningitisRequest()
	},
	{
		id: 'LP-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: contraindicatedRaisedIcpRequest()
	},
	{
		id: 'LP-2026-0004',
		patientName: 'Eleanor Price',
		referralDate: '2026-06-11',
		request: cautionAnticoagRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	const fullName = `${s.request.patient.firstName} ${s.request.patient.lastName}`.trim();
	return {
		id: s.id,
		patientName: fullName || s.patientName,
		primaryIndication: s.request.procedure.primaryIndication,
		procedureIntent: s.request.procedure.procedureIntent,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		contraindicationBand: g.contraindicationBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
