import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { HolterRequest } from './types';

/** A fully-completed, routine appropriate request fixture (daily palpitations, 24-hour Holter). */
function createRoutineRequest(): HolterRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'GP',
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
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		bodyMassIndex: 27.4
	};
	r.request = {
		monitorType: '24-hour',
		primaryIndication: 'palpitations',
		clinicalQuestion: 'Daily palpitations — capture the rhythm during a typical episode.',
		relevantHistory: 'Several months of daily brief palpitations.'
	};
	r.symptoms = {
		palpitations: true,
		syncope: false,
		presyncope: false,
		breathlessness: false,
		symptomFrequency: 'daily'
	};
	r.cardiac = { knownArrhythmia: '', recentStrokeTia: false, relevantMedications: 'Bisoprolol.' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

describe('Holter monitor request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.matchFit).toBe('matched');
		expect(g.appropriatenessScore).toBe(9);
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-PALPITATIONS-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates syncope to emergency triage regardless of requested urgency', () => {
		const r = createRoutineRequest();
		r.symptoms.syncope = true;
		r.symptoms.presyncope = true;
		r.triage.urgency = 'routine';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / 24-48 hours');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SYNCOPE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'syncope-red-flag')).toBe(true);
	});

	it('treats known VT as emergency triage and a suspected-VT flag', () => {
		const r = createRoutineRequest();
		r.cardiac.knownArrhythmia = 'vt';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SUSPECTED-VT')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SUSPECTED-VT-001')).toBe(true);
	});

	it('escalates recent stroke / TIA to urgent and a post-stroke AF flag', () => {
		const r = createRoutineRequest();
		r.cardiac.recentStrokeTia = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-POST-STROKE-AF')).toBe(true);
		expect(g.flags.some((f) => f.category === 'post-stroke-af-detection')).toBe(true);
	});

	it('redirects a monitor that mismatches the symptom frequency', () => {
		const r = createRoutineRequest();
		r.symptoms.symptomFrequency = 'rare';
		// 24-hour Holter for rare symptoms is a poor fit.
		const g = calculateGrade(r);
		expect(g.matchFit).toBe('mismatched');
		expect(g.appropriatenessScore).toBe(5);
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-MATCH-RARE-MISMATCH')).toBe(true);
		expect(g.flags.some((f) => f.category === 'symptom-frequency-monitor-mismatch')).toBe(true);
	});

	it('queries the referrer for an inappropriate indication / monitor pairing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'rate-control-assessment';
		r.request.monitorType = 'implantable-loop-recorder';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(
			g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-RATE-CONTROL-ASSESSMENT-MISMATCH')
		).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 16 total weight missing → 10/16 ≈ 63%.
		expect(g.completenessPercent).toBe(63);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Holter monitor request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the syncope red-flag', () => {
		const r = createRoutineRequest();
		r.symptoms.syncope = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SYNCOPE-RED-FLAG-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.symptoms.syncope = true;
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r, { matchFit: 'mismatched', recommendedMonitor: '7-day monitor' });
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
