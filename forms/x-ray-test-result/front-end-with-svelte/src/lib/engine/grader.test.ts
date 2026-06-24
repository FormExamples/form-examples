import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { XRayResult } from './types';

/** A fully-completed, normal X-ray report fixture. */
function createNormalResult(): XRayResult {
	return {
		reportingClinician: 'Dr A Radiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		bodyRegion: 'chest',
		laterality: 'not-applicable',
		projections: 'PA and lateral.',
		examinationAdequacy: 'adequate',
		clinicalHistory: 'Persistent cough; exclude consolidation.',
		comparisonWithPrevious: 'No prior imaging available for comparison.',
		findingsNarrative: 'Lungs clear. No focal consolidation. Heart size normal.',
		fracture: false,
		dislocation: false,
		consolidation: false,
		pneumothorax: false,
		pleuralEffusion: false,
		foreignBody: false,
		freeAir: false,
		bonyLesion: false,
		incidentalFinding: false,
		unstableFracture: false,
		impression: 'Normal chest radiograph. No acute abnormality.',
		reportingCategory: 'normal',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal X-ray report fixture: wrist fracture, no critical finding. */
function createAbnormalResult(): XRayResult {
	return {
		...createNormalResult(),
		bodyRegion: 'wrist-hand',
		laterality: 'left',
		projections: 'PA and lateral of the left wrist.',
		findingsNarrative: 'Transverse fracture through the distal radius with minimal displacement.',
		fracture: true,
		impression: 'Distal radial fracture.',
		reportingCategory: 'abnormal-acute',
		recommendedFollowUp: 'Orthopaedic review and immobilisation.'
	};
}

/** A critical X-ray report fixture: tension pneumothorax. */
function createCriticalResult(): XRayResult {
	return {
		...createNormalResult(),
		bodyRegion: 'chest',
		clinicalHistory: 'Sudden-onset breathlessness; exclude pneumothorax.',
		findingsNarrative: 'Large right pneumothorax with mediastinal shift.',
		pneumothorax: true,
		impression: 'Large right pneumothorax.',
		reportingCategory: 'critical-actionable',
		recommendedFollowUp: 'Immediate clinical review for decompression.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('X-ray four-axis grading engine', () => {
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

	it('grades an abnormal report with an actionable fracture', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a critical finding to critical-alert regardless of other axes', () => {
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
	});

	it('auto-escalates free intraperitoneal air to critical', () => {
		const r = createNormalResult();
		r.bodyRegion = 'abdomen';
		r.freeAir = true;
		r.findingsNarrative = 'Free subdiaphragmatic gas consistent with perforation.';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('auto-escalates an unstable fracture to critical and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.bodyRegion = 'spine-cervical';
		r.unstableFracture = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-CRITICAL-01')).toBe(true);
	});

	it('classifies a non-diagnostic study as inconclusive', () => {
		const r = createNormalResult();
		r.examinationAdequacy = 'non-diagnostic';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.comparisonWithPrevious = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades incidental-only findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.incidentalFinding = true;
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

describe('X-ray flag detection', () => {
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

	it('flags a bony lesion with no recorded projections', () => {
		const r = createNormalResult();
		r.bonyLesion = true;
		r.projections = '';
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
