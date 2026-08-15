import type { AssessmentData, CareSetting, GStage } from '#lib/engine/types.js';
import { calculateEgfr } from '#lib/engine/egfr-grader.js';
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
	egfr: number | null;
	egfrStage: GStage;
	referralFlag: boolean;
	flagCount: number;
}

/** G1 — normal or high renal function. */
function g1Case(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-22T09:15',
		careSetting: 'primary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'GP-100482', ageYears: 45, sex: 'female' };
	d.creatinine = { serumCreatinine: 62, specimenDate: '2026-06-21', steadyState: 'yes' };
	d.note.clinicalNote = 'Routine biochemistry; renal function normal.';
	return d;
}

/** G2 — mildly decreased renal function. */
function g2Case(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-23T11:40',
		careSetting: 'primary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'GP-100517', ageYears: 58, sex: 'male' };
	d.creatinine = { serumCreatinine: 118, specimenDate: '2026-06-22', steadyState: 'yes' };
	d.note.clinicalNote = 'Mildly decreased eGFR; annual monitoring.';
	return d;
}

/** G3a — mildly to moderately decreased renal function. */
function g3aCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr M. Silva',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T16:05',
		careSetting: 'secondary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'OP-880204', ageYears: 66, sex: 'male' };
	d.creatinine = { serumCreatinine: 132, specimenDate: '2026-06-23', steadyState: 'yes' };
	d.note.clinicalNote = 'CKD G3a; ACR and blood pressure review requested.';
	return d;
}

/** G3b — moderately to severely decreased renal function. */
function g3bCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-25T10:20',
		careSetting: 'secondary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'OP-880311', ageYears: 72, sex: 'male' };
	d.creatinine = { serumCreatinine: 185, specimenDate: '2026-06-24', steadyState: 'yes' };
	d.note.clinicalNote = 'CKD G3b; medication review for renally-cleared drugs.';
	return d;
}

/** G4 — severely decreased; nephrology referral. */
function g4Case(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Fletcher',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T14:00',
		careSetting: 'secondary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'WD-573642', ageYears: 68, sex: 'female' };
	d.creatinine = { serumCreatinine: 230, specimenDate: '2026-06-25', steadyState: 'yes' };
	d.note.clinicalNote = 'CKD G4; nephrology referral per NICE NG203.';
	return d;
}

/** G5 — kidney failure; not at steady state (AKI concern). */
function g5Case(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-27T22:20',
		careSetting: 'secondary-care',
		equation: 'ckd-epi-2021-creatinine'
	};
	d.identification = { patientIdentifier: 'WD-573110', ageYears: 74, sex: 'male' };
	d.creatinine = { serumCreatinine: 560, specimenDate: '2026-06-27', steadyState: 'no' };
	d.note.clinicalNote = 'Established kidney failure; urgent nephrology input; possible acute drop.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EGFR-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-22', data: g1Case() },
	{
		id: 'EGFR-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-23',
		data: g2Case()
	},
	{ id: 'EGFR-2026-0003', patientName: 'Silva, Marcos', assessedDate: '2026-06-24', data: g3aCase() },
	{ id: 'EGFR-2026-0004', patientName: 'Nowak, Zofia', assessedDate: '2026-06-25', data: g3bCase() },
	{
		id: 'EGFR-2026-0005',
		patientName: 'Fletcher, Rosemary',
		assessedDate: '2026-06-26',
		data: g4Case()
	},
	{ id: 'EGFR-2026-0006', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-27', data: g5Case() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateEgfr(s.data);
	const referral = g.flaggedIssues.some(
		(f) =>
			f.id === 'F-G4-NEPHROLOGY-REFERRAL-001' || f.id === 'F-G5-NEPHROLOGY-REFERRAL-001'
	);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		egfr: g.egfr,
		egfrStage: g.egfrStage,
		referralFlag: referral,
		flagCount: g.flaggedIssues.length
	};
});
