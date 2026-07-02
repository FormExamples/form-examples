import { describe, it, expect } from 'vitest';
import { calculateRosierGrade } from './rosier-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { rosierRules } from './rosier-rules';
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
			symptomOnsetAt: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		precondition: { bloodGlucose: null, hypoglycaemiaCorrected: '' },
		mimics: { lossOfConsciousness: '', seizureActivity: '' },
		signs: {
			facialWeakness: '',
			armWeakness: '',
			legWeakness: '',
			speechDisturbance: '',
			visualFieldDefect: ''
		},
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		symptomOnsetAt: '2026-06-20T08:45'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageBand: '40-59', sex: 'male' };
	d.precondition = { bloodGlucose: 5.4, hypoglycaemiaCorrected: 'na' };
	d.mimics = { lossOfConsciousness: 'no', seizureActivity: 'no' };
	d.signs = {
		facialWeakness: 'no',
		armWeakness: 'no',
		legWeakness: 'no',
		speechDisturbance: 'no',
		visualFieldDefect: 'no'
	};
	return d;
}

describe('ROSIER grading engine', () => {
	it('scores 0 for a fully-negative patient (stroke unlikely)', () => {
		const r = calculateRosierGrade(createNegativePatient());
		expect(r.rosierScore).toBe(0);
		expect(r.band).toBe('stroke-unlikely');
	});

	it('the > 0 threshold is strict: exactly 0 is stroke-unlikely, +1 is stroke-likely', () => {
		// One sign (+1) and one mimic (-1) → total 0 → unlikely.
		const zero = createNegativePatient();
		zero.signs.facialWeakness = 'yes';
		zero.mimics.seizureActivity = 'yes';
		const rz = calculateRosierGrade(zero);
		expect(rz.rosierScore).toBe(0);
		expect(rz.band).toBe('stroke-unlikely');

		// One sign (+1), no mimic → total +1 → likely.
		const one = createNegativePatient();
		one.signs.facialWeakness = 'yes';
		const ro = calculateRosierGrade(one);
		expect(ro.rosierScore).toBe(1);
		expect(ro.band).toBe('stroke-likely');
	});

	it('each mimic subtracts 1 point', () => {
		const d = createNegativePatient();
		d.mimics.lossOfConsciousness = 'yes';
		expect(calculateRosierGrade(d).lossOfConsciousnessPoint).toBe(-1);
		d.mimics.seizureActivity = 'yes';
		const r = calculateRosierGrade(d);
		expect(r.seizureActivityPoint).toBe(-1);
		expect(r.rosierScore).toBe(-2);
		expect(r.band).toBe('stroke-unlikely');
	});

	it('each sign adds 1 point', () => {
		const d = createNegativePatient();
		d.signs.facialWeakness = 'yes';
		d.signs.armWeakness = 'yes';
		d.signs.legWeakness = 'yes';
		d.signs.speechDisturbance = 'yes';
		d.signs.visualFieldDefect = 'yes';
		const r = calculateRosierGrade(d);
		expect(r.facialWeaknessPoint).toBe(1);
		expect(r.armWeaknessPoint).toBe(1);
		expect(r.legWeaknessPoint).toBe(1);
		expect(r.speechDisturbancePoint).toBe(1);
		expect(r.visualFieldDefectPoint).toBe(1);
	});

	it('reaches the -2 extreme (both mimics, no sign)', () => {
		const d = createNegativePatient();
		d.mimics.lossOfConsciousness = 'yes';
		d.mimics.seizureActivity = 'yes';
		expect(calculateRosierGrade(d).rosierScore).toBe(-2);
	});

	it('reaches the +5 extreme (all five signs, no mimic)', () => {
		const d = createNegativePatient();
		d.signs.facialWeakness = 'yes';
		d.signs.armWeakness = 'yes';
		d.signs.legWeakness = 'yes';
		d.signs.speechDisturbance = 'yes';
		d.signs.visualFieldDefect = 'yes';
		const r = calculateRosierGrade(d);
		expect(r.rosierScore).toBe(5);
		expect(r.band).toBe('stroke-likely');
	});

	it('an unanswered criterion contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateRosierGrade(d);
		expect(r.rosierScore).toBe(0);
		expect(r.band).toBe('stroke-unlikely');
	});

	it('all rule IDs are unique', () => {
		const ids = rosierRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('ROSIER flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the activate-stroke-pathway flag when the score is positive', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 2);
		expect(flags.some((f) => f.id === 'F-ACTIVATE-STROKE-PATHWAY-001')).toBe(true);
	});

	it('raises the hypoglycaemia flag at glucose 3.4 but not at 3.5', () => {
		const low = createNegativePatient();
		low.precondition.bloodGlucose = 3.4;
		expect(detectFlaggedIssues(low, 0).some((f) => f.id === 'F-HYPOGLYCAEMIA-MIMIC-001')).toBe(
			true
		);

		const ok = createNegativePatient();
		ok.precondition.bloodGlucose = 3.5;
		expect(detectFlaggedIssues(ok, 0).some((f) => f.id === 'F-HYPOGLYCAEMIA-MIMIC-001')).toBe(
			false
		);
	});

	it('raises the seizure/LOC caution flag when a mimic is present', () => {
		const d = createNegativePatient();
		d.mimics.seizureActivity = 'yes';
		expect(detectFlaggedIssues(d, -1).some((f) => f.id === 'F-SEIZURE-LOC-CAUTION-001')).toBe(true);
	});

	it('raises the clinical-suspicion override when a sign is present but the total is <= 0', () => {
		const d = createNegativePatient();
		d.signs.facialWeakness = 'yes';
		d.mimics.seizureActivity = 'yes'; // net 0
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-CLINICAL-SUSPICION-OVERRIDE-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when inputs are missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.precondition.bloodGlucose = 3.0; // high
		d.mimics.seizureActivity = 'yes'; // medium
		const flags = detectFlaggedIssues(d, 1);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
