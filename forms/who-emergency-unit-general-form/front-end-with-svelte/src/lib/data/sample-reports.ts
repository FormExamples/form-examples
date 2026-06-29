import type { AssessmentData, FlagPriority, TriageCategory, Disposition } from '$lib/engine/types';
import { gradeEuGeneral } from '$lib/engine/eu-general-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample encounter: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	recordedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	recordedDate: string;
	triageCategory: TriageCategory;
	avpu: string;
	disposition: Disposition;
	complete: boolean;
	urgentFlags: number;
	totalFlags: number;
	topPriority: FlagPriority | null;
	recordedBy: string;
}

/**
 * Fill every field the completeness rules require for an unremarkable adult
 * walk-in: registration, chief complaint and initial vitals, the ABCD primary
 * survey ("Normal" ticks), HPI, PMH source, assessment & plan, and the
 * disposition block with provider sign-off.
 */
function fillComplete(d: AssessmentData): AssessmentData {
	d.patientRegistration.sex = 'female';
	d.patientRegistration.dateOfBirth = '1985-06-15';
	d.patientRegistration.dateOfArrival = '2026-04-20';
	d.patientRegistration.timeOfArrival = '14:30';
	d.patientRegistration.arrivalMode = 'walk';

	d.chiefComplaintAndVitals.chiefComplaint = 'Headache';
	d.chiefComplaintAndVitals.triageCategory = 'green';
	d.chiefComplaintAndVitals.initialVitals.time = '14:35';
	d.chiefComplaintAndVitals.initialVitals.tempC = 37;
	d.chiefComplaintAndVitals.initialVitals.pulse = 78;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 16;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 98;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 120;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 80;

	d.airway.normal = true;
	d.breathing.normal = true;
	d.circulation.normal = true;
	d.disability.avpu = 'A';

	d.historyOfPresentIllness.narrative = 'Mild headache for two days, no associated symptoms.';

	d.pastMedicalHistory.historyObtainedFrom = 'Patient';
	d.pastMedicalHistory.medicationsUnknown = true;
	d.pastMedicalHistory.allergiesUnknown = true;

	d.assessmentAndPlan.narrative = 'Tension headache. Discharge with simple analgesia and follow-up.';

	d.disposition.edDepartureDate = '2026-04-20';
	d.disposition.edDepartureTime = '16:00';
	d.disposition.diagnosesImpressions = 'Tension headache.';
	d.disposition.disposition = 'discharge';
	d.disposition.dischargePlanDiscussed = 'yes';
	d.disposition.emergencyUnitProvider = 'Dr. Mensah, MD';
	d.disposition.signature = 'A. Mensah';
	d.disposition.signatureDate = '2026-04-20';
	return d;
}

/** A benign, fully-complete walk-in: discharged, no flagged issues. */
function benignComplete(): AssessmentData {
	const d = fillComplete(createDefaultAssessment());
	d.patientRegistration.surname = 'Chen';
	d.patientRegistration.firstName = 'Wei';
	d.patientRegistration.sex = 'female';
	d.patientRegistration.dateOfBirth = '1995-07-15';
	d.chiefComplaintAndVitals.chiefComplaint = 'Lower abdominal pain, nausea';
	return d;
}

/**
 * A complete admission with medium-priority flags: a pregnant patient with an
 * elevated temperature and a high heart rate. Admitted to the ward.
 */
function pregnantAdmit(): AssessmentData {
	const d = fillComplete(createDefaultAssessment());
	d.patientRegistration.surname = 'Fernandes';
	d.patientRegistration.firstName = 'Carla';
	d.patientRegistration.dateOfBirth = '1988-06-09';
	d.patientRegistration.arrivalMode = 'ambulance';
	d.patientRegistration.ambulanceLevel = 'basic';
	d.chiefComplaintAndVitals.chiefComplaint = 'Severe headache, photophobia';
	d.chiefComplaintAndVitals.triageCategory = 'orange';
	d.chiefComplaintAndVitals.initialVitals.tempC = 39.2;
	d.chiefComplaintAndVitals.initialVitals.pulse = 122;
	d.pastMedicalHistory.pregnant = 'yes';
	d.pastMedicalHistory.pregnancyReported = true;
	d.assessmentAndPlan.narrative = 'Febrile pregnant patient; admit for observation and obstetric review.';
	d.disposition.disposition = 'admit';
	d.disposition.admitWard = 'ward';
	d.disposition.diagnosesImpressions = 'Febrile illness in pregnancy.';
	d.disposition.emergencyUnitProvider = 'Dr. Okafor, MD';
	d.disposition.signature = 'B. Okafor';
	return d;
}

/**
 * A complete but critical transfer: reduced consciousness (AVPU = P), critically
 * low SpO2 and abnormal respiratory rate — multiple urgent flags. Transferred.
 */
function criticalTransfer(): AssessmentData {
	const d = fillComplete(createDefaultAssessment());
	d.patientRegistration.surname = 'Engström';
	d.patientRegistration.firstName = 'Lars';
	d.patientRegistration.sex = 'male';
	d.patientRegistration.dateOfBirth = '1949-02-18';
	d.patientRegistration.arrivalMode = 'ambulance';
	d.patientRegistration.ambulanceLevel = 'advanced';
	d.chiefComplaintAndVitals.chiefComplaint = 'Altered mental status, fever';
	d.chiefComplaintAndVitals.triageCategory = 'red';
	d.chiefComplaintAndVitals.initialVitals.tempC = 39.5;
	d.chiefComplaintAndVitals.initialVitals.pulse = 134;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 32;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 86;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 82;
	d.highRiskSigns.abnormalAvpu = true;
	d.highRiskSigns.respiratoryDistress = true;
	d.disability.avpu = 'P';
	// Breathing intervention recorded so SpO2 flag reflects active management.
	d.breathing.normal = false;
	d.breathing.oxygenNonRebreather = true;
	d.assessmentAndPlan.narrative = 'Sepsis with reduced consciousness; transfer to higher level of care.';
	d.disposition.disposition = 'transfer';
	d.disposition.transferTo = 'Regional ICU';
	d.disposition.diagnosesImpressions = 'Septic shock, encephalopathy.';
	d.disposition.emergencyUnitProvider = 'Dr. Thompson, MD';
	d.disposition.signature = 'C. Thompson';
	return d;
}

/**
 * A critical, incomplete record: unresponsive patient (AVPU = U) with no airway
 * intervention and hypoglycaemia — urgent flags — and several mandatory fields
 * (assessment & plan, disposition sign-off) left blank.
 */
function criticalIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientRegistration.surname = 'Goldberg';
	d.patientRegistration.firstName = 'Daniel';
	d.patientRegistration.sex = 'male';
	d.patientRegistration.dateOfBirth = '1965-11-27';
	d.patientRegistration.dateOfArrival = '2026-04-18';
	d.patientRegistration.timeOfArrival = '07:55';
	d.patientRegistration.arrivalMode = 'ambulance';
	// ambulanceLevel intentionally blank → incomplete
	d.chiefComplaintAndVitals.chiefComplaint = 'Cardiac arrest, ROSC achieved en route';
	d.chiefComplaintAndVitals.triageCategory = 'red';
	d.chiefComplaintAndVitals.initialVitals.time = '08:00';
	d.chiefComplaintAndVitals.initialVitals.pulse = 48;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 6;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 84;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 88;
	d.highRiskSigns.abnormalAvpu = true;
	d.disability.avpu = 'U';
	d.disability.bloodGlucoseMmol = 2.4;
	// No airway intervention → urgent flag. Assessment/plan and disposition blank.
	return d;
}

/** The sample encounters, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EU-2026-0001', patientName: 'Chen, Wei', recordedDate: '2026-04-20', data: benignComplete() },
	{ id: 'EU-2026-0002', patientName: 'Fernandes, Carla', recordedDate: '2026-04-17', data: pregnantAdmit() },
	{ id: 'EU-2026-0003', patientName: 'Engström, Lars', recordedDate: '2026-04-16', data: criticalTransfer() },
	{ id: 'EU-2026-0004', patientName: 'Goldberg, Daniel', recordedDate: '2026-04-18', data: criticalIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeEuGeneral(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		recordedDate: s.recordedDate,
		triageCategory: s.data.chiefComplaintAndVitals.triageCategory,
		avpu: s.data.disability.avpu || '—',
		disposition: s.data.disposition.disposition,
		complete: g.complete,
		urgentFlags: g.urgentCount,
		totalFlags: g.flags.length,
		topPriority: g.topPriority,
		recordedBy: s.data.disposition.emergencyUnitProvider || '—'
	};
});
