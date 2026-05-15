-- Participant — one row per invited attendee. Captures role on the
-- invitation, response status, and actual attendance.

CREATE TABLE participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),
    name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(320) NOT NULL DEFAULT '',
    organisation VARCHAR(255) NOT NULL DEFAULT '',
    role VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (role IN ('organizer', 'chair', 'required', 'optional', 'observer', 'presenter', 'note-taker', '')),
    response_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (response_status IN ('no-response', 'accepted', 'declined', 'tentative', 'delegated', '')),
    attendance_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (attendance_status IN ('present', 'late', 'absent', 'partial', 'remote', 'unknown', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_participant_updated_at
    BEFORE UPDATE ON participant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE participant IS
    'One invited attendee for a meeting. Captures role on the invitation (required/optional/observer), the RSVP response, and the actual attendance status.';
COMMENT ON COLUMN participant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN participant.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN participant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN participant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN participant.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN participant.position IS
    'Zero-based ordinal of the participant in the invitation list.';
COMMENT ON COLUMN participant.name IS
    'Participant full name.';
COMMENT ON COLUMN participant.email IS
    'Participant email address.';
COMMENT ON COLUMN participant.organisation IS
    'Participant organisation or team.';
COMMENT ON COLUMN participant.role IS
    'Role on the invitation: organizer, chair, required, optional, observer, presenter, note-taker.';
COMMENT ON COLUMN participant.response_status IS
    'RSVP response: no-response, accepted, declined, tentative, delegated.';
COMMENT ON COLUMN participant.attendance_status IS
    'Actual attendance: present, late, absent, partial, remote, unknown.';
COMMENT ON COLUMN participant.notes IS
    'Free-text notes — apologies, delegated representative, partial attendance window.';

CREATE INDEX participant_index_meeting_id
    ON participant(meeting_id);
CREATE INDEX participant_index_meeting_id_position
    ON participant(meeting_id, position);
CREATE INDEX participant_index_email
    ON participant(email);
