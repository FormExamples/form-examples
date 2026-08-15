import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateAuditcGrade } from '#lib/engine/auditc-grader.js';
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
	careSetting: CareSetting;
	auditcScore: number;
	riskBand: RiskBand;
	positiveScreen: boolean;
	flagCount: number;
}

/** Total 2 — lower risk, negative screen. */
function score2(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Osei',
		clinicianRole: 'gp',
		assessedAt: '2026-06-10T09:15',
		careSetting: 'primary-care',
		administrationMode: 'interview'
	};
	d.identification = { patientIdentifier: 'GP-100482', ageBand: '40-59', sex: 'female' };
	d.items = { frequencyOfDrinking: 1, typicalQuantity: 1, heavyEpisodeFrequency: 0 };
	d.note.clinicalNote = 'Low-risk drinking; reinforced CMO guidance.';
	return d;
}

/**
 * Total 4 in a female patient — lower risk by the default cut, but at the
 * sex-specific female cut of 4 (triggers the low-priority flag).
 */
function score4Female(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'health-check',
		administrationMode: 'self-completed'
	};
	d.identification = { patientIdentifier: 'HC-573110', ageBand: '25-39', sex: 'female' };
	d.items = { frequencyOfDrinking: 2, typicalQuantity: 1, heavyEpisodeFrequency: 1 };
	d.note.clinicalNote = 'Total 4 — considered brief advice given female-specific cut.';
	return d;
}

/** Total 7 — increasing risk, positive screen, weekly binge pattern. */
function score7(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Novak',
		clinicianRole: 'gp',
		assessedAt: '2026-06-15T11:05',
		careSetting: 'emergency-department',
		administrationMode: 'interview'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '25-39', sex: 'male' };
	d.items = { frequencyOfDrinking: 2, typicalQuantity: 2, heavyEpisodeFrequency: 3 };
	d.note.clinicalNote = 'Positive screen; brief intervention delivered.';
	return d;
}

/** Total 12 — possible dependence, all items at their maximum. */
function score12(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'gp',
		assessedAt: '2026-06-18T16:20',
		careSetting: 'inpatient',
		administrationMode: 'interview'
	};
	d.identification = { patientIdentifier: 'IN-880204', ageBand: '60-74', sex: 'male' };
	d.items = { frequencyOfDrinking: 4, typicalQuantity: 4, heavyEpisodeFrequency: 4 };
	d.note.clinicalNote = 'Very high AUDIT-C; referred to specialist alcohol services.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AC-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: score2() },
	{
		id: 'AC-2026-0002',
		patientName: 'Mackenzie, Ivy',
		assessedDate: '2026-06-12',
		data: score4Female()
	},
	{ id: 'AC-2026-0003', patientName: 'Novak, Peter', assessedDate: '2026-06-15', data: score7() },
	{ id: 'AC-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: score12() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateAuditcGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		auditcScore: g.auditcScore,
		riskBand: g.riskBand,
		positiveScreen: g.positiveScreen,
		flagCount: g.flaggedIssues.length
	};
});
