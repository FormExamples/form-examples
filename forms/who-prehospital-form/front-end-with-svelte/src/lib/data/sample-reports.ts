import type { AssessmentData, FlagPriority, TriageCategory } from '$lib/engine/types';
import { gradePrehospital } from '$lib/engine/prehospital-grader';
import { gcsTotal } from '$lib/engine/utils';
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
	complete: boolean;
	urgentFlags: number;
	totalFlags: number;
	topPriority: FlagPriority | null;
	gcsTotal: number | null;
	injury: boolean;
	recordedBy: string;
}

/**
 * Fill the fields every run sheet requires regardless of clinical branch, so a
 * sample starts "complete" and individual builders only add abnormal findings.
 */
function baseComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.callerAndScene = {
		...d.callerAndScene,
		callerName: 'Dispatch',
		callerPhone: '112',
		dateOfBirthOrAge: '45',
		sex: 'female',
		date: '2026-04-14',
		sceneCallType: 'scene',
		sceneLocationType: 'residence',
		timeCallReceived: '08:40',
		timeArrivedAtScene: '08:52'
	};
	d.chiefComplaintAndVitals.chiefComplaint = 'Generalised weakness';
	d.chiefComplaintAndVitals.initialVitals = {
		...d.chiefComplaintAndVitals.initialVitals,
		time: '08:55',
		hr: 84,
		rr: 16,
		bp: '124/78',
		tempC: 37,
		spo2: 98
	};
	d.triage.category = 'green';
	d.airway.normal = true;
	d.breathing.normal = true;
	d.circulation.normal = true;
	d.disability.avpu = 'A';
	d.disability.gcsEye = 4;
	d.disability.gcsVerbal = 5;
	d.disability.gcsMotor = 6;
	d.sampleHistory = {
		...d.sampleHistory,
		allergies: 'None known',
		medications: 'None',
		pastMedical: 'Hypertension',
		events: 'Felt unwell at home this morning.'
	};
	d.assessmentAndPlan.summary = 'Stable patient, transported for review.';
	d.assessmentAndPlan.presumptiveDiagnoses = 'Non-specific weakness';
	d.disposition = {
		...d.disposition,
		disposition: 'Transported to District Hospital',
		handoverTime: '09:30',
		handoverToName: 'Triage Nurse',
		providerName: 'Medic Mensah',
		providerSignature: 'A. Mensah',
		providerSignatureDate: '2026-04-14'
	};
	return d;
}

/** GREEN, complete, no flags: a stable patient, transported for review. */
function greenBenign(): AssessmentData {
	const d = baseComplete();
	d.callerAndScene.patientName = 'Adams, Olivia';
	d.callerAndScene.dateOfBirthOrAge = '45';
	return d;
}

/** YELLOW, complete, medium flags: pregnant with severe pain. */
function yellowMedium(): AssessmentData {
	const d = baseComplete();
	d.callerAndScene.patientName = 'Diallo, Mariama';
	d.callerAndScene.sex = 'female';
	d.callerAndScene.dateOfBirthOrAge = '32';
	d.chiefComplaintAndVitals.chiefComplaint = 'Severe abdominal pain';
	d.chiefComplaintAndVitals.pregnant = 'yes';
	d.chiefComplaintAndVitals.painScore = 8;
	d.triage.category = 'yellow';
	d.assessmentAndPlan.summary = 'Pregnant patient with severe abdominal pain.';
	d.assessmentAndPlan.presumptiveDiagnoses = 'Abdominal pain in pregnancy';
	d.disposition.providerName = 'Medic Thompson';
	d.disposition.providerSignature = 'J. Thompson';
	return d;
}

/**
 * RED, complete, high/urgent flags: chest pain with low SpO2 corrected by
 * oxygen, tachycardia, IV access and GCS recorded. Airway kept normal.
 */
function redHigh(): AssessmentData {
	const d = baseComplete();
	d.callerAndScene.patientName = 'Bashir, Amir';
	d.callerAndScene.sex = 'male';
	d.callerAndScene.dateOfBirthOrAge = '68';
	d.chiefComplaintAndVitals.chiefComplaint = 'Crushing central chest pain';
	d.chiefComplaintAndVitals.painScore = 7;
	d.chiefComplaintAndVitals.initialVitals = {
		...d.chiefComplaintAndVitals.initialVitals,
		hr: 158,
		rr: 24,
		bp: '148/92',
		spo2: 88,
		spo2OnOxygen: 'room air'
	};
	d.highRiskSigns.adultSevereChestOrAbdominalPainOrEcgIschaemia = true;
	d.triage.category = 'red';
	d.breathing.normal = false;
	d.breathing.oxygenLitres = 10;
	d.breathing.oxygenNonRebreather = true;
	d.circulation.normal = false;
	d.circulation.skinPale = true;
	d.circulation.accessIvSite = 'Right antecubital';
	d.circulation.accessIvSize = '18G';
	d.circulation.ivfNs = true;
	d.disability.avpu = 'A';
	d.disability.gcsEye = 4;
	d.disability.gcsVerbal = 5;
	d.disability.gcsMotor = 6;
	d.additionalInterventions.medsAspirin = true;
	d.additionalInterventions.procEcg = true;
	d.assessmentAndPlan.summary = 'Suspected acute coronary syndrome.';
	d.assessmentAndPlan.presumptiveDiagnoses = 'STEMI';
	d.disposition.disposition = 'Blue-light transfer to cardiac centre';
	d.disposition.providerName = 'Medic Okafor';
	d.disposition.providerSignature = 'C. Okafor';
	return d;
}

/**
 * RED, incomplete, multiple urgent flags: unresponsive patient with heavy
 * bleeding and no bleeding control, several mandatory fields left blank.
 */
function redCriticalIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.callerAndScene = {
		...d.callerAndScene,
		patientName: 'Goldberg, Daniel',
		sex: 'male',
		dateOfBirthOrAge: '60',
		date: '2026-04-18',
		sceneCallType: 'scene',
		sceneLocationType: 'street',
		timeCallReceived: '07:30',
		timeArrivedAtScene: '07:41'
	};
	d.chiefComplaintAndVitals.chiefComplaint = 'Fall from height, unconscious';
	d.chiefComplaintAndVitals.injury = true;
	d.chiefComplaintAndVitals.initialVitals = {
		...d.chiefComplaintAndVitals.initialVitals,
		time: '07:45',
		hr: 130,
		rr: 6,
		bp: '82/50',
		spo2: 85
	};
	d.highRiskSigns.unresponsive = true;
	d.highRiskSigns.heavyBleeding = true;
	d.highRiskSigns.highRiskTrauma = true;
	d.triage.category = 'red';
	// airway abnormal but no intervention → urgent flag + A-02 incomplete
	d.airway.normal = false;
	d.airway.obstructedByBlood = true;
	d.circulation.normal = false;
	d.circulation.activeBleedingSite = 'Left thigh, heavy';
	// no bleeding control recorded → C-02 incomplete + urgent flag
	d.disability.avpu = 'U';
	// GCS components blank → D-02 incomplete; IV access blank → C-03 incomplete
	// injury intent / mechanism blank → INJ incomplete
	d.disposition.disposition = 'In progress';
	d.disposition.providerName = 'Medic Taylor';
	return d;
}

/** The sample encounters, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PH-2026-0001', patientName: 'Adams, Olivia', recordedDate: '2026-04-14', data: greenBenign() },
	{ id: 'PH-2026-0002', patientName: 'Diallo, Mariama', recordedDate: '2026-04-15', data: yellowMedium() },
	{ id: 'PH-2026-0003', patientName: 'Bashir, Amir', recordedDate: '2026-04-13', data: redHigh() },
	{ id: 'PH-2026-0004', patientName: 'Goldberg, Daniel', recordedDate: '2026-04-18', data: redCriticalIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradePrehospital(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		recordedDate: s.recordedDate,
		triageCategory: g.triageCategory,
		complete: g.complete,
		urgentFlags: g.urgentCount,
		totalFlags: g.flags.length,
		topPriority: g.topPriority,
		gcsTotal: gcsTotal(s.data),
		injury: s.data.chiefComplaintAndVitals.injury,
		recordedBy: s.data.disposition.providerName
	};
});
