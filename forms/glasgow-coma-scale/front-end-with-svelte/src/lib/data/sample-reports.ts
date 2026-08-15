import type { AssessmentData, Setting, SeverityBand } from '#lib/engine/types.js';
import { calculateGcsGrade } from '#lib/engine/gcs-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	patientIdentifier: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	setting: Setting;
	totalDisplay: string;
	totalScore: number | null;
	severityBand: SeverityBand;
	gcsP: number | null;
	airwayFlag: boolean;
	flagCount: number;
}

/** Mild — fully testable E4 V5 M6 = 15, both pupils reactive. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr A. Osei',
		assessorRole: 'doctor',
		assessedAt: '2026-06-24T08:15',
		setting: 'ed',
		reason: 'Minor head injury — routine neuro-observation'
	};
	d.eye.eyeResponse = 'spontaneous';
	d.verbal.verbalResponse = 'orientated';
	d.motor.motorResponse = 'obeys-commands';
	d.pupils.leftPupilReactivity = 'reactive';
	d.pupils.rightPupilReactivity = 'reactive';
	d.pupils.leftPupilSizeMm = 3;
	d.pupils.rightPupilSizeMm = 3;
	d.note.clinicalNote = 'Alert and orientated; continue hourly observations.';
	return d;
}

/** Moderate — E3 V4 M4 = 11. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Nurse I. Mackenzie',
		assessorRole: 'neuro-observation-staff',
		assessedAt: '2026-06-25T14:40',
		setting: 'neuro',
		reason: 'Subdural haematoma — post-admission monitoring'
	};
	d.eye.eyeResponse = 'to-sound';
	d.verbal.verbalResponse = 'confused';
	d.motor.motorResponse = 'normal-flexion';
	d.pupils.leftPupilReactivity = 'reactive';
	d.pupils.rightPupilReactivity = 'reactive';
	d.trend.previousTotal = 12;
	d.trend.previousMotorScore = 5;
	d.trend.previousAssessedAt = '2026-06-25T12:40';
	d.note.clinicalNote = 'Motor response fell from localising to normal flexion; escalated.';
	return d;
}

/** Severe — E2 V2 M2 = 6, one unreactive pupil; coma + airway risk. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr Z. Nowak',
		assessorRole: 'doctor',
		assessedAt: '2026-06-26T03:20',
		setting: 'critical-care',
		reason: 'Traumatic brain injury — critical care'
	};
	d.confounders.sedated = 'no';
	d.eye.eyeResponse = 'to-pressure';
	d.verbal.verbalResponse = 'sounds';
	d.motor.motorResponse = 'extension';
	d.pupils.leftPupilReactivity = 'reactive';
	d.pupils.rightPupilReactivity = 'unreactive';
	d.pupils.leftPupilSizeMm = 3;
	d.pupils.rightPupilSizeMm = 6;
	d.trend.previousTotal = 9;
	d.trend.previousMotorScore = 4;
	d.trend.previousAssessedAt = '2026-06-26T01:20';
	d.note.clinicalNote = 'Deteriorating; unequal pupils. Urgent CT and neurosurgical referral.';
	return d;
}

/** Intubated verbal-NT — total undefined, reported "8T". */
function intubatedNt(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr R. Fletcher',
		assessorRole: 'advanced-clinical-practitioner',
		assessedAt: '2026-06-27T06:05',
		setting: 'critical-care',
		reason: 'Post-arrest, intubated and ventilated'
	};
	d.confounders.intubated = 'yes';
	d.confounders.sedated = 'yes';
	d.eye.eyeResponse = 'to-sound'; // 3
	d.verbal.verbalResponse = 'NT';
	d.verbal.verbalNotTestableReason = 'Intubated — verbal response cannot be assessed';
	d.motor.motorResponse = 'localising'; // 5 → 8T
	d.pupils.leftPupilReactivity = 'reactive';
	d.pupils.rightPupilReactivity = 'reactive';
	d.note.clinicalNote = 'Verbal not testable (intubated); reported as 8T.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'GCS-2026-0001',
		patientName: 'Osei, Grace',
		patientIdentifier: 'ED-100482',
		assessedDate: '2026-06-24',
		data: mild()
	},
	{
		id: 'GCS-2026-0002',
		patientName: 'Mackenzie, Ian',
		patientIdentifier: 'NR-573110',
		assessedDate: '2026-06-25',
		data: moderate()
	},
	{
		id: 'GCS-2026-0003',
		patientName: 'Nowak, Zofia',
		patientIdentifier: 'CC-100517',
		assessedDate: '2026-06-26',
		data: severe()
	},
	{
		id: 'GCS-2026-0004',
		patientName: 'Fletcher, Rosemary',
		patientIdentifier: 'CC-573642',
		assessedDate: '2026-06-27',
		data: intubatedNt()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGcsGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		setting: s.data.context.setting,
		totalDisplay: g.totalDisplay || '—',
		totalScore: g.totalScore,
		severityBand: g.severityBand,
		gcsP: g.gcsP,
		airwayFlag: g.flaggedIssues.some((f) => f.id === 'F-AIRWAY-RISK-001'),
		flagCount: g.flaggedIssues.length
	};
});
