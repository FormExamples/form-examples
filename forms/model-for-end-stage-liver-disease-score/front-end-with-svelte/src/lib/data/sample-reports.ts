import type { AssessmentData, CareSetting, MortalityBand } from '$lib/engine/types';
import { calculateMeld } from '$lib/engine/meld-grader';
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
	meldScore: number | null;
	mortalityBand: MortalityBand;
	dialysisFlag: boolean;
	flagCount: number;
}

/** Low band — MELD-Na, mild derangement, no dialysis. */
function lowCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'hepatologist',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'hepatology-clinic',
		meldVariant: 'meld-na'
	};
	d.identification = { patientIdentifier: 'HEP-100482', ageBand: '40-59', sex: 'female' };
	d.bilirubin = { bilirubin: 1.2, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 1.1;
	d.renal = { creatinine: 1.0, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 0, cvvhd24h: 'no' };
	d.sodium.sodium = 138;
	d.note.clinicalNote = 'Stable compensated cirrhosis; low MELD-Na.';
	return d;
}

/** Moderate band — base MELD. */
function moderateCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gastroenterologist',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'ward',
		meldVariant: 'meld'
	};
	d.identification = { patientIdentifier: 'WD-573110', ageBand: '60-74', sex: 'male' };
	d.bilirubin = { bilirubin: 2.0, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 1.5;
	d.renal = { creatinine: 1.2, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 0, cvvhd24h: 'no' };
	d.note.clinicalNote = 'Decompensation with ascites; moderate MELD.';
	return d;
}

/** High band — moderate-severe derangement, no dialysis. */
function highCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'transplant-coordinator',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'transplant-unit',
		meldVariant: 'meld'
	};
	d.identification = { patientIdentifier: 'TX-100517', ageBand: '40-59', sex: 'female' };
	d.bilirubin = { bilirubin: 4.0, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 1.8;
	d.renal = { creatinine: 2.0, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 0, cvvhd24h: 'no' };
	d.note.clinicalNote = 'Listed for transplant assessment; high MELD.';
	return d;
}

/** Very-high band — dialysis case with hyponatraemia (MELD-Na). */
function veryHighDialysisCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'intensivist',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'intensive-care',
		meldVariant: 'meld-na'
	};
	d.identification = { patientIdentifier: 'ICU-100628', ageBand: '60-74', sex: 'male' };
	d.bilirubin = { bilirubin: 6.0, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 2.0;
	d.renal = { creatinine: 1.5, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 3, cvvhd24h: 'no' };
	d.sodium.sodium = 128;
	d.note.clinicalNote = 'On haemodialysis; hyponatraemic; very high MELD-Na.';
	return d;
}

/** Extreme band — MELD 3.0 with marked derangement, CVVHD. */
function extremeCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Fletcher',
		clinicianRole: 'intensivist',
		assessedAt: '2026-06-27T04:10',
		careSetting: 'intensive-care',
		meldVariant: 'meld-3'
	};
	d.identification = { patientIdentifier: 'ICU-573642', ageBand: '40-59', sex: 'female' };
	d.bilirubin = { bilirubin: 40, bilirubinUnit: 'mg/dL' };
	d.inr.inr = 6.0;
	d.renal = { creatinine: 5.0, creatinineUnit: 'mg/dL', dialysisSessionsPastWeek: 0, cvvhd24h: 'yes' };
	d.sodium.sodium = 125;
	d.albumin.albumin = 1.5;
	d.note.clinicalNote = 'Acute-on-chronic liver failure; CVVHD; extreme MELD 3.0.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MELD-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: lowCase() },
	{
		id: 'MELD-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: moderateCase()
	},
	{ id: 'MELD-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: highCase() },
	{
		id: 'MELD-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: veryHighDialysisCase()
	},
	{
		id: 'MELD-2026-0005',
		patientName: 'Fletcher, Rosemary',
		assessedDate: '2026-06-27',
		data: extremeCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMeld(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		meldScore: g.meldScore,
		mortalityBand: g.mortalityBand,
		dialysisFlag: g.dialysisRuleApplied,
		flagCount: g.flaggedIssues.length
	};
});
