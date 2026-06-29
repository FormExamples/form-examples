import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import type { RequestData } from './types';

/** A well-formed, low-risk request: food allergy, skin-prick, food panel. */
function completeAppropriateRequest(): RequestData {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr A. Patel';
	d.clinician.referralDate = '2026-06-01';
	d.patient.firstName = 'Jo';
	d.patient.lastName = 'Bloggs';
	d.patient.dateOfBirth = '1990-01-01';
	d.patient.nhsNumber = '123 456 7890';
	d.test.testType = 'skin-prick-test';
	d.test.allergenFood = true;
	d.indication.primaryIndication = 'suspected-food-allergy';
	d.indication.clinicalQuestion = 'Confirm or exclude IgE-mediated peanut allergy.';
	d.indication.clinicalDetails = 'Lip swelling after peanut exposure.';
	d.triage.urgency = 'routine';
	return d;
}

describe('Allergy Skin Test Request — four-axis grader', () => {
	it('grades a complete, appropriate request as accept / ok / routine', () => {
		const result = calculateGrade(completeAppropriateRequest());
		expect(result.appropriatenessBand).toBe('usually-appropriate');
		expect(result.appropriatenessScore).toBe(8);
		expect(result.validitySafetyBand).toBe('ok');
		expect(result.completenessPercent).toBe(100);
		expect(result.triageTier).toBe('routine');
		expect(result.recommendation).toBe('accept');
		expect(result.flags).toHaveLength(0);
	});

	it('marks antihistamines as contraindicated for a skin test and redirects', () => {
		const d = completeAppropriateRequest();
		d.safety.onAntihistamines = true;
		const result = calculateGrade(d);
		expect(result.validitySafetyBand).toBe('contraindicated');
		expect(result.recommendation).toBe('redirect');
		expect(result.flags.some((f) => f.flagId === 'F-ANTIHISTAMINES-INVALIDATE-001')).toBe(true);
	});

	it('keeps antihistamines on a blood test as a caution only', () => {
		const d = completeAppropriateRequest();
		d.test.testType = 'specific-ige-blood';
		d.safety.onAntihistamines = true;
		const result = calculateGrade(d);
		expect(result.validitySafetyBand).toBe('caution');
		expect(result.recommendation).toBe('accept');
	});

	it('escalates triage to urgent for an anaphylaxis investigation', () => {
		const d = completeAppropriateRequest();
		d.indication.primaryIndication = 'anaphylaxis-investigation';
		d.safety.previousAnaphylaxis = true;
		const result = calculateGrade(d);
		expect(result.triageTier).toBe('urgent');
		expect(result.flags.some((f) => f.flagId === 'F-PREVIOUS-ANAPHYLAXIS-001')).toBe(true);
	});

	it('queries the referrer for a mismatched indication / test type', () => {
		const d = completeAppropriateRequest();
		d.indication.primaryIndication = 'contact-dermatitis';
		d.test.testType = 'specific-ige-blood';
		const result = calculateGrade(d);
		expect(result.appropriatenessBand).toBe('usually-not-appropriate');
		expect(result.recommendation).toBe('query-referrer');
	});

	it('drops appropriateness and flags when no allergen panel is selected', () => {
		const d = completeAppropriateRequest();
		d.test.allergenFood = false;
		const result = calculateGrade(d);
		expect(result.appropriatenessBand).toBe('usually-not-appropriate');
		expect(result.flags.some((f) => f.flagId === 'F-NO-ALLERGEN-SELECTED-001')).toBe(true);
	});

	it('produces unique fired-rule ids', () => {
		const result = calculateGrade(completeAppropriateRequest());
		const ids = result.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Allergy Skin Test Request — safety flags', () => {
	it('returns no flags for a complete, safe request', () => {
		expect(detectFlags(completeAppropriateRequest())).toHaveLength(0);
	});

	it('flags a beta-blocker with anaphylaxis history as high priority', () => {
		const d = completeAppropriateRequest();
		d.safety.onBetaBlocker = true;
		d.safety.previousAnaphylaxis = true;
		const flags = detectFlags(d);
		const bb = flags.find((f) => f.flagId === 'F-BETA-BLOCKER-CAUTION-001');
		expect(bb?.priority).toBe('high');
	});
});
