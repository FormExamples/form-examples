import type { DexaRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/result.svelte.js';

/** A sample DEXA request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: DexaRequest;
}

/**
 * A routine, appropriate request: post-menopausal osteoporosis screening of the
 * hip and spine, fully completed. Grades to usually-appropriate / low dose /
 * routine / accept with no flags.
 */
function routineScreeningRequest(): DexaRequest {
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
		pregnancyStatus: 'not-applicable'
	};
	r.request = {
		scanRegion: 'hip-and-spine',
		primaryIndication: 'osteoporosis-screening',
		clinicalQuestion: 'Post-menopausal osteoporosis screening — please measure BMD and report T-scores.',
		relevantHistory: 'Post-menopausal at 51; maternal hip fracture; otherwise well.'
	};
	r.riskFactors = {
		fraxMajorFracturePercent: 12,
		previousFragilityFracture: false,
		longTermSteroids: false,
		menopauseStatus: 'post',
		parentalHipFracture: true,
		weightKg: 62
	};
	r.previousDexa = { previousDexa: 'none', previousDexaDate: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/**
 * An urgent request: recent fragility fracture with a very high FRAX probability.
 * The high-acuity factors auto-escalate triage to urgent and raise a high-priority
 * flag, but the request itself is appropriate and complete → accept / urgent.
 */
function fragilityFractureRequest(): DexaRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'rheumatologist',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'Selly Oak Rheumatology',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		pregnancyStatus: 'not-applicable'
	};
	r.request = {
		scanRegion: 'hip-and-spine',
		primaryIndication: 'fragility-fracture',
		clinicalQuestion: 'Recent low-trauma wrist fracture — confirm osteoporosis and guide treatment.',
		relevantHistory: 'Distal radius fracture after a fall from standing height six weeks ago.'
	};
	r.riskFactors = {
		fraxMajorFracturePercent: 34,
		previousFragilityFracture: true,
		longTermSteroids: false,
		menopauseStatus: 'not-applicable',
		parentalHipFracture: true,
		weightKg: 70
	};
	r.previousDexa = { previousDexa: 'none', previousDexaDate: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * A request that must be deferred: known/possible pregnancy raises the radiation
 * dose band to high and drives the recommendation to redirect / defer.
 */
function pregnancyDeferRequest(): DexaRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'endocrinologist',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'priya.nair@nhs.net',
		supervisingConsultant: '',
		siteName: 'City General Endocrinology',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Amelia',
		lastName: 'Brooks',
		dateOfBirth: '1992-07-21',
		nhsNumber: '309 552 0148',
		pregnancyStatus: 'possible'
	};
	r.request = {
		scanRegion: 'spine',
		primaryIndication: 'long-term-steroids',
		clinicalQuestion: 'Long-term prednisolone — assess steroid-induced osteoporosis risk.',
		relevantHistory: 'On 10 mg prednisolone daily for 14 months for SLE; possibly pregnant.'
	};
	r.riskFactors = {
		fraxMajorFracturePercent: 9,
		previousFragilityFracture: false,
		longTermSteroids: true,
		menopauseStatus: 'pre',
		parentalHipFracture: false,
		weightKg: 58
	};
	r.previousDexa = { previousDexa: 'none', previousDexaDate: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * An incomplete, poorly-sited request: forearm DEXA for a screening indication
 * with no clinical question and no FRAX. Low completeness drives the
 * recommendation to query-referrer; "other"-style gaps add medium flags.
 */
function incompleteRequest(): DexaRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Tom Reed',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7333210',
		requesterContact: 'ward bleep 2210',
		supervisingConsultant: '',
		siteName: 'County Hospital',
		referralDate: '2026-06-15'
	};
	r.patient = {
		firstName: 'Helen',
		lastName: 'Carter',
		dateOfBirth: '1969-02-09',
		nhsNumber: '',
		pregnancyStatus: 'not-pregnant'
	};
	r.request = {
		scanRegion: 'forearm',
		primaryIndication: 'osteoporosis-screening',
		clinicalQuestion: '',
		relevantHistory: 'Generalised aches; query bone health.'
	};
	r.riskFactors = {
		fraxMajorFracturePercent: null,
		previousFragilityFracture: false,
		longTermSteroids: false,
		menopauseStatus: 'peri',
		parentalHipFracture: false,
		weightKg: null
	};
	r.previousDexa = { previousDexa: 'osteopenia', previousDexaDate: '2025-09-01' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'inpatient', notes: '' };
	return r;
}

/** The sample requests used by the dashboard and wizard hydration. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'DX-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineScreeningRequest()
	},
	{
		id: 'DX-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: fragilityFractureRequest()
	},
	{
		id: 'DX-2026-0003',
		patientName: 'Amelia Brooks',
		referralDate: '2026-06-13',
		request: pregnancyDeferRequest()
	},
	{
		id: 'DX-2026-0004',
		patientName: 'Helen Carter',
		referralDate: '2026-06-15',
		request: incompleteRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		scanRegion: s.request.request.scanRegion,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		appropriatenessScore: g.appropriatenessScore,
		radiationDoseBand: g.radiationDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
