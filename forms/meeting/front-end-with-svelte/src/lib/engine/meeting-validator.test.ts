import { describe, it, expect } from 'vitest';
import { validateMeeting } from './meeting-validator';
import type { MeetingData } from './types';

/** A blank meeting record (mirrors createDefaultMeeting without the store's $app import). */
function createDefaultMeeting(): MeetingData {
	return {
		organizer: { name: '', email: '', role: '', organisation: '', team: '', timezone: '' },
		meta: { status: 'draft', title: '', purpose: '', longDescription: '', category: '', visibility: '' },
		invitation: {
			scheduledStartAt: '',
			scheduledEndAt: '',
			timezone: '',
			location: '',
			videoUrl: '',
			phoneNumber: '',
			dialInCode: '',
			joiningInstructions: '',
			calendarUid: ''
		},
		agenda: [],
		participants: [],
		resources: [],
		recurrence: {
			frequency: 'none',
			intervalCount: 1,
			byDayOfWeek: '',
			byDayOfMonth: '',
			bySetPosition: '',
			byMonthOfYear: '',
			seriesCount: null,
			seriesUntil: ''
		},
		summary: { summary: '', actualStartAt: '', actualEndAt: '' },
		results: { actionItems: [], outputs: [], outcomes: [] },
		signoff: { overallResult: '', additionalNotes: '', signedByName: '', signedAt: '' }
	};
}

/** A well-formed completed meeting: organiser, agenda, participants, outcomes, summary. */
function goodCompletedMeeting(): MeetingData {
	const d = createDefaultMeeting();
	d.organizer.name = 'Alex Organiser';
	d.meta.status = 'completed';
	d.meta.title = 'Weekly stand-up';
	d.invitation.scheduledStartAt = '2026-06-01T09:00';
	d.invitation.scheduledEndAt = '2026-06-01T09:30';
	d.summary.summary = 'Team aligned on sprint goals.';
	d.agenda = [{ title: 'Updates', durationMinutes: 15, presenter: 'Alex', notes: '', status: 'discussed' }];
	d.participants = [
		{ name: 'Alex', email: '', role: 'organizer', responseStatus: 'accepted', attendanceStatus: 'present' },
		{ name: 'Sam', email: '', role: 'required', responseStatus: 'accepted', attendanceStatus: 'present' }
	];
	d.results.outcomes = [
		{ title: 'Sprint aligned', category: 'alignment-achieved', impact: 'medium', description: '' }
	];
	return d;
}

describe('Meeting validation engine', () => {
	it('returns green health and no flags for a clean completed meeting', () => {
		const result = validateMeeting(goodCompletedMeeting());
		expect(result.overallHealth).toBe('green');
		expect(result.flags).toHaveLength(0);
		expect(result.completionStatus).toBe('complete');
		expect(result.participantCount).toBe(2);
		expect(result.acceptedCount).toBe(2);
		expect(result.attendedCount).toBe(2);
		expect(result.agendaItemCount).toBe(1);
		expect(result.outcomeCount).toBe(1);
	});

	it('computes duration from scheduled times when no actual times', () => {
		const result = validateMeeting(goodCompletedMeeting());
		expect(result.durationMinutes).toBe(30);
	});

	it('prefers actual times over scheduled times for duration', () => {
		const d = goodCompletedMeeting();
		d.summary.actualStartAt = '2026-06-01T09:05';
		d.summary.actualEndAt = '2026-06-01T09:50';
		const result = validateMeeting(d);
		expect(result.durationMinutes).toBe(45);
	});

	it('flags a summary over the 250-character ceiling (high, red)', () => {
		const d = goodCompletedMeeting();
		d.summary.summary = 'x'.repeat(260);
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-SUMMARY-OVER-LIMIT' && r.grade === 'red')).toBe(true);
		expect(result.flags.some((f) => f.flagId === 'F-SUMMARY-OVER-LIMIT')).toBe(true);
		expect(result.overallHealth).toBe('red');
	});

	it('flags a missing organiser (amber, medium)', () => {
		const d = goodCompletedMeeting();
		d.organizer.name = '';
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-NO-ORGANIZER')).toBe(true);
		expect(result.flags.some((f) => f.flagId === 'F-NO-ORGANIZER')).toBe(true);
	});

	it('escalates missing participants to red on a completed meeting', () => {
		const d = goodCompletedMeeting();
		d.participants = [];
		const result = validateMeeting(d);
		const fired = result.firedRules.find((r) => r.ruleId === 'R-NO-PARTICIPANTS');
		expect(fired?.grade).toBe('red');
		expect(result.flags.some((f) => f.flagId === 'F-NO-PARTICIPANTS' && f.priority === 'high')).toBe(true);
		expect(result.overallHealth).toBe('red');
	});

	it('flags scheduled end before scheduled start', () => {
		const d = goodCompletedMeeting();
		d.invitation.scheduledStartAt = '2026-06-01T10:00';
		d.invitation.scheduledEndAt = '2026-06-01T09:00';
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-START-AFTER-END')).toBe(true);
	});

	it('flags an open-ended recurring meeting (no count, no until)', () => {
		const d = goodCompletedMeeting();
		d.recurrence.frequency = 'weekly';
		d.recurrence.seriesCount = null;
		d.recurrence.seriesUntil = '';
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-RECURRING-WITHOUT-UNTIL')).toBe(true);
	});

	it('does not flag a recurring meeting that has a series until', () => {
		const d = goodCompletedMeeting();
		d.recurrence.frequency = 'weekly';
		d.recurrence.seriesUntil = '2026-12-31';
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-RECURRING-WITHOUT-UNTIL')).toBe(false);
	});

	it('flags overdue open action items (red, high)', () => {
		const d = goodCompletedMeeting();
		d.results.actionItems = [
			{ title: 'Send notes', ownerName: 'Sam', dueDate: '2020-01-01', priority: 'high', status: 'open' }
		];
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-ACTION-ITEM-OVERDUE')).toBe(true);
		expect(result.openActionCount).toBe(1);
		expect(result.overallHealth).toBe('red');
	});

	it('does not flag a done action item even if past due', () => {
		const d = goodCompletedMeeting();
		d.results.actionItems = [
			{ title: 'Send notes', ownerName: 'Sam', dueDate: '2020-01-01', priority: 'high', status: 'done' }
		];
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-ACTION-ITEM-OVERDUE')).toBe(false);
		expect(result.openActionCount).toBe(0);
	});

	it('flags a low acceptance rate (low priority, amber health)', () => {
		const d = goodCompletedMeeting();
		d.participants = [
			{ name: 'A', email: '', role: 'required', responseStatus: 'accepted', attendanceStatus: 'present' },
			{ name: 'B', email: '', role: 'required', responseStatus: 'declined', attendanceStatus: 'absent' },
			{ name: 'C', email: '', role: 'required', responseStatus: 'no-response', attendanceStatus: 'unknown' }
		];
		const result = validateMeeting(d);
		expect(result.firedRules.some((r) => r.ruleId === 'R-LOW-ACCEPTANCE-RATE')).toBe(true);
		expect(result.overallHealth).toBe('amber');
	});

	it('reports completion status of planned for a draft meeting', () => {
		const d = createDefaultMeeting();
		const result = validateMeeting(d);
		expect(result.completionStatus).toBe('planned');
	});

	it('reports incomplete for a completed meeting missing summary and outcomes', () => {
		const d = createDefaultMeeting();
		d.meta.status = 'completed';
		d.organizer.name = 'Alex';
		d.agenda = [{ title: 'x', durationMinutes: null, presenter: '', notes: '', status: '' }];
		d.participants = [
			{ name: 'A', email: '', role: 'required', responseStatus: 'accepted', attendanceStatus: 'present' }
		];
		const result = validateMeeting(d);
		expect(result.completionStatus).toBe('incomplete');
	});
});
