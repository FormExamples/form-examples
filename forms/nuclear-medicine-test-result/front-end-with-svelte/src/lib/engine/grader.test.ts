import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { NuclearMedicineResult } from './types';

/** A fully-completed, normal nuclear medicine report fixture. */
function createNormalResult(): NuclearMedicineResult {
	return {
		reportingClinician: 'Dr A Physician',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		scanType: 'bone-scan',
		radiopharmaceutical: 'Tc-99m MDP',
		injectedActivityMbq: 600,
		examinationAdequacy: 'adequate',
		clinicalHistory: 'Staging; exclude bony metastases.',
		comparisonWithPrevious: 'No prior imaging available for comparison.',
		findingsNarrative: 'Normal physiological tracer distribution. No focal abnormal uptake.',
		abnormalUptake: false,
		metastaticPattern: false,
		perfusionDefect: false,
		photopenicArea: false,
		noSignificantAbnormality: true,
		incidentalFinding: false,
		ejectionFractionPercent: null,
		splitFunctionLeftPercent: null,
		splitFunctionRightPercent: null,
		impression: 'Normal bone scan. No scintigraphic evidence of metastatic disease.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: focal abnormal uptake, no critical finding. */
function createAbnormalResult(): NuclearMedicineResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'A solitary focus of abnormal uptake in the L3 vertebral body.',
		abnormalUptake: true,
		impression: 'Solitary focus of uptake; further characterisation advised.',
		reportingCategory: 'solitary-focus',
		recommendedFollowUp: 'Correlate with cross-sectional imaging.'
	};
}

/** A critical report fixture: high-probability PE on a V/Q lung scan. */
function createCriticalResult(): NuclearMedicineResult {
	return {
		...createNormalResult(),
		scanType: 'vq-lung-scan',
		radiopharmaceutical: 'Tc-99m MAA + Technegas',
		clinicalHistory: 'Acute pleuritic chest pain; exclude pulmonary embolism.',
		findingsNarrative:
			'Multiple segmental mismatched perfusion defects with preserved ventilation.',
		perfusionDefect: true,
		noSignificantAbnormality: false,
		impression: 'High-probability ventilation/perfusion mismatch for pulmonary embolism.',
		reportingCategory: 'high-probability',
		recommendedFollowUp: 'Immediate anticoagulation per local pathway.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Nuclear medicine four-axis grading engine', () => {
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

	it('grades an abnormal report with focal abnormal uptake', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
		// The clinician-entered reporting category is preserved.
		expect(g.reportingCategory).toBe('solitary-focus');
	});

	it('auto-escalates a high-probability PE on V/Q to critical-alert regardless of other axes', () => {
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
		// PE probability carried in the reporting category.
		expect(g.reportingCategory).toBe('high-probability');
	});

	it('auto-escalates a widespread metastatic pattern to critical-alert', () => {
		const r = createNormalResult();
		r.metastaticPattern = true;
		r.noSignificantAbnormality = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
	});

	it('escalates a markedly reduced ejection fraction (< 40 %) to major severity and urgent follow-up', () => {
		const r = createNormalResult();
		r.scanType = 'myocardial-perfusion';
		r.ejectionFractionPercent = 32;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
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

describe('Nuclear medicine flag detection', () => {
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

	it('flags a gated cardiac study with no recorded ejection fraction', () => {
		const r = createNormalResult();
		r.scanType = 'myocardial-perfusion';
		r.ejectionFractionPercent = null;
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
