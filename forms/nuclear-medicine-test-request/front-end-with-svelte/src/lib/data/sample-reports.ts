import type {
	NuclearMedicineRequest,
	ScanType,
	Indication,
	AppropriatenessBand,
	PrepSafetyBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/stores/request.svelte.js';

/** A sample nuclear medicine request: an identifier and the full data the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	data: NuclearMedicineRequest;
}

/** A row in the vetting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	referralDate: string;
	scanType: ScanType;
	primaryIndication: Indication;
	appropriatenessBand: AppropriatenessBand;
	prepSafetyBand: PrepSafetyBand;
	radiationDoseBand: RadiationDoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}

/**
 * Fully appropriate, safe, complete routine request. Bone scan for suspected
 * bone metastases → accept / routine.
 */
function acceptRoutine(): NuclearMedicineRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr H. Iqbal',
		clinicianRole: 'oncologist',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		referralDate: '2026-05-04',
		requesterContact: 'h.iqbal@nhs.net',
		supervisingConsultant: 'Dr N. Farooq',
		siteName: 'Oncology Outpatients'
	};
	d.patient = {
		...d.patient,
		firstName: 'Amara',
		lastName: 'Okafor',
		dateOfBirth: '1962-02-18',
		nhsNumber: '401 234 5678',
		weightKg: 68
	};
	d.request = {
		...d.request,
		scanType: 'bone-scan',
		primaryIndication: 'suspected-bone-metastases',
		clinicalQuestion: 'Identify osseous metastatic disease in a patient with prostate cancer and bone pain.',
		relevantHistory: 'Prostate cancer diagnosed 2024; rising PSA; new lower-back pain.'
	};
	d.safety = { ...d.safety, pregnancyStatus: 'not-applicable' };
	d.justification = {
		...d.justification,
		irMeRJustification: 'Rising PSA with new bone pain — staging for suspected metastatic disease.',
		supervisingConsultant: 'Dr N. Farooq'
	};
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-15', setting: 'outpatient' };
	return d;
}

/**
 * Appropriate thyroid-uptake request but with confirmed pregnancy → the
 * preparation & radiation-safety band is contraindicated and the request is
 * rejected pending justification.
 */
function rejectPregnancy(): NuclearMedicineRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr K. Mensah',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '6188921',
		referralDate: '2026-05-05',
		requesterContact: 'k.mensah@nhs.net',
		supervisingConsultant: 'Dr P. Adeyemi',
		siteName: 'Riverside Surgery'
	};
	d.patient = {
		...d.patient,
		firstName: 'Sofia',
		lastName: 'Bianchi',
		dateOfBirth: '1994-07-09',
		nhsNumber: '402 345 6789',
		weightKg: 61
	};
	d.request = {
		...d.request,
		scanType: 'thyroid-uptake',
		primaryIndication: 'thyroid-function',
		clinicalQuestion: 'Assess thyroid uptake in suspected hyperthyroidism.',
		relevantHistory: 'Weight loss, tremor, tachycardia over 6 weeks.'
	};
	d.safety = { ...d.safety, pregnancyStatus: 'pregnant' };
	d.justification = {
		...d.justification,
		irMeRJustification: 'Biochemical hyperthyroidism — characterise cause.',
		supervisingConsultant: 'Dr P. Adeyemi'
	};
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-01', setting: 'outpatient' };
	return d;
}

/**
 * Appropriate renal-MAG3 request with breastfeeding recorded → preparation &
 * radiation-safety caution, recommendation redirects (accept with safety
 * caution).
 */
function redirectBreastfeeding(): NuclearMedicineRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr L. Romano',
		clinicianRole: 'radiologist',
		registrationBody: 'GMC',
		registrationNumber: '7740012',
		referralDate: '2026-05-05',
		requesterContact: 'l.romano@nhs.net',
		supervisingConsultant: 'Dr J. Kowalczyk',
		siteName: 'Renal Unit'
	};
	d.patient = {
		...d.patient,
		firstName: 'Petra',
		lastName: 'Novak',
		dateOfBirth: '1996-11-30',
		nhsNumber: '403 456 7890',
		weightKg: 64
	};
	d.request = {
		...d.request,
		scanType: 'renal-mag3',
		primaryIndication: 'renal-function',
		clinicalQuestion: 'Assess split renal function and drainage post-partum.',
		relevantHistory: 'Antenatal hydronephrosis noted; six weeks post-partum, currently breastfeeding.'
	};
	d.safety = { ...d.safety, pregnancyStatus: 'not-pregnant', breastfeeding: true };
	d.justification = {
		...d.justification,
		irMeRJustification: 'Persistent hydronephrosis on postnatal ultrasound — assess drainage.',
		supervisingConsultant: 'Dr J. Kowalczyk'
	};
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-05', setting: 'outpatient' };
	return d;
}

/**
 * Suspected pulmonary embolism with a V/Q lung scan requested — auto-escalates
 * triage to emergency regardless of the requested urgency.
 */
function emergencyPulmonaryEmbolism(): NuclearMedicineRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr H. Iqbal',
		clinicianRole: 'other',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		referralDate: '2026-05-06',
		requesterContact: 'h.iqbal@nhs.net',
		supervisingConsultant: 'Dr N. Farooq',
		siteName: 'Emergency Department'
	};
	d.patient = {
		...d.patient,
		firstName: 'Niamh',
		lastName: 'Connolly',
		dateOfBirth: '1989-03-21',
		nhsNumber: '405 678 9012',
		weightKg: 58
	};
	d.request = {
		...d.request,
		scanType: 'vq-lung-scan',
		primaryIndication: 'pulmonary-embolism',
		clinicalQuestion: 'Sudden-onset pleuritic chest pain and breathlessness — exclude pulmonary embolism.',
		relevantHistory: 'Recent long-haul flight; CTPA is relatively contraindicated by possible pregnancy.'
	};
	d.safety = { ...d.safety, pregnancyStatus: 'possible' };
	d.justification = {
		...d.justification,
		irMeRJustification: 'Suspected PE in a patient where CTPA is relatively contraindicated — V/Q preferred.',
		supervisingConsultant: 'Dr N. Farooq'
	};
	d.triage = { ...d.triage, urgency: 'urgent', requestedByDate: '2026-05-06', setting: 'emergency' };
	return d;
}

/**
 * High-radiation-dose gallium/octreotide request for tumour localisation —
 * appropriate and safe once the high-dose flag is acknowledged, but
 * incomplete (missing clinical question and IR(ME)R justification) → query
 * the referrer.
 */
function queryReferrerIncomplete(): NuclearMedicineRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr M. Adebayo',
		clinicianRole: 'oncologist',
		registrationBody: 'GMC',
		registrationNumber: '6052277',
		referralDate: '2026-05-08',
		siteName: 'Oncology Day Unit'
	};
	d.patient = {
		...d.patient,
		firstName: 'Layla',
		lastName: 'Hassan',
		dateOfBirth: '1971-09-14',
		nhsNumber: '404 567 8901',
		weightKg: 72
	};
	d.request = {
		...d.request,
		scanType: 'gallium-octreotide',
		primaryIndication: 'tumour-localisation',
		clinicalQuestion: '',
		relevantHistory: 'Suspected neuroendocrine tumour on CT.'
	};
	d.safety = { ...d.safety, pregnancyStatus: 'not-applicable' };
	d.justification = { ...d.justification, irMeRJustification: '' };
	d.triage = { ...d.triage, urgency: 'routine', requestedByDate: '2026-06-10', setting: 'outpatient' };
	return d;
}

/** The sample requests, keyed by stable id (used to seed the wizard). */
export const sampleRequests: SampleRequest[] = [
	{ id: 'NM-2026-0001', patientName: 'Okafor, Amara', referralDate: '2026-05-04', data: acceptRoutine() },
	{ id: 'NM-2026-0002', patientName: 'Bianchi, Sofia', referralDate: '2026-05-05', data: rejectPregnancy() },
	{ id: 'NM-2026-0003', patientName: 'Novak, Petra', referralDate: '2026-05-05', data: redirectBreastfeeding() },
	{ id: 'NM-2026-0004', patientName: 'Connolly, Niamh', referralDate: '2026-05-06', data: emergencyPulmonaryEmbolism() },
	{ id: 'NM-2026-0005', patientName: 'Hassan, Layla', referralDate: '2026-05-08', data: queryReferrerIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		scanType: s.data.request.scanType,
		primaryIndication: s.data.request.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		prepSafetyBand: g.prepSafetyBand,
		radiationDoseBand: g.radiationDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
