import type {
	MeetingData,
	FiredRule,
	ValidationFlag,
	ValidationResult,
	CompletionStatus,
	Health
} from './types';

/** Parse a date/datetime string, returning null for empty or invalid input. */
function parseDate(value: string): Date | null {
	if (!value) return null;
	const t = new Date(value);
	return isNaN(t.getTime()) ? null : t;
}

/** Minutes between actual (preferred) or scheduled start/end; null if unknown. */
function durationMinutes(data: MeetingData): number | null {
	const a = parseDate(data.summary.actualStartAt) || parseDate(data.invitation.scheduledStartAt);
	const b = parseDate(data.summary.actualEndAt) || parseDate(data.invitation.scheduledEndAt);
	if (!a || !b) return null;
	const diff = (b.getTime() - a.getTime()) / 60000;
	return diff < 0 ? null : Math.round(diff);
}

function rule(
	ruleId: string,
	instrument: string,
	grade: 'red' | 'amber',
	category: string,
	description: string
): FiredRule {
	return { ruleId, instrument, grade, category, description };
}

function flag(
	flagId: string,
	category: string,
	priority: 'high' | 'medium' | 'low',
	description: string,
	suggestedAction: string
): ValidationFlag {
	return { flagId, category, priority, description, suggestedAction };
}

/**
 * Pure validation engine for the meeting record. Checks the record for
 * structural problems and produces a list of fired rules and non-blocking
 * flags, plus the counts the dashboard and report display. No side effects.
 */
export function validateMeeting(data: MeetingData): ValidationResult {
	const participants = data.participants ?? [];
	const agenda = data.agenda ?? [];
	const actions = data.results.actionItems ?? [];
	const outputs = data.results.outputs ?? [];
	const outcomes = data.results.outcomes ?? [];

	const participantCount = participants.length;
	const acceptedCount = participants.filter((p) => p.responseStatus === 'accepted').length;
	const attendedCount = participants.filter((p) =>
		['present', 'late', 'remote', 'partial'].includes(p.attendanceStatus)
	).length;

	const isCompleted = data.meta.status === 'completed';
	const dMin = durationMinutes(data);

	const firedRules: FiredRule[] = [];
	const flags: ValidationFlag[] = [];

	const summary = (data.summary.summary ?? '').trim();
	if (summary.length > 250) {
		firedRules.push(
			rule(
				'R-SUMMARY-OVER-LIMIT',
				'summary',
				'red',
				'data-quality',
				`Summary exceeds the 250-character ceiling (${summary.length}).`
			)
		);
		flags.push(
			flag(
				'F-SUMMARY-OVER-LIMIT',
				'summary-over-limit',
				'high',
				`Summary is ${summary.length} characters; the spec caps it at 250.`,
				'Shorten summary to 250 characters.'
			)
		);
	}

	if (!(data.organizer.name ?? '').trim()) {
		firedRules.push(
			rule('R-NO-ORGANIZER', 'invitation', 'amber', 'completeness', 'No organiser identified.')
		);
		flags.push(
			flag(
				'F-NO-ORGANIZER',
				'no-organizer',
				'medium',
				'No organiser name supplied.',
				'Add an organiser on step 1.'
			)
		);
	}

	if (participantCount === 0) {
		firedRules.push(
			rule(
				'R-NO-PARTICIPANTS',
				'participants',
				isCompleted ? 'red' : 'amber',
				'completeness',
				'No participants recorded.'
			)
		);
		if (isCompleted) {
			flags.push(
				flag(
					'F-NO-PARTICIPANTS',
					'no-participants',
					'high',
					'Completed meeting has no participants.',
					'Add at least one participant on step 5.'
				)
			);
		}
	}

	if (agenda.length === 0) {
		firedRules.push(
			rule(
				'R-NO-AGENDA',
				'agenda',
				isCompleted ? 'red' : 'amber',
				'completeness',
				'No agenda items.'
			)
		);
		if (isCompleted) {
			flags.push(
				flag(
					'F-NO-AGENDA',
					'no-agenda',
					'medium',
					'Completed meeting has no agenda items.',
					'Document what was discussed on step 4.'
				)
			);
		}
	}

	if (isCompleted && outcomes.length === 0) {
		firedRules.push(
			rule(
				'R-NO-OUTCOMES',
				'outcomes',
				'amber',
				'completeness',
				'Completed meeting recorded no outcomes.'
			)
		);
		flags.push(
			flag(
				'F-NO-OUTCOMES',
				'no-outcomes',
				'medium',
				'No outcomes recorded for a completed meeting.',
				'Add at least one outcome on step 9.'
			)
		);
	}

	if (isCompleted && !summary) {
		firedRules.push(
			rule('R-NO-SUMMARY', 'summary', 'amber', 'completeness', 'Completed meeting has no summary.')
		);
		flags.push(
			flag(
				'F-NO-SUMMARY',
				'no-summary',
				'medium',
				'No summary recorded for a completed meeting.',
				'Write a 250-character summary on step 8.'
			)
		);
	}

	const start = parseDate(data.invitation.scheduledStartAt);
	const end = parseDate(data.invitation.scheduledEndAt);
	if (start && end && end < start) {
		firedRules.push(
			rule(
				'R-START-AFTER-END',
				'invitation',
				'red',
				'scheduling',
				'Scheduled end precedes scheduled start.'
			)
		);
		flags.push(
			flag(
				'F-START-AFTER-END',
				'start-after-end',
				'high',
				'Scheduled end is earlier than scheduled start.',
				'Correct the start / end times on step 3.'
			)
		);
	}

	const freq = data.recurrence.frequency;
	const hasRecurrence = freq && freq !== 'none';
	if (hasRecurrence) {
		const hasEnd =
			(data.recurrence.seriesCount != null && Number(data.recurrence.seriesCount) > 0) ||
			!!parseDate(data.recurrence.seriesUntil);
		if (!hasEnd) {
			firedRules.push(
				rule(
					'R-RECURRING-WITHOUT-UNTIL',
					'recurrence',
					'amber',
					'scheduling',
					'Recurring rule has neither a count nor an until.'
				)
			);
			flags.push(
				flag(
					'F-RECURRING-WITHOUT-UNTIL',
					'recurring-without-until',
					'medium',
					'Open-ended recurring meeting.',
					'Add a series count or series until on step 7.'
				)
			);
		}
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const overdue = actions.filter((a) => {
		if (!a.dueDate) return false;
		if (a.status === 'done' || a.status === 'cancelled') return false;
		const d = parseDate(a.dueDate);
		return d != null && d < today;
	});
	if (overdue.length > 0) {
		firedRules.push(
			rule(
				'R-ACTION-ITEM-OVERDUE',
				'action-items',
				'red',
				'follow-up',
				`${overdue.length} overdue action item(s).`
			)
		);
		flags.push(
			flag(
				'F-ACTION-ITEM-OVERDUE',
				'action-item-overdue',
				'high',
				`${overdue.length} action item(s) past due.`,
				'Chase the owner or reset the due date on step 9.'
			)
		);
	}

	if (participantCount > 0 && acceptedCount / participantCount < 0.5) {
		firedRules.push(
			rule(
				'R-LOW-ACCEPTANCE-RATE',
				'participants',
				'amber',
				'engagement',
				'Fewer than half of participants accepted.'
			)
		);
		flags.push(
			flag(
				'F-LOW-ACCEPTANCE-RATE',
				'low-acceptance-rate',
				'low',
				`Acceptance rate is below 50% (${acceptedCount}/${participantCount}).`,
				'Confirm with required participants before the meeting.'
			)
		);
	}

	const openActionCount = actions.filter(
		(a) => a.status !== 'done' && a.status !== 'cancelled'
	).length;

	let completionStatus: CompletionStatus = 'planned';
	if (isCompleted) {
		completionStatus = outcomes.length > 0 && summary ? 'complete' : 'incomplete';
	} else if (data.meta.status === 'in-progress') {
		completionStatus = 'in-progress';
	}

	const overallHealth: Health = flags.some((f) => f.priority === 'high')
		? 'red'
		: flags.length > 0
			? 'amber'
			: 'green';

	return {
		durationMinutes: dMin,
		participantCount,
		acceptedCount,
		attendedCount,
		agendaItemCount: agenda.length,
		actionItemCount: actions.length,
		openActionCount,
		outputCount: outputs.length,
		outcomeCount: outcomes.length,
		completionStatus,
		overallHealth,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
