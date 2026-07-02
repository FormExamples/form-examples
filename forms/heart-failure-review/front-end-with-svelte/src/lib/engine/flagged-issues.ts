import type { AssessmentData, FlaggedIssue, MedicationOptimisation, ReviewStatus } from './types';

/**
 * Detect the clinician-facing safety flags raised by the review findings.
 * Computed INDEPENDENTLY of the classification and completeness grades (which
 * the grader produces), each flag carries a priority (spec §5). Categories
 * mirror the `heart_failure_review_grade_flag` SQL CHECK constraint.
 *
 *   - Urgent review (high)         — nyhaClass >= 3 or decompensation == 'yes'
 *   - Optimisation gap             — indicated pillar(s) not-prescribed without a
 *     (high if HFrEF and >= 2       documented contraindication
 *      missing; else medium)
 *   - Hyperkalaemia (high)         — potassium > 5.5
 *   - Hypokalaemia (medium)        — potassium < 3.5
 *   - Renal impairment (high)      — egfr < 30
 *   - Fluid overload               — weight gain >= 2 kg, oedema moderate/severe,
 *     (high if nyha >= 3; else       raised JVP, or lung crackles
 *      medium)
 *   - Missing monitoring (medium)  — on a RAAS inhibitor or MRA but no recent
 *                                     potassium / eGFR / bloods date
 *   - Incomplete review (low)      — reviewStatus != 'complete'
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { medicationOptimisation: MedicationOptimisation; reviewStatus: ReviewStatus }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const f = data.functional;
	const fl = data.fluid;
	const inv = data.investigations;
	const med = data.medication;
	const nyha = f.nyhaClass;
	const opt = grade.medicationOptimisation;

	// ─── Urgent review (HIGH) ───────────────────────────────────
	if ((nyha !== null && nyha !== undefined && nyha >= 3) || f.decompensation === 'yes') {
		const reason =
			f.decompensation === 'yes'
				? 'Documented decompensation since the last review'
				: `NYHA class ${nyha} — symptomatic or advanced heart failure`;
		flags.push({
			id: 'F-URGENT-REVIEW-001',
			category: 'urgent-review',
			priority: 'high',
			description: `${reason}: arrange prompt clinical review`,
			suggestedAction:
				'Arrange urgent clinical review; consider referral to the heart-failure specialist team and check for reversible precipitants.'
		});
	}

	// ─── Optimisation gap ───────────────────────────────────────
	if (opt && opt.missingPillars.length > 0) {
		const isHfref = data.diagnosis.heartFailureType === 'reduced';
		const highGap = isHfref && opt.missingPillars.length >= 2;
		flags.push({
			id: 'F-OPTIMISATION-GAP-001',
			category: 'optimisation-gap',
			priority: highGap ? 'high' : 'medium',
			description:
				`${opt.missingPillars.length} indicated pillar(s) not prescribed without a documented contraindication ` +
				`(${opt.prescribedPillars} of ${opt.indicatedPillars} indicated pillars prescribed)`,
			suggestedAction:
				'Review guideline-directed medical therapy; initiate or up-titrate the missing pillar(s) unless contraindicated, and document the reason where they are withheld.'
		});
	}

	// ─── Hyperkalaemia (HIGH) ───────────────────────────────────
	if (inv.potassium !== null && inv.potassium > 5.5) {
		flags.push({
			id: 'F-HYPERKALAEMIA-001',
			category: 'deranged-u-e-hyperkalaemia',
			priority: 'high',
			description: `Serum potassium ${inv.potassium} mmol/L above the 5.5 mmol/L threshold — hyperkalaemia`,
			suggestedAction:
				'Review the RAAS inhibitor and MRA; recheck U&E, consider dose reduction or suspension, and treat hyperkalaemia per local policy.'
		});
	}

	// ─── Hypokalaemia (MEDIUM) ──────────────────────────────────
	if (inv.potassium !== null && inv.potassium < 3.5) {
		flags.push({
			id: 'F-HYPOKALAEMIA-001',
			category: 'deranged-u-e-hyperkalaemia',
			priority: 'medium',
			description: `Serum potassium ${inv.potassium} mmol/L below the 3.5 mmol/L threshold — hypokalaemia`,
			suggestedAction:
				'Review diuretic therapy, replace potassium, and recheck U&E; consider an MRA where appropriate.'
		});
	}

	// ─── Renal impairment (HIGH) ────────────────────────────────
	if (inv.egfr !== null && inv.egfr < 30) {
		flags.push({
			id: 'F-RENAL-IMPAIRMENT-001',
			category: 'deranged-u-e-hyperkalaemia',
			priority: 'high',
			description: `eGFR ${inv.egfr} mL/min/1.73m² below 30 — significant renal impairment`,
			suggestedAction:
				'Review RAAS-inhibitor / MRA / SGLT2-inhibitor safety, recheck renal function, and consider specialist renal or heart-failure advice.'
		});
	}

	// ─── Fluid overload ─────────────────────────────────────────
	const fluidOverload =
		(fl.weightChangeKg !== null && fl.weightChangeKg >= 2) ||
		fl.peripheralOedema === 'moderate' ||
		fl.peripheralOedema === 'severe' ||
		fl.raisedJvp === 'yes' ||
		fl.lungCrackles === 'yes';
	if (fluidOverload) {
		const signs: string[] = [];
		if (fl.weightChangeKg !== null && fl.weightChangeKg >= 2)
			signs.push(`weight gain ${fl.weightChangeKg} kg`);
		if (fl.peripheralOedema === 'moderate' || fl.peripheralOedema === 'severe')
			signs.push(`${fl.peripheralOedema} peripheral oedema`);
		if (fl.raisedJvp === 'yes') signs.push('raised JVP');
		if (fl.lungCrackles === 'yes') signs.push('lung crackles');
		const highFluid = nyha !== null && nyha !== undefined && nyha >= 3;
		flags.push({
			id: 'F-FLUID-OVERLOAD-001',
			category: 'fluid-overload',
			priority: highFluid ? 'high' : 'medium',
			description: `Signs of fluid overload: ${signs.join(', ')}`,
			suggestedAction:
				'Assess volume status; consider up-titrating the loop diuretic, reinforcing fluid / salt advice and daily weights, and arranging review.'
		});
	}

	// ─── Missing monitoring bloods (MEDIUM) ─────────────────────
	const onRaasOrMra =
		med.raasInhibitorStatus === 'prescribed' || med.mraStatus === 'prescribed';
	const bloodsMissing =
		inv.potassium === null || inv.egfr === null || !String(inv.bloodsDate || '').trim();
	if (onRaasOrMra && bloodsMissing) {
		flags.push({
			id: 'F-MISSING-MONITORING-001',
			category: 'missing-monitoring',
			priority: 'medium',
			description:
				'On a RAAS inhibitor or MRA but recent monitoring bloods (potassium / eGFR / bloods date) are not documented',
			suggestedAction:
				'Arrange U&E and eGFR monitoring bloods in line with RAAS-inhibitor / MRA safety guidance and record the date.'
		});
	}

	// ─── Incomplete review (LOW) ────────────────────────────────
	if (grade.reviewStatus !== 'complete') {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description:
				'One or more required review domains are undocumented — the review is not complete',
			suggestedAction:
				'Complete the outstanding review domains so the annual-review record is whole.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

	return flags;
}
