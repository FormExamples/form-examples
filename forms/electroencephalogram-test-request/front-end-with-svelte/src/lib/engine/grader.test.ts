import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { EegRequest } from './types';

/** A fully-completed, routine appropriate EEG request fixture. */
function createRoutineRequest(): EegRequest {
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
		interpreterRequired: false
	};
	r.request = {
		eegType: 'routine-awake',
		primaryIndication: 'suspected-epilepsy',
		clinicalQuestion: 'Are there interictal epileptiform discharges to support focal epilepsy?',
		relevantHistory: 'Two episodes of altered awareness over six months.'
	};
	r.context = {
		seizureFrequency: 'Two in six months',
		currentAntiepileptics: 'None.',
		firstSeizure: false,
		knownEpilepsy: false
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-20',
		setting: 'outpatient',
		notes: ''
	};
	return r;
}

/** A recent first-seizure request escalated via the first-seizure pathway. */
function createFirstSeizureRequest(): EegRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.request.primaryIndication = 'first-seizure';
	r.request.clinicalQuestion = 'First unprovoked seizure — assess interictal discharges.';
	r.context.firstSeizure = true;
	r.redFlags.recentSeizure = true;
	return r;
}

/** An emergency request: suspected status epilepticus. */
function createStatusEpilepticusRequest(): EegRequest {
	const r = createRoutineRequest();
	r.patient.firstName = 'Anthony';
	r.patient.lastName = 'Brooks';
	r.request.primaryIndication = 'status-epilepticus';
	r.request.clinicalQuestion = 'Reduced consciousness after convulsions — assess for NCSE.';
	r.redFlags.suspectedStatusEpilepticus = true;
	r.triage.urgency = 'emergency';
	return r;
}

describe('EEG request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.priorityBand).toBe('low');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SUSPECTED-EPILEPSY-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected status epilepticus to emergency regardless of other axes', () => {
		const g = calculateGrade(createStatusEpilepticusRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.priorityBand).toBe('high');
		// Emergency requests are still accepted onto the acute pathway.
		expect(g.recommendation).toBe('accept');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-STATUS-EPILEPTICUS')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-STATUS-EPILEPTICUS')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-status-epilepticus')).toBe(true);
	});

	it('escalates a recent first seizure to urgent + moderate priority', () => {
		const g = calculateGrade(createFirstSeizureRequest());
		expect(g.triageTier).toBe('urgent');
		expect(g.priorityBand).toBe('moderate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-RECENT-FIRST-SEIZURE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-RECENT-FIRST-SEIZURE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'recent-first-seizure')).toBe(true);
	});

	it('escalates an encephalopathy indication to urgent', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'encephalopathy';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.priorityBand).toBe('high');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-ENCEPHALOPATHY')).toBe(true);
		expect(g.flags.some((f) => f.category === 'encephalopathy')).toBe(true);
	});

	it('marks a clearly mismatched indication × EEG type as usually-not-appropriate → query referrer', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'dementia';
		r.request.eegType = 'video-telemetry';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-DEMENTIA-MISMATCH')).toBe(true);
	});

	it('flags a plausible-but-suboptimal pairing as may-be-appropriate', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = 'suspected-epilepsy';
		r.request.eegType = 'sleep-deprived';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-EPILEPSY-PLAUSIBLE')).toBe(
			true
		);
	});

	it('queries the referrer when the clinical question implies excluding epilepsy', () => {
		const r = createRoutineRequest();
		r.request.clinicalQuestion = 'Normal EEG to reassure that this is not epilepsy.';
		const g = calculateGrade(r);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.category === 'eeg-not-to-exclude-epilepsy')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 15 total weight missing → 9/15 = 60%.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createStatusEpilepticusRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('EEG request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createRoutineRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the suspected-status-epilepticus flag', () => {
		const r = createRoutineRequest();
		r.redFlags.suspectedStatusEpilepticus = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-STATUS-EPILEPTICUS-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createStatusEpilepticusRequest();
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
