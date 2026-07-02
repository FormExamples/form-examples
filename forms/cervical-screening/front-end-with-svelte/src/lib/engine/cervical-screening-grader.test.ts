import { describe, it, expect } from 'vitest';
import { calculateGrade } from './cervical-screening-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { classificationRules } from './cervical-screening-rules';
import type { AssessmentData } from './types';

/**
 * A blank screening record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { sampleTakerName: '', sampleTakerRole: '', careSetting: '', sampleTakenAt: '' },
		identification: { patientIdentifier: '', nhsNumber: '', age: null, dateOfBirth: '' },
		eligibility: {
			recallInterval: '',
			screenDueDate: '',
			lastScreenDate: '',
			overdue: '',
			previouslyCeased: ''
		},
		consent: { consentGiven: '' },
		symptoms: { symptomatic: '', symptomDetail: '' },
		adequacy: { sampleAdequacy: '', inadequateReason: '' },
		hpv: { hpvResult: '' },
		cytology: { cytologyGrade: '' },
		note: { clinicalContext: '' }
	};
}

/** An eligible, consented adult with an adequate sample (the common preamble). */
function createEligibleAdequate(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification.age = 32;
	d.eligibility.previouslyCeased = 'no';
	d.consent.consentGiven = 'yes';
	d.adequacy.sampleAdequacy = 'adequate';
	return d;
}

describe('cervical-screening classification engine', () => {
	it('ceases when age is below the eligible range (highest gate)', () => {
		const d = createEligibleAdequate();
		d.identification.age = 22;
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('cease-not-eligible');
		expect(r.managementAction).toBe('cease-screening');
		expect(r.status).toBe('complete');
	});

	it('ceases when the person has formally ceased screening', () => {
		const d = createEligibleAdequate();
		d.eligibility.previouslyCeased = 'yes';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('cease-not-eligible');
		expect(r.managementAction).toBe('cease-screening');
	});

	it('does NOT cease when age is null (null-age guard)', () => {
		const d = createEligibleAdequate();
		d.identification.age = null;
		d.hpv.hpvResult = 'negative';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-negative');
	});

	it('classifies an inadequate sample before any HPV result (adequacy gate)', () => {
		const d = createEligibleAdequate();
		d.adequacy.sampleAdequacy = 'inadequate';
		d.hpv.hpvResult = 'positive';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('inadequate');
		expect(r.managementAction).toBe('repeat-sample-3-months');
	});

	it('classifies hrHPV negative as routine recall', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'negative';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-negative');
		expect(r.managementAction).toBe('routine-recall');
		expect(r.status).toBe('complete');
	});

	it('classifies HPV positive + normal cytology as early repeat at 12 months', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'negative';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-positive-cytology-normal');
		expect(r.managementAction).toBe('early-repeat-12-months');
	});

	it('classifies HPV positive + borderline cytology as routine colposcopy', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'borderline';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-positive-cytology-abnormal-low');
		expect(r.managementAction).toBe('colposcopy-referral');
	});

	it('classifies HPV positive + low-grade cytology as routine colposcopy', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'low-grade';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-positive-cytology-abnormal-low');
		expect(r.managementAction).toBe('colposcopy-referral');
	});

	it('classifies HPV positive + high-grade cytology as urgent colposcopy', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'high-grade';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-positive-cytology-abnormal-high');
		expect(r.managementAction).toBe('urgent-colposcopy-referral');
	});

	it('classifies HPV positive with cytology not yet graded as awaiting cytology', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'not-performed';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('hpv-positive-cytology-pending');
		expect(r.managementAction).toBe('awaiting-cytology');
		expect(r.status).toBe('incomplete');
	});

	it('falls back to pending when hrHPV is not recorded on an adequate sample', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = '';
		const r = calculateGrade(d);
		expect(r.resultClass).toBe('pending');
		expect(r.managementAction).toBe('awaiting-result');
		expect(r.status).toBe('incomplete');
	});

	it('all rule IDs are unique', () => {
		const ids = classificationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('cervical-screening flagged-issue detection', () => {
	const okGrade = { resultClass: 'hpv-negative', managementAction: 'routine-recall', status: 'complete' } as const;

	it('raises the urgent-colposcopy flag for HPV positive + high-grade', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = 'high-grade';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-URGENT-COLPOSCOPY-001')).toBe(true);
	});

	it('raises the symptomatic-refer-regardless flag', () => {
		const d = createEligibleAdequate();
		d.symptoms.symptomatic = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-SYMPTOMATIC-REFER-REGARDLESS-001')).toBe(true);
	});

	it('raises the missing-consent flag when consent is not given', () => {
		const d = createEligibleAdequate();
		d.consent.consentGiven = 'no';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-MISSING-CONSENT-001')).toBe(true);
	});

	it('raises the inadequate-sample flag', () => {
		const d = createEligibleAdequate();
		d.adequacy.sampleAdequacy = 'inadequate';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-INADEQUATE-SAMPLE-001')).toBe(true);
	});

	it('raises the cytology-outstanding flag for HPV positive with ungraded cytology', () => {
		const d = createEligibleAdequate();
		d.hpv.hpvResult = 'positive';
		d.cytology.cytologyGrade = '';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-CYTOLOGY-OUTSTANDING-001')).toBe(true);
	});

	it('raises the patient-overdue flag', () => {
		const d = createEligibleAdequate();
		d.eligibility.overdue = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-PATIENT-OVERDUE-001')).toBe(true);
	});

	it('raises the age-outside-range flag', () => {
		const d = createEligibleAdequate();
		d.identification.age = 70;
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-AGE-OUTSIDE-RANGE-001')).toBe(true);
	});

	it('raises the incomplete flag when the grade status is incomplete', () => {
		const d = createEligibleAdequate();
		const flags = detectFlaggedIssues(d, {
			resultClass: 'pending',
			managementAction: 'awaiting-result',
			status: 'incomplete'
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createEligibleAdequate();
		d.symptoms.symptomatic = 'yes'; // high
		d.eligibility.overdue = 'yes'; // medium
		const flags = detectFlaggedIssues(d, {
			resultClass: 'pending',
			managementAction: 'awaiting-result',
			status: 'incomplete'
		}); // low
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
