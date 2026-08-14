// Composite grader for the Hip Replacement Surgery Evaluation.
//
// Composes the Oxford Hip Score, the Kellgren and Lawrence grade, the
// conservative-treatment audit, and the safety flags into a single pure,
// deterministic grading result. The public entry point is
// `calculateHipEvaluation(data)`. The output shape and the rule / flag IDs
// are identical across every front-end and the back-end.
//
// Algorithm: rule-order evaluation. `continue-conservative` is checked first
// (conservative measures not exhausted overrides everything else), then
// `not-indicated`, then `strong-candidate`, then `candidate`, then
// `mdt-review` as the fallback. See spec/index.md section 3.

import { detectFlags } from './flagged-issues';
import { scoreOhs } from './ohs-rules';
import type { Candidacy, FiredRule, GradingResult, HipReplacementSurgeryEvaluation } from './types';
import { ageInYears, calculateBmi, num, rule } from './utils';

const CANDIDACY_VALUES: Candidacy[] = [
	'strong-candidate',
	'candidate',
	'continue-conservative',
	'not-indicated',
	'mdt-review'
];

/**
 * Derive the computed surgical-candidacy recommendation from the OHS total,
 * the Kellgren and Lawrence grade, and whether conservative measures are
 * exhausted.
 */
export function deriveCandidacy(
	ohsTotal: number,
	kellgrenLawrenceGrade: number | null,
	conservativeMeasuresExhausted: string
): { candidacy: Candidacy; firedRules: FiredRule[] } {
	const firedRules: FiredRule[] = [];
	const kl = kellgrenLawrenceGrade;

	if (conservativeMeasuresExhausted === 'no') {
		firedRules.push(
			rule(
				'R-CANDIDACY-CONSERVATIVE-NOT-EXHAUSTED',
				'conservative',
				'exhausted',
				null,
				'continue-conservative',
				'candidacy',
				'Conservative measures have not been exhausted, so surgery is not yet indicated regardless of the Oxford Hip Score or imaging grade.'
			)
		);
		return { candidacy: 'continue-conservative', firedRules };
	}

	if (ohsTotal >= 40 || (kl !== null && kl <= 1)) {
		firedRules.push(
			rule(
				'R-CANDIDACY-NOT-INDICATED',
				'composite',
				'candidacy',
				ohsTotal,
				'not-indicated',
				'candidacy',
				`Oxford Hip Score ${ohsTotal} is 40 or above, or the Kellgren and Lawrence grade is 1 or below: surgery is not currently indicated.`
			)
		);
		return { candidacy: 'not-indicated', firedRules };
	}

	if (ohsTotal <= 19 && kl !== null && kl >= 3) {
		firedRules.push(
			rule(
				'R-CANDIDACY-STRONG',
				'composite',
				'candidacy',
				ohsTotal,
				'strong-candidate',
				'candidacy',
				`Oxford Hip Score ${ohsTotal} is 19 or below with Kellgren and Lawrence grade ${kl}: a strong candidate for surgery.`
			)
		);
		return { candidacy: 'strong-candidate', firedRules };
	}

	if (ohsTotal <= 29 && kl !== null && kl >= 2) {
		firedRules.push(
			rule(
				'R-CANDIDACY-CANDIDATE',
				'composite',
				'candidacy',
				ohsTotal,
				'candidate',
				'candidacy',
				`Oxford Hip Score ${ohsTotal} is 29 or below with Kellgren and Lawrence grade ${kl}: a candidate for surgery.`
			)
		);
		return { candidacy: 'candidate', firedRules };
	}

	firedRules.push(
		rule(
			'R-CANDIDACY-MDT-REVIEW',
			'composite',
			'candidacy',
			ohsTotal,
			'mdt-review',
			'candidacy',
			`Oxford Hip Score ${ohsTotal} and Kellgren and Lawrence grade ${kl ?? 'unknown'} form a mixed or borderline picture requiring multidisciplinary-team review.`
		)
	);
	return { candidacy: 'mdt-review', firedRules };
}

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.clinician.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 */
export function calculateHipEvaluation(data: HipReplacementSurgeryEvaluation): GradingResult {
	const firedRules: FiredRule[] = [];

	const age = ageInYears(data.patient.birthDate, data.clinician.assessmentDate);
	const bmi = calculateBmi(data.patient.heightAsCm, data.patient.weightAsKg);

	// --- Oxford Hip Score (primary instrument) ------------------------------
	const ohs = scoreOhs(data);
	firedRules.push(...ohs.firedRules);

	const kellgrenLawrenceGrade = num(data.imaging.kellgrenLawrenceGrade);
	if (kellgrenLawrenceGrade !== null) {
		firedRules.push(
			rule(
				'R-IMAGING-KL-GRADE',
				'imaging',
				'kellgren-lawrence',
				kellgrenLawrenceGrade,
				String(kellgrenLawrenceGrade),
				'radiographic-grading',
				`Kellgren and Lawrence grade ${kellgrenLawrenceGrade}.`
			)
		);
	}

	// --- Surgical candidacy ---------------------------------------------------
	const { candidacy: computedCandidacy, firedRules: candidacyRules } = deriveCandidacy(
		ohs.total,
		kellgrenLawrenceGrade,
		data.conservative.conservativeMeasuresExhausted
	);
	firedRules.push(...candidacyRules);

	// --- Clinician override -----------------------------------------------------
	// The override changes the candidacy recommendation only. Safety flags are
	// computed independently below and are always reported.
	const override = data.summary.overrideCandidacy;
	const finalCandidacy: Candidacy =
		override && CANDIDACY_VALUES.includes(override) ? override : computedCandidacy;
	const overrideReason = finalCandidacy !== computedCandidacy ? data.summary.overrideReason : '';

	const flags = detectFlags(data, { bmi, age });

	return {
		ohsTotal: ohs.total,
		ohsCategory: ohs.category,
		bmi,
		kellgrenLawrenceGrade,
		computedCandidacy,
		finalCandidacy,
		overrideReason,
		firedRules,
		flags
	};
}

/** Display labels for the OHS category bands. */
export const OHS_CATEGORY_LABELS: Record<string, string> = {
	severe: 'Severe (0–19)',
	moderate: 'Moderate (20–29)',
	'mild-to-moderate': 'Mild-to-moderate (30–39)',
	satisfactory: 'Satisfactory (40–48)'
};

/** Display labels for the surgical-candidacy recommendation. */
export const CANDIDACY_LABELS: Record<string, string> = {
	'strong-candidate': 'Strong candidate for surgery',
	candidate: 'Candidate for surgery',
	'continue-conservative': 'Continue conservative management',
	'not-indicated': 'Not currently indicated',
	'mdt-review': 'Multidisciplinary-team review'
};
