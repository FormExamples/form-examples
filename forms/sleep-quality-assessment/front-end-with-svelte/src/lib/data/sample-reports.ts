import type { AssessmentData } from '#lib/engine/types.js';
import { calculatePSQI } from '#lib/engine/psqi-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { frequencyToScore } from '#lib/engine/psqi-rules.js';
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
	patientName: string;
	assessedDate: string;
	psqiScore: number;
	psqiCategory: string;
	snoringFlag: boolean;
	medicationFlag: boolean;
	flagCount: number;
}

/** A good sleeper: PSQI in the 0–5 (Good sleep quality) band. */
function goodSleeper(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male' };
	d.sleepHabits = { usualBedtime: '22:30', usualWakeTime: '06:30', minutesToFallAsleep: 10, hoursOfSleep: 8, sleepEnvironment: 'good' };
	d.sleepLatency = { timeToFallAsleep: 'not-during-past-month', wakeUpDuringNight: 'not-during-past-month' };
	d.sleepDuration = { actualSleepHours: 7.5, feelEnoughSleep: 'yes' };
	d.sleepEfficiency = { bedtime: '22:30', wakeTime: '06:30', hoursInBed: 8, hoursAsleep: 7.5 };
	d.daytimeDysfunction = { troubleStayingAwake: 'not-during-past-month', enthusiasmProblem: 'not-during-past-month', drivingDrowsiness: 'no' };
	d.medicalLifestyle = { ...d.medicalLifestyle, caffeineIntake: 'low-1-2', alcoholUse: 'none', exerciseFrequency: 'moderate-3-4', screenTimeBeforeBed: 'less-than-30-min', shiftWork: 'no' };
	return d;
}

/** A poor sleeper: PSQI in the 6–10 (Poor sleep quality) band, snores. */
function poorSleeper(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1972-09-30', sex: 'female' };
	d.sleepHabits = { usualBedtime: '23:30', usualWakeTime: '06:45', minutesToFallAsleep: 45, hoursOfSleep: 6.5, sleepEnvironment: 'fair' };
	d.sleepLatency = { timeToFallAsleep: 'once-or-twice-week', wakeUpDuringNight: 'once-or-twice-week' };
	d.sleepDuration = { actualSleepHours: 6.5, feelEnoughSleep: 'no' };
	d.sleepEfficiency = { bedtime: '23:30', wakeTime: '06:45', hoursInBed: 8, hoursAsleep: 6.5 };
	d.sleepDisturbances = { ...d.sleepDisturbances, wakeUpMiddleNight: 'once-or-twice-week', bathroomTrips: 'less-than-once-week', coughingSnoring: 'once-or-twice-week' };
	d.daytimeDysfunction = { troubleStayingAwake: 'less-than-once-week', enthusiasmProblem: 'not-during-past-month', drivingDrowsiness: 'no' };
	d.medicalLifestyle = { ...d.medicalLifestyle, caffeineIntake: 'moderate-3-4', alcoholUse: 'occasional', exerciseFrequency: 'light-1-2', screenTimeBeforeBed: '30-60-min', shiftWork: 'no' };
	return d;
}

/** A patient with a likely sleep disorder: PSQI 11–15, snores, low efficiency. */
function disorderLikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female' };
	d.sleepHabits = { usualBedtime: '22:00', usualWakeTime: '07:00', minutesToFallAsleep: 60, hoursOfSleep: 4.5, sleepEnvironment: 'poor' };
	d.sleepLatency = { timeToFallAsleep: 'three-or-more-week', wakeUpDuringNight: 'three-or-more-week' };
	d.sleepDuration = { actualSleepHours: 4.5, feelEnoughSleep: 'no' };
	d.sleepEfficiency = { bedtime: '22:00', wakeTime: '07:00', hoursInBed: 9, hoursAsleep: 4.5 };
	d.sleepDisturbances = { ...d.sleepDisturbances, wakeUpMiddleNight: 'three-or-more-week', bathroomTrips: 'once-or-twice-week', coughingSnoring: 'once-or-twice-week' };
	d.daytimeDysfunction = { troubleStayingAwake: 'once-or-twice-week', enthusiasmProblem: 'once-or-twice-week', drivingDrowsiness: 'no' };
	d.medicalLifestyle = { ...d.medicalLifestyle, caffeineIntake: 'moderate-3-4', alcoholUse: 'moderate', exerciseFrequency: 'none', screenTimeBeforeBed: 'more-than-60-min', shiftWork: 'no', medicalConditions: 'Hypertension, osteoarthritis' };
	return d;
}

/** A severe case: PSQI 16–21, suspected apnea, on sleep medication. */
function severeDisturbance(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1965-11-03', sex: 'male' };
	d.sleepHabits = { usualBedtime: '00:30', usualWakeTime: '06:00', minutesToFallAsleep: 90, hoursOfSleep: 3, sleepEnvironment: 'poor' };
	d.sleepLatency = { timeToFallAsleep: 'three-or-more-week', wakeUpDuringNight: 'three-or-more-week' };
	d.sleepDuration = { actualSleepHours: 3, feelEnoughSleep: 'no' };
	d.sleepEfficiency = { bedtime: '00:30', wakeTime: '06:00', hoursInBed: 10, hoursAsleep: 3 };
	d.sleepDisturbances = { wakeUpMiddleNight: 'three-or-more-week', bathroomTrips: 'three-or-more-week', breathingDifficulty: 'three-or-more-week', coughingSnoring: 'three-or-more-week', tooHot: 'less-than-once-week', tooCold: 'not-during-past-month', badDreams: 'once-or-twice-week', pain: 'three-or-more-week', otherDisturbances: '' };
	d.daytimeDysfunction = { troubleStayingAwake: 'three-or-more-week', enthusiasmProblem: 'three-or-more-week', drivingDrowsiness: 'yes' };
	d.sleepMedicationUse = { prescriptionSleepMeds: 'yes', otcSleepAids: 'yes', frequency: 'three-or-more-week' };
	d.medicalLifestyle = { ...d.medicalLifestyle, caffeineIntake: 'high-5-plus', alcoholUse: 'heavy', exerciseFrequency: 'none', screenTimeBeforeBed: 'more-than-60-min', shiftWork: 'yes', medicalConditions: 'Type 2 diabetes, obesity', currentMedications: 'Zopiclone 7.5 mg nightly' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SQ-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: goodSleeper() },
	{ id: 'SQ-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: poorSleeper() },
	{ id: 'SQ-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: disorderLikely() },
	{ id: 'SQ-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeDisturbance() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { psqiScore, psqiCategoryLabel } = calculatePSQI(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		psqiScore,
		psqiCategory: psqiCategoryLabel,
		snoringFlag: frequencyToScore(s.data.sleepDisturbances.coughingSnoring) >= 2,
		medicationFlag:
			s.data.sleepMedicationUse.prescriptionSleepMeds === 'yes' ||
			s.data.sleepMedicationUse.otcSleepAids === 'yes' ||
			frequencyToScore(s.data.sleepMedicationUse.frequency) > 0,
		flagCount: flags.length
	};
});
