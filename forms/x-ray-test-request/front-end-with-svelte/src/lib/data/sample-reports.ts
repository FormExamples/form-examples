import type { XRayRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: XRayRequest;
}

/**
 * A routine, appropriate, fully-justified chest request. Grades to
 * accept / routine / safe.
 */
function routineChestRequest(): XRayRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.clinicianRole = 'gp';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.requesterContact = 'h.iqbal@nhs.net';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1979-08-22';
	d.patient.nhsNumber = '401 234 5678';
	d.request.bodyRegion = 'chest';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'chest-infection';
	d.detail.clinicalQuestion = 'Exclude consolidation in a patient with productive cough and fever.';
	d.detail.relevantHistory = 'Five-day history of cough, fever, and focal crackles at the right base.';
	d.safety.pregnancyStatus = 'not-applicable';
	d.safety.irMeRJustification = 'Confirming pneumonia changes management; low chest dose justified.';
	d.practical.mobility = 'ambulant';
	d.practical.setting = 'community';
	d.triage.urgency = 'routine';
	return d;
}

/**
 * An emergency request: suspected pneumothorax. Auto-escalates triage to
 * emergency. Appropriate chest film, safe.
 */
function emergencyPneumothoraxRequest(): XRayRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr M Adebayo';
	d.clinician.clinicianRole = 'emergency-physician';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7456120';
	d.clinician.requesterContact = 'ED bleep 1234';
	d.clinician.siteName = 'City General ED';
	d.clinician.referralDate = '2026-05-09';
	d.patient.firstName = 'Yuki';
	d.patient.lastName = 'Tanaka';
	d.patient.dateOfBirth = '1991-01-30';
	d.patient.nhsNumber = '410 123 4567';
	d.request.bodyRegion = 'chest';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'suspected-pneumothorax';
	d.detail.clinicalQuestion = 'Acute pleuritic chest pain and breathlessness — exclude pneumothorax.';
	d.detail.relevantHistory = 'Sudden-onset left pleuritic chest pain at rest, reduced breath sounds.';
	d.safety.pregnancyStatus = 'not-applicable';
	d.safety.irMeRJustification = 'Suspected pneumothorax requires an immediate chest radiograph.';
	d.practical.mobility = 'trolley';
	d.practical.setting = 'emergency';
	d.triage.urgency = 'emergency';
	return d;
}

/**
 * A pregnant pelvis trauma request. The moderate-dose pelvis exposure with a
 * confirmed pregnancy forces the contraindicated band → reject; trauma in the
 * emergency setting escalates triage to urgent.
 */
function pregnantPelvisTraumaRequest(): XRayRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr K Mensah';
	d.clinician.clinicianRole = 'hospital-doctor';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7099887';
	d.clinician.requesterContact = 'k.mensah@nhs.net';
	d.clinician.siteName = 'City General ED';
	d.clinician.referralDate = '2026-05-06';
	d.patient.firstName = 'Layla';
	d.patient.lastName = 'Hassan';
	d.patient.dateOfBirth = '1996-04-17';
	d.patient.nhsNumber = '404 567 8901';
	d.request.bodyRegion = 'pelvis';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'trauma-fracture';
	d.detail.clinicalQuestion = 'Query pelvic fracture after a fall; assess the bony pelvis.';
	d.detail.relevantHistory = 'Fall from standing onto the left hip; unable to weight-bear.';
	d.safety.pregnancyStatus = 'pregnant';
	d.safety.irMeRJustification = 'Trauma assessment; weigh against conceptus dose under IR(ME)R.';
	d.practical.mobility = 'trolley';
	d.practical.setting = 'emergency';
	d.triage.urgency = 'urgent';
	return d;
}

/**
 * A may-be-appropriate lumbar-spine request with no IR(ME)R justification and a
 * recent similar film. High dose, repeat exposure, and an unjustified exposure
 * force the caution band → query-referrer; triage routine.
 */
function cautionLumbarSpineRequest(): XRayRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr R Ahmed';
	d.clinician.clinicianRole = 'gp';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7033221';
	d.clinician.requesterContact = 'r.ahmed@nhs.net';
	d.clinician.siteName = 'Riverside Surgery';
	d.clinician.referralDate = '2026-05-07';
	d.patient.firstName = 'Elin';
	d.patient.lastName = 'Andersson';
	d.patient.dateOfBirth = '1968-12-03';
	d.patient.nhsNumber = '407 890 1234';
	d.request.bodyRegion = 'spine-lumbar';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'joint-pain';
	d.detail.clinicalQuestion = 'Chronic low back pain — assess for degenerative change.';
	d.detail.relevantHistory = 'Long-standing mechanical low back pain, no red-flag features.';
	d.safety.pregnancyStatus = 'not-pregnant';
	d.safety.recentSimilarXray = true;
	d.safety.irMeRJustification = '';
	d.practical.mobility = 'ambulant';
	d.practical.setting = 'outpatient';
	d.triage.urgency = 'routine';
	return d;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'XR-2026-0001',
		patientName: 'Amara Okafor',
		referralDate: '2026-05-04',
		request: routineChestRequest()
	},
	{
		id: 'XR-2026-0002',
		patientName: 'Yuki Tanaka',
		referralDate: '2026-05-09',
		request: emergencyPneumothoraxRequest()
	},
	{
		id: 'XR-2026-0003',
		patientName: 'Layla Hassan',
		referralDate: '2026-05-06',
		request: pregnantPelvisTraumaRequest()
	},
	{
		id: 'XR-2026-0004',
		patientName: 'Elin Andersson',
		referralDate: '2026-05-07',
		request: cautionLumbarSpineRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		bodyRegion: s.request.request.bodyRegion,
		primaryIndication: s.request.request.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		radiationSafetyBand: g.radiationSafetyBand,
		radiationDoseBand: g.radiationDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
