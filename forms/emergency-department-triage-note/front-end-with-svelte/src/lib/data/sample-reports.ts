import type { AssessmentData, PriorityColour, PriorityLevel } from '$lib/engine/types';
import { triage } from '$lib/engine/ed-triage-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientIdentifier: string;
	triagedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	careSetting: string;
	triagedDate: string;
	priorityLevel: PriorityLevel;
	priorityName: string;
	priorityColour: PriorityColour;
	news2Total: number;
	targetMinutes: number;
	flagCount: number;
}

/** Level 1 — Immediate. Life-threat discriminator (airway) + high NEWS2. */
function immediate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Nurse J. Okafor',
		triagedAt: '2026-06-18T03:20',
		careSetting: 'emergency-department'
	};
	d.arrival = { arrivalMode: 'ambulance', arrivedAt: '2026-06-18T03:12', referralSource: '999 / paramedic' };
	d.identification = { patientIdentifier: 'ED-2026-0001', ageBand: 'older-adult', sex: 'male' };
	d.complaint = {
		presentingComplaint: 'Collapsed at home, noisy breathing, reduced responsiveness.',
		briefHistory: 'COPD, heart failure. Found by family, ambulance pre-alert.',
		symptomOnset: '30 minutes ago'
	};
	d.vitals.respiratoryRate = 28; // 3
	d.vitals.spo2 = 88; // 3 + hypoxia
	d.vitals.onOxygen = 'oxygen'; // +2
	d.vitals.systolicBp = 92; // 2
	d.vitals.pulse = 128; // 2
	d.vitals.consciousnessAcvpu = 'V'; // 3
	d.vitals.temperature = 38.4; // 1
	d.pain.painScore = 5;
	d.discriminators.airwayThreat = 'yes';
	d.discriminators.breathingInadequate = 'yes';
	d.note.clinicalNotes = 'To resus; airway support and senior review on arrival.';
	return d;
}

/** Level 2 — Very urgent. Cardiac chest pain (time-critical). */
function veryUrgent(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Dr A. Khan',
		triagedAt: '2026-06-15T14:40',
		careSetting: 'emergency-department'
	};
	d.arrival = { arrivalMode: 'walk-in', arrivedAt: '2026-06-15T14:30', referralSource: 'Self-presented' };
	d.identification = { patientIdentifier: 'ED-2026-0002', ageBand: 'adult', sex: 'female' };
	d.complaint = {
		presentingComplaint: 'Central crushing chest pain radiating to the left arm.',
		briefHistory: 'Hypertension, smoker. Pain started at rest.',
		symptomOnset: '45 minutes ago'
	};
	d.vitals.respiratoryRate = 20; // 0
	d.vitals.spo2 = 96; // 0
	d.vitals.onOxygen = 'air'; // 0
	d.vitals.systolicBp = 148; // 0
	d.vitals.pulse = 96; // 1
	d.vitals.consciousnessAcvpu = 'A'; // 0
	d.vitals.temperature = 36.9; // 0
	d.pain.painScore = 8;
	d.discriminators.chestPainCardiac = 'yes';
	d.note.clinicalNotes = 'ECG within 10 minutes; ACS pathway; analgesia given.';
	return d;
}

/** Level 3 — Urgent. Moderate pain (4-6) with a supporting NEWS2 aggregate. */
function urgent(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Nurse P. Reyes',
		triagedAt: '2026-06-12T22:05',
		careSetting: 'urgent-treatment-centre'
	};
	d.arrival = { arrivalMode: 'walk-in', arrivedAt: '2026-06-12T21:50', referralSource: 'NHS 111' };
	d.identification = { patientIdentifier: 'ED-2026-0003', ageBand: 'adult', sex: 'male' };
	d.complaint = {
		presentingComplaint: 'Abdominal pain and vomiting for one day.',
		briefHistory: 'No significant past history.',
		symptomOnset: 'Yesterday, gradual'
	};
	d.vitals.respiratoryRate = 22; // 2
	d.vitals.spo2 = 96; // 0
	d.vitals.onOxygen = 'air'; // 0
	d.vitals.systolicBp = 118; // 0
	d.vitals.pulse = 104; // 1
	d.vitals.consciousnessAcvpu = 'A'; // 0
	d.vitals.temperature = 37.6; // 0
	d.pain.painScore = 5;
	d.note.clinicalNotes = 'Moderate pain; analgesia and observations, review within 60 minutes.';
	return d;
}

/** Level 5 — Non-urgent. Fully normal, minimal presentation (pain 0). */
function nonUrgent(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Nurse S. Doyle',
		triagedAt: '2026-06-10T11:15',
		careSetting: 'minor-injuries-unit'
	};
	d.arrival = { arrivalMode: 'walk-in', arrivedAt: '2026-06-10T11:05', referralSource: 'Self-presented' };
	d.identification = { patientIdentifier: 'ED-2026-0004', ageBand: 'adult', sex: 'female' };
	d.complaint = {
		presentingComplaint: 'Minor graze to the left knee after tripping.',
		briefHistory: 'Fit and well.',
		symptomOnset: '1 hour ago'
	};
	d.vitals.respiratoryRate = 14; // 0
	d.vitals.spo2 = 99; // 0
	d.vitals.onOxygen = 'air'; // 0
	d.vitals.systolicBp = 124; // 0
	d.vitals.pulse = 68; // 0
	d.vitals.consciousnessAcvpu = 'A'; // 0
	d.vitals.temperature = 36.7; // 0
	d.pain.painScore = 0;
	d.note.clinicalNotes = 'Clean and dress the wound; routine review.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ED-2026-0001', patientIdentifier: 'ED-2026-0001', triagedDate: '2026-06-18', data: immediate() },
	{ id: 'ED-2026-0002', patientIdentifier: 'ED-2026-0002', triagedDate: '2026-06-15', data: veryUrgent() },
	{ id: 'ED-2026-0003', patientIdentifier: 'ED-2026-0003', triagedDate: '2026-06-12', data: urgent() },
	{ id: 'ED-2026-0004', patientIdentifier: 'ED-2026-0004', triagedDate: '2026-06-10', data: nonUrgent() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const r = triage(s.data);
	return {
		id: s.id,
		patientIdentifier: s.patientIdentifier,
		careSetting: s.data.context.careSetting,
		triagedDate: s.triagedDate,
		priorityLevel: r.priorityLevel,
		priorityName: r.priorityName,
		priorityColour: r.priorityColour,
		news2Total: r.news2Total,
		targetMinutes: r.targetMinutes,
		flagCount: r.flaggedIssues.length
	};
});
