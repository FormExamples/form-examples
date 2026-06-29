import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefault } from './defaults';
import type { HearingRequest } from './types';

/** A fully-completed, routine appropriate request fixture. */
function createRoutineRequest(): HearingRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.clinicianRole = 'GP';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.requesterContact = 'sarah.owen@nhs.net';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.testType = 'pure-tone-audiometry';
	d.request.laterality = 'bilateral';
	d.request.primaryIndication = 'hearing-loss';
	d.request.clinicalQuestion = 'Quantify bilateral age-related hearing loss for hearing-aid candidacy.';
	d.request.relevantHistory = 'Gradual bilateral hearing loss over two years.';
	d.symptoms.hearingLoss = true;
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	return d;
}

/** An emergency request: sudden sensorineural hearing loss within 30 days. */
function createEmergencyRequest(): HearingRequest {
	const d = createRoutineRequest();
	d.patient.firstName = 'Anthony';
	d.patient.lastName = 'Brooks';
	d.request.primaryIndication = 'sudden-hearing-loss';
	d.request.laterality = 'left';
	d.symptoms.suddenOnset = true;
	d.symptoms.onsetWithinDays = 'within-30-days';
	d.triage.urgency = 'urgent';
	return d;
}

describe('Hearing test request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.triageTier).toBe('routine');
		expect(g.completenessPercent).toBe(100);
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-HEARING-LOSS-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-REQUESTED')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-ROUTINE')).toBe(true);
	});

	it('auto-escalates sudden SNHL within 30 days to emergency + high priority', () => {
		const g = calculateGrade(createEmergencyRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Within 24 hours (otological emergency)');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-SUDDEN-SNHL-EMERGENCY')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-EMERGENCY')).toBe(true);
		expect(g.flags.some((f) => f.category === 'sudden-sensorineural-hearing-loss-urgent')).toBe(true);
	});

	it('escalates unilateral audiovestibular symptoms to urgent', () => {
		const d = createRoutineRequest();
		d.request.laterality = 'left';
		d.symptoms.tinnitus = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.priorityBand).toBe('moderate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-UNILATERAL')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-UNILATERAL-001')).toBe(true);
	});

	it('escalates ear discharge to urgent and raises a medium flag', () => {
		const d = createRoutineRequest();
		d.symptoms.earDischarge = true;
		const g = calculateGrade(d);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-EAR-DISCHARGE')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-EAR-DISCHARGE-001')).toBe(true);
	});

	it('marks a clearly mismatched indication / test as usually-not-appropriate → query-referrer', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'hearing-loss';
		d.request.testType = 'newborn-hearing-screen';
		const g = calculateGrade(d);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.priorityBand).toBe('moderate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-HEARING-LOSS-MISMATCH')).toBe(true);
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = 'tinnitus';
		d.request.testType = 'tympanometry';
		const g = calculateGrade(d);
		expect(g.appropriatenessScore).toBe(5);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-TINNITUS-PLAUSIBLE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createEmergencyRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Hearing test request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the sudden-SNHL flag for a sudden onset', () => {
		const d = createRoutineRequest();
		d.symptoms.suddenOnset = true;
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-SUDDEN-SNHL-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const d = createEmergencyRequest();
		d.request.primaryIndication = '';
		d.request.clinicalQuestion = '';
		const flags = detectFlags(d);
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
