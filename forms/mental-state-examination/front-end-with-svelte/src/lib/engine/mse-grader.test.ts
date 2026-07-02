import { describe, it, expect } from 'vitest';
import { calculateMseGrade, deriveRiskLevel } from './mse-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { domainRules } from './mse-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			assessedAt: '',
			careSetting: '',
			assessmentReason: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		appearance: {
			appearanceGrooming: '',
			appearanceEyeContact: '',
			appearanceRapport: '',
			appearancePsychomotor: '',
			appearanceAbnormalMovements: '',
			appearanceNotes: ''
		},
		speech: {
			speechRate: '',
			speechVolume: '',
			speechQuantity: '',
			speechFluency: '',
			speechNotes: ''
		},
		emotion: {
			moodSubjective: '',
			moodDescriptor: '',
			affectRange: '',
			affectCongruence: '',
			affectReactivity: '',
			emotionNotes: ''
		},
		perception: {
			hallucinationsPresent: '',
			commandHallucinations: '',
			illusions: '',
			depersonalisation: '',
			derealisation: '',
			perceptionNotes: ''
		},
		thought: {
			thoughtForm: '',
			delusions: '',
			obsessions: '',
			suicidalIdeation: '',
			homicidalIdeation: '',
			selfHarmThoughts: '',
			thoughtNotes: ''
		},
		insight: {
			insightLevel: '',
			treatmentUnderstanding: '',
			judgement: '',
			insightNotes: ''
		},
		cognition: {
			orientation: '',
			attention: '',
			memory: '',
			cognitiveImpression: '',
			cognitionNotes: ''
		},
		summary: { clinicalFormulation: '' }
	};
}

/** A record with all seven ASEPTIC domains documented (no risk findings). */
function createFullyDocumented(): AssessmentData {
	const d = createDefaultAssessment();
	d.appearance.appearanceGrooming = 'well-kempt';
	d.speech.speechRate = 'normal';
	d.emotion.moodDescriptor = 'euthymic';
	d.perception.hallucinationsPresent = 'none';
	d.thought.thoughtForm = 'linear';
	d.insight.insightLevel = 'full';
	d.cognition.orientation = 'orientated';
	return d;
}

describe('MSE completeness grading', () => {
	it('grades an empty record partial with 0% and no documented domains', () => {
		const r = calculateMseGrade(createDefaultAssessment());
		expect(r.status).toBe('partial');
		expect(r.completenessPercent).toBe(0);
		expect(r.domainStatuses.filter((d) => d.documented)).toHaveLength(0);
	});

	it('grades a fully-documented record complete with 100%', () => {
		const r = calculateMseGrade(createFullyDocumented());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.domainStatuses.every((d) => d.documented)).toBe(true);
	});

	it('grades a partly-documented record partial with a rounded percentage', () => {
		const d = createDefaultAssessment();
		d.appearance.appearanceGrooming = 'dishevelled'; // 1 of 7
		d.speech.speechRate = 'slow'; // 2 of 7
		const r = calculateMseGrade(d);
		expect(r.status).toBe('partial');
		expect(r.completenessPercent).toBe(Math.round((100 * 2) / 7)); // 29
	});

	it('documents a domain from a free-text notes field alone', () => {
		const d = createDefaultAssessment();
		d.cognition.cognitionNotes = 'Alert, engaged, no gross deficit.';
		const r = calculateMseGrade(d);
		expect(r.domainStatuses.find((s) => s.domain === 'cognition')?.documented).toBe(true);
	});
});

describe('MSE risk-level derivation', () => {
	it('is none for a complete record with no findings', () => {
		const r = calculateMseGrade(createFullyDocumented());
		expect(r.flags).toHaveLength(0);
		expect(r.riskLevel).toBe('none');
	});

	it('is low when only the incomplete-examination flag fires', () => {
		const d = createDefaultAssessment();
		d.appearance.appearanceGrooming = 'well-kempt'; // partial → incomplete flag (low)
		const r = calculateMseGrade(d);
		expect(r.riskLevel).toBe('low');
		expect(r.flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('is moderate for passive suicidal ideation in a complete record', () => {
		const d = createFullyDocumented();
		d.thought.suicidalIdeation = 'passive';
		const r = calculateMseGrade(d);
		expect(r.riskLevel).toBe('moderate');
		expect(r.flags.some((f) => f.id === 'F-SELF-HARM-THOUGHTS-001')).toBe(true);
	});

	it('is high for active suicidal ideation with a plan', () => {
		const d = createFullyDocumented();
		d.thought.suicidalIdeation = 'active-with-plan';
		const r = calculateMseGrade(d);
		expect(r.riskLevel).toBe('high');
		expect(r.flags.some((f) => f.id === 'F-SUICIDAL-IDEATION-001')).toBe(true);
	});
});

describe('MSE flagged-issue detection', () => {
	it('raises the command-hallucinations flag', () => {
		const d = createFullyDocumented();
		d.perception.commandHallucinations = 'yes';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-COMMAND-HALLUCINATIONS-001')).toBe(true);
	});

	it('raises the homicidal-ideation flag for intent', () => {
		const d = createFullyDocumented();
		d.thought.homicidalIdeation = 'intent';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-HOMICIDAL-IDEATION-001')).toBe(true);
	});

	it('raises psychosis-with-risk when hallucinations accompany a high ideation flag', () => {
		const d = createFullyDocumented();
		d.perception.hallucinationsPresent = 'auditory';
		d.thought.suicidalIdeation = 'active-no-plan';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-PSYCHOSIS-WITH-RISK-001')).toBe(true);
	});

	it('raises the cognitive-impairment flag for global disorientation', () => {
		const d = createFullyDocumented();
		d.cognition.orientation = 'global';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-COGNITIVE-IMPAIRMENT-001')).toBe(true);
	});

	it('raises the low-mood flag only when no ideation flag is present', () => {
		const withIdeation = createFullyDocumented();
		withIdeation.emotion.moodDescriptor = 'low';
		withIdeation.thought.suicidalIdeation = 'passive';
		expect(
			detectFlaggedIssues(withIdeation, 'complete').some((f) => f.id === 'F-LOW-MOOD-001')
		).toBe(false);

		const moodOnly = createFullyDocumented();
		moodOnly.emotion.moodDescriptor = 'low';
		expect(detectFlaggedIssues(moodOnly, 'complete').some((f) => f.id === 'F-LOW-MOOD-001')).toBe(
			true
		);
	});

	it('raises lack-of-insight-with-risk when no insight accompanies another flag', () => {
		const d = createFullyDocumented();
		d.thought.suicidalIdeation = 'active-no-plan';
		d.insight.insightLevel = 'none';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-LACK-OF-INSIGHT-WITH-RISK-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment(); // partial → low incomplete flag
		d.thought.suicidalIdeation = 'active-with-plan'; // high
		d.thought.delusions = 'persecutory'; // moderate
		const flags = detectFlaggedIssues(d, 'partial');
		const order: Record<string, number> = { high: 0, moderate: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('deriveRiskLevel returns the highest priority present', () => {
		expect(deriveRiskLevel([])).toBe('none');
		expect(
			deriveRiskLevel([
				{ id: 'x', category: 'other', priority: 'low', description: '', suggestedAction: '' }
			])
		).toBe('low');
		expect(
			deriveRiskLevel([
				{ id: 'x', category: 'other', priority: 'low', description: '', suggestedAction: '' },
				{ id: 'y', category: 'other', priority: 'high', description: '', suggestedAction: '' }
			])
		).toBe('high');
	});

	it('all domain-rule IDs are unique', () => {
		const ids = domainRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
