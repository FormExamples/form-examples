import type { AssessmentData, Band, CareSetting } from '$lib/engine/types';
import { calculateRosierGrade } from '$lib/engine/rosier-grader';
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
	rosierScore: number;
	band: Band;
	activateFlag: boolean;
	flagCount: number;
}

/** Positive screen — three focal signs, no mimic, score +3 (stroke likely). */
function strokeLikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department',
		symptomOnsetAt: '2026-06-15T21:20'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '75-plus', sex: 'female' };
	d.precondition = { bloodGlucose: 6.1, hypoglycaemiaCorrected: 'na' };
	d.mimics = { lossOfConsciousness: 'no', seizureActivity: 'no' };
	d.signs = {
		facialWeakness: 'yes',
		armWeakness: 'yes',
		legWeakness: 'no',
		speechDisturbance: 'yes',
		visualFieldDefect: 'no'
	};
	d.note.clinicalNote = 'Positive screen; stroke team activated, CT within 15 minutes.';
	return d;
}

/** Negative screen — all criteria negative, score 0 (stroke unlikely). */
function strokeUnlikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'emergency-department',
		symptomOnsetAt: '2026-06-12T13:55'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageBand: '40-59', sex: 'male' };
	d.precondition = { bloodGlucose: 5.2, hypoglycaemiaCorrected: 'na' };
	d.mimics = { lossOfConsciousness: 'no', seizureActivity: 'no' };
	d.signs = {
		facialWeakness: 'no',
		armWeakness: 'no',
		legWeakness: 'no',
		speechDisturbance: 'no',
		visualFieldDefect: 'no'
	};
	d.note.clinicalNote = 'No focal deficit; alternative diagnosis pursued.';
	return d;
}

/** Hypoglycaemia mimic — low glucose with focal signs; score positive but flagged. */
function hypoglycaemia(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Paramedic S. Doyle',
		clinicianRole: 'paramedic',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'acute-medical',
		symptomOnsetAt: '2026-06-18T02:50'
	};
	d.identification = { patientIdentifier: 'AMB-77-2211', ageBand: '60-74', sex: 'male' };
	d.precondition = { bloodGlucose: 2.8, hypoglycaemiaCorrected: 'no' };
	d.mimics = { lossOfConsciousness: 'no', seizureActivity: 'no' };
	d.signs = {
		facialWeakness: 'yes',
		armWeakness: 'yes',
		legWeakness: 'no',
		speechDisturbance: 'no',
		visualFieldDefect: 'no'
	};
	d.note.clinicalNote = 'Blood glucose 2.8 mmol/L — treated with glucose; reassess before scoring.';
	return d;
}

/** Mimic-dominant — seizure plus one sign, net 0 (stroke unlikely, override flagged). */
function mimicDominant(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'emergency-department',
		symptomOnsetAt: '2026-06-10T07:30'
	};
	d.identification = { patientIdentifier: 'ED-100333', ageBand: '60-74', sex: 'female' };
	d.precondition = { bloodGlucose: 5.9, hypoglycaemiaCorrected: 'na' };
	d.mimics = { lossOfConsciousness: 'no', seizureActivity: 'yes' };
	d.signs = {
		facialWeakness: 'yes',
		armWeakness: 'no',
		legWeakness: 'no',
		speechDisturbance: 'no',
		visualFieldDefect: 'no'
	};
	d.note.clinicalNote = 'Seizure witnessed; residual facial droop — clinical suspicion remains.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RS-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: mimicDominant() },
	{ id: 'RS-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: strokeUnlikely() },
	{ id: 'RS-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: strokeLikely() },
	{ id: 'RS-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: hypoglycaemia() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRosierGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		rosierScore: g.rosierScore,
		band: g.band,
		activateFlag: g.band === 'stroke-likely',
		flagCount: g.flaggedIssues.length
	};
});
