import { describe, it, expect } from 'vitest';
import { gradePPE, aggregateClearance, countAnswered } from './ppe-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { ppeRules } from './ppe-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment with all fields at their unanswered defaults. Mirrors the
 * store's `createDefaultAssessment`, but inlined so this engine test stays pure
 * (no SvelteKit `$app/*` imports).
 */
function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			weight: null,
			height: null,
			bmi: null,
			emergencyContactName: '',
			emergencyContactPhone: ''
		},
		sportPositionDetails: {
			primarySport: '',
			primaryPosition: '',
			contactLevel: '',
			secondarySports: '',
			competitiveLevel: '',
			hoursPerWeek: null,
			previousClearanceIssue: '',
			previousClearanceDetails: ''
		},
		medicalHistory: {
			chronicIllness: '',
			chronicIllnessDetails: '',
			currentMedications: '',
			currentMedicationDetails: '',
			allergiesKnown: '',
			allergyDetails: '',
			priorSurgery: '',
			priorSurgeryDetails: '',
			hospitalisedLastYear: '',
			asthmaOrExerciseInducedBronchospasm: '',
			diabetes: '',
			sickleCellTraitOrDisease: '',
			heatIllnessHistory: '',
			eatingDisorderHistory: ''
		},
		familyHistory: {
			suddenCardiacDeathUnder50: '',
			suddenCardiacDeathRelation: '',
			hypertrophicCardiomyopathy: '',
			marfanSyndrome: '',
			longQTSyndrome: '',
			arrhythmiaOrPacemaker: '',
			unexplainedSeizureOrFainting: ''
		},
		menstrualHistoryREDS: {
			applicable: false,
			ageAtMenarche: null,
			regularPeriods: '',
			amenorrhoeaSixMonths: '',
			cyclesLast12Months: null,
			restrictiveEatingPattern: '',
			stressFractureHistory: '',
			lowEnergyAvailabilityConcern: ''
		},
		cardiovascularScreening: {
			chestPainWithExertion: '',
			unexplainedSyncope: '',
			excessiveBreathlessness: '',
			palpitationsOrIrregularBeat: '',
			highBloodPressureDiagnosis: '',
			heartMurmurDetected: '',
			restrictedActivityForHeart: '',
			restingSystolic: null,
			restingDiastolic: null,
			restingHeartRate: null
		},
		musculoskeletalScreening: {
			uncorrectedMajorInjury: '',
			majorInjuryDetails: '',
			jointInstability: '',
			jointInstabilityDetails: '',
			ongoingPainOrSwelling: '',
			chronicJointDisease: '',
			useBraceOrAssistiveDevice: '',
			fullRangeOfMotion: '',
			normalStrengthBilateral: ''
		},
		neurologicalConcussionBaseline: {
			totalConcussions: null,
			concussionLastSixMonths: '',
			mostRecentConcussionDate: '',
			ongoingPostConcussiveSymptoms: '',
			historyOfSeizures: '',
			stinger: '',
			historyOfHeadOrNeckSurgery: '',
			baselineHeadachesOrMigraine: ''
		},
		visionSkin: {
			correctiveLensesWorn: '',
			monocularAthlete: '',
			protectiveEyewearAvailable: '',
			activeSkinInfection: '',
			activeSkinInfectionDetails: '',
			herpesGladiatorum: '',
			impetigoOrMRSA: '',
			openWoundsOrLesions: ''
		},
		clearanceDecision: {
			preferredClearance: '',
			clearanceConditions: '',
			followUpRequired: '',
			clinicianName: '',
			clinicianSignatureDate: '',
			additionalNotes: ''
		}
	};
}

/** A fully-answered, low-risk athlete with no concerns. */
function healthyAthlete(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Alex',
		lastName: 'Carter',
		dateOfBirth: '2002-03-14',
		sex: 'male',
		weight: 75,
		height: 180,
		bmi: 23.1
	};
	d.sportPositionDetails = {
		...d.sportPositionDetails,
		primarySport: 'Athletics',
		contactLevel: 'low',
		competitiveLevel: 'club',
		hoursPerWeek: 8,
		previousClearanceIssue: 'no'
	};
	d.medicalHistory = {
		...d.medicalHistory,
		chronicIllness: 'no',
		currentMedications: 'no',
		allergiesKnown: 'no',
		priorSurgery: 'no',
		hospitalisedLastYear: 'no',
		asthmaOrExerciseInducedBronchospasm: 'no',
		diabetes: 'no',
		sickleCellTraitOrDisease: 'no',
		heatIllnessHistory: 'no',
		eatingDisorderHistory: 'no'
	};
	d.familyHistory = {
		...d.familyHistory,
		suddenCardiacDeathUnder50: 'no',
		hypertrophicCardiomyopathy: 'no',
		marfanSyndrome: 'no',
		longQTSyndrome: 'no',
		arrhythmiaOrPacemaker: 'no',
		unexplainedSeizureOrFainting: 'no'
	};
	d.cardiovascularScreening = {
		...d.cardiovascularScreening,
		chestPainWithExertion: 'no',
		unexplainedSyncope: 'no',
		excessiveBreathlessness: 'no',
		palpitationsOrIrregularBeat: 'no',
		highBloodPressureDiagnosis: 'no',
		heartMurmurDetected: 'no',
		restrictedActivityForHeart: 'no'
	};
	d.musculoskeletalScreening = {
		...d.musculoskeletalScreening,
		uncorrectedMajorInjury: 'no',
		jointInstability: 'no',
		ongoingPainOrSwelling: 'no',
		chronicJointDisease: 'no',
		fullRangeOfMotion: 'yes',
		normalStrengthBilateral: 'yes'
	};
	d.neurologicalConcussionBaseline = {
		...d.neurologicalConcussionBaseline,
		totalConcussions: 0,
		concussionLastSixMonths: 'no',
		ongoingPostConcussiveSymptoms: 'no',
		historyOfSeizures: 'no',
		stinger: 'no',
		historyOfHeadOrNeckSurgery: 'no'
	};
	d.visionSkin = {
		...d.visionSkin,
		correctiveLensesWorn: 'no',
		monocularAthlete: 'no',
		activeSkinInfection: 'no',
		herpesGladiatorum: 'no',
		impetigoOrMRSA: 'no',
		openWoundsOrLesions: 'no'
	};
	return d;
}

describe('PPE clearance grader', () => {
	it('clears a healthy athlete with no fired rules', () => {
		const result = gradePPE(healthyAthlete());
		expect(result.clearance).toBe('cleared');
		expect(result.firedRules).toHaveLength(0);
		expect(result.answeredCount).toBeGreaterThan(0);
	});

	it('returns conditional when only grade-2 rules fire', () => {
		const d = healthyAthlete();
		d.medicalHistory.asthmaOrExerciseInducedBronchospasm = 'yes';
		const result = gradePPE(d);
		expect(result.clearance).toBe('conditional');
	});

	it('returns pending when a grade-3 rule fires', () => {
		const d = healthyAthlete();
		d.neurologicalConcussionBaseline.concussionLastSixMonths = 'yes';
		const result = gradePPE(d);
		expect(result.clearance).toBe('pending');
	});

	it('returns not-cleared for an exertional cardiac red flag', () => {
		const d = healthyAthlete();
		d.cardiovascularScreening.chestPainWithExertion = 'yes';
		const result = gradePPE(d);
		expect(result.clearance).toBe('not-cleared');
		expect(result.firedRules.some((r) => r.id === 'PPE-030')).toBe(true);
	});

	it('excludes infectious skin lesions only in contact sport', () => {
		const d = healthyAthlete();
		d.visionSkin.impetigoOrMRSA = 'yes';
		// Low-contact sport: rule must not fire.
		expect(gradePPE(d).firedRules.some((r) => r.id === 'PPE-070')).toBe(false);
		// Contact sport: rule fires and excludes.
		d.sportPositionDetails.contactLevel = 'high';
		const result = gradePPE(d);
		expect(result.firedRules.some((r) => r.id === 'PPE-070')).toBe(true);
		expect(result.clearance).toBe('not-cleared');
	});

	it('aggregates the worst grade across fired rules', () => {
		expect(aggregateClearance([])).toBe('cleared');
		expect(aggregateClearance([{ id: 'x', category: 'c', description: 'd', grade: 2 }])).toBe(
			'conditional'
		);
		expect(
			aggregateClearance([
				{ id: 'x', category: 'c', description: 'd', grade: 2 },
				{ id: 'y', category: 'c', description: 'd', grade: 4 }
			])
		).toBe('not-cleared');
	});

	it('has unique rule ids', () => {
		const ids = ppeRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('counts RED-S fields only when applicable', () => {
		const base = healthyAthlete();
		const baseline = countAnswered(base);
		const withReds = healthyAthlete();
		withReds.menstrualHistoryREDS.applicable = true;
		withReds.menstrualHistoryREDS.regularPeriods = 'yes';
		expect(countAnswered(withReds)).toBeGreaterThan(baseline);
	});
});

describe('PPE flagged-issue detection', () => {
	it('raises no flags for a healthy athlete', () => {
		expect(detectAdditionalFlags(healthyAthlete())).toHaveLength(0);
	});

	it('flags a recent concussion as high priority', () => {
		const d = healthyAthlete();
		d.neurologicalConcussionBaseline.concussionLastSixMonths = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-NEURO-001' && f.priority === 'high')).toBe(true);
	});

	it('flags the probable RED-S triad when applicable', () => {
		const d = healthyAthlete();
		d.demographics.sex = 'female';
		d.demographics.bmi = 17;
		d.menstrualHistoryREDS.applicable = true;
		d.menstrualHistoryREDS.amenorrhoeaSixMonths = 'yes';
		d.menstrualHistoryREDS.stressFractureHistory = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-REDS-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const d = healthyAthlete();
		d.cardiovascularScreening.chestPainWithExertion = 'yes'; // high
		d.medicalHistory.heatIllnessHistory = 'yes'; // medium
		d.sportPositionDetails.hoursPerWeek = 25; // low
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = detectAdditionalFlags(d).map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
