import type { GeneticTestRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';
import { patientName } from '$lib/engine/utils';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: GeneticTestRequest;
}

/**
 * A complete, eligible, consented routine request: a BRCA gene panel for a
 * strong familial cancer history. Grades to accept / routine.
 */
function routineEligibleRequest(): GeneticTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'Clinical geneticist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	r.clinician.siteName = 'Oxford Clinical Genetics';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.patient.addressLine = '12 Headington Road, Oxford';
	r.request.testType = 'gene-panel';
	r.request.primaryIndication = 'familial-cancer';
	r.request.clinicalQuestion =
		'BRCA / hereditary breast-ovarian cancer panel for a strong familial history.';
	r.request.requestedByDate = '2026-07-10';
	r.clinical.clinicalDetails =
		'Two first-degree relatives with breast cancer under 50; patient unaffected, seeking risk assessment.';
	r.clinical.suspectedCondition = 'Hereditary breast and ovarian cancer syndrome';
	r.clinical.familyHistory =
		'Mother and maternal aunt with breast cancer; maternal grandmother with ovarian cancer.';
	r.clinical.affectedRelativeTested = false;
	r.consent.consentObtained = true;
	r.consent.geneticCounsellingOffered = true;
	r.triage.specimenType = 'blood';
	r.triage.urgency = 'routine';
	r.triage.setting = 'clinical-genetics';
	return r;
}

/**
 * A predictive / presymptomatic request without documented consent or
 * counselling. The consent axis is not-met (mandatory-blocking) → reject.
 */
function predictiveBlockedRequest(): GeneticTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr James Carter';
	r.clinician.clinicianRole = 'Genetic counsellor';
	r.clinician.registrationBody = 'GCRB';
	r.clinician.registrationNumber = 'GC-2231';
	r.clinician.requesterContact = 'james.carter@nhs.net';
	r.clinician.siteName = 'Birmingham Clinical Genetics';
	r.clinician.referralDate = '2026-06-12';
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.patient.dateOfBirth = '1990-11-02';
	r.patient.nhsNumber = '402 118 9921';
	r.request.testType = 'predictive-presymptomatic';
	r.request.primaryIndication = 'predictive-family-history';
	r.request.clinicalQuestion =
		'Predictive test for a known familial BRCA1 pathogenic variant identified in the proband.';
	r.clinical.clinicalDetails = 'Asymptomatic; mother carries a pathogenic BRCA1 variant.';
	r.clinical.familyHistory = 'Mother BRCA1 positive with breast cancer at 44.';
	r.consent.consentObtained = false;
	r.consent.geneticCounsellingOffered = false;
	r.triage.specimenType = 'blood';
	r.triage.urgency = 'routine';
	r.triage.setting = 'clinical-genetics';
	return r;
}

/**
 * A prenatal diagnostic request. Prenatal auto-escalates triage to urgent and
 * is time-critical.
 */
function prenatalTimeCriticalRequest(): GeneticTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Priya Nair';
	r.clinician.clinicianRole = 'Fetal medicine consultant';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.requesterContact = 'fetal.medicine@nhs.net';
	r.clinician.siteName = 'City General Fetal Medicine';
	r.clinician.referralDate = '2026-06-13';
	r.patient.firstName = 'Aisha';
	r.patient.lastName = 'Khan';
	r.patient.dateOfBirth = '1994-07-21';
	r.patient.nhsNumber = '309 552 0148';
	r.request.testType = 'prenatal';
	r.request.primaryIndication = 'prenatal-diagnosis';
	r.request.clinicalQuestion =
		'Prenatal diagnosis following an abnormal anomaly scan at 20 weeks; query chromosomal cause.';
	r.request.requestedByDate = '2026-06-20';
	r.clinical.clinicalDetails =
		'Increased nuchal translucency and cardiac anomaly on the 20-week scan.';
	r.clinical.familyHistory = 'No relevant family history reported.';
	r.consent.consentObtained = true;
	r.consent.geneticCounsellingOffered = true;
	r.triage.specimenType = 'prenatal';
	r.triage.urgency = 'urgent';
	r.triage.setting = 'paediatrics';
	return r;
}

/**
 * An indication / test-type mismatch: a karyotype requested for a suspected
 * single-gene disorder. Usually not appropriate → query-referrer.
 */
function mismatchQueryRequest(): GeneticTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Helen Patel';
	r.clinician.clinicianRole = 'Paediatrician';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7330988';
	r.clinician.requesterContact = 'helen.patel@nhs.net';
	r.clinician.siteName = 'Leeds Paediatrics';
	r.clinician.referralDate = '2026-06-14';
	r.patient.firstName = 'Thomas';
	r.patient.lastName = 'Reid';
	r.patient.dateOfBirth = '2021-02-09';
	r.patient.nhsNumber = '518 233 7740';
	r.request.testType = 'karyotype';
	r.request.primaryIndication = 'suspected-genetic-disorder';
	r.request.clinicalQuestion = 'Query a monogenic cause for the presentation.';
	r.clinical.clinicalDetails = 'Hypotonia and feeding difficulties since birth.';
	r.clinical.familyHistory = 'Non-consanguineous; no affected relatives.';
	r.consent.consentObtained = true;
	r.consent.geneticCounsellingOffered = true;
	r.triage.specimenType = 'blood';
	r.triage.urgency = 'routine';
	r.triage.setting = 'paediatrics';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'GTR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineEligibleRequest()
	},
	{
		id: 'GTR-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: predictiveBlockedRequest()
	},
	{
		id: 'GTR-2026-0003',
		patientName: 'Aisha Khan',
		referralDate: '2026-06-13',
		request: prenatalTimeCriticalRequest()
	},
	{
		id: 'GTR-2026-0004',
		patientName: 'Thomas Reid',
		referralDate: '2026-06-14',
		request: mismatchQueryRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName || patientName(s.request),
		testType: s.request.request.testType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		consentCounsellingBand: g.consentCounsellingBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
