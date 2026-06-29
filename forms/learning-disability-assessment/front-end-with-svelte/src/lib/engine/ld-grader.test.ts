import { describe, it, expect } from 'vitest';
import { calculateLD } from './ld-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { ldRules } from './ld-rules';
import { classifyAdaptiveScore } from './utils';
import { createDefaultAssessment } from './defaults';
import type { AssessmentData, SupportLevel } from './types';

/** Set every adaptive-functioning item to the same support level. */
function withAdaptive(level: SupportLevel): AssessmentData {
	const d = createDefaultAssessment();
	for (const key of Object.keys(d.adaptiveFunctioning) as (keyof AssessmentData['adaptiveFunctioning'])[]) {
		d.adaptiveFunctioning[key] = level;
	}
	return d;
}

describe('Learning Disability adaptive-functioning grader', () => {
	it('defaults a blank assessment to mild with no answered items', () => {
		const result = calculateLD(createDefaultAssessment());
		expect(result.answeredCount).toBe(0);
		expect(result.adaptiveScore).toBe(0);
		expect(result.severityCategory).toBe('mild');
		expect(result.firedRules).toHaveLength(0);
	});

	it('classifies all-independent as mild', () => {
		const result = calculateLD(withAdaptive('independent'));
		expect(result.answeredCount).toBe(10);
		expect(result.adaptiveScore).toBe(0);
		expect(result.severityCategory).toBe('mild');
	});

	it('classifies all-some-support as moderate', () => {
		const result = calculateLD(withAdaptive('some-support'));
		expect(result.adaptiveScore).toBe(1);
		expect(result.severityCategory).toBe('moderate');
	});

	it('classifies all-significant-support as severe', () => {
		const result = calculateLD(withAdaptive('significant-support'));
		expect(result.adaptiveScore).toBe(2);
		expect(result.severityCategory).toBe('severe');
	});

	it('classifies all-full-support as profound', () => {
		const result = calculateLD(withAdaptive('full-support'));
		expect(result.adaptiveScore).toBe(3);
		expect(result.severityCategory).toBe('profound');
	});

	it('averages over answered items only', () => {
		const d = createDefaultAssessment();
		d.adaptiveFunctioning.conceptualLanguage = 'significant-support'; // 2
		d.adaptiveFunctioning.socialFriendships = 'independent'; // 0
		const result = calculateLD(d);
		expect(result.answeredCount).toBe(2);
		expect(result.adaptiveScore).toBe(1);
		expect(result.severityCategory).toBe('moderate');
	});

	it('records an answered "independent" item in firedRules with score 0', () => {
		const d = createDefaultAssessment();
		d.adaptiveFunctioning.conceptualLanguage = 'independent';
		const result = calculateLD(d);
		expect(result.firedRules).toHaveLength(1);
		expect(result.firedRules[0].score).toBe(0);
	});

	it('classifies severity boundaries correctly', () => {
		expect(classifyAdaptiveScore(0.99)).toBe('mild');
		expect(classifyAdaptiveScore(1.0)).toBe('moderate');
		expect(classifyAdaptiveScore(1.99)).toBe('moderate');
		expect(classifyAdaptiveScore(2.0)).toBe('severe');
		expect(classifyAdaptiveScore(2.59)).toBe('severe');
		expect(classifyAdaptiveScore(2.6)).toBe('profound');
	});

	it('uses unique rule ids', () => {
		const ids = ldRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Learning Disability flagged-issue detection', () => {
	it('raises only the default reasonable-adjustments flag for a blank assessment', () => {
		const flags = detectAdditionalFlags(createDefaultAssessment());
		expect(flags.some((f) => f.id === 'FLAG-ADJ-001')).toBe(true);
	});

	it('flags frequent seizures as urgent', () => {
		const d = createDefaultAssessment();
		d.medicalReview.hasEpilepsy = 'yes';
		d.medicalReview.seizuresPerMonth = 6;
		const flags = detectAdditionalFlags(d);
		const epi = flags.find((f) => f.id === 'FLAG-EPI-001');
		expect(epi?.priority).toBe('urgent');
	});

	it('flags psychotropic medication without a STOMP review', () => {
		const d = createDefaultAssessment();
		d.medicalReview.takesPsychotropic = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-STOMP-001')).toBe(true);
	});

	it('flags lack of capacity to consent to the health check', () => {
		const d = createDefaultAssessment();
		d.mentalCapacityConsent.canConsentToHealthCheck = 'no';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-CAP-001')).toBe(true);
	});

	it('flags significant behaviour without a support plan', () => {
		const d = createDefaultAssessment();
		d.behaviouralConcerns.aggression = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BEH-002')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-BEH-005')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = createDefaultAssessment();
		d.medicalReview.hasEpilepsy = 'yes';
		d.medicalReview.seizuresPerMonth = 8;
		d.medicalReview.hasMentalHealthDiagnosis = 'yes';
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
