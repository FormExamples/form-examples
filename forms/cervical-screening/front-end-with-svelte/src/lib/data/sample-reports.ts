import type { AssessmentData, CareSetting, ManagementAction, ResultClass } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/cervical-screening-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample screening: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	screenedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	careSetting: CareSetting;
	resultClass: ResultClass;
	managementAction: ManagementAction;
	urgentFlag: boolean;
	flagCount: number;
	screenedDate: string;
}

/** hrHPV negative — routine recall (a 32-year-old, adequate sample). */
function hpvNegative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		sampleTakerName: 'A. Okoro',
		sampleTakerRole: 'practice-nurse',
		careSetting: 'general-practice',
		sampleTakenAt: '2026-06-22T09:30'
	};
	d.identification = {
		patientIdentifier: 'GP-448120',
		nhsNumber: '943 476 5919',
		age: 32,
		dateOfBirth: '1994-03-11'
	};
	d.eligibility = {
		recallInterval: 'three-yearly',
		screenDueDate: '2026-06-01',
		lastScreenDate: '2023-06-01',
		overdue: 'no',
		previouslyCeased: 'no'
	};
	d.consent.consentGiven = 'yes';
	d.symptoms = { symptomatic: 'no', symptomDetail: '' };
	d.adequacy.sampleAdequacy = 'adequate';
	d.hpv.hpvResult = 'negative';
	d.note.clinicalContext = 'Routine screen; hrHPV not detected. Return to 3-yearly recall.';
	return d;
}

/** hrHPV positive, cytology normal — early repeat at 12 months. */
function hpvPositiveNormal(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		sampleTakerName: 'J. Reid',
		sampleTakerRole: 'gp',
		careSetting: 'general-practice',
		sampleTakenAt: '2026-06-23T11:15'
	};
	d.identification = {
		patientIdentifier: 'GP-448377',
		nhsNumber: '573 110 8842',
		age: 45,
		dateOfBirth: '1981-02-19'
	};
	d.eligibility = {
		recallInterval: 'three-yearly',
		screenDueDate: '2026-05-15',
		lastScreenDate: '2023-05-15',
		overdue: 'no',
		previouslyCeased: 'no'
	};
	d.consent.consentGiven = 'yes';
	d.symptoms = { symptomatic: 'no', symptomDetail: '' };
	d.adequacy.sampleAdequacy = 'adequate';
	d.hpv.hpvResult = 'positive';
	d.cytology.cytologyGrade = 'negative';
	d.note.clinicalContext = 'hrHPV detected, reflex cytology negative. Early repeat HPV in 12 months.';
	return d;
}

/** hrHPV positive, high-grade cytology — urgent colposcopy (and symptomatic). */
function hpvPositiveHighGrade(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		sampleTakerName: 'Dr M. Silva',
		sampleTakerRole: 'gp',
		careSetting: 'general-practice',
		sampleTakenAt: '2026-06-25T14:40'
	};
	d.identification = {
		patientIdentifier: 'GP-448512',
		nhsNumber: '221 908 4471',
		age: 38,
		dateOfBirth: '1988-09-02'
	};
	d.eligibility = {
		recallInterval: 'three-yearly',
		screenDueDate: '2026-06-10',
		lastScreenDate: '2023-06-10',
		overdue: 'no',
		previouslyCeased: 'no'
	};
	d.consent.consentGiven = 'yes';
	d.symptoms = {
		symptomatic: 'yes',
		symptomDetail: 'Postcoital bleeding for six weeks.'
	};
	d.adequacy.sampleAdequacy = 'adequate';
	d.hpv.hpvResult = 'positive';
	d.cytology.cytologyGrade = 'high-grade';
	d.note.clinicalContext =
		'hrHPV positive with high-grade dyskaryosis and symptoms. Urgent colposcopy referral raised.';
	return d;
}

/** Inadequate sample — repeat in ~3 months (a sexual-health setting). */
function inadequateSample(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		sampleTakerName: 'B. Byrne',
		sampleTakerRole: 'smear-taker',
		careSetting: 'sexual-health',
		sampleTakenAt: '2026-06-26T16:05'
	};
	d.identification = {
		patientIdentifier: 'SH-100639',
		nhsNumber: '880 204 3312',
		age: 29,
		dateOfBirth: '1997-01-30'
	};
	d.eligibility = {
		recallInterval: 'three-yearly',
		screenDueDate: '2026-04-01',
		lastScreenDate: '2023-04-01',
		overdue: 'yes',
		previouslyCeased: 'no'
	};
	d.consent.consentGiven = 'yes';
	d.symptoms = { symptomatic: 'no', symptomDetail: '' };
	d.adequacy = { sampleAdequacy: 'inadequate', inadequateReason: 'insufficient-cells' };
	d.hpv.hpvResult = 'not-tested';
	d.note.clinicalContext = 'Insufficient cells; sample not testable. Repeat in ~3 months.';
	return d;
}

/** The sample screenings, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'CS-2026-0001',
		patientName: 'Okoro, Amara',
		screenedDate: '2026-06-22',
		data: hpvNegative()
	},
	{
		id: 'CS-2026-0002',
		patientName: 'Nowak, Zofia',
		screenedDate: '2026-06-23',
		data: hpvPositiveNormal()
	},
	{
		id: 'CS-2026-0003',
		patientName: 'Silva, Marta',
		screenedDate: '2026-06-25',
		data: hpvPositiveHighGrade()
	},
	{
		id: 'CS-2026-0004',
		patientName: 'Byrne, Aoife',
		screenedDate: '2026-06-26',
		data: inadequateSample()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		resultClass: g.resultClass,
		managementAction: g.managementAction,
		urgentFlag: g.flaggedIssues.some((f) => f.id === 'F-URGENT-COLPOSCOPY-001'),
		flagCount: g.flaggedIssues.length,
		screenedDate: s.screenedDate
	};
});
