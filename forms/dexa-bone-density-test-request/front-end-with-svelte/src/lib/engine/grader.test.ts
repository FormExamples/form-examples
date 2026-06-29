import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { DexaRequest } from './types';

/** A fully-completed, routine, appropriate osteoporosis-screening request fixture. */
function createCompleteRequest(): DexaRequest {
	return {
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'gp',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net',
			supervisingConsultant: '',
			siteName: 'Headington Medical Practice',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			pregnancyStatus: 'not-applicable'
		},
		request: {
			scanRegion: 'hip-and-spine',
			primaryIndication: 'osteoporosis-screening',
			clinicalQuestion: 'Post-menopausal osteoporosis screening — please report T-scores.',
			relevantHistory: 'Post-menopausal at 51; maternal hip fracture.'
		},
		riskFactors: {
			fraxMajorFracturePercent: 12,
			previousFragilityFracture: false,
			longTermSteroids: false,
			menopauseStatus: 'post',
			parentalHipFracture: true,
			weightKg: 62
		},
		previousDexa: { previousDexa: 'none', previousDexaDate: '' },
		triage: { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' }
	};
}

describe('DEXA bone-density four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine screening request as accept / routine', () => {
		const g = calculateGrade(createCompleteRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.radiationDoseBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-OSTEOPOROSIS-SCREENING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates a recent fragility fracture with very high FRAX to urgent triage', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'fragility-fracture';
		r.riskFactors.previousFragilityFracture = true;
		r.riskFactors.fraxMajorFracturePercent = 34;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(9);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-RECENT-FRAGILITY-FRACTURE')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-HIGH-FRAX')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-FRAX-ABOVE-THRESHOLD')).toBe(true);
		expect(g.flags.some((f) => f.category === 'recent-fragility-fracture')).toBe(true);
		expect(g.flags.some((f) => f.category === 'high-frax-risk')).toBe(true);
	});

	it('escalates long-term steroids to urgent triage', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'long-term-steroids';
		r.request.scanRegion = 'spine';
		r.riskFactors.longTermSteroids = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-LONG-TERM-STEROIDS')).toBe(true);
	});

	it('defers a request when pregnancy is known or suspected (high dose → redirect)', () => {
		const r = createCompleteRequest();
		r.patient.pregnancyStatus = 'possible';
		const g = calculateGrade(r);
		expect(g.radiationDoseBand).toBe('high');
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-PREGNANCY')).toBe(true);
		expect(g.flags.some((f) => f.category === 'pregnancy')).toBe(true);
	});

	it('marks a poorly-sited request as usually-not-appropriate → query-referrer', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'monitoring-treatment';
		r.request.scanRegion = 'forearm';
		r.riskFactors.fraxMajorFracturePercent = 12;
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-MONITORING-TREATMENT-MISMATCH')).toBe(true);
	});

	it('grades a plausible-but-suboptimal site as may-be-appropriate', () => {
		const r = createCompleteRequest();
		r.request.scanRegion = 'forearm';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-OSTEOPOROSIS-SCREENING-PLAUSIBLE')).toBe(true);
	});

	it('reports moderate radiation dose for a whole-body request', () => {
		const r = createCompleteRequest();
		r.request.scanRegion = 'whole-body';
		const g = calculateGrade(r);
		expect(g.radiationDoseBand).toBe('moderate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-WHOLE-BODY-MODERATE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createCompleteRequest();
		r.request.clinicalQuestion = '';
		r.riskFactors.fraxMajorFracturePercent = null;
		const g = calculateGrade(r);
		// clinical question (3) + FRAX (2) of 16 total weight missing → 11/16 ≈ 69%.
		expect(g.completenessPercent).toBe(69);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-FRAX')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createCompleteRequest();
		r.riskFactors.previousFragilityFracture = true;
		const g = calculateGrade(r);
		const ids = g.firedRules.map((rule) => rule.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('DEXA bone-density flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the pregnancy flag', () => {
		const r = createCompleteRequest();
		r.patient.pregnancyStatus = 'pregnant';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-PREGNANCY-001')).toBe(true);
	});

	it('raises a duplicate-recent-DEXA flag for a recent prior scan without monitoring', () => {
		const r = createCompleteRequest();
		r.previousDexa.previousDexa = 'osteopenia';
		r.previousDexa.previousDexaDate = '2025-09-01';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'duplicate-recent-dexa')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createCompleteRequest();
		r.patient.pregnancyStatus = 'pregnant';
		r.request.clinicalQuestion = '';
		r.request.scanRegion = 'other';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete, routine, appropriate request', () => {
		const flags = detectFlags(createCompleteRequest());
		expect(flags).toHaveLength(0);
	});
});
