import type { AssessmentData, Category, FlaggedIssue } from './types';
import { RAPID_GROWTH_CM } from './aaa-rules';

/**
 * Detect clinician-facing safety flags (red flags), independent of the diameter
 * category (which the grader produces) (spec §5):
 *
 *   - Vascular referral (high)      — category == 'large' (>= 5.5 cm)
 *   - Symptomatic aneurysm (high)   — symptomatic == 'yes' with any aneurysm present
 *   - Rapid growth (high)           — growthCm >= 1.0 over ~12 months
 *   - Non-visualised aorta (medium) — aortaVisualised == 'no' or diameter == null
 *   - Incomplete assessment (low)   — required context / consent / measurement fields missing
 *
 * Rows mirror the `abdominal_aortic_aneurysm_screening_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { category: Category; growthCm: number | null }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const { category, growthCm } = grade;
	const diameter = data.measurement.maxAorticDiameterCm;
	const visualised = data.measurement.aortaVisualised;
	const symptomatic = data.observations.symptomatic;
	const aneurysmPresent = category === 'small' || category === 'medium' || category === 'large';

	// ─── Vascular referral (HIGH) ───────────────────────────────
	if (category === 'large') {
		flags.push({
			id: 'F-VASCULAR-REFERRAL-001',
			category: 'vascular-referral',
			priority: 'high',
			description: `Large aneurysm${diameter !== null ? ` (${diameter} cm)` : ''} at or above the 5.5 cm referral threshold`,
			suggestedAction:
				'Refer to vascular surgery for assessment and consideration of elective repair.'
		});
	}

	// ─── Symptomatic aneurysm (HIGH) ────────────────────────────
	if (symptomatic === 'yes' && aneurysmPresent) {
		flags.push({
			id: 'F-SYMPTOMATIC-ANEURYSM-001',
			category: 'symptomatic-aneurysm',
			priority: 'high',
			description:
				'Aneurysm present with abdominal / back pain or tenderness — possible tender, expanding, or ruptured aneurysm',
			suggestedAction:
				'Arrange emergency vascular assessment now; do not wait for routine referral.'
		});
	}

	// ─── Rapid growth (HIGH) ────────────────────────────────────
	if (growthCm !== null && growthCm >= RAPID_GROWTH_CM) {
		flags.push({
			id: 'F-RAPID-GROWTH-001',
			category: 'rapid-growth',
			priority: 'high',
			description: `Growth of ${growthCm} cm since the prior scan (at or above the ${RAPID_GROWTH_CM.toFixed(1)} cm rapid-growth threshold) — accelerated expansion`,
			suggestedAction:
				'Consider expediting referral to vascular surgery even if the current diameter is below 5.5 cm.'
		});
	}

	// ─── Non-visualised aorta (MEDIUM) ──────────────────────────
	if (visualised === 'no' || diameter === null || diameter === undefined) {
		flags.push({
			id: 'F-NON-VISUALISED-001',
			category: 'non-visualised',
			priority: 'medium',
			description: 'Aorta not adequately measured — the result cannot be classified as normal',
			suggestedAction:
				'Arrange a re-scan; consider bowel-gas preparation or an alternative operator.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	if (!data.context.technicianName) missing.push('technician name');
	if (data.consent.consentGiven !== 'yes') missing.push('informed consent');
	if (visualised === '') missing.push('aorta-visualised outcome');
	if (visualised === 'yes' && (diameter === null || diameter === undefined)) {
		missing.push('maximum aortic diameter');
	}
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing required field(s): ${missing.join(', ')} — the record cannot be finalised`,
			suggestedAction: 'Complete the missing field(s) before sign-off.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
