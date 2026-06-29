import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { StressTestRequest } from './types';

/** A fully-completed, routine appropriate request fixture (accept / routine). */
function createRoutineRequest(): StressTestRequest {
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
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		bodyMassIndex: 26.4
	};
	r.request = {
		testType: 'exercise-treadmill-ecg',
		primaryIndication: 'exercise-tolerance',
		clinicalQuestion: 'Assess exercise tolerance and ischaemic burden.',
		relevantHistory: 'Stable, on optimal medical therapy.'
	};
	r.symptoms = {
		symptomChestPain: false,
		symptomBreathlessness: false,
		symptomPalpitations: false,
		ableToExercise: true,
		restingEcgFindings: 'Sinus rhythm.'
	};
	r.safety = {
		knownCoronaryArteryDisease: true,
		recentAcuteCoronarySyndrome: false,
		aorticStenosis: 'none',
		uncontrolledHypertension: false,
		betaBlocker: true
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-20',
		setting: 'community',
		notes: ''
	};
	return r;
}

describe('Cardiac stress test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.contraindicationBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-EXERCISE-TOLERANCE-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('treats recent ACS as a contraindication that blocks and auto-escalates to emergency', () => {
		const r = createRoutineRequest();
		r.safety.recentAcuteCoronarySyndrome = true;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-RECENT-ACS')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-RECENT-ACS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'recent-acs-contraindication')).toBe(true);
	});

	it('treats severe aortic stenosis as contraindicated + urgent', () => {
		const r = createRoutineRequest();
		r.safety.aorticStenosis = 'severe';
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('contraindicated');
		expect(g.triageTier).toBe('urgent');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-SEVERE-AORTIC-STENOSIS')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SEVERE-AORTIC-STENOSIS-001')).toBe(true);
	});

	it('redirects an exercise test requested for a patient who cannot exercise', () => {
		const r = createRoutineRequest();
		r.symptoms.ableToExercise = false;
		const g = calculateGrade(r);
		expect(g.contraindicationBand).toBe('caution');
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-UNABLE-TO-EXERCISE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'unable-to-exercise')).toBe(true);
	});

	it('escalates chest pain with suspected angina to urgent triage', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'suspected-angina';
		r.symptoms.symptomChestPain = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-CHEST-PAIN')).toBe(true);
	});

	it('marks a clearly mismatched test type as usually-not-appropriate → query-referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'exercise-tolerance';
		r.request.testType = 'stress-cardiac-mri';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.contraindicationBand).toBe('ok');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-EXERCISE-TOLERANCE-MISMATCH')).toBe(
			true
		);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 14 total weight missing → 8/14 ≈ 57%.
		expect(g.completenessPercent).toBe(57);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createRoutineRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Cardiac stress test request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the uncontrolled-hypertension flag', () => {
		const r = createRoutineRequest();
		r.safety.uncontrolledHypertension = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-UNCONTROLLED-HYPERTENSION-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createRoutineRequest();
		r.safety.recentAcuteCoronarySyndrome = true;
		r.safety.uncontrolledHypertension = true;
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
