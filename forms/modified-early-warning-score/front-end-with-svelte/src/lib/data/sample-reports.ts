import type { AssessmentData, RiskBand } from '#lib/engine/types.js';
import { gradeMews } from '#lib/engine/mews-grader.js';
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
	wardLocation: string;
	observedDate: string;
	mewsScore: number;
	riskBand: RiskBand;
	singleParameterTrigger: boolean;
	monitoringFrequency: string;
	flagCount: number;
}

/** MEWS 0 — fully-normal observation set (low, routine frequency). */
function normal(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observedAt: '2026-06-24T08:15',
		careSetting: 'acute-ward',
		wardLocation: 'Acute Medical Unit, Bay 3'
	};
	d.identification = { patientIdentifier: 'WD-100482', ageBand: '40-59', sex: 'female' };
	d.bloodPressure.systolicBloodPressure = 122; // 0
	d.heartRate.heartRate = 74; // 0
	d.respiratory.respiratoryRate = 14; // 0
	d.temperature.temperature = 36.8; // 0
	d.consciousness.avpu = 'alert'; // 0
	d.summary.previousMewsScore = 0;
	d.summary.clinicalNotes = 'Stable; routine ward monitoring.';
	return d;
}

/** MEWS 3 — medium band, no single-parameter trigger, deteriorating trend. */
function medium(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		observedAt: '2026-06-26T14:40',
		careSetting: 'assessment-unit',
		wardLocation: 'Assessment unit, Bed 7'
	};
	d.identification = { patientIdentifier: 'AS-100517', ageBand: '60-74', sex: 'female' };
	d.bloodPressure.systolicBloodPressure = 96; // 1
	d.heartRate.heartRate = 105; // 1
	d.respiratory.respiratoryRate = 16; // 1
	d.temperature.temperature = 37.0; // 0
	d.consciousness.avpu = 'alert'; // 0
	d.summary.previousMewsScore = 1; // rose to 3 — deteriorating-trend flag
	d.summary.clinicalNotes = 'Aggregate rose from 1 to 3; increase observation frequency.';
	return d;
}

/** MEWS 7 — high band WITH a single-parameter trigger (AVPU unresponsive = 3). */
function highTrigger(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'doctor',
		observedAt: '2026-06-26T03:20',
		careSetting: 'acute-ward',
		wardLocation: 'Acute ward, Bed 12'
	};
	d.identification = { patientIdentifier: 'WD-880204', ageBand: '75-plus', sex: 'male' };
	d.bloodPressure.systolicBloodPressure = 96; // 1
	d.heartRate.heartRate = 108; // 1
	d.respiratory.respiratoryRate = 22; // 2
	d.temperature.temperature = 37.5; // 0
	d.consciousness.avpu = 'unresponsive'; // 3 — single-parameter trigger
	d.summary.previousMewsScore = 4;
	d.summary.clinicalNotes = 'Unresponsive on AVPU; urgent medical review and critical-care outreach.';
	return d;
}

/** MEWS 8 — high band by aggregate alone (no single parameter reaches 3). */
function highAggregate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		observedAt: '2026-06-27T22:05',
		careSetting: 'admissions-unit',
		wardLocation: 'Admissions unit, Bay 1'
	};
	d.identification = { patientIdentifier: 'AU-573642', ageBand: '60-74', sex: 'female' };
	d.bloodPressure.systolicBloodPressure = 78; // 2
	d.heartRate.heartRate = 118; // 2
	d.respiratory.respiratoryRate = 22; // 2
	d.temperature.temperature = 38.6; // 2
	d.consciousness.avpu = 'alert'; // 0
	d.summary.previousMewsScore = 6;
	d.summary.clinicalNotes = 'High aggregate without a single red parameter; urgent medical review.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MEWS-2026-0001', patientIdentifier: 'WD-100482', observedDate: '2026-06-24', data: normal() },
	{ id: 'MEWS-2026-0002', patientIdentifier: 'AS-100517', observedDate: '2026-06-26', data: medium() },
	{
		id: 'MEWS-2026-0003',
		patientIdentifier: 'WD-880204',
		observedDate: '2026-06-26',
		data: highTrigger()
	},
	{
		id: 'MEWS-2026-0004',
		patientIdentifier: 'AU-573642',
		observedDate: '2026-06-27',
		data: highAggregate()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeMews(s.data);
	return {
		id: s.id,
		patientIdentifier: s.patientIdentifier,
		wardLocation: s.data.context.wardLocation,
		observedDate: s.observedDate,
		mewsScore: g.mewsScore,
		riskBand: g.riskBand,
		singleParameterTrigger: g.singleParameterTrigger,
		monitoringFrequency: g.monitoringFrequency,
		flagCount: g.flaggedIssues.length
	};
});
