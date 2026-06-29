import { describe, it, expect } from 'vitest';
import { calculateSadGrade } from './sad-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { spaqItems, phq9Items, classifySpaq, classifyPhq9 } from './sad-rules';
import type { AssessmentData } from './types';

/** A fully-blank assessment, built inline so the engine tests have no
 *  dependency on the SvelteKit store (which imports `$app/environment`). */
function blank(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			latitude: '',
			country: '',
			yearsAtCurrentLatitude: null
		},
		seasonalPatternHistory: {
			symptomsRecurAnnually: '',
			worstMonths: '',
			bestMonths: '',
			yearsAffected: null,
			familyHistorySad: '',
			firstOnsetAge: ''
		},
		currentMood: {
			phq9: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null, q9: null },
			difficultyLevel: ''
		},
		sleepEnergy: {
			spaq: { sleepLength: null, energyLevel: null },
			hoursSleptWinter: null,
			hoursSleptSummer: null,
			hypersomnia: '',
			morningFatigue: '',
			energyNotes: ''
		},
		appetiteWeight: {
			spaq: { appetite: null, weight: null },
			carbohydrateCraving: '',
			winterWeightChangeKg: null,
			eatingPatternChanges: ''
		},
		socialOccupational: {
			spaq: { mood: null, socialActivity: null },
			workImpaired: '',
			relationshipsImpaired: '',
			socialWithdrawal: '',
			occupationalNotes: ''
		},
		lightExposure: {
			dailyOutdoorMinutes: null,
			workIndoors: '',
			curtainsClosedDaytime: '',
			sunriseExposure: '',
			usesLightTherapyBox: '',
			lightTherapyDetails: '',
			lightTherapyAccess: ''
		},
		previousTreatments: {
			antidepressants: '',
			antidepressantDetails: '',
			psychotherapy: '',
			psychotherapyDetails: '',
			lightTherapyHistory: '',
			lightTherapyHistoryDetails: '',
			currentTreatment: '',
			currentTreatmentDetails: ''
		},
		riskAssessment: {
			suicidalIdeation: '',
			suicidalIntent: '',
			suicidalPlan: '',
			selfHarm: '',
			selfHarmDetails: '',
			previousAttempt: '',
			protectiveFactors: '',
			safetyPlanInPlace: ''
		},
		treatmentPlan: {
			planLightTherapy: '',
			planAntidepressant: '',
			planPsychotherapy: '',
			planLifestyle: '',
			planCrisisReferral: '',
			followUpInterval: '',
			clinicianNotes: ''
		}
	};
}

describe('SAD grading engine', () => {
	it('returns no-sad for a fully blank assessment', () => {
		const r = calculateSadGrade(blank());
		expect(r.spaqScore).toBe(0);
		expect(r.spaqBand).toBe('no-sad');
		expect(r.phq9Score).toBe(0);
		expect(r.phq9Band).toBe('minimal');
		expect(r.combinedSeverity).toBe('no-sad');
		expect(r.firedRules).toHaveLength(0);
	});

	it('sums the six SPAQ items into the 0-24 GSS', () => {
		const d = blank();
		d.sleepEnergy.spaq.sleepLength = 4;
		d.sleepEnergy.spaq.energyLevel = 4;
		d.socialOccupational.spaq.mood = 4;
		d.socialOccupational.spaq.socialActivity = 4;
		d.appetiteWeight.spaq.appetite = 2;
		d.appetiteWeight.spaq.weight = 2;
		const r = calculateSadGrade(d);
		expect(r.spaqScore).toBe(20);
		expect(r.spaqBand).toBe('sad-likely');
	});

	it('sums the nine PHQ-9 items into the 0-27 score', () => {
		const d = blank();
		d.currentMood.phq9.q1 = 2;
		d.currentMood.phq9.q2 = 2;
		d.currentMood.phq9.q3 = 1;
		const r = calculateSadGrade(d);
		expect(r.phq9Score).toBe(5);
		expect(r.phq9Band).toBe('mild');
	});

	it('classifies mild from subsyndromal SPAQ', () => {
		const d = blank();
		d.sleepEnergy.spaq.sleepLength = 3;
		d.sleepEnergy.spaq.energyLevel = 3;
		d.socialOccupational.spaq.mood = 3;
		const r = calculateSadGrade(d);
		expect(r.spaqScore).toBe(9);
		expect(r.spaqBand).toBe('subsyndromal');
		expect(r.combinedSeverity).toBe('mild');
	});

	it('classifies moderate from SAD-likely SPAQ', () => {
		const d = blank();
		for (const item of spaqItems) {
			const sub = d[item.section] as unknown as Record<string, Record<string, number | null>>;
			sub[item.subsection][item.field] = 2;
		}
		const r = calculateSadGrade(d);
		expect(r.spaqScore).toBe(12);
		expect(r.spaqBand).toBe('sad-likely');
		expect(r.combinedSeverity).toBe('moderate');
	});

	it('escalates to critical on PHQ-9 item 9', () => {
		const d = blank();
		d.currentMood.phq9.q9 = 1;
		const r = calculateSadGrade(d);
		expect(r.combinedSeverity).toBe('critical');
	});

	it('escalates to critical on suicidal ideation', () => {
		const d = blank();
		d.riskAssessment.suicidalIdeation = 'yes';
		const r = calculateSadGrade(d);
		expect(r.combinedSeverity).toBe('critical');
	});

	it('escalates to critical on PHQ-9 total >= 20', () => {
		const d = blank();
		d.currentMood.phq9.q1 = 3;
		d.currentMood.phq9.q2 = 3;
		d.currentMood.phq9.q3 = 3;
		d.currentMood.phq9.q4 = 3;
		d.currentMood.phq9.q5 = 3;
		d.currentMood.phq9.q6 = 3;
		d.currentMood.phq9.q7 = 2;
		const r = calculateSadGrade(d);
		expect(r.phq9Score).toBe(20);
		expect(r.combinedSeverity).toBe('critical');
	});

	it('has unique SPAQ + PHQ item ids', () => {
		const ids = [...spaqItems.map((i) => i.id), ...phq9Items.map((i) => i.id)];
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('SPAQ / PHQ-9 band classifiers', () => {
	it('classifies SPAQ bands at the boundaries', () => {
		expect(classifySpaq(7)).toBe('no-sad');
		expect(classifySpaq(8)).toBe('subsyndromal');
		expect(classifySpaq(10)).toBe('subsyndromal');
		expect(classifySpaq(11)).toBe('sad-likely');
	});
	it('classifies PHQ-9 bands at the boundaries', () => {
		expect(classifyPhq9(4)).toBe('minimal');
		expect(classifyPhq9(9)).toBe('mild');
		expect(classifyPhq9(14)).toBe('moderate');
		expect(classifyPhq9(19)).toBe('moderately-severe');
		expect(classifyPhq9(20)).toBe('severe');
	});
});

describe('SAD flagged issues', () => {
	it('returns no flags for a blank assessment', () => {
		const d = blank();
		const flags = detectAdditionalFlags(d, {
			phq9Score: 0,
			spaqBand: 'no-sad',
			combinedSeverity: 'no-sad'
		});
		expect(flags).toHaveLength(0);
	});

	it('flags active suicidal ideation as high priority', () => {
		const d = blank();
		d.riskAssessment.suicidalIdeation = 'yes';
		const flags = detectAdditionalFlags(d, {
			phq9Score: 0,
			spaqBand: 'no-sad',
			combinedSeverity: 'critical'
		});
		expect(flags.some((f) => f.id === 'FLAG-RISK-001' && f.priority === 'high')).toBe(true);
	});

	it('flags low daily outdoor light exposure', () => {
		const d = blank();
		d.lightExposure.dailyOutdoorMinutes = 10;
		const flags = detectAdditionalFlags(d, {
			phq9Score: 0,
			spaqBand: 'no-sad',
			combinedSeverity: 'no-sad'
		});
		expect(flags.some((f) => f.id === 'FLAG-LIFE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = blank();
		d.riskAssessment.suicidalIdeation = 'yes';
		d.lightExposure.workIndoors = 'yes';
		const flags = detectAdditionalFlags(d, {
			phq9Score: 0,
			spaqBand: 'no-sad',
			combinedSeverity: 'critical'
		});
		const order = { high: 0, medium: 1, low: 2 };
		const ps = flags.map((f) => f.priority);
		expect(ps).toEqual([...ps].sort((a, b) => order[a] - order[b]));
	});
});
