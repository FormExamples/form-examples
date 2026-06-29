import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { CytologyRequest } from './types';

/** A complete, routine, appropriate cervical-screening request (not yet collected). */
function createRoutineScreening(): CytologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1979-03-14',
		nhsNumber: '485 777 3456',
		interpreterRequired: false
	};
	r.request = {
		specimenType: 'cervical-smear',
		specimenSite: 'Cervix',
		primaryIndication: 'cervical-screening',
		clinicalQuestion: 'Routine recall cervical screening.',
		clinicalDetails: 'Asymptomatic, on routine recall.'
	};
	r.context = { hpvTestRequested: true, previousAbnormalCytology: 'none', lastMenstrualPeriodDate: '2026-05-28' };
	r.collection = { specimenCollected: 'no', collectionDatetime: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/** A suspected-malignancy pleural effusion — auto-escalates to two-week-wait. */
function createSuspectedMalignancy(): CytologyRequest {
	const r = createRoutineScreening();
	r.request = {
		specimenType: 'fluid-pleural-ascitic',
		specimenSite: 'Right pleural cavity',
		primaryIndication: 'suspected-malignancy',
		clinicalQuestion: 'Exclude malignant cells in a new unilateral pleural effusion.',
		clinicalDetails: 'Weight loss, smoker, large right pleural effusion.'
	};
	r.context = { hpvTestRequested: false, previousAbnormalCytology: 'none', lastMenstrualPeriodDate: '' };
	r.collection = { specimenCollected: 'yes', collectionDatetime: '' };
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'outpatient', notes: '' };
	return r;
}

describe('Cytology request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine screening as usually-appropriate / routine / accept', () => {
		const g = calculateGrade(createRoutineScreening());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.preanalyticalBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CERVICAL-SCREENING-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PREANALYTICAL-NOT-COLLECTED')).toBe(true);
	});

	it('auto-escalates a suspected-malignancy indication to the two-week-wait pathway', () => {
		const g = calculateGrade(createSuspectedMalignancy());
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.targetTimeframe).toBe('Within 14 days (2-week-wait pathway)');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-CANCER')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('auto-escalates a previous high-grade cytology result to two-week-wait', () => {
		const r = createRoutineScreening();
		r.context.previousAbnormalCytology = 'high-grade';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-PREVIOUS-HIGH-GRADE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'previous-high-grade-cytology')).toBe(true);
	});

	it('marks a stale collected specimen as reject-risk', () => {
		const r = createSuspectedMalignancy();
		r.collection = { specimenCollected: 'yes', collectionDatetime: '2026-01-02T08:00' };
		const g = calculateGrade(r);
		expect(g.preanalyticalBand).toBe('reject-risk');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PREANALYTICAL-STALE')).toBe(true);
	});

	it('marks a clearly mismatched indication / specimen pairing as usually-not-appropriate', () => {
		const r = createRoutineScreening();
		r.request.primaryIndication = 'thyroid-nodule';
		r.request.specimenType = 'urine-cytology';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-THYROID-NODULE-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineScreening();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 17 total weight missing → 11/17 ≈ 65%.
		expect(g.completenessPercent).toBe(65);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createSuspectedMalignancy());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Cytology request flag detection', () => {
	it('flags a specimen that has not been collected', () => {
		const r = createRoutineScreening();
		r.collection.specimenCollected = 'no';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SPECIMEN-NOT-COLLECTED-001')).toBe(true);
	});

	it('flags a missing indication', () => {
		const r = createRoutineScreening();
		r.request.primaryIndication = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createSuspectedMalignancy();
		r.request.clinicalDetails = '';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
