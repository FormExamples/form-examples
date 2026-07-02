import { describe, it, expect } from 'vitest';
import { calculateRockallGrade } from './rockall-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { rockallRules } from './rockall-rules';
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
			presentingComplaint: ''
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		shock: { systolicBloodPressure: null, heartRate: null },
		comorbidityStep: { comorbidity: '' },
		endoscopy: { endoscopyPerformed: '', diagnosis: '', stigmata: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-zero clinical baseline (age < 60, no shock, no comorbidity). */
function lowClinicalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'emergency-department',
		presentingComplaint: 'Coffee-ground vomiting'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageYears: 45, sex: 'male' };
	d.shock.systolicBloodPressure = 120; // >= 100 → 0
	d.shock.heartRate = 80; // < 100 → 0
	d.comorbidityStep.comorbidity = 'none'; // 0
	return d;
}

describe('Rockall grader — age bands', () => {
	it('scores age < 60 as 0', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 59;
		expect(calculateRockallGrade(d).agePoints).toBe(0);
	});

	it('scores age 60-79 as 1 (60 and 79 boundaries)', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 60;
		expect(calculateRockallGrade(d).agePoints).toBe(1);
		d.identification.ageYears = 79;
		expect(calculateRockallGrade(d).agePoints).toBe(1);
	});

	it('scores age >= 80 as 2', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 80;
		expect(calculateRockallGrade(d).agePoints).toBe(2);
		d.identification.ageYears = 92;
		expect(calculateRockallGrade(d).agePoints).toBe(2);
	});

	it('scores a missing age as 0', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = null;
		expect(calculateRockallGrade(d).agePoints).toBe(0);
	});
});

describe('Rockall grader — shock derivation', () => {
	it('scores hypotension (SBP < 100) as 2, taking precedence over tachycardia', () => {
		const d = lowClinicalPatient();
		d.shock.systolicBloodPressure = 90; // < 100 → 2
		d.shock.heartRate = 130; // would be 1, but hypotension wins
		expect(calculateRockallGrade(d).shockPoints).toBe(2);
	});

	it('scores tachycardia (HR >= 100, SBP >= 100) as 1', () => {
		const d = lowClinicalPatient();
		d.shock.systolicBloodPressure = 110;
		d.shock.heartRate = 100; // >= 100 → 1
		expect(calculateRockallGrade(d).shockPoints).toBe(1);
	});

	it('scores no shock (SBP >= 100, HR < 100) as 0', () => {
		const d = lowClinicalPatient();
		d.shock.systolicBloodPressure = 100; // not < 100
		d.shock.heartRate = 99; // < 100
		expect(calculateRockallGrade(d).shockPoints).toBe(0);
	});
});

describe('Rockall grader — clinical score (0-7)', () => {
	it('sums a fully-low patient to a clinical score of 0', () => {
		const r = calculateRockallGrade(lowClinicalPatient());
		expect(r.clinicalRockallScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('caps the maximum clinical score at 7 (age 2 + shock 2 + comorbidity 3)', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 85; // 2
		d.shock.systolicBloodPressure = 88; // 2
		d.comorbidityStep.comorbidity = 'severe'; // 3
		const r = calculateRockallGrade(d);
		expect(r.agePoints).toBe(2);
		expect(r.shockPoints).toBe(2);
		expect(r.comorbidityPoints).toBe(3);
		expect(r.clinicalRockallScore).toBe(7);
	});

	it('sums a mixed clinical score (age 1 + shock 1 + comorbidity 2 = 4)', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 72; // 1
		d.shock.systolicBloodPressure = 115; // not hypotensive
		d.shock.heartRate = 105; // 1
		d.comorbidityStep.comorbidity = 'major'; // 2
		expect(calculateRockallGrade(d).clinicalRockallScore).toBe(4);
	});
});

describe('Rockall grader — full score (0-11) and banding', () => {
	it('adds endoscopic points only when endoscopy is performed', () => {
		const d = lowClinicalPatient();
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'all-other'; // 1
		d.endoscopy.stigmata = 'high-risk'; // 2
		const r = calculateRockallGrade(d);
		expect(r.diagnosisPoints).toBe(1);
		expect(r.stigmataPoints).toBe(2);
		expect(r.fullRockallScore).toBe(3); // clinical 0 + 1 + 2
		expect(r.riskBand).toBe('intermediate');
	});

	it('caps the maximum full score at 11 and bands it high', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 85; // 2
		d.shock.systolicBloodPressure = 88; // 2
		d.comorbidityStep.comorbidity = 'severe'; // 3 → clinical 7
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'upper-gi-malignancy'; // 2
		d.endoscopy.stigmata = 'high-risk'; // 2
		const r = calculateRockallGrade(d);
		expect(r.fullRockallScore).toBe(11);
		expect(r.riskBand).toBe('high');
	});

	it('bands a full score <= 2 as low (2/3 boundary) and 3-4 as intermediate', () => {
		const d = lowClinicalPatient();
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'mallory-weiss-or-none'; // 0
		d.endoscopy.stigmata = 'none-or-dark-spot'; // 0 → full 0
		expect(calculateRockallGrade(d).riskBand).toBe('low');

		d.identification.ageYears = 72; // 1
		d.endoscopy.diagnosis = 'all-other'; // 1
		d.endoscopy.stigmata = 'high-risk'; // 2 → full 4
		const r4 = calculateRockallGrade(d);
		expect(r4.fullRockallScore).toBe(4);
		expect(r4.riskBand).toBe('intermediate');
	});
});

describe('Rockall grader — clinical-only path (no endoscopy)', () => {
	it('reports fullRockallScore null and a clinical-only band when endoscopy not done', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 72; // clinical 1
		d.endoscopy.endoscopyPerformed = 'no';
		const r = calculateRockallGrade(d);
		expect(r.endoscopyDone).toBe(false);
		expect(r.fullRockallScore).toBeNull();
		expect(r.clinicalRockallScore).toBe(1);
		expect(r.riskBand).toBe('clinical-only');
		expect(r.score).toBe(1);
	});

	it('bands a pre-endoscopy clinical 0 as low, not clinical-only', () => {
		const d = lowClinicalPatient();
		d.endoscopy.endoscopyPerformed = 'no';
		const r = calculateRockallGrade(d);
		expect(r.fullRockallScore).toBeNull();
		expect(r.riskBand).toBe('low');
	});

	it('leaves endoscopic points at 0 while endoscopy is not performed even if fields set', () => {
		const d = lowClinicalPatient();
		d.endoscopy.endoscopyPerformed = 'no';
		d.endoscopy.diagnosis = 'upper-gi-malignancy';
		d.endoscopy.stigmata = 'high-risk';
		const r = calculateRockallGrade(d);
		expect(r.fullRockallScore).toBeNull();
	});
});

describe('Rockall flagged-issue detection', () => {
	it('raises no red flags for a complete, fully-low, no-endoscopy patient', () => {
		const r = calculateRockallGrade(lowClinicalPatient());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises a high-mortality flag for clinical >= 3 pre-endoscopy', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 85; // 2
		d.comorbidityStep.comorbidity = 'major'; // 2 → clinical 4
		d.endoscopy.endoscopyPerformed = 'no';
		const r = calculateRockallGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HIGH-MORTALITY-RISK-001')).toBe(true);
	});

	it('raises a high-mortality flag for full score >= 5', () => {
		const d = lowClinicalPatient();
		d.identification.ageYears = 85; // 2
		d.comorbidityStep.comorbidity = 'major'; // 2 → clinical 4
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'all-other'; // 1 → full 5
		d.endoscopy.stigmata = 'none-or-dark-spot';
		const r = calculateRockallGrade(d);
		expect(r.fullRockallScore).toBe(5);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HIGH-MORTALITY-RISK-001')).toBe(true);
	});

	it('raises shock, stigmata, and malignancy flags', () => {
		const d = lowClinicalPatient();
		d.shock.systolicBloodPressure = 85; // hypotension → shock flag
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'upper-gi-malignancy'; // malignancy flag
		d.endoscopy.stigmata = 'high-risk'; // stigmata flag
		const ids = calculateRockallGrade(d).flaggedIssues.map((f) => f.id);
		expect(ids).toContain('F-SHOCK-001');
		expect(ids).toContain('F-HIGH-RISK-STIGMATA-001');
		expect(ids).toContain('F-UPPER-GI-MALIGNANCY-001');
	});

	it('raises an incomplete-assessment flag when vitals are missing', () => {
		const d = createDefaultAssessment();
		const r = calculateRockallGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = lowClinicalPatient();
		d.shock.systolicBloodPressure = 85;
		d.endoscopy.endoscopyPerformed = 'yes';
		d.endoscopy.diagnosis = 'upper-gi-malignancy';
		d.endoscopy.stigmata = 'high-risk';
		const r = calculateRockallGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('detectFlaggedIssues can be called directly on a grading result', () => {
		const grade = calculateRockallGrade(lowClinicalPatient());
		const flags = detectFlaggedIssues(lowClinicalPatient(), grade);
		expect(Array.isArray(flags)).toBe(true);
	});

	it('all rule IDs are unique', () => {
		const ids = rockallRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
