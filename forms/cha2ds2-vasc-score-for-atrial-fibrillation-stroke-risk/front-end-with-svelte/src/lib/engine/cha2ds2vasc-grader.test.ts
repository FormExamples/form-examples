import { describe, it, expect } from 'vitest';
import { calculateCha2ds2VascGrade, ANNUAL_STROKE_RATE_PERCENT } from './cha2ds2vasc-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { cha2ds2VascRules } from './cha2ds2vasc-rules';
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
			atrialFibrillationType: ''
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		cardiac: { congestiveHeartFailure: '', hypertension: '', vascularDisease: '' },
		metabolic: { diabetes: '', priorStrokeTiaThromboembolism: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered, all-negative (male, under 65) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'cardiology',
		atrialFibrillationType: 'paroxysmal'
	};
	d.identification = { patientIdentifier: 'AF-1001', ageYears: 55, sex: 'male' };
	d.cardiac = { congestiveHeartFailure: 'no', hypertension: 'no', vascularDisease: 'no' };
	d.metabolic = { diabetes: 'no', priorStrokeTiaThromboembolism: 'no' };
	return d;
}

describe('CHA2DS2-VASc grading engine', () => {
	it('scores 0 for a fully-negative male under 65 (low risk)', () => {
		const r = calculateCha2ds2VascGrade(createNegativePatient());
		expect(r.cha2ds2VascScore).toBe(0);
		expect(r.congestiveHeartFailurePoint).toBe(0);
		expect(r.agePoint).toBe(0);
		expect(r.sexPoint).toBe(0);
		expect(r.riskBand).toBe('low');
		expect(r.anticoagulationRecommendation).toBe('none');
	});

	it('age point fires at 65 (1) and 75 (2), never both — boundaries 64/65/74/75', () => {
		const d64 = createNegativePatient();
		d64.identification.ageYears = 64;
		expect(calculateCha2ds2VascGrade(d64).agePoint).toBe(0);

		const d65 = createNegativePatient();
		d65.identification.ageYears = 65;
		expect(calculateCha2ds2VascGrade(d65).agePoint).toBe(1);

		const d74 = createNegativePatient();
		d74.identification.ageYears = 74;
		expect(calculateCha2ds2VascGrade(d74).agePoint).toBe(1);

		const d75 = createNegativePatient();
		d75.identification.ageYears = 75;
		expect(calculateCha2ds2VascGrade(d75).agePoint).toBe(2);
	});

	it('female sex category alone (total 1) is low risk', () => {
		const d = createNegativePatient();
		d.identification.sex = 'female';
		const r = calculateCha2ds2VascGrade(d);
		expect(r.cha2ds2VascScore).toBe(1);
		expect(r.sexPoint).toBe(1);
		expect(r.riskBand).toBe('low');
		expect(r.anticoagulationRecommendation).toBe('none');
	});

	it('male total 1 is intermediate risk', () => {
		const d = createNegativePatient();
		d.cardiac.hypertension = 'yes';
		const r = calculateCha2ds2VascGrade(d);
		expect(r.cha2ds2VascScore).toBe(1);
		expect(r.riskBand).toBe('intermediate');
		expect(r.anticoagulationRecommendation).toBe('consider');
	});

	it('prior stroke / TIA contributes 2 points', () => {
		const d = createNegativePatient();
		d.metabolic.priorStrokeTiaThromboembolism = 'yes';
		const r = calculateCha2ds2VascGrade(d);
		expect(r.strokePoint).toBe(2);
		expect(r.cha2ds2VascScore).toBe(2);
		expect(r.riskBand).toBe('high');
	});

	it('sums every weighted criterion to the maximum of 9', () => {
		const d = createDefaultAssessment();
		d.identification = { patientIdentifier: 'AF-MAX', ageYears: 80, sex: 'female' };
		d.cardiac = { congestiveHeartFailure: 'yes', hypertension: 'yes', vascularDisease: 'yes' };
		d.metabolic = { diabetes: 'yes', priorStrokeTiaThromboembolism: 'yes' };
		const r = calculateCha2ds2VascGrade(d);
		// CHF 1 + HTN 1 + age>=75 2 + DM 1 + stroke 2 + vasc 1 + female 1 = 9
		expect(r.cha2ds2VascScore).toBe(9);
		expect(r.riskBand).toBe('high');
		expect(r.anticoagulationRecommendation).toBe('recommended');
	});

	it('maps every total 0-9 to its annual stroke-rate lookup value', () => {
		expect(ANNUAL_STROKE_RATE_PERCENT).toHaveLength(10);
		// A representative build-up: female (1) + progressively add factors.
		const cases: Array<{ build: (d: AssessmentData) => void; score: number }> = [
			{ build: () => {}, score: 0 },
			{ build: (d) => (d.cardiac.hypertension = 'yes'), score: 1 },
			{
				build: (d) => {
					d.cardiac.hypertension = 'yes';
					d.cardiac.congestiveHeartFailure = 'yes';
				},
				score: 2
			}
		];
		for (const c of cases) {
			const d = createNegativePatient();
			c.build(d);
			const r = calculateCha2ds2VascGrade(d);
			expect(r.cha2ds2VascScore).toBe(c.score);
			expect(r.annualStrokeRatePercent).toBe(ANNUAL_STROKE_RATE_PERCENT[c.score]);
		}
	});

	it('a missing enum / age input contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateCha2ds2VascGrade(d);
		expect(r.cha2ds2VascScore).toBe(0);
		expect(r.riskBand).toBe('low');
	});

	it('all rule IDs are unique', () => {
		const ids = cha2ds2VascRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('CHA2DS2-VASc flagged-issue detection', () => {
	it('raises no red flags for a complete low-risk patient', () => {
		const d = createNegativePatient();
		const flags = detectFlaggedIssues(d, { riskBand: 'low', cha2ds2VascScore: 0 });
		expect(flags).toHaveLength(0);
	});

	it('raises anticoagulation, high-risk-untreated, and bleeding-risk flags when high', () => {
		const d = createNegativePatient();
		const flags = detectFlaggedIssues(d, { riskBand: 'high', cha2ds2VascScore: 4 });
		expect(flags.some((f) => f.id === 'F-ANTICOAGULATION-RECOMMENDED-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-HIGH-RISK-UNTREATED-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-BLEEDING-RISK-CROSS-REF-001')).toBe(true);
	});

	it('raises prior-stroke and advanced-age flags', () => {
		const d = createNegativePatient();
		d.metabolic.priorStrokeTiaThromboembolism = 'yes';
		d.identification.ageYears = 82;
		const flags = detectFlaggedIssues(d, { riskBand: 'high', cha2ds2VascScore: 4 });
		expect(flags.some((f) => f.id === 'F-PRIOR-STROKE-TIA-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ADVANCED-AGE-001')).toBe(true);
	});

	it('raises the female-sex-modifier flag when total is 1', () => {
		const d = createNegativePatient();
		d.identification.sex = 'female';
		const flags = detectFlaggedIssues(d, { riskBand: 'low', cha2ds2VascScore: 1 });
		expect(flags.some((f) => f.id === 'F-FEMALE-SEX-MODIFIER-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when an input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, { riskBand: 'low', cha2ds2VascScore: 0 });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.metabolic.priorStrokeTiaThromboembolism = 'yes'; // high
		d.identification.ageYears = 80; // medium
		const flags = detectFlaggedIssues(d, { riskBand: 'high', cha2ds2VascScore: 4 });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
