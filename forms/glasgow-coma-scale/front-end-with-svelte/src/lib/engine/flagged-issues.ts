import type { AssessmentData, FlaggedIssue } from './types';

/** The subset of grader output the flag rules need. */
export interface FlagGradeInput {
	totalScore: number | null;
	motorScore: number | null;
	eyeScore: number | null;
	verbalScore: number | null;
	pupilReactivityScore: number | null;
}

/**
 * Flagged-issue detection (red flags). Independent of the severity band (which
 * the grader produces), this module raises clinician-facing safety flags per
 * spec §5:
 *
 *   - Airway risk (high)          — defined total <= 8 (coma)
 *   - Deteriorating GCS (high)    — total falls >= 2 vs previousTotal, OR motor
 *                                   falls vs previousMotorScore
 *   - Unequal/unreactive pupils (high) — asymmetric reactivity, or either pupil
 *                                   unreactive
 *   - Untestable component (medium) — any component NT (total undefined)
 *   - Falling motor score (medium)  — motor falls vs previousMotorScore while
 *                                   the total is stable (not a >=2 total fall)
 *
 * Rows mirror the `glasgow_coma_scale_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, grade: FlagGradeInput): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const total = grade.totalScore;
	const motor = grade.motorScore;
	const prevTotal = data.trend.previousTotal;
	const prevMotor = data.trend.previousMotorScore;
	const left = data.pupils.leftPupilReactivity;
	const right = data.pupils.rightPupilReactivity;

	const anyNotTestable =
		data.eye.eyeResponse === 'NT' ||
		data.verbal.verbalResponse === 'NT' ||
		data.motor.motorResponse === 'NT';

	const totalFall2 = total !== null && prevTotal !== null && prevTotal - total >= 2;
	const motorFall = motor !== null && prevMotor !== null && motor < prevMotor;

	// ─── Airway risk / coma (HIGH) ──────────────────────────────
	// Only a DEFINED total <= 8 fires; an undefined total never fires this.
	if (total !== null && total <= 8) {
		flags.push({
			id: 'F-AIRWAY-RISK-001',
			category: 'airway-risk',
			priority: 'high',
			description: `GCS ${total} (<= 8) — coma; the patient may be unable to protect the airway`,
			suggestedAction:
				'Consider definitive airway management / intubation and senior escalation.'
		});
	}

	// ─── Deteriorating GCS (HIGH) ───────────────────────────────
	if (totalFall2 || motorFall) {
		const detail = totalFall2
			? `Total GCS fell from ${prevTotal} to ${total} (drop of ${(prevTotal as number) - (total as number)})`
			: `Motor score fell from ${prevMotor} to ${motor}`;
		flags.push({
			id: 'F-DETERIORATING-001',
			category: 'deteriorating',
			priority: 'high',
			description: `${detail} — neurological deterioration`,
			suggestedAction: 'Urgent senior and neurosurgical review; consider CT head imaging.'
		});
	}

	// ─── Unequal or unreactive pupils (HIGH) ────────────────────
	const bothExamined = left !== '' && right !== '';
	const asymmetric = bothExamined && left !== right;
	const eitherUnreactive = left === 'unreactive' || right === 'unreactive';
	if (asymmetric || eitherUnreactive) {
		const detail = asymmetric
			? `Asymmetric pupil reactivity (left ${left || 'not recorded'}, right ${right || 'not recorded'})`
			: 'A pupil is unreactive to light';
		flags.push({
			id: 'F-UNEQUAL-PUPILS-001',
			category: 'unequal-pupils',
			priority: 'high',
			description: `${detail} — suggests raised intracranial pressure or herniation`,
			suggestedAction: 'Urgent CT head and neurosurgical referral.'
		});
	}

	// ─── Untestable component (MEDIUM) ──────────────────────────
	if (anyNotTestable) {
		const which: string[] = [];
		if (data.eye.eyeResponse === 'NT') which.push('eye');
		if (data.verbal.verbalResponse === 'NT') which.push('verbal');
		if (data.motor.motorResponse === 'NT') which.push('motor');
		flags.push({
			id: 'F-UNTESTABLE-COMPONENT-001',
			category: 'untestable-component',
			priority: 'medium',
			description: `Not-testable component(s): ${which.join(', ')} — the numeric total is undefined`,
			suggestedAction:
				'Record the reason for each untestable component and report the breakdown explicitly.'
		});
	}

	// ─── Falling motor score with stable total (MEDIUM) ─────────
	// The most sensitive early sign of deterioration even when the total holds.
	if (motorFall && !totalFall2) {
		flags.push({
			id: 'F-FALLING-MOTOR-001',
			category: 'falling-motor',
			priority: 'medium',
			description: `Motor score fell from ${prevMotor} to ${motor} while the total was stable — early warning of deterioration`,
			suggestedAction:
				'Reassess frequently and escalate; a falling motor score precedes a falling total.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
