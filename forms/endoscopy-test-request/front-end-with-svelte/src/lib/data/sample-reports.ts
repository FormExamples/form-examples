import type { EndoscopyRequest, ReferralRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: EndoscopyRequest;
}

/**
 * A routine, appropriate upper-GI request: persistent dyspepsia for an OGD with
 * a clear clinical question and no red flags. Grades to accept / routine / low.
 */
function routineDyspepsiaRequest(): EndoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'GP';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	r.clinician.siteName = 'Headington Medical Practice';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.dateOfBirth = '1968-03-14';
	r.patient.bodyMassIndex = 27;
	r.request.requestedProcedure = 'ogd';
	r.request.primaryIndication = 'dyspepsia';
	r.request.clinicalQuestion =
		'Persistent dyspepsia unresponsive to a PPI trial — exclude peptic ulcer disease and malignancy.';
	r.request.relevantHistory = 'Three months of epigastric pain, no alarm symptoms.';
	r.comorbidities.asaGrade = 'II';
	r.infectionPrep.sedation = 'throat-spray';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A two-week-wait lower-GI request: rectal bleeding with a positive FIT for a
 * colonoscopy in an over-55 patient. NICE DG56 escalates to two-week-wait.
 */
function twoWeekWaitColonoscopyRequest(): EndoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'GP';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'james.carter@nhs.net · 0121 000000';
	r.clinician.siteName = 'Selly Oak Surgery';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.nhsNumber = '402 118 9921';
	r.patient.dateOfBirth = '1957-11-02';
	r.patient.bodyMassIndex = 29;
	r.request.requestedProcedure = 'colonoscopy';
	r.request.primaryIndication = 'positive-fit';
	r.request.clinicalQuestion =
		'Positive FIT with rectal bleeding and change in bowel habit — exclude colorectal malignancy.';
	r.request.relevantHistory = 'Six weeks of looser stool and intermittent fresh rectal bleeding.';
	r.redFlags.redFlagAnaemia = true;
	r.redFlags.redFlagAgeOver55 = true;
	r.redFlags.fitResultUgG = 65;
	r.redFlags.haemoglobinGL = 118;
	r.redFlags.ferritinUgL = 22;
	r.comorbidities.asaGrade = 'II';
	r.infectionPrep.fitForBowelPrep = true;
	r.infectionPrep.bowelPrepAgent = 'split-dose-peg';
	r.infectionPrep.sedation = 'conscious-sedation';
	r.infectionPrep.escortAvailable = true;
	r.triage.urgency = 'two-week-wait';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * An emergency request: active upper-GI bleeding for an inpatient OGD with a low
 * haemoglobin. The acute red flag auto-escalates triage to emergency and the
 * Glasgow-Blatchford score drives a high risk band.
 */
function emergencyBleedRequest(): EndoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'Gastroenterology registrar';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.supervisingConsultant = 'Dr H Patel';
	r.clinician.requesterContact = 'GI bleed bleep 1234';
	r.clinician.siteName = 'City General — AMU';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.patient.nhsNumber = '309 552 0148';
	r.patient.dateOfBirth = '1951-07-21';
	r.patient.bodyMassIndex = 24;
	r.request.requestedProcedure = 'ogd';
	r.request.primaryIndication = 'upper-gi-bleeding';
	r.request.clinicalQuestion =
		'Haematemesis and melaena with a falling haemoglobin — locate and treat the bleeding source.';
	r.request.relevantHistory = 'Coffee-ground vomiting overnight, melaena, tachycardic.';
	r.redFlags.redFlagGiBleeding = true;
	r.redFlags.redFlagAnaemia = true;
	r.redFlags.redFlagAgeOver55 = true;
	r.redFlags.haemoglobinGL = 84;
	r.medication.takingAnticoagulant = true;
	r.medication.anticoagulantAgent = 'apixaban';
	r.comorbidities.cardiacNyhaClass = 'II';
	r.comorbidities.asaGrade = 'III';
	r.infectionPrep.sedation = 'conscious-sedation';
	r.triage.urgency = 'emergency';
	r.triage.setting = 'inpatient';
	return r;
}

/**
 * A high-risk therapeutic request: ERCP for biliary obstruction on warfarin. The
 * appropriateness is reasonable, but the high-bleeding-risk procedure plus
 * anticoagulation drives a high risk band and a peri-procedure plan flag.
 */
function highRiskErcpRequest(): EndoscopyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Aisha Khan';
	r.clinician.clinicianRole = 'Hepatobiliary surgeon';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7311902';
	r.clinician.requesterContact = 'aisha.khan@nhs.net';
	r.clinician.siteName = 'Regional HPB Unit';
	r.clinician.referralDate = '2026-06-14';
	r.patient.firstName = 'Eleanor';
	r.patient.lastName = 'Whitfield';
	r.patient.nhsNumber = '601 223 7788';
	r.patient.dateOfBirth = '1949-02-08';
	r.patient.bodyMassIndex = 31;
	r.request.requestedProcedure = 'ercp';
	r.request.primaryIndication = 'abnormal-imaging';
	r.request.clinicalQuestion =
		'CT-confirmed distal CBD stone with obstructive jaundice — ERCP and sphincterotomy / stone extraction.';
	r.request.relevantHistory = 'Painless jaundice, dilated CBD on CT, deranged LFTs.';
	r.redFlags.redFlagAgeOver55 = true;
	r.medication.takingAnticoagulant = true;
	r.medication.anticoagulantAgent = 'warfarin';
	r.comorbidities.cardiacNyhaClass = 'II';
	r.comorbidities.chronicKidneyDisease = true;
	r.comorbidities.egfrMlMin = 48;
	r.comorbidities.asaGrade = 'III';
	r.infectionPrep.sedation = 'deep-sedation';
	r.infectionPrep.escortAvailable = true;
	r.triage.urgency = 'urgent';
	r.triage.setting = 'day-case';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'ET-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineDyspepsiaRequest()
	},
	{
		id: 'ET-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: twoWeekWaitColonoscopyRequest()
	},
	{
		id: 'ET-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencyBleedRequest()
	},
	{
		id: 'ET-2026-0004',
		patientName: 'Eleanor Whitfield',
		referralDate: '2026-06-14',
		request: highRiskErcpRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: ReferralRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		requestedProcedure: s.request.request.requestedProcedure,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		riskBand: g.riskBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
