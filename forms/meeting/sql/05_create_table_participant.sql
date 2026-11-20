-- Participant — one row per invited attendee. Captures role on the
-- invitation, response status, and actual attendance.

CREATE TABLE meeting.participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting.meeting(id) ON DELETE CASCADE,
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
    BEFORE UPDATE ON meeting.participant
    FOR EACH ROW
    EXECUTE FUNCTION meeting.set_updated_at();

COMMENT ON TABLE meeting.participant IS
    'One invited attendee for a meeting. Captures role on the invitation (required/optional/observer), the RSVP response, and the actual attendance status.';
COMMENT ON COLUMN meeting.participant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting.participant.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting.participant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting.participant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting.participant.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN meeting.participant.position IS
    'Zero-based ordinal of the participant in the invitation list.';
COMMENT ON COLUMN meeting.participant.name IS
    'Participant full name.';
COMMENT ON COLUMN meeting.participant.email IS
    'Participant email address.';
COMMENT ON COLUMN meeting.participant.organisation IS
    'Participant organisation or team.';
COMMENT ON COLUMN meeting.participant.role IS
    'Role on the invitation: organizer, chair, required, optional, observer, presenter, note-taker.';
COMMENT ON COLUMN meeting.participant.response_status IS
    'RSVP response: no-response, accepted, declined, tentative, delegated.';
COMMENT ON COLUMN meeting.participant.attendance_status IS
    'Actual attendance: present, late, absent, partial, remote, unknown.';
COMMENT ON COLUMN meeting.participant.notes IS
    'Free-text notes — apologies, delegated representative, partial attendance window.';

CREATE INDEX participant_index_meeting_id
    ON meeting.participant(meeting_id);
CREATE INDEX participant_index_meeting_id_position
    ON meeting.participant(meeting_id, position);
CREATE INDEX participant_index_email
    ON meeting.participant(email);
