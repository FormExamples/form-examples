-- The main meeting record. Holds the invitation, plan-side metadata, and
-- the 250-character results summary. Child tables carry the variable-length
-- collections (agenda_item, participant, resource, recurring_rule,
-- action_item, meeting_output, meeting_outcome).

CREATE TABLE meeting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    organizer_id UUID NOT NULL REFERENCES organizer(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),

    title VARCHAR(255) NOT NULL DEFAULT '',
    purpose VARCHAR(500) NOT NULL DEFAULT '',
    long_description TEXT NOT NULL DEFAULT '',
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'stand-up', 'review', 'planning', 'retrospective',
            'training', 'one-to-one', 'interview', 'governance',
            'multidisciplinary-team', 'social', 'kickoff',
            'all-hands', 'workshop', 'demo', 'other', ''
        )),
    visibility VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (visibility IN ('public', 'internal', 'confidential', 'restricted', '')),

    -- Invitation
    scheduled_start_at TIMESTAMPTZ,
    scheduled_end_at TIMESTAMPTZ,
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    location VARCHAR(255) NOT NULL DEFAULT '',
    video_url VARCHAR(500) NOT NULL DEFAULT '',
    phone_number VARCHAR(64) NOT NULL DEFAULT '',
    dial_in_code VARCHAR(64) NOT NULL DEFAULT '',
    joining_instructions TEXT NOT NULL DEFAULT '',
    calendar_uid VARCHAR(255) NOT NULL DEFAULT '',

    -- Results: summary capped at 250 characters per the seed
    summary VARCHAR(250) NOT NULL DEFAULT ''
        CHECK (char_length(summary) <= 250),

    -- Sign-off
    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,
    overall_result VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (overall_result IN ('productive', 'partial', 'unproductive', 'cancelled', '')),
    additional_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_meeting_updated_at
    BEFORE UPDATE ON meeting
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting IS
    'A meeting record captured via a 10-step single-page wizard. Holds the invitation metadata, the 250-character summary, and the sign-off. Variable-length collections live in child tables.';
COMMENT ON COLUMN meeting.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting.organizer_id IS
    'Foreign key to the organizer who scheduled the meeting.';
COMMENT ON COLUMN meeting.status IS
    'Lifecycle status: draft, scheduled, in-progress, completed, cancelled, no-show.';
COMMENT ON COLUMN meeting.title IS
    'Meeting title shown in calendar invites and dashboards.';
COMMENT ON COLUMN meeting.purpose IS
    'One-sentence purpose statement.';
COMMENT ON COLUMN meeting.long_description IS
    'Free-text long description of the meeting context.';
COMMENT ON COLUMN meeting.category IS
    'Meeting category: stand-up, review, planning, retrospective, training, one-to-one, interview, governance, multidisciplinary-team, social, kickoff, all-hands, workshop, demo, other.';
COMMENT ON COLUMN meeting.visibility IS
    'Information classification: public, internal, confidential, restricted.';
COMMENT ON COLUMN meeting.scheduled_start_at IS
    'Scheduled start timestamp (UTC).';
COMMENT ON COLUMN meeting.scheduled_end_at IS
    'Scheduled end timestamp (UTC).';
COMMENT ON COLUMN meeting.timezone IS
    'IANA timezone identifier the meeting is presented in (e.g. Europe/London).';
COMMENT ON COLUMN meeting.location IS
    'Physical location, room name, or address.';
COMMENT ON COLUMN meeting.video_url IS
    'Video conference URL (Zoom, Teams, Google Meet, Whereby, etc.).';
COMMENT ON COLUMN meeting.phone_number IS
    'Dial-in phone number for audio attendees.';
COMMENT ON COLUMN meeting.dial_in_code IS
    'Dial-in PIN or meeting code for audio attendees.';
COMMENT ON COLUMN meeting.joining_instructions IS
    'Free-text joining instructions — e.g. parking, lobby access, breakout-room links.';
COMMENT ON COLUMN meeting.calendar_uid IS
    'External calendar UID used when round-tripping with iCalendar / Google Calendar / Outlook.';
COMMENT ON COLUMN meeting.summary IS
    'Results section: single paragraph summary, hard-capped at 250 characters per the form specification.';
COMMENT ON COLUMN meeting.actual_start_at IS
    'Actual start timestamp recorded after the meeting.';
COMMENT ON COLUMN meeting.actual_end_at IS
    'Actual end timestamp recorded after the meeting.';
COMMENT ON COLUMN meeting.overall_result IS
    'Sign-off result: productive, partial, unproductive, cancelled.';
COMMENT ON COLUMN meeting.additional_notes IS
    'Free-text additional notes from the organizer at sign-off.';
COMMENT ON COLUMN meeting.signed_by_name IS
    'Name of the person who signed the record.';
COMMENT ON COLUMN meeting.signed_at IS
    'Timestamp the record was signed.';

CREATE INDEX meeting_index_organizer_id
    ON meeting(organizer_id);
CREATE INDEX meeting_index_status
    ON meeting(status);
CREATE INDEX meeting_index_scheduled_start_at
    ON meeting(scheduled_start_at);
CREATE INDEX meeting_index_title_trgm
    ON meeting
    USING GIN (title gin_trgm_ops);
CREATE INDEX meeting_index_summary_trgm
    ON meeting
    USING GIN (summary gin_trgm_ops);
