import type { AssessmentData, CareSetting, Classification } from '$lib/engine/types';
import { calculateAnionGap } from '$lib/engine/anion-gap-grader';
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
	anionGap: number | null;
	correctedAnionGap: number | null;
	classification: Classification;
	urgentFlag: boolean;
	flagCount: number;
}

/** Normal — anion gap within the reference range (potassium-inclusive). */
function normalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		calculatedAt: '2026-06-24T09:15',
		careSetting: 'ward',
		clinicalContext: 'Routine electrolyte review'
	};
	d.identification = { patientIdentifier: 'WRD-100482', ageBand: '40-64', sex: 'female' };
	// (140 + 4.2) − (104 + 26) = 14.2 → normal (with K, 8–16)
	d.electrolytes = { sodium: 140, potassium: 4.2, chloride: 104, bicarbonate: 26 };
	d.albumin.albumin = 40;
	d.note.clinicalNote = 'Anion gap within the normal reference range.';
	return d;
}

/** Low — below the 8 mmol/L lower reference limit. */
function lowCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		calculatedAt: '2026-06-25T11:40',
		careSetting: 'laboratory',
		clinicalContext: 'Paraprotein screen follow-up'
	};
	d.identification = { patientIdentifier: 'LAB-573110', ageBand: '65-74', sex: 'male' };
	// 137 − (105 + 27) = 5 → low (without K, 8–12)
	d.electrolytes = { sodium: 137, potassium: null, chloride: 105, bicarbonate: 27 };
	d.albumin.albumin = 30;
	d.note.clinicalNote = 'Low gap; consider paraproteinaemia or laboratory error.';
	return d;
}

/** High — above the upper reference limit but below 20 (HAGMA). */
function highCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		calculatedAt: '2026-06-26T16:05',
		careSetting: 'emergency-department',
		clinicalContext: 'Unwell diabetic, query acidosis'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '18-39', sex: 'female' };
	// (138 + 4.5) − (100 + 18) = 24.5 with K... use without-K for a mid-high gap
	// 138 − (104 + 16) = 18 → high (without K, 8–12; below 20)
	d.electrolytes = { sodium: 138, potassium: null, chloride: 104, bicarbonate: 16 };
	d.albumin.albumin = 38;
	d.note.clinicalNote = 'Raised gap; working through GOLDMARK / MUDPILES differential.';
	return d;
}

/** Very high — at or above the 20 mmol/L urgent threshold. */
function veryHighCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		calculatedAt: '2026-06-26T22:20',
		careSetting: 'intensive-care',
		clinicalContext: 'Shocked, lactataemia'
	};
	d.identification = { patientIdentifier: 'ICU-100628', ageBand: '75-84', sex: 'male' };
	// (142 + 5.0) − (100 + 12) = 35 → very-high (with K)
	d.electrolytes = { sodium: 142, potassium: 5.0, chloride: 100, bicarbonate: 12 };
	d.albumin.albumin = 22;
	d.note.clinicalNote = 'Severe high anion gap acidosis; urgent cause search under way.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AGC-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: normalCase() },
	{
		id: 'AGC-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: lowCase()
	},
	{ id: 'AGC-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: highCase() },
	{
		id: 'AGC-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: veryHighCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateAnionGap(s.data);
	const urgent = g.flaggedIssues.some((f) => f.priority === 'urgent');
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		anionGap: g.anionGap,
		correctedAnionGap: g.correctedAnionGap,
		classification: g.classification,
		urgentFlag: urgent,
		flagCount: g.flaggedIssues.length
	};
});
