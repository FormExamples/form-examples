import type { HistopathologyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: HistopathologyRequest;
}

/**
 * A routine, appropriate, complete request: a colonic biopsy for inflammatory
 * disease, fixed in formalin and labelled. Grades to accept / routine.
 */
function routineInflammatoryRequest(): HistopathologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gastroenterologist',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Endoscopy Unit',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		interpreterRequired: false
	};
	r.specimen = {
		specimenType: 'endoscopic-biopsy',
		specimenSite: 'Sigmoid colon',
		numberOfSpecimens: 4,
		fixative: 'formalin',
		specimenLabelled: true
	};
	r.indication = {
		primaryIndication: 'inflammatory-disease',
		clinicalQuestion: 'Is there active colitis? Please assess for inflammatory bowel disease.',
		clinicalDetails: 'Three-month history of bloody diarrhoea; colonoscopy showed patchy erythema.',
		provisionalDiagnosis: 'Ulcerative colitis',
		previousHistology: 'None'
	};
	r.urgency = { urgentFrozenSection: false, twoWeekWait: false, urgency: 'routine' };
	r.triage = { setting: 'outpatient', requestedByDate: '2026-06-24', notes: '' };
	return r;
}

/**
 * A suspected-cancer two-week-wait request: a skin-lesion excision for
 * suspected malignancy, fixed and labelled. Auto-escalates triage to
 * two-week-wait; raises the suspected-cancer flag.
 */
function twoWeekWaitMalignancyRequest(): HistopathologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'dermatologist',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'Selly Oak Dermatology Clinic',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		interpreterRequired: false
	};
	r.specimen = {
		specimenType: 'skin-lesion',
		specimenSite: 'Left forearm skin',
		numberOfSpecimens: 1,
		fixative: 'formalin',
		specimenLabelled: true
	};
	r.indication = {
		primaryIndication: 'suspected-malignancy',
		clinicalQuestion: 'Is this a melanoma? Please report Breslow thickness and margins.',
		clinicalDetails: 'Changing pigmented lesion with irregular border and recent growth.',
		provisionalDiagnosis: 'Suspected melanoma',
		previousHistology: 'None'
	};
	r.urgency = { urgentFrozenSection: false, twoWeekWait: true, urgency: 'two-week-wait' };
	r.triage = { setting: 'outpatient', requestedByDate: '2026-06-19', notes: '2WW pathway.' };
	return r;
}

/**
 * An urgent intra-operative frozen section: immediate diagnosis required.
 * Auto-escalates triage to two-week-wait tier with an immediate timeframe.
 */
function frozenSectionRequest(): HistopathologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'surgeon',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'theatre bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General Theatres',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148',
		interpreterRequired: false
	};
	r.specimen = {
		specimenType: 'frozen-section',
		specimenSite: 'Right breast lumpectomy margin',
		numberOfSpecimens: 1,
		fixative: 'fresh',
		specimenLabelled: true
	};
	r.indication = {
		primaryIndication: 'margin-assessment',
		clinicalQuestion: 'Are the resection margins clear? Patient is on the table awaiting decision.',
		clinicalDetails: 'Wide local excision in progress; intra-operative margin assessment requested.',
		provisionalDiagnosis: 'Invasive ductal carcinoma',
		previousHistology: 'Core biopsy: invasive ductal carcinoma, grade 2.'
	};
	r.urgency = { urgentFrozenSection: true, twoWeekWait: false, urgency: 'urgent' };
	r.triage = { setting: 'inpatient', requestedByDate: '2026-06-13', notes: 'Intra-operative.' };
	return r;
}

/**
 * A reject-risk, incomplete request: a fresh (unfixed) biopsy outside a
 * frozen-section pathway, container not labelled, and no clinical indication or
 * question. Grades to query-referrer.
 */
function rejectRiskIncompleteRequest(): HistopathologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Tom Reed',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7321009',
		requesterContact: 'tom.reed@nhs.net',
		supervisingConsultant: '',
		siteName: 'Cowley Road Surgery',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Eleanor',
		lastName: 'Fox',
		dateOfBirth: '1972-09-30',
		nhsNumber: '',
		interpreterRequired: false
	};
	r.specimen = {
		specimenType: 'biopsy',
		specimenSite: 'Right forearm skin',
		numberOfSpecimens: null,
		fixative: 'fresh',
		specimenLabelled: false
	};
	r.indication = {
		primaryIndication: '',
		clinicalQuestion: '',
		clinicalDetails: '',
		provisionalDiagnosis: '',
		previousHistology: ''
	};
	r.urgency = { urgentFrozenSection: false, twoWeekWait: false, urgency: 'routine' };
	r.triage = { setting: 'community', requestedByDate: '', notes: '' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'HX-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineInflammatoryRequest()
	},
	{
		id: 'HX-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: twoWeekWaitMalignancyRequest()
	},
	{
		id: 'HX-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: frozenSectionRequest()
	},
	{
		id: 'HX-2026-0004',
		patientName: 'Eleanor Fox',
		referralDate: '2026-06-14',
		request: rejectRiskIncompleteRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		specimenType: s.request.specimen.specimenType,
		primaryIndication: s.request.indication.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		specimenQualityBand: g.specimenQualityBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
