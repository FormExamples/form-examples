import { describe, it, expect } from 'vitest';
import { calculateGrade, deriveRecommendation } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from './defaults';
import type { CrossMatchRequest } from './types';

/** A well-formed, low-acuity, fully safe group-and-save for elective surgery. */
function safeGroupAndSave(): CrossMatchRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr A Singh';
	d.clinician.referralDate = '2026-06-20';
	d.patient.firstName = 'Jane';
	d.patient.lastName = 'Doe';
	d.patient.dateOfBirth = '1980-02-02';
	d.patient.nhsNumber = '943 476 5919';
	d.patient.positivePatientIdConfirmed = true;
	d.request.requestType = 'group-and-save';
	d.request.component = 'none';
	d.indication.primaryIndication = 'surgery';
	d.indication.clinicalDetails = 'Elective cholecystectomy, low expected blood loss.';
	d.history.patientBloodGroup = 'o-pos';
	d.sample.sampleCollected = 'yes';
	d.sample.twoSampleRuleMet = true;
	d.sample.labellingCheckComplete = true;
	d.triage.urgency = 'routine';
	return d;
}

describe('Blood cross-match four-axis grader', () => {
	it('grades a complete safe group-and-save as accept / routine', () => {
		const result = calculateGrade(safeGroupAndSave());
		expect(result.appropriatenessBand).toBe('usually-appropriate');
		expect(result.identitySafetyBand).toBe('ok');
		expect(result.triageTier).toBe('routine');
		expect(result.recommendation).toBe('accept');
		expect(result.completenessPercent).toBe(100);
		expect(result.flags).toHaveLength(0);
	});

	it('flags and rejects when the two-sample rule is not met', () => {
		const d = safeGroupAndSave();
		d.request.requestType = 'crossmatch';
		d.request.component = 'red-cells';
		d.sample.twoSampleRuleMet = false;
		const result = calculateGrade(d);
		expect(result.identitySafetyBand).toBe('reject-risk');
		expect(result.recommendation).toBe('reject');
		expect(result.firedRules.some((r) => r.ruleId === 'R-IDENTITY-TWO-SAMPLE-NOT-MET')).toBe(true);
		expect(result.flags.some((f) => f.category === 'two-sample-rule-not-met')).toBe(true);
	});

	it('auto-escalates to stat for declared massive haemorrhage', () => {
		const d = safeGroupAndSave();
		d.triage.urgency = 'routine';
		d.triage.massiveHaemorrhage = true;
		const result = calculateGrade(d);
		expect(result.triageTier).toBe('stat');
		expect(result.firedRules.some((r) => r.ruleId === 'R-TRIAGE-MASSIVE-HAEMORRHAGE')).toBe(true);
		expect(result.flags.some((f) => f.category === 'massive-haemorrhage-stat')).toBe(true);
	});

	it('treats emergency O-negative as stat with identity bypass', () => {
		const d = safeGroupAndSave();
		d.request.requestType = 'emergency-o-negative';
		d.request.component = 'red-cells';
		d.indication.primaryIndication = 'acute-bleeding';
		const result = calculateGrade(d);
		expect(result.triageTier).toBe('stat');
		expect(result.identitySafetyBand).toBe('ok');
		expect(result.firedRules.some((r) => r.ruleId === 'R-IDENTITY-EMERGENCY-BYPASS')).toBe(true);
	});

	it('marks red-cell anaemia above the NICE NG24 threshold as not appropriate', () => {
		const d = safeGroupAndSave();
		d.request.requestType = 'crossmatch';
		d.request.component = 'red-cells';
		d.indication.primaryIndication = 'anaemia';
		d.indication.currentHaemoglobin = 110;
		const result = calculateGrade(d);
		expect(result.appropriatenessBand).toBe('usually-not-appropriate');
		expect(result.firedRules.some((r) => r.ruleId === 'R-APPROP-NG24-ABOVE-THRESHOLD')).toBe(true);
		expect(result.recommendation).toBe('query-referrer');
	});

	it('drops completeness and recommends query when key fields are missing', () => {
		const result = calculateGrade(createDefaultRequest());
		expect(result.completenessPercent).toBeLessThan(50);
		expect(result.recommendation).toBe('query-referrer');
	});

	it('raises medium flags for known antibodies and previous reaction', () => {
		const d = safeGroupAndSave();
		d.history.knownAntibodies = true;
		d.history.previousTransfusionReaction = true;
		const flags = detectFlags(d);
		expect(flags.some((f) => f.category === 'known-antibodies-extra-time')).toBe(true);
		expect(flags.some((f) => f.category === 'previous-transfusion-reaction')).toBe(true);
	});

	it('derives recommendations from the axes', () => {
		expect(deriveRecommendation('usually-appropriate', 'reject-risk', 100)).toBe('reject');
		expect(deriveRecommendation('usually-not-appropriate', 'ok', 100)).toBe('query-referrer');
		expect(deriveRecommendation('usually-appropriate', 'caution', 100)).toBe('query-referrer');
		expect(deriveRecommendation('usually-appropriate', 'ok', 40)).toBe('query-referrer');
		expect(deriveRecommendation('usually-appropriate', 'ok', 100)).toBe('accept');
	});
});
