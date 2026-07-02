import type { AssessmentData, CareSetting, Classification } from '$lib/engine/types';
import { calculateCorrectedCalcium } from '$lib/engine/calcium-calculator';
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
	correctedCalcium: number | null;
	classification: Classification;
	severeFlag: boolean;
	flagCount: number;
}

/** Normal — corrected calcium within the adult reference range. */
function normalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'general-practice',
		sampleReference: 'GP-100482-S1'
	};
	d.identification = { patientIdentifier: 'GP-100482', ageBand: '40-64', sex: 'female' };
	d.calcium.totalCalcium = 2.36;
	d.albumin.albumin = 34; // corrected 2.48
	d.symptoms.symptomatic = 'no';
	d.note.clinicalNote = 'Routine biochemistry; corrected calcium normal.';
	return d;
}

/** Hypocalcaemia — below the 2.20 lower reference limit (not severe). */
function hypocalcaemiaCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'ward',
		sampleReference: 'WD-573110-S1'
	};
	d.identification = { patientIdentifier: 'WD-573110', ageBand: '65-74', sex: 'male' };
	d.calcium.totalCalcium = 2.0;
	d.albumin.albumin = 44; // corrected 1.92
	d.symptoms.symptomatic = 'no';
	d.note.clinicalNote = 'Low corrected calcium; magnesium and vitamin D requested.';
	return d;
}

/** Hypercalcaemia — above the 2.60 upper reference limit, symptomatic (not severe). */
function hypercalcaemiaCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'emergency-department',
		sampleReference: 'ED-100517-S1'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '75-84', sex: 'female' };
	d.calcium.totalCalcium = 2.78;
	d.albumin.albumin = 44; // corrected 2.70
	d.symptoms.symptomatic = 'yes';
	d.note.clinicalNote = 'Symptomatic hypercalcaemia; PTH and screen requested.';
	return d;
}

/** Severe hypercalcaemia — at or above the 3.0 mmol/L severe threshold. */
function severeHypercalcaemiaCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'emergency-department',
		sampleReference: 'ED-100628-S1'
	};
	d.identification = { patientIdentifier: 'ED-100628', ageBand: '85-plus', sex: 'male' };
	d.calcium.totalCalcium = 3.06;
	d.albumin.albumin = 36; // corrected 3.14
	d.symptoms.symptomatic = 'yes';
	d.note.clinicalNote = 'Hypercalcaemic crisis; urgent endocrine review and IV fluids.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CCC-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: normalCase() },
	{
		id: 'CCC-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: hypocalcaemiaCase()
	},
	{
		id: 'CCC-2026-0003',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-26',
		data: hypercalcaemiaCase()
	},
	{
		id: 'CCC-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: severeHypercalcaemiaCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCorrectedCalcium(s.data);
	const severe = g.flaggedIssues.some(
		(f) => f.id === 'F-SEVERE-HYPERCALCAEMIA-001' || f.id === 'F-SEVERE-HYPOCALCAEMIA-001'
	);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		correctedCalcium: g.correctedCalcium,
		classification: g.classification,
		severeFlag: severe,
		flagCount: g.flaggedIssues.length
	};
});
