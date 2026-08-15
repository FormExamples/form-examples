import type { MeetingData, Health } from '#lib/engine/types.js';
import { validateMeeting } from '#lib/engine/meeting-validator.js';
import { createDefaultMeeting } from '#lib/stores/meeting.svelte.js';

/** A sample meeting: an identifier and the full data the engine validates. */
export interface SampleMeeting {
	id: string;
	title: string;
	organizerName: string;
	data: MeetingData;
}

/** A row in the meeting dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	title: string;
	organizerName: string;
	category: string;
	scheduledStart: string;
	durationMinutes: number | null;
	acceptance: string;
	openActions: number;
	outcomeCount: number;
	status: string;
	overallResult: string;
	health: Health;
}

/** A clean, well-formed completed meeting — green health. */
function healthy(): MeetingData {
	const d = createDefaultMeeting();
	d.organizer = { ...d.organizer, name: 'Dana Lee', email: 'dana@example.com', role: 'Scrum master', organisation: 'Acme', team: 'Platform', timezone: 'Europe/London' };
	d.meta = { ...d.meta, status: 'completed', title: 'Sprint 24 planning', purpose: 'Plan the next sprint', category: 'planning', visibility: 'internal' };
	d.invitation = { ...d.invitation, scheduledStartAt: '2026-06-22T09:00', scheduledEndAt: '2026-06-22T10:00', timezone: 'Europe/London', location: 'Room A', videoUrl: 'https://meet.example.com/sprint24' };
	d.agenda = [
		{ title: 'Review backlog', durationMinutes: 20, presenter: 'Dana', notes: '', status: 'discussed' },
		{ title: 'Commit to sprint', durationMinutes: 30, presenter: 'Team', notes: '', status: 'discussed' }
	];
	d.participants = [
		{ name: 'Dana Lee', email: 'dana@example.com', role: 'organizer', responseStatus: 'accepted', attendanceStatus: 'present' },
		{ name: 'Ravi Shah', email: 'ravi@example.com', role: 'required', responseStatus: 'accepted', attendanceStatus: 'present' },
		{ name: 'Mei Chen', email: 'mei@example.com', role: 'required', responseStatus: 'accepted', attendanceStatus: 'remote' }
	];
	d.summary.summary = 'Backlog reviewed and the team committed to 24 points for the sprint.';
	d.results.outcomes = [
		{ title: 'Sprint committed', category: 'commitment', impact: 'high', description: '24 points agreed' }
	];
	d.results.outputs = [{ title: 'Sprint board', kind: 'document', url: '', ownerName: 'Dana' }];
	d.signoff = { ...d.signoff, overallResult: 'productive', signedByName: 'Dana Lee', signedAt: '2026-06-22' };
	return d;
}

/** A scheduled meeting with advisory issues — amber health. */
function advisory(): MeetingData {
	const d = createDefaultMeeting();
	d.organizer = { ...d.organizer, name: 'Sam Patel', email: 'sam@example.com', role: 'Project manager', organisation: 'Acme', team: 'Delivery' };
	d.meta = { ...d.meta, status: 'scheduled', title: 'Quarterly business review', purpose: 'Review Q2 performance', category: 'review', visibility: 'confidential' };
	d.invitation = { ...d.invitation, scheduledStartAt: '2026-07-01T13:00', scheduledEndAt: '2026-07-01T14:30', location: 'Boardroom' };
	d.agenda = [{ title: 'Q2 numbers', durationMinutes: 45, presenter: 'Sam', notes: '', status: 'planned' }];
	// Low acceptance rate: 1 of 3 accepted -> amber advisory flag.
	d.participants = [
		{ name: 'Sam Patel', email: 'sam@example.com', role: 'organizer', responseStatus: 'accepted', attendanceStatus: 'unknown' },
		{ name: 'Jordan Kim', email: 'jordan@example.com', role: 'required', responseStatus: 'no-response', attendanceStatus: 'unknown' },
		{ name: 'Pat Ng', email: 'pat@example.com', role: 'optional', responseStatus: 'tentative', attendanceStatus: 'unknown' }
	];
	// Open-ended recurrence -> amber advisory flag.
	d.recurrence = { ...d.recurrence, frequency: 'quarterly', intervalCount: 1, seriesCount: null, seriesUntil: '' };
	return d;
}

/** A completed meeting with blocking issues — red health (overdue + missing). */
function actionRequired(): MeetingData {
	const d = createDefaultMeeting();
	d.organizer = { ...d.organizer, name: 'Lee Brooks', email: 'lee@example.com', role: 'Team lead', organisation: 'Acme', team: 'Support' };
	d.meta = { ...d.meta, status: 'completed', title: 'Incident retro', purpose: 'Review the outage', category: 'review', visibility: 'internal' };
	d.invitation = { ...d.invitation, scheduledStartAt: '2026-06-10T16:00', scheduledEndAt: '2026-06-10T17:00' };
	d.summary.summary = 'Outage root cause identified; remediation owners assigned.';
	d.agenda = [{ title: 'Timeline', durationMinutes: 30, presenter: 'Lee', notes: '', status: 'discussed' }];
	d.participants = [
		{ name: 'Lee Brooks', email: 'lee@example.com', role: 'organizer', responseStatus: 'accepted', attendanceStatus: 'present' },
		{ name: 'Chris Roy', email: 'chris@example.com', role: 'required', responseStatus: 'accepted', attendanceStatus: 'present' }
	];
	// Overdue open action item -> red blocking flag.
	d.results.actionItems = [
		{ title: 'Publish postmortem', ownerName: 'Chris Roy', dueDate: '2026-06-15', priority: 'high', status: 'open' },
		{ title: 'Add alerting', ownerName: 'Lee Brooks', dueDate: '2026-06-30', priority: 'medium', status: 'in-progress' }
	];
	d.results.outcomes = [
		{ title: 'Root cause found', category: 'risk-identified', impact: 'high', description: 'Config drift' }
	];
	d.signoff = { ...d.signoff, overallResult: 'partial', signedByName: 'Lee Brooks', signedAt: '2026-06-10' };
	return d;
}

/** A sparse draft — red health (no organiser, no participants, no agenda). */
function draft(): MeetingData {
	const d = createDefaultMeeting();
	d.meta = { ...d.meta, status: 'completed', title: 'Ad-hoc sync', category: 'one-to-one' };
	d.invitation = { ...d.invitation, scheduledStartAt: '2026-06-25T11:00', scheduledEndAt: '2026-06-25T11:15' };
	return d;
}

/** The sample meetings, keyed by stable id (used to seed the wizard). */
export const sampleMeetings: SampleMeeting[] = [
	{ id: 'MTG-2026-0001', title: 'Sprint 24 planning', organizerName: 'Dana Lee', data: healthy() },
	{ id: 'MTG-2026-0002', title: 'Quarterly business review', organizerName: 'Sam Patel', data: advisory() },
	{ id: 'MTG-2026-0003', title: 'Incident retro', organizerName: 'Lee Brooks', data: actionRequired() },
	{ id: 'MTG-2026-0004', title: 'Ad-hoc sync', organizerName: '', data: draft() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleMeetingRows: DashboardRow[] = sampleMeetings.map((s) => {
	const v = validateMeeting(s.data);
	return {
		id: s.id,
		title: s.data.meta.title || s.title,
		organizerName: s.data.organizer.name || '—',
		category: s.data.meta.category,
		scheduledStart: s.data.invitation.scheduledStartAt,
		durationMinutes: v.durationMinutes,
		acceptance: `${v.acceptedCount}/${v.participantCount}`,
		openActions: v.openActionCount,
		outcomeCount: v.outcomeCount,
		status: s.data.meta.status || 'draft',
		overallResult: s.data.signoff.overallResult,
		health: v.overallHealth
	};
});
