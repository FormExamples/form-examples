import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Safety-flag detection for the Anaesthetic Record. Emitted INDEPENDENTLY of the
 * completeness status (spec §5). Each flag mirrors a category in the
 * `anaesthetic_record_grade_flag` SQL table, and carries a priority:
 *
 *   - who-checklist-not-done    (high)   — whoSignIn != 'yes' or whoTimeOut != 'yes'
 *   - allergy-conflict          (high)   — a drug matches a documented allergy
 *   - difficult-airway          (high)   — anticipated, or Cormack-Lehane >= 3,
 *                                           or intubation attempts >= 3
 *   - drug-anaphylaxis          (high)   — an anaphylaxis event is logged
 *   - unlogged-consent          (high)   — consentConfirmed != 'yes'
 *   - physiological-derangement (medium) — a timed observation breaches a limit
 *                                           (SpO2 < 92, or systolic BP < 90)
 *   - incomplete                (low)    — one or more non-critical mandatory
 *                                           items missing (mirrors 'partial')
 */

// Physiological limits for the derangement flag (spec §5).
export const SPO2_LOWER_LIMIT = 92;
export const SYSTOLIC_LOWER_LIMIT = 90;

/**
 * Split a free-text documented-allergies string into comparable lowercase
 * terms. Splits on commas, semicolons, slashes, newlines, and the word "and";
 * drops very short tokens (< 3 chars) to avoid spurious substring matches.
 */
export function allergyTerms(text: string): string[] {
	return String(text || '')
		.toLowerCase()
		.split(/[,;/\n]|\band\b/g)
		.map((t) => t.trim())
		.filter((t) => t.length >= 3);
}

/**
 * Detect every safety flag for the supplied record. `noncriticalMissing` comes
 * from the grader and drives the low-priority "incomplete" flag. Order is high →
 * medium → low after a final priority sort.
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	noncriticalMissing: number
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const drugs = data.drugs || [];
	const events = data.events || [];
	const observations = data.observations || [];

	// ─── WHO checklist not done (HIGH) ───────────────────────────
	if (data.preInduction.whoSignIn !== 'yes' || data.preInduction.whoTimeOut !== 'yes') {
		flags.push({
			id: 'F-WHO-CHECKLIST-001',
			category: 'who-checklist-not-done',
			priority: 'high',
			description:
				'WHO Safer Surgery Checklist Sign In / Time Out not recorded as performed.',
			suggestedAction: 'Complete and record the WHO Sign In and Time Out before proceeding.'
		});
	}

	// ─── Allergy conflict (HIGH) ─────────────────────────────────
	const terms = allergyTerms(data.preInduction.documentedAllergies);
	if (terms.length > 0) {
		const conflicts: string[] = [];
		drugs.forEach((d, i) => {
			const name = String(d.drugName || '')
				.toLowerCase()
				.trim();
			if (name && terms.some((t) => name.includes(t))) {
				conflicts.push(d.drugName || `Drug ${i + 1}`);
			}
		});
		if (conflicts.length > 0) {
			flags.push({
				id: 'F-ALLERGY-CONFLICT-001',
				category: 'allergy-conflict',
				priority: 'high',
				description: `Administered drug(s) match a documented allergy: ${conflicts.join(', ')}.`,
				suggestedAction:
					'Confirm the allergy history and review the administered drug(s) urgently.'
			});
		}
	}

	// ─── Difficult airway (HIGH) ─────────────────────────────────
	const cl = data.airway.cormackLehaneGrade;
	const attempts = data.airway.intubationAttempts;
	const difficult =
		data.asaAirway.anticipatedDifficultAirway === 'yes' ||
		(typeof cl === 'number' && cl >= 3) ||
		(typeof attempts === 'number' && attempts >= 3);
	if (difficult) {
		const reasons: string[] = [];
		if (data.asaAirway.anticipatedDifficultAirway === 'yes') {
			reasons.push('anticipated difficult airway');
		}
		if (typeof cl === 'number' && cl >= 3) {
			reasons.push(`Cormack-Lehane grade ${cl}`);
		}
		if (typeof attempts === 'number' && attempts >= 3) {
			reasons.push(`${attempts} intubation attempts`);
		}
		flags.push({
			id: 'F-DIFFICULT-AIRWAY-001',
			category: 'difficult-airway',
			priority: 'high',
			description: `Difficult airway indicated (${reasons.join('; ')}).`,
			suggestedAction:
				'Document a difficult-airway alert and ensure the plan follows DAS guidance.'
		});
	}

	// ─── Drug / anaphylaxis event (HIGH) ─────────────────────────
	const anaphylaxis = events.filter((e) => e.eventType === 'anaphylaxis');
	if (anaphylaxis.length > 0) {
		flags.push({
			id: 'F-ANAPHYLAXIS-001',
			category: 'drug-anaphylaxis',
			priority: 'high',
			description: `${anaphylaxis.length} anaphylaxis / drug-reaction event(s) logged.`,
			suggestedAction:
				'Ensure acute management is documented and refer for allergy investigation.'
		});
	}

	// ─── Unlogged consent (HIGH) ─────────────────────────────────
	if (data.preInduction.consentConfirmed !== 'yes') {
		flags.push({
			id: 'F-UNLOGGED-CONSENT-001',
			category: 'unlogged-consent',
			priority: 'high',
			description: 'Consent not confirmed in the pre-induction checks.',
			suggestedAction: 'Confirm and record valid consent before the anaesthetic proceeds.'
		});
	}

	// ─── Physiological derangement (MEDIUM) ──────────────────────
	const deranged = observations.filter(
		(o) =>
			(typeof o.spo2 === 'number' && o.spo2 < SPO2_LOWER_LIMIT) ||
			(typeof o.systolicBloodPressure === 'number' &&
				o.systolicBloodPressure < SYSTOLIC_LOWER_LIMIT)
	);
	if (deranged.length > 0) {
		flags.push({
			id: 'F-PHYSIOLOGICAL-DERANGEMENT-001',
			category: 'physiological-derangement',
			priority: 'medium',
			description:
				`${deranged.length} timed observation(s) breach a configured limit ` +
				`(SpO2 < ${SPO2_LOWER_LIMIT} % or systolic BP < ${SYSTOLIC_LOWER_LIMIT} mmHg).`,
			suggestedAction:
				'Review the deranged observations and confirm the management is documented.'
		});
	}

	// ─── Incomplete assessment (LOW) ─────────────────────────────
	if (noncriticalMissing > 0) {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description: 'One or more non-critical mandatory items are missing.',
			suggestedAction:
				'Complete the weight, monitoring, fluids, and recovery-destination items.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
