// Boundary tests for the Hernia Diagnostic Evaluation scoring engine.
//
// The urgency-band boundaries (pain score > 4, EHS size grade 3, any positive
// red flag, reducibility transitions) are exactly the places a
// diagnostic-classification tool goes wrong, so each boundary is asserted on
// both sides. The same cases run against the HTML front-end's JavaScript
// engine, so the two implementations cannot silently diverge.

import { describe, expect, it } from 'vitest';
import { createDefaultAssessment } from './defaults';
import { calculateHerniaEvaluation } from './grader';
import type { HerniaDiagnosticEvaluation } from './types';

function blank(): HerniaDiagnosticEvaluation {
	return createDefaultAssessment();
}

describe('empty evaluation', () => {
	it('scores routine and raises nothing', () => {
		const r = calculateHerniaEvaluation(blank());
		expect(r.computedUrgency).toBe('routine');
		expect(r.finalUrgency).toBe('routine');
		expect(r.anyRedFlag).toBe(false);
		expect(r.recommendation).toBe('watchful-waiting');
		expect(r.flags).toHaveLength(0);
	});
});

describe('red-flag screen forces emergency', () => {
	it('any single red flag forces emergency regardless of reducibility', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		a.redFlags.redFlagFever = 'yes';
		const r = calculateHerniaEvaluation(a);
		expect(r.computedUrgency).toBe('emergency');
		expect(r.recommendation).toBe('emergency-referral');
	});

	it.each([
		'redFlagSeverePain',
		'redFlagVomiting',
		'redFlagFever',
		'redFlagAbsoluteConstipation',
		'redFlagErythemaOrDiscolouration',
		'redFlagPreviouslyReducibleNowIrreducible',
		'redFlagTachycardia'
	] as const)('%s alone forces emergency', (flagKey) => {
		const a = blank();
		(a.redFlags as unknown as Record<string, string>)[flagKey] = 'yes';
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe('emergency');
	});

	it('emergency cannot be diluted by an otherwise routine picture', () => {
		const a = blank();
		a.history.painScore0To10 = 0;
		a.classification.ehsSizeGrade = '1';
		a.reducibility.reducibilityStatus = 'reducible';
		a.redFlags.redFlagTachycardia = 'yes';
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe('emergency');
	});

	it.each([
		['redFlagSeverePain', 'R-RED-FLAG-SEVERE-PAIN'],
		['redFlagVomiting', 'R-RED-FLAG-VOMITING'],
		['redFlagFever', 'R-RED-FLAG-FEVER'],
		['redFlagAbsoluteConstipation', 'R-RED-FLAG-ABSOLUTE-CONSTIPATION'],
		['redFlagErythemaOrDiscolouration', 'R-RED-FLAG-ERYTHEMA-OR-DISCOLOURATION'],
		['redFlagPreviouslyReducibleNowIrreducible', 'R-RED-FLAG-PREVIOUSLY-REDUCIBLE-NOW-IRREDUCIBLE'],
		['redFlagTachycardia', 'R-RED-FLAG-TACHYCARDIA']
	] as const)('%s fires rule id %s, not a doubled RED-FLAG-RED-FLAG- id', (flagKey, expectedRuleId) => {
		const a = blank();
		(a.redFlags as unknown as Record<string, string>)[flagKey] = 'yes';
		const ruleIds = calculateHerniaEvaluation(a).firedRules.map((r) => r.ruleId);
		expect(ruleIds).toContain(expectedRuleId);
		expect(ruleIds.some((id) => id.includes('RED-FLAG-RED-FLAG'))).toBe(false);
	});
});

describe('reducibility drives urgency when no red flag fires', () => {
	it('irreducible with no red flags scores urgent', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'irreducible';
		const r = calculateHerniaEvaluation(a);
		expect(r.computedUrgency).toBe('urgent');
		expect(r.recommendation).toBe('urgent-referral');
	});

	it('incarcerated with no red flags scores urgent, not emergency', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'incarcerated';
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe('urgent');
	});

	it('incarcerated with a red flag escalates to emergency', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'incarcerated';
		a.redFlags.redFlagVomiting = 'yes';
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe('emergency');
	});

	it('reducible with no red flags does not score urgent', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		expect(calculateHerniaEvaluation(a).computedUrgency).not.toBe('urgent');
	});
});

describe('soon band — symptomatic reducible hernia or EHS grade 3', () => {
	it.each([
		[4, 'routine'], // inclusive: pain score of exactly 4 does not escalate
		[5, 'soon'] // > 4 escalates
	])('pain score %s -> %s', (pain, expected) => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		a.history.painScore0To10 = pain;
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe(expected);
	});

	it.each([
		['1', 'routine'],
		['2', 'routine'],
		['3', 'soon']
	] as const)('EHS size grade %s -> %s', (grade, expected) => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		a.classification.ehsSizeGrade = grade;
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe(expected);
	});

	it('EHS grade 3 alone escalates even with zero pain', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		a.history.painScore0To10 = 0;
		a.classification.ehsSizeGrade = '3';
		expect(calculateHerniaEvaluation(a).computedUrgency).toBe('soon');
	});
});

describe('classification', () => {
	it('builds a human-readable EHS classification string for inguinal hernias', () => {
		const a = blank();
		a.classification.herniaType = 'inguinal';
		a.classification.inguinalSubtype = 'indirect';
		a.classification.laterality = 'right';
		a.classification.ehsSizeGrade = '2';
		const r = calculateHerniaEvaluation(a);
		expect(r.herniaType).toBe('inguinal');
		expect(r.herniaSubtype).toBe('indirect');
		expect(r.ehsClassification).toContain('Inguinal');
		expect(r.ehsClassification).toContain('Indirect');
		expect(r.ehsClassification).toContain('Right');
	});

	it('reports not-applicable subtype for non-inguinal hernias', () => {
		const a = blank();
		a.classification.herniaType = 'umbilical';
		expect(calculateHerniaEvaluation(a).herniaSubtype).toBe('not-applicable');
	});
});

describe('clinician override', () => {
	it('overrides the final urgency and records the reason without changing the computed value', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'reducible';
		a.summary.overrideUrgency = 'urgent';
		a.summary.overrideReason = 'Clinical concern despite reassuring examination.';
		const r = calculateHerniaEvaluation(a);
		expect(r.computedUrgency).toBe('routine');
		expect(r.finalUrgency).toBe('urgent');
		expect(r.overrideReason).toBe('Clinical concern despite reassuring examination.');
	});

	it('does not record an override reason when the final value matches the computed value', () => {
		const a = blank();
		a.summary.overrideUrgency = 'routine';
		a.summary.overrideReason = 'should be ignored';
		expect(calculateHerniaEvaluation(a).overrideReason).toBe('');
	});

	it('never suppresses safety flags even when the urgency band is overridden downward', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'irreducible';
		a.summary.overrideUrgency = 'routine';
		a.summary.overrideReason = 'Clinician judgement.';
		const r = calculateHerniaEvaluation(a);
		expect(r.finalUrgency).toBe('routine');
		expect(r.flags.some((f) => f.category === 'incarceration-risk')).toBe(true);
	});
});

describe('safety flags', () => {
	it('strangulation-suspected fires for irreducible plus a red flag', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'irreducible';
		a.redFlags.redFlagFever = 'yes';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'strangulation-suspected')).toBe(true);
		expect(r.flags.some((f) => f.category === 'incarceration-risk')).toBe(false);
	});

	it('incarceration-risk fires for irreducible with no red flags', () => {
		const a = blank();
		a.reducibility.reducibilityStatus = 'irreducible';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'incarceration-risk')).toBe(true);
	});

	it('emergency-surgical-referral fires whenever any red flag is positive', () => {
		const a = blank();
		a.redFlags.redFlagSeverePain = 'yes';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'emergency-surgical-referral')).toBe(true);
	});

	it('recurrent-hernia fires when a prior repair site is recorded', () => {
		const a = blank();
		a.history.priorHerniaRepair = 'yes';
		a.history.priorHerniaRepairSite = 'Right inguinal, 2019, mesh';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'recurrent-hernia')).toBe(true);
	});

	it('does not fire recurrent-hernia when no repair site is recorded', () => {
		const a = blank();
		a.history.priorHerniaRepair = 'yes';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'recurrent-hernia')).toBe(false);
	});

	it('occult-hernia-suspected fires for a suggestive history with a negative exam and no imaging yet', () => {
		const a = blank();
		a.history.painScore0To10 = 6;
		a.palpation.palpableMass = 'no';
		a.palpation.coughImpulsePositive = 'no';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'occult-hernia-suspected')).toBe(true);
	});

	it('occult-hernia-suspected does NOT fire for a confirmed palpable mass that is simply irreducible', () => {
		// An irreducible or incarcerated hernia has no elicitable cough
		// impulse by definition (it does not currently reduce), even though
		// the mass itself is definitely palpable and the diagnosis is
		// already confirmed. That must not be misread as an inconclusive
		// exam suggesting an occult (not-yet-found) hernia.
		const a = blank();
		a.history.painScore0To10 = 6;
		a.palpation.palpableMass = 'yes';
		a.palpation.coughImpulsePositive = 'no';
		a.reducibility.reducibilityStatus = 'irreducible';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'occult-hernia-suspected')).toBe(false);

		const b = blank();
		b.history.painScore0To10 = 6;
		b.palpation.palpableMass = 'yes';
		b.palpation.coughImpulsePositive = 'no';
		b.reducibility.reducibilityStatus = 'incarcerated';
		expect(calculateHerniaEvaluation(b).flags.some((f) => f.category === 'occult-hernia-suspected')).toBe(false);
	});

	it('occult-hernia-suspected still fires for the same negative exam when reducibility is not irreducible/incarcerated', () => {
		const a = blank();
		a.history.painScore0To10 = 6;
		a.palpation.palpableMass = 'no';
		a.palpation.coughImpulsePositive = 'no';
		a.reducibility.reducibilityStatus = 'reducible';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'occult-hernia-suspected')).toBe(true);
	});

	it('atypical-presentation fires when imaging remains inconclusive', () => {
		const a = blank();
		a.palpation.palpableMass = 'no';
		a.imaging.ultrasoundPerformed = 'yes';
		a.imaging.ultrasoundFindings = 'inconclusive';
		const r = calculateHerniaEvaluation(a);
		expect(r.flags.some((f) => f.category === 'atypical-presentation')).toBe(true);
		expect(r.flags.some((f) => f.category === 'occult-hernia-suspected')).toBe(false);
	});

	it('paediatric fires below 16 years and not at or above it', () => {
		const a = blank();
		a.clinician.assessmentDate = '2026-01-01';
		a.patient.birthDate = '2011-06-01'; // 14 years old
		expect(calculateHerniaEvaluation(a).flags.some((f) => f.category === 'paediatric')).toBe(true);

		const b = blank();
		b.clinician.assessmentDate = '2026-01-01';
		b.patient.birthDate = '2010-01-01'; // exactly 16
		expect(calculateHerniaEvaluation(b).flags.some((f) => f.category === 'paediatric')).toBe(false);
	});

	it('pregnancy fires when recorded', () => {
		const a = blank();
		a.riskFactors.riskPregnancy = 'yes';
		expect(calculateHerniaEvaluation(a).flags.some((f) => f.category === 'pregnancy')).toBe(true);
	});

	it('sorts flags with high priority first', () => {
		const a = blank();
		a.riskFactors.riskPregnancy = 'yes'; // medium
		a.reducibility.reducibilityStatus = 'irreducible'; // high (incarceration-risk)
		const r = calculateHerniaEvaluation(a);
		expect(r.flags[0].priority).toBe('high');
	});
});
