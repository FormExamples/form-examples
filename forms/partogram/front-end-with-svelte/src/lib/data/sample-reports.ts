import type {
	AssessmentData,
	CareSetting,
	Parity,
	ProgressClassification
} from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/partogram-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	activePhaseStartAt: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	careSetting: CareSetting;
	parity: Parity;
	latestDilatationCm: number | null;
	elapsedHours: number | null;
	progressClassification: ProgressClassification;
	observationCount: number;
	flagCount: number;
	activePhaseStartAt: string;
}

/**
 * Sample 1 — a nulliparous labour on a labour ward progressing normally on /
 * ahead of the alert line. Latest dilatation 8 cm at t = 3 h (alert = 7).
 */
function normalLabour(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife A. Chen',
		clinicianRole: 'midwife',
		careSetting: 'labour-ward',
		activePhaseStartAt: '2026-06-22T06:00'
	};
	d.patient = {
		patientIdentifier: 'LW-4B-12',
		ageBand: '25-34',
		parity: 'nulliparous',
		gestationWeeks: 40
	};
	d.admission = {
		membranesOnAdmission: 'intact',
		riskFactors: 'None',
		plannedCare: 'Continuous midwifery support; review at each vaginal examination.'
	};
	d.observations = [
		{
			observedAt: '2026-06-22T06:00',
			cervicalDilatationCm: 4,
			descentFifths: 4,
			contractionsPer10Min: 3,
			contractionDurationBand: '20-40s',
			contractionStrength: 'moderate',
			fetalHeartRate: 140,
			liquorState: 'intact',
			moulding: '0',
			systolicBloodPressure: 118,
			diastolicBloodPressure: 74,
			pulse: 82,
			temperature: 36.6,
			urineVolumeMl: 250,
			urineProtein: 'negative',
			urineKetones: 'negative',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: 'Hartmann 500 mL'
		},
		{
			observedAt: '2026-06-22T08:00',
			cervicalDilatationCm: 6,
			descentFifths: 3,
			contractionsPer10Min: 4,
			contractionDurationBand: '20-40s',
			contractionStrength: 'strong',
			fetalHeartRate: 138,
			liquorState: 'clear',
			moulding: '0',
			systolicBloodPressure: 116,
			diastolicBloodPressure: 72,
			pulse: 86,
			temperature: 36.7,
			urineVolumeMl: null,
			urineProtein: 'negative',
			urineKetones: 'trace',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		},
		{
			observedAt: '2026-06-22T09:00',
			cervicalDilatationCm: 8,
			descentFifths: 2,
			contractionsPer10Min: 4,
			contractionDurationBand: '>40s',
			contractionStrength: 'strong',
			fetalHeartRate: 142,
			liquorState: 'clear',
			moulding: '+',
			systolicBloodPressure: 120,
			diastolicBloodPressure: 76,
			pulse: 88,
			temperature: 36.8,
			urineVolumeMl: 150,
			urineProtein: 'negative',
			urineKetones: 'trace',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		}
	];
	return d;
}

/**
 * Sample 2 — a multiparous labour in a birth centre that has slowed between the
 * alert and action lines. Latest dilatation 6 cm at t = 3.5 h (alert = 7.5,
 * action = 3.5): alert-line crossed, plus a ketonuria flag.
 */
function alertLineLabour(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife R. Osei',
		clinicianRole: 'midwife',
		careSetting: 'birth-centre',
		activePhaseStartAt: '2026-06-23T06:00'
	};
	d.patient = {
		patientIdentifier: 'BC-201',
		ageBand: '18-24',
		parity: 'multiparous',
		gestationWeeks: 39
	};
	d.admission = {
		membranesOnAdmission: 'ruptured',
		riskFactors: 'Previous rapid labour',
		plannedCare: 'Reassess in one hour; consider amniotomy if progress remains slow.'
	};
	d.observations = [
		{
			observedAt: '2026-06-23T06:00',
			cervicalDilatationCm: 4,
			descentFifths: 3,
			contractionsPer10Min: 3,
			contractionDurationBand: '20-40s',
			contractionStrength: 'moderate',
			fetalHeartRate: 145,
			liquorState: 'clear',
			moulding: '0',
			systolicBloodPressure: 124,
			diastolicBloodPressure: 78,
			pulse: 90,
			temperature: 36.9,
			urineVolumeMl: 200,
			urineProtein: 'negative',
			urineKetones: 'trace',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		},
		{
			observedAt: '2026-06-23T09:30',
			cervicalDilatationCm: 6,
			descentFifths: 2,
			contractionsPer10Min: 3,
			contractionDurationBand: '20-40s',
			contractionStrength: 'moderate',
			fetalHeartRate: 148,
			liquorState: 'clear',
			moulding: '+',
			systolicBloodPressure: 126,
			diastolicBloodPressure: 80,
			pulse: 96,
			temperature: 37.0,
			urineVolumeMl: null,
			urineProtein: 'negative',
			urineKetones: '+',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		}
	];
	return d;
}

/**
 * Sample 3 — a nulliparous labour on a labour ward with obstructed progress on /
 * right of the action line, plus meconium-stained liquor and an abnormal fetal
 * heart rate. Latest dilatation 5 cm at t = 6 h (action = 6): action-line
 * crossed with multiple high-priority flags.
 */
function actionLineLabour(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Fernandes',
		clinicianRole: 'obstetrician',
		careSetting: 'labour-ward',
		activePhaseStartAt: '2026-06-24T00:00'
	};
	d.patient = {
		patientIdentifier: 'LW-07',
		ageBand: '35-39',
		parity: 'nulliparous',
		gestationWeeks: 41
	};
	d.admission = {
		membranesOnAdmission: 'ruptured',
		riskFactors: 'Post-dates; large-for-dates on palpation',
		plannedCare: 'Obstetric review; assess for obstructed labour and mode of delivery.'
	};
	d.observations = [
		{
			observedAt: '2026-06-24T00:00',
			cervicalDilatationCm: 4,
			descentFifths: 4,
			contractionsPer10Min: 3,
			contractionDurationBand: '20-40s',
			contractionStrength: 'moderate',
			fetalHeartRate: 150,
			liquorState: 'clear',
			moulding: '0',
			systolicBloodPressure: 128,
			diastolicBloodPressure: 82,
			pulse: 98,
			temperature: 37.0,
			urineVolumeMl: 180,
			urineProtein: 'trace',
			urineKetones: 'trace',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		},
		{
			observedAt: '2026-06-24T03:00',
			cervicalDilatationCm: 5,
			descentFifths: 4,
			contractionsPer10Min: 4,
			contractionDurationBand: '>40s',
			contractionStrength: 'strong',
			fetalHeartRate: 165,
			liquorState: 'meconium',
			moulding: '++',
			systolicBloodPressure: 134,
			diastolicBloodPressure: 86,
			pulse: 108,
			temperature: 37.2,
			urineVolumeMl: null,
			urineProtein: 'trace',
			urineKetones: '+',
			urineGlucose: 'negative',
			oxytocinRate: 12,
			drugsAndFluids: 'Oxytocin augmentation commenced'
		},
		{
			observedAt: '2026-06-24T06:00',
			cervicalDilatationCm: 5,
			descentFifths: 4,
			contractionsPer10Min: 5,
			contractionDurationBand: '>40s',
			contractionStrength: 'strong',
			fetalHeartRate: 168,
			liquorState: 'meconium',
			moulding: '+++',
			systolicBloodPressure: 138,
			diastolicBloodPressure: 88,
			pulse: 112,
			temperature: 37.3,
			urineVolumeMl: 90,
			urineProtein: 'trace',
			urineKetones: '++',
			urineGlucose: 'negative',
			oxytocinRate: 24,
			drugsAndFluids: 'Oxytocin 24 mU/min'
		}
	];
	return d;
}

/**
 * Sample 4 — a multiparous labour progressing well to full dilatation. Latest
 * dilatation 10 cm at t = 5.5 h (alert = 9.5): normal, no flags.
 */
function fullDilatationLabour(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife S. Patel',
		clinicianRole: 'midwife',
		careSetting: 'birth-centre',
		activePhaseStartAt: '2026-06-27T02:00'
	};
	d.patient = {
		patientIdentifier: 'BC-11',
		ageBand: '25-34',
		parity: 'multiparous',
		gestationWeeks: 40
	};
	d.admission = {
		membranesOnAdmission: 'intact',
		riskFactors: 'None',
		plannedCare: 'Prepare for second stage; continuous support.'
	};
	d.observations = [
		{
			observedAt: '2026-06-27T02:00',
			cervicalDilatationCm: 4,
			descentFifths: 3,
			contractionsPer10Min: 3,
			contractionDurationBand: '20-40s',
			contractionStrength: 'moderate',
			fetalHeartRate: 136,
			liquorState: 'intact',
			moulding: '0',
			systolicBloodPressure: 114,
			diastolicBloodPressure: 70,
			pulse: 78,
			temperature: 36.5,
			urineVolumeMl: 220,
			urineProtein: 'negative',
			urineKetones: 'negative',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		},
		{
			observedAt: '2026-06-27T05:00',
			cervicalDilatationCm: 8,
			descentFifths: 1,
			contractionsPer10Min: 4,
			contractionDurationBand: '>40s',
			contractionStrength: 'strong',
			fetalHeartRate: 140,
			liquorState: 'clear',
			moulding: '0',
			systolicBloodPressure: 116,
			diastolicBloodPressure: 72,
			pulse: 84,
			temperature: 36.7,
			urineVolumeMl: null,
			urineProtein: 'negative',
			urineKetones: 'negative',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		},
		{
			observedAt: '2026-06-27T07:30',
			cervicalDilatationCm: 10,
			descentFifths: 0,
			contractionsPer10Min: 5,
			contractionDurationBand: '>40s',
			contractionStrength: 'strong',
			fetalHeartRate: 144,
			liquorState: 'clear',
			moulding: '+',
			systolicBloodPressure: 118,
			diastolicBloodPressure: 74,
			pulse: 88,
			temperature: 36.8,
			urineVolumeMl: 120,
			urineProtein: 'negative',
			urineKetones: 'negative',
			urineGlucose: 'negative',
			oxytocinRate: null,
			drugsAndFluids: ''
		}
	];
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'PG-2026-0001',
		patientName: 'Okafor, Beatrice',
		activePhaseStartAt: '2026-06-22T06:00',
		data: normalLabour()
	},
	{
		id: 'PG-2026-0002',
		patientName: 'Whitfield, Harriet',
		activePhaseStartAt: '2026-06-23T06:00',
		data: alertLineLabour()
	},
	{
		id: 'PG-2026-0003',
		patientName: 'Nowak, Irena',
		activePhaseStartAt: '2026-06-24T00:00',
		data: actionLineLabour()
	},
	{
		id: 'PG-2026-0004',
		patientName: 'Silva, Rita',
		activePhaseStartAt: '2026-06-27T02:00',
		data: fullDilatationLabour()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.patient.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		parity: s.data.patient.parity,
		latestDilatationCm: g.latestDilatationCm,
		elapsedHours: g.elapsedHours,
		progressClassification: g.progressClassification,
		observationCount: s.data.observations.length,
		flagCount: g.flaggedIssues.length,
		activePhaseStartAt: s.activePhaseStartAt
	};
});
