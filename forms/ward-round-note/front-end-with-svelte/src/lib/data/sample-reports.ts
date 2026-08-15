import type { AssessmentData, CompletenessStatus } from '#lib/engine/types.js';
import { calculateWardRoundGrade } from '#lib/engine/ward-round-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample note: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	reviewedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	ward: string;
	status: CompletenessStatus;
	completenessPercent: number;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/** Complete — a fully-documented daily review; all eight required components documented. */
function completeNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.header = {
		clinicianName: 'Dr A. Okafor',
		clinicianGrade: 'specialty-registrar',
		reviewedAt: '2026-06-22T09:20',
		ward: 'Ward 12B, Acute Medical Unit'
	};
	d.identification = {
		patientIdentifier: 'MRN-204815',
		admissionDate: '2026-06-19',
		primaryDiagnosis: 'Community-acquired pneumonia.'
	};
	d.overnight = {
		overnightEvents: 'Settled overnight. One episode of mild chest discomfort at 03:00, ECG unchanged.',
		noOvernightEvents: ''
	};
	d.problems = {
		problemList:
			'1. Community-acquired pneumonia — improving, CRP falling. 2. AKI stage 1 — resolving with fluids.'
	};
	d.examination = {
		examinationSummary: 'Comfortable at rest, chest clearing, no peripheral oedema.',
		news2Total: 2,
		news2SingleParamThree: 'no',
		observationTrend: 'improving'
	};
	d.investigations = {
		investigationsReviewed: 'CRP 84 (down from 120), Hb 118, U&Es normal. CXR: improving consolidation.',
		noInvestigationsOutstanding: 'yes',
		abnormalResultFlagged: 'no',
		abnormalResultActioned: ''
	};
	d.vte = { vteStatus: 'assessed', vteProphylaxisInPlace: 'yes' };
	d.medication = {
		medicationChanges: 'Switched IV to oral antibiotics. Stopped regular NSAID given AKI.',
		noMedicationChanges: ''
	};
	d.plan = {
		planAndJobs:
			'Continue oral antibiotics. Repeat U&Es tomorrow. Chase micro. Physio review. Aim discharge in 2 days.'
	};
	d.escalation = {
		escalationStatus: 'for-full-escalation',
		seniorReviewPresent: 'yes',
		estimatedDischargeDate: '2026-06-24',
		dischargeNotEstimable: ''
	};
	d.summary = { clinicalNote: 'Progressing well; step-down to oral therapy, discharge planning underway.' };
	return d;
}

/** Partial — header and plan documented, ≥ 4 required, but VTE and escalation not recorded. */
function partialNote(): AssessmentData {
	const d = createDefaultAssessment();
	d.header = {
		clinicianName: 'Dr P. Nowak',
		clinicianGrade: 'core-trainee',
		reviewedAt: '2026-06-24T08:40',
		ward: 'Ward 7, Surgery'
	};
	d.identification = {
		patientIdentifier: 'MRN-330149',
		admissionDate: '2026-06-21',
		primaryDiagnosis: 'Day 3 post hemiarthroplasty.'
	};
	d.overnight = { overnightEvents: '', noOvernightEvents: 'yes' };
	d.problems = {
		problemList: '1. Post-operative recovery — progressing. 2. Type 2 diabetes — stable.'
	};
	d.examination = {
		examinationSummary: 'Wound clean and dry, mobilising with physio.',
		news2Total: 1,
		news2SingleParamThree: 'no',
		observationTrend: 'stable'
	};
	d.investigations = {
		investigationsReviewed: '',
		noInvestigationsOutstanding: '', // investigations component NOT documented
		abnormalResultFlagged: '',
		abnormalResultActioned: ''
	};
	d.vte = { vteStatus: '', vteProphylaxisInPlace: '' }; // VTE component NOT documented
	d.medication = { medicationChanges: 'Continue analgesia; reduce opioid dose.', noMedicationChanges: '' };
	d.plan = { planAndJobs: 'Continue physio. Redress wound tomorrow. Diabetes team review.' };
	d.escalation = {
		escalationStatus: '', // escalation component NOT documented
		seniorReviewPresent: '',
		estimatedDischargeDate: '',
		dischargeNotEstimable: 'yes'
	};
	d.summary = { clinicalNote: 'Routine post-operative review; several components still outstanding.' };
	return d;
}

/** Incomplete — deteriorating NEWS2 but no plan and no escalation action documented. */
function incompleteDeteriorating(): AssessmentData {
	const d = createDefaultAssessment();
	d.header = {
		clinicianName: 'Dr S. Abadi',
		clinicianGrade: 'fy2',
		reviewedAt: '2026-06-27T22:10',
		ward: 'Ward 3, Respiratory'
	};
	d.identification = {
		patientIdentifier: 'MRN-771488',
		admissionDate: '2026-06-26',
		primaryDiagnosis: 'Infective exacerbation of COPD.'
	};
	d.overnight = { overnightEvents: 'Increasing oxygen requirement overnight.', noOvernightEvents: '' };
	d.problems = { problemList: 'Exacerbation of COPD — worsening.' };
	d.examination = {
		examinationSummary: 'Increased work of breathing, widespread wheeze.',
		news2Total: 7,
		news2SingleParamThree: 'yes',
		observationTrend: 'deteriorating'
	};
	d.investigations = {
		investigationsReviewed: 'ABG: type 2 respiratory failure.',
		noInvestigationsOutstanding: '',
		abnormalResultFlagged: 'yes',
		abnormalResultActioned: 'no' // abnormal-results-not-actioned flag
	};
	d.vte = { vteStatus: 'not-done', vteProphylaxisInPlace: 'no' }; // vte-not-done flag
	d.medication = { medicationChanges: '', noMedicationChanges: '' };
	// Plan deliberately empty → no-plan-jobs + deteriorating-news2 flags; incomplete.
	d.escalation = {
		escalationStatus: 'not-recorded',
		seniorReviewPresent: 'no',
		estimatedDischargeDate: '',
		dischargeNotEstimable: ''
	};
	d.summary = { clinicalNote: 'Deteriorating; awaiting senior review, plan not yet documented.' };
	return d;
}

/** Incomplete — only the header recorded; a rushed, near-empty entry. */
function incompleteMinimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.header = {
		clinicianName: 'Dr G. Thompson',
		clinicianGrade: 'fy1',
		reviewedAt: '2026-06-26T07:50',
		ward: 'Ward 9, Gastroenterology'
	};
	d.identification = {
		patientIdentifier: 'MRN-118427',
		admissionDate: '2026-06-25',
		primaryDiagnosis: 'Acute pancreatitis.'
	};
	d.problems = { problemList: 'Acute pancreatitis — under observation.' };
	// examination, investigations, VTE, medication, plan, escalation all absent.
	d.summary = { clinicalNote: 'Brief entry; most components not completed on the round.' };
	return d;
}

/** The sample notes, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'WRN-2026-0001',
		patientName: 'Okafor, Chidi',
		reviewedDate: '2026-06-22',
		data: completeNote()
	},
	{
		id: 'WRN-2026-0002',
		patientName: 'Nowak, Piotr',
		reviewedDate: '2026-06-24',
		data: partialNote()
	},
	{
		id: 'WRN-2026-0003',
		patientName: 'Abadi, Layla',
		reviewedDate: '2026-06-27',
		data: incompleteDeteriorating()
	},
	{
		id: 'WRN-2026-0004',
		patientName: 'Thompson, Gary',
		reviewedDate: '2026-06-26',
		data: incompleteMinimal()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateWardRoundGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		ward: s.data.header.ward,
		status: g.status,
		completenessPercent: g.completenessPercent,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		reviewedDate: s.reviewedDate
	};
});
