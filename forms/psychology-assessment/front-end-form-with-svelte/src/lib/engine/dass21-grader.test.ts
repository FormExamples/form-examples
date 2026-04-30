import { describe, expect, it } from 'vitest';
import { calculateDass21 } from './dass21-grader';
import { dass21Rules } from './dass21-rules';
import { detectAdditionalFlags } from './flagged-issues';
import type { AssessmentData, DassItem } from './types';

function emptyAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: 'Sam',
			lastName: 'Patient',
			dateOfBirth: '1990-01-01',
			sex: 'other',
			occupation: ''
		},
		reasonForAssessment: {
			reason: 'self-referral',
			reasonDetails: '',
			primaryConcern: '',
			symptomDurationWeeks: null
		},
		dassDepression: {
			item3CouldNotExperiencePositive: 0,
			item5DifficultInitiating: 0,
			item10NothingToLookForwardTo: 0,
			item13DownheartedBlue: 0,
			item16UnableToBecomeEnthusiastic: 0,
			item17NotWorthMuch: 0,
			item21LifeMeaningless: 0
		},
		dassAnxiety: {
			item2DrynessOfMouth: 0,
			item4BreathingDifficulty: 0,
			item7Trembling: 0,
			item9PanicWorry: 0,
			item15ClosedToPanic: 0,
			item19HeartActionAware: 0,
			item20ScaredWithoutReason: 0
		},
		dassStress: {
			item1HardToWindDown: 0,
			item6OverReact: 0,
			item8NervousEnergy: 0,
			item11AgitatedEasily: 0,
			item12DifficultToRelax: 0,
			item14Intolerant: 0,
			item18TouchyEasily: 0
		},
		functionalImpact: {
			workImpact: 'none',
			relationshipImpact: 'none',
			dailyActivitiesImpact: 'none',
			sleepImpact: 'none',
			notes: ''
		},
		riskScreen: {
			suicidalIdeation: 'no',
			suicidalIdeationDetails: '',
			selfHarm: 'no',
			harmToOthers: 'no',
			psychiatricEmergencyHistory: 'no',
			hasSafetyPlan: 'yes'
		},
		supportAndHistory: {
			previousMentalHealthCare: 'no',
			previousMentalHealthDetails: '',
			currentlyInTreatment: 'no',
			currentTreatmentDetails: '',
			currentMedications: '',
			familyMentalHealthHistory: 'no',
			familyMentalHealthDetails: '',
			socialSupport: 'adequate',
			substanceUseConcern: 'no'
		}
	};
}

function setSubscale(
	d: AssessmentData,
	subscale: 'depression' | 'anxiety' | 'stress',
	value: DassItem
) {
	if (subscale === 'depression') {
		d.dassDepression = {
			item3CouldNotExperiencePositive: value,
			item5DifficultInitiating: value,
			item10NothingToLookForwardTo: value,
			item13DownheartedBlue: value,
			item16UnableToBecomeEnthusiastic: value,
			item17NotWorthMuch: value,
			item21LifeMeaningless: value
		};
	} else if (subscale === 'anxiety') {
		d.dassAnxiety = {
			item2DrynessOfMouth: value,
			item4BreathingDifficulty: value,
			item7Trembling: value,
			item9PanicWorry: value,
			item15ClosedToPanic: value,
			item19HeartActionAware: value,
			item20ScaredWithoutReason: value
		};
	} else {
		d.dassStress = {
			item1HardToWindDown: value,
			item6OverReact: value,
			item8NervousEnergy: value,
			item11AgitatedEasily: value,
			item12DifficultToRelax: value,
			item14Intolerant: value,
			item18TouchyEasily: value
		};
	}
}

describe('DASS-21 Scoring Engine', () => {
	it('rule set has 21 items split 7/7/7 across subscales', () => {
		expect(dass21Rules).toHaveLength(21);
		const counts = { depression: 0, anxiety: 0, stress: 0 };
		for (const r of dass21Rules) counts[r.subscale]++;
		expect(counts).toEqual({ depression: 7, anxiety: 7, stress: 7 });
	});

	it('all rule IDs are unique', () => {
		const ids = dass21Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('returns Normal for all-zero responses', () => {
		const data = emptyAssessment();
		const r = calculateDass21(data);
		expect(r.depression.raw).toBe(0);
		expect(r.depression.scaled).toBe(0);
		expect(r.depression.severity).toBe('normal');
		expect(r.anxiety.severity).toBe('normal');
		expect(r.stress.severity).toBe('normal');
		expect(r.firedRules).toHaveLength(21);
	});

	it('returns Extremely Severe for all-3 responses on every subscale', () => {
		const data = emptyAssessment();
		setSubscale(data, 'depression', 3);
		setSubscale(data, 'anxiety', 3);
		setSubscale(data, 'stress', 3);
		const r = calculateDass21(data);
		expect(r.depression.raw).toBe(21);
		expect(r.depression.scaled).toBe(42);
		expect(r.depression.severity).toBe('extremely-severe');
		expect(r.anxiety.scaled).toBe(42);
		expect(r.anxiety.severity).toBe('extremely-severe');
		expect(r.stress.scaled).toBe(42);
		expect(r.stress.severity).toBe('extremely-severe');
	});

	it('classifies depression cutoffs correctly (doubled scores)', () => {
		// Depression cutoffs: 0-9 normal, 10-13 mild, 14-20 moderate, 21-27 severe, 28+ extremely severe
		const data = emptyAssessment();
		// raw=5 → scaled=10 → mild
		setSubscale(data, 'depression', 0);
		data.dassDepression.item3CouldNotExperiencePositive = 2;
		data.dassDepression.item5DifficultInitiating = 3;
		let r = calculateDass21(data);
		expect(r.depression.scaled).toBe(10);
		expect(r.depression.severity).toBe('mild');

		// raw=7 → scaled=14 → moderate
		setSubscale(data, 'depression', 1);
		r = calculateDass21(data);
		expect(r.depression.scaled).toBe(14);
		expect(r.depression.severity).toBe('moderate');

		// raw=11 → scaled=22 → severe
		setSubscale(data, 'depression', 0);
		data.dassDepression.item3CouldNotExperiencePositive = 2;
		data.dassDepression.item5DifficultInitiating = 2;
		data.dassDepression.item10NothingToLookForwardTo = 2;
		data.dassDepression.item13DownheartedBlue = 2;
		data.dassDepression.item16UnableToBecomeEnthusiastic = 3;
		r = calculateDass21(data);
		expect(r.depression.scaled).toBe(22);
		expect(r.depression.severity).toBe('severe');
	});

	it('classifies anxiety cutoffs correctly (doubled scores)', () => {
		// Anxiety cutoffs: 0-7 normal, 8-9 mild, 10-14 moderate, 15-19 severe, 20+ extremely severe
		const data = emptyAssessment();
		// raw=4 → scaled=8 → mild
		setSubscale(data, 'anxiety', 0);
		data.dassAnxiety.item2DrynessOfMouth = 1;
		data.dassAnxiety.item4BreathingDifficulty = 1;
		data.dassAnxiety.item7Trembling = 1;
		data.dassAnxiety.item9PanicWorry = 1;
		let r = calculateDass21(data);
		expect(r.anxiety.scaled).toBe(8);
		expect(r.anxiety.severity).toBe('mild');

		// raw=10 → scaled=20 → extremely severe
		setSubscale(data, 'anxiety', 1);
		data.dassAnxiety.item2DrynessOfMouth = 2;
		data.dassAnxiety.item4BreathingDifficulty = 2;
		data.dassAnxiety.item7Trembling = 2;
		r = calculateDass21(data);
		expect(r.anxiety.scaled).toBe(20);
		expect(r.anxiety.severity).toBe('extremely-severe');
	});

	it('classifies stress cutoffs correctly (doubled scores)', () => {
		// Stress cutoffs: 0-14 normal, 15-18 mild, 19-25 moderate, 26-33 severe, 34+ extremely severe
		const data = emptyAssessment();
		// raw=8 → scaled=16 → mild
		setSubscale(data, 'stress', 0);
		data.dassStress.item1HardToWindDown = 2;
		data.dassStress.item6OverReact = 2;
		data.dassStress.item8NervousEnergy = 2;
		data.dassStress.item11AgitatedEasily = 2;
		let r = calculateDass21(data);
		expect(r.stress.scaled).toBe(16);
		expect(r.stress.severity).toBe('mild');

		// raw=14 → scaled=28 → severe
		setSubscale(data, 'stress', 2);
		r = calculateDass21(data);
		expect(r.stress.scaled).toBe(28);
		expect(r.stress.severity).toBe('severe');
	});

	it('treats null items as unanswered (not summed, not counted)', () => {
		const data = emptyAssessment();
		setSubscale(data, 'depression', null);
		const r = calculateDass21(data);
		expect(r.depression.raw).toBe(0);
		expect(r.depression.answered).toBe(0);
		// firedRules excludes the unanswered depression items but still has anxiety+stress
		expect(r.firedRules.filter((f) => f.subscale === 'depression')).toHaveLength(0);
		expect(r.firedRules.filter((f) => f.subscale === 'anxiety')).toHaveLength(7);
		expect(r.firedRules.filter((f) => f.subscale === 'stress')).toHaveLength(7);
	});
});

describe('Flag Detection', () => {
	it('returns no flags for a normal-range patient with no risk', () => {
		const data = emptyAssessment();
		const r = calculateDass21(data);
		const flags = detectAdditionalFlags(data, r.depression, r.anxiety, r.stress);
		expect(flags).toHaveLength(0);
	});

	it('escalates suicidal ideation to URGENT', () => {
		const data = emptyAssessment();
		data.riskScreen.suicidalIdeation = 'yes';
		const r = calculateDass21(data);
		const flags = detectAdditionalFlags(data, r.depression, r.anxiety, r.stress);
		const urgent = flags.find((f) => f.id === 'FLAG-RISK-001');
		expect(urgent).toBeDefined();
		expect(urgent?.priority).toBe('urgent');
		// Ensure urgent sorts first
		expect(flags[0].priority).toBe('urgent');
	});

	it('flags extremely severe depression', () => {
		const data = emptyAssessment();
		setSubscale(data, 'depression', 3);
		const r = calculateDass21(data);
		const flags = detectAdditionalFlags(data, r.depression, r.anxiety, r.stress);
		expect(flags.some((f) => f.id === 'FLAG-DASS-D-001')).toBe(true);
	});

	it('flags multi-domain severe functional impact', () => {
		const data = emptyAssessment();
		data.functionalImpact.workImpact = 'severe';
		data.functionalImpact.relationshipImpact = 'severe';
		const r = calculateDass21(data);
		const flags = detectAdditionalFlags(data, r.depression, r.anxiety, r.stress);
		expect(flags.some((f) => f.id === 'FLAG-FUNC-001')).toBe(true);
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const data = emptyAssessment();
		data.riskScreen.suicidalIdeation = 'yes';
		data.riskScreen.selfHarm = 'yes';
		setSubscale(data, 'anxiety', 3);
		data.functionalImpact.workImpact = 'severe';
		data.supportAndHistory.socialSupport = 'isolated';
		const r = calculateDass21(data);
		const flags = detectAdditionalFlags(data, r.depression, r.anxiety, r.stress);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
