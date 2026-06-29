import type { FluoroscopyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: FluoroscopyRequest;
}

/**
 * A routine, appropriate request: progressive dysphagia, barium swallow, complete
 * request, not pregnant. Grades to accept / routine.
 */
function routineRequest(): FluoroscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		bodyMassIndex: 24.5
	};
	r.request = {
		studyType: 'barium-swallow',
		primaryIndication: 'dysphagia',
		clinicalQuestion: 'Is there a stricture causing the progressive dysphagia?',
		relevantHistory: 'Three-month history of progressive dysphagia to solids.'
	};
	r.safety = {
		pregnancyStatus: 'not-pregnant',
		contrastAllergy: false,
		aspirationRisk: false,
		diabetes: false,
		irMeRJustification: 'Investigate progressive dysphagia; no recent equivalent imaging.'
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '',
		setting: 'community',
		notes: ''
	};
	return r;
}

/**
 * An urgent request: suspected small-bowel obstruction, barium follow-through.
 * The acuity rule auto-escalates triage to urgent.
 */
function urgentObstructionRequest(): FluoroscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'Selly Oak Hospital',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		bodyMassIndex: 28.1
	};
	r.request = {
		studyType: 'barium-follow-through',
		primaryIndication: 'suspected-obstruction',
		clinicalQuestion: 'Is there a small-bowel obstruction or transit delay?',
		relevantHistory: 'Two-day history of colicky abdominal pain, distension, and vomiting.'
	};
	r.safety = {
		pregnancyStatus: 'not-applicable',
		contrastAllergy: false,
		aspirationRisk: false,
		diabetes: true,
		irMeRJustification: 'Assess suspected partial small-bowel obstruction; plain films equivocal.'
	};
	r.triage = {
		urgency: 'urgent',
		requestedByDate: '2026-06-14',
		setting: 'inpatient',
		notes: ''
	};
	return r;
}

/**
 * A contraindicated request: barium swallow requested with suspected perforation.
 * Forces the safety band to contraindicated, emergency triage, and a redirect to
 * a water-soluble contrast study.
 */
function perforationRequest(): FluoroscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'surgeon',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'surgical bleep 1234',
		supervisingConsultant: 'Mr A Khan',
		siteName: 'City General Surgery',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148',
		bodyMassIndex: 26.0
	};
	r.request = {
		studyType: 'barium-swallow',
		primaryIndication: 'suspected-perforation',
		clinicalQuestion: 'Is there an oesophageal leak after endoscopic dilatation?',
		relevantHistory: 'Severe retrosternal pain and surgical emphysema after dilatation.'
	};
	r.safety = {
		pregnancyStatus: 'not-applicable',
		contrastAllergy: false,
		aspirationRisk: true,
		diabetes: false,
		irMeRJustification: 'Exclude oesophageal perforation following instrumentation.'
	};
	r.triage = {
		urgency: 'urgent',
		requestedByDate: '2026-06-13',
		setting: 'inpatient',
		notes: ''
	};
	return r;
}

/**
 * A pregnant patient with an ionising study and an incomplete request. Forces a
 * safety contraindication, a high-priority pregnancy flag, and a query-referrer
 * recommendation.
 */
function pregnancyContraindicatedRequest(): FluoroscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Helen Frost',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7211009',
		requesterContact: 'helen.frost@nhs.net',
		supervisingConsultant: '',
		siteName: 'Riverside Surgery',
		referralDate: '2026-06-15'
	};
	r.patient = {
		firstName: 'Aisha',
		lastName: 'Rahman',
		dateOfBirth: '1994-02-09',
		nhsNumber: '512 004 7781',
		bodyMassIndex: null
	};
	r.request = {
		studyType: 'barium-meal',
		primaryIndication: 'reflux',
		clinicalQuestion: '',
		relevantHistory: 'Ongoing reflux symptoms.'
	};
	r.safety = {
		pregnancyStatus: 'pregnant',
		contrastAllergy: false,
		aspirationRisk: false,
		diabetes: false,
		irMeRJustification: ''
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '',
		setting: 'community',
		notes: ''
	};
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'FL-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'FL-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentObstructionRequest()
	},
	{
		id: 'FL-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: perforationRequest()
	},
	{
		id: 'FL-2026-0004',
		patientName: 'Aisha Rahman',
		referralDate: '2026-06-15',
		request: pregnancyContraindicatedRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		studyType: s.request.request.studyType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		safetyBand: g.safetyBand,
		radiationDoseBand: g.radiationDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
