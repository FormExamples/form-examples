import type { AssessmentData, RiskBand } from '$lib/engine/types';
import { gradeNews2 } from '$lib/engine/news2-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	observedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	wardOrLocation: string;
	observedDate: string;
	aggregate: number;
	riskBand: RiskBand;
	redScore: boolean;
	monitoringFrequency: string;
	flagCount: number;
}

/** Aggregate 0 — fully-normal observation set (low, 12-hourly). */
function normal(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observationAt: '2026-06-10T08:15',
		wardOrLocation: 'Acute Medical Unit, Bay 3',
		spo2Scale: 'scale-1',
		spo2Scale2Endorsed: ''
	};
	d.identification.patientName = 'Osei, Grace';
	d.identification.nhsNumber = '485 777 3456';
	d.respiration.respiratoryRate = 16;
	d.oxygenSaturation.spo2 = 98;
	d.oxygenSupport.onOxygen = 'air';
	d.bloodPressure.systolicBloodPressure = 124;
	d.pulse.pulse = 74;
	d.consciousness.consciousnessAcvpu = 'A';
	d.temperature.temperature = 36.8;
	d.note.clinicalNotes = 'Stable; routine 12-hourly monitoring.';
	return d;
}

/** Aggregate 3 with a single red score — low-medium band, 1-hourly review. */
function lowMedium(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		observationAt: '2026-06-12T14:40',
		wardOrLocation: 'Respiratory ward, Bed 12',
		spo2Scale: 'scale-1',
		spo2Scale2Endorsed: ''
	};
	d.identification.patientName = 'Novak, Peter';
	d.identification.nhsNumber = '612 004 8821';
	d.respiration.respiratoryRate = 25; // scores 3 (red score)
	d.oxygenSaturation.spo2 = 96;
	d.oxygenSupport.onOxygen = 'air';
	d.bloodPressure.systolicBloodPressure = 118;
	d.pulse.pulse = 88;
	d.consciousness.consciousnessAcvpu = 'A';
	d.temperature.temperature = 37.4;
	d.note.clinicalNotes = 'Tachypnoeic; single red score — urgent ward review requested.';
	return d;
}

/** Aggregate 5-6 — medium band, on oxygen, 1-hourly. */
function medium(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		observationAt: '2026-06-15T22:05',
		wardOrLocation: 'Emergency department, Majors',
		spo2Scale: 'scale-1',
		spo2Scale2Endorsed: ''
	};
	d.identification.patientName = 'Ferreira, Ana';
	d.identification.nhsNumber = '703 551 9002';
	d.respiration.respiratoryRate = 22; // 2
	d.oxygenSaturation.spo2 = 95; // 1 (Scale 1)
	d.oxygenSupport.onOxygen = 'oxygen'; // +2
	d.oxygenSupport.oxygenDevice = 'nasal-cannula';
	d.oxygenSupport.oxygenFlowRateLMin = 2;
	d.bloodPressure.systolicBloodPressure = 116;
	d.pulse.pulse = 96; // 1
	d.consciousness.consciousnessAcvpu = 'A';
	d.temperature.temperature = 37.9;
	d.note.clinicalNotes = 'On 2 L/min via nasal cannula; urgent review by acute-illness team.';
	return d;
}

/** Aggregate >= 7 — high band, continuous monitoring, critical-care review. */
function high(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Paramedic S. Doyle',
		clinicianRole: 'paramedic',
		observationAt: '2026-06-18T03:20',
		wardOrLocation: 'Pre-hospital / ambulance',
		spo2Scale: 'scale-1',
		spo2Scale2Endorsed: ''
	};
	d.identification.patientName = 'Okonkwo, Daniel';
	d.identification.nhsNumber = '904 220 1187';
	d.respiration.respiratoryRate = 28; // 3
	d.oxygenSaturation.spo2 = 90; // 3 (Scale 1)
	d.oxygenSupport.onOxygen = 'oxygen'; // +2
	d.oxygenSupport.oxygenDevice = 'non-rebreather-mask';
	d.oxygenSupport.oxygenFlowRateLMin = 15;
	d.bloodPressure.systolicBloodPressure = 88; // 3
	d.pulse.pulse = 122; // 2
	d.consciousness.consciousnessAcvpu = 'V'; // 3
	d.temperature.temperature = 38.6; // 1
	d.note.clinicalNotes = 'Pre-alert called; continuous monitoring, escalated on arrival.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'NEWS2-2026-0001', patientName: 'Osei, Grace', observedDate: '2026-06-10', data: normal() },
	{ id: 'NEWS2-2026-0002', patientName: 'Novak, Peter', observedDate: '2026-06-12', data: lowMedium() },
	{ id: 'NEWS2-2026-0003', patientName: 'Ferreira, Ana', observedDate: '2026-06-15', data: medium() },
	{ id: 'NEWS2-2026-0004', patientName: 'Okonkwo, Daniel', observedDate: '2026-06-18', data: high() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeNews2(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		wardOrLocation: s.data.context.wardOrLocation,
		observedDate: s.observedDate,
		aggregate: g.aggregate,
		riskBand: g.riskBand,
		redScore: g.redScore,
		monitoringFrequency: g.monitoringFrequency,
		flagCount: g.flaggedIssues.length
	};
});
