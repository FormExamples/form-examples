import { gradeAlignment } from './alignment-rules';
import { gradeConfidence } from './confidence-rules';
import { gradeImpact } from './impact-rules';
import { gradePace } from './pace-rules';
import { gradeProgress } from './progress-rules';
import { gradeSmart } from './smart-rules';
import { gradeStretch } from './stretch-rules';
import { computeFlags } from './flagged-issues';
import type { GradeResult, ObjectiveAssessment, RagBand } from './types';
import { worstBand } from './utils';

export function gradeObjective(a: ObjectiveAssessment): GradeResult {
	const [pBand, pRules] = gradeProgress(a.scores);
	const [cBand, cRules] = gradeConfidence(a.scores.confidenceDecile);
	const [stBand, stRules] = gradeStretch(a.scores.stretchTier);
	const [aBand, aRules] = gradeAlignment(a.scores.alignmentGrade);
	const [iBand, iRules] = gradeImpact(a.scores.impactTier);
	const [smBand, smRules] = gradeSmart(a.scores.smartQuality);
	const [paBand, paRules] = gradePace(a.scores.paceDeviationPercent);

	const composite: RagBand = worstBand([pBand, cBand, stBand, aBand, iBand, smBand, paBand]);

	const rulesFired = [
		...pRules, ...cRules, ...stRules, ...aRules, ...iRules, ...smRules, ...paRules,
		{ ruleId: `R-COMPOSITE-${composite.toUpperCase()}`, instrument: 'composite' as const, grade: composite, category: 'composite', description: `Composite RAG ${composite} via worst-band.` },
	];

	const flags = computeFlags(a);

	return { computedCompositeRag: composite, rulesFired, flags };
}
