// Pure validation engine for the meeting form. Mirrors the
// validateMeeting() rules described in ../AGENTS.md.

function parseDate(value) {
	if (!value) return null;
	const t = new Date(value);
	return isNaN(t.getTime()) ? null : t;
}

function durationMinutes(data) {
	const a = parseDate(data.actualStartAt) || parseDate(data.scheduledStartAt);
	const b = parseDate(data.actualEndAt)   || parseDate(data.scheduledEndAt);
	if (!a || !b) return null;
	const diff = (b - a) / 60000;
	return diff < 0 ? null : Math.round(diff);
}

function rule(ruleId, instrument, grade, category, description) {
	return { ruleId, instrument, grade, category, description };
}

function flag(flagId, category, priority, description, suggestedAction) {
	return { flagId, category, priority, description, suggestedAction };
}

function validateMeeting(data) {
	const participants = data.participants || [];
	const agenda       = data.agenda || [];
	const actions      = data.actionItems || [];
	const outputs      = data.outputs || [];
	const outcomes     = data.outcomes || [];

	const participantCount = participants.length;
	const acceptedCount = participants.filter(
		(p) => p.responseStatus === 'accepted'
	).length;
	const attendedCount = participants.filter(
		(p) => ['present', 'late', 'remote', 'partial'].includes(p.attendanceStatus)
	).length;

	const isCompleted = data.status === 'completed';
	const dMin = durationMinutes(data);

	const firedRules = [];
	const flags = [];

	const summary = (data.summary || '').trim();
	if (summary.length > 250) {
		firedRules.push(rule(
			'R-SUMMARY-OVER-LIMIT', 'summary', 'red', 'data-quality',
			'Summary exceeds the 250-character ceiling (' + summary.length + ').'
		));
		flags.push(flag(
			'F-SUMMARY-OVER-LIMIT', 'summary-over-limit', 'high',
			'Summary is ' + summary.length + ' characters; the spec caps it at 250.',
			'Shorten summary to 250 characters.'
		));
	}

	if (!(data.organizerName || '').trim()) {
		firedRules.push(rule(
			'R-NO-ORGANIZER', 'invitation', 'amber', 'completeness',
			'No organiser identified.'
		));
		flags.push(flag(
			'F-NO-ORGANIZER', 'no-organizer', 'medium',
			'No organiser name supplied.',
			'Add an organiser on step 1.'
		));
	}

	if (participantCount === 0) {
		firedRules.push(rule(
			'R-NO-PARTICIPANTS',
			'participants',
			isCompleted ? 'red' : 'amber',
			'completeness',
			'No participants recorded.'
		));
		if (isCompleted) {
			flags.push(flag(
				'F-NO-PARTICIPANTS', 'no-participants', 'high',
				'Completed meeting has no participants.',
				'Add at least one participant on step 5.'
			));
		}
	}

	if (agenda.length === 0) {
		const grade = isCompleted ? 'red' : 'amber';
		firedRules.push(rule(
			'R-NO-AGENDA', 'agenda', grade, 'completeness',
			'No agenda items.'
		));
		if (isCompleted) {
			flags.push(flag(
				'F-NO-AGENDA', 'no-agenda', 'medium',
				'Completed meeting has no agenda items.',
				'Document what was discussed on step 4.'
			));
		}
	}

	if (isCompleted && outcomes.length === 0) {
		firedRules.push(rule(
			'R-NO-OUTCOMES', 'outcomes', 'amber', 'completeness',
			'Completed meeting recorded no outcomes.'
		));
		flags.push(flag(
			'F-NO-OUTCOMES', 'no-outcomes', 'medium',
			'No outcomes recorded for a completed meeting.',
			'Add at least one outcome on step 9.'
		));
	}

	if (isCompleted && !summary) {
		firedRules.push(rule(
			'R-NO-SUMMARY', 'summary', 'amber', 'completeness',
			'Completed meeting has no summary.'
		));
		flags.push(flag(
			'F-NO-SUMMARY', 'no-summary', 'medium',
			'No summary recorded for a completed meeting.',
			'Write a ≤ 250-character summary on step 8.'
		));
	}

	const start = parseDate(data.scheduledStartAt);
	const end   = parseDate(data.scheduledEndAt);
	if (start && end && end < start) {
		firedRules.push(rule(
			'R-START-AFTER-END', 'invitation', 'red', 'scheduling',
			'Scheduled end precedes scheduled start.'
		));
		flags.push(flag(
			'F-START-AFTER-END', 'start-after-end', 'high',
			'Scheduled end is earlier than scheduled start.',
			'Correct the start / end times on step 3.'
		));
	}

	const freq = data.recurringFrequency;
	const hasRecurrence = freq && freq !== 'none';
	if (hasRecurrence) {
		const hasEnd =
			(data.recurringSeriesCount && Number(data.recurringSeriesCount) > 0) ||
			!!parseDate(data.recurringSeriesUntil);
		if (!hasEnd) {
			firedRules.push(rule(
				'R-RECURRING-WITHOUT-UNTIL', 'recurrence', 'amber', 'scheduling',
				'Recurring rule has neither a count nor an until.'
			));
			flags.push(flag(
				'F-RECURRING-WITHOUT-UNTIL', 'recurring-without-until', 'medium',
				'Open-ended recurring meeting.',
				'Add a series count or series until on step 7.'
			));
		}
	}

	const today = new Date(); today.setHours(0, 0, 0, 0);
	const overdue = actions.filter((a) => {
		if (!a.dueDate) return false;
		if (a.status === 'done' || a.status === 'cancelled') return false;
		const d = parseDate(a.dueDate);
		return d && d < today;
	});
	if (overdue.length > 0) {
		firedRules.push(rule(
			'R-ACTION-ITEM-OVERDUE', 'action-items', 'red', 'follow-up',
			overdue.length + ' overdue action item(s).'
		));
		flags.push(flag(
			'F-ACTION-ITEM-OVERDUE', 'action-item-overdue', 'high',
			overdue.length + ' action item(s) past due.',
			'Chase the owner or reset the due date on step 9.'
		));
	}

	if (participantCount > 0 && acceptedCount / participantCount < 0.5) {
		firedRules.push(rule(
			'R-LOW-ACCEPTANCE-RATE', 'participants', 'amber', 'engagement',
			'Fewer than half of participants accepted.'
		));
		flags.push(flag(
			'F-LOW-ACCEPTANCE-RATE', 'low-acceptance-rate', 'low',
			'Acceptance rate is below 50 % (' + acceptedCount + '/' + participantCount + ').',
			'Confirm with required participants before the meeting.'
		));
	}

	let completionStatus = 'planned';
	if (isCompleted) {
		completionStatus = (outcomes.length > 0 && summary)
			? 'complete' : 'incomplete';
	} else if (data.status === 'in-progress') {
		completionStatus = 'in-progress';
	}

	const overallHealth = flags.some((f) => f.priority === 'high')
		? 'red'
		: (flags.length > 0 ? 'amber' : 'green');

	return {
		durationMinutes: dMin,
		participantCount,
		acceptedCount,
		attendedCount,
		agendaItemCount: agenda.length,
		actionItemCount: actions.length,
		outputCount: outputs.length,
		outcomeCount: outcomes.length,
		completionStatus,
		overallHealth,
		firedRules,
		flags,
	};
}

export { validateMeeting };
