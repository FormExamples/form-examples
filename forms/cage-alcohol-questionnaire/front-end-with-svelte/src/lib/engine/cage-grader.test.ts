import { describe, it, expect } from 'vitest';
import { calculateCageGrade } from './cage-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { cageRules } from './cage-rules';
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
			careSetting: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		criteria: { cutDown: '', annoyed: '', guilty: '', eyeOpener: '' },
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
		careSetting: 'primary-care'
	};
	d.identification = { patientIdentifier: 'GP-1001', ageBand: '40-59', sex: 'male' };
	d.criteria = { cutDown: 'no', annoyed: 'no', guilty: 'no', eyeOpener: 'no' };
	return d;
}

describe('CAGE grading engine', () => {
	it('scores 0 for a fully-negative patient (negative band)', () => {
		const r = calculateCageGrade(createNegativePatient());
		expect(r.cageScore).toBe(0);
		expect(r.cutDownPoint).toBe(0);
		expect(r.annoyedPoint).toBe(0);
		expect(r.guiltyPoint).toBe(0);
		expect(r.eyeOpenerPoint).toBe(0);
		expect(r.resultBand).toBe('negative');
		expect(r.thresholdMet).toBe('no');
	});

	it('scores 1 point per "yes" answer', () => {
		const dCut = createNegativePatient();
		dCut.criteria.cutDown = 'yes';
		expect(calculateCageGrade(dCut).cutDownPoint).toBe(1);

		const dAnn = createNegativePatient();
		dAnn.criteria.annoyed = 'yes';
		expect(calculateCageGrade(dAnn).annoyedPoint).toBe(1);

		const dGui = createNegativePatient();
		dGui.criteria.guilty = 'yes';
		expect(calculateCageGrade(dGui).guiltyPoint).toBe(1);

		const dEye = createNegativePatient();
		dEye.criteria.eyeOpener = 'yes';
		expect(calculateCageGrade(dEye).eyeOpenerPoint).toBe(1);
	});

	it('score 1 is the "low" (sub-threshold) band', () => {
		const d = createNegativePatient();
		d.criteria.cutDown = 'yes';
		const r = calculateCageGrade(d);
		expect(r.cageScore).toBe(1);
		expect(r.resultBand).toBe('low');
		expect(r.thresholdMet).toBe('no');
	});

	it('threshold: score 1 is sub-threshold, score 2 is positive', () => {
		const d1 = createNegativePatient();
		d1.criteria.cutDown = 'yes';
		const r1 = calculateCageGrade(d1);
		expect(r1.cageScore).toBe(1);
		expect(r1.resultBand).toBe('low');

		const d2 = createNegativePatient();
		d2.criteria.cutDown = 'yes';
		d2.criteria.annoyed = 'yes';
		const r2 = calculateCageGrade(d2);
		expect(r2.cageScore).toBe(2);
		expect(r2.resultBand).toBe('positive');
		expect(r2.thresholdMet).toBe('yes');
	});

	it('sums to the total for every combination 0-4', () => {
		const d0 = createNegativePatient();
		expect(calculateCageGrade(d0).cageScore).toBe(0);

		const d1 = createNegativePatient();
		d1.criteria.cutDown = 'yes';
		expect(calculateCageGrade(d1).cageScore).toBe(1);

		const d2 = createNegativePatient();
		d2.criteria.cutDown = 'yes';
		d2.criteria.annoyed = 'yes';
		expect(calculateCageGrade(d2).cageScore).toBe(2);

		const d3 = createNegativePatient();
		d3.criteria.cutDown = 'yes';
		d3.criteria.annoyed = 'yes';
		d3.criteria.guilty = 'yes';
		expect(calculateCageGrade(d3).cageScore).toBe(3);

		const d4 = createNegativePatient();
		d4.criteria = { cutDown: 'yes', annoyed: 'yes', guilty: 'yes', eyeOpener: 'yes' };
		const r4 = calculateCageGrade(d4);
		expect(r4.cageScore).toBe(4);
		expect(r4.resultBand).toBe('positive');
	});

	it('an unanswered item contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateCageGrade(d);
		expect(r.cageScore).toBe(0);
		expect(r.resultBand).toBe('negative');
	});

	it('all rule IDs are unique', () => {
		const ids = cageRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('CAGE flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the positive-screen flag when CAGE >= 2', () => {
		const d = createNegativePatient();
		d.criteria.cutDown = 'yes';
		d.criteria.annoyed = 'yes';
		const flags = detectFlaggedIssues(d, 2);
		expect(flags.some((f) => f.id === 'F-POSITIVE-SCREEN-001')).toBe(true);
	});

	it('raises the eye-opener dependence flag even below threshold', () => {
		const d = createNegativePatient();
		d.criteria.eyeOpener = 'yes';
		const flags = detectFlaggedIssues(d, 1);
		expect(flags.some((f) => f.id === 'F-EYE-OPENER-DEPENDENCE-001')).toBe(true);
	});

	it('raises the sub-threshold flag when CAGE == 1', () => {
		const d = createNegativePatient();
		d.criteria.guilty = 'yes';
		const flags = detectFlaggedIssues(d, 1);
		expect(flags.some((f) => f.id === 'F-FURTHER-ASSESSMENT-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when an item is unanswered', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.criteria.cutDown = 'yes'; // sub-threshold medium (if score 1)
		d.criteria.eyeOpener = 'yes'; // high
		const flags = detectFlaggedIssues(d, 2);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
