import type { AssessmentData, Category, EligibilityRoute } from '#lib/engine/types.js';
import { classifyAaa } from '#lib/engine/aaa-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	scannedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	scannedDate: string;
	eligibilityRoute: EligibilityRoute;
	maxAorticDiameterCm: number | null;
	category: Category;
	referralFlag: boolean;
	flagCount: number;
}

/** Normal — aorta below 3.0 cm; discharge. */
function normalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'S. Okafor',
		technicianRole: 'screening-technician',
		clinicSite: 'Riverside Community Clinic',
		scannedAt: '2026-06-24T09:15',
		deviceIdentifier: 'US-RC-01'
	};
	d.identification = {
		patientIdentifier: 'AAA-100482',
		age: 65,
		sex: 'male',
		eligibilityRoute: 'routine-year-of-65',
		scanType: 'first-scan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement = {
		aortaVisualised: 'yes',
		maxAorticDiameterCm: 2.3,
		priorMaxDiameterCm: null,
		priorScanDate: ''
	};
	d.observations = { symptomatic: 'no', incidentalFindings: '' };
	d.result.resultNote = 'Aorta normal calibre; discharged from screening.';
	return d;
}

/** Small aneurysm — 3.0-4.4 cm; annual surveillance. */
function smallCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'D. Marsh',
		technicianRole: 'screening-technician',
		clinicSite: 'Harbour Health Centre',
		scannedAt: '2026-06-25T11:40',
		deviceIdentifier: 'US-HH-02'
	};
	d.identification = {
		patientIdentifier: 'AAA-573110',
		age: 66,
		sex: 'male',
		eligibilityRoute: 'routine-year-of-65',
		scanType: 'first-scan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement = {
		aortaVisualised: 'yes',
		maxAorticDiameterCm: 3.8,
		priorMaxDiameterCm: null,
		priorScanDate: ''
	};
	d.observations = { symptomatic: 'no', incidentalFindings: '' };
	d.result.resultNote = 'Small aneurysm; enrolled in annual surveillance.';
	return d;
}

/** Medium aneurysm with rapid growth — three-monthly surveillance + growth flag. */
function mediumGrowthCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'P. Nair',
		technicianRole: 'clinical-skills-trainer',
		clinicSite: 'City Vascular Screening Unit',
		scannedAt: '2026-06-26T14:05',
		deviceIdentifier: 'US-CV-03'
	};
	d.identification = {
		patientIdentifier: 'AAA-100517',
		age: 72,
		sex: 'male',
		eligibilityRoute: 'self-referral-over-65',
		scanType: 'surveillance-rescan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement = {
		aortaVisualised: 'yes',
		maxAorticDiameterCm: 4.8,
		priorMaxDiameterCm: 3.7,
		priorScanDate: '2025-06-20'
	};
	d.observations = { symptomatic: 'no', incidentalFindings: '' };
	d.result.resultNote = 'Medium aneurysm; rapid growth since last scan — expedite review.';
	return d;
}

/** Large aneurysm, symptomatic — refer to vascular surgery, emergency. */
function largeSymptomaticCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'R. Osei',
		technicianRole: 'screening-technician',
		clinicSite: 'City Vascular Screening Unit',
		scannedAt: '2026-06-26T16:20',
		deviceIdentifier: 'US-CV-03'
	};
	d.identification = {
		patientIdentifier: 'AAA-100628',
		age: 78,
		sex: 'male',
		eligibilityRoute: 'self-referral-over-65',
		scanType: 'surveillance-rescan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement = {
		aortaVisualised: 'yes',
		maxAorticDiameterCm: 5.9,
		priorMaxDiameterCm: 5.4,
		priorScanDate: '2026-03-20'
	};
	d.observations = { symptomatic: 'yes', incidentalFindings: 'Reports intermittent back pain.' };
	d.result.resultNote = 'Large symptomatic aneurysm; emergency vascular referral made.';
	return d;
}

/** Non-visualised — aorta not adequately measured; re-scan. */
function nonVisualisedCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'L. Byrne',
		technicianRole: 'screening-technician',
		clinicSite: 'Riverside Community Clinic',
		scannedAt: '2026-06-27T10:00',
		deviceIdentifier: 'US-RC-01'
	};
	d.identification = {
		patientIdentifier: 'AAA-100731',
		age: 65,
		sex: 'male',
		eligibilityRoute: 'routine-year-of-65',
		scanType: 'first-scan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement = {
		aortaVisualised: 'no',
		maxAorticDiameterCm: null,
		priorMaxDiameterCm: null,
		priorScanDate: ''
	};
	d.observations = { symptomatic: 'no', incidentalFindings: 'Excess bowel gas obscured the aorta.' };
	d.result.resultNote = 'Aorta not adequately visualised; re-scan arranged.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AAA-2026-0001', patientName: 'Okafor, Samuel', scannedDate: '2026-06-24', data: normalCase() },
	{ id: 'AAA-2026-0002', patientName: 'Marsh, David', scannedDate: '2026-06-25', data: smallCase() },
	{
		id: 'AAA-2026-0003',
		patientName: 'Nair, Prakash',
		scannedDate: '2026-06-26',
		data: mediumGrowthCase()
	},
	{
		id: 'AAA-2026-0004',
		patientName: 'Osei, Robert',
		scannedDate: '2026-06-26',
		data: largeSymptomaticCase()
	},
	{
		id: 'AAA-2026-0005',
		patientName: 'Byrne, Liam',
		scannedDate: '2026-06-27',
		data: nonVisualisedCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = classifyAaa(s.data);
	const referral = g.flaggedIssues.some(
		(f) => f.id === 'F-VASCULAR-REFERRAL-001' || f.id === 'F-SYMPTOMATIC-ANEURYSM-001'
	);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		scannedDate: s.scannedDate,
		eligibilityRoute: s.data.identification.eligibilityRoute,
		maxAorticDiameterCm: g.maxAorticDiameterCm,
		category: g.category,
		referralFlag: referral,
		flagCount: g.flaggedIssues.length
	};
});
