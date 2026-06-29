import type { PetScanRequest, DashboardRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefault } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: PetScanRequest;
}

/**
 * A routine, appropriate FDG-PET-CT staging request: well-prepared, normal
 * glucose, complete. Grades to accept / routine.
 */
function routineStaging(): PetScanRequest {
	const r = createDefault();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'oncologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	r.clinician.siteName = 'Churchill Hospital Oncology';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.weightKg = 68;
	r.patient.setting = 'outpatient';
	r.request.scanType = 'fdg-pet-ct';
	r.request.primaryIndication = 'cancer-staging';
	r.request.clinicalQuestion = 'Stage biopsy-proven NSCLC and assess for distant metastases.';
	r.context.primaryTumourSite = 'Right upper lobe lung';
	r.context.relevantHistory = 'Biopsy-proven adenocarcinoma; CT shows a 3 cm RUL mass.';
	r.preparation.bloodGlucoseMmolL = 5.6;
	r.preparation.pregnancyStatus = 'not-applicable';
	r.preparation.egfr = 84;
	r.justification.irMeRJustification =
		'Staging directly determines curative vs palliative intent; benefit outweighs the dose.';
	r.justification.urgency = 'routine';
	r.triage.requestedByDate = '2026-07-01';
	return r;
}

/**
 * An urgent PSMA-PET restaging request, complete and well-prepared. Urgent
 * triage follows the requested urgency.
 */
function urgentRestaging(): PetScanRequest {
	const r = createDefault();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'oncologist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'james.carter@nhs.net · 0121 000000';
	r.clinician.siteName = 'Queen Elizabeth Hospital';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1949-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.patient.weightKg = 81;
	r.patient.setting = 'outpatient';
	r.request.scanType = 'psma-pet';
	r.request.primaryIndication = 'cancer-restaging';
	r.request.clinicalQuestion = 'Restage prostate cancer with rising PSA; localise biochemical recurrence.';
	r.context.primaryTumourSite = 'Prostate';
	r.context.relevantHistory = 'Post-prostatectomy; PSA risen from 0.1 to 1.4 over six months.';
	r.preparation.pregnancyStatus = 'not-applicable';
	r.preparation.egfr = 72;
	r.justification.irMeRJustification = 'Recurrence localisation guides salvage therapy decision.';
	r.justification.urgency = 'urgent';
	r.triage.requestedByDate = '2026-06-20';
	return r;
}

/**
 * A contraindicated request: pregnant patient. Preparation safety is
 * contraindicated and the overall recommendation is reject.
 */
function pregnantContraindicated(): PetScanRequest {
	const r = createDefault();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'hospital-doctor';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.requesterContact = 'ED bleep 1234';
	r.clinician.siteName = 'City General';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Aisha';
	r.patient.lastName = 'Rahman';
	r.patient.dateOfBirth = '1992-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.patient.weightKg = 64;
	r.patient.setting = 'inpatient';
	r.request.scanType = 'fdg-pet-ct';
	r.request.primaryIndication = 'lymphoma';
	r.request.clinicalQuestion = 'Stage suspected lymphoma.';
	r.context.primaryTumourSite = 'Cervical nodes';
	r.preparation.bloodGlucoseMmolL = 5.1;
	r.preparation.pregnancyStatus = 'pregnant';
	r.justification.irMeRJustification = '';
	r.justification.urgency = 'urgent';
	return r;
}

/**
 * An incomplete request with uncontrolled glucose: missing clinical question
 * and justification, glucose above ~11 mmol/L. Grades to query-referrer.
 */
function incompleteUncontrolledGlucose(): PetScanRequest {
	const r = createDefault();
	r.clinician.clinicianName = 'Dr Tom Reed';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.clinician.referralDate = '2026-06-14';
	r.patient.firstName = 'George';
	r.patient.lastName = 'Patel';
	r.patient.dateOfBirth = '1955-02-09';
	r.patient.nhsNumber = '610 224 7788';
	r.patient.setting = 'community';
	r.request.scanType = 'fdg-pet-ct';
	r.request.primaryIndication = 'suspected-recurrence';
	r.request.clinicalQuestion = '';
	r.preparation.diabetes = true;
	r.preparation.bloodGlucoseMmolL = 13.8;
	r.preparation.pregnancyStatus = 'not-applicable';
	r.justification.irMeRJustification = '';
	r.justification.urgency = 'routine';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'PET-2026-0001', patientName: 'Margaret Hughes', referralDate: '2026-06-10', request: routineStaging() },
	{ id: 'PET-2026-0002', patientName: 'Derek Mensah', referralDate: '2026-06-12', request: urgentRestaging() },
	{ id: 'PET-2026-0003', patientName: 'Aisha Rahman', referralDate: '2026-06-13', request: pregnantContraindicated() },
	{ id: 'PET-2026-0004', patientName: 'George Patel', referralDate: '2026-06-14', request: incompleteUncontrolledGlucose() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: DashboardRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		scanType: s.request.request.scanType,
		primaryIndication: s.request.request.primaryIndication,
		urgency: s.request.justification.urgency,
		appropriatenessBand: g.appropriatenessBand,
		prepSafetyBand: g.prepSafetyBand,
		radiationDoseBand: g.radiationDoseBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
