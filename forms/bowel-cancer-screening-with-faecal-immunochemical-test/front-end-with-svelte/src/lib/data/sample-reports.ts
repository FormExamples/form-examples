import type { AssessmentData, ManagementAction, ResultClass } from '#lib/engine/types.js';
import { gradeFit } from '#lib/engine/bowel-fit-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	participantName: string;
	reviewedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	participantIdentifier: string;
	participantName: string;
	reviewedDate: string;
	screeningHub: string;
	faecalHb: number | null;
	resultClass: ResultClass;
	managementAction: ManagementAction;
	symptomaticPathway: boolean;
	flagCount: number;
}

/** Negative — faecal haemoglobin below the programme threshold. */
function negativeCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Screening admin R. Patel',
		clinicianRole: 'screening-administrator',
		reviewedAt: '2026-06-24T09:15',
		screeningHub: 'Northern Hub'
	};
	d.identification = {
		participantIdentifier: 'BCSP-100482',
		nhsNumber: '943 476 5919',
		participantAge: 60,
		sex: 'female'
	};
	d.eligibility = {
		withinAgeRange: 'eligible',
		recallInterval: 'two-yearly',
		invitationDate: '2026-06-01',
		previousOutcome: 'prior-negative'
	};
	d.kit = { kitReturned: 'yes', returnDate: '2026-06-12', sampleAdequacy: 'adequate', spoiltReason: '' };
	d.result = { faecalHaemoglobinUgG: 18, assay: 'OC-Sensor io', thresholdApplied: 120 };
	d.symptoms.redFlagSymptoms = 'no';
	d.note.clinicalNote = 'Below threshold; routine two-yearly recall.';
	return d;
}

/** Positive — faecal haemoglobin at or above the programme threshold. */
function positiveCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'SSP N. Okafor',
		clinicianRole: 'ssp',
		reviewedAt: '2026-06-25T11:40',
		screeningHub: 'Southern Hub'
	};
	d.identification = {
		participantIdentifier: 'BCSP-573110',
		nhsNumber: '625 794 1123',
		participantAge: 67,
		sex: 'male'
	};
	d.eligibility = {
		withinAgeRange: 'eligible',
		recallInterval: 'two-yearly',
		invitationDate: '2026-06-02',
		previousOutcome: 'first-invitation'
	};
	d.kit = { kitReturned: 'yes', returnDate: '2026-06-15', sampleAdequacy: 'adequate', spoiltReason: '' };
	d.result = { faecalHaemoglobinUgG: 240, assay: 'OC-Sensor io', thresholdApplied: 120 };
	d.symptoms.redFlagSymptoms = 'no';
	d.note.clinicalNote = 'Positive screen; refer for screening colonoscopy.';
	return d;
}

/** Spoilt — sample not adequate; repeat kit required. */
function spoiltCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Screening practitioner L. Grant',
		clinicianRole: 'screening-practitioner',
		reviewedAt: '2026-06-26T16:05',
		screeningHub: 'Eastern Hub'
	};
	d.identification = {
		participantIdentifier: 'BCSP-100517',
		nhsNumber: '401 023 2137',
		participantAge: 71,
		sex: 'female'
	};
	d.eligibility = {
		withinAgeRange: 'eligible',
		recallInterval: 'two-yearly',
		invitationDate: '2026-06-03',
		previousOutcome: 'prior-negative'
	};
	d.kit = { kitReturned: 'yes', returnDate: '2026-06-18', sampleAdequacy: 'spoilt', spoiltReason: 'leaked' };
	d.result = { faecalHaemoglobinUgG: null, assay: 'OC-Sensor io', thresholdApplied: 120 };
	d.symptoms.redFlagSymptoms = 'no';
	d.note.clinicalNote = 'Sample leaked in transit; reissue kit.';
	return d;
}

/** Symptomatic — negative FIT but red-flag symptoms drive the urgent pathway. */
function symptomaticCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-26T22:20',
		screeningHub: 'Western Hub'
	};
	d.identification = {
		participantIdentifier: 'BCSP-100628',
		nhsNumber: '772 118 4490',
		participantAge: 69,
		sex: 'male'
	};
	d.eligibility = {
		withinAgeRange: 'eligible',
		recallInterval: 'two-yearly',
		invitationDate: '2026-06-04',
		previousOutcome: 'unknown'
	};
	d.kit = { kitReturned: 'yes', returnDate: '2026-06-19', sampleAdequacy: 'adequate', spoiltReason: '' };
	d.result = { faecalHaemoglobinUgG: 35, assay: 'OC-Sensor io', thresholdApplied: 120 };
	d.symptoms.redFlagSymptoms = 'yes';
	d.note.clinicalNote =
		'Negative screen but reports rectal bleeding and weight loss; urgent suspected-cancer referral.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FIT-2026-0001', participantName: 'Osei, Grace', reviewedDate: '2026-06-24', data: negativeCase() },
	{ id: 'FIT-2026-0002', participantName: 'Mensah, Kwame', reviewedDate: '2026-06-25', data: positiveCase() },
	{ id: 'FIT-2026-0003', participantName: 'Nowak, Zofia', reviewedDate: '2026-06-26', data: spoiltCase() },
	{ id: 'FIT-2026-0004', participantName: 'Ahmed, Bilal', reviewedDate: '2026-06-26', data: symptomaticCase() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeFit(s.data);
	return {
		id: s.id,
		participantIdentifier: s.data.identification.participantIdentifier,
		participantName: s.participantName,
		reviewedDate: s.reviewedDate,
		screeningHub: s.data.context.screeningHub,
		faecalHb: s.data.result.faecalHaemoglobinUgG,
		resultClass: g.resultClass,
		managementAction: g.managementAction,
		symptomaticPathway: g.symptomaticPathway,
		flagCount: g.flaggedIssues.length
	};
});
