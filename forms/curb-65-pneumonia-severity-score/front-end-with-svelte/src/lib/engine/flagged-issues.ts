import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the numeric
 * band the grader produces (spec §5):
 *
 *   - high-severity-admit (high)   — total score >= 3 (severe CAP; hospitalise)
 *   - consider-icu (high)          — total score >= 4 (assess for ICU / HDU)
 *   - hypotension (high)           — systolic < 90 or diastolic <= 60 mmHg
 *   - new-confusion (high)         — new-onset confusion present
 *   - hypoxia (medium)             — advisory SpO2 < 92%
 *   - incomplete-criterion (low)   — one or more criterion inputs missing
 *
 * Rows mirror the `curb_65_pneumonia_severity_score_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { totalScore: number; scoreVariant: string }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const confusionPresent = data.confusion.confusionPresent;
	const ureaMeasured = data.urea.ureaMeasured;
	const ureaMmolL = data.urea.ureaMmolL;
	const rr = data.respiratory.respiratoryRate;
	const sbp = data.bloodPressure.systolicBp;
	const dbp = data.bloodPressure.diastolicBp;
	const ageYears = data.age.ageYears;
	const spo2 = data.adjuncts.oxygenSaturation;

	const totalScore = grade && typeof grade.totalScore === 'number' ? grade.totalScore : 0;
	const variantLabel = grade && grade.scoreVariant === 'crb-65' ? 'CRB-65' : 'CURB-65';

	// ─── High-severity admit (HIGH) ─────────────────────────────
	if (totalScore >= 3) {
		flags.push({
			id: 'F-HIGH-SEVERITY-ADMIT-001',
			category: 'high-severity-admit',
			priority: 'high',
			description: `${variantLabel} score ${totalScore} — high mortality risk; manage as severe community-acquired pneumonia`,
			suggestedAction:
				'Hospitalise and manage as severe CAP: senior review, blood cultures, oxygen, and empirical antibiotics per local policy.'
		});
	}

	// ─── Consider ICU / HDU (HIGH) ──────────────────────────────
	if (totalScore >= 4) {
		flags.push({
			id: 'F-CONSIDER-ICU-001',
			category: 'consider-icu',
			priority: 'high',
			description: `${variantLabel} score ${totalScore} — very high mortality risk`,
			suggestedAction:
				'Assess for intensive-care / high-dependency admission and involve critical care early.'
		});
	}

	// ─── Hypotension (HIGH) ─────────────────────────────────────
	const lowSys = sbp !== null && sbp < 90;
	const lowDia = dbp !== null && dbp <= 60;
	if (lowSys || lowDia) {
		const parts: string[] = [];
		if (lowSys) parts.push(`systolic ${sbp} mmHg (< 90)`);
		if (lowDia) parts.push(`diastolic ${dbp} mmHg (<= 60)`);
		flags.push({
			id: 'F-HYPOTENSION-001',
			category: 'hypotension',
			priority: 'high',
			description: `Hypotension: ${parts.join(' and ')} — risk of shock`,
			suggestedAction:
				'Reassess perfusion, consider fluid resuscitation and continuous blood-pressure monitoring.'
		});
	}

	// ─── New-onset confusion (HIGH) ─────────────────────────────
	if (confusionPresent === 'yes') {
		flags.push({
			id: 'F-NEW-CONFUSION-001',
			category: 'new-confusion',
			priority: 'high',
			description: 'New-onset confusion recorded — possible sepsis or hypoxia',
			suggestedAction:
				'Consider urgent review; assess airway and neurology, check glucose and oxygenation.'
		});
	}

	// ─── Hypoxia (MEDIUM) ───────────────────────────────────────
	if (spo2 !== null && spo2 < 92) {
		flags.push({
			id: 'F-HYPOXIA-001',
			category: 'hypoxia',
			priority: 'medium',
			description: `Oxygen saturation ${spo2}% below the 92% threshold — oxygenation concern independent of the score`,
			suggestedAction:
				'Give controlled oxygen, target saturations per local policy, and consider arterial blood gas.'
		});
	}

	// ─── Incomplete criterion (LOW) ─────────────────────────────
	const missing: string[] = [];
	if (confusionPresent === '') missing.push('confusion');
	// Urea is only "missing" when it was meant to be measured but no value was
	// entered; ureaMeasured === 'no' intentionally omits it (CRB-65 pathway).
	if (ureaMeasured === '') {
		missing.push('urea (measured?)');
	} else if (ureaMeasured === 'yes' && ureaMmolL === null) {
		missing.push('serum urea value');
	}
	if (rr === null) missing.push('respiratory rate');
	if (sbp === null && dbp === null) missing.push('blood pressure');
	if (ageYears === null) missing.push('age');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-CRITERION-001',
			category: 'incomplete-criterion',
			priority: 'low',
			description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate risk`,
			suggestedAction: 'Record the missing input(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
