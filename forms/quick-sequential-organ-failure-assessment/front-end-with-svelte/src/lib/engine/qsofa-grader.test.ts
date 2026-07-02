import { describe, it, expect } from 'vitest';
import { calculateQsofaGrade } from './qsofa-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { qsofaRules } from './qsofa-rules';
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
			suspectedSource: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		respiratory: { respiratoryRate: null },
		mentation: { glasgowComaScale: null, mentationAltered: '' },
		circulation: { systolicBloodPressure: null },
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
		suspectedSource: 'Chest / pneumonia'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageBand: '40-59', sex: 'male' };
	d.respiratory.respiratoryRate = 18;
	d.mentation.glasgowComaScale = 15;
	d.mentation.mentationAltered = 'no';
	d.circulation.systolicBloodPressure = 124;
	return d;
}

describe('qSOFA grading engine', () => {
	it('scores 0 for a fully-negative patient (lower risk)', () => {
		const r = calculateQsofaGrade(createNegativePatient());
		expect(r.qsofaScore).toBe(0);
		expect(r.respiratoryRatePoint).toBe(0);
		expect(r.mentationPoint).toBe(0);
		expect(r.systolicBloodPressurePoint).toBe(0);
		expect(r.riskBand).toBe('lower');
		expect(r.thresholdMet).toBe('no');
	});

	it('respiratory-rate threshold fires at 22, not 21', () => {
		const d21 = createNegativePatient();
		d21.respiratory.respiratoryRate = 21;
		expect(calculateQsofaGrade(d21).respiratoryRatePoint).toBe(0);

		const d22 = createNegativePatient();
		d22.respiratory.respiratoryRate = 22;
		expect(calculateQsofaGrade(d22).respiratoryRatePoint).toBe(1);
	});

	it('mentation threshold fires at GCS 14, not 15', () => {
		const d15 = createNegativePatient();
		d15.mentation.glasgowComaScale = 15;
		expect(calculateQsofaGrade(d15).mentationPoint).toBe(0);

		const d14 = createNegativePatient();
		d14.mentation.glasgowComaScale = 14;
		expect(calculateQsofaGrade(d14).mentationPoint).toBe(1);
	});

	it('mentation fires on the altered-from-baseline flag even at GCS 15', () => {
		const d = createNegativePatient();
		d.mentation.glasgowComaScale = 15;
		d.mentation.mentationAltered = 'yes';
		expect(calculateQsofaGrade(d).mentationPoint).toBe(1);
	});

	it('systolic-BP threshold fires at 100, not 101', () => {
		const d101 = createNegativePatient();
		d101.circulation.systolicBloodPressure = 101;
		expect(calculateQsofaGrade(d101).systolicBloodPressurePoint).toBe(0);

		const d100 = createNegativePatient();
		d100.circulation.systolicBloodPressure = 100;
		expect(calculateQsofaGrade(d100).systolicBloodPressurePoint).toBe(1);
	});

	it('sums to the total for every combination 0-3', () => {
		const d0 = createNegativePatient();
		expect(calculateQsofaGrade(d0).qsofaScore).toBe(0);

		const d1 = createNegativePatient();
		d1.respiratory.respiratoryRate = 26;
		expect(calculateQsofaGrade(d1).qsofaScore).toBe(1);

		const d2 = createNegativePatient();
		d2.respiratory.respiratoryRate = 26;
		d2.circulation.systolicBloodPressure = 92;
		const r2 = calculateQsofaGrade(d2);
		expect(r2.qsofaScore).toBe(2);
		expect(r2.riskBand).toBe('higher');
		expect(r2.thresholdMet).toBe('yes');

		const d3 = createNegativePatient();
		d3.respiratory.respiratoryRate = 30;
		d3.mentation.glasgowComaScale = 12;
		d3.circulation.systolicBloodPressure = 80;
		expect(calculateQsofaGrade(d3).qsofaScore).toBe(3);
	});

	it('a missing numeric input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateQsofaGrade(d);
		expect(r.qsofaScore).toBe(0);
		expect(r.riskBand).toBe('lower');
	});

	it('all rule IDs are unique', () => {
		const ids = qsofaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('qSOFA flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the sepsis-escalation flag when qSOFA >= 2', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 2);
		expect(flags.some((f) => f.id === 'F-SEPSIS-ESCALATION-001')).toBe(true);
	});

	it('raises hypotension, altered-mentation, and tachypnoea flags', () => {
		const d = createNegativePatient();
		d.respiratory.respiratoryRate = 28;
		d.mentation.glasgowComaScale = 13;
		d.circulation.systolicBloodPressure = 88;
		const flags = detectFlaggedIssues(d, 3);
		expect(flags.some((f) => f.id === 'F-HYPOTENSION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ALTERED-MENTATION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-TACHYPNOEA-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.respiratory.respiratoryRate = 28; // medium
		d.circulation.systolicBloodPressure = 88; // high
		const flags = detectFlaggedIssues(d, 2);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
