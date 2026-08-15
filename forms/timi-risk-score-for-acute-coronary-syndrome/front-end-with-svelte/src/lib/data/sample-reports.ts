import type { AssessmentData, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateTimiGrade } from '#lib/engine/timi-grader.js';
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
	timiScore: number;
	riskBand: RiskBand;
	fourteenDayRiskPercent: number;
	markerPositive: boolean;
	flagCount: number;
}

/** TIMI 0 — fully-negative, low-risk unstable angina. */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'physician',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'chest-pain-unit',
		workingDiagnosis: 'unstable-angina'
	};
	d.identification = { patientIdentifier: 'CPU-2041', sex: 'female' };
	d.riskProfile = { ageOver65: 'no', threeOrMoreCadRiskFactors: 'no' };
	d.cardiacHistory = { knownCadStenosis: 'no', aspirinUsePrior7Days: 'no' };
	d.presentation = { twoOrMoreAnginaEpisodes24h: 'no' };
	d.investigations = { stDeviation: 'no', positiveCardiacMarker: 'no' };
	d.note.clinicalNote = 'Atypical chest pain; low pre-test probability. Serial troponin negative.';
	return d;
}

/** TIMI 1 — a single criterion (age), still low risk. */
function score1(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'ANP P. Reyes',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'emergency-department',
		workingDiagnosis: 'unstable-angina'
	};
	d.identification = { patientIdentifier: 'ED-100482', sex: 'male' };
	d.riskProfile = { ageOver65: 'yes', threeOrMoreCadRiskFactors: 'no' };
	d.cardiacHistory = { knownCadStenosis: 'no', aspirinUsePrior7Days: 'no' };
	d.presentation = { twoOrMoreAnginaEpisodes24h: 'no' };
	d.investigations = { stDeviation: 'no', positiveCardiacMarker: 'no' };
	d.note.clinicalNote = 'Elderly patient, otherwise low-risk features. Admit for observation.';
	return d;
}

/** TIMI 3 — intermediate risk. */
function score3(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'cardiologist',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department',
		workingDiagnosis: 'nstemi'
	};
	d.identification = { patientIdentifier: 'ED-100517', sex: 'female' };
	d.riskProfile = { ageOver65: 'yes', threeOrMoreCadRiskFactors: 'yes' };
	d.cardiacHistory = { knownCadStenosis: 'no', aspirinUsePrior7Days: 'no' };
	d.presentation = { twoOrMoreAnginaEpisodes24h: 'no' };
	d.investigations = { stDeviation: 'yes', positiveCardiacMarker: 'no' };
	d.note.clinicalNote = 'Dynamic ECG changes; early invasive strategy under consideration.';
	return d;
}

/** TIMI 6 — high risk, positive marker with ST deviation. */
function score6(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'cardiologist',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'coronary-care',
		workingDiagnosis: 'nstemi'
	};
	d.identification = { patientIdentifier: 'CCU-77-2211', sex: 'male' };
	d.riskProfile = { ageOver65: 'yes', threeOrMoreCadRiskFactors: 'yes' };
	d.cardiacHistory = { knownCadStenosis: 'yes', aspirinUsePrior7Days: 'yes' };
	d.presentation = { twoOrMoreAnginaEpisodes24h: 'no' };
	d.investigations = { stDeviation: 'yes', positiveCardiacMarker: 'yes' };
	d.note.clinicalNote = 'High-risk NSTEMI; urgent invasive strategy and intensified antithrombotic therapy.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'TIMI-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: score0() },
	{ id: 'TIMI-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: score1() },
	{ id: 'TIMI-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: score3() },
	{ id: 'TIMI-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: score6() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateTimiGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		timiScore: g.timiScore,
		riskBand: g.riskBand,
		fourteenDayRiskPercent: g.fourteenDayRiskPercent,
		markerPositive: s.data.investigations.positiveCardiacMarker === 'yes',
		flagCount: g.flaggedIssues.length
	};
});
