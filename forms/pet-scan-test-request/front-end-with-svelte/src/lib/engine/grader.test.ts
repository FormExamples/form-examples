import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefault } from './defaults';
import type { PetScanRequest } from './types';

/** A complete, appropriate, well-prepared FDG-PET-CT staging request. */
function createRoutineRequest(): PetScanRequest {
	const r = createDefault();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.request.scanType = 'fdg-pet-ct';
	r.request.primaryIndication = 'cancer-staging';
	r.request.clinicalQuestion = 'Stage biopsy-proven NSCLC and assess for distant metastases.';
	r.preparation.bloodGlucoseMmolL = 5.6;
	r.preparation.pregnancyStatus = 'not-applicable';
	r.justification.irMeRJustification = 'Staging directly determines curative vs palliative intent.';
	r.justification.urgency = 'routine';
	return r;
}

describe('PET scan request four-axis vetting engine', () => {
	it('grades a complete, appropriate, well-prepared request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.prepSafetyBand).toBe('ok');
		expect(g.radiationDoseBand).toBe('high');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		// A high-dose FDG-PET-CT study always carries the informational, low-priority
		// high-radiation-dose flag; there must be NO high/medium-priority safety flags.
		expect(g.flags).toHaveLength(1);
		expect(g.flags[0].flagId).toBe('F-HIGH-RADIATION-DOSE-001');
		expect(g.flags.every((f) => f.priority === 'low')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CANCER-STAGING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('forces contraindicated + reject for a pregnant patient', () => {
		const r = createRoutineRequest();
		r.preparation.pregnancyStatus = 'pregnant';
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-PREGNANT')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREGNANCY-001')).toBe(true);
	});

	it('raises caution + query-referrer for uncontrolled glucose on an FDG study', () => {
		const r = createRoutineRequest();
		r.preparation.bloodGlucoseMmolL = 14.2;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-GLUCOSE-UNCONTROLLED')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-UNCONTROLLED-GLUCOSE-001')).toBe(true);
	});

	it('flags a missing glucose reading on an FDG study', () => {
		const r = createRoutineRequest();
		r.preparation.bloodGlucoseMmolL = null;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-GLUCOSE-MISSING')).toBe(true);
		expect(g.flags.some((f) => f.category === 'missing-glucose')).toBe(true);
	});

	it('marks a mismatched indication / scan type as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'neurology-dementia';
		r.request.scanType = 'psma-pet';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-NEUROLOGY-DEMENTIA-MISMATCH')).toBe(true);
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'treatment-response';
		r.request.scanType = 'psma-pet';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-TREATMENT-RESPONSE-PLAUSIBLE')).toBe(true);
	});

	it('follows the requested urgency for the triage tier', () => {
		const r = createRoutineRequest();
		r.justification.urgency = 'urgent';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.targetTimeframe).toBe('Within 3-7 days');
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 17 total weight missing → 11/17 ≈ 65%.
		expect(g.completenessPercent).toBe(65);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('PET scan request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createDefault();
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises a high-radiation-dose flag for a high-dose study', () => {
		const r = createRoutineRequest();
		const flags = detectFlags(r, { radiationDoseBand: 'high' });
		expect(flags.some((f) => f.flagId === 'F-HIGH-RADIATION-DOSE-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createDefault();
		r.preparation.pregnancyStatus = 'pregnant';
		const flags = detectFlags(r, { radiationDoseBand: 'high' });
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete, well-prepared request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
