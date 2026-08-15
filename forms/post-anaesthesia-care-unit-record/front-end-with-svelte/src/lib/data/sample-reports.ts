import type { AssessmentData, AnaestheticTechnique, ReadinessBand } from '#lib/engine/types.js';
import { calculatePacuGrade } from '#lib/engine/pacu-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	admittedDate: string;
	data: AssessmentData;
}

/** A row in the recovery-team dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	admittedDate: string;
	anaestheticTechnique: AnaestheticTechnique;
	aldreteTotal: number;
	readinessBand: ReadinessBand;
	notReadyFlag: boolean;
	flagCount: number;
}

/** 10/10, room-air SpO2 — discharge-ready. */
function ready10(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Sister J. Okafor',
		nurseRole: 'recovery-nurse',
		anaesthetistName: 'Dr A. Khan',
		admittedAt: '2026-06-24T10:15',
		anaestheticTechnique: 'general',
		procedure: 'Laparoscopic cholecystectomy'
	};
	d.identification = {
		patientIdentifier: 'PACU-100482',
		ageBand: '40-59',
		sex: 'female',
		asaStatus: 'II',
		baselineSystolicBp: 128,
		ambulatoryCase: 'no'
	};
	d.activity.activity = 'all-four';
	d.respiration.respiration = 'deep-cough';
	d.circulation.circulation = 'within-20';
	d.consciousness.consciousness = 'awake';
	d.oxygenSaturation.oxygenSaturation = 'room-air';
	d.observations.airwayStatus = 'patent';
	d.observations.painScore = 1;
	d.observations.ponvSeverity = 'none';
	d.note.recoveryNote = 'Uneventful emergence; meets discharge criteria.';
	return d;
}

/** 9/10, SpO2 met, ambulatory + street-fit PADSS — discharge-ready. */
function ready9Ambulatory(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'ODP M. Lewis',
		nurseRole: 'odp',
		anaesthetistName: 'Dr S. Patel',
		admittedAt: '2026-06-25T14:05',
		anaestheticTechnique: 'regional',
		procedure: 'Knee arthroscopy (day case)'
	};
	d.identification = {
		patientIdentifier: 'PACU-573110',
		ageBand: '16-39',
		sex: 'male',
		asaStatus: 'I',
		baselineSystolicBp: 122,
		ambulatoryCase: 'yes'
	};
	d.activity.activity = 'two'; // 1 → total 9
	d.respiration.respiration = 'deep-cough';
	d.circulation.circulation = 'within-20';
	d.consciousness.consciousness = 'awake';
	d.oxygenSaturation.oxygenSaturation = 'room-air';
	d.observations.airwayStatus = 'patent';
	d.observations.painScore = 2;
	d.observations.ponvSeverity = 'mild';
	d.padss = {
		padssVitalSigns: 'within-20',
		padssAmbulation: 'steady',
		padssNauseaVomiting: 'minimal',
		padssPain: 'minimal',
		padssSurgicalBleeding: 'moderate' // 1 → PADSS 9, street-fit
	};
	d.note.recoveryNote = 'Day-case recovery; PADSS street-fit for discharge home.';
	return d;
}

/** 9/10 but SpO2 parameter below 2 — gated not-ready (hypoxia). */
function gatedNotReady(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Nurse P. Reyes',
		nurseRole: 'recovery-nurse',
		anaesthetistName: 'Dr L. Osei',
		admittedAt: '2026-06-26T09:40',
		anaestheticTechnique: 'general',
		procedure: 'Open hemicolectomy'
	};
	d.identification = {
		patientIdentifier: 'PACU-100517',
		ageBand: '75-plus',
		sex: 'female',
		asaStatus: 'III',
		baselineSystolicBp: 140,
		ambulatoryCase: 'no'
	};
	d.activity.activity = 'all-four';
	d.respiration.respiration = 'deep-cough';
	d.circulation.circulation = 'within-20';
	d.consciousness.consciousness = 'awake';
	d.oxygenSaturation.oxygenSaturation = 'needs-o2'; // 1 → total 9, gated
	d.observations.airwayStatus = 'oral-airway';
	d.observations.painScore = 3;
	d.observations.ponvSeverity = 'mild';
	d.note.recoveryNote = 'Oxygen-dependent; SpO2 gate keeps patient in PACU.';
	return d;
}

/** 6/10, deeply unwell — not ready, multiple flags. */
function notReady6(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		nurseName: 'Sister K. Byrne',
		nurseRole: 'recovery-nurse',
		anaesthetistName: 'Dr R. Silva',
		admittedAt: '2026-06-26T16:20',
		anaestheticTechnique: 'sedation',
		procedure: 'ERCP under sedation'
	};
	d.identification = {
		patientIdentifier: 'PACU-880204',
		ageBand: '60-74',
		sex: 'male',
		asaStatus: 'IV',
		baselineSystolicBp: 150,
		ambulatoryCase: 'no'
	};
	d.activity.activity = 'two'; // 1
	d.respiration.respiration = 'limited'; // 1
	d.circulation.circulation = 'within-20'; // 2
	d.consciousness.consciousness = 'arousable'; // 1
	d.oxygenSaturation.oxygenSaturation = 'needs-o2'; // 1 → total 6
	d.observations.airwayStatus = 'oral-airway';
	d.observations.painScore = 6;
	d.observations.ponvSeverity = 'moderate';
	d.observations.antiemeticsGiven = 'Ondansetron 4 mg IV';
	d.note.recoveryNote = 'Slow emergence; escalated to anaesthetist for review.';
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PACU-2026-0001', patientName: 'Osei, Grace', admittedDate: '2026-06-24', data: ready10() },
	{
		id: 'PACU-2026-0002',
		patientName: 'Mackenzie, Ian',
		admittedDate: '2026-06-25',
		data: ready9Ambulatory()
	},
	{
		id: 'PACU-2026-0003',
		patientName: 'Nowak, Zofia',
		admittedDate: '2026-06-26',
		data: gatedNotReady()
	},
	{ id: 'PACU-2026-0004', patientName: 'Ahmed, Bilal', admittedDate: '2026-06-26', data: notReady6() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePacuGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		admittedDate: s.admittedDate,
		anaestheticTechnique: s.data.context.anaestheticTechnique,
		aldreteTotal: g.aldreteTotal,
		readinessBand: g.readinessBand,
		notReadyFlag: g.readinessBand === 'not-ready',
		flagCount: g.flaggedIssues.length
	};
});
