import { describe, it, expect } from 'vitest';
import { calculateGrade, computeStatus, footComplete } from './podiatry-grader';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData, FootExam } from './types';

/**
 * A blank assessment record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/env` module.
 */
function createDefaultFoot(): FootExam {
	return {
		neuropathyStatus: '',
		pulsesStatus: '',
		deformity: '',
		callus: '',
		skinBreakdown: '',
		activeUlcer: '',
		ulcerSeverity: '',
		previousUlcer: '',
		previousAmputation: '',
		suspectedCharcot: ''
	};
}

function createDefaultAssessment(): AssessmentData {
	return {
		context: { assessedAt: '', assessmentSetting: '' },
		riskFactors: {
			diabetesType: '',
			yearsSinceDiagnosis: null,
			onRenalReplacementTherapy: '',
			visualAcuityImpairment: '',
			selfCareAbility: '',
			footwearAppropriate: ''
		},
		rightFoot: createDefaultFoot(),
		leftFoot: createDefaultFoot(),
		note: { clinicalContext: '' }
	};
}

/**
 * A fully-tested foot (both feet default here), so completeness is
 * satisfied unless overridden. `previousAmputation` is left at its
 * unanswered `''` default on both feet, which `hasHistory()` correctly
 * treats as no history (only `'minor'`/`'major'` count).
 */
function tested(): AssessmentData {
	const d = createDefaultAssessment();
	d.rightFoot.neuropathyStatus = 'sensate';
	d.rightFoot.pulsesStatus = 'normal';
	d.leftFoot.neuropathyStatus = 'sensate';
	d.leftFoot.pulsesStatus = 'normal';
	return d;
}

describe('diabetes-podiatry-assessment classification engine — risk category boundaries', () => {
	it('routes no risk factors on either foot to low risk / annual review', () => {
		const r = calculateGrade(tested());
		expect(r.rightFootRisk).toBe('low');
		expect(r.leftFootRisk).toBe('low');
		expect(r.overallRisk).toBe('low');
		expect(r.reviewPathway).toBe('annual-review');
		expect(r.reviewIntervalMonths).toBe(12);
		expect(r.referral).toBe('none');
	});

	it('routes one risk factor on the worse foot to moderate risk / 6-monthly review', () => {
		const d = tested();
		d.rightFoot.deformity = 'yes';
		const r = calculateGrade(d);
		expect(r.overallRisk).toBe('moderate');
		expect(r.reviewPathway).toBe('moderate-risk-review');
		expect(r.reviewIntervalMonths).toBe(6);
		expect(r.referral).toBe('foot-protection-service');
	});

	it('routes two combined risk factors on one foot to high risk / 3-monthly review (no history)', () => {
		const d = tested();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		const r = calculateGrade(d);
		expect(r.overallRisk).toBe('high');
		expect(r.reviewPathway).toBe('high-risk-review');
		expect(r.reviewIntervalMonths).toBe(3);
		expect(r.referral).toBe('multidisciplinary-foot-team');
	});

	it('routes an active ulcer to active-urgent / urgent MDT referral (no routine interval)', () => {
		const d = tested();
		d.rightFoot.activeUlcer = 'yes';
		d.rightFoot.ulcerSeverity = 'infected';
		const r = calculateGrade(d);
		expect(r.overallRisk).toBe('active-urgent');
		expect(r.reviewPathway).toBe('urgent-mdt-referral');
		expect(r.reviewIntervalMonths).toBeNull();
		expect(r.referral).toBe('urgent-mdt');
	});
});

describe('diabetes-podiatry-assessment classification engine — overrides', () => {
	it('suspected Charcot foot forces active-urgent even with no other findings', () => {
		const d = tested();
		d.leftFoot.suspectedCharcot = 'yes';
		const r = calculateGrade(d);
		expect(r.leftFootRisk).toBe('active-urgent');
		expect(r.overallRisk).toBe('active-urgent');
		expect(r.reviewPathway).toBe('urgent-mdt-referral');
	});

	it('previous ulcer forces at least high risk and a 1-month interval (history present)', () => {
		const d = tested();
		d.rightFoot.previousUlcer = 'yes';
		const r = calculateGrade(d);
		expect(r.rightFootRisk).toBe('high');
		expect(r.overallRisk).toBe('high');
		expect(r.reviewPathway).toBe('high-risk-review');
		expect(r.reviewIntervalMonths).toBe(1);
	});

	it('previous amputation forces at least high risk and a 1-month interval', () => {
		const d = tested();
		d.leftFoot.previousAmputation = 'minor';
		const r = calculateGrade(d);
		expect(r.leftFootRisk).toBe('high');
		expect(r.overallRisk).toBe('high');
		expect(r.reviewIntervalMonths).toBe(1);
	});

	it('combined risk factors without history use the looser 3-month interval', () => {
		const d = tested();
		d.rightFoot.neuropathyStatus = 'insensate';
		d.rightFoot.pulsesStatus = 'diminished';
		const r = calculateGrade(d);
		expect(r.overallRisk).toBe('high');
		expect(r.reviewIntervalMonths).toBe(3);
	});

	it('renal replacement therapy alone forces overall high risk even with two low-risk feet', () => {
		const d = tested();
		d.riskFactors.onRenalReplacementTherapy = 'yes';
		const r = calculateGrade(d);
		expect(r.rightFootRisk).toBe('low');
		expect(r.leftFootRisk).toBe('low');
		expect(r.overallRisk).toBe('high');
		expect(r.reviewPathway).toBe('high-risk-review');
		expect(r.reviewIntervalMonths).toBe(3);
	});

	it('renal replacement therapy does not override an active-urgent foot', () => {
		const d = tested();
		d.riskFactors.onRenalReplacementTherapy = 'yes';
		d.rightFoot.activeUlcer = 'yes';
		const r = calculateGrade(d);
		expect(r.overallRisk).toBe('active-urgent');
		expect(r.reviewPathway).toBe('urgent-mdt-referral');
	});
});

describe('diabetes-podiatry-assessment classification engine — mismatched feet', () => {
	it('takes the worse foot when one is low-risk and the other is high-risk', () => {
		const d = tested();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		// leftFoot stays at its tested-but-clean baseline (low).
		const r = calculateGrade(d);
		expect(r.rightFootRisk).toBe('high');
		expect(r.leftFootRisk).toBe('low');
		expect(r.overallRisk).toBe('high');
	});

	it('takes the worse foot when the left foot is active-urgent and the right is low', () => {
		const d = tested();
		d.leftFoot.activeUlcer = 'yes';
		const r = calculateGrade(d);
		expect(r.rightFootRisk).toBe('low');
		expect(r.leftFootRisk).toBe('active-urgent');
		expect(r.overallRisk).toBe('active-urgent');
	});
});

describe('diabetes-podiatry-assessment completeness', () => {
	it('a foot with neither neuropathy nor pulses status is incomplete', () => {
		expect(footComplete(createDefaultFoot())).toBe(false);
	});

	it('a foot with a not-tested status is incomplete', () => {
		const foot = createDefaultFoot();
		foot.neuropathyStatus = 'not-tested';
		foot.pulsesStatus = 'normal';
		expect(footComplete(foot)).toBe(false);
	});

	it('a foot with both statuses tested is complete', () => {
		const foot = createDefaultFoot();
		foot.neuropathyStatus = 'sensate';
		foot.pulsesStatus = 'normal';
		expect(footComplete(foot)).toBe(true);
	});

	it('the overall record is complete only when both feet are complete', () => {
		expect(computeStatus(tested())).toBe('complete');
		expect(computeStatus(createDefaultAssessment())).toBe('incomplete');
	});

	it('the grading result status matches computeStatus', () => {
		expect(calculateGrade(tested()).status).toBe('complete');
		expect(calculateGrade(createDefaultAssessment()).status).toBe('incomplete');
	});
});

describe('diabetes-podiatry-assessment flagged-issue detection', () => {
	const okGrade = { status: 'complete' as const, overallRisk: 'low' as const };

	it('raises the active-ulcer flag for either foot', () => {
		const d = tested();
		d.rightFoot.activeUlcer = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-ACTIVE-ULCER-001')).toBe(true);
	});

	it('raises the suspected-Charcot flag for either foot', () => {
		const d = tested();
		d.leftFoot.suspectedCharcot = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-SUSPECTED-CHARCOT-001')).toBe(true);
	});

	it('raises the critical-limb-ischaemia flag for either foot', () => {
		const d = tested();
		d.rightFoot.activeUlcer = 'yes';
		d.rightFoot.ulcerSeverity = 'critical-ischaemia';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-CRITICAL-ISCHAEMIA-001')).toBe(true);
	});

	it('raises the previous-major-amputation flag', () => {
		const d = tested();
		d.leftFoot.previousAmputation = 'major';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-PREVIOUS-MAJOR-AMPUTATION-001')).toBe(true);
	});

	it('raises the renal-replacement-therapy flag', () => {
		const d = tested();
		d.riskFactors.onRenalReplacementTherapy = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-RENAL-REPLACEMENT-THERAPY-001')).toBe(true);
	});

	it('raises the combined-risk-factors flag when a foot has 2+ factors and no active ulcer', () => {
		const d = tested();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-COMBINED-RISK-FACTORS-001')).toBe(true);
	});

	it('does not raise the combined-risk-factors flag when the foot also has an active ulcer', () => {
		const d = tested();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		d.rightFoot.activeUlcer = 'yes';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-COMBINED-RISK-FACTORS-001')).toBe(false);
	});

	it('raises the footwear flag when footwear is inappropriate and overall risk is moderate or above', () => {
		const d = tested();
		d.riskFactors.footwearAppropriate = 'no';
		const flags = detectFlaggedIssues(d, { status: 'complete', overallRisk: 'moderate' });
		expect(flags.some((f) => f.id === 'F-FOOTWEAR-001')).toBe(true);
	});

	it('does not raise the footwear flag when overall risk is low', () => {
		const d = tested();
		d.riskFactors.footwearAppropriate = 'no';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-FOOTWEAR-001')).toBe(false);
	});

	it('raises the self-care flag when self-care is impaired without support noted', () => {
		const d = tested();
		d.riskFactors.selfCareAbility = 'unable';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-SELF-CARE-001')).toBe(true);
	});

	it('does not raise the self-care flag when support is noted in the clinical context', () => {
		const d = tested();
		d.riskFactors.selfCareAbility = 'unable';
		d.note.clinicalContext = 'Daughter (carer) checks feet daily.';
		const flags = detectFlaggedIssues(d, okGrade);
		expect(flags.some((f) => f.id === 'F-SELF-CARE-001')).toBe(false);
	});

	it('raises the incomplete flag when the grade status is incomplete', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), { status: 'incomplete', overallRisk: 'low' });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = tested();
		d.rightFoot.activeUlcer = 'yes'; // high
		d.leftFoot.deformity = 'yes';
		d.leftFoot.callus = 'yes'; // medium (combined)
		const flags = detectFlaggedIssues(d, { status: 'incomplete', overallRisk: 'high' }); // + low
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
