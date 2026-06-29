import type { NerveConductionStudyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full record the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: NerveConductionStudyRequest;
}

/**
 * A routine, appropriate carpal-tunnel request: nerve conduction of the upper
 * limb, complete, no safety concerns. Grades to accept / routine.
 */
function carpalTunnelRequest(): NerveConductionStudyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr H Iqbal';
	r.clinician.clinicianRole = 'neurologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'h.iqbal@nhs.net';
	r.clinician.siteName = 'Headington Neurology Clinic';
	r.clinician.referralDate = '2026-05-04';
	r.patient.firstName = 'Amara';
	r.patient.lastName = 'Okafor';
	r.patient.dateOfBirth = '1972-02-11';
	r.patient.nhsNumber = '401 234 5678';
	r.study.studyType = 'nerve-conduction';
	r.study.region = 'upper-limb';
	r.study.laterality = 'right';
	r.study.requestedByDate = '2026-06-20';
	r.request.primaryIndication = 'carpal-tunnel';
	r.request.clinicalQuestion =
		'Confirm median neuropathy at the wrist and grade severity before considering decompression.';
	r.request.relevantHistory = 'Nocturnal paraesthesia in the median distribution over several months.';
	r.symptoms.symptomNumbness = true;
	r.symptoms.symptomTingling = true;
	r.symptoms.symptomDuration = '3-to-12-months';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * An urgent suspected-MND request: nerve conduction + EMG, generalised. The MND
 * indication auto-escalates triage to urgent and raises a high-priority flag.
 */
function suspectedMndRequest(): NerveConductionStudyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr K Mensah';
	r.clinician.clinicianRole = 'neurologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'k.mensah@nhs.net';
	r.clinician.siteName = 'Regional Neurosciences Centre';
	r.clinician.referralDate = '2026-05-05';
	r.patient.firstName = 'Sofia';
	r.patient.lastName = 'Bianchi';
	r.patient.dateOfBirth = '1959-09-30';
	r.patient.nhsNumber = '402 345 6789';
	r.study.studyType = 'nerve-conduction-and-emg';
	r.study.region = 'generalised';
	r.study.laterality = 'bilateral';
	r.request.primaryIndication = 'suspected-motor-neurone-disease';
	r.request.clinicalQuestion =
		'Assess for diffuse denervation and fasciculation suggestive of motor neurone disease.';
	r.request.relevantHistory = 'Progressive limb weakness, wasting, and fasciculations over 3 months.';
	r.symptoms.symptomWeakness = true;
	r.symptoms.symptomDuration = '6-weeks-to-3-months';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A needle-EMG radiculopathy request in an anticoagulated patient: needle EMG
 * against anticoagulation raises procedural risk to high and a bleeding-risk
 * flag, driving a query-referrer recommendation.
 */
function anticoagEmgRequest(): NerveConductionStudyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr L Romano';
	r.clinician.clinicianRole = 'rheumatologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.requesterContact = 'l.romano@nhs.net';
	r.clinician.siteName = 'City General Rheumatology';
	r.clinician.referralDate = '2026-05-05';
	r.patient.firstName = 'Petra';
	r.patient.lastName = 'Novak';
	r.patient.dateOfBirth = '1955-12-02';
	r.patient.nhsNumber = '403 456 7890';
	r.study.studyType = 'emg';
	r.study.region = 'lower-limb';
	r.study.laterality = 'left';
	r.request.primaryIndication = 'radiculopathy';
	r.request.clinicalQuestion = 'Localise the root level of the suspected L5 radiculopathy.';
	r.request.relevantHistory =
		'Left leg radicular pain and foot-drop; on warfarin for atrial fibrillation.';
	r.symptoms.symptomWeakness = true;
	r.symptoms.symptomPain = true;
	r.symptoms.symptomDuration = '6-weeks-to-3-months';
	r.safety.takingAnticoagulant = true;
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * An incomplete "other" request: indication recorded as other with no clinical
 * question. Low completeness and a missing-clinical-question flag drive a
 * query-referrer recommendation.
 */
function incompleteOtherRequest(): NerveConductionStudyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr R Ahmed';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.clinician.referralDate = '2026-05-07';
	r.patient.firstName = 'Elin';
	r.patient.lastName = 'Andersson';
	r.patient.dateOfBirth = '1980-04-18';
	r.patient.nhsNumber = '407 890 1234';
	r.study.studyType = 'nerve-conduction';
	r.study.region = 'upper-limb';
	r.request.primaryIndication = 'other';
	r.request.clinicalQuestion = '';
	r.symptoms.symptomTingling = true;
	r.triage.urgency = 'routine';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'NCS-2026-0001',
		patientName: 'Amara Okafor',
		referralDate: '2026-05-04',
		request: carpalTunnelRequest()
	},
	{
		id: 'NCS-2026-0002',
		patientName: 'Sofia Bianchi',
		referralDate: '2026-05-05',
		request: suspectedMndRequest()
	},
	{
		id: 'NCS-2026-0003',
		patientName: 'Petra Novak',
		referralDate: '2026-05-05',
		request: anticoagEmgRequest()
	},
	{
		id: 'NCS-2026-0004',
		patientName: 'Elin Andersson',
		referralDate: '2026-05-07',
		request: incompleteOtherRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		studyType: s.request.study.studyType,
		region: s.request.study.region,
		indication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		proceduralRiskBand: g.proceduralRiskBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
