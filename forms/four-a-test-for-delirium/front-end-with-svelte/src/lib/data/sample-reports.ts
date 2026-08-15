import type { AssessmentData, InterpretationBand, Setting } from '#lib/engine/types.js';
import { calculateFourATGrade } from '#lib/engine/fourat-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	setting: Setting;
	totalScore: number;
	interpretationBand: InterpretationBand;
	deliriumFlag: boolean;
	flagCount: number;
}

/** Score 0 — delirium unlikely; fully-negative screen. */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'MRN-100482',
		patientName: 'Osei, Grace',
		dateOfBirth: '1949-11-02',
		assessmentDate: '2026-06-24',
		assessmentTime: '08:15',
		setting: 'acute',
		assessorName: 'Dr A. Khan',
		assessorRole: 'Registrar'
	};
	d.item1.alertness = 'normal';
	d.item2.amt4 = 'noMistakes';
	d.item3.attentionMonths = 'sevenOrMore';
	d.item4.acuteChange = 'no';
	d.item4.acuteChangeSource = 'collateral';
	d.note.clinicalNotes = 'Alert and oriented; routine admission screen.';
	return d;
}

/** Score 2 — possible cognitive impairment (AMT4 1 mistake + attention < 7). */
function score2(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'MRN-573110',
		patientName: 'Mackenzie, Ian',
		dateOfBirth: '1943-05-18',
		assessmentDate: '2026-06-25',
		assessmentTime: '10:40',
		setting: 'periop',
		assessorName: 'Nurse P. Reyes',
		assessorRole: 'Staff nurse'
	};
	d.item1.alertness = 'normal';
	d.item2.amt4 = 'oneMistake';
	d.item3.attentionMonths = 'startsButUnderSevenOrRefuses';
	d.item4.acuteChange = 'no';
	d.item4.acuteChangeSource = 'records';
	d.note.clinicalNotes = 'Post-operative day 1; mild memory concerns, no acute change reported.';
	return d;
}

/** Score 8 — possible delirium (abnormal alertness + acute change). */
function score8(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'ED-100517',
		patientName: 'Nowak, Zofia',
		dateOfBirth: '1938-02-27',
		assessmentDate: '2026-06-26',
		assessmentTime: '22:05',
		setting: 'ed',
		assessorName: 'Dr L. Osei',
		assessorRole: 'Emergency physician'
	};
	d.item1.alertness = 'abnormal';
	d.item2.amt4 = 'noMistakes';
	d.item3.attentionMonths = 'sevenOrMore';
	d.item4.acuteChange = 'yes';
	d.item4.acuteChangeSource = 'collateral';
	d.note.clinicalNotes = 'Family report acute onset of confusion over 48 hours; markedly drowsy on arrival.';
	return d;
}

/** Score 12 — possible delirium; maximum score. */
function score12(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'CH-880204',
		patientName: 'Ahmed, Bilal',
		dateOfBirth: '1935-09-09',
		assessmentDate: '2026-06-26',
		assessmentTime: '15:20',
		setting: 'careHome',
		assessorName: 'Dr S. Doyle',
		assessorRole: 'GP'
	};
	d.item1.alertness = 'abnormal';
	d.item2.amt4 = 'twoOrMoreOrUntestable';
	d.item3.attentionMonths = 'untestable';
	d.item4.acuteChange = 'yes';
	d.item4.acuteChangeSource = 'collateral';
	d.note.clinicalNotes = 'Untestable for AMT4 and attention; fluctuating course; urgent hospital review arranged.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: '4AT-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: score0() },
	{ id: '4AT-2026-0002', patientName: 'Mackenzie, Ian', assessedDate: '2026-06-25', data: score2() },
	{ id: '4AT-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: score8() },
	{ id: '4AT-2026-0004', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-26', data: score12() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateFourATGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		setting: s.data.identification.setting,
		totalScore: g.totalScore,
		interpretationBand: g.interpretationBand,
		deliriumFlag: g.totalScore >= 4,
		flagCount: g.flaggedIssues.length
	};
});
