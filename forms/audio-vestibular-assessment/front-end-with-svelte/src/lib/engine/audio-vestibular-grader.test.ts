import { describe, it, expect } from 'vitest';
import { grade, calculatePureToneAudiometry, calculateDhi } from './audio-vestibular-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { DHI_ITEMS } from './rules';
import type { AssessmentData, DizzinessHandicapInventory } from './types';

function emptyDhi(): DizzinessHandicapInventory {
	const answers: DizzinessHandicapInventory = {};
	for (const item of DHI_ITEMS) answers['q' + item.num] = '';
	return answers;
}

function createBlankAssessment(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', assessmentDate: '' },
		presentingSymptoms: {
			hearingLoss: '',
			hearingLossSide: '',
			hearingLossOnset: '',
			hearingLossDurationMonths: null,
			tinnitus: '',
			tinnitusSide: '',
			otalgia: '',
			otorrhea: '',
			auralFullness: '',
			vertigo: '',
			vertigoCharacter: '',
			vertigoEpisodeDurationSeconds: null,
			vertigoFrequencyPerWeek: null,
			imbalance: '',
			falls: '',
			fallsLastYearCount: null,
			headacheMigraine: '',
			neurologicalSymptoms: '',
			otherSymptoms: ''
		},
		otoscopicExamination: {
			rightEar: { canalStatus: '', tympanicMembrane: '' },
			leftEar: { canalStatus: '', tympanicMembrane: '' },
			notes: ''
		},
		pureToneAudiometry: {
			rightEar: {
				airConduction: { hz500: null, hz1000: null, hz2000: null, hz4000: null },
				boneConduction: { hz500: null, hz1000: null, hz2000: null, hz4000: null },
				pureToneAverage: null
			},
			leftEar: {
				airConduction: { hz500: null, hz1000: null, hz2000: null, hz4000: null },
				boneConduction: { hz500: null, hz1000: null, hz2000: null, hz4000: null },
				pureToneAverage: null
			},
			betterEarPureToneAverage: null,
			asymmetryDb: null,
			audiometryNotes: ''
		},
		speechAudiometry: {
			rightSrtDb: null,
			leftSrtDb: null,
			rightWordRecognitionPercent: null,
			leftWordRecognitionPercent: null,
			speechAudiometryNotes: ''
		},
		tympanometryAcousticReflexes: {
			rightTympanogram: '',
			leftTympanogram: '',
			rightAcousticReflexes: '',
			leftAcousticReflexes: '',
			notes: ''
		},
		vestibularScreening: {
			headImpulseTest: '',
			dixHallpike: '',
			rombergTest: '',
			tandemGait: '',
			nystagmus: '',
			fukudaSteppingTest: '',
			notes: ''
		},
		dizzinessHandicapInventory: emptyDhi(),
		clinicalImpressionReferral: {
			provisionalDiagnosis: '',
			hearingAidCandidate: '',
			vestibularRehabIndicated: '',
			ent_referral: '',
			neurologyReferral: '',
			imagingRequested: '',
			followUpWeeks: null,
			additionalNotes: ''
		}
	};
}

describe('Pure-tone audiometry grading', () => {
	it('returns unknown grade and null PTA for a blank assessment', () => {
		const r = calculatePureToneAudiometry(createBlankAssessment());
		expect(r.betterEarPta).toBeNull();
		expect(r.asymmetry).toBeNull();
		expect(r.hearingLossGrade).toBe('unknown');
	});

	it('computes the 4-frequency PTA and classifies normal hearing', () => {
		const d = createBlankAssessment();
		d.pureToneAudiometry.rightEar.airConduction = { hz500: 10, hz1000: 10, hz2000: 15, hz4000: 15 };
		d.pureToneAudiometry.leftEar.airConduction = { hz500: 10, hz1000: 10, hz2000: 10, hz4000: 10 };
		const r = calculatePureToneAudiometry(d);
		expect(r.rightPta).toBe(12.5);
		expect(r.leftPta).toBe(10);
		expect(r.betterEarPta).toBe(10);
		expect(r.hearingLossGrade).toBe('normal');
	});

	it('classifies profound hearing loss in the worse ear and grades on the better ear', () => {
		const d = createBlankAssessment();
		d.pureToneAudiometry.rightEar.airConduction = { hz500: 90, hz1000: 95, hz2000: 100, hz4000: 100 };
		d.pureToneAudiometry.leftEar.airConduction = { hz500: 30, hz1000: 30, hz2000: 30, hz4000: 30 };
		const r = calculatePureToneAudiometry(d);
		expect(r.rightHearingLossGrade).toBe('profound');
		expect(r.leftHearingLossGrade).toBe('mild');
		expect(r.betterEarPta).toBe(30);
		expect(r.hearingLossGrade).toBe('mild');
	});

	it('computes inter-aural asymmetry', () => {
		const d = createBlankAssessment();
		d.pureToneAudiometry.rightEar.airConduction = { hz500: 60, hz1000: 60, hz2000: 60, hz4000: 60 };
		d.pureToneAudiometry.leftEar.airConduction = { hz500: 20, hz1000: 20, hz2000: 20, hz4000: 20 };
		const r = calculatePureToneAudiometry(d);
		expect(r.asymmetry).toBe(40);
	});
});

describe('Dizziness Handicap Inventory scoring', () => {
	it('scores 0 for a blank inventory', () => {
		const r = calculateDhi(createBlankAssessment());
		expect(r.total).toBe(0);
		expect(r.answeredCount).toBe(0);
		expect(r.handicapLevel).toBe('no-handicap');
	});

	it('scores yes=4, sometimes=2, no=0 and classifies severe', () => {
		const d = createBlankAssessment();
		for (const item of DHI_ITEMS) d.dizzinessHandicapInventory['q' + item.num] = 'yes';
		const r = calculateDhi(d);
		expect(r.total).toBe(100);
		expect(r.answeredCount).toBe(25);
		expect(r.handicapLevel).toBe('severe');
	});

	it('accumulates per-subscale subtotals', () => {
		const d = createBlankAssessment();
		for (const item of DHI_ITEMS) d.dizzinessHandicapInventory['q' + item.num] = 'sometimes';
		const r = calculateDhi(d);
		// 9 functional, 9 emotional, 7 physical items @ 2 pts each
		expect(r.functional).toBe(18);
		expect(r.emotional).toBe(18);
		expect(r.physical).toBe(14);
		expect(r.total).toBe(50);
		expect(r.handicapLevel).toBe('moderate');
	});
});

describe('Flagged issues detection', () => {
	it('raises no flags for a blank assessment', () => {
		const data = createBlankAssessment();
		const result = grade(data);
		expect(result.additionalFlags).toHaveLength(0);
	});

	it('flags sudden hearing loss as urgent', () => {
		const data = createBlankAssessment();
		data.presentingSymptoms.hearingLoss = 'yes';
		data.presentingSymptoms.hearingLossOnset = 'sudden';
		const result = grade(data);
		const flag = result.additionalFlags.find((f) => f.id === 'FLAG-RED-001');
		expect(flag).toBeTruthy();
		expect(flag?.priority).toBe('urgent');
	});

	it('flags asymmetric hearing loss for retrocochlear screen', () => {
		const data = createBlankAssessment();
		data.pureToneAudiometry.rightEar.airConduction = { hz500: 60, hz1000: 60, hz2000: 60, hz4000: 60 };
		data.pureToneAudiometry.leftEar.airConduction = { hz500: 20, hz1000: 20, hz2000: 20, hz4000: 20 };
		const result = grade(data);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-PTA-001')).toBe(true);
	});

	it('flags positive Dix-Hallpike (BPPV)', () => {
		const data = createBlankAssessment();
		data.vestibularScreening.dixHallpike = 'positive-right';
		const result = grade(data);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-VEST-001')).toBe(true);
	});

	it('flags recurrent falls', () => {
		const data = createBlankAssessment();
		data.presentingSymptoms.falls = 'yes';
		data.presentingSymptoms.fallsLastYearCount = 3;
		const flags = detectAdditionalFlags(data, grade(data));
		expect(flags.some((f) => f.id === 'FLAG-FALL-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const data = createBlankAssessment();
		data.presentingSymptoms.neurologicalSymptoms = 'yes'; // urgent
		data.presentingSymptoms.tinnitus = 'yes'; // low
		data.vestibularScreening.rombergTest = 'abnormal'; // medium
		const flags = grade(data).additionalFlags;
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('produces unique flag IDs', () => {
		const data = createBlankAssessment();
		data.presentingSymptoms.hearingLoss = 'yes';
		data.presentingSymptoms.hearingLossOnset = 'sudden';
		data.presentingSymptoms.neurologicalSymptoms = 'yes';
		data.vestibularScreening.dixHallpike = 'positive-left';
		const ids = grade(data).additionalFlags.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
