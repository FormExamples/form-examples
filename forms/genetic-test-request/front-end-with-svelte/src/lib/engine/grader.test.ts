import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { GeneticTestRequest } from './types';

/** A fully-completed, routine, appropriate request fixture with consent. */
function createCompleteRequest(): GeneticTestRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'Clinical geneticist';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'sarah.owen@nhs.net';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.request.testType = 'gene-panel';
	r.request.primaryIndication = 'familial-cancer';
	r.request.clinicalQuestion = 'BRCA panel for a strong familial breast/ovarian cancer history.';
	r.clinical.clinicalDetails = 'Two first-degree relatives with breast cancer under 50.';
	r.clinical.familyHistory = 'Mother and maternal aunt with breast cancer; maternal grandmother ovarian cancer.';
	r.consent.consentObtained = true;
	r.consent.geneticCounsellingOffered = true;
	r.triage.specimenType = 'blood';
	r.triage.urgency = 'routine';
	return r;
}

/** A predictive / presymptomatic request without consent or counselling. */
function createPredictiveRequest(): GeneticTestRequest {
	const r = createCompleteRequest();
	r.patient.firstName = 'Derek';
	r.patient.lastName = 'Mensah';
	r.request.testType = 'predictive-presymptomatic';
	r.request.primaryIndication = 'predictive-family-history';
	r.request.clinicalQuestion = 'Predictive test for a known familial BRCA1 pathogenic variant.';
	r.consent.consentObtained = false;
	r.consent.geneticCounsellingOffered = false;
	return r;
}

/** A prenatal, time-critical request. */
function createPrenatalRequest(): GeneticTestRequest {
	const r = createCompleteRequest();
	r.patient.firstName = 'Aisha';
	r.patient.lastName = 'Khan';
	r.request.testType = 'prenatal';
	r.request.primaryIndication = 'prenatal-diagnosis';
	r.request.clinicalQuestion = 'Prenatal diagnosis following abnormal ultrasound findings.';
	r.triage.specimenType = 'prenatal';
	r.triage.urgency = 'routine';
	return r;
}

describe('Genetic test request four-axis vetting engine', () => {
	it('grades a complete, eligible, consented routine request as accept / routine', () => {
		const g = calculateGrade(createCompleteRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.consentCounsellingBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-FAMILIAL-CANCER-ELIGIBLE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CONSENT-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('rejects predictive testing without consent and counselling (mandatory-blocking)', () => {
		const g = calculateGrade(createPredictiveRequest());
		expect(g.consentCounsellingBand).toBe('not-met');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CONSENT-PREDICTIVE-NOT-MET')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREDICTIVE-COUNSELLING-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREDICTIVE-CONSENT-001')).toBe(true);
	});

	it('auto-escalates a prenatal request to urgent and time-critical', () => {
		const g = calculateGrade(createPrenatalRequest());
		expect(g.triageTier).toBe('urgent');
		expect(g.targetTimeframe).toBe('Time-critical — prenatal window');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-PRENATAL-TIME-CRITICAL')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PRENATAL-TIME-CRITICAL-001')).toBe(true);
	});

	it('marks an indication / test-type mismatch as usually-not-appropriate → query-referrer', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'suspected-genetic-disorder';
		r.request.testType = 'karyotype';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(
			g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-GENETIC-DISORDER-MISMATCH')
		).toBe(true);
	});

	it('treats a plausible-but-suboptimal technology as may-be-appropriate', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'familial-cancer';
		r.request.testType = 'whole-exome';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(5);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-FAMILIAL-CANCER-PARTIAL')).toBe(
			true
		);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = '';
		r.clinical.clinicalDetails = '';
		const g = calculateGrade(r);
		// indication (3) + clinical details (3) of 20 total weight missing → 14/20 = 70%.
		expect(g.completenessPercent).toBe(70);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-DETAILS')).toBe(true);
	});

	it('flags missing consent on a non-predictive request as caution → query-referrer', () => {
		const r = createCompleteRequest();
		r.consent.consentObtained = false;
		const g = calculateGrade(r);
		expect(g.consentCounsellingBand).toBe('caution');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CONSENT-NOT-OBTAINED')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createPredictiveRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Genetic test request flag detection', () => {
	it('flags missing indication, clinical details, and family history', () => {
		const r = createDefaultRequest();
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-details')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-family-history')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createDefaultRequest();
		r.request.testType = 'predictive-presymptomatic';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete, consented, non-predictive request', () => {
		const flags = detectFlags(createCompleteRequest());
		expect(flags).toHaveLength(0);
	});
});
