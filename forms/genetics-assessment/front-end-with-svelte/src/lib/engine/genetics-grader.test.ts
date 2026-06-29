import { describe, it, expect } from 'vitest';
import { createDefaultAssessment, emptyRelative } from '$lib/engine/factory';
import {
	gradeGenetics,
	calculateManchesterScore,
	countBethesdaMet,
	buildContext
} from './genetics-grader';
import { detectAdditionalFlags } from './flagged-issues';

describe('calculateManchesterScore', () => {
	it('is zero for a blank assessment', () => {
		expect(calculateManchesterScore(createDefaultAssessment())).toBe(0);
	});

	it('weights an ovarian <60 in a relative as 8 points', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 1;
		expect(calculateManchesterScore(d)).toBe(8);
	});

	it('sums proband and relative contributions', () => {
		const d = createDefaultAssessment();
		// female breast <30 (6) + male breast (8) + ovarian <60 relative (8) = 22
		d.targetedRiskScoring.manchester.probandFemaleBreastUnder30 = 1;
		d.targetedRiskScoring.manchester.probandMaleBreast = 1;
		d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 1;
		expect(calculateManchesterScore(d)).toBe(22);
	});
});

describe('countBethesdaMet', () => {
	it('counts only the criteria answered yes', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.bethesda.crcUnder50 = 'yes';
		d.targetedRiskScoring.bethesda.msiHistology = 'yes';
		expect(countBethesdaMet(d)).toBe(2);
	});
});

describe('gradeGenetics', () => {
	it('grades a blank assessment as low risk with no fired rules', () => {
		const r = gradeGenetics(createDefaultAssessment());
		expect(r.riskLevel).toBe('low');
		expect(r.firedRules).toHaveLength(0);
		expect(r.manchesterScore).toBe(0);
	});

	it('grades Manchester >= 30 as high risk', () => {
		const d = createDefaultAssessment();
		// 5 ovarian <60 relatives = 40 points
		d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 5;
		const r = gradeGenetics(d);
		expect(r.manchesterScore).toBe(40);
		expect(r.riskLevel).toBe('high');
		expect(r.firedRules.some((x) => x.id === 'GEN-MAN-003')).toBe(true);
	});

	it('fires a moderate rule for one Bethesda criterion met', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.bethesda.crcUnder50 = 'yes';
		const r = gradeGenetics(d);
		expect(r.bethesdaMet).toBe(1);
		expect(r.firedRules.some((x) => x.id === 'GEN-BET-001')).toBe(true);
		expect(r.riskLevel).toBe('moderate');
	});

	it('escalates two Bethesda criteria to high risk', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.bethesda.crcUnder50 = 'yes';
		d.targetedRiskScoring.bethesda.synchronousMetachronous = 'yes';
		const r = gradeGenetics(d);
		expect(r.riskLevel).toBe('high');
		expect(r.firedRules.some((x) => x.id === 'GEN-BET-002')).toBe(true);
	});

	it('treats PREMM5 >= 5% as high risk', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.premm5.externalPREMM5Percent = 7.5;
		const r = gradeGenetics(d);
		expect(r.premm5Score).toBe(7.5);
		expect(r.riskLevel).toBe('high');
	});

	it('counts affected first-degree relatives', () => {
		const d = createDefaultAssessment();
		d.familyPedigree.mother.affectedWithCancer = 'yes';
		d.familyPedigree.mother.cancers = [{ type: 'Breast', ageAtDiagnosis: 45 }];
		d.familyPedigree.father.affectedWithCancer = 'yes';
		d.familyPedigree.father.cancers = [{ type: 'Colorectal', ageAtDiagnosis: 60 }];
		const ctx = buildContext(d);
		expect(ctx.affectedFirstDegree).toBe(2);
		const r = gradeGenetics(d);
		expect(r.firedRules.some((x) => x.id === 'GEN-FAM-002')).toBe(true);
	});

	it('flags a bilateral breast cancer in the proband as high risk', () => {
		const d = createDefaultAssessment();
		d.personalMedicalHistory.cancers = [
			{ type: 'Breast', ageAtDiagnosis: 42, bilateral: 'yes', treatment: '' }
		];
		const r = gradeGenetics(d);
		expect(r.firedRules.some((x) => x.id === 'GEN-TUM-004')).toBe(true);
		expect(r.riskLevel).toBe('high');
	});

	it('detects an early-onset cluster across relatives', () => {
		const d = createDefaultAssessment();
		const sib = emptyRelative({ relation: 'Sibling', side: 'self', generation: 3 });
		sib.cancers = [{ type: 'Breast', ageAtDiagnosis: 40 }];
		const sib2 = emptyRelative({ relation: 'Sibling', side: 'self', generation: 3 });
		sib2.cancers = [{ type: 'Colorectal', ageAtDiagnosis: 48 }];
		d.familyPedigree.siblings = [sib, sib2];
		const ctx = buildContext(d);
		expect(ctx.earlyOnsetUnder50).toBe(2);
		expect(gradeGenetics(d).firedRules.some((x) => x.id === 'GEN-FAM-003')).toBe(true);
	});
});

describe('detectAdditionalFlags', () => {
	it('raises a BRCA testing flag when Manchester >= 15', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 2; // 16
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BRCA-001')).toBe(true);
	});

	it('always recommends pre-test counselling when none recorded', () => {
		const flags = detectAdditionalFlags(createDefaultAssessment());
		expect(flags.some((f) => f.id === 'FLAG-COUN-001')).toBe(true);
	});

	it('sorts flags high then medium then low', () => {
		const d = createDefaultAssessment();
		d.targetedRiskScoring.manchester.relativeOvarianUnder60 = 2; // high BRCA flag
		d.consanguinityAncestry.ashkenaziJewish = 'yes'; // medium
		d.patientUnderstandingConcerns.reproductiveImplications = 'yes'; // low
		const flags = detectAdditionalFlags(d);
		const order = { high: 0, medium: 1, low: 2 };
		for (let i = 1; i < flags.length; i++) {
			expect(order[flags[i].priority]).toBeGreaterThanOrEqual(order[flags[i - 1].priority]);
		}
	});
});
