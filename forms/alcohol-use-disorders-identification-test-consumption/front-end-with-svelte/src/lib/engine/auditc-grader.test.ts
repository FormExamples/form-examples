import { describe, it, expect } from 'vitest';
import { calculateAuditcGrade, bandForScore } from './auditc-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { auditcRules } from './auditc-rules';
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
			administrationMode: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		items: {
			frequencyOfDrinking: null,
			typicalQuantity: null,
			heavyEpisodeFrequency: null
		},
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-zero (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'gp',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'primary-care',
		administrationMode: 'interview'
	};
	d.identification = { patientIdentifier: 'GP-1001', ageBand: '40-59', sex: 'male' };
	d.items.frequencyOfDrinking = 0;
	d.items.typicalQuantity = 0;
	d.items.heavyEpisodeFrequency = 0;
	return d;
}

describe('AUDIT-C grading engine', () => {
	it('scores 0 for a fully-zero patient (lower risk)', () => {
		const r = calculateAuditcGrade(createNegativePatient());
		expect(r.auditcScore).toBe(0);
		expect(r.frequencyOfDrinkingPoint).toBe(0);
		expect(r.typicalQuantityPoint).toBe(0);
		expect(r.heavyEpisodeFrequencyPoint).toBe(0);
		expect(r.riskBand).toBe('lower');
		expect(r.positiveScreen).toBe(false);
	});

	it('sums the three item points into the total (0-12)', () => {
		const d = createNegativePatient();
		d.items.frequencyOfDrinking = 3;
		d.items.typicalQuantity = 2;
		d.items.heavyEpisodeFrequency = 1;
		const r = calculateAuditcGrade(d);
		expect(r.auditcScore).toBe(6);
		expect(r.frequencyOfDrinkingPoint).toBe(3);
		expect(r.typicalQuantityPoint).toBe(2);
		expect(r.heavyEpisodeFrequencyPoint).toBe(1);
	});

	it('reaches the maximum total of 12', () => {
		const d = createNegativePatient();
		d.items.frequencyOfDrinking = 4;
		d.items.typicalQuantity = 4;
		d.items.heavyEpisodeFrequency = 4;
		const r = calculateAuditcGrade(d);
		expect(r.auditcScore).toBe(12);
		expect(r.riskBand).toBe('possible-dependence');
		expect(r.positiveScreen).toBe(true);
	});

	it('positive-screen cut fires at 5, not 4', () => {
		expect(calculateAuditcGrade(withTotal(4)).positiveScreen).toBe(false);
		expect(calculateAuditcGrade(withTotal(5)).positiveScreen).toBe(true);
	});

	it('derives the risk band at every boundary (5, 8, 11)', () => {
		expect(bandForScore(0)).toBe('lower');
		expect(bandForScore(4)).toBe('lower');
		expect(bandForScore(5)).toBe('increasing');
		expect(bandForScore(7)).toBe('increasing');
		expect(bandForScore(8)).toBe('higher');
		expect(bandForScore(10)).toBe('higher');
		expect(bandForScore(11)).toBe('possible-dependence');
		expect(bandForScore(12)).toBe('possible-dependence');
	});

	it('a missing item input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateAuditcGrade(d);
		expect(r.auditcScore).toBe(0);
		expect(r.riskBand).toBe('lower');
	});

	it('all rule IDs are unique', () => {
		const ids = auditcRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('AUDIT-C flagged-issue detection', () => {
	it('raises no red flags for a complete zero-score patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the brief-intervention flag when the total is >= 5', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 6);
		expect(flags.some((f) => f.id === 'F-BRIEF-INTERVENTION-001')).toBe(true);
	});

	it('raises the escalation and dependence flags at 8 and 11', () => {
		expect(
			detectFlaggedIssues(createNegativePatient(), 8).some(
				(f) => f.id === 'F-ESCALATE-FULL-AUDIT-001'
			)
		).toBe(true);
		expect(
			detectFlaggedIssues(createNegativePatient(), 11).some(
				(f) => f.id === 'F-DEPENDENCE-INDICATORS-001'
			)
		).toBe(true);
	});

	it('raises the heavy-episodic flag when Q3 point >= 3', () => {
		const d = createNegativePatient();
		d.items.heavyEpisodeFrequency = 3;
		const flags = detectFlaggedIssues(d, 3);
		expect(flags.some((f) => f.id === 'F-HIGH-CONSUMPTION-001')).toBe(true);
	});

	it('raises the sex-specific low-cut flag for a female patient at total 4', () => {
		const d = createNegativePatient();
		d.identification.sex = 'female';
		const flags = detectFlaggedIssues(d, 4);
		expect(flags.some((f) => f.id === 'F-SEX-SPECIFIC-CUT-001')).toBe(true);

		// The same female total of 4 does NOT fire it for a male patient.
		const m = createNegativePatient();
		m.identification.sex = 'male';
		expect(detectFlaggedIssues(m, 4).some((f) => f.id === 'F-SEX-SPECIFIC-CUT-001')).toBe(false);
	});

	it('raises the incomplete-assessment flag when an item is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.items.heavyEpisodeFrequency = 4; // medium
		const flags = detectFlaggedIssues(d, 8); // also high
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});

/** Build a patient whose three items sum to the requested total. */
function withTotal(total: number): AssessmentData {
	const d = createNegativePatient();
	const q1 = Math.min(4, total);
	const q2 = Math.min(4, total - q1);
	const q3 = Math.min(4, total - q1 - q2);
	d.items.frequencyOfDrinking = q1 as 0 | 1 | 2 | 3 | 4;
	d.items.typicalQuantity = q2 as 0 | 1 | 2 | 3 | 4;
	d.items.heavyEpisodeFrequency = q3 as 0 | 1 | 2 | 3 | 4;
	return d;
}
