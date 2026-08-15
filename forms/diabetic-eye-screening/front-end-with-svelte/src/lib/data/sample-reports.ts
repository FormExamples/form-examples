import type {
	AssessmentData,
	Outcome,
	Referral,
	WorstMaculopathy,
	WorstRetinopathy
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/diabetic-eye-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	worstRetinopathy: WorstRetinopathy;
	worstMaculopathy: WorstMaculopathy;
	outcome: Outcome;
	referral: Referral;
	urgentFlag: boolean;
	flagCount: number;
	screenedDate: string;
}

/** Active proliferative R3A with maculopathy — urgent HES referral. */
function urgentProliferative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		graderName: 'A. Okoro',
		graderRole: 'ophthalmologist',
		gradedAt: '2026-06-22',
		imageCapturedAt: '2026-06-22',
		imagingMedia: 'mydriatic'
	};
	d.identification = {
		patientIdentifier: 'DESP-448120',
		ageBand: '18-64',
		diabetesType: 'type-1',
		yearsSinceDiagnosis: 21,
		previousScreenDate: '2025-06-01',
		previousScreenResult: 'referable'
	};
	d.rightEye = { retinopathy: 'R3A', maculopathy: 'M1', photocoagulation: 'yes', ungradable: 'no', visualAcuity: '6/12' };
	d.leftEye = { retinopathy: 'R2', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/9' };
	d.note.clinicalContext = 'Active proliferative disease with maculopathy right eye. Urgent ophthalmology referral raised.';
	return d;
}

/** Pre-proliferative R2 — 6-monthly digital surveillance. */
function surveillance(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		graderName: 'J. Reid',
		graderRole: 'primary-grader',
		gradedAt: '2026-06-24',
		imageCapturedAt: '2026-06-23',
		imagingMedia: 'digital-fundus'
	};
	d.identification = {
		patientIdentifier: 'DESP-100517',
		ageBand: '18-64',
		diabetesType: 'type-2',
		yearsSinceDiagnosis: 9,
		previousScreenDate: '2025-06-10',
		previousScreenResult: 'background'
	};
	d.rightEye = { retinopathy: 'R2', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/6' };
	d.leftEye = { retinopathy: 'R1', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/6' };
	d.note.clinicalContext = 'Pre-proliferative changes right eye. Place on 6-monthly digital surveillance.';
	return d;
}

/** Ungradable images, no referable disease — slit-lamp biomicroscopy. */
function ungradable(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		graderName: 'B. Byrne',
		graderRole: 'screener',
		gradedAt: '2026-06-25',
		imageCapturedAt: '2026-06-25',
		imagingMedia: 'non-mydriatic'
	};
	d.identification = {
		patientIdentifier: 'DESP-448512',
		ageBand: '65-plus',
		diabetesType: 'type-2',
		yearsSinceDiagnosis: 14,
		previousScreenDate: '2025-05-15',
		previousScreenResult: 'r0m0'
	};
	d.rightEye = { retinopathy: '', maculopathy: '', photocoagulation: 'no', ungradable: 'yes', visualAcuity: '6/18' };
	d.leftEye = { retinopathy: 'R0', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/9' };
	d.note.clinicalContext = 'Right eye images ungradable (cataract). Refer for slit-lamp biomicroscopy.';
	return d;
}

/** Both eyes R0/M0 with a low-risk prior screen — extended 24-month recall. */
function lowRiskRoutine(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		graderName: 'M. Silva',
		graderRole: 'primary-grader',
		gradedAt: '2026-06-28',
		imageCapturedAt: '2026-06-28',
		imagingMedia: 'digital-fundus'
	};
	d.identification = {
		patientIdentifier: 'DESP-100742',
		ageBand: '18-64',
		diabetesType: 'type-1',
		yearsSinceDiagnosis: 6,
		previousScreenDate: '2024-06-20',
		previousScreenResult: 'r0m0'
	};
	d.rightEye = { retinopathy: 'R0', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/6' };
	d.leftEye = { retinopathy: 'R0', maculopathy: 'M0', photocoagulation: 'no', ungradable: 'no', visualAcuity: '6/6' };
	d.note.clinicalContext = 'No retinopathy either eye; prior screen R0/M0. Eligible for extended 24-monthly recall.';
	return d;
}

/** The sample screenings, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'DES-2026-0001',
		patientName: 'Okoro, Amara',
		screenedDate: '2026-06-22',
		data: urgentProliferative()
	},
	{
		id: 'DES-2026-0002',
		patientName: 'Fletcher, Rosemary',
		screenedDate: '2026-06-24',
		data: surveillance()
	},
	{
		id: 'DES-2026-0003',
		patientName: 'Silva, Marta',
		screenedDate: '2026-06-25',
		data: ungradable()
	},
	{
		id: 'DES-2026-0004',
		patientName: 'Adeyemi, Grace',
		screenedDate: '2026-06-28',
		data: lowRiskRoutine()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		worstRetinopathy: g.worstRetinopathy,
		worstMaculopathy: g.worstMaculopathy,
		outcome: g.recallPathway,
		referral: g.referral,
		urgentFlag: g.flaggedIssues.some((f) => f.id === 'F-ACTIVE-PROLIFERATIVE-001'),
		flagCount: g.flaggedIssues.length,
		screenedDate: s.screenedDate
	};
});
