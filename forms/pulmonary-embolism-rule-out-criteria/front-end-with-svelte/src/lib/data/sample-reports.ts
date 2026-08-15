import type { AssessmentData, CareSetting, Classification, PretestProbability } from '#lib/engine/types.js';
import { calculatePercGrade } from '#lib/engine/perc-grader.js';
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
	careSetting: CareSetting;
	pretestProbability: PretestProbability;
	classification: Classification;
	applicable: boolean;
	failedCount: number;
	flagCount: number;
	assessedDate: string;
}

/** PERC-negative — low pre-test probability and all eight criteria satisfied. */
function percNegative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Fenwick',
		clinicianRole: 'physician',
		assessedAt: '2026-06-24T09:30',
		careSetting: 'emergency-department',
		presentingComplaint: 'Pleuritic chest pain, no dyspnoea; low clinical suspicion for PE.'
	};
	d.identification = { patientIdentifier: 'MRN-482201', age: 34, sex: 'male' };
	d.pretest.pretestProbability = 'low';
	d.vitals = { heartRate: 78, oxygenSaturation: 98 };
	d.criteria = {
		unilateralLegSwelling: 'no',
		haemoptysis: 'no',
		recentSurgeryOrTrauma: 'no',
		priorVenousThromboembolism: 'no',
		oestrogenUse: 'no'
	};
	d.result.clinicalNote =
		'Reassuring examination; PERC-negative, discharged with safety-netting advice.';
	return d;
}

/** PERC-positive — low pre-test but age 62 and HR 104 fail criteria 1 and 2. */
function percPositiveCriteria(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'advanced-practitioner',
		assessedAt: '2026-06-25T14:10',
		careSetting: 'emergency-department',
		presentingComplaint: 'Dyspnoea on exertion; suspicion judged low but age and tachycardia noted.'
	};
	d.identification = { patientIdentifier: 'MRN-573110', age: 62, sex: 'female' };
	d.pretest.pretestProbability = 'low';
	d.vitals = { heartRate: 104, oxygenSaturation: 97 };
	d.criteria = {
		unilateralLegSwelling: 'no',
		haemoptysis: 'no',
		recentSurgeryOrTrauma: 'no',
		priorVenousThromboembolism: 'no',
		oestrogenUse: 'no'
	};
	d.result.clinicalNote = 'PERC-positive on age and heart rate; D-dimer requested.';
	return d;
}

/** PERC-positive — pre-test probability not low, so PERC does not apply. */
function percPositiveNotApplicable(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'physician',
		assessedAt: '2026-06-26T07:45',
		careSetting: 'acute-ambulatory',
		presentingComplaint: 'Sudden pleuritic pain with recent long-haul flight; moderate suspicion.'
	};
	d.identification = { patientIdentifier: 'AMB-100517', age: 41, sex: 'female' };
	d.pretest.pretestProbability = 'not-low';
	d.vitals = { heartRate: 88, oxygenSaturation: 97 };
	d.criteria = {
		unilateralLegSwelling: 'no',
		haemoptysis: 'no',
		recentSurgeryOrTrauma: 'no',
		priorVenousThromboembolism: 'no',
		oestrogenUse: 'no'
	};
	d.result.clinicalNote =
		'Pre-test probability not low — PERC does not apply; proceeding to D-dimer and imaging.';
	return d;
}

/** PERC-positive — low pre-test but hypoxia and haemoptysis fail criteria 3 and 5. */
function percPositiveHypoxia(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'physician',
		assessedAt: '2026-06-26T21:15',
		careSetting: 'emergency-department',
		presentingComplaint: 'Cough with blood-streaked sputum and mild breathlessness.'
	};
	d.identification = { patientIdentifier: 'MRN-880204', age: 47, sex: 'male' };
	d.pretest.pretestProbability = 'low';
	d.vitals = { heartRate: 92, oxygenSaturation: 91 };
	d.criteria = {
		unilateralLegSwelling: 'no',
		haemoptysis: 'yes',
		recentSurgeryOrTrauma: 'no',
		priorVenousThromboembolism: 'no',
		oestrogenUse: 'no'
	};
	d.result.clinicalNote = 'Hypoxia and haemoptysis — PERC-positive; CTPA arranged.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PERC-2026-0001', patientName: 'Okafor, David', assessedDate: '2026-06-24', data: percNegative() },
	{
		id: 'PERC-2026-0002',
		patientName: 'Mackenzie, Isla',
		assessedDate: '2026-06-25',
		data: percPositiveCriteria()
	},
	{
		id: 'PERC-2026-0003',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-26',
		data: percPositiveNotApplicable()
	},
	{
		id: 'PERC-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: percPositiveHypoxia()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePercGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		pretestProbability: s.data.pretest.pretestProbability,
		classification: g.classification,
		applicable: g.applicable,
		failedCount: g.failedCriteria.length,
		flagCount: g.flaggedIssues.length,
		assessedDate: s.assessedDate
	};
});
