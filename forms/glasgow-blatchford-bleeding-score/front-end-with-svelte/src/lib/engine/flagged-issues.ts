import type { AssessmentData, FlaggedIssue, GradingResult } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the total
 * Glasgow-Blatchford score (spec §5):
 *
 *   - High-risk bleed (high)      — gbsScore >= 6
 *   - Shock / hypotension (high)  — systolicBloodPressure < 90 or pulse >= 100
 *   - Severe anaemia (high)       — haemoglobin < 100
 *   - Syncope (medium)            — syncope == 'yes'
 *   - Very low risk (info)        — gbsScore == 0 (consider discharge)
 *   - Incomplete assessment (low) — any parameter input missing or unknown sex
 *
 * Rows mirror the `glasgow_blatchford_bleeding_score_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action). Categories are
 * drawn from the SQL CHECK constraint: high-score-admit, low-risk-discharge,
 * shock, low-hb-transfusion, incomplete, other.
 */
export function detectFlaggedIssues(data: AssessmentData, grade: GradingResult): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const { gbsScore, complete } = grade;
	const sbp = data.haemodynamics.systolicBloodPressure;
	const pulse = data.haemodynamics.pulse;
	const hb = data.labs.haemoglobin;

	const hasSbp = sbp !== null && sbp !== undefined;
	const hasPulse = pulse !== null && pulse !== undefined;
	const hasHb = hb !== null && hb !== undefined;

	// ─── High-risk bleed (HIGH) ──────────────────────────────────
	if (gbsScore >= 6) {
		flags.push({
			id: 'F-HIGH-SCORE-ADMIT-001',
			category: 'high-score-admit',
			priority: 'high',
			description: `Glasgow-Blatchford score ${gbsScore} (>= 6) — high likelihood of needing intervention or transfusion.`,
			suggestedAction:
				'Admit and arrange urgent upper GI endoscopy; resuscitate and involve the GI-bleed team.'
		});
	}

	// ─── Shock / hypotension (HIGH) ──────────────────────────────
	const hypotensive = hasSbp && (sbp as number) < 90;
	const tachycardic = hasPulse && (pulse as number) >= 100;
	if (hypotensive || tachycardic) {
		const bits: string[] = [];
		if (hypotensive) bits.push(`systolic BP ${sbp} mmHg (< 90)`);
		if (tachycardic) bits.push(`pulse ${pulse} beats/min (>= 100)`);
		flags.push({
			id: 'F-SHOCK-001',
			category: 'shock',
			priority: 'high',
			description: `Haemodynamic instability: ${bits.join(' and ')}.`,
			suggestedAction:
				'Resuscitate: IV access, fluids / blood as indicated, and continuous monitoring; escalate to senior review.'
		});
	}

	// ─── Severe anaemia (HIGH) ───────────────────────────────────
	if (hasHb && (hb as number) < 100) {
		flags.push({
			id: 'F-LOW-HB-TRANSFUSION-001',
			category: 'low-hb-transfusion',
			priority: 'high',
			description: `Haemoglobin ${hb} g/L (< 100) — significant anaemia.`,
			suggestedAction:
				'Group and save / cross-match and consider transfusion per local threshold and haemodynamic status.'
		});
	}

	// ─── Syncope (MEDIUM) ────────────────────────────────────────
	if (data.clinicalMarkers.syncope === 'yes') {
		flags.push({
			id: 'F-SYNCOPE-001',
			category: 'other',
			priority: 'medium',
			description: 'Syncope reported — a marker of significant blood loss.',
			suggestedAction:
				'Assess volume status and lying/standing observations; treat as higher-risk pending review.'
		});
	}

	// ─── Very low risk (INFO) ────────────────────────────────────
	if (gbsScore === 0) {
		flags.push({
			id: 'F-LOW-RISK-DISCHARGE-001',
			category: 'low-risk-discharge',
			priority: 'info',
			description: 'Glasgow-Blatchford score 0 — very low risk of needing intervention.',
			suggestedAction:
				'Consider outpatient management / early discharge with planned outpatient review; confirm no other admission indication.'
		});
	}

	// ─── Incomplete assessment (LOW) ─────────────────────────────
	if (!complete) {
		const missing: string[] = [];
		if (data.labs.bloodUrea === null || data.labs.bloodUrea === undefined) missing.push('blood urea');
		if (!hasHb) missing.push('haemoglobin');
		if (!hasSbp) missing.push('systolic blood pressure');
		if (!hasPulse) missing.push('pulse');
		if (!data.clinicalMarkers.melaenaPresent) missing.push('melaena');
		if (!data.clinicalMarkers.syncope) missing.push('syncope');
		if (!data.clinicalMarkers.hepaticDisease) missing.push('hepatic disease');
		if (!data.clinicalMarkers.cardiacFailure) missing.push('cardiac failure');
		if (data.identification.sex === '' || data.identification.sex === 'unknown') {
			missing.push('sex (drives haemoglobin bands)');
		}
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete',
			priority: 'low',
			description: `Missing parameter input(s): ${missing.join(', ')} — the score may understate risk.`,
			suggestedAction:
				'Record the missing parameter(s) and re-score; a Glasgow-Blatchford total is only valid once all eight parameters and sex are recorded.'
		});
	}

	// Sort: high > medium > low > info.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2, info: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
