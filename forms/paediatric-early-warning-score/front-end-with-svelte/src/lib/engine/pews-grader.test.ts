import { describe, it, expect } from 'vitest';
import { gradePews, computeSubscores } from './pews-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	scoreRespiratoryRate,
	scoreHeartRate,
	scoreOxygenSaturation,
	scoreSupplementalOxygen,
	scoreCapillaryRefill,
	scoreConsciousness,
	scoreRespiratoryEffort
} from './pews-rules';
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
			observationAt: '',
			careSetting: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		respiratory: {
			respiratoryRate: null,
			respiratoryEffort: '',
			oxygenSaturation: null,
			supplementalOxygen: ''
		},
		cardiovascular: {
			heartRate: null,
			capillaryRefill: ''
		},
		behaviour: {
			consciousness: ''
		},
		concern: {
			nurseConcern: '',
			parentConcern: ''
		},
		note: {
			clinicalNotes: ''
		}
	};
}

/** A fully-answered, all-normal (aggregate 0) child observation set. */
function createNormalChild(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Okafor',
		clinicianRole: 'nurse',
		observationAt: '2026-06-20T09:30',
		careSetting: 'ward'
	};
	d.identification.patientIdentifier = 'PT-0001';
	d.identification.ageBand = 'child'; // RR normal 18-30 | HR normal 70-120
	d.respiratory.respiratoryRate = 24; // 0
	d.respiratory.respiratoryEffort = 'none'; // 0
	d.respiratory.oxygenSaturation = 98; // 0
	d.respiratory.supplementalOxygen = 'room-air'; // 0
	d.cardiovascular.heartRate = 90; // 0
	d.cardiovascular.capillaryRefill = 'under-2s'; // 0
	d.behaviour.consciousness = 'alert'; // 0
	d.concern.nurseConcern = 'no';
	d.concern.parentConcern = 'no';
	return d;
}

describe('PEWS age-band rate scoring (the key logic)', () => {
	it('scores respiratory rate against the SELECTED age band', () => {
		// RR of 40 is normal (0) for a neonate but grossly abnormal for an adolescent.
		expect(scoreRespiratoryRate(40, 'neonate')).toBe(0); // neonate normal 40-60
		expect(scoreRespiratoryRate(40, 'infant')).toBe(0); // infant normal 30-50
		expect(scoreRespiratoryRate(40, 'young-child')).toBe(0); // normal 20-40
		expect(scoreRespiratoryRate(40, 'child')).toBe(1); // normal 18-30, 31-40 -> 1
		expect(scoreRespiratoryRate(40, 'adolescent')).toBe(3); // normal 12-20, >=30 -> 3
	});

	it('scores heart rate against the SELECTED age band', () => {
		// HR of 150 is normal for a neonate/infant but tachycardic for an adolescent.
		expect(scoreHeartRate(150, 'neonate')).toBe(0); // neonate normal 110-160
		expect(scoreHeartRate(150, 'infant')).toBe(0); // infant normal 100-160
		expect(scoreHeartRate(150, 'young-child')).toBe(1); // normal 90-140, 141-160 -> 1
		expect(scoreHeartRate(150, 'child')).toBe(2); // normal 70-120, 141-160 -> 2
		expect(scoreHeartRate(150, 'adolescent')).toBe(3); // normal 60-100, >=140 -> 3
	});

	it('rate parameters are unscored (null) when no age band is set', () => {
		expect(scoreRespiratoryRate(24, '')).toBeNull();
		expect(scoreHeartRate(90, '')).toBeNull();
	});

	it('respiratory-rate band boundaries for a child', () => {
		expect(scoreRespiratoryRate(7, 'child')).toBe(3);
		expect(scoreRespiratoryRate(12, 'child')).toBe(2);
		expect(scoreRespiratoryRate(17, 'child')).toBe(1);
		expect(scoreRespiratoryRate(18, 'child')).toBe(0);
		expect(scoreRespiratoryRate(30, 'child')).toBe(0);
		expect(scoreRespiratoryRate(31, 'child')).toBe(1);
		expect(scoreRespiratoryRate(50, 'child')).toBe(2);
		expect(scoreRespiratoryRate(51, 'child')).toBe(3);
		expect(scoreRespiratoryRate(null, 'child')).toBeNull();
	});

	it('heart-rate band boundaries for an adolescent', () => {
		expect(scoreHeartRate(39, 'adolescent')).toBe(3);
		expect(scoreHeartRate(49, 'adolescent')).toBe(2);
		expect(scoreHeartRate(59, 'adolescent')).toBe(1);
		expect(scoreHeartRate(60, 'adolescent')).toBe(0);
		expect(scoreHeartRate(100, 'adolescent')).toBe(0);
		expect(scoreHeartRate(120, 'adolescent')).toBe(1);
		expect(scoreHeartRate(140, 'adolescent')).toBe(2);
		expect(scoreHeartRate(141, 'adolescent')).toBe(3);
	});
});

describe('PEWS non-rate parameter scoring bands', () => {
	it('respiratory effort', () => {
		expect(scoreRespiratoryEffort('none')).toBe(0);
		expect(scoreRespiratoryEffort('mild')).toBe(1);
		expect(scoreRespiratoryEffort('moderate')).toBe(2);
		expect(scoreRespiratoryEffort('severe')).toBe(3);
		expect(scoreRespiratoryEffort('')).toBeNull();
	});

	it('oxygen saturation', () => {
		expect(scoreOxygenSaturation(96)).toBe(0);
		expect(scoreOxygenSaturation(95)).toBe(1);
		expect(scoreOxygenSaturation(93)).toBe(2);
		expect(scoreOxygenSaturation(91)).toBe(3);
		expect(scoreOxygenSaturation(null)).toBeNull();
	});

	it('supplemental oxygen (no 2 band)', () => {
		expect(scoreSupplementalOxygen('room-air')).toBe(0);
		expect(scoreSupplementalOxygen('low-flow')).toBe(1);
		expect(scoreSupplementalOxygen('high-flow')).toBe(3);
		expect(scoreSupplementalOxygen('')).toBeNull();
	});

	it('capillary refill', () => {
		expect(scoreCapillaryRefill('under-2s')).toBe(0);
		expect(scoreCapillaryRefill('2-3s')).toBe(1);
		expect(scoreCapillaryRefill('3-4s')).toBe(2);
		expect(scoreCapillaryRefill('over-4s')).toBe(3);
	});

	it('consciousness (ACVPU)', () => {
		expect(scoreConsciousness('alert')).toBe(0);
		expect(scoreConsciousness('voice')).toBe(1);
		expect(scoreConsciousness('pain')).toBe(2);
		expect(scoreConsciousness('unresponsive')).toBe(3);
		expect(scoreConsciousness('')).toBeNull();
	});
});

describe('PEWS aggregate grading engine', () => {
	it('scores aggregate 0 / routine band for a fully-normal child', () => {
		const r = gradePews(createNormalChild());
		expect(r.aggregateScore).toBe(0);
		expect(r.escalationBand).toBe('routine');
		expect(r.singleParameterTrigger).toBe(false);
		expect(r.complete).toBe(true);
	});

	it('the same vitals give different scores across age bands', () => {
		const d = createNormalChild();
		d.identification.ageBand = 'adolescent';
		// child-normal RR 24 / HR 90 are now abnormal for an adolescent.
		const r = gradePews(d);
		expect(r.aggregateScore).toBeGreaterThan(0);
	});

	it('low band (2-3) for a mild single derangement', () => {
		const d = createNormalChild();
		d.cardiovascular.capillaryRefill = '3-4s'; // 2
		const r = gradePews(d);
		expect(r.aggregateScore).toBe(2);
		expect(r.escalationBand).toBe('low');
	});

	it('medium band for aggregate 4-5', () => {
		const d = createNormalChild();
		d.respiratory.respiratoryEffort = 'moderate'; // 2
		d.cardiovascular.capillaryRefill = '3-4s'; // 2
		const r = gradePews(d);
		expect(r.aggregateScore).toBe(4);
		expect(r.escalationBand).toBe('medium');
	});

	it('high band for aggregate >= 6', () => {
		const d = createNormalChild();
		d.respiratory.respiratoryEffort = 'moderate'; // 2
		d.respiratory.oxygenSaturation = 93; // 2
		d.cardiovascular.capillaryRefill = '3-4s'; // 2
		const r = gradePews(d);
		expect(r.aggregateScore).toBe(6);
		expect(r.escalationBand).toBe('high');
		expect(r.monitoringFrequency).toContain('Continuous');
	});

	it('single-parameter=3 override escalates to at least medium even at a low aggregate', () => {
		const d = createNormalChild();
		d.behaviour.consciousness = 'unresponsive'; // 3
		const r = gradePews(d);
		expect(r.aggregateScore).toBe(3); // would be low on aggregate alone
		expect(r.singleParameterTrigger).toBe(true);
		expect(r.escalationBand).toBe('medium');
	});

	it('nurse / parent concern emit override triggers', () => {
		const d = createNormalChild();
		d.concern.nurseConcern = 'yes';
		d.concern.parentConcern = 'yes';
		const r = gradePews(d);
		const ids = r.firedTriggers.map((t) => t.id);
		expect(ids).toContain('T-NURSE-CONCERN');
		expect(ids).toContain('T-PARENT-CONCERN');
	});

	it('unanswered parameters contribute 0 and mark the grade incomplete', () => {
		const r = gradePews(createDefaultAssessment());
		expect(r.aggregateScore).toBe(0);
		expect(r.complete).toBe(false);
	});

	it('all fired-rule IDs are unique', () => {
		const d = createNormalChild();
		d.respiratory.respiratoryEffort = 'moderate';
		d.behaviour.consciousness = 'pain';
		const ids = gradePews(d).firedRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('PEWS flagged-issue detection', () => {
	function grade(d: AssessmentData) {
		const g = gradePews(d);
		return detectFlaggedIssues(d, {
			subscores: g.subscores,
			aggregateScore: g.aggregateScore,
			maxParameterScore: g.maxParameterScore
		});
	}

	it('raises no safety flags for a complete normal child', () => {
		expect(grade(createNormalChild())).toHaveLength(0);
	});

	it('raises the single-parameter-3 and high-escalation flags for a deteriorating child', () => {
		const d = createNormalChild();
		d.respiratory.oxygenSaturation = 90; // 3
		d.respiratory.respiratoryEffort = 'severe'; // 3
		const flags = grade(d);
		expect(flags.some((f) => f.id === 'F-SINGLE-PARAMETER-3-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-URGENT-REVIEW-HIGH-001')).toBe(true);
	});

	it('raises parent / nurse concern flags', () => {
		const d = createNormalChild();
		d.concern.parentConcern = 'yes';
		d.concern.nurseConcern = 'yes';
		const flags = grade(d);
		expect(flags.some((f) => f.id === 'F-PARENT-CONCERN-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-NURSE-CONCERN-001')).toBe(true);
	});

	it('raises the deteriorating-trend flag for aggregate 2-3', () => {
		const d = createNormalChild();
		d.cardiovascular.capillaryRefill = '3-4s'; // 2
		const flags = grade(d);
		expect(flags.some((f) => f.id === 'F-DETERIORATING-TREND-001')).toBe(true);
	});

	it('raises the incomplete flag when parameters or the age band are missing', () => {
		const flags = grade(createDefaultAssessment());
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNormalChild();
		d.cardiovascular.capillaryRefill = '3-4s'; // medium (deteriorating-trend)
		d.concern.parentConcern = 'yes'; // high
		const flags = grade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
