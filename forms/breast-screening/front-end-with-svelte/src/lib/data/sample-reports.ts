import type {
	EpisodeType,
	ImagingClassification,
	OutcomeBand,
	ReadingOutcome,
	ScreeningData,
	ScreeningOutcome
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/breast-screening-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample screening record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	reportedDate: string;
	data: ScreeningData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	screeningUnit: string;
	episodeType: EpisodeType;
	readingOutcome: ReadingOutcome;
	imagingClassification: ImagingClassification;
	screeningOutcome: ScreeningOutcome;
	outcomeBand: OutcomeBand;
	urgentFlag: boolean;
	flagCount: number;
	reportedDate: string;
}

/** Routine recall — a normal double read for an eligible 58-year-old. */
function normalRoutineRecall(): ScreeningData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'breast-radiologist',
		reportedAt: '2026-06-24T09:30',
		screeningUnit: 'City static unit',
		episodeType: 'routine-recall'
	};
	d.identification = {
		patientIdentifier: '943 476 5919',
		ageYears: 58,
		lastScreenedDate: '2023-05-14',
		higherRiskSurveillance: 'no'
	};
	d.eligibility = { symptomatic: 'no', consentGiven: 'yes' };
	d.mammogram = { viewsTaken: 'standard-four-view', imageAdequacy: 'adequate' };
	d.reading = {
		firstReadOpinion: 'normal',
		secondReadOpinion: 'normal',
		arbitrationOutcome: 'not-required',
		readingOutcome: 'normal-routine-recall'
	};
	d.note.clinicalContext = 'Normal double read; return to routine 3-yearly recall.';
	return d;
}

/** Recall to assessment clinic — recalled on reading, assessment not yet attended. */
function recallToAssessment(): ScreeningData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'S. Patel',
		clinicianRole: 'advanced-practitioner',
		reportedAt: '2026-06-25T14:10',
		screeningUnit: 'Mobile unit 3',
		episodeType: 'routine-recall'
	};
	d.identification = {
		patientIdentifier: '573 110 8842',
		ageYears: 63,
		lastScreenedDate: '2023-06-02',
		higherRiskSurveillance: 'no'
	};
	d.eligibility = { symptomatic: 'no', consentGiven: 'yes' };
	d.mammogram = { viewsTaken: 'standard-four-view', imageAdequacy: 'adequate' };
	d.reading = {
		firstReadOpinion: 'recall',
		secondReadOpinion: 'recall',
		arbitrationOutcome: 'not-required',
		readingOutcome: 'recall-for-assessment'
	};
	d.assessment.assessmentPerformed = 'no';
	d.note.clinicalContext = 'Recalled for assessment; assessment clinic to be booked.';
	return d;
}

/** Urgent breast clinic — recalled, assessed, imaging classification 5 (malignant). */
function urgentClassFive(): ScreeningData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'breast-radiologist',
		reportedAt: '2026-06-26T11:00',
		screeningUnit: 'City static unit',
		episodeType: 'routine-recall'
	};
	d.identification = {
		patientIdentifier: '221 908 4471',
		ageYears: 67,
		lastScreenedDate: '2023-05-30',
		higherRiskSurveillance: 'no'
	};
	d.eligibility = { symptomatic: 'no', consentGiven: 'yes' };
	d.mammogram = { viewsTaken: 'additional-views', imageAdequacy: 'adequate' };
	d.reading = {
		firstReadOpinion: 'recall',
		secondReadOpinion: 'recall',
		arbitrationOutcome: 'not-required',
		readingOutcome: 'recall-for-assessment'
	};
	d.assessment = {
		assessmentPerformed: 'yes',
		assessmentModalities: ['mammography', 'ultrasound', 'biopsy'],
		imagingClassification: 5
	};
	d.note.clinicalContext = 'Suspicious mass; core biopsy taken. Urgent breast-clinic / MDT referral.';
	return d;
}

/** Symptomatic-pathway referral — a breast symptom reported at screening. */
function symptomaticReferral(): ScreeningData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'J. Okonkwo',
		clinicianRole: 'mammographer',
		reportedAt: '2026-06-26T16:40',
		screeningUnit: 'Mobile unit 3',
		episodeType: 'routine-recall'
	};
	d.identification = {
		patientIdentifier: '880 204 3312',
		ageYears: 61,
		lastScreenedDate: '2023-04-18',
		higherRiskSurveillance: 'no'
	};
	d.eligibility = { symptomatic: 'yes', consentGiven: 'yes' };
	d.mammogram = { viewsTaken: 'standard-four-view', imageAdequacy: 'adequate' };
	d.reading = {
		firstReadOpinion: '',
		secondReadOpinion: '',
		arbitrationOutcome: '',
		readingOutcome: ''
	};
	d.note.clinicalContext =
		'Woman reports a new breast lump — routed to the symptomatic breast pathway, not screening.';
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'BS-2026-0001',
		patientName: 'Adeyemi, F.',
		reportedDate: '2026-06-24',
		data: normalRoutineRecall()
	},
	{
		id: 'BS-2026-0002',
		patientName: 'Rossi, M.',
		reportedDate: '2026-06-25',
		data: recallToAssessment()
	},
	{
		id: 'BS-2026-0003',
		patientName: 'Nowak, K.',
		reportedDate: '2026-06-26',
		data: urgentClassFive()
	},
	{
		id: 'BS-2026-0004',
		patientName: 'Silva, R.',
		reportedDate: '2026-06-26',
		data: symptomaticReferral()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		screeningUnit: s.data.context.screeningUnit,
		episodeType: s.data.context.episodeType,
		readingOutcome: g.readingOutcome,
		imagingClassification: g.imagingClassification,
		screeningOutcome: g.screeningOutcome,
		outcomeBand: g.outcomeBand,
		urgentFlag: g.outcomeBand === 'urgent' || g.outcomeBand === 'referral',
		flagCount: g.flaggedIssues.length,
		reportedDate: s.reportedDate
	};
});
