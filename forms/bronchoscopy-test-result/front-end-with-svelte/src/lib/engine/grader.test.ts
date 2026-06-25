import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { BronchoscopyResult } from './types';

/** A fully-completed, normal bronchoscopy report fixture. */
function createNormalResult(): BronchoscopyResult {
	return {
		reportingClinician: 'Dr A Bronchoscopist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		procedure: 'flexible-bronchoscopy',
		sedationUsed: 'conscious',
		extentExamined: 'Trachea, carina, and lobar and segmental bronchi to subsegmental level bilaterally.',
		clinicalHistory: 'Persistent cough; exclude endobronchial lesion.',
		findingsNarrative: 'Normal airways. No endobronchial lesion. Mucosa healthy throughout.',
		endobronchialLesion: false,
		mucosalAbnormality: false,
		extrinsicCompression: false,
		bleeding: false,
		foreignBody: false,
		secretionsPurulent: false,
		normalExamination: true,
		lesionLocation: '',
		samplesTaken: 'Bronchial washings sent for cytology and microbiology.',
		complication: 'none',
		impression: 'Normal bronchoscopy. No endobronchial abnormality.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: mucosal abnormality, no critical finding. */
function createAbnormalResult(): BronchoscopyResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'Patchy mucosal erythema and infiltration in the right main bronchus.',
		mucosalAbnormality: true,
		normalExamination: false,
		lesionLocation: 'Right main bronchus',
		impression: 'Mucosal abnormality; biopsy sent for histology.',
		recommendedFollowUp: 'Review with histology results.'
	};
}

/** A critical report fixture: suspected endobronchial tumour. */
function createCriticalResult(): BronchoscopyResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Haemoptysis and weight loss; exclude malignancy.',
		findingsNarrative: 'Exophytic endobronchial mass occluding the right upper lobe bronchus.',
		endobronchialLesion: true,
		normalExamination: false,
		lesionLocation: 'Right upper lobe bronchus',
		impression: 'Suspected endobronchial malignancy.',
		recommendedFollowUp: 'Urgent lung-cancer MDT referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Bronchoscopy four-axis grading engine', () => {
	it('grades a normal, complete report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with a mucosal abnormality', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a suspected tumour to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
		// A suspected tumour triggers an urgent lung-cancer MDT referral flag.
		expect(g.flags.some((f) => f.flagId === 'F-URGENT-REFERRAL-001')).toBe(true);
	});

	it('escalates a procedural pneumothorax to critical-alert', () => {
		const r = createNormalResult();
		r.complication = 'pneumothorax';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
	});

	it('escalates extrinsic compression to major severity and urgent follow-up', () => {
		const r = createNormalResult();
		r.extrinsicCompression = true;
		r.normalExamination = false;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an unrecorded extent with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.extentExamined = '';
		r.impression = '';
		r.normalExamination = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.samplesTaken = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades purulent-secretions-only findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.secretionsPurulent = true;
		r.normalExamination = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Bronchoscopy flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags an endobronchial lesion with no recorded location', () => {
		const r = createCriticalResult();
		r.lesionLocation = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createCriticalResult());
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a normal complete report', () => {
		const flags = detectFlags(createNormalResult());
		expect(flags).toHaveLength(0);
	});
});
