import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { scoreAppropriateness, scoreBleedingRisk, scoreCompleteness, scoreTriage } from './rules';
import { createDefaultRequest } from './defaults';
import type { BiopsyRequestData } from './types';

/** A complete, low-risk, appropriate, routine request. */
function completeRoutine(): BiopsyRequestData {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1979-02-11';
	d.patient.nhsNumber = '401 234 5678';
	d.procedure.biopsySite = 'skin';
	d.procedure.biopsyMethod = 'punch';
	d.indication.primaryIndication = 'characterise-lesion';
	d.indication.clinicalQuestion = 'Characterise a pigmented skin lesion.';
	d.lesion.lesionDescription = '8 mm pigmented lesion on the forearm.';
	d.triage.urgency = 'routine';
	return d;
}

describe('Biopsy four-axis grader', () => {
	it('grades a complete, appropriate, low-risk routine request as accept', () => {
		const result = calculateGrade(completeRoutine());
		expect(result.appropriatenessBand).toBe('usually-appropriate');
		expect(result.appropriatenessScore).toBe(8);
		expect(result.bleedingRiskBand).toBe('low');
		expect(result.completenessPercent).toBe(100);
		expect(result.triageTier).toBe('routine');
		expect(result.twoWeekWaitEligible).toBe(false);
		expect(result.recommendation).toBe('accept');
	});

	it('escalates a suspected-malignancy indication to two-week-wait', () => {
		const d = completeRoutine();
		d.procedure.biopsySite = 'breast';
		d.procedure.biopsyMethod = 'core-needle';
		d.indication.primaryIndication = 'suspected-malignancy';
		const result = calculateGrade(d);
		expect(result.twoWeekWaitEligible).toBe(true);
		expect(result.triageTier).toBe('two-week-wait');
		expect(result.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('rates anticoagulant use as high bleeding risk and queries the referrer', () => {
		const d = completeRoutine();
		d.bleeding.takingAnticoagulant = true;
		d.bleeding.anticoagulantAgent = 'apixaban';
		const result = calculateGrade(d);
		expect(result.bleedingRiskBand).toBe('high');
		expect(result.recommendation).toBe('query-referrer');
		expect(result.flags.some((f) => f.category === 'high-bleeding-risk-anticoag')).toBe(true);
		expect(result.anticoagulantAction).toContain('High bleeding risk');
	});

	it('flags severe thrombocytopenia and a raised INR as coagulopathy', () => {
		const d = completeRoutine();
		d.bleeding.plateletCount = 30;
		d.bleeding.inr = 1.8;
		const result = calculateGrade(d);
		expect(result.bleedingRiskBand).toBe('high');
		expect(result.flags.some((f) => f.category === 'thrombocytopenia')).toBe(true);
		expect(result.flags.some((f) => f.category === 'coagulopathy')).toBe(true);
	});

	it('marks a clearly mismatched indication/site as usually-not-appropriate', () => {
		const d = completeRoutine();
		d.indication.primaryIndication = 'lymphadenopathy';
		d.procedure.biopsySite = 'skin';
		const result = calculateGrade(d);
		expect(result.appropriatenessBand).toBe('usually-not-appropriate');
		expect(result.recommendation).toBe('query-referrer');
	});

	it('scores an empty request as incomplete with missing-data flags', () => {
		const result = calculateGrade(createDefaultRequest());
		expect(result.completenessPercent).toBeLessThan(50);
		expect(result.recommendation).toBe('query-referrer');
		expect(result.flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(result.flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('produces stable, unique fired-rule ids', () => {
		const result = calculateGrade(completeRoutine());
		const ids = result.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('always sets a timestamp', () => {
		const result = calculateGrade(completeRoutine());
		expect(typeof result.timestamp).toBe('string');
		expect(result.timestamp.length).toBeGreaterThan(0);
	});
});

describe('Axis sub-scorers', () => {
	it('returns a provisional band when indication or site is unset', () => {
		expect(scoreAppropriateness('', '').band).toBe('may-be-appropriate');
		expect(scoreAppropriateness('suspected-malignancy', '').firedRule?.ruleId).toBe(
			'R-APPROP-UNSPECIFIED'
		);
	});

	it('treats antiplatelet use as moderate bleeding risk', () => {
		const d = createDefaultRequest();
		d.bleeding.takingAntiplatelet = true;
		expect(scoreBleedingRisk(d).band).toBe('moderate');
	});

	it('weights indication and clinical question most heavily in completeness', () => {
		const d = createDefaultRequest();
		d.indication.primaryIndication = 'suspected-malignancy';
		d.indication.clinicalQuestion = 'Confirm or exclude malignancy.';
		expect(scoreCompleteness(d).percent).toBeGreaterThanOrEqual(33);
	});

	it('keeps emergency triage above two-week-wait', () => {
		const d = createDefaultRequest();
		d.indication.primaryIndication = 'suspected-malignancy';
		d.triage.urgency = 'emergency';
		const t = scoreTriage(d);
		expect(t.tier).toBe('emergency');
		expect(t.twoWeekWaitEligible).toBe(true);
	});
});

describe('Safety flags', () => {
	it('returns immunosuppression as a medium-priority flag', () => {
		const d = createDefaultRequest();
		d.indication.primaryIndication = 'characterise-lesion';
		d.indication.clinicalQuestion = 'Characterise a lesion.';
		d.bleeding.immunosuppressed = true;
		const flags = detectFlags(d);
		const flag = flags.find((f) => f.category === 'immunosuppression');
		expect(flag?.priority).toBe('medium');
	});
});
