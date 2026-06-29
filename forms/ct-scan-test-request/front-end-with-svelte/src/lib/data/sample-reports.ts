import type { CtScanRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: CtScanRequest;
}

/**
 * A routine, appropriate request: CT chest for follow-up surveillance, no IV
 * contrast, fully complete. Grades to accept / routine.
 */
function routineSurveillanceRequest(): CtScanRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'oncologist',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Churchill Oncology Centre',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		weightKg: 68,
		interpreterRequired: false
	};
	r.request = {
		bodyRegion: 'chest',
		primaryIndication: 'follow-up-surveillance',
		clinicalQuestion: 'Surveillance CT chest for treated lung primary — assess for interval change.'
	};
	r.context = {
		relevantHistory: 'Stage I NSCLC resected 2024; routine surveillance per protocol.',
		relevantPreviousImaging: 'CT chest 6 months ago — no recurrence.'
	};
	r.contrast = {
		contrastRequired: 'none',
		egfr: 82,
		iodineContrastAllergy: false,
		previousContrastReaction: 'none',
		metformin: false,
		diabetes: false,
		renalImpairment: false
	};
	r.radiation = {
		pregnancyStatus: 'not-applicable',
		irMeRJustification: 'Scheduled surveillance imaging; benefit of detecting recurrence outweighs dose.'
	};
	r.triage = {
		urgency: 'routine',
		setting: 'outpatient',
		requestedByDate: '2026-07-15',
		notes: ''
	};
	return r;
}

/**
 * An emergency request: suspected acute stroke, CT head, no contrast. Stroke
 * auto-escalates triage to emergency. Grades to accept / emergency.
 */
function emergencyStrokeRequest(): CtScanRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'emergency-physician',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'ED bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General ED',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148',
		weightKg: 90,
		interpreterRequired: false
	};
	r.request = {
		bodyRegion: 'head',
		primaryIndication: 'suspected-stroke',
		clinicalQuestion: 'Sudden left hemiparesis 90 minutes ago — exclude haemorrhage before thrombolysis.'
	};
	r.context = {
		relevantHistory: 'Acute onset facial droop and arm weakness; FAST positive.',
		relevantPreviousImaging: 'None.'
	};
	r.contrast = {
		contrastRequired: 'none',
		egfr: 74,
		iodineContrastAllergy: false,
		previousContrastReaction: 'none',
		metformin: false,
		diabetes: false,
		renalImpairment: false
	};
	r.radiation = {
		pregnancyStatus: 'not-applicable',
		irMeRJustification: 'Emergency stroke imaging within the thrombolysis window; immediate clinical benefit.'
	};
	r.triage = {
		urgency: 'emergency',
		setting: 'emergency',
		requestedByDate: '2026-06-13',
		notes: 'Stroke team on standby.'
	};
	return r;
}

/**
 * A contraindicated request: CT pulmonary angiogram with IV iodinated contrast
 * but eGFR 24 and metformin. Renal risk forces the contrast band to
 * contraindicated; triage auto-escalates to emergency (suspected PE). Grades to
 * redirect (alternative study).
 */
function contraindicatedContrastRequest(): CtScanRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: 'Dr L Reid',
		siteName: 'Selly Oak Acute Medical Unit',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		weightKg: 78,
		interpreterRequired: false
	};
	r.request = {
		bodyRegion: 'ct-angiogram',
		primaryIndication: 'pulmonary-embolism',
		clinicalQuestion: 'Pleuritic chest pain and hypoxia with raised D-dimer — exclude pulmonary embolism.'
	};
	r.context = {
		relevantHistory: 'Recent immobility; sudden breathlessness and tachycardia.',
		relevantPreviousImaging: 'CXR clear.'
	};
	r.contrast = {
		contrastRequired: 'iv-iodinated',
		egfr: 24,
		iodineContrastAllergy: false,
		previousContrastReaction: 'none',
		metformin: true,
		diabetes: true,
		renalImpairment: true
	};
	r.radiation = {
		pregnancyStatus: 'not-applicable',
		irMeRJustification: 'Suspected PE; benefit of diagnosis outweighs dose, but renal function limits contrast.'
	};
	r.triage = {
		urgency: 'urgent',
		setting: 'inpatient',
		requestedByDate: '2026-06-12',
		notes: 'Discuss V/Q SPECT as a contrast-sparing alternative.'
	};
	return r;
}

/**
 * An urgent, high-dose request with a pregnancy flag: CT abdomen–pelvis with
 * IV + oral contrast for abdominal pain, pregnancy possible. Triage escalates to
 * urgent; high dose and pregnancy raise flags but contrast itself is safe.
 */
function urgentPregnancyRequest(): CtScanRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Helen Shah',
		clinicianRole: 'surgeon',
		registrationBody: 'GMC',
		registrationNumber: '7332001',
		requesterContact: 'surgical reg bleep 4567',
		supervisingConsultant: 'Mr A Cole',
		siteName: 'Royal Infirmary Surgical Assessment Unit',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Aisha',
		lastName: 'Khan',
		dateOfBirth: '1994-02-09',
		nhsNumber: '512 004 7781',
		weightKg: 64,
		interpreterRequired: true
	};
	r.request = {
		bodyRegion: 'abdomen-pelvis',
		primaryIndication: 'abdominal-pain',
		clinicalQuestion: 'Acute right iliac fossa pain — exclude appendicitis or other surgical cause.'
	};
	r.context = {
		relevantHistory: '24-hour history of worsening RIF pain, fever, raised inflammatory markers.',
		relevantPreviousImaging: 'Ultrasound inconclusive.'
	};
	r.contrast = {
		contrastRequired: 'both',
		egfr: 96,
		iodineContrastAllergy: false,
		previousContrastReaction: 'none',
		metformin: false,
		diabetes: false,
		renalImpairment: false
	};
	r.radiation = {
		pregnancyStatus: 'possible',
		irMeRJustification: 'Acute surgical abdomen; confirm pregnancy status and consider MRI / ultrasound first.'
	};
	r.triage = {
		urgency: 'urgent',
		setting: 'inpatient',
		requestedByDate: '2026-06-14',
		notes: 'Confirm LMP / pregnancy test before any ionising exposure.'
	};
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'CT-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineSurveillanceRequest()
	},
	{
		id: 'CT-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyStrokeRequest()
	},
	{
		id: 'CT-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: contraindicatedContrastRequest()
	},
	{
		id: 'CT-2026-0004',
		patientName: 'Aisha Khan',
		referralDate: '2026-06-14',
		request: urgentPregnancyRequest()
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
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		contrastSafetyBand: g.contrastSafetyBand,
		estimatedDoseBand: g.estimatedDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
