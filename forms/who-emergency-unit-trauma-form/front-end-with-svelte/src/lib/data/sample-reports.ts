import type { AssessmentData, Disposition, FlagPriority, TriageCategory } from '#lib/engine/types.js';
import { gradeEuTrauma } from '#lib/engine/eu-trauma-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	triage: TriageCategory;
	disposition: Disposition;
	complete: boolean;
	urgentFlags: number;
	totalFlags: number;
	topPriority: FlagPriority | null;
	recordedBy: string;
}

/** Patient display name in "SURNAME, First" form. */
function nameOf(d: AssessmentData): string {
	const r = d.patientRegistration;
	return [r.surname, r.firstName].filter(Boolean).join(', ');
}

/**
 * A complete, unremarkable GREEN walk-in: low-energy ankle injury, all primary
 * survey blocks Normal, discharged with a plan. No urgent flags.
 */
function greenComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientRegistration.surname = 'DOE';
	d.patientRegistration.firstName = 'Jane';
	d.patientRegistration.sex = 'female';
	d.patientRegistration.dateOfBirth = '1985-06-15';
	d.patientRegistration.age = 39;
	d.patientRegistration.dateOfArrival = '2026-04-20';
	d.patientRegistration.timeOfArrival = '14:30';
	d.patientRegistration.arrivalMode = 'walk';
	d.patientRegistration.injuryLocationUnknown = true;

	d.chiefComplaintAndVitals.chiefComplaint = 'Right ankle injury after slipping.';
	d.chiefComplaintAndVitals.allergiesUnknown = true;
	d.chiefComplaintAndVitals.initialVitals.time = '14:35';
	d.chiefComplaintAndVitals.initialVitals.pulse = 78;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 16;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 98;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 120;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 80;
	d.chiefComplaintAndVitals.initialVitals.tempC = 36.7;

	d.triage.category = 'green';
	d.triage.triagedFor = 'Isolated limb injury';

	d.airway.normal = true;
	d.breathing.normal = true;
	d.circulation.normal = true;
	d.disability.avpu = 'A';
	d.disability.gcsTotal = 15;

	d.injuryHistory.dateOfInjury = '2026-04-20';
	d.injuryHistory.timeOfInjury = '14:00';
	d.injuryHistory.intent = 'unintentional';
	d.injuryHistory.prehospitalCareProvider = 'none';
	d.injuryHistory.mechFallFrom = 'standing height';

	d.pastHistories.pmhNone = true;
	d.pastHistories.medicationsNone = true;

	d.assessmentAndPlan.narrative =
		'Right ankle sprain, no neurovascular compromise. Discharge with NSAID and crutches.';

	d.disposition.edDepartureDate = '2026-04-20';
	d.disposition.edDepartureTime = '16:00';
	d.disposition.diagnosesImpressions = 'Right ankle sprain.';
	d.disposition.disposition = 'discharge';
	d.disposition.dischargePlanDiscussed = 'yes';
	d.disposition.emergencyUnitProvider = 'Dr. Smith, MD';
	d.disposition.signature = 'A. Smith';
	d.disposition.signatureDate = '2026-04-20';
	return d;
}

/**
 * A complete YELLOW encounter: moderate head injury after a fall, brief loss of
 * consciousness, admitted for observation. Generates moderate-priority flags.
 */
function yellowComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientRegistration.surname = 'OKONKWO';
	d.patientRegistration.firstName = 'Emeka';
	d.patientRegistration.sex = 'male';
	d.patientRegistration.dateOfBirth = '1971-02-09';
	d.patientRegistration.age = 55;
	d.patientRegistration.dateOfArrival = '2026-04-21';
	d.patientRegistration.timeOfArrival = '09:10';
	d.patientRegistration.arrivalMode = 'ambulance';
	d.patientRegistration.injuryLocation = 'Construction site';

	d.chiefComplaintAndVitals.chiefComplaint = 'Fall from ladder, head strike, brief LOC.';
	d.chiefComplaintAndVitals.allergies = 'Penicillin';
	d.chiefComplaintAndVitals.initialVitals.time = '09:15';
	d.chiefComplaintAndVitals.initialVitals.pulse = 92;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 18;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 96;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 142;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 88;
	d.chiefComplaintAndVitals.initialVitals.tempC = 36.9;

	d.triage.category = 'yellow';
	d.triage.triagedFor = 'Head injury with LOC';

	d.airway.normal = true;
	d.breathing.normal = true;
	d.circulation.normal = true;
	d.disability.avpu = 'A';
	d.disability.gcsTotal = 14;
	d.disability.gcsEye = 3;
	d.disability.gcsVerbal = 5;
	d.disability.gcsMotor = 6;

	d.injuryHistory.dateOfInjury = '2026-04-21';
	d.injuryHistory.timeOfInjury = '08:40';
	d.injuryHistory.intent = 'unintentional';
	d.injuryHistory.prehospitalCareProvider = 'healthcare-professional';
	d.injuryHistory.mechFallFrom = 'approx 3 metres';
	d.injuryHistory.headTrauma = true;
	d.injuryHistory.lossOfConsciousnessDuration = '5-29min';

	d.pastHistories.pmhHtn = true;
	d.pastHistories.medications = 'Amlodipine 5 mg daily';

	d.assessmentAndPlan.narrative =
		'Moderate head injury, GCS 14. Head CT ordered, admit for neuro observation.';
	d.diagnostics.imgHeadCt = { ordered: true, result: 'Small subdural, no shift.' };

	d.disposition.edDepartureDate = '2026-04-21';
	d.disposition.edDepartureTime = '12:30';
	d.disposition.diagnosesImpressions = 'Traumatic brain injury, small subdural haematoma.';
	d.disposition.disposition = 'admit';
	d.disposition.admitWard = 'ward';
	d.disposition.emergencyUnitProvider = 'Dr. Mbeki, MD';
	d.disposition.signature = 'L. Mbeki';
	d.disposition.signatureDate = '2026-04-21';
	return d;
}

/**
 * A complete RED polytrauma after a high-speed road traffic crash: hypotension,
 * positive FAST, managed airway and circulation, transferred to theatre. Many
 * urgent flags.
 */
function redComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientRegistration.surname = 'GARCIA';
	d.patientRegistration.firstName = 'Luis';
	d.patientRegistration.sex = 'male';
	d.patientRegistration.dateOfBirth = '1994-11-30';
	d.patientRegistration.age = 31;
	d.patientRegistration.dateOfArrival = '2026-04-22';
	d.patientRegistration.timeOfArrival = '21:05';
	d.patientRegistration.arrivalMode = 'ambulance';
	d.patientRegistration.injuryLocation = 'Highway junction';

	d.chiefComplaintAndVitals.chiefComplaint = 'High-speed car crash, multiple injuries.';
	d.chiefComplaintAndVitals.allergiesUnknown = true;
	d.chiefComplaintAndVitals.initialVitals.time = '21:08';
	d.chiefComplaintAndVitals.initialVitals.pulse = 138;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 28;
	d.chiefComplaintAndVitals.initialVitals.spo2 = 89;
	d.chiefComplaintAndVitals.initialVitals.spo2OnOxygen = 'NRB 15L';
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 84;
	d.chiefComplaintAndVitals.initialVitals.bpDiastolic = 52;
	d.chiefComplaintAndVitals.initialVitals.tempC = 35.4;

	d.highRiskSigns.redHeavyBleeding = true;
	d.highRiskSigns.redPoorPerfusion = true;
	d.highRiskSigns.traumaPolytrauma = true;
	d.highRiskSigns.rtHighSpeedCrash = true;

	d.triage.category = 'red';
	d.triage.triagedFor = 'Polytrauma, shock';

	d.airway.normal = false;
	d.airway.interventionEtt = true;
	d.airway.spineStabilized = 'before-arrival';
	d.breathing.normal = false;
	d.breathing.oxygenNonRebreather = true;
	d.breathing.cyanosis = true;
	d.circulation.normal = false;
	d.circulation.bleedingControlDirectPressure = true;
	d.circulation.accessIvLocation = 'R antecubital';
	d.circulation.accessIvSize = '16G';
	d.circulation.ivfMls = 1000;
	d.circulation.ivfLr = true;
	d.circulation.bloodOrdered = true;
	d.circulation.bloodGiven = true;
	d.circulation.unstablePelvis = 'yes';

	d.disability.avpu = 'P';
	d.disability.gcsTotal = 7;
	d.disability.bloodGlucose = 110;

	d.exposureAndFast.exposedCompletely = true;
	d.exposureAndFast.fastPeritoneum = 'free-fluid';

	d.injuryHistory.dateOfInjury = '2026-04-22';
	d.injuryHistory.timeOfInjury = '20:45';
	d.injuryHistory.intent = 'unintentional';
	d.injuryHistory.prehospitalCareProvider = 'healthcare-professional';
	d.injuryHistory.mechRoadTrafficIncident = true;
	d.injuryHistory.mechRoadRole = 'driver';
	d.injuryHistory.lossOfConsciousnessDuration = '30min-24hr';

	d.pastHistories.pmhUnknown = true;
	d.pastHistories.medicationsUnknown = true;

	d.assessmentAndPlan.narrative =
		'Polytrauma with haemorrhagic shock and positive FAST. Activate massive transfusion, to theatre.';
	d.diagnostics.imgChestAbdomenCt = { ordered: true, result: 'Splenic laceration, free fluid.' };

	d.disposition.edDepartureDate = '2026-04-22';
	d.disposition.edDepartureTime = '21:55';
	d.disposition.diagnosesImpressions = 'Haemorrhagic shock, splenic injury, TBI.';
	d.disposition.disposition = 'admit';
	d.disposition.admitWard = 'ot';
	d.disposition.emergencyUnitProvider = 'Dr. Rossi, MD';
	d.disposition.signature = 'M. Rossi';
	d.disposition.signatureDate = '2026-04-22';
	return d;
}

/**
 * A critical, INCOMPLETE RED encounter: unresponsive penetrating-trauma patient
 * with no airway intervention recorded and many mandatory fields left blank —
 * multiple urgent flags and an incomplete record.
 */
function redIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientRegistration.surname = 'WILLIAMS';
	d.patientRegistration.firstName = 'David';
	d.patientRegistration.sex = 'male';
	d.patientRegistration.dateOfBirth = '1968-05-09';
	d.patientRegistration.age = 58;
	d.patientRegistration.dateOfArrival = '2026-04-19';
	d.patientRegistration.timeOfArrival = '02:40';
	d.patientRegistration.arrivalMode = 'ambulance';

	d.chiefComplaintAndVitals.chiefComplaint = 'Stab wound to chest, unresponsive.';
	d.chiefComplaintAndVitals.initialVitals.spo2 = 86;
	d.chiefComplaintAndVitals.initialVitals.bpSystolic = 78;
	d.chiefComplaintAndVitals.initialVitals.respiratoryRate = 6;

	d.highRiskSigns.redUnresponsive = true;
	d.highRiskSigns.redHeavyBleeding = true;
	d.highRiskSigns.traumaAllPenetrating = true;

	d.triage.category = 'red';

	// Airway abnormal, no intervention; breathing abnormal, no intervention.
	d.airway.normal = false;
	d.breathing.normal = false;
	d.circulation.normal = false;
	d.disability.avpu = 'U';
	d.disability.gcsTotal = 3;

	d.exposureAndFast.fastChest = 'pericardial-effusion';
	// Injury history, past histories, assessment & plan, disposition left blank.
	return d;
}

/** The sample encounters, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EUT-2026-0001', patientName: 'Doe, Jane', recordedDate: '2026-04-20', data: greenComplete() },
	{ id: 'EUT-2026-0002', patientName: 'Okonkwo, Emeka', recordedDate: '2026-04-21', data: yellowComplete() },
	{ id: 'EUT-2026-0003', patientName: 'Garcia, Luis', recordedDate: '2026-04-22', data: redComplete() },
	{ id: 'EUT-2026-0004', patientName: 'Williams, David', recordedDate: '2026-04-19', data: redIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeEuTrauma(s.data);
	return {
		id: s.id,
		patientName: s.patientName || nameOf(s.data),
		recordedDate: s.recordedDate,
		triage: g.triage,
		disposition: s.data.disposition.disposition,
		complete: g.complete,
		urgentFlags: g.urgentCount,
		totalFlags: g.flags.length,
		topPriority: g.topPriority,
		recordedBy: s.data.disposition.emergencyUnitProvider
	};
});
