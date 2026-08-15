import type { AssessmentData, FMSScore } from '#lib/engine/types.js';
import { calculateFMS } from '#lib/engine/fms-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
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
	fmsScore: number;
	fmsCategory: string;
	sportActivity: string;
	painFlag: boolean;
	flagCount: number;
}

/** Set a unilateral pattern's score. */
function single(score: FMSScore, pain = false) {
	return { score, painDuringMovement: pain, leftScore: null, rightScore: null, asymmetryNotes: '' };
}

/** Set a bilateral pattern's left/right scores. */
function bilateral(left: FMSScore, right: FMSScore, pain = false) {
	return {
		score: null,
		painDuringMovement: pain,
		leftScore: left,
		rightScore: right,
		asymmetryNotes: ''
	};
}

/** An excellent screen: clean movement throughout, no pain. */
function excellent(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1996-04-12', sex: 'male' };
	d.referralInfo = { ...d.referralInfo, sportOrActivity: 'Football', referralReason: 'Pre-season movement screen' };
	d.movementHistory = { ...d.movementHistory, activityLevel: 'vigorous', currentPain: 'none' };
	d.fmsPatterns.deepSquat = single(3);
	d.fmsPatterns.hurdleStep = bilateral(3, 3);
	d.fmsPatterns.inLineLunge = bilateral(3, 3);
	d.fmsPatterns.shoulderMobility = bilateral(3, 2);
	d.fmsPatterns.activeStraightLegRaise = bilateral(3, 3);
	d.fmsPatterns.trunkStabilityPushUp = single(3);
	d.fmsPatterns.rotaryStability = bilateral(2, 2);
	return d;
}

/** A good screen: minor compensations, mild pain noted. */
function good(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1989-09-30', sex: 'female' };
	d.referralInfo = { ...d.referralInfo, sportOrActivity: 'Running', referralReason: 'Recurrent calf tightness' };
	d.movementHistory = { ...d.movementHistory, activityLevel: 'moderate', currentPain: 'mild', currentPainDetails: 'Left calf after long runs' };
	d.fmsPatterns.deepSquat = single(2);
	d.fmsPatterns.hurdleStep = bilateral(2, 2);
	d.fmsPatterns.inLineLunge = bilateral(3, 2);
	d.fmsPatterns.shoulderMobility = bilateral(2, 2);
	d.fmsPatterns.activeStraightLegRaise = bilateral(3, 3);
	d.fmsPatterns.trunkStabilityPushUp = single(3);
	d.fmsPatterns.rotaryStability = bilateral(2, 2);
	return d;
}

/** A fair screen: several limitations and asymmetries. */
function fair(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1972-01-22', sex: 'female' };
	d.referralInfo = { ...d.referralInfo, sportOrActivity: 'Tennis', referralReason: 'Right shoulder restriction' };
	d.movementHistory = { ...d.movementHistory, activityLevel: 'light', currentPain: 'mild', injuryHistory: 'Rotator cuff strain 2 years ago' };
	d.fmsPatterns.deepSquat = single(2);
	d.fmsPatterns.hurdleStep = bilateral(2, 1);
	d.fmsPatterns.inLineLunge = bilateral(2, 2);
	d.fmsPatterns.shoulderMobility = bilateral(2, 1);
	d.fmsPatterns.activeStraightLegRaise = bilateral(2, 2);
	d.fmsPatterns.trunkStabilityPushUp = single(2);
	d.fmsPatterns.rotaryStability = bilateral(2, 2);
	d.fmsPatterns.clearingTests.shoulderClearing = 'yes';
	return d;
}

/** A poor screen: pain during movement, multiple inabilities. */
function poor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1965-11-03', sex: 'male' };
	d.referralInfo = { ...d.referralInfo, sportOrActivity: 'CrossFit', referralReason: 'Low back pain on loading' };
	d.movementHistory = { ...d.movementHistory, activityLevel: 'moderate', currentPain: 'severe', currentPainDetails: 'Lumbar pain with flexion', previousTreatments: 'Physiotherapy, NSAIDs' };
	d.fmsPatterns.deepSquat = single(1);
	d.fmsPatterns.hurdleStep = bilateral(1, 1);
	d.fmsPatterns.inLineLunge = bilateral(2, 2, true);
	d.fmsPatterns.shoulderMobility = bilateral(1, 1);
	d.fmsPatterns.activeStraightLegRaise = bilateral(2, 1);
	d.fmsPatterns.trunkStabilityPushUp = single(1);
	d.fmsPatterns.rotaryStability = bilateral(2, 2);
	d.fmsPatterns.clearingTests.trunkFlexionClearing = 'yes';
	d.fmsPatterns.clearingTests.trunkFlexionClearingPain = true;
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'KA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: excellent() },
	{ id: 'KA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: good() },
	{ id: 'KA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: fair() },
	{ id: 'KA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: poor() }
];

/** Whether the screen surfaced any pain (movement, clearing test, or reported). */
function hasPainFlag(d: AssessmentData): boolean {
	const p = d.fmsPatterns;
	const patterns = [
		p.deepSquat,
		p.hurdleStep,
		p.inLineLunge,
		p.shoulderMobility,
		p.activeStraightLegRaise,
		p.trunkStabilityPushUp,
		p.rotaryStability
	];
	if (patterns.some((x) => x.painDuringMovement)) return true;
	const ct = p.clearingTests;
	if (ct.shoulderClearingPain || ct.trunkFlexionClearingPain || ct.trunkExtensionClearingPain) return true;
	return d.movementHistory.currentPain === 'moderate' || d.movementHistory.currentPain === 'severe';
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { fmsScore, fmsCategoryLabel } = calculateFMS(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		fmsScore,
		fmsCategory: fmsCategoryLabel,
		sportActivity: s.data.referralInfo.sportOrActivity || '—',
		painFlag: hasPainFlag(s.data),
		flagCount: flags.length
	};
});
