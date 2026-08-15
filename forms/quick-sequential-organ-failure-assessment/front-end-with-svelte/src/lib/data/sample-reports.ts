import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateQsofaGrade } from '#lib/engine/qsofa-grader.js';
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
	qsofaScore: number;
	riskBand: RiskBand;
	escalationFlag: boolean;
	flagCount: number;
}

/** Score 0 — fully-negative screen. */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'ward',
		suspectedSource: 'Urinary tract'
	};
	d.identification = { patientIdentifier: 'WRD-2041', ageBand: '40-59', sex: 'female' };
	d.respiratory.respiratoryRate = 16;
	d.mentation.glasgowComaScale = 15;
	d.mentation.mentationAltered = 'no';
	d.circulation.systolicBloodPressure = 128;
	d.note.clinicalNote = 'Stable; routine monitoring.';
	return d;
}

/** Score 1 — single positive criterion (tachypnoea), still lower risk. */
function score1(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'emergency-department',
		suspectedSource: 'Chest / pneumonia'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageBand: '60-74', sex: 'male' };
	d.respiratory.respiratoryRate = 24;
	d.mentation.glasgowComaScale = 15;
	d.mentation.mentationAltered = 'no';
	d.circulation.systolicBloodPressure = 118;
	d.note.clinicalNote = 'Mild tachypnoea; observing.';
	return d;
}

/** Score 2 — positive screen (tachypnoea + hypotension), higher risk. */
function score2(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department',
		suspectedSource: 'Abdomen'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '75-plus', sex: 'female' };
	d.respiratory.respiratoryRate = 26;
	d.mentation.glasgowComaScale = 15;
	d.mentation.mentationAltered = 'no';
	d.circulation.systolicBloodPressure = 96;
	d.note.clinicalNote = 'Positive screen; senior review requested.';
	return d;
}

/** Score 3 — all three criteria positive, higher risk. */
function score3(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Paramedic S. Doyle',
		clinicianRole: 'paramedic',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'pre-hospital',
		suspectedSource: 'Skin / soft tissue'
	};
	d.identification = { patientIdentifier: 'AMB-77-2211', ageBand: '60-74', sex: 'male' };
	d.respiratory.respiratoryRate = 30;
	d.mentation.glasgowComaScale = 12;
	d.mentation.mentationAltered = 'yes';
	d.circulation.systolicBloodPressure = 84;
	d.note.clinicalNote = 'Pre-alert called; escalated on arrival.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'QS-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: score0() },
	{ id: 'QS-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: score1() },
	{ id: 'QS-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: score2() },
	{ id: 'QS-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: score3() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateQsofaGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		qsofaScore: g.qsofaScore,
		riskBand: g.riskBand,
		escalationFlag: g.thresholdMet === 'yes',
		flagCount: g.flaggedIssues.length
	};
});
