import { describe, it, expect } from 'vitest';
import { bandForTotal, calculateApgarGrade } from './apgar-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { apgarRules } from './apgar-rules';
import type { AssessmentData, Timepoint } from './types';

/**
 * A blank timepoint (mirrors the store's `createTimepoint`). Defined locally so
 * the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function tp(minutes: number | null, signs: Partial<Timepoint> = {}): Timepoint {
	return {
		timepointMinutes: minutes,
		appearance: '',
		pulse: '',
		grimace: '',
		activity: '',
		respiration: '',
		...signs
	};
}

/** A blank assessment (mirrors the store's `createDefaultAssessment`). */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			bornAt: '',
			careSetting: '',
			gestationalAgeWeeks: null,
			modeOfDelivery: ''
		},
		identification: { newbornIdentifier: '', sex: '', birthOrder: null },
		timepoints: [tp(1), tp(5)],
		summary: { resuscitationMeasures: '', clinicianNote: '' }
	};
}

/** A fully-scored reassuring infant (8 at 1 min, 9 at 5 min). */
function createReassuring(): AssessmentData {
	const d = createDefaultAssessment();
	d.context.clinicianName = 'Midwife J. Okoro';
	d.context.careSetting = 'delivery-room';
	d.identification.newbornIdentifier = 'NB-1';
	d.timepoints = [
		tp(1, { appearance: '1', pulse: '2', grimace: '2', activity: '2', respiration: '1' }),
		tp(5, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '1' })
	];
	return d;
}

describe('Apgar band boundaries', () => {
	it('maps totals to bands at the 3/4 and 6/7 boundaries', () => {
		expect(bandForTotal(0)).toBe('low');
		expect(bandForTotal(3)).toBe('low');
		expect(bandForTotal(4)).toBe('moderately-low');
		expect(bandForTotal(6)).toBe('moderately-low');
		expect(bandForTotal(7)).toBe('reassuring');
		expect(bandForTotal(10)).toBe('reassuring');
	});
});

describe('Apgar grading engine', () => {
	it('sums the five signs into a per-timepoint total of 0-10', () => {
		const r = calculateApgarGrade(createReassuring());
		expect(r.timepoints[0].total).toBe(8);
		expect(r.timepoints[0].band).toBe('reassuring');
		expect(r.timepoints[1].total).toBe(9);
		expect(r.timepoints[0].answeredCount).toBe(5);
		expect(r.timepoints[0].scored).toBe(true);
	});

	it('a missing sign contributes 0 and lowers the answered count', () => {
		const d = createDefaultAssessment();
		d.timepoints = [tp(1, { appearance: '2', pulse: '2', grimace: '2', activity: '2' })];
		const r = calculateApgarGrade(d);
		expect(r.timepoints[0].total).toBe(8);
		expect(r.timepoints[0].answeredCount).toBe(4);
	});

	it('an unscored timepoint reports scored=false', () => {
		const r = calculateApgarGrade(createDefaultAssessment());
		expect(r.timepoints[0].scored).toBe(false);
		expect(r.timepoints[0].total).toBe(0);
	});

	it('reports insufficient trend with fewer than two scored timepoints', () => {
		const d = createDefaultAssessment();
		d.timepoints = [tp(1, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' }), tp(5)];
		expect(calculateApgarGrade(d).trend).toBe('insufficient');
	});

	it('detects an improving trend (5 then 7)', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '1', pulse: '2', grimace: '1', activity: '2', respiration: '1' })
		];
		expect(calculateApgarGrade(d).trend).toBe('improving');
	});

	it('detects a falling trend (6 then 3)', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '2', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '0', pulse: '1', grimace: '1', activity: '0', respiration: '1' })
		];
		expect(calculateApgarGrade(d).trend).toBe('falling');
	});

	it('detects a static trend (equal totals)', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' })
		];
		expect(calculateApgarGrade(d).trend).toBe('static');
	});

	it('lists fired signs (below 2) for scored timepoints only', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '0', pulse: '2', grimace: '1', activity: '2', respiration: '2' }),
			tp(5)
		];
		const fired = calculateApgarGrade(d).firedSigns;
		expect(fired.map((f) => f.sign).sort()).toEqual(['appearance', 'grimace']);
		expect(fired.every((f) => f.timepointMinutes === 1)).toBe(true);
	});

	it('all rule IDs are unique', () => {
		const ids = apgarRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Apgar flagged-issue detection', () => {
	it('raises no red flags for a reassuring infant', () => {
		const r = calculateApgarGrade(createReassuring());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises resuscitation-required when a scored total is <= 3', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '0', pulse: '1', grimace: '0', activity: '0', respiration: '1' }),
			tp(5, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-RESUSCITATION-REQUIRED-001')).toBe(true);
	});

	it('raises continue-scoring and missing-ten-minute when 5-minute total < 7 without a 10-min score', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-CONTINUE-SCORING-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-MISSING-TEN-MINUTE-SCORE-001')).toBe(true);
	});

	it('does not raise missing-ten-minute once a 10-minute score is present', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(10, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-MISSING-TEN-MINUTE-SCORE-001')).toBe(false);
	});

	it('raises a falling-trend flag when a later total drops below an earlier one', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' }),
			tp(5, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' }),
			tp(10, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-FALLING-TREND-001')).toBe(true);
	});

	it('raises support-and-stimulation for a moderately-low (4-6) total', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '1', pulse: '2', grimace: '1', activity: '1', respiration: '1' }),
			tp(5, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-SUPPORT-AND-STIMULATION-001')).toBe(true);
	});

	it('raises incomplete-assessment when a scored timepoint is missing a sign', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '2', pulse: '2', grimace: '2', activity: '2' }),
			tp(5, { appearance: '2', pulse: '2', grimace: '2', activity: '2', respiration: '2' })
		];
		const flags = calculateApgarGrade(d).flaggedIssues;
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.timepoints = [
			tp(1, { appearance: '0', pulse: '1', grimace: '1', activity: '0', respiration: '1' }),
			tp(5, { appearance: '1', pulse: '1', grimace: '1', activity: '1', respiration: '1' })
		];
		const g = calculateApgarGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = g.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('detectFlaggedIssues can be called directly with graded timepoints', () => {
		const d = createReassuring();
		const g = calculateApgarGrade(d);
		expect(detectFlaggedIssues(d, g.timepoints)).toHaveLength(0);
	});
});
