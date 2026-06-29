import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { SleepStudyRequest } from './types';

/** A fully-completed, routine appropriate suspected-OSA request fixture. */
function createRoutineRequest(): SleepStudyRequest {
	return {
		...createDefaultRequest(),
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'respiratory-physician',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net',
			supervisingConsultant: '',
			siteName: 'Headington Sleep Clinic',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			bodyMassIndex: 31.2,
			interpreterRequired: false
		},
		request: {
			studyType: 'home-sleep-apnoea-test',
			primaryIndication: 'suspected-osa',
			clinicalQuestion: 'Confirm or exclude obstructive sleep apnoea.',
			relevantHistory: 'Snoring and witnessed pauses reported by partner.'
		},
		scores: {
			epworthScore: 8,
			stopBangScore: 4,
			neckCircumferenceCm: 41
		},
		symptoms: {
			witnessedApnoeas: true,
			occupationalDriver: false,
			cardiovascularDisease: false
		},
		triage: {
			urgency: 'routine',
			requestedByDate: '',
			setting: 'outpatient',
			notes: ''
		}
	};
}

/** A vocational driver with severe sleepiness — auto-escalates priority + triage. */
function createDriverRequest(): SleepStudyRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.request.studyType = 'polysomnography';
	r.scores.epworthScore = 18;
	r.scores.stopBangScore = 6;
	r.symptoms.occupationalDriver = true;
	r.triage.urgency = 'routine';
	return r;
}

/** A suspected-narcolepsy MSLT request. */
function createNarcolepsyRequest(): SleepStudyRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.request.studyType = 'multiple-sleep-latency-test';
	r.request.primaryIndication = 'suspected-narcolepsy';
	r.scores.epworthScore = 14;
	return r;
}

describe('Sleep study four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.priorityBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-OSA-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates a vocational driver with severe sleepiness to high priority + urgent', () => {
		const g = calculateGrade(createDriverRequest());
		expect(g.priorityBand).toBe('high');
		expect(g.triageTier).toBe('urgent');
		expect(g.appropriatenessScore).toBe(9);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-OSA-EVIDENCE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-DRIVER-SLEEPINESS')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SEVERE-SLEEPINESS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'occupational-driver-osa')).toBe(true);
		expect(g.flags.some((f) => f.category === 'severe-daytime-sleepiness')).toBe(true);
	});

	it('flags suspected narcolepsy and grades moderate priority / routine triage', () => {
		const g = calculateGrade(createNarcolepsyRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.priorityBand).toBe('moderate');
		expect(g.triageTier).toBe('routine');
		expect(g.flags.some((f) => f.flagId === 'F-SUSPECTED-NARCOLEPSY-001')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-MODERATE-SLEEPINESS')).toBe(true);
	});

	it('marks a mismatched study type as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'insomnia';
		r.request.studyType = 'home-sleep-apnoea-test';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-INSOMNIA-MISMATCH')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.clinicalQuestion = '';
		r.scores.epworthScore = null;
		const g = calculateGrade(r);
		// clinical question (3) + Epworth (3) of 19 total weight missing → 13/19 ≈ 68%.
		expect(g.completenessPercent).toBe(68);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-EPWORTH')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createDriverRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Sleep study flag detection', () => {
	it('flags missing Epworth, indication, and clinical question on a blank request', () => {
		const flags = detectFlags(createDefaultRequest());
		expect(flags.some((f) => f.category === 'missing-epworth')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createDriverRequest();
		r.request.clinicalQuestion = '';
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
