// Flagged-issue detection (safety-escalation flags). Computed independently of
// the aggregate risk band (which the grader produces), this module raises
// clinician-facing safety flags per spec §5. Rule/category IDs are shared with
// the HTML front-end and the Loco back-end, mirroring the
// `modified_early_warning_score_grade_flag` SQL table:
//
//   - aggregate-escalation (high)     — mewsScore >= 5
//   - single-parameter-3 (high)       — any single parameter subscore == 3
//   - deteriorating-trend (high)      — previousMewsScore != null && mewsScore > previous
//   - hypotension (high)              — systolic BP <= 100 mmHg
//   - reduced-consciousness (high)    — AVPU is voice / pain / unresponsive
//   - tachypnoea-bradypnoea (medium)  — respiratory rate >= 21 or < 9
//   - tachycardia-bradycardia (medium)— heart rate >= 111 or <= 40
//   - pyrexia-hypothermia (medium)    — temperature >= 38.5 or < 35.0
//   - incomplete-observation (low)    — any of the five parameter inputs missing

import type { AssessmentData, Subscores, FlaggedIssue, Avpu } from './types';

/** AVPU level-of-consciousness label (local copy to keep this module standalone). */
function avpuLabel(avpu: Avpu): string {
	switch (avpu) {
		case 'alert':
			return 'Alert';
		case 'voice':
			return 'responds to voice';
		case 'pain':
			return 'responds to pain';
		case 'unresponsive':
			return 'unresponsive';
		default:
			return '';
	}
}

export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { subscores: Subscores; mewsScore: number; singleParameterTrigger: boolean }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const { subscores, mewsScore, singleParameterTrigger } = grade;

	const sbp = data.bloodPressure.systolicBloodPressure;
	const hr = data.heartRate.heartRate;
	const rr = data.respiratory.respiratoryRate;
	const temp = data.temperature.temperature;
	const avpu = data.consciousness.avpu;
	const previous = data.summary.previousMewsScore;

	// ─── Aggregate escalation (HIGH) ────────────────────────────
	if (mewsScore >= 5) {
		flags.push({
			id: 'F-AGGREGATE-ESCALATION-001',
			category: 'aggregate-escalation',
			priority: 'high',
			description: `High-risk aggregate MEWS ${mewsScore} of 14 (at or above the escalation threshold of 5).`,
			suggestedAction:
				'Obtain urgent medical review, consider critical-care outreach, and start continuous monitoring.'
		});
	}

	// ─── Single-parameter trigger (HIGH) ────────────────────────
	if (singleParameterTrigger) {
		const which: string[] = [];
		if (subscores.systolicBloodPressure === 3) which.push('systolic blood pressure');
		if (subscores.heartRate === 3) which.push('heart rate');
		if (subscores.respiratoryRate === 3) which.push('respiratory rate');
		if (subscores.avpu === 3) which.push('consciousness');
		flags.push({
			id: 'F-SINGLE-PARAMETER-3-001',
			category: 'single-parameter-3',
			priority: 'high',
			description: `A single parameter scored the maximum 3 (${which.join(', ')}) — critical single-axis derangement.`,
			suggestedAction:
				'Urgent medical review is warranted regardless of the aggregate; escalate now.'
		});
	}

	// ─── Deteriorating trend (HIGH) ─────────────────────────────
	if (previous !== null && previous !== undefined && mewsScore > previous) {
		flags.push({
			id: 'F-DETERIORATING-TREND-001',
			category: 'deteriorating-trend',
			priority: 'high',
			description: `Aggregate rose from ${previous} to ${mewsScore} across observation sets — deteriorating trend.`,
			suggestedAction:
				'Escalate even within the same band; increase observation frequency and review the trajectory.'
		});
	}

	// ─── Hypotension (HIGH) ─────────────────────────────────────
	if (sbp !== null && sbp <= 100) {
		flags.push({
			id: 'F-HYPOTENSION-001',
			category: 'hypotension',
			priority: 'high',
			description: `Systolic blood pressure ${sbp} mmHg at or below 100 mmHg — risk of shock.`,
			suggestedAction:
				'Reassess perfusion, consider fluid resuscitation and continuous blood-pressure monitoring.'
		});
	}

	// ─── Reduced consciousness (HIGH) ───────────────────────────
	if (avpu === 'voice' || avpu === 'pain' || avpu === 'unresponsive') {
		flags.push({
			id: 'F-REDUCED-CONSCIOUSNESS-001',
			category: 'reduced-consciousness',
			priority: 'high',
			description: `Level of consciousness reduced (${avpuLabel(avpu)}) — not alert.`,
			suggestedAction:
				'Assess airway and neurology, check glucose, and consider causes of reduced consciousness.'
		});
	}

	// ─── Tachypnoea / bradypnoea (MEDIUM) ───────────────────────
	if (rr !== null && (rr >= 21 || rr < 9)) {
		const kind = rr < 9 ? 'Bradypnoea' : 'Tachypnoea';
		flags.push({
			id: 'F-TACHYPNOEA-BRADYPNOEA-001',
			category: 'tachypnoea-bradypnoea',
			priority: 'medium',
			description: `${kind}: respiratory rate ${rr} breaths/min outside the 9-20 range.`,
			suggestedAction:
				'Check oxygen saturation and work of breathing; consider respiratory support.'
		});
	}

	// ─── Tachycardia / bradycardia (MEDIUM) ─────────────────────
	if (hr !== null && (hr >= 111 || hr <= 40)) {
		const kind = hr <= 40 ? 'Bradycardia' : 'Tachycardia';
		flags.push({
			id: 'F-TACHYCARDIA-BRADYCARDIA-001',
			category: 'tachycardia-bradycardia',
			priority: 'medium',
			description: `${kind}: heart rate ${hr} bpm outside the 41-110 range.`,
			suggestedAction:
				'Obtain a rhythm strip / ECG and review perfusion; treat the underlying cause.'
		});
	}

	// ─── Pyrexia / hypothermia (MEDIUM) ─────────────────────────
	if (temp !== null && (temp >= 38.5 || temp < 35.0)) {
		const kind = temp < 35.0 ? 'Hypothermia' : 'Pyrexia';
		flags.push({
			id: 'F-PYREXIA-HYPOTHERMIA-001',
			category: 'pyrexia-hypothermia',
			priority: 'medium',
			description: `${kind}: temperature ${temp} °C outside the 35.0-38.4 °C range.`,
			suggestedAction:
				'Consider infection / sepsis screen and active warming or cooling as appropriate.'
		});
	}

	// ─── Incomplete observation set (LOW) ───────────────────────
	const missing: string[] = [];
	if (sbp === null) missing.push('systolic blood pressure');
	if (hr === null) missing.push('heart rate');
	if (rr === null) missing.push('respiratory rate');
	if (temp === null) missing.push('temperature');
	if (avpu === '') missing.push('level of consciousness (AVPU)');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-OBSERVATION-001',
			category: 'incomplete-observation',
			priority: 'low',
			description: `Missing parameter input(s): ${missing.join(', ')} — the aggregate may understate risk.`,
			suggestedAction: 'Record the missing bedside observation(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
