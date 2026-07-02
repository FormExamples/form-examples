import { describe, it, expect } from 'vitest';
import { calculateCssrsGrade, evaluateCriteria } from './cssrs-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { cssrsRules } from './cssrs-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			assessedAt: '',
			careSetting: '',
			scaleVersion: '',
			reasonForAssessment: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		ideation: {
			wishToBeDead: '',
			nonSpecificActiveThoughts: '',
			activeIdeationMethods: '',
			activeIdeationIntent: '',
			activeIdeationPlan: '',
			ideationTimeframe: ''
		},
		intensity: {
			ideationFrequency: null,
			ideationDuration: null,
			ideationControllability: null,
			ideationDeterrents: null,
			ideationReasons: null
		},
		behaviour: {
			actualAttempt: '',
			interruptedAttempt: '',
			abortedAttempt: '',
			preparatoryActs: '',
			nonSuicidalSelfInjury: '',
			behaviourRecency: '',
			lifetimeAttemptCount: null,
			mostRecentAttemptDate: ''
		},
		lethality: {
			actualLethality: null,
			potentialLethality: null
		},
		means: {
			accessToLethalMeans: '',
			protectiveFactors: ''
		},
		summary: {
			clinicalNote: ''
		}
	};
}

/** A patient identified but with no ideation or behaviour reported. */
function createBaseline(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Osei',
		clinicianRole: 'clinician',
		assessedAt: '2026-06-24T09:30',
		careSetting: 'mental-health',
		scaleVersion: 'full',
		reasonForAssessment: 'Routine mental-health review'
	};
	d.identification = { patientIdentifier: 'MH-100482', ageBand: 'adult', sex: 'female' };
	return d;
}

describe('C-SSRS classification engine — ideation levels', () => {
	it('classifies ideation level 0 (none) as low risk', () => {
		const d = createBaseline();
		d.ideation.wishToBeDead = 'no';
		d.ideation.nonSpecificActiveThoughts = 'no';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(0);
		expect(r.riskTier).toBe('low');
	});

	it('level 1 (wish to be dead) is low risk', () => {
		const d = createBaseline();
		d.ideation.wishToBeDead = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(1);
		expect(r.riskTier).toBe('low');
	});

	it('level 2 (non-specific active thoughts) is low risk', () => {
		const d = createBaseline();
		d.ideation.nonSpecificActiveThoughts = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(2);
		expect(r.riskTier).toBe('low');
	});

	it('level 3 (active with methods) is moderate risk', () => {
		const d = createBaseline();
		d.ideation.activeIdeationMethods = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(3);
		expect(r.riskTier).toBe('moderate');
	});

	it('level 4 (active with intent) is high risk', () => {
		const d = createBaseline();
		d.ideation.activeIdeationIntent = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(4);
		expect(r.riskTier).toBe('high');
	});

	it('level 5 (active with plan and intent) is high risk', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(5);
		expect(r.riskTier).toBe('high');
	});

	it('takes the highest affirmative ideation item even with gaps below', () => {
		const d = createBaseline();
		d.ideation.wishToBeDead = 'yes';
		d.ideation.activeIdeationMethods = 'no';
		d.ideation.activeIdeationIntent = 'yes'; // level 4 set despite level 3 = no
		const r = calculateCssrsGrade(d);
		expect(r.ideationLevel).toBe(4);
	});
});

describe('C-SSRS classification engine — behaviour and lethality', () => {
	it('non-recent suicidal behaviour alone is moderate risk', () => {
		const d = createBaseline();
		d.behaviour.actualAttempt = 'yes';
		d.behaviour.behaviourRecency = 'over-3-months';
		const r = calculateCssrsGrade(d);
		expect(r.suicidalBehaviourPresent).toBe(true);
		expect(r.recentBehaviour).toBe(false);
		expect(r.riskTier).toBe('moderate');
	});

	it('recent suicidal behaviour (within 3 months) is high risk', () => {
		const d = createBaseline();
		d.behaviour.interruptedAttempt = 'yes';
		d.behaviour.behaviourRecency = 'within-3-months';
		const r = calculateCssrsGrade(d);
		expect(r.recentBehaviour).toBe(true);
		expect(r.riskTier).toBe('high');
	});

	it('preparatory acts count as suicidal behaviour', () => {
		const d = createBaseline();
		d.behaviour.preparatoryActs = 'yes';
		d.behaviour.behaviourRecency = 'over-3-months';
		expect(calculateCssrsGrade(d).suicidalBehaviourPresent).toBe(true);
	});

	it('non-suicidal self-injury does NOT count as suicidal behaviour', () => {
		const d = createBaseline();
		d.behaviour.nonSuicidalSelfInjury = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.suicidalBehaviourPresent).toBe(false);
		expect(r.riskTier).toBe('low');
	});

	it('high actual lethality (>= 3) is high risk', () => {
		const d = createBaseline();
		d.behaviour.actualAttempt = 'yes';
		d.behaviour.behaviourRecency = 'over-3-months';
		d.lethality.actualLethality = 3;
		const r = calculateCssrsGrade(d);
		expect(r.highLethality).toBe(true);
		expect(r.riskTier).toBe('high');
	});

	it('actual lethality of 2 is not high lethality', () => {
		const d = createBaseline();
		d.lethality.actualLethality = 2;
		expect(calculateCssrsGrade(d).highLethality).toBe(false);
	});

	it('potential lethality of 2 is high lethality', () => {
		const d = createBaseline();
		d.lethality.actualLethality = 0;
		d.lethality.potentialLethality = 2;
		const r = calculateCssrsGrade(d);
		expect(r.highLethality).toBe(true);
		expect(r.riskTier).toBe('high');
	});

	it('potential lethality of 1 is not high lethality', () => {
		const d = createBaseline();
		d.lethality.actualLethality = 0;
		d.lethality.potentialLethality = 1;
		expect(calculateCssrsGrade(d).highLethality).toBe(false);
	});
});

describe('C-SSRS classification engine — audit trail', () => {
	it('records a tier audit row', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.firedCriteria.some((f) => f.criterion === 'tier')).toBe(true);
	});

	it('evaluateCriteria fires only affirmative rows', () => {
		const d = createBaseline();
		d.ideation.wishToBeDead = 'yes';
		const fired = evaluateCriteria(d);
		expect(fired.some((f) => f.id === 'R-IDEATION-01')).toBe(true);
		expect(fired.some((f) => f.id === 'R-IDEATION-05')).toBe(false);
	});

	it('all rule IDs are unique', () => {
		const ids = cssrsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('provides a management recommendation for every tier', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes';
		expect(calculateCssrsGrade(d).managementRecommendation.length).toBeGreaterThan(0);
	});
});

describe('C-SSRS flagged-issue detection', () => {
	it('raises the crisis-response flag for a high-risk screen', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-CRISIS-RESPONSE-001')).toBe(true);
	});

	it('raises the active-plan-and-intent flag at ideation level 5', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ACTIVE-PLAN-INTENT-001')).toBe(true);
	});

	it('raises the recent-attempt flag for an actual attempt within 3 months', () => {
		const d = createBaseline();
		d.behaviour.actualAttempt = 'yes';
		d.behaviour.behaviourRecency = 'within-3-months';
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-RECENT-ATTEMPT-001')).toBe(true);
	});

	it('raises the high-lethality flag', () => {
		const d = createBaseline();
		d.behaviour.actualAttempt = 'yes';
		d.behaviour.behaviourRecency = 'over-3-months';
		d.lethality.actualLethality = 4;
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HIGH-LETHALITY-001')).toBe(true);
	});

	it('raises the access-to-means flag', () => {
		const d = createBaseline();
		d.means.accessToLethalMeans = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ACCESS-TO-MEANS-001')).toBe(true);
	});

	it('raises the NSSI flag', () => {
		const d = createBaseline();
		d.behaviour.nonSuicidalSelfInjury = 'yes';
		const r = calculateCssrsGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-NON-SUICIDAL-SELF-INJURY-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag for a blank assessment', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), {
			ideationLevel: 0,
			suicidalBehaviourPresent: false,
			recentBehaviour: false,
			highLethality: false,
			riskTier: 'low'
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createBaseline();
		d.ideation.activeIdeationPlan = 'yes'; // high flags
		d.behaviour.preparatoryActs = 'yes'; // medium flag
		const r = calculateCssrsGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
