import type { AssessmentData, CareSetting, RiskBand } from '$lib/engine/types';
import { calculateGbsGrade } from '$lib/engine/gbs-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	gbsScore: number;
	riskBand: RiskBand;
	highFlag: boolean;
	flagCount: number;
}

/** Very low risk — total 0, candidate for outpatient management. */
function veryLowCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'emergency-department',
		presentingComplaint: 'coffee-ground'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageBand: '40-59', sex: 'female' };
	d.labs.bloodUrea = 5.2; // 0
	d.labs.haemoglobin = 138; // female >= 120 → 0
	d.haemodynamics.systolicBloodPressure = 128; // 0
	d.haemodynamics.pulse = 72; // 0
	d.clinicalMarkers.melaenaPresent = 'no';
	d.clinicalMarkers.syncope = 'no';
	d.clinicalMarkers.hepaticDisease = 'no';
	d.clinicalMarkers.cardiacFailure = 'no';
	d.note.clinicalNote = 'Single episode of coffee-ground vomiting; haemodynamically stable.';
	return d;
}

/** Low-moderate risk — total 3, admit for observation and inpatient endoscopy. */
function lowModerateCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'advanced-practitioner',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'acute-medical-unit',
		presentingComplaint: 'melaena'
	};
	d.identification = { patientIdentifier: 'AMU-573110', ageBand: '60-74', sex: 'male' };
	d.labs.bloodUrea = 8.4; // 3
	d.labs.haemoglobin = 135; // male >= 130 → 0
	d.haemodynamics.systolicBloodPressure = 118; // 0
	d.haemodynamics.pulse = 88; // 0
	d.clinicalMarkers.melaenaPresent = 'no';
	d.clinicalMarkers.syncope = 'no';
	d.clinicalMarkers.hepaticDisease = 'no';
	d.clinicalMarkers.cardiacFailure = 'no';
	d.note.clinicalNote = 'Reported melaena resolved; mild urea rise. Admit for observation.';
	return d;
}

/** High risk — total 15, urgent endoscopy and resuscitation. */
function highRiskCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'emergency-department',
		presentingComplaint: 'haematemesis'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '60-74', sex: 'female' };
	d.labs.bloodUrea = 12.0; // 4
	d.labs.haemoglobin = 92; // < 100 → 6
	d.haemodynamics.systolicBloodPressure = 96; // 2
	d.haemodynamics.pulse = 108; // 1
	d.clinicalMarkers.melaenaPresent = 'yes'; // 1
	d.clinicalMarkers.syncope = 'no';
	d.clinicalMarkers.hepaticDisease = 'no';
	d.clinicalMarkers.cardiacFailure = 'yes'; // 2  → total 16
	d.note.clinicalNote =
		'Fresh haematemesis with tachycardia and anaemia; resuscitation started, GI-bleed team alerted.';
	return d;
}

/** Incomplete — partial assessment, score provisional. */
function incompleteCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'ward',
		presentingComplaint: 'melaena'
	};
	d.identification = { patientIdentifier: 'WRD-100628', ageBand: '75-plus', sex: 'male' };
	d.labs.bloodUrea = 9.0; // 3
	d.haemodynamics.pulse = 84; // 0
	// haemoglobin, systolic BP, and the clinical markers left unanswered
	d.clinicalMarkers.melaenaPresent = 'yes'; // 1
	d.note.clinicalNote = 'Awaiting bloods and full observations before scoring.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GBS-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: veryLowCase() },
	{
		id: 'GBS-2026-0002',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-25',
		data: lowModerateCase()
	},
	{ id: 'GBS-2026-0003', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-26', data: highRiskCase() },
	{
		id: 'GBS-2026-0004',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-26',
		data: incompleteCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGbsGrade(s.data);
	const highFlag = g.flaggedIssues.some((f) => f.priority === 'high');
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		gbsScore: g.gbsScore,
		riskBand: g.riskBand,
		highFlag,
		flagCount: g.flaggedIssues.length
	};
});
