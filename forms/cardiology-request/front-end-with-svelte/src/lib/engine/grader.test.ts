import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CardiologyRequest } from './types';

/** A fully-completed, routine appropriate referral fixture. */
function createRoutineReferral(): CardiologyRequest {
	return {
		referringClinician: 'Dr Sarah Owen',
		referrerRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		supervisingConsultant: '',
		requesterContact: 'sarah.owen@nhs.net',
		referralDate: '2026-06-10',
		nhsNumber: '485 777 3456',
		patientName: 'Margaret Hughes',
		dateOfBirth: '1958-03-14',
		status: 'submitted',
		siteName: 'Headington Medical Practice',
		setting: 'community',
		requestedByDate: '',
		requestedService: 'rapid-access-chest-pain',
		referralReason: 'chest-pain',
		clinicalQuestion: 'Is this stable angina? Please risk-stratify.',
		relevantHistory: 'Intermittent exertional chest tightness over 3 months.',
		symptomChestPain: true,
		chestPainCharacter: 'atypical',
		symptomBreathlessness: false,
		nyhaClass: '',
		symptomPalpitations: false,
		symptomSyncope: false,
		symptomOedema: false,
		suspectedAcs: false,
		exertionalSyncope: false,
		newOnsetHeartFailure: false,
		ecgDone: true,
		ecgFindings: 'Sinus rhythm, no acute ST changes.',
		troponinStatus: 'normal',
		bnpStatus: '',
		knownCoronaryArteryDisease: false,
		previousMi: false,
		heartFailure: false,
		valveDisease: false,
		arrhythmia: false,
		hypertension: true,
		diabetes: false,
		currentMedications: 'Amlodipine 5 mg OD.',
		urgency: 'routine',
		notes: ''
	};
}

/** An urgent referral: new-onset heart failure with elevated BNP, NYHA III. */
function createHeartFailureReferral(): CardiologyRequest {
	return {
		...createRoutineReferral(),
		patientName: 'Derek Mensah',
		requestedService: 'heart-failure',
		referralReason: 'heart-failure-symptoms',
		clinicalQuestion: 'New breathlessness with raised BNP — assess for heart failure.',
		symptomChestPain: false,
		chestPainCharacter: '',
		symptomBreathlessness: true,
		nyhaClass: 'iii',
		symptomOedema: true,
		newOnsetHeartFailure: true,
		troponinStatus: 'normal',
		bnpStatus: 'elevated',
		urgency: 'urgent'
	};
}

/** An emergency referral: suspected ACS with elevated troponin. */
function createAcsReferral(): CardiologyRequest {
	return {
		...createRoutineReferral(),
		patientName: 'Anthony Brooks',
		requestedService: 'general-cardiology',
		referralReason: 'chest-pain',
		clinicalQuestion: 'Central crushing chest pain with rising troponin — review urgently.',
		symptomChestPain: true,
		chestPainCharacter: 'typical-angina',
		suspectedAcs: true,
		troponinStatus: 'elevated',
		knownCoronaryArteryDisease: true,
		previousMi: true,
		urgency: 'emergency'
	};
}

describe('Cardiology request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine referral as accept / routine', () => {
		const g = calculateGrade(createRoutineReferral());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.safetyBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-MATCH-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-ROUTINE-01')).toBe(true);
	});

	it('auto-escalates suspected ACS to red-flag + emergency regardless of other axes', () => {
		const g = calculateGrade(createAcsReferral());
		expect(g.safetyBand).toBe('red-flag');
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('immediate (emergency pathway)');
		// Emergency referrals are accepted onto the acute pathway.
		expect(g.recommendation).toBe('accept');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-EMERGENCY-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-ACS-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-acs')).toBe(true);
	});

	it('escalates new-onset heart failure to red-flag + urgent', () => {
		const g = calculateGrade(createHeartFailureReferral());
		expect(g.safetyBand).toBe('red-flag');
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-NEW-HF-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-URGENT-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'new-onset-heart-failure')).toBe(true);
	});

	it('treats typical-angina chest pain as a red flag escalating to urgent', () => {
		const r = createRoutineReferral();
		r.chestPainCharacter = 'typical-angina';
		const g = calculateGrade(r);
		expect(g.safetyBand).toBe('red-flag');
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-TYPICAL-ANGINA-01')).toBe(true);
	});

	it('marks uncomplicated hypertension to cardiology as usually-not-appropriate → reject', () => {
		const r = createRoutineReferral();
		r.requestedService = 'general-cardiology';
		r.referralReason = 'hypertension';
		r.symptomChestPain = false;
		r.chestPainCharacter = '';
		r.symptomBreathlessness = false;
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.safetyBand).toBe('ok');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-LOW-YIELD-01')).toBe(true);
	});

	it('flags a service mismatch as may-be-appropriate', () => {
		const r = createRoutineReferral();
		r.requestedService = 'valve-clinic';
		r.referralReason = 'chest-pain';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SERVICE-MISMATCH-01')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineReferral();
		r.referralReason = '';
		r.clinicalQuestion = '';
		const g = calculateGrade(r);
		// referral reason (3) + clinical question (3) of 14 total weight missing → 8/14 ≈ 57%.
		expect(g.completenessPercent).toBe(57);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-REASON-01')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-QUESTION-01')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createAcsReferral());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Cardiology request flag detection', () => {
	it('flags missing reason and missing clinical question', () => {
		const r = createRoutineReferral();
		r.referralReason = '';
		r.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-reason')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the exertional-syncope flag', () => {
		const r = createRoutineReferral();
		r.exertionalSyncope = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-EXERTIONAL-SYNCOPE-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createAcsReferral();
		r.clinicalQuestion = '';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate referral', () => {
		const flags = detectFlags(createRoutineReferral());
		expect(flags).toHaveLength(0);
	});
});
