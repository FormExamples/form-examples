import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { evaluateTiming } from './timing-rules';
import { createDefaultRequest } from './defaults';
import type { ToxicologyRequest } from './types';

/** A complete, routine therapeutic-drug-monitoring request (lithium level). */
function createRoutineTdm(): ToxicologyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.assays.lithiumLevel = true;
	r.clinical.primaryIndication = 'therapeutic-drug-monitoring';
	r.clinical.clinicalDetails = 'Stable on lithium; routine 3-monthly level.';
	r.clinical.timeSinceIngestionHours = 12;
	r.specimen.specimenCollected = 'yes';
	r.triage.urgency = 'routine';
	return r;
}

describe('Toxicology request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine TDM request as accept / routine', () => {
		const g = calculateGrade(createRoutineTdm());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.timingBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-THERAPEUTIC-DRUG-MONITORING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('forces invalid timing for a paracetamol level < 4 h post-ingestion', () => {
		const r = createRoutineTdm();
		r.assays.lithiumLevel = false;
		r.assays.paracetamolLevel = true;
		r.clinical.primaryIndication = 'suspected-overdose';
		r.clinical.timeSinceIngestionHours = 2;
		const g = calculateGrade(r);
		expect(g.timingBand).toBe('invalid');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TIMING-PARACETAMOL-INVALID')).toBe(true);
		expect(g.flags.some((f) => f.category === 'paracetamol-timing-critical')).toBe(true);
	});

	it('auto-escalates a deliberate overdose to stat triage', () => {
		const r = createRoutineTdm();
		r.clinical.deliberateOverdose = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('stat');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-DELIBERATE-OVERDOSE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-overdose-stat')).toBe(true);
		expect(g.flags.some((f) => f.category === 'deliberate-self-harm-safeguarding')).toBe(true);
	});

	it('auto-escalates a symptomatic patient to stat triage', () => {
		const r = createRoutineTdm();
		r.clinical.symptomatic = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('stat');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SYMPTOMATIC')).toBe(true);
	});

	it('scores the floor and flags when no assay is selected', () => {
		const r = createRoutineTdm();
		r.assays.lithiumLevel = false;
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(1);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-NO-TEST')).toBe(true);
		expect(g.flags.some((f) => f.category === 'no-test-selected')).toBe(true);
	});

	it('marks a mismatched assay/indication pairing as usually-not-appropriate', () => {
		const r = createRoutineTdm();
		r.clinical.primaryIndication = 'occupational-screen';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-OCCUPATIONAL-SCREEN-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineTdm();
		r.clinical.primaryIndication = '';
		r.clinical.clinicalDetails = '';
		const g = calculateGrade(r);
		// indication (3) + clinical details (3) of 17 total weight missing → 11/17 ≈ 65%.
		expect(g.completenessPercent).toBe(65);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createRoutineTdm();
		r.clinical.deliberateOverdose = true;
		const g = calculateGrade(r);
		const ids = g.firedRules.map((rule) => rule.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Toxicology timing evaluation', () => {
	it('flags a paracetamol level with unknown ingestion time as caution', () => {
		const r = createRoutineTdm();
		r.assays.lithiumLevel = false;
		r.assays.paracetamolLevel = true;
		r.clinical.timeSinceIngestionHours = null;
		const t = evaluateTiming(r);
		expect(t.band).toBe('caution');
		expect(t.firedRules.some((rule) => rule.ruleId === 'R-TIMING-PARACETAMOL-UNKNOWN')).toBe(true);
	});
});

describe('Toxicology flag detection', () => {
	it('raises specimen-not-collected and missing-clinical-details flags', () => {
		const r = createRoutineTdm();
		r.specimen.specimenCollected = 'no';
		r.clinical.clinicalDetails = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'specimen-not-collected')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
	});

	it('returns no flags for a complete routine TDM request', () => {
		const flags = detectFlags(createRoutineTdm(), { timingBand: 'ok' });
		expect(flags).toHaveLength(0);
	});
});
