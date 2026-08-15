import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateGraceGrade } from '#lib/engine/grace-grader.js';
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
	gracePoints: number;
	riskCategory: RiskBand;
	escalationFlag: boolean;
	flagCount: number;
}

/** Low risk — young unstable-angina presentation, no high-risk features (~56 points). */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'emergency-physician',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'emergency-department',
		presentationType: 'unstable-angina'
	};
	d.identification = { patientIdentifier: 'ED-100482', ageYears: 48, sex: 'female' };
	d.haemodynamics = { heartRate: 60, systolicBloodPressure: 150 };
	d.renal = { serumCreatinine: 0.7, serumCreatinineUnit: 'mg/dL' };
	d.heartFailure = { killipClass: 'I' };
	d.highRiskFeatures = {
		cardiacArrestAtAdmission: 'no',
		stSegmentDeviation: 'no',
		elevatedCardiacEnzymes: 'no'
	};
	d.note.clinicalNote = 'Troponin negative; low-risk chest pain pathway.';
	return d;
}

/** Intermediate risk — NSTEMI with elevated enzymes, stable haemodynamics (~105 points). */
function intermediateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'acute-physician',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'acute-medical-unit',
		presentationType: 'nstemi'
	};
	d.identification = { patientIdentifier: 'AMU-2041', ageYears: 58, sex: 'male' };
	d.haemodynamics = { heartRate: 78, systolicBloodPressure: 135 };
	d.renal = { serumCreatinine: 0.9, serumCreatinineUnit: 'mg/dL' };
	d.heartFailure = { killipClass: 'I' };
	d.highRiskFeatures = {
		cardiacArrestAtAdmission: 'no',
		stSegmentDeviation: 'no',
		elevatedCardiacEnzymes: 'yes'
	};
	d.note.clinicalNote = 'NSTEMI; angiography within 72 hours planned.';
	return d;
}

/** High risk — elderly NSTEMI, Killip II, ST deviation, elevated enzymes (~205 points). */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr M. Santos',
		clinicianRole: 'cardiologist',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'coronary-care-unit',
		presentationType: 'nstemi'
	};
	d.identification = { patientIdentifier: 'CCU-100517', ageYears: 78, sex: 'female' };
	d.haemodynamics = { heartRate: 105, systolicBloodPressure: 110 };
	d.renal = { serumCreatinine: 1.5, serumCreatinineUnit: 'mg/dL' };
	d.heartFailure = { killipClass: 'II' };
	d.highRiskFeatures = {
		cardiacArrestAtAdmission: 'no',
		stSegmentDeviation: 'yes',
		elevatedCardiacEnzymes: 'yes'
	};
	d.note.clinicalNote = 'High GRACE risk; early invasive strategy arranged.';
	return d;
}

/** Very high risk — STEMI with cardiac arrest, cardiogenic shock, renal impairment (~329 points). */
function criticalRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Patel',
		clinicianRole: 'cardiologist',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'coronary-care-unit',
		presentationType: 'stemi'
	};
	d.identification = { patientIdentifier: 'CCU-100599', ageYears: 82, sex: 'male' };
	d.haemodynamics = { heartRate: 130, systolicBloodPressure: 85 };
	// Entered in µmol/L to exercise creatinine normalisation (212 / 88.4 ≈ 2.40 mg/dL).
	d.renal = { serumCreatinine: 212, serumCreatinineUnit: 'umol/L' };
	d.heartFailure = { killipClass: 'IV' };
	d.highRiskFeatures = {
		cardiacArrestAtAdmission: 'yes',
		stSegmentDeviation: 'yes',
		elevatedCardiacEnzymes: 'yes'
	};
	d.note.clinicalNote = 'Post-arrest STEMI in cardiogenic shock; primary PCI activated.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GR-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: lowRisk() },
	{
		id: 'GR-2026-0002',
		patientName: 'Novak, Peter',
		assessedDate: '2026-06-12',
		data: intermediateRisk()
	},
	{
		id: 'GR-2026-0003',
		patientName: 'Ferreira, Ana',
		assessedDate: '2026-06-15',
		data: highRisk()
	},
	{
		id: 'GR-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: criticalRisk()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGraceGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		gracePoints: g.gracePoints,
		riskCategory: g.riskCategory,
		escalationFlag: g.riskCategory === 'high',
		flagCount: g.flaggedIssues.length
	};
});
