import type { AssessmentData, ClavienDindoGradeKey, FiredRule, GradingResult } from './types';
import { clavienDindoRuleByGrade } from './clavien-dindo-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { gradeOrder } from './utils';

/**
 * Pure function: evaluates the recorded complications and produces the overall
 * Clavien-Dindo grade (the worst single complication), a per-complication audit
 * trail, the additional safety flags, and a timestamp.
 *
 * Rules:
 *   - If the user explicitly recorded `complicationsOccurred = 'no'` and graded
 *     no complications, the overall grade is Grade 0.
 *   - Otherwise the overall grade is the worst grade across all graded
 *     complications (canonical Clavien-Dindo ordering).
 *   - Unanswered grade fields are skipped; if all are unanswered the overall
 *     grade is Grade 0.
 */
export function calculateClavienDindo(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const complications = data.complicationsAssessment.complications || [];
	let worstOrder = 0;
	let worstGrade: ClavienDindoGradeKey = 'grade-0';
	let graded = 0;

	for (let i = 0; i < complications.length; i++) {
		const c = complications[i];
		if (!c || !c.grade) continue;
		const order = gradeOrder(c.grade);
		if (order < 0) continue;
		graded++;
		firedRules.push({
			id: `CD-${i + 1}`,
			category: c.description ? c.description : '(complication not described)',
			description: clavienDindoRuleByGrade[c.grade]?.description ?? '',
			grade: c.grade
		});
		if (order > worstOrder) {
			worstOrder = order;
			worstGrade = c.grade;
		}
	}

	// If user explicitly said "no complications" we record Grade 0.
	if (data.complicationsAssessment.complicationsOccurred === 'no' && graded === 0) {
		worstGrade = 'grade-0';
	}

	// If the form hasn't been touched at all, default to Grade 0.
	if (graded === 0 && data.complicationsAssessment.complicationsOccurred !== 'yes') {
		worstGrade = 'grade-0';
	}

	return {
		overallGrade: worstGrade,
		complicationCount: graded,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
