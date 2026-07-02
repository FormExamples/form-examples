import { describe, it, expect } from 'vitest';
import { calculateCurb65Grade } from './curb65-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { curb65Rules } from './curb65-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: { patientIdentifier: '', sex: '' },
		confusion: { confusionPresent: '', amtScore: null },
		urea: { ureaMeasured: '', ureaMmolL: null },
		respiratory: { respiratoryRate: null },
		bloodPressure: { systolicBp: null, diastolicBp: null },
		age: { ageYears: null },
		adjuncts: {
			oxygenSaturation: null,
			temperatureC: null,
			significantComorbidity: '',
			multilobarChanges: ''
		},
		disposition: { clinicianOverrideBand: '', overrideReason: '', clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (score 0) CURB-65 patient (urea measured). */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'physician',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-1001', sex: 'male' };
	d.confusion = { confusionPresent: 'no', amtScore: 10 };
	d.urea = { ureaMeasured: 'yes', ureaMmolL: 5 };
	d.respiratory.respiratoryRate = 18;
	d.bloodPressure = { systolicBp: 124, diastolicBp: 78 };
	d.age.ageYears = 50;
	return d;
}

describe('CURB-65 grading engine', () => {
	it('scores 0 for a fully-negative patient (low risk)', () => {
		const r = calculateCurb65Grade(createNegativePatient());
		expect(r.curb65Score).toBe(0);
		expect(r.totalScore).toBe(0);
		expect(r.scoreVariant).toBe('curb-65');
		expect(r.riskBand).toBe('low');
		expect(r.recommendedDisposition).toBe('home-outpatient');
	});

	it('urea threshold fires above 7, not at exactly 7', () => {
		const d7 = createNegativePatient();
		d7.urea.ureaMmolL = 7;
		expect(calculateCurb65Grade(d7).ureaScore).toBe(0);

		const d8 = createNegativePatient();
		d8.urea.ureaMmolL = 7.5;
		expect(calculateCurb65Grade(d8).ureaScore).toBe(1);
	});

	it('respiratory-rate threshold fires at 30, not 29', () => {
		const d29 = createNegativePatient();
		d29.respiratory.respiratoryRate = 29;
		expect(calculateCurb65Grade(d29).respiratoryRateScore).toBe(0);

		const d30 = createNegativePatient();
		d30.respiratory.respiratoryRate = 30;
		expect(calculateCurb65Grade(d30).respiratoryRateScore).toBe(1);
	});

	it('systolic-BP threshold fires below 90, not at exactly 90', () => {
		const d90 = createNegativePatient();
		d90.bloodPressure.systolicBp = 90;
		expect(calculateCurb65Grade(d90).bloodPressureScore).toBe(0);

		const d89 = createNegativePatient();
		d89.bloodPressure.systolicBp = 89;
		expect(calculateCurb65Grade(d89).bloodPressureScore).toBe(1);
	});

	it('diastolic-BP threshold fires at 60, not 61', () => {
		const d61 = createNegativePatient();
		d61.bloodPressure.diastolicBp = 61;
		expect(calculateCurb65Grade(d61).bloodPressureScore).toBe(0);

		const d60 = createNegativePatient();
		d60.bloodPressure.diastolicBp = 60;
		expect(calculateCurb65Grade(d60).bloodPressureScore).toBe(1);
	});

	it('age threshold fires at 65, not 64', () => {
		const d64 = createNegativePatient();
		d64.age.ageYears = 64;
		expect(calculateCurb65Grade(d64).ageScore).toBe(0);

		const d65 = createNegativePatient();
		d65.age.ageYears = 65;
		expect(calculateCurb65Grade(d65).ageScore).toBe(1);
	});

	it('sums to the CURB-65 total and bands correctly', () => {
		const d2 = createNegativePatient();
		d2.confusion.confusionPresent = 'yes';
		d2.age.ageYears = 70;
		const r2 = calculateCurb65Grade(d2);
		expect(r2.curb65Score).toBe(2);
		expect(r2.riskBand).toBe('intermediate');

		const d5 = createNegativePatient();
		d5.confusion.confusionPresent = 'yes';
		d5.urea.ureaMmolL = 12;
		d5.respiratory.respiratoryRate = 34;
		d5.bloodPressure.systolicBp = 84;
		d5.age.ageYears = 80;
		const r5 = calculateCurb65Grade(d5);
		expect(r5.curb65Score).toBe(5);
		expect(r5.riskBand).toBe('high');
		expect(r5.recommendedDisposition).toBe('hospital-admission');
	});

	it('falls back to CRB-65 when urea was not measured', () => {
		const d = createNegativePatient();
		d.urea = { ureaMeasured: 'no', ureaMmolL: null };
		d.confusion.confusionPresent = 'yes';
		d.age.ageYears = 70;
		const r = calculateCurb65Grade(d);
		expect(r.scoreVariant).toBe('crb-65');
		expect(r.crb65Score).toBe(2);
		expect(r.totalScore).toBe(2);
		// CRB-65 bands 1-2 as intermediate.
		expect(r.riskBand).toBe('intermediate');
	});

	it('CRB-65 bands a single positive criterion as intermediate', () => {
		const d = createNegativePatient();
		d.urea = { ureaMeasured: 'no', ureaMmolL: null };
		d.age.ageYears = 70;
		const r = calculateCurb65Grade(d);
		expect(r.crb65Score).toBe(1);
		expect(r.riskBand).toBe('intermediate');
	});

	it('a missing numeric input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateCurb65Grade(d);
		expect(r.totalScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('all rule IDs are unique', () => {
		const ids = curb65Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('CURB-65 flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), {
			totalScore: 0,
			scoreVariant: 'curb-65'
		});
		expect(flags).toHaveLength(0);
	});

	it('raises high-severity-admit when the score is >= 3', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), {
			totalScore: 3,
			scoreVariant: 'curb-65'
		});
		expect(flags.some((f) => f.id === 'F-HIGH-SEVERITY-ADMIT-001')).toBe(true);
	});

	it('raises consider-icu when the score is >= 4', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), {
			totalScore: 4,
			scoreVariant: 'curb-65'
		});
		expect(flags.some((f) => f.id === 'F-CONSIDER-ICU-001')).toBe(true);
	});

	it('raises hypotension, new-confusion, and hypoxia flags', () => {
		const d = createNegativePatient();
		d.confusion.confusionPresent = 'yes';
		d.bloodPressure.systolicBp = 84;
		d.adjuncts.oxygenSaturation = 88;
		const flags = detectFlaggedIssues(d, { totalScore: 2, scoreVariant: 'curb-65' });
		expect(flags.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-NEW-CONFUSION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HYPOXIA-001')).toBe(true);
	});

	it('raises the incomplete-criterion flag when a criterion input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, { totalScore: 0, scoreVariant: 'curb-65' });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-CRITERION-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.bloodPressure.systolicBp = 84; // high
		d.adjuncts.oxygenSaturation = 88; // medium
		const flags = detectFlaggedIssues(d, { totalScore: 3, scoreVariant: 'curb-65' });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
