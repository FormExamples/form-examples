import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the Centor
 * total (spec §5):
 *
 *   - Airway / quinsy red flag (high)   — any airway / peritonsillar input == 'yes'
 *   - Antibiotic consideration (high)   — mcIsaacScore >= 4
 *   - Testing consideration (medium)    — mcIsaacScore is 2 or 3
 *   - Antimicrobial stewardship (low)   — mcIsaacScore <= 1
 *   - Incomplete assessment (low)       — any criterion input or age missing
 *
 * Rows mirror the `centor_score_for_streptococcal_pharyngitis_grade_flag` SQL
 * table (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, mcIsaacScore: number): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const rf = data.redFlags;
	const redFlagInputs: [keyof typeof rf, string][] = [
		['stridorOrBreathingDifficulty', 'stridor or difficulty breathing'],
		['droolingOrCannotSwallow', 'drooling or unable to swallow saliva'],
		['trismus', 'trismus'],
		['muffledVoice', 'muffled ("hot-potato") voice'],
		['unilateralNeckSwelling', 'unilateral neck swelling']
	];
	const presentRedFlags = redFlagInputs
		.filter(([field]) => rf[field] === 'yes')
		.map(([, label]) => label);

	// ─── Airway / quinsy red flag (HIGH) ────────────────────────
	if (presentRedFlags.length > 0) {
		flags.push({
			id: 'F-AIRWAY-QUINSY-001',
			category: 'airway-red-flag',
			priority: 'high',
			description: `Airway / peritonsillar (quinsy) warning feature(s): ${presentRedFlags.join(', ')} — possible peritonsillar abscess or airway compromise`,
			suggestedAction:
				'Arrange urgent same-day assessment irrespective of the Centor/McIsaac score; do not rely on the score to defer review.'
		});
	}

	// ─── Antibiotic consideration (HIGH) ────────────────────────
	if (mcIsaacScore >= 4) {
		flags.push({
			id: 'F-ANTIBIOTIC-CONSIDERATION-001',
			category: 'antibiotic-consideration',
			priority: 'high',
			description: `High modified McIsaac score (${mcIsaacScore}) — high probability of streptococcal infection`,
			suggestedAction:
				'Consider a rapid antigen detection test (RADT) or throat swab, or empirical antibiotics under antimicrobial-stewardship principles (e.g. phenoxymethylpenicillin per local policy), with safety-netting.'
		});
	}

	// ─── Testing consideration (MEDIUM) ─────────────────────────
	if (mcIsaacScore === 2 || mcIsaacScore === 3) {
		flags.push({
			id: 'F-TESTING-CONSIDERATION-001',
			category: 'testing-consideration',
			priority: 'medium',
			description: `Moderate modified McIsaac score (${mcIsaacScore}) — intermediate probability of streptococcal infection`,
			suggestedAction:
				'Consider a rapid antigen detection test (RADT) or throat swab; treat with antibiotics only if positive or clinically indicated.'
		});
	}

	// ─── Antimicrobial stewardship (LOW) ────────────────────────
	if (mcIsaacScore <= 1) {
		flags.push({
			id: 'F-ANTIMICROBIAL-STEWARDSHIP-001',
			category: 'antimicrobial-stewardship',
			priority: 'low',
			description: `Low modified McIsaac score (${mcIsaacScore}) — low probability of streptococcal infection`,
			suggestedAction:
				'Avoid a throat swab and antibiotics; give self-care and safety-netting advice, as most sore throats are viral and self-limiting.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	if (data.exudate.tonsillarExudate === '') missing.push('tonsillar exudate');
	if (data.nodes.tenderAnteriorCervicalNodes === '') missing.push('tender anterior cervical nodes');
	if (data.fever.feverOver38 === '' && data.fever.measuredTemperatureCelsius === null)
		missing.push('fever (history or measured temperature)');
	if (data.cough.absenceOfCough === '') missing.push('absence of cough');
	if (data.identification.ageYears === null) missing.push('patient age');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing input(s): ${missing.join(', ')} — the score may be inaccurate`,
			suggestedAction:
				'Complete the outstanding criterion input(s) and the patient age, then re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
