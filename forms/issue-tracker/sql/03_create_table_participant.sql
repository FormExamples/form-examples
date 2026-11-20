-- Participant is anyone involved with the issue who is not the original reporter:
-- discoverer, affected user, assignee, stakeholder to inform.
-- One participant row per (issue, person, role) tuple.

CREATE TABLE issue_tracker.participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    role VARCHAR(50) NOT NULL DEFAULT '' CHECK (role IN (
        'discoverer', 'affected-user', 'assignee', 'reviewer',
        'stakeholder', 'subject-matter-expert', 'manager', 'on-call',
        'observer', 'witness', 'other', ''
    )),
    organisation VARCHAR(255) NOT NULL DEFAULT '',
    team VARCHAR(255) NOT NULL DEFAULT '',
    notify_on VARCHAR(50) NOT NULL DEFAULT '' CHECK (notify_on IN (
        'all-changes', 'priority-change', 'flag-fired', 'resolution',
        'sign-off', 'never', ''
    ))
);

CREATE TRIGGER trigger_participant_updated_at
    BEFORE UPDATE ON issue_tracker.participant
    FOR EACH ROW
    EXECUTE FUNCTION issue_tracker.set_updated_at();

COMMENT ON TABLE issue_tracker.participant IS
    'A person involved with an issue. Multiple roles per person allowed via duplicate rows.';
COMMENT ON COLUMN issue_tracker.participant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN issue_tracker.participant.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN issue_tracker.participant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN issue_tracker.participant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN issue_tracker.participant.name IS
    'Participant full name.';
COMMENT ON COLUMN issue_tracker.participant.email IS
    'Participant email address for notifications.';
COMMENT ON COLUMN issue_tracker.participant.phone IS
    'Participant phone number for notifications.';
COMMENT ON COLUMN issue_tracker.participant.role IS
    'Participant role on this issue: discoverer, affected-user, assignee, etc.';
COMMENT ON COLUMN issue_tracker.participant.organisation IS
    'Organisation the participant belongs to.';
COMMENT ON COLUMN issue_tracker.participant.team IS
    'Team or department within the organisation.';
COMMENT ON COLUMN issue_tracker.participant.notify_on IS
    'Notification preference: all-changes, priority-change, flag-fired, resolution, sign-off, or never.';
