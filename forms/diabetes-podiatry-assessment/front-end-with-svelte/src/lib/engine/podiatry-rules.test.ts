import { describe, it, expect } from 'vitest';
import {
	deriveContext,
	hasHistory,
	perFootBaseRisk,
	perFootRisk,
	perFootRiskFactorCount,
	reviewRules
} from './podiatry-rules';
import type { AssessmentData, FootExam } from './types';

/**
 * A blank foot exam (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/env` module.
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

describe('diabetes-podiatry-assessment per-foot risk-factor count', () => {
	it('counts zero factors on a blank foot', () => {
		expect(perFootRiskFactorCount(createDefaultFoot())).toBe(0);
	});

	it('counts insensate neuropathy as one factor', () => {
		const foot = createDefaultFoot();
		foot.neuropathyStatus = 'insensate';
		expect(perFootRiskFactorCount(foot)).toBe(1);
	});

	it('counts diminished or absent pulses as one factor', () => {
		const foot = createDefaultFoot();
		foot.pulsesStatus = 'diminished';
		expect(perFootRiskFactorCount(foot)).toBe(1);
		foot.pulsesStatus = 'absent';
		expect(perFootRiskFactorCount(foot)).toBe(1);
	});

	it('counts callus and skin breakdown as a single combined factor', () => {
		const foot = createDefaultFoot();
		foot.callus = 'yes';
		foot.skinBreakdown = 'yes';
		expect(perFootRiskFactorCount(foot)).toBe(1);
	});

	it('counts all four independent factors when everything is present', () => {
		const foot = createDefaultFoot();
		foot.neuropathyStatus = 'insensate';
		foot.pulsesStatus = 'absent';
		foot.deformity = 'yes';
		foot.callus = 'yes';
		expect(perFootRiskFactorCount(foot)).toBe(4);
	});
});

describe('diabetes-podiatry-assessment per-foot base risk boundaries', () => {
	it('0 factors -> low', () => {
		expect(perFootBaseRisk(createDefaultFoot())).toBe('low');
	});

	it('exactly 1 factor -> moderate', () => {
		const foot = createDefaultFoot();
		foot.deformity = 'yes';
		expect(perFootBaseRisk(foot)).toBe('moderate');
	});

	it('2 or more factors -> high', () => {
		const foot = createDefaultFoot();
		foot.deformity = 'yes';
		foot.callus = 'yes';
		expect(perFootBaseRisk(foot)).toBe('high');
	});
});

describe('diabetes-podiatry-assessment per-foot risk overrides', () => {
	it('active ulcer forces active-urgent regardless of factor count', () => {
		const foot = createDefaultFoot();
		foot.activeUlcer = 'yes';
		expect(perFootRisk(foot)).toBe('active-urgent');
	});

	it('suspected Charcot forces active-urgent regardless of factor count', () => {
		const foot = createDefaultFoot();
		foot.suspectedCharcot = 'yes';
		expect(perFootRisk(foot)).toBe('active-urgent');
	});

	it('previous ulcer forces at least high even with zero risk factors', () => {
		const foot = createDefaultFoot();
		foot.previousUlcer = 'yes';
		expect(perFootRisk(foot)).toBe('high');
	});

	it('previous minor amputation forces at least high', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'minor';
		expect(perFootRisk(foot)).toBe('high');
	});

	it('previous major amputation forces at least high', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'major';
		expect(perFootRisk(foot)).toBe('high');
	});

	it('history override does not downgrade a foot already at high from factor count', () => {
		const foot = createDefaultFoot();
		foot.deformity = 'yes';
		foot.callus = 'yes';
		foot.previousUlcer = 'yes';
		expect(perFootRisk(foot)).toBe('high');
	});

	it('history override never upgrades to active-urgent', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'major';
		expect(perFootRisk(foot)).not.toBe('active-urgent');
	});
});

describe('diabetes-podiatry-assessment history detection', () => {
	it('hasHistory is true for a previous ulcer', () => {
		const foot = createDefaultFoot();
		foot.previousUlcer = 'yes';
		expect(hasHistory(foot)).toBe(true);
	});

	it('hasHistory is true for a minor previous amputation', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'minor';
		expect(hasHistory(foot)).toBe(true);
	});

	it('hasHistory is true for a major previous amputation', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'major';
		expect(hasHistory(foot)).toBe(true);
	});

	it('hasHistory is false for a blank (unanswered) foot', () => {
		// The unanswered default is '' for both previousUlcer and
		// previousAmputation — neither 'yes' nor 'minor'/'major' — so a
		// completely untouched foot correctly has no history.
		const foot = createDefaultFoot();
		expect(hasHistory(foot)).toBe(false);
	});

	it('hasHistory is false when previousAmputation is explicitly none', () => {
		const foot = createDefaultFoot();
		foot.previousAmputation = 'none';
		expect(hasHistory(foot)).toBe(false);
	});
});

describe('diabetes-podiatry-assessment overall context derivation (mismatched feet)', () => {
	it('takes the worse of the two feet when mismatched (one low, one high)', () => {
		const d = createDefaultAssessment();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		// leftFoot stays blank (low).
		const ctx = deriveContext(d);
		expect(ctx.rightFootRisk).toBe('high');
		expect(ctx.leftFootRisk).toBe('low');
		expect(ctx.worstFootRisk).toBe('high');
	});

	it('takes the worse of the two feet when the left foot is the more severe', () => {
		const d = createDefaultAssessment();
		d.leftFoot.activeUlcer = 'yes';
		const ctx = deriveContext(d);
		expect(ctx.rightFootRisk).toBe('low');
		expect(ctx.leftFootRisk).toBe('active-urgent');
		expect(ctx.worstFootRisk).toBe('active-urgent');
	});

	it('reflects renal replacement therapy in the context', () => {
		const d = createDefaultAssessment();
		d.riskFactors.onRenalReplacementTherapy = 'yes';
		expect(deriveContext(d).onRenalReplacementTherapy).toBe(true);
	});

	it('tighterHighRiskInterval is true when the worse foot carries a history', () => {
		const d = createDefaultAssessment();
		d.rightFoot.previousUlcer = 'yes';
		expect(deriveContext(d).tighterHighRiskInterval).toBe(true);
	});

	it('tighterHighRiskInterval is false when the worse foot carries no history', () => {
		const d = createDefaultAssessment();
		d.rightFoot.deformity = 'yes';
		d.rightFoot.callus = 'yes';
		d.rightFoot.previousAmputation = 'none';
		d.leftFoot.previousAmputation = 'none';
		expect(deriveContext(d).tighterHighRiskInterval).toBe(false);
	});
});

describe('diabetes-podiatry-assessment review rules', () => {
	it('all rule IDs are unique', () => {
		const ids = reviewRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('the last rule is an unconditional low-risk fallback', () => {
		const last = reviewRules[reviewRules.length - 1];
		expect(last.reviewPathway).toBe('annual-review');
		expect(last.evaluate({} as never)).toBe(true);
	});
});
