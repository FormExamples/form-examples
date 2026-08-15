import type {
	AssessmentData,
	ExaminationContext,
	OverallOutcome,
	Sex
} from '#lib/engine/types.js';
import { calculateNipeGrade } from '#lib/engine/nipe-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample examination: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	babyName: string;
	examinedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	babyIdentifier: string;
	babyName: string;
	sex: Sex;
	examinationContext: ExaminationContext;
	overallOutcome: OverallOutcome;
	completenessPercent: number;
	referralCount: number;
	flagCount: number;
	examinedDate: string;
}

/** Satisfactory — newborn boy, every key component examined and normal. */
function satisfactoryNewbornBoy(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'J. Okonkwo',
		practitionerRole: 'midwife',
		examinedAt: '2026-06-24T09:30',
		examinationContext: 'newborn-72h',
		careSetting: 'maternity-ward'
	};
	d.identification = {
		babyIdentifier: '943 476 5919',
		babyName: 'Baby Adeyemi',
		dateOfBirth: '2026-06-23',
		sex: 'male',
		gestationalAgeWeeks: 39,
		birthWeightGrams: 3420
	};
	d.riskFactors = {
		breechPresentation: 'no',
		familyHistoryHipProblems: 'no',
		antenatalConcerns: ''
	};
	d.eyes = { eyesRedReflexRight: 'present', eyesRedReflexLeft: 'present', eyesAppearance: 'normal' };
	d.heart = {
		heartMurmur: 'none',
		femoralPulsesRight: 'present',
		femoralPulsesLeft: 'present',
		centralCyanosis: 'absent',
		oxygenSaturationPreductal: 99,
		oxygenSaturationPostductal: 99
	};
	d.hips = { barlowTest: 'negative', ortolaniTest: 'negative', hipAbduction: 'normal' };
	d.testes = { testisRight: 'descended', testisLeft: 'descended' };
	d.systematic.generalAppearance = 'normal';
	d.systematic.chestAndLungs = 'normal';
	d.systematic.abdomen = 'normal';
	d.systematic.limbsAndDigits = 'normal';
	d.summary.clinicalNote = 'Well baby; feeding established; parents given screen results.';
	return d;
}

/** Refer (same-day) — newborn with weak femoral pulses and low saturations. */
function referHeartCritical(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'Dr I. Mackenzie',
		practitionerRole: 'paediatrician',
		examinedAt: '2026-06-25T14:10',
		examinationContext: 'newborn-72h',
		careSetting: 'neonatal-unit'
	};
	d.identification = {
		babyIdentifier: '573 110 8842',
		babyName: 'Baby Rossi',
		dateOfBirth: '2026-06-24',
		sex: 'female',
		gestationalAgeWeeks: 38,
		birthWeightGrams: 3010
	};
	d.riskFactors = {
		breechPresentation: 'no',
		familyHistoryHipProblems: 'no',
		antenatalConcerns: 'Antenatal scan noted a possible cardiac anomaly.'
	};
	d.eyes = { eyesRedReflexRight: 'present', eyesRedReflexLeft: 'present', eyesAppearance: 'normal' };
	d.heart = {
		heartMurmur: 'present',
		femoralPulsesRight: 'weak',
		femoralPulsesLeft: 'weak',
		centralCyanosis: 'absent',
		oxygenSaturationPreductal: 92,
		oxygenSaturationPostductal: 88
	};
	d.hips = { barlowTest: 'negative', ortolaniTest: 'negative', hipAbduction: 'normal' };
	d.systematic.generalAppearance = 'normal';
	d.systematic.chestAndLungs = 'normal';
	d.summary.clinicalNote = 'Escalated to neonatal team; urgent echocardiogram requested.';
	return d;
}

/** Refer (hips) — infant review, positive Ortolani plus a breech risk factor. */
function referHipsInfant(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'A. Rahman',
		practitionerRole: 'gp',
		examinedAt: '2026-06-26T11:00',
		examinationContext: 'infant-6-8-week',
		careSetting: 'gp-surgery'
	};
	d.identification = {
		babyIdentifier: '221 908 4471',
		babyName: 'Baby Nowak',
		dateOfBirth: '2026-05-08',
		sex: 'female',
		gestationalAgeWeeks: 40,
		birthWeightGrams: 3550
	};
	d.riskFactors = {
		breechPresentation: 'yes',
		familyHistoryHipProblems: 'no',
		antenatalConcerns: ''
	};
	d.eyes = { eyesRedReflexRight: 'present', eyesRedReflexLeft: 'present', eyesAppearance: 'normal' };
	d.heart = {
		heartMurmur: 'none',
		femoralPulsesRight: 'present',
		femoralPulsesLeft: 'present',
		centralCyanosis: 'absent',
		oxygenSaturationPreductal: 100,
		oxygenSaturationPostductal: 99
	};
	d.hips = { barlowTest: 'negative', ortolaniTest: 'positive', hipAbduction: 'limited' };
	d.systematic.generalAppearance = 'normal';
	d.systematic.feet = 'normal';
	d.summary.clinicalNote = 'Unstable left hip on Ortolani; breech at birth. Hip ultrasound arranged.';
	return d;
}

/** Incomplete — newborn boy with the heart component deferred (settling). */
function incompleteScreen(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		practitionerName: 'B. Ahmed',
		practitionerRole: 'neonatal-nurse',
		examinedAt: '2026-06-26T21:15',
		examinationContext: 'newborn-72h',
		careSetting: 'maternity-ward'
	};
	d.identification = {
		babyIdentifier: '880 204 3312',
		babyName: 'Baby Silva',
		dateOfBirth: '2026-06-26',
		sex: 'male',
		gestationalAgeWeeks: 37,
		birthWeightGrams: 2890
	};
	d.riskFactors = {
		breechPresentation: 'no',
		familyHistoryHipProblems: 'no',
		antenatalConcerns: ''
	};
	d.eyes = { eyesRedReflexRight: 'present', eyesRedReflexLeft: 'present', eyesAppearance: 'normal' };
	// Heart deferred: baby unsettled, examination not completed.
	d.heart = {
		heartMurmur: '',
		femoralPulsesRight: '',
		femoralPulsesLeft: '',
		centralCyanosis: '',
		oxygenSaturationPreductal: null,
		oxygenSaturationPostductal: null
	};
	d.hips = { barlowTest: 'negative', ortolaniTest: 'negative', hipAbduction: 'normal' };
	d.testes = { testisRight: 'descended', testisLeft: 'descended' };
	d.summary.clinicalNote = 'Baby unsettled at examination; heart auscultation to be completed before discharge.';
	return d;
}

/** The sample examinations, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'NIPE-2026-0001',
		babyName: 'Adeyemi',
		examinedDate: '2026-06-24',
		data: satisfactoryNewbornBoy()
	},
	{
		id: 'NIPE-2026-0002',
		babyName: 'Rossi',
		examinedDate: '2026-06-25',
		data: referHeartCritical()
	},
	{
		id: 'NIPE-2026-0003',
		babyName: 'Nowak',
		examinedDate: '2026-06-26',
		data: referHipsInfant()
	},
	{
		id: 'NIPE-2026-0004',
		babyName: 'Silva',
		examinedDate: '2026-06-26',
		data: incompleteScreen()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateNipeGrade(s.data);
	return {
		id: s.id,
		babyIdentifier: s.data.identification.babyIdentifier,
		babyName: s.babyName,
		sex: s.data.identification.sex,
		examinationContext: s.data.context.examinationContext,
		overallOutcome: g.overallOutcome,
		completenessPercent: g.completenessPercent,
		referralCount: g.referrals.length,
		flagCount: g.flaggedIssues.length,
		examinedDate: s.examinedDate
	};
});
