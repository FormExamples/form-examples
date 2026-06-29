import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { MicrobiologyRequest } from './types';

/** A fully-completed, routine appropriate request: urine MC&S for a UTI. */
function createRoutineRequest(): MicrobiologyRequest {
	return {
		...createDefaultRequest(),
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
			nhsNumber: '485 777 3456'
		},
		specimen: {
			specimenType: 'urine',
			specimenSiteDetail: 'Midstream urine',
			specimenCollected: 'yes',
			collectionDatetime: '2026-06-10T09:30'
		},
		tests: {
			...createDefaultRequest().tests,
			cultureAndSensitivity: true
		},
		clinical: {
			primaryIndication: 'urinary-tract-infection',
			clinicalDetails: 'Dysuria and frequency for three days; no fever.',
			fever: false,
			currentAntibiotics: false,
			antibioticName: '',
			recentTravel: false,
			immunocompromised: false
		},
		triage: {
			urgency: 'routine',
			requestedByDate: '',
			setting: 'community',
			notes: ''
		}
	};
}

describe('Microbiology culture request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.preanalyticalBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-URINARY-TRACT-INFECTION-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PREANALYTICAL-OK')).toBe(true);
	});

	it('auto-escalates suspected sepsis to stat with a high-priority flag', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'suspected-sepsis';
		r.specimen.specimenType = 'blood-culture';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('stat');
		expect(g.firedRules.some((x) => x.ruleId === 'R-TRIAGE-SUSPECTED-SEPSIS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-sepsis-stat')).toBe(true);
	});

	it('flags a blood culture taken on antibiotics as reject-risk → reject', () => {
		const r = createRoutineRequest();
		r.specimen.specimenType = 'blood-culture';
		r.clinical.primaryIndication = 'pyrexia-unknown-origin';
		r.clinical.currentAntibiotics = true;
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((x) => x.ruleId === 'R-PREANALYTICAL-BLOOD-CULTURE-ON-ABX')).toBe(true);
		expect(g.flags.some((f) => f.category === 'blood-culture-before-antibiotics')).toBe(true);
	});

	it('treats a request with no test selected as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.tests.cultureAndSensitivity = false;
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((x) => x.ruleId === 'R-APPROP-NO-TEST')).toBe(true);
		expect(g.flags.some((f) => f.category === 'no-test-selected')).toBe(true);
	});

	it('marks a mismatched specimen / indication pairing as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'gastroenteritis';
		r.specimen.specimenType = 'throat-swab';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.firedRules.some((x) => x.ruleId === 'R-APPROP-GASTROENTERITIS-MISMATCH')).toBe(true);
	});

	it('treats a specimen not yet collected as reject-risk with a flag', () => {
		const r = createRoutineRequest();
		r.specimen.specimenCollected = 'no';
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.firedRules.some((x) => x.ruleId === 'R-PREANALYTICAL-NOT-COLLECTED')).toBe(true);
		expect(g.flags.some((f) => f.category === 'specimen-not-collected')).toBe(true);
	});

	it('computes weighted partial completeness when the highest-value field is missing', () => {
		const r = createRoutineRequest();
		r.clinical.clinicalDetails = '';
		const g = calculateGrade(r);
		// clinical details (3) of 17 total weight missing → 14/17 ≈ 82%.
		expect(g.completenessPercent).toBe(82);
		expect(g.firedRules.some((x) => x.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'suspected-sepsis';
		r.specimen.specimenType = 'blood-culture';
		r.clinical.currentAntibiotics = true;
		const g = calculateGrade(r);
		const ids = g.firedRules.map((x) => x.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Microbiology culture request flag detection', () => {
	it('flags missing clinical details and missing indication', () => {
		const r = createRoutineRequest();
		r.clinical.clinicalDetails = '';
		r.clinical.primaryIndication = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
	});

	it('raises the suspected-sepsis-stat flag', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = 'suspected-sepsis';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-SEPSIS-STAT-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.clinical.primaryIndication = '';
		r.clinical.clinicalDetails = '';
		r.tests.cultureAndSensitivity = false;
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createRoutineRequest());
		expect(flags).toHaveLength(0);
	});
});
