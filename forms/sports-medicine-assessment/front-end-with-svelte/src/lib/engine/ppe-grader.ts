import type { AssessmentData, Clearance, FiredRule, GradingResult } from './types';
import { ppeRules } from './ppe-rules';
import { detectAdditionalFlags } from './flagged-issues';

// PPE clearance grader. Pure functions: take an `AssessmentData` object, run
// every rule in `ppeRules`, and aggregate the highest-grade rule that fired
// into a single `Clearance` decision.
//
// Aggregation:
//   any rule with grade 4  -> not-cleared
//   else any grade 3       -> pending
//   else any grade 2       -> conditional
//   else                   -> cleared

/** Fields that always count towards the answered total. */
const TRACKED_FIELDS: [keyof AssessmentData, string][] = [
	['demographics', 'firstName'],
	['demographics', 'lastName'],
	['demographics', 'dateOfBirth'],
	['demographics', 'sex'],
	['demographics', 'weight'],
	['demographics', 'height'],
	['demographics', 'emergencyContactName'],
	['demographics', 'emergencyContactPhone'],
	['sportPositionDetails', 'primarySport'],
	['sportPositionDetails', 'contactLevel'],
	['sportPositionDetails', 'competitiveLevel'],
	['sportPositionDetails', 'hoursPerWeek'],
	['sportPositionDetails', 'previousClearanceIssue'],
	['medicalHistory', 'chronicIllness'],
	['medicalHistory', 'currentMedications'],
	['medicalHistory', 'allergiesKnown'],
	['medicalHistory', 'priorSurgery'],
	['medicalHistory', 'hospitalisedLastYear'],
	['medicalHistory', 'asthmaOrExerciseInducedBronchospasm'],
	['medicalHistory', 'diabetes'],
	['medicalHistory', 'sickleCellTraitOrDisease'],
	['medicalHistory', 'heatIllnessHistory'],
	['medicalHistory', 'eatingDisorderHistory'],
	['familyHistory', 'suddenCardiacDeathUnder50'],
	['familyHistory', 'hypertrophicCardiomyopathy'],
	['familyHistory', 'marfanSyndrome'],
	['familyHistory', 'longQTSyndrome'],
	['familyHistory', 'arrhythmiaOrPacemaker'],
	['familyHistory', 'unexplainedSeizureOrFainting'],
	['cardiovascularScreening', 'chestPainWithExertion'],
	['cardiovascularScreening', 'unexplainedSyncope'],
	['cardiovascularScreening', 'excessiveBreathlessness'],
	['cardiovascularScreening', 'palpitationsOrIrregularBeat'],
	['cardiovascularScreening', 'highBloodPressureDiagnosis'],
	['cardiovascularScreening', 'heartMurmurDetected'],
	['cardiovascularScreening', 'restrictedActivityForHeart'],
	['musculoskeletalScreening', 'uncorrectedMajorInjury'],
	['musculoskeletalScreening', 'jointInstability'],
	['musculoskeletalScreening', 'ongoingPainOrSwelling'],
	['musculoskeletalScreening', 'chronicJointDisease'],
	['musculoskeletalScreening', 'fullRangeOfMotion'],
	['musculoskeletalScreening', 'normalStrengthBilateral'],
	['neurologicalConcussionBaseline', 'totalConcussions'],
	['neurologicalConcussionBaseline', 'concussionLastSixMonths'],
	['neurologicalConcussionBaseline', 'ongoingPostConcussiveSymptoms'],
	['neurologicalConcussionBaseline', 'historyOfSeizures'],
	['neurologicalConcussionBaseline', 'stinger'],
	['neurologicalConcussionBaseline', 'historyOfHeadOrNeckSurgery'],
	['visionSkin', 'correctiveLensesWorn'],
	['visionSkin', 'monocularAthlete'],
	['visionSkin', 'activeSkinInfection'],
	['visionSkin', 'herpesGladiatorum'],
	['visionSkin', 'impetigoOrMRSA'],
	['visionSkin', 'openWoundsOrLesions'],
	['clearanceDecision', 'preferredClearance']
];

/** Fields that only count when RED-S screening is applicable (sex = female). */
const TRACKED_FIELDS_REDS: [keyof AssessmentData, string][] = [
	['menstrualHistoryREDS', 'regularPeriods'],
	['menstrualHistoryREDS', 'amenorrhoeaSixMonths'],
	['menstrualHistoryREDS', 'restrictiveEatingPattern'],
	['menstrualHistoryREDS', 'stressFractureHistory'],
	['menstrualHistoryREDS', 'lowEnergyAvailabilityConcern']
];

/** Count answered tracked fields ('' / null / undefined are unanswered). */
export function countAnswered(data: AssessmentData): number {
	let answered = 0;
	const check = (pairs: [keyof AssessmentData, string][]) => {
		for (const [section, field] of pairs) {
			const v = (data[section] as unknown as Record<string, unknown>)[field];
			if (v !== null && v !== undefined && v !== '') answered++;
		}
	};
	check(TRACKED_FIELDS);
	if (data.menstrualHistoryREDS.applicable) check(TRACKED_FIELDS_REDS);
	return answered;
}

/** Aggregate the highest-grade fired rule into a single clearance decision. */
export function aggregateClearance(firedRules: FiredRule[]): Clearance {
	let maxGrade = 0;
	for (const r of firedRules) {
		if (r.grade > maxGrade) maxGrade = r.grade;
	}
	if (maxGrade >= 4) return 'not-cleared';
	if (maxGrade === 3) return 'pending';
	if (maxGrade === 2) return 'conditional';
	return 'cleared';
}

/**
 * Run every PPE rule against the supplied assessment data and produce the full
 * grading result: the aggregated clearance decision, the fired-rule audit
 * trail (worst-first), the additional clinician flags, and the answered count.
 */
export function gradePPE(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];

	for (const rule of ppeRules) {
		try {
			if (rule.fires(data)) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					grade: rule.grade
				});
			}
		} catch (e) {
			console.warn(`PPE rule ${rule.id} evaluation failed:`, e);
		}
	}

	// Sort highest grade first so the report reads worst-first.
	firedRules.sort((a, b) => b.grade - a.grade);

	return {
		clearance: aggregateClearance(firedRules),
		answeredCount: countAnswered(data),
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
