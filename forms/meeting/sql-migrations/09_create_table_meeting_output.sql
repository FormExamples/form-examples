-- Meeting output — a tangible deliverable produced by the meeting:
-- a document, a decision, a piece of data, a recording.

CREATE TABLE meeting_output (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),

    title VARCHAR(255) NOT NULL DEFAULT '',
    kind VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (kind IN ('document', 'decision', 'data', 'recording', 'minutes', 'slides', 'agreement', 'other', '')),
    url VARCHAR(500) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    owner_name VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_meeting_output_updated_at
    BEFORE UPDATE ON meeting_output
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting_output IS
    'A tangible deliverable produced by the meeting: document, decision, data, recording, minutes, slides, agreement.';
COMMENT ON COLUMN meeting_output.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting_output.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting_output.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting_output.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting_output.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN meeting_output.position IS
    'Zero-based ordinal of the output in the list.';
COMMENT ON COLUMN meeting_output.title IS
    'Short title of the output.';
COMMENT ON COLUMN meeting_output.kind IS
    'Kind of output: document, decision, data, recording, minutes, slides, agreement, other.';
COMMENT ON COLUMN meeting_output.url IS
    'URL of the output artefact, if any (document, recording, repository).';
COMMENT ON COLUMN meeting_output.description IS
    'Free-text description of the output and its content.';
COMMENT ON COLUMN meeting_output.owner_name IS
    'Person responsible for the output post-meeting.';

CREATE INDEX meeting_output_index_meeting_id
    ON meeting_output(meeting_id);
CREATE INDEX meeting_output_index_meeting_id_position
    ON meeting_output(meeting_id, position);
