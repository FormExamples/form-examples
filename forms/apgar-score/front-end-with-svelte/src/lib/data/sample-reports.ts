import type { AssessmentData, Band, CareSetting, Trend } from '$lib/engine/types';
import { bandForTotal, calculateApgarGrade } from '$lib/engine/apgar-grader';
import { createDefaultAssessment, createTimepoint } from '$lib/stores/assessment.svelte';

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
	newbornIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	/** The lowest scored total observed across timepoints (0-10). */
	lowestTotal: number;
	/** The 5-minute total when scored, else the latest scored total. */
	fiveMinuteTotal: number | null;
	/** The worst (lowest) band observed across scored timepoints. */
	summaryBand: Band;
	trend: Trend;
	flagCount: number;
}

/** Reassuring throughout — 8 at 1 min, 9 at 5 min. */
function reassuring(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife J. Okoro',
		clinicianRole: 'midwife',
		bornAt: '2026-06-10T08:15',
		careSetting: 'delivery-room',
		gestationalAgeWeeks: 39.4,
		modeOfDelivery: 'vaginal'
	};
	d.identification = { newbornIdentifier: 'NB-100482', sex: 'female', birthOrder: 1 };
	d.timepoints = [
		{ ...createTimepoint(1), appearance: '1', pulse: '2', grimace: '2', activity: '2', respiration: '1' },
		{ ...createTimepoint(5), appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '1' }
	];
	d.summary.clinicianNote = 'Vigorous term infant; routine care and skin-to-skin.';
	return d;
}

/** Moderately low then recovering — 5 at 1 min, 7 at 5 min. */
function moderatelyLow(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Obstetrician L. Osei',
		clinicianRole: 'obstetrician',
		bornAt: '2026-06-12T14:40',
		careSetting: 'theatre',
		gestationalAgeWeeks: 38,
		modeOfDelivery: 'assisted'
	};
	d.identification = { newbornIdentifier: 'NB-100517', sex: 'male', birthOrder: 1 };
	d.timepoints = [
		{ ...createTimepoint(1), appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' },
		{ ...createTimepoint(5), appearance: '1', pulse: '2', grimace: '1', activity: '2', respiration: '1' }
	];
	d.summary.resuscitationMeasures = 'Drying, warmth, and tactile stimulation.';
	d.summary.clinicianNote = 'Slow to establish; responded to stimulation.';
	return d;
}

/** Low then recovering with a 10-minute score — 2, 5, 7. */
function lowRecovering(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Neonatologist S. Doyle',
		clinicianRole: 'neonatologist',
		bornAt: '2026-06-15T22:05',
		careSetting: 'delivery-room',
		gestationalAgeWeeks: 36.2,
		modeOfDelivery: 'caesarean'
	};
	d.identification = { newbornIdentifier: 'NB-100603', sex: 'female', birthOrder: 2 };
	d.timepoints = [
		{ ...createTimepoint(1), appearance: '0', pulse: '1', grimace: '0', activity: '0', respiration: '1' },
		{ ...createTimepoint(5), appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' },
		{ ...createTimepoint(10), appearance: '2', pulse: '2', grimace: '1', activity: '1', respiration: '1' }
	];
	d.summary.resuscitationMeasures =
		'Inflation breaths (IPPV) via mask, then oxygen; ventilation continued to 10 minutes.';
	d.summary.clinicianNote = 'Depressed at birth; steady recovery after resuscitation.';
	return d;
}

/** Deteriorating — 6, 3, 2. Falling trend, severe depression. */
function fallingSevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Neonatal nurse P. Reyes',
		clinicianRole: 'neonatal-nurse',
		bornAt: '2026-06-18T03:20',
		careSetting: 'neonatal-unit',
		gestationalAgeWeeks: 32.5,
		modeOfDelivery: 'caesarean'
	};
	d.identification = { newbornIdentifier: 'NB-100711', sex: 'male', birthOrder: 1 };
	d.timepoints = [
		{ ...createTimepoint(1), appearance: '1', pulse: '2', grimace: '1', activity: '1', respiration: '1' },
		{ ...createTimepoint(5), appearance: '0', pulse: '1', grimace: '1', activity: '0', respiration: '1' },
		{ ...createTimepoint(10), appearance: '0', pulse: '1', grimace: '0', activity: '0', respiration: '1' }
	];
	d.summary.resuscitationMeasures =
		'Full newborn-life-support: IPPV, chest compressions, and adrenaline; neonatal team in attendance.';
	d.summary.clinicianNote = 'Preterm infant deteriorating despite resuscitation; escalated to NICU.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AP-2026-0001', patientName: 'Adeyemi, Baby Grace', assessedDate: '2026-06-10', data: reassuring() },
	{ id: 'AP-2026-0002', patientName: 'Novak, Baby Peter', assessedDate: '2026-06-12', data: moderatelyLow() },
	{ id: 'AP-2026-0003', patientName: 'Ferreira, Baby Ana', assessedDate: '2026-06-15', data: lowRecovering() },
	{ id: 'AP-2026-0004', patientName: 'Okonkwo, Baby Daniel', assessedDate: '2026-06-18', data: fallingSevere() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateApgarGrade(s.data);
	const scored = g.timepoints.filter((t) => t.scored);
	const lowestTotal = scored.reduce((min, t) => Math.min(min, t.total), 10);
	const five = scored.find((t) => t.timepointMinutes === 5);
	const latest = scored[scored.length - 1];
	return {
		id: s.id,
		newbornIdentifier: s.data.identification.newbornIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		lowestTotal: scored.length > 0 ? lowestTotal : 0,
		fiveMinuteTotal: five ? five.total : latest ? latest.total : null,
		summaryBand: bandForTotal(scored.length > 0 ? lowestTotal : 0),
		trend: g.trend,
		flagCount: g.flaggedIssues.length
	};
});
