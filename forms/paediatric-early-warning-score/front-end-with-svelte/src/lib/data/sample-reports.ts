import type { AssessmentData, AgeBand, EscalationBand } from '#lib/engine/types.js';
import { gradePews } from '#lib/engine/pews-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientIdentifier: string;
	observedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	ageBand: AgeBand;
	careSetting: string;
	observedDate: string;
	aggregateScore: number;
	escalationBand: EscalationBand;
	singleParameterTrigger: boolean;
	monitoringFrequency: string;
	flagCount: number;
}

/** Aggregate 0 — fully-normal neonate observation set (routine, 4-hourly). */
function routineNeonate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observationAt: '2026-06-10T08:15',
		careSetting: 'ward'
	};
	d.identification.patientIdentifier = 'PEWS-2026-0001';
	d.identification.ageBand = 'neonate'; // RR normal 40-60 | HR normal 110-160
	d.identification.sex = 'female';
	d.respiratory.respiratoryRate = 48; // 0
	d.respiratory.respiratoryEffort = 'none'; // 0
	d.respiratory.oxygenSaturation = 98; // 0
	d.respiratory.supplementalOxygen = 'room-air'; // 0
	d.cardiovascular.heartRate = 140; // 0
	d.cardiovascular.capillaryRefill = 'under-2s'; // 0
	d.behaviour.consciousness = 'alert'; // 0
	d.concern.nurseConcern = 'no';
	d.concern.parentConcern = 'no';
	d.note.clinicalNotes = 'Feeding well; routine 4-hourly observations.';
	return d;
}

/** Aggregate 2 — infant, low escalation (deteriorating trend, hourly). */
function lowInfant(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'HCA D. Price',
		clinicianRole: 'healthcare-assistant',
		observationAt: '2026-06-12T13:20',
		careSetting: 'childrens-assessment-unit'
	};
	d.identification.patientIdentifier = 'PEWS-2026-0002';
	d.identification.ageBand = 'infant'; // RR normal 30-50 | HR normal 100-160
	d.identification.sex = 'male';
	d.respiratory.respiratoryRate = 55; // 1 (51-60)
	d.respiratory.respiratoryEffort = 'mild'; // 1
	d.respiratory.oxygenSaturation = 97; // 0
	d.respiratory.supplementalOxygen = 'room-air'; // 0
	d.cardiovascular.heartRate = 130; // 0
	d.cardiovascular.capillaryRefill = 'under-2s'; // 0
	d.behaviour.consciousness = 'alert'; // 0
	d.concern.nurseConcern = 'no';
	d.concern.parentConcern = 'no';
	d.note.clinicalNotes = 'Mildly tachypnoeic with mild recession; increase to hourly and re-score.';
	return d;
}

/** Aggregate 5 — young child, medium escalation (urgent review). */
function mediumYoungChild(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		observationAt: '2026-06-15T21:40',
		careSetting: 'emergency-department'
	};
	d.identification.patientIdentifier = 'PEWS-2026-0003';
	d.identification.ageBand = 'young-child'; // RR normal 20-40 | HR normal 90-140
	d.identification.sex = 'female';
	d.respiratory.respiratoryRate = 45; // 1 (41-50)
	d.respiratory.respiratoryEffort = 'moderate'; // 2
	d.respiratory.oxygenSaturation = 94; // 1
	d.respiratory.supplementalOxygen = 'room-air'; // 0
	d.cardiovascular.heartRate = 135; // 0
	d.cardiovascular.capillaryRefill = '2-3s'; // 1
	d.behaviour.consciousness = 'alert'; // 0
	d.concern.nurseConcern = 'no';
	d.concern.parentConcern = 'no';
	d.note.clinicalNotes = 'Moderate recession, borderline saturations; urgent review by acute team.';
	return d;
}

/** Aggregate >= 6 — adolescent, high escalation + single-parameter 3 + concern. */
function highAdolescent(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		observationAt: '2026-06-18T03:10',
		careSetting: 'ward'
	};
	d.identification.patientIdentifier = 'PEWS-2026-0004';
	d.identification.ageBand = 'adolescent'; // RR normal 12-20 | HR normal 60-100
	d.identification.sex = 'male';
	d.respiratory.respiratoryRate = 30; // 3 (>= 30)
	d.respiratory.respiratoryEffort = 'severe'; // 3
	d.respiratory.oxygenSaturation = 90; // 3
	d.respiratory.supplementalOxygen = 'high-flow'; // 3
	d.cardiovascular.heartRate = 135; // 2 (121-140)
	d.cardiovascular.capillaryRefill = 'over-4s'; // 3
	d.behaviour.consciousness = 'pain'; // 2
	d.concern.nurseConcern = 'yes';
	d.concern.parentConcern = 'yes';
	d.note.clinicalNotes =
		'Peri-arrest picture; critical-care outreach called and continuous monitoring in place.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'PEWS-2026-0001',
		patientIdentifier: 'PEWS-2026-0001',
		observedDate: '2026-06-10',
		data: routineNeonate()
	},
	{
		id: 'PEWS-2026-0002',
		patientIdentifier: 'PEWS-2026-0002',
		observedDate: '2026-06-12',
		data: lowInfant()
	},
	{
		id: 'PEWS-2026-0003',
		patientIdentifier: 'PEWS-2026-0003',
		observedDate: '2026-06-15',
		data: mediumYoungChild()
	},
	{
		id: 'PEWS-2026-0004',
		patientIdentifier: 'PEWS-2026-0004',
		observedDate: '2026-06-18',
		data: highAdolescent()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradePews(s.data);
	return {
		id: s.id,
		patientIdentifier: s.patientIdentifier,
		ageBand: s.data.identification.ageBand,
		careSetting: s.data.context.careSetting,
		observedDate: s.observedDate,
		aggregateScore: g.aggregateScore,
		escalationBand: g.escalationBand,
		singleParameterTrigger: g.singleParameterTrigger,
		monitoringFrequency: g.monitoringFrequency,
		flagCount: g.flaggedIssues.length
	};
});
