import type { UltrasoundRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';
import { formatGestationalAge } from '#lib/engine/utils.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: UltrasoundRequest;
}

/**
 * A routine, appropriate dating request: reliable LMP, 12+3 weeks, dating scan.
 * Grades to accept / routine with full completeness.
 */
function routineDatingRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.clinicianRole = 'gp';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1994-02-11';
	d.patient.nhsNumber = '401 234 5678';
	d.dating.lastMenstrualPeriodDate = '2026-02-08';
	d.dating.lastMenstrualPeriodReliability = 'reliable';
	d.dating.estimatedDueDate = '2026-11-15';
	d.dating.estimatedDueDateMethod = 'lmp';
	d.dating.gestationalAgeWeeks = 12;
	d.dating.gestationalAgeDays = 3;
	d.history.gravida = 2;
	d.history.para = 1;
	d.history.plurality = 'singleton';
	d.history.conceptionMethod = 'spontaneous';
	d.request.requestedScanType = 'dating';
	d.request.primaryIndication = 'dating';
	d.request.clinicalQuestion = 'Confirm dating and viability of an ongoing intrauterine pregnancy.';
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	return d;
}

/**
 * An urgent growth / wellbeing request: reduced fetal movements at 31+5 weeks.
 * The reduced-movements red flag auto-escalates triage to urgent.
 */
function urgentReducedMovementsRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr K Mensah';
	d.clinician.clinicianRole = 'midwife';
	d.clinician.registrationBody = 'NMC';
	d.clinician.siteName = 'City Maternity Unit';
	d.clinician.referralDate = '2026-05-05';
	d.patient.firstName = 'Sofia';
	d.patient.lastName = 'Bianchi';
	d.patient.dateOfBirth = '1990-09-22';
	d.patient.nhsNumber = '402 345 6789';
	d.dating.gestationalAgeWeeks = 31;
	d.dating.gestationalAgeDays = 5;
	d.dating.estimatedDueDate = '2026-06-30';
	d.dating.estimatedDueDateMethod = 'ultrasound';
	d.history.gravida = 1;
	d.history.para = 0;
	d.history.plurality = 'singleton';
	d.request.requestedScanType = 'growth';
	d.request.primaryIndication = 'reduced-fetal-movements';
	d.request.clinicalQuestion =
		'Assess fetal growth and wellbeing following two days of reduced fetal movements.';
	d.symptoms.reducedFetalMovements = true;
	d.triage.urgency = 'urgent';
	d.triage.setting = 'outpatient';
	return d;
}

/**
 * An aneuploidy-screening request booked outside the nuchal-translucency window
 * (16+2 weeks). Grades to redirect with a window-mismatch flag.
 */
function outsideWindowNuchalRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr L Romano';
	d.clinician.clinicianRole = 'obstetrician';
	d.clinician.registrationBody = 'GMC';
	d.clinician.siteName = 'Riverside Antenatal Clinic';
	d.clinician.referralDate = '2026-05-05';
	d.patient.firstName = 'Petra';
	d.patient.lastName = 'Novak';
	d.patient.dateOfBirth = '1988-12-03';
	d.patient.nhsNumber = '403 456 7890';
	d.dating.gestationalAgeWeeks = 16;
	d.dating.gestationalAgeDays = 2;
	d.dating.estimatedDueDate = '2026-10-20';
	d.dating.estimatedDueDateMethod = 'lmp';
	d.history.gravida = 3;
	d.history.para = 2;
	d.history.plurality = 'singleton';
	d.request.requestedScanType = 'nuchal-translucency';
	d.request.primaryIndication = 'aneuploidy-screening';
	d.request.clinicalQuestion = 'Combined first-trimester screening for aneuploidy.';
	d.triage.urgency = 'routine';
	d.triage.setting = 'outpatient';
	return d;
}

/**
 * An emergency request: suspected ectopic pregnancy with bleeding at 7 weeks.
 * Auto-escalates triage to emergency with the suspected-ectopic flag.
 */
function emergencyEctopicRequest(): UltrasoundRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr M Adebayo';
	d.clinician.clinicianRole = 'gynaecologist';
	d.clinician.registrationBody = 'GMC';
	d.clinician.siteName = 'City General EPAU';
	d.clinician.referralDate = '2026-05-06';
	d.patient.firstName = 'Layla';
	d.patient.lastName = 'Hassan';
	d.patient.dateOfBirth = '1996-06-18';
	d.patient.nhsNumber = '404 567 8901';
	d.dating.lastMenstrualPeriodDate = '2026-03-18';
	d.dating.lastMenstrualPeriodReliability = 'uncertain';
	d.dating.gestationalAgeWeeks = 7;
	d.dating.gestationalAgeDays = 0;
	d.history.gravida = 2;
	d.history.para = 0;
	d.request.requestedScanType = 'viability';
	d.request.primaryIndication = 'exclude-ectopic';
	d.request.clinicalQuestion =
		'Confirm intrauterine location and viability; exclude ectopic pregnancy.';
	d.symptoms.vaginalBleeding = 'moderate';
	d.symptoms.abdominalPain = 'moderate';
	d.symptoms.suspectedEctopic = true;
	d.triage.urgency = 'emergency';
	d.triage.setting = 'emergency';
	return d;
}

/** The sample requests used by the dashboard and seeded into the wizard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'PU-2026-0001',
		patientName: 'Okafor, Amara',
		referralDate: '2026-05-04',
		request: routineDatingRequest()
	},
	{
		id: 'PU-2026-0002',
		patientName: 'Bianchi, Sofia',
		referralDate: '2026-05-05',
		request: urgentReducedMovementsRequest()
	},
	{
		id: 'PU-2026-0003',
		patientName: 'Novak, Petra',
		referralDate: '2026-05-05',
		request: outsideWindowNuchalRequest()
	},
	{
		id: 'PU-2026-0004',
		patientName: 'Hassan, Layla',
		referralDate: '2026-05-06',
		request: emergencyEctopicRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		referralDate: s.referralDate,
		patientName: s.patientName,
		nhsNumber: s.request.patient.nhsNumber,
		scanType: s.request.request.requestedScanType,
		indication: s.request.request.primaryIndication,
		gestationalAge: formatGestationalAge(
			s.request.dating.gestationalAgeWeeks,
			s.request.dating.gestationalAgeDays
		),
		appropriatenessBand: g.appropriatenessBand,
		windowFit: g.windowFit,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
