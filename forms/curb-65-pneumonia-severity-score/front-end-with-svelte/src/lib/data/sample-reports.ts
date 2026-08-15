import type { AssessmentData, CareSetting, RiskBand, ScoreVariant } from '#lib/engine/types.js';
import { calculateCurb65Grade } from '#lib/engine/curb65-grader.js';
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
	totalScore: number;
	scoreVariant: ScoreVariant;
	riskBand: RiskBand;
	admitFlag: boolean;
	flagCount: number;
}

/** Score 0 — fully-negative CURB-65 screen (low risk). */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'physician',
		assessedAt: '2026-06-24T08:15',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-204817', sex: 'female' };
	d.confusion = { confusionPresent: 'no', amtScore: 10 };
	d.urea = { ureaMeasured: 'yes', ureaMmolL: 4.8 };
	d.respiratory.respiratoryRate = 18;
	d.bloodPressure = { systolicBp: 128, diastolicBp: 78 };
	d.age.ageYears = 44;
	d.disposition.clinicalNote = 'Stable; suitable for outpatient management.';
	return d;
}

/** CRB-65 fallback — single criterion (age), intermediate risk in primary care. */
function crb65Intermediate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'general-practitioner',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'primary-care'
	};
	d.identification = { patientIdentifier: 'GP-118322', sex: 'male' };
	d.confusion = { confusionPresent: 'no', amtScore: 9 };
	d.urea = { ureaMeasured: 'no', ureaMmolL: null };
	d.respiratory.respiratoryRate = 22;
	d.bloodPressure = { systolicBp: 132, diastolicBp: 82 };
	d.age.ageYears = 71;
	d.disposition.clinicalNote = 'Urea unavailable in the community; CRB-65 pathway.';
	return d;
}

/** Score 3 — three criteria positive, high risk; admit. */
function score3(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'physician',
		assessedAt: '2026-06-26T22:05',
		careSetting: 'acute-medical-unit'
	};
	d.identification = { patientIdentifier: 'AMU-573110', sex: 'female' };
	d.confusion = { confusionPresent: 'yes', amtScore: 7 };
	d.urea = { ureaMeasured: 'yes', ureaMmolL: 9.4 };
	d.respiratory.respiratoryRate = 26;
	d.bloodPressure = { systolicBp: 112, diastolicBp: 70 };
	d.age.ageYears = 68;
	d.adjuncts.oxygenSaturation = 93;
	d.disposition.clinicalNote = 'Confusion and raised urea; admit for inpatient care.';
	return d;
}

/** Score 5 — every CURB-65 criterion positive, high risk; ICU review. */
function score5(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Fletcher',
		clinicianRole: 'physician',
		assessedAt: '2026-06-27T03:20',
		careSetting: 'ward'
	};
	d.identification = { patientIdentifier: 'WD-880204', sex: 'male' };
	d.confusion = { confusionPresent: 'yes', amtScore: 5 };
	d.urea = { ureaMeasured: 'yes', ureaMmolL: 14.2 };
	d.respiratory.respiratoryRate = 34;
	d.bloodPressure = { systolicBp: 84, diastolicBp: 54 };
	d.age.ageYears = 82;
	d.adjuncts = {
		oxygenSaturation: 88,
		temperatureC: 38.9,
		significantComorbidity: 'yes',
		multilobarChanges: 'yes'
	};
	d.disposition.clinicalNote = 'Severe CAP; escalate for critical-care review.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CURB-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: score0() },
	{
		id: 'CURB-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: crb65Intermediate()
	},
	{ id: 'CURB-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: score3() },
	{
		id: 'CURB-2026-0004',
		patientName: 'Fletcher, Rosemary',
		assessedDate: '2026-06-27',
		data: score5()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCurb65Grade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		totalScore: g.totalScore,
		scoreVariant: g.scoreVariant,
		riskBand: g.riskBand,
		admitFlag: g.totalScore >= 3,
		flagCount: g.flaggedIssues.length
	};
});
