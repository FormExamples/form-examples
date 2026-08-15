import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateRockallGrade } from '#lib/engine/rockall-grader.js';
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
	clinicalRockallScore: number;
	fullRockallScore: number | null;
	riskBand: RiskBand;
	highFlag: boolean;
	flagCount: number;
}

/** Low risk — young patient, no shock, no comorbidity, benign endoscopy (full 1). */
function lowRiskCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'emergency-department',
		presentingComplaint: 'Coffee-ground vomiting, one episode'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageYears: 45, sex: 'female' };
	d.shock.systolicBloodPressure = 124; // 0
	d.shock.heartRate = 78; // 0
	d.comorbidityStep.comorbidity = 'none'; // 0 → clinical 0
	d.endoscopy.endoscopyPerformed = 'yes';
	d.endoscopy.diagnosis = 'all-other'; // 1
	d.endoscopy.stigmata = 'none-or-dark-spot'; // 0 → full 1
	d.note.clinicalNote = 'Small clean-based gastric ulcer; low risk, plan for early discharge.';
	return d;
}

/** Intermediate risk — older patient, tachycardia, benign diagnosis (full 4). */
function intermediateRiskCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'gastroenterologist',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'ward',
		presentingComplaint: 'Melaena for two days'
	};
	d.identification = { patientIdentifier: 'WD-573110', ageYears: 72, sex: 'male' }; // 1
	d.shock.systolicBloodPressure = 118; // not hypotensive
	d.shock.heartRate = 104; // 1
	d.comorbidityStep.comorbidity = 'none'; // 0 → clinical 2
	d.endoscopy.endoscopyPerformed = 'yes';
	d.endoscopy.diagnosis = 'all-other'; // 1
	d.endoscopy.stigmata = 'none-or-dark-spot'; // 0 → full 3 (clinical 2 + 1 + 0)
	d.note.clinicalNote = 'Duodenal ulcer with a clean base; conservative management and observation.';
	return d;
}

/** High risk — elderly, hypotension, severe comorbidity, malignancy (full 11). */
function highRiskCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'endoscopist',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'endoscopy-unit',
		presentingComplaint: 'Large-volume haematemesis'
	};
	d.identification = { patientIdentifier: 'EU-880204', ageYears: 84, sex: 'female' }; // 2
	d.shock.systolicBloodPressure = 88; // 2 (hypotension)
	d.shock.heartRate = 128;
	d.comorbidityStep.comorbidity = 'severe'; // 3 → clinical 7
	d.endoscopy.endoscopyPerformed = 'yes';
	d.endoscopy.diagnosis = 'upper-gi-malignancy'; // 2
	d.endoscopy.stigmata = 'high-risk'; // 2 → full 11
	d.note.clinicalNote =
		'Bleeding gastric malignancy; haemostasis attempted, ITU and upper-GI MDT referral made.';
	return d;
}

/** Clinical-only — pre-endoscopy assessment, endoscopy not yet performed (clinical 4). */
function clinicalOnlyCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'emergency-department',
		presentingComplaint: 'Haematemesis; awaiting endoscopy'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageYears: 81, sex: 'male' }; // 2
	d.shock.systolicBloodPressure = 112; // not hypotensive
	d.shock.heartRate = 108; // 1
	d.comorbidityStep.comorbidity = 'none'; // 0 → clinical 3
	d.endoscopy.endoscopyPerformed = 'no'; // clinical-only path
	d.note.clinicalNote = 'Resuscitated and admitted; endoscopy planned within 24 hours.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'RCK-2026-0001',
		patientName: 'Osei, Grace',
		assessedDate: '2026-06-24',
		data: lowRiskCase()
	},
	{
		id: 'RCK-2026-0002',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-25',
		data: intermediateRiskCase()
	},
	{
		id: 'RCK-2026-0003',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: highRiskCase()
	},
	{
		id: 'RCK-2026-0004',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-26',
		data: clinicalOnlyCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRockallGrade(s.data);
	const highFlag = g.flaggedIssues.some((f) => f.priority === 'high');
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		clinicalRockallScore: g.clinicalRockallScore,
		fullRockallScore: g.fullRockallScore,
		riskBand: g.riskBand,
		highFlag,
		flagCount: g.flaggedIssues.length
	};
});
