import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { BloodTestRequest } from './types';

/** A complete, appropriate, routine FBC + U&E + LFT monitoring request. */
function routineRequest(): BloodTestRequest {
	const d = createDefaultRequest();
	d.clinician = {
		...d.clinician,
		clinicianName: 'Dr H Iqbal',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		referralDate: '2026-05-04'
	};
	d.patient = {
		firstName: 'Amara',
		lastName: 'Okafor',
		dateOfBirth: '1968-04-12',
		nhsNumber: '401 234 5678'
	};
	d.panels.fullBloodCount = true;
	d.panels.ureaElectrolytes = true;
	d.panels.liverFunction = true;
	d.clinical = {
		primaryIndication: 'routine-monitoring',
		clinicalDetails: 'Annual review of long-term condition; stable.',
		relevantMedications: 'Ramipril 5 mg OD.'
	};
	d.triage.urgency = 'routine';
	return d;
}

describe('Blood test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(routineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.preanalyticalBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.testsSelectedCount).toBe(3);
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-ROUTINE-MONITORING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('rejects a request with no panel selected', () => {
		const d = createDefaultRequest();
		d.clinical.primaryIndication = 'fatigue';
		d.clinical.clinicalDetails = 'Tired all the time for 6 weeks.';
		const g = calculateGrade(d);
		expect(g.testsSelectedCount).toBe(0);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(1);
		expect(g.recommendation).toBe('reject');
		expect(g.flags.some((f) => f.category === 'no-test-selected')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-NO-TEST')).toBe(true);
	});

	it('escalates a critical test (troponin) to stat triage with a flag', () => {
		const d = routineRequest();
		d.panels.troponin = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('stat');
		expect(g.targetTimeframe).toBe('Immediate / within 1 hour');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-CRITICAL-TROPONIN')).toBe(true);
		expect(g.flags.some((f) => f.category === 'stat-critical')).toBe(true);
	});

	it('forces a fasting violation + reject-risk when a fasting test is non-fasting', () => {
		const d = routineRequest();
		d.panels.lipidProfile = true;
		d.preanalytical.fastingStatus = 'non-fasting';
		const g = calculateGrade(d);
		expect(g.fastingViolation).toBe(true);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.category === 'fasting-required-not-met')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PREANALYTICAL-FASTING-NOT-MET')).toBe(true);
	});

	it('scores a panel/indication mismatch as usually-not-appropriate', () => {
		const d = routineRequest();
		d.panels.fullBloodCount = false;
		d.panels.ureaElectrolytes = false;
		d.panels.liverFunction = false;
		d.panels.troponin = true;
		d.clinical.primaryIndication = 'thyroid-symptoms';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-THYROID-SYMPTOMS-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = routineRequest();
		d.clinical.primaryIndication = '';
		d.clinical.clinicalDetails = '';
		const g = calculateGrade(d);
		// indication (3) + clinical details (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('raises a blood-borne-virus precaution flag', () => {
		const d = routineRequest();
		d.safety.knownBloodBorneVirus = true;
		const g = calculateGrade(d);
		expect(g.flags.some((f) => f.category === 'blood-borne-virus-precaution')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const d = routineRequest();
		d.panels.troponin = true;
		d.panels.lipidProfile = true;
		d.preanalytical.fastingStatus = 'non-fasting';
		const g = calculateGrade(d);
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Blood test request flag detection', () => {
	it('flags missing indication and missing clinical details', () => {
		const d = routineRequest();
		d.clinical.primaryIndication = '';
		d.clinical.clinicalDetails = '';
		const flags = detectFlags(d, {});
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const d = createDefaultRequest();
		d.safety.knownBloodBorneVirus = true; // medium
		// no-test-selected (high), missing-indication (medium), missing-clinical-details (medium)
		const flags = detectFlags(d, {});
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(routineRequest(), {});
		expect(flags).toHaveLength(0);
	});
});
