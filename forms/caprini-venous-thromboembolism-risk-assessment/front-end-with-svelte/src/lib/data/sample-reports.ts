import type { AssessmentData, CareSetting, Prophylaxis, RiskBand } from '#lib/engine/types.js';
import { calculateCapriniGrade } from '#lib/engine/caprini-grader.js';
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
	capriniScore: number;
	riskBand: RiskBand;
	recommendedProphylaxis: Prophylaxis;
	highRiskFlag: boolean;
	flagCount: number;
}

/** Answer every yes/no field in a section 'no' by default. */
function allNo(section: Record<string, string>): void {
	for (const key of Object.keys(section)) section[key] = 'no';
}

function baseNegative(): AssessmentData {
	const d = createDefaultAssessment();
	allNo(d.onePoint as unknown as Record<string, string>);
	allNo(d.twoPoint as unknown as Record<string, string>);
	allNo(d.threePoint as unknown as Record<string, string>);
	allNo(d.fivePoint as unknown as Record<string, string>);
	d.bleeding.highBleedingRisk = 'no';
	return d;
}

/** Very-low band — score 0, all negative, young. */
function veryLow(): AssessmentData {
	const d = baseNegative();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'surgeon',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'pre-operative-clinic',
		admissionType: 'surgical'
	};
	d.identification = { patientIdentifier: 'POC-2041', ageBand: 'under-41', sex: 'female' };
	d.note.clinicalNote = 'Day-case minor procedure; encourage early ambulation.';
	return d;
}

/** Low band — score 2 (age 61-74). */
function low(): AssessmentData {
	const d = baseNegative();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'medical-ward',
		admissionType: 'medical'
	};
	d.identification = { patientIdentifier: 'MED-100482', ageBand: '61-74', sex: 'male' };
	d.note.clinicalNote = 'Mechanical prophylaxis with graduated compression stockings.';
	return d;
}

/** Moderate band — score 4 (age 41-60 = 1, obesity = 1, malignancy = 2). */
function moderate(): AssessmentData {
	const d = baseNegative();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'surgical-ward',
		admissionType: 'surgical'
	};
	d.identification = { patientIdentifier: 'SUR-100517', ageBand: '41-60', sex: 'female' };
	d.onePoint.obesity = 'yes';
	d.twoPoint.malignancy = 'yes';
	d.note.clinicalNote = 'Consider pharmacological or mechanical prophylaxis after bleeding review.';
	return d;
}

/** High band with a bleeding contraindication — score 10, high bleeding risk. */
function highWithBleeding(): AssessmentData {
	const d = baseNegative();
	d.context = {
		clinicianName: 'Dr M. Farah',
		clinicianRole: 'surgeon',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'surgical-ward',
		admissionType: 'surgical'
	};
	d.identification = { patientIdentifier: 'SUR-77-2211', ageBand: '75-plus', sex: 'male' };
	d.twoPoint.majorOpenSurgery = 'yes'; // 2
	d.threePoint.historyOfVte = 'yes'; // 3
	d.fivePoint.hipPelvisLegFracture = 'yes'; // 5
	d.bleeding.highBleedingRisk = 'yes';
	d.note.clinicalNote = 'High bleeding risk — mechanical prophylaxis; senior review requested.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CAP-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: veryLow() },
	{ id: 'CAP-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: low() },
	{ id: 'CAP-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: moderate() },
	{
		id: 'CAP-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: highWithBleeding()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCapriniGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		capriniScore: g.capriniScore,
		riskBand: g.riskBand,
		recommendedProphylaxis: g.recommendedProphylaxis,
		highRiskFlag: g.riskBand === 'high',
		flagCount: g.flaggedIssues.length
	};
});
