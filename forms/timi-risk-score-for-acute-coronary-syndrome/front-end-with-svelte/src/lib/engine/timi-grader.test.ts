import { describe, it, expect } from 'vitest';
import { calculateTimiGrade } from './timi-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { timiRules } from './timi-rules';
import { FOURTEEN_DAY_RISK_PERCENT } from './utils';
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
			workingDiagnosis: ''
		},
		identification: { patientIdentifier: '', sex: '' },
		riskProfile: { ageOver65: '', threeOrMoreCadRiskFactors: '' },
		cardiacHistory: { knownCadStenosis: '', aspirinUsePrior7Days: '' },
		presentation: { twoOrMoreAnginaEpisodes24h: '' },
		investigations: { stDeviation: '', positiveCardiacMarker: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'physician',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		workingDiagnosis: 'unstable-angina'
	};
	d.identification = { patientIdentifier: 'ED-1001', sex: 'male' };
	d.riskProfile = { ageOver65: 'no', threeOrMoreCadRiskFactors: 'no' };
	d.cardiacHistory = { knownCadStenosis: 'no', aspirinUsePrior7Days: 'no' };
	d.presentation = { twoOrMoreAnginaEpisodes24h: 'no' };
	d.investigations = { stDeviation: 'no', positiveCardiacMarker: 'no' };
	return d;
}

describe('TIMI UA/NSTEMI grading engine', () => {
	it('scores 0 for a fully-negative patient (low risk)', () => {
		const r = calculateTimiGrade(createNegativePatient());
		expect(r.timiScore).toBe(0);
		expect(r.agePoint).toBe(0);
		expect(r.riskFactorPoint).toBe(0);
		expect(r.knownCadPoint).toBe(0);
		expect(r.aspirinPoint).toBe(0);
		expect(r.anginaPoint).toBe(0);
		expect(r.stDeviationPoint).toBe(0);
		expect(r.cardiacMarkerPoint).toBe(0);
		expect(r.riskBand).toBe('low');
		expect(r.fourteenDayRiskPercent).toBe(4.7);
	});

	it('each criterion contributes exactly one point when positive', () => {
		const a = createNegativePatient();
		a.riskProfile.ageOver65 = 'yes';
		expect(calculateTimiGrade(a).agePoint).toBe(1);
		expect(calculateTimiGrade(a).timiScore).toBe(1);

		const b = createNegativePatient();
		b.riskProfile.threeOrMoreCadRiskFactors = 'yes';
		expect(calculateTimiGrade(b).riskFactorPoint).toBe(1);

		const c = createNegativePatient();
		c.cardiacHistory.knownCadStenosis = 'yes';
		expect(calculateTimiGrade(c).knownCadPoint).toBe(1);

		const e = createNegativePatient();
		e.cardiacHistory.aspirinUsePrior7Days = 'yes';
		expect(calculateTimiGrade(e).aspirinPoint).toBe(1);

		const f = createNegativePatient();
		f.presentation.twoOrMoreAnginaEpisodes24h = 'yes';
		expect(calculateTimiGrade(f).anginaPoint).toBe(1);

		const g = createNegativePatient();
		g.investigations.stDeviation = 'yes';
		expect(calculateTimiGrade(g).stDeviationPoint).toBe(1);

		const h = createNegativePatient();
		h.investigations.positiveCardiacMarker = 'yes';
		expect(calculateTimiGrade(h).cardiacMarkerPoint).toBe(1);
	});

	it('maps the band transitions: 1 low, 2 intermediate, 5 high', () => {
		const one = createNegativePatient();
		one.riskProfile.ageOver65 = 'yes';
		const r1 = calculateTimiGrade(one);
		expect(r1.timiScore).toBe(1);
		expect(r1.riskBand).toBe('low');

		const two = createNegativePatient();
		two.riskProfile.ageOver65 = 'yes';
		two.riskProfile.threeOrMoreCadRiskFactors = 'yes';
		const r2 = calculateTimiGrade(two);
		expect(r2.timiScore).toBe(2);
		expect(r2.riskBand).toBe('intermediate');

		const five = createNegativePatient();
		five.riskProfile.ageOver65 = 'yes';
		five.riskProfile.threeOrMoreCadRiskFactors = 'yes';
		five.cardiacHistory.knownCadStenosis = 'yes';
		five.cardiacHistory.aspirinUsePrior7Days = 'yes';
		five.presentation.twoOrMoreAnginaEpisodes24h = 'yes';
		const r5 = calculateTimiGrade(five);
		expect(r5.timiScore).toBe(5);
		expect(r5.riskBand).toBe('high');
	});

	it('sums to 7 with the mapped 14-day risk when every criterion is positive', () => {
		const d = createNegativePatient();
		d.riskProfile = { ageOver65: 'yes', threeOrMoreCadRiskFactors: 'yes' };
		d.cardiacHistory = { knownCadStenosis: 'yes', aspirinUsePrior7Days: 'yes' };
		d.presentation = { twoOrMoreAnginaEpisodes24h: 'yes' };
		d.investigations = { stDeviation: 'yes', positiveCardiacMarker: 'yes' };
		const r = calculateTimiGrade(d);
		expect(r.timiScore).toBe(7);
		expect(r.riskBand).toBe('high');
		expect(r.fourteenDayRiskPercent).toBe(40.9);
	});

	it('looks up the 14-day risk for every total 0-7', () => {
		expect(FOURTEEN_DAY_RISK_PERCENT[0]).toBe(4.7);
		expect(FOURTEEN_DAY_RISK_PERCENT[3]).toBe(13.2);
		expect(FOURTEEN_DAY_RISK_PERCENT[7]).toBe(40.9);
	});

	it('a missing enum input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateTimiGrade(d);
		expect(r.timiScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('all rule IDs are unique', () => {
		const ids = timiRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('TIMI flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the high-risk-score flag when TIMI >= 5', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 5);
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-SCORE-001')).toBe(true);
	});

	it('raises the intermediate-risk-score flag when TIMI is 2-4', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 3);
		expect(flags.some((f) => f.id === 'F-INTERMEDIATE-RISK-SCORE-001')).toBe(true);
	});

	it('raises marker, marker-with-ST, and ST-deviation flags together', () => {
		const d = createNegativePatient();
		d.investigations.stDeviation = 'yes';
		d.investigations.positiveCardiacMarker = 'yes';
		const flags = detectFlaggedIssues(d, 4);
		expect(flags.some((f) => f.id === 'F-POSITIVE-CARDIAC-MARKER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-MARKER-WITH-ST-DEVIATION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ST-DEVIATION-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.investigations.stDeviation = 'yes'; // medium
		d.investigations.positiveCardiacMarker = 'yes'; // high
		const flags = detectFlaggedIssues(d, 2);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
