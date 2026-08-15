import type {
	MriRequest,
	BodyRegion,
	Indication,
	MriSafetyBand,
	ContrastRenalFlag,
	TriageTier,
	Recommendation
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/request.svelte.js';

/** A sample MRI request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: MriRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	mriSafetyBand: MriSafetyBand;
	contrastRenalFlag: ContrastRenalFlag;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}

/**
 * Low-acuity, fully appropriate, cleared safety screen, complete request.
 * Brain MRI for epilepsy with no implants and no contrast → accept / routine.
 */
function acceptRoutine(): MriRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr A. Okafor',
		clinicianRole: 'neurologist',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		referralDate: '2026-06-10',
		siteName: 'Neurology Outpatients'
	};
	d.patient = {
		...d.patient,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1986-04-12',
		nhsNumber: '485 777 3456',
		weightKg: 78
	};
	d.request = {
		...d.request,
		bodyRegion: 'brain',
		primaryIndication: 'epilepsy',
		clinicalQuestion: 'New-onset focal seizures — exclude a structural lesion.',
		relevantHistory: 'Two witnessed focal seizures over six weeks; normal examination.'
	};
	d.contrast = { ...d.contrast, contrastRequired: 'none', pregnancyStatus: 'not-applicable' };
	d.safety = { ...d.safety, mriSafetyStatus: 'cleared' };
	d.logistics = { ...d.logistics, weightVersusBoreLimit: 'within-limit', setting: 'outpatient' };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-07-20' };
	return d;
}

/**
 * Appropriate request but IV gadolinium with eGFR < 30 → contrast-renal
 * contraindication drives the recommendation to redirect / modify protocol.
 */
function redirectContrast(): MriRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr B. Lindgren',
		clinicianRole: 'oncologist',
		registrationBody: 'GMC',
		registrationNumber: '6188921',
		referralDate: '2026-06-12',
		siteName: 'Oncology Day Unit'
	};
	d.patient = {
		...d.patient,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		nhsNumber: '402 118 9043',
		weightKg: 82
	};
	d.request = {
		...d.request,
		bodyRegion: 'abdomen',
		primaryIndication: 'cancer-staging',
		clinicalQuestion: 'Stage known colorectal primary; characterise liver lesions.',
		relevantHistory: 'CT suggests indeterminate hepatic lesions.'
	};
	d.contrast = {
		...d.contrast,
		contrastRequired: 'iv-gadolinium',
		egfr: 24,
		previousGadoliniumReaction: 'none',
		pregnancyStatus: 'not-applicable'
	};
	d.safety = { ...d.safety, mriSafetyStatus: 'cleared' };
	d.logistics = { ...d.logistics, weightVersusBoreLimit: 'within-limit', setting: 'outpatient' };
	d.triage = { ...d.triage, urgency: 'urgent', requestedByDate: '2026-06-20' };
	return d;
}

/**
 * Cochlear implant (needs MR physics review) with a suspected-stroke
 * indication that auto-escalates triage to emergency → query the referrer.
 */
function queryReferrer(): MriRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr C. Mensah',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7740012',
		referralDate: '2026-06-15',
		siteName: 'Acute Medical Unit'
	};
	d.patient = {
		...d.patient,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1948-01-22',
		nhsNumber: '311 904 5562',
		weightKg: 70
	};
	d.request = {
		...d.request,
		bodyRegion: 'brain',
		primaryIndication: 'suspected-stroke',
		clinicalQuestion: 'Acute left-sided weakness — confirm infarct and exclude haemorrhage.',
		relevantHistory: 'Symptom onset four hours ago.'
	};
	d.contrast = { ...d.contrast, contrastRequired: 'none', pregnancyStatus: 'not-applicable' };
	d.safety = { ...d.safety, cochlearImplant: true, mriSafetyStatus: 'conditional' };
	d.logistics = { ...d.logistics, weightVersusBoreLimit: 'within-limit', setting: 'inpatient' };
	d.triage = { ...d.triage, urgency: 'urgent', requestedByDate: '2026-06-15' };
	return d;
}

/**
 * Cardiac pacemaker present (contraindicated) plus gadolinium with eGFR < 30
 * → the request is rejected.
 */
function rejectContraindicated(): MriRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr D. Reilly',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '6052277',
		referralDate: '2026-06-18',
		siteName: 'Riverside Surgery'
	};
	d.patient = {
		...d.patient,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1955-11-03',
		nhsNumber: '270 553 1188',
		weightKg: 95
	};
	d.request = {
		...d.request,
		bodyRegion: 'spine-lumbar',
		primaryIndication: 'back-pain-radiculopathy',
		clinicalQuestion: 'Chronic low back pain with right L5 radiculopathy.',
		relevantHistory: 'Permanent pacemaker fitted 2019; CKD stage 4.'
	};
	d.contrast = {
		...d.contrast,
		contrastRequired: 'iv-gadolinium',
		egfr: 20,
		previousGadoliniumReaction: 'none',
		pregnancyStatus: 'not-applicable'
	};
	d.safety = {
		...d.safety,
		pacemakerOrIcd: true,
		claustrophobia: true,
		mriSafetyStatus: 'unsafe'
	};
	d.logistics = { ...d.logistics, weightVersusBoreLimit: 'borderline', setting: 'outpatient' };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-08-01' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'MR-2026-0001', patientName: 'Smith, John', referralDate: '2026-06-10', data: acceptRoutine() },
	{ id: 'MR-2026-0002', patientName: 'Patel, Priya', referralDate: '2026-06-12', data: redirectContrast() },
	{ id: 'MR-2026-0003', patientName: 'Jones, Margaret', referralDate: '2026-06-15', data: queryReferrer() },
	{ id: 'MR-2026-0004', patientName: 'Williams, David', referralDate: '2026-06-18', data: rejectContraindicated() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		bodyRegion: s.data.request.bodyRegion,
		primaryIndication: s.data.request.primaryIndication,
		mriSafetyBand: g.mriSafetyBand,
		contrastRenalFlag: g.contrastRenalFlag,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
