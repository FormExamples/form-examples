import { describe, it, expect } from 'vitest';
import { calculateGbsGrade } from './gbs-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { gbsRules } from './gbs-rules';
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
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		labs: { bloodUrea: null, haemoglobin: null },
		haemodynamics: { systolicBloodPressure: null, pulse: null },
		clinicalMarkers: { melaenaPresent: '', syncope: '', hepaticDisease: '', cardiacFailure: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-normal (total 0, very-low-risk) male patient. */
function allNormalPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		presentingComplaint: 'haematemesis'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageBand: '40-59', sex: 'male' };
	d.labs.bloodUrea = 5.0; // < 6.5 → 0
	d.labs.haemoglobin = 150; // male >= 130 → 0
	d.haemodynamics.systolicBloodPressure = 130; // >= 110 → 0
	d.haemodynamics.pulse = 70; // < 100 → 0
	d.clinicalMarkers.melaenaPresent = 'no';
	d.clinicalMarkers.syncope = 'no';
	d.clinicalMarkers.hepaticDisease = 'no';
	d.clinicalMarkers.cardiacFailure = 'no';
	return d;
}

/** A fully-answered, all-maximal (total 23) male patient. */
function allMaxPatient(): AssessmentData {
	const d = allNormalPatient();
	d.labs.bloodUrea = 30; // >= 25 → 6
	d.labs.haemoglobin = 80; // < 100 → 6
	d.haemodynamics.systolicBloodPressure = 80; // < 90 → 3
	d.haemodynamics.pulse = 120; // >= 100 → 1
	d.clinicalMarkers.melaenaPresent = 'yes'; // → 1
	d.clinicalMarkers.syncope = 'yes'; // → 2
	d.clinicalMarkers.hepaticDisease = 'yes'; // → 2
	d.clinicalMarkers.cardiacFailure = 'yes'; // → 2
	return d;
}

describe('GBS grader — total endpoints', () => {
	it('scores an all-normal patient at total 0 (very-low risk)', () => {
		const r = calculateGbsGrade(allNormalPatient());
		expect(r.bloodUreaPoints).toBe(0);
		expect(r.haemoglobinPoints).toBe(0);
		expect(r.systolicBloodPressurePoints).toBe(0);
		expect(r.pulsePoint).toBe(0);
		expect(r.melaenaPoint).toBe(0);
		expect(r.syncopePoint).toBe(0);
		expect(r.hepaticDiseasePoint).toBe(0);
		expect(r.cardiacFailurePoint).toBe(0);
		expect(r.gbsScore).toBe(0);
		expect(r.riskBand).toBe('very-low');
		expect(r.complete).toBe(true);
	});

	it('scores an all-maximal patient at total 23 (high risk)', () => {
		const r = calculateGbsGrade(allMaxPatient());
		expect(r.bloodUreaPoints).toBe(6);
		expect(r.haemoglobinPoints).toBe(6);
		expect(r.systolicBloodPressurePoints).toBe(3);
		expect(r.pulsePoint).toBe(1);
		expect(r.melaenaPoint).toBe(1);
		expect(r.syncopePoint).toBe(2);
		expect(r.hepaticDiseasePoint).toBe(2);
		expect(r.cardiacFailurePoint).toBe(2);
		expect(r.gbsScore).toBe(23);
		expect(r.riskBand).toBe('high');
	});
});

describe('GBS grader — blood urea bands', () => {
	it('bands urea at the 6.5 / 8.0 / 10.0 / 25.0 boundaries', () => {
		const d = allNormalPatient();
		d.labs.bloodUrea = 6.4;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(0);
		d.labs.bloodUrea = 6.5;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(2);
		d.labs.bloodUrea = 7.9;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(2);
		d.labs.bloodUrea = 8.0;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(3);
		d.labs.bloodUrea = 9.9;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(3);
		d.labs.bloodUrea = 10.0;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(4);
		d.labs.bloodUrea = 24.9;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(4);
		d.labs.bloodUrea = 25.0;
		expect(calculateGbsGrade(d).bloodUreaPoints).toBe(6);
	});
});

describe('GBS grader — sex-specific haemoglobin bands', () => {
	it('bands male haemoglobin at 100 / 120 / 130', () => {
		const d = allNormalPatient(); // sex: male
		d.labs.haemoglobin = 99;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(6);
		d.labs.haemoglobin = 100;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(3);
		d.labs.haemoglobin = 119;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(3);
		d.labs.haemoglobin = 120;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(1);
		d.labs.haemoglobin = 129;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(1);
		d.labs.haemoglobin = 130;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(0);
	});

	it('bands female haemoglobin at 100 / 120 (no men-only 120-129 band)', () => {
		const d = allNormalPatient();
		d.identification.sex = 'female';
		d.labs.haemoglobin = 99;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(6);
		d.labs.haemoglobin = 100;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(1);
		d.labs.haemoglobin = 119;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(1);
		d.labs.haemoglobin = 120;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(0);
		// 125 would be 1 point for a man, but 0 for a woman.
		d.labs.haemoglobin = 125;
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(0);
	});

	it('falls back to the female table for unknown / unset sex', () => {
		const d = allNormalPatient();
		d.identification.sex = 'unknown';
		d.labs.haemoglobin = 125; // female band → 0 (never the men-only 1-point band)
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(0);
		d.identification.sex = '';
		expect(calculateGbsGrade(d).haemoglobinPoints).toBe(0);
	});
});

describe('GBS grader — systolic BP and pulse bands', () => {
	it('bands systolic BP at 90 / 100 / 110', () => {
		const d = allNormalPatient();
		d.haemodynamics.systolicBloodPressure = 89;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(3);
		d.haemodynamics.systolicBloodPressure = 90;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(2);
		d.haemodynamics.systolicBloodPressure = 99;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(2);
		d.haemodynamics.systolicBloodPressure = 100;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(1);
		d.haemodynamics.systolicBloodPressure = 109;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(1);
		d.haemodynamics.systolicBloodPressure = 110;
		expect(calculateGbsGrade(d).systolicBloodPressurePoints).toBe(0);
	});

	it('bands pulse at 100', () => {
		const d = allNormalPatient();
		d.haemodynamics.pulse = 99;
		expect(calculateGbsGrade(d).pulsePoint).toBe(0);
		d.haemodynamics.pulse = 100;
		expect(calculateGbsGrade(d).pulsePoint).toBe(1);
	});
});

describe('GBS grader — completeness', () => {
	it('marks a blank assessment incomplete and raises a data-completeness flag', () => {
		const r = calculateGbsGrade(createDefaultAssessment());
		expect(r.complete).toBe(false);
		expect(r.gbsScore).toBe(0);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('treats a fully-answered patient with unknown sex as incomplete', () => {
		const d = allNormalPatient();
		d.identification.sex = 'unknown';
		const r = calculateGbsGrade(d);
		expect(r.complete).toBe(false);
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('all rule IDs are unique', () => {
		const ids = gbsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('GBS flagged-issue detection', () => {
	it('raises no red flags for a complete low-moderate patient without instability', () => {
		const d = allNormalPatient();
		d.labs.bloodUrea = 7.0; // 2 pt → total 2, low-moderate, no instability
		const r = calculateGbsGrade(d);
		expect(r.riskBand).toBe('low-moderate');
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises high-score, shock, and anaemia flags for a high-risk patient', () => {
		const r = calculateGbsGrade(allMaxPatient());
		const ids = r.flaggedIssues.map((f) => f.id);
		expect(ids).toContain('F-HIGH-SCORE-ADMIT-001');
		expect(ids).toContain('F-SHOCK-001');
		expect(ids).toContain('F-LOW-HB-TRANSFUSION-001');
		expect(ids).toContain('F-SYNCOPE-001');
	});

	it('raises the very-low-risk info flag at total 0', () => {
		const r = calculateGbsGrade(allNormalPatient());
		expect(r.flaggedIssues.some((f) => f.id === 'F-LOW-RISK-DISCHARGE-001')).toBe(true);
	});

	it('sorts flags by priority (high first, info last)', () => {
		const r = calculateGbsGrade(allMaxPatient());
		const order: Record<string, number> = { high: 0, medium: 1, low: 2, info: 3 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('detectFlaggedIssues can be called directly on a grading result', () => {
		const grade = calculateGbsGrade(allMaxPatient());
		const flags = detectFlaggedIssues(allMaxPatient(), grade);
		expect(flags.length).toBeGreaterThan(0);
	});
});
