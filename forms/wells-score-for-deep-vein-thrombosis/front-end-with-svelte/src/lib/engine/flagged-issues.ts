import type { AssessmentData, FlaggedIssue } from './types';

/**
 * The ten criterion inputs, in wizard order, with a human label for the
 * incomplete-assessment flag.
 */
const CRITERION_INPUTS: [keyof AssessmentData, string, string][] = [
	['predisposing', 'activeCancer', 'active cancer'],
	['predisposing', 'paralysisOrImmobilisation', 'paralysis / immobilisation'],
	['predisposing', 'recentlyBedriddenOrSurgery', 'recently bedridden or major surgery'],
	['examination', 'localisedTenderness', 'localised deep-vein tenderness'],
	['examination', 'entireLegSwollen', 'entire leg swollen'],
	['examination', 'calfSwellingOver3cm', 'calf swelling >= 3 cm'],
	['examination', 'pittingOedema', 'pitting oedema'],
	['examination', 'collateralSuperficialVeins', 'collateral superficial veins'],
	['predisposing', 'previouslyDocumentedDvt', 'previously documented DVT'],
	['alternative', 'alternativeDiagnosisAsLikely', 'alternative diagnosis at least as likely']
];

/**
 * Detect clinician-facing safety flags (red flags), independent of the Wells
 * total (spec §5):
 *
 *   - DVT likely — image (high)      — wellsScore >= 2
 *   - DVT unlikely — D-dimer (medium)— wellsScore <= 1
 *   - Active cancer (high)           — activeCancer == 'yes'
 *   - Previous DVT (medium)          — previouslyDocumentedDvt == 'yes'
 *   - Incomplete assessment (low)    — any of the ten criterion inputs blank
 *
 * Rows mirror the `wells_score_for_deep_vein_thrombosis_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, wellsScore: number): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	// ─── DVT likely — image (HIGH) ──────────────────────────────
	if (wellsScore >= 2) {
		flags.push({
			id: 'F-DVT-LIKELY-ULTRASOUND-001',
			category: 'dvt-likely-ultrasound',
			priority: 'high',
			description: `DVT likely (Wells score ${wellsScore}) — offer a proximal leg vein ultrasound, ideally within 4 hours`,
			suggestedAction:
				'Arrange a proximal leg vein ultrasound. If it cannot be done within 4 hours, offer a D-dimer test and interim anticoagulation, then scan within 24 hours.'
		});
	}

	// ─── DVT unlikely — D-dimer (MEDIUM) ────────────────────────
	if (wellsScore <= 1) {
		flags.push({
			id: 'F-DVT-UNLIKELY-D-DIMER-001',
			category: 'dvt-unlikely-d-dimer',
			priority: 'medium',
			description: `DVT unlikely (Wells score ${wellsScore}) — offer a D-dimer test with a result available within 4 hours`,
			suggestedAction:
				'Offer a D-dimer test (or interim anticoagulation if the result is not available within 4 hours). A negative D-dimer effectively excludes DVT; a positive D-dimer triggers a proximal leg vein ultrasound.'
		});
	}

	// ─── Active cancer (HIGH) ───────────────────────────────────
	if (data.predisposing.activeCancer === 'yes') {
		flags.push({
			id: 'F-ACTIVE-CANCER-001',
			category: 'active-cancer',
			priority: 'high',
			description:
				'Active cancer recorded — malignancy raises venous thromboembolism risk and affects anticoagulation choice',
			suggestedAction:
				'Factor malignancy into anticoagulation selection and consider the occult-cancer context when interpreting results.'
		});
	}

	// ─── Previous DVT (MEDIUM) ──────────────────────────────────
	if (data.predisposing.previouslyDocumentedDvt === 'yes') {
		flags.push({
			id: 'F-PREVIOUS-DVT-001',
			category: 'previous-dvt',
			priority: 'medium',
			description:
				'Previously documented DVT — prior clot may confound the criteria and imaging',
			suggestedAction:
				'Interpret imaging against any known residual thrombus; consider a specialist opinion for recurrent ipsilateral DVT.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	for (const [section, field, label] of CRITERION_INPUTS) {
		const sectionData = data[section] as unknown as Record<string, string>;
		if (sectionData[field] === '') missing.push(label);
	}
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate or overstate probability`,
			suggestedAction: 'Record the missing criterion answer(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
