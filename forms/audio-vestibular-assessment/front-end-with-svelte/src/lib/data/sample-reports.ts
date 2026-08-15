import type { AssessmentData, HearingLossGrade, DhiHandicapLevel } from '#lib/engine/types.js';
import { grade } from '#lib/engine/audio-vestibular-grader.js';
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
	betterEarPta: number | null;
	hearingLossGrade: HearingLossGrade;
	dhiTotal: number;
	dhiHandicapLevel: DhiHandicapLevel;
	vestibularFlag: boolean;
	flagCount: number;
}

/** Set every DHI item to a single answer (helper for the samples). */
function setDhi(data: AssessmentData, answer: 'yes' | 'sometimes' | 'no') {
	for (const key of Object.keys(data.dizzinessHandicapInventory)) {
		data.dizzinessHandicapInventory[key] = answer;
	}
}

/** Normal hearing, no vestibular handicap: clean screen. */
function normalHearing(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1972-04-12', sex: 'male', assessmentDate: '2026-06-10' };
	d.presentingSymptoms = { ...d.presentingSymptoms, hearingLoss: 'no', tinnitus: 'no', vertigo: 'no', imbalance: 'no', falls: 'no', neurologicalSymptoms: 'no' };
	d.pureToneAudiometry.rightEar.airConduction = { hz500: 10, hz1000: 10, hz2000: 15, hz4000: 15 };
	d.pureToneAudiometry.leftEar.airConduction = { hz500: 10, hz1000: 10, hz2000: 10, hz4000: 15 };
	d.tympanometryAcousticReflexes = { ...d.tympanometryAcousticReflexes, rightTympanogram: 'A', leftTympanogram: 'A', rightAcousticReflexes: 'present', leftAcousticReflexes: 'present' };
	d.vestibularScreening = { ...d.vestibularScreening, headImpulseTest: 'normal', dixHallpike: 'negative', rombergTest: 'normal', nystagmus: 'none' };
	setDhi(d, 'no');
	return d;
}

/** Mild age-related hearing loss with mild perceived dizziness handicap. */
function mildHearing(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', assessmentDate: '2026-06-12' };
	d.presentingSymptoms = { ...d.presentingSymptoms, hearingLoss: 'yes', hearingLossSide: 'both', hearingLossOnset: 'gradual', tinnitus: 'yes', tinnitusSide: 'both', vertigo: 'no', imbalance: 'no', falls: 'no', neurologicalSymptoms: 'no' };
	d.pureToneAudiometry.rightEar.airConduction = { hz500: 25, hz1000: 30, hz2000: 30, hz4000: 35 };
	d.pureToneAudiometry.leftEar.airConduction = { hz500: 25, hz1000: 25, hz2000: 30, hz4000: 35 };
	d.tympanometryAcousticReflexes = { ...d.tympanometryAcousticReflexes, rightTympanogram: 'A', leftTympanogram: 'A' };
	d.vestibularScreening = { ...d.vestibularScreening, headImpulseTest: 'normal', dixHallpike: 'negative', rombergTest: 'normal', nystagmus: 'none' };
	// Mild DHI: a handful of "sometimes" answers (total ~20).
	['q1', 'q4', 'q11', 'q13', 'q17', 'q25', 'q2', 'q10', 'q3', 'q7'].forEach((q) => (d.dizzinessHandicapInventory[q] = 'sometimes'));
	d.clinicalImpressionReferral = { ...d.clinicalImpressionReferral, hearingAidCandidate: 'yes' };
	return d;
}

/** Asymmetric moderately-severe loss with BPPV and moderate DHI handicap. */
function asymmetricVestibular(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1951-01-22', sex: 'female', assessmentDate: '2026-06-15' };
	d.presentingSymptoms = { ...d.presentingSymptoms, hearingLoss: 'yes', hearingLossSide: 'right', hearingLossOnset: 'gradual', tinnitus: 'yes', tinnitusSide: 'right', vertigo: 'yes', vertigoCharacter: 'spinning', vertigoEpisodeDurationSeconds: 30, imbalance: 'yes', falls: 'no', neurologicalSymptoms: 'no' };
	d.pureToneAudiometry.rightEar.airConduction = { hz500: 55, hz1000: 60, hz2000: 60, hz4000: 65 };
	d.pureToneAudiometry.leftEar.airConduction = { hz500: 30, hz1000: 30, hz2000: 35, hz4000: 35 };
	d.speechAudiometry = { ...d.speechAudiometry, rightWordRecognitionPercent: 60, leftWordRecognitionPercent: 88 };
	d.tympanometryAcousticReflexes = { ...d.tympanometryAcousticReflexes, rightTympanogram: 'A', leftTympanogram: 'A' };
	d.vestibularScreening = { ...d.vestibularScreening, headImpulseTest: 'normal', dixHallpike: 'positive-right', rombergTest: 'normal', nystagmus: 'positional' };
	setDhi(d, 'sometimes'); // 25 × 2 = 50 → moderate
	d.clinicalImpressionReferral = { ...d.clinicalImpressionReferral, hearingAidCandidate: 'yes', vestibularRehabIndicated: 'yes', ent_referral: 'yes', imagingRequested: 'mri' };
	return d;
}

/** Sudden severe loss with central red flags and severe DHI handicap. */
function suddenSevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1965-11-03', sex: 'male', assessmentDate: '2026-06-18' };
	d.presentingSymptoms = { ...d.presentingSymptoms, hearingLoss: 'yes', hearingLossSide: 'left', hearingLossOnset: 'sudden', hearingLossDurationMonths: 0, tinnitus: 'yes', tinnitusSide: 'left', vertigo: 'yes', vertigoCharacter: 'spinning', imbalance: 'yes', falls: 'yes', fallsLastYearCount: 3, neurologicalSymptoms: 'yes' };
	d.pureToneAudiometry.rightEar.airConduction = { hz500: 65, hz1000: 70, hz2000: 75, hz4000: 80 };
	d.pureToneAudiometry.leftEar.airConduction = { hz500: 70, hz1000: 75, hz2000: 80, hz4000: 85 };
	d.speechAudiometry = { ...d.speechAudiometry, rightWordRecognitionPercent: 44, leftWordRecognitionPercent: 36 };
	d.tympanometryAcousticReflexes = { ...d.tympanometryAcousticReflexes, rightTympanogram: 'A', leftTympanogram: 'B', rightAcousticReflexes: 'absent', leftAcousticReflexes: 'absent' };
	d.vestibularScreening = { ...d.vestibularScreening, headImpulseTest: 'normal', dixHallpike: 'negative', rombergTest: 'abnormal', nystagmus: 'gaze-evoked' };
	setDhi(d, 'yes'); // 25 × 4 = 100 → severe
	d.clinicalImpressionReferral = { ...d.clinicalImpressionReferral, hearingAidCandidate: 'no', vestibularRehabIndicated: 'yes', ent_referral: 'yes', neurologyReferral: 'yes', imagingRequested: 'mri', followUpWeeks: 1 };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AV-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: normalHearing() },
	{ id: 'AV-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildHearing() },
	{ id: 'AV-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: asymmetricVestibular() },
	{ id: 'AV-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: suddenSevere() }
];

/** True if any bedside vestibular test is abnormal / positive. */
function hasVestibularInvolvement(data: AssessmentData): boolean {
	const v = data.vestibularScreening;
	return (
		v.headImpulseTest === 'abnormal-right' ||
		v.headImpulseTest === 'abnormal-left' ||
		v.dixHallpike === 'positive-right' ||
		v.dixHallpike === 'positive-left' ||
		v.dixHallpike === 'bilateral' ||
		v.rombergTest === 'abnormal' ||
		v.tandemGait === 'abnormal' ||
		(v.nystagmus !== '' && v.nystagmus !== 'none') ||
		v.fukudaSteppingTest === 'rotation-right' ||
		v.fukudaSteppingTest === 'rotation-left'
	);
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = grade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		betterEarPta: g.betterEarPta,
		hearingLossGrade: g.hearingLossGrade,
		dhiTotal: g.dhiTotal,
		dhiHandicapLevel: g.dhiHandicapLevel,
		vestibularFlag: hasVestibularInvolvement(s.data),
		flagCount: g.additionalFlags.length
	};
});
