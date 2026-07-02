import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Hours beyond which the rule's acute-injury validation no longer strictly
 * applies (7 days = 168 hours).
 */
const ACUTE_HOURS_LIMIT = 168;

/**
 * The criterion inputs, in wizard order, with a human label for the
 * incomplete-assessment flag. `ageYears` is numeric (null when unanswered); the
 * tenderness / flexion / weight-bearing inputs are yes/no enums ('' when blank).
 */
const CRITERION_INPUTS: [keyof AssessmentData, string, string, 'number' | 'enum'][] = [
	['age', 'ageYears', 'age in years', 'number'],
	['tenderness', 'patellarTenderness', 'patellar tenderness', 'enum'],
	['tenderness', 'otherBonyTenderness', 'other bony tenderness', 'enum'],
	['tenderness', 'fibularHeadTenderness', 'fibular head tenderness', 'enum'],
	['flexion', 'unableToFlex90', 'ability to flex the knee to 90 degrees', 'enum'],
	['weightBearing', 'unableToBearWeight', 'ability to bear weight', 'enum']
];

/**
 * Detect clinician-facing safety flags (red flags), independent of the imaging
 * decision (which the grader produces), per spec §5:
 *
 *   - X-ray indicated (high)          — xrayIndicated == true
 *   - Unable to bear weight (high)    — unableToBearWeight == 'yes'
 *   - Other bony tenderness (medium)  — otherBonyTenderness == 'yes'
 *   - Applicability caution (medium)  — hoursSinceInjury missing, or > 168 (7 days)
 *   - Incomplete assessment (low)     — any criterion input missing
 *
 * Rows mirror the `ottawa_knee_rule_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, xrayIndicated: boolean): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	// ─── X-ray indicated (HIGH) ─────────────────────────────────
	if (xrayIndicated) {
		flags.push({
			id: 'F-XRAY-INDICATED-001',
			category: 'xray-indicated',
			priority: 'high',
			description:
				'One or more Ottawa Knee Rule criteria are present — a knee radiograph is indicated',
			suggestedAction:
				'Obtain a knee radiograph series per local protocol and manage findings accordingly.'
		});
	}

	// ─── Unable to bear weight (HIGH) ───────────────────────────
	if (data.weightBearing.unableToBearWeight === 'yes') {
		flags.push({
			id: 'F-UNABLE-TO-BEAR-WEIGHT-001',
			category: 'unable-to-bear-weight',
			priority: 'high',
			description:
				'Unable to bear weight (cannot take four steps) — consider a clinically significant injury',
			suggestedAction:
				'Provide adequate analgesia, immobilise as appropriate, and prioritise imaging and review.'
		});
	}

	// ─── Other bony tenderness present (MEDIUM) ─────────────────
	if (data.tenderness.otherBonyTenderness === 'yes') {
		flags.push({
			id: 'F-OTHER-BONY-TENDERNESS-001',
			category: 'other-bony-tenderness',
			priority: 'medium',
			description:
				'Bony tenderness beyond the patella recorded — a meaningful finding even though it does not fire the isolated-patellar criterion',
			suggestedAction:
				'Examine and document the site of tenderness; correlate with any imaging obtained on other criteria.'
		});
	}

	// ─── Applicability caution (MEDIUM) ─────────────────────────
	const hours = data.context.hoursSinceInjury;
	if (hours == null) {
		flags.push({
			id: 'F-APPLICABILITY-001',
			category: 'applicability',
			priority: 'medium',
			description:
				'Time since injury not recorded — the Ottawa Knee Rule is validated for acute injury; applicability cannot be confirmed',
			suggestedAction:
				'Record the time since injury and interpret the result with clinical judgement.'
		});
	} else if (hours > ACUTE_HOURS_LIMIT) {
		flags.push({
			id: 'F-APPLICABILITY-002',
			category: 'applicability',
			priority: 'medium',
			description: `Injury is not acute (${hours} hours since injury, over 7 days) — the rule is validated for acute injury; interpret with care`,
			suggestedAction:
				'Interpret the decision with clinical judgement; the rule may not apply outside the acute window.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	for (const [section, field, label, kind] of CRITERION_INPUTS) {
		const sectionData = data[section] as unknown as Record<string, unknown>;
		const v = sectionData[field];
		const blank = kind === 'number' ? v == null : v === '';
		if (blank) missing.push(label);
	}
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete',
			priority: 'low',
			description: `Missing criterion input(s): ${missing.join(', ')} — the decision may understate the need for imaging`,
			suggestedAction: 'Record the missing criterion answer(s) and re-evaluate.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
