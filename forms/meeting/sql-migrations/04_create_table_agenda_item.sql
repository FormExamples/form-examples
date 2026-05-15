-- Agenda item — one row per topic on the meeting agenda. Ordered by
-- position to preserve the order the organizer entered.

CREATE TABLE agenda_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),
    title VARCHAR(255) NOT NULL DEFAULT '',
    duration_minutes INTEGER
        CHECK (duration_minutes IS NULL OR duration_minutes BETWEEN 0 AND 1440),
    presenter VARCHAR(255) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (status IN ('planned', 'discussed', 'skipped', 'deferred', ''))
);

CREATE TRIGGER trigger_agenda_item_updated_at
    BEFORE UPDATE ON agenda_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agenda_item IS
    'One topic on the meeting agenda. Ordered by position. Captures presenter, planned duration, and free-text notes.';
COMMENT ON COLUMN agenda_item.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agenda_item.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agenda_item.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agenda_item.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agenda_item.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN agenda_item.position IS
    'Zero-based ordinal of the item in the agenda list.';
COMMENT ON COLUMN agenda_item.title IS
    'Title of the agenda topic.';
COMMENT ON COLUMN agenda_item.duration_minutes IS
    'Planned duration in minutes (0 to 1440).';
COMMENT ON COLUMN agenda_item.presenter IS
    'Name of the person presenting or leading the discussion.';
COMMENT ON COLUMN agenda_item.notes IS
    'Free-text notes attached to the agenda item.';
COMMENT ON COLUMN agenda_item.status IS
    'Outcome of the agenda item: planned, discussed, skipped, deferred.';

CREATE INDEX agenda_item_index_meeting_id
    ON agenda_item(meeting_id);
CREATE INDEX agenda_item_index_meeting_id_position
    ON agenda_item(meeting_id, position);
