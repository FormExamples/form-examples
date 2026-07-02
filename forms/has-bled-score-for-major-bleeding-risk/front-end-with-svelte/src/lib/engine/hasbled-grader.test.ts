import { describe, it, expect } from 'vitest';
import { calculateHasBledGrade } from './hasbled-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { hasBledRules } from './hasbled-rules';
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
			anticoagulationStatus: '',
			chaDsVascScore: null
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		hypertension: { hypertensionUncontrolled: '' },
		organFunction: { abnormalRenalFunction: '', abnormalLiverFunction: '' },
		stroke: { strokeHistory: '' },
		bleeding: { bleedingHistory: '' },
		labileInr: { labileInr: '' },
		drugsAlcohol: { antiplateletOrNsaid: '', alcoholUnitsPerWeek: null },
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
		careSetting: 'cardiology',
		anticoagulationStatus: 'considering',
		chaDsVascScore: 2
	};
	d.identification = { patientIdentifier: 'AF-1001', ageYears: 58, sex: 'male' };
	d.hypertension.hypertensionUncontrolled = 'no';
	d.organFunction.abnormalRenalFunction = 'no';
	d.organFunction.abnormalLiverFunction = 'no';
	d.stroke.strokeHistory = 'no';
	d.bleeding.bleedingHistory = 'no';
	d.labileInr.labileInr = 'no';
	d.drugsAlcohol.antiplateletOrNsaid = 'no';
	d.drugsAlcohol.alcoholUnitsPerWeek = 4;
	return d;
}

describe('HAS-BLED grading engine', () => {
	it('scores 0 for a fully-negative patient (low risk)', () => {
		const r = calculateHasBledGrade(createNegativePatient());
		expect(r.hasBledScore).toBe(0);
		expect(r.hypertensionPoint).toBe(0);
		expect(r.elderlyPoint).toBe(0);
		expect(r.alcoholPoint).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('elderly criterion fires at age 66, not 65', () => {
		const d65 = createNegativePatient();
		d65.identification.ageYears = 65;
		expect(calculateHasBledGrade(d65).elderlyPoint).toBe(0);

		const d66 = createNegativePatient();
		d66.identification.ageYears = 66;
		expect(calculateHasBledGrade(d66).elderlyPoint).toBe(1);
	});

	it('alcohol criterion fires at 8 units, not 7', () => {
		const d7 = createNegativePatient();
		d7.drugsAlcohol.alcoholUnitsPerWeek = 7;
		expect(calculateHasBledGrade(d7).alcoholPoint).toBe(0);

		const d8 = createNegativePatient();
		d8.drugsAlcohol.alcoholUnitsPerWeek = 8;
		expect(calculateHasBledGrade(d8).alcoholPoint).toBe(1);
	});

	it('risk-band boundary: 0 is low, 1-2 moderate, 3+ high', () => {
		const d0 = createNegativePatient();
		expect(calculateHasBledGrade(d0).riskBand).toBe('low');

		const d1 = createNegativePatient();
		d1.hypertension.hypertensionUncontrolled = 'yes';
		const r1 = calculateHasBledGrade(d1);
		expect(r1.hasBledScore).toBe(1);
		expect(r1.riskBand).toBe('moderate');

		const d2 = createNegativePatient();
		d2.hypertension.hypertensionUncontrolled = 'yes';
		d2.stroke.strokeHistory = 'yes';
		const r2 = calculateHasBledGrade(d2);
		expect(r2.hasBledScore).toBe(2);
		expect(r2.riskBand).toBe('moderate');

		const d3 = createNegativePatient();
		d3.hypertension.hypertensionUncontrolled = 'yes';
		d3.stroke.strokeHistory = 'yes';
		d3.bleeding.bleedingHistory = 'yes';
		const r3 = calculateHasBledGrade(d3);
		expect(r3.hasBledScore).toBe(3);
		expect(r3.riskBand).toBe('high');
	});

	it('scores the maximum total of 9 with every criterion positive', () => {
		const d = createNegativePatient();
		d.identification.ageYears = 80;
		d.hypertension.hypertensionUncontrolled = 'yes';
		d.organFunction.abnormalRenalFunction = 'yes';
		d.organFunction.abnormalLiverFunction = 'yes';
		d.stroke.strokeHistory = 'yes';
		d.bleeding.bleedingHistory = 'yes';
		d.labileInr.labileInr = 'yes';
		d.drugsAlcohol.antiplateletOrNsaid = 'yes';
		d.drugsAlcohol.alcoholUnitsPerWeek = 20;
		const r = calculateHasBledGrade(d);
		expect(r.hasBledScore).toBe(9);
		expect(r.riskBand).toBe('high');
	});

	it('a missing numeric input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateHasBledGrade(d);
		expect(r.hasBledScore).toBe(0);
		expect(r.elderlyPoint).toBe(0);
		expect(r.alcoholPoint).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('all rule IDs are unique', () => {
		const ids = hasBledRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('HAS-BLED flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the high-bleeding-risk flag when HAS-BLED >= 3', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 3);
		expect(flags.some((f) => f.id === 'F-HIGH-BLEEDING-RISK-001')).toBe(true);
	});

	it('raises the four modifiable-factor flags', () => {
		const d = createNegativePatient();
		d.hypertension.hypertensionUncontrolled = 'yes';
		d.labileInr.labileInr = 'yes';
		d.drugsAlcohol.antiplateletOrNsaid = 'yes';
		d.drugsAlcohol.alcoholUnitsPerWeek = 12;
		const flags = detectFlaggedIssues(d, 4);
		expect(flags.some((f) => f.id === 'F-MODIFIABLE-HYPERTENSION-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-MODIFIABLE-LABILE-INR-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-MODIFIABLE-DRUGS-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-MODIFIABLE-ALCOHOL-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.hypertension.hypertensionUncontrolled = 'yes'; // medium
		const flags = detectFlaggedIssues(d, 3); // high + medium
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
