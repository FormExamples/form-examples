-- Intra-operative events recorded during the anaesthetic. Each event is one
-- row and cascades from the parent anaesthetic_record. Carries the event
-- type, the time it occurred, and how it was managed. An anaphylaxis event
-- raises the drug / anaphylaxis safety flag.

CREATE TABLE anaesthetic_record_intra_operative_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_id UUID NOT NULL REFERENCES anaesthetic_record(id) ON DELETE CASCADE,

    event_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (event_type IN ('desaturation', 'hypotension', 'arrhythmia', 'laryngospasm', 'bronchospasm', 'anaphylaxis', 'difficult-airway', 'awareness', 'other', '')),
    occurred_at TIMESTAMPTZ,
    management TEXT NOT NULL DEFAULT ''
);

CREATE INDEX anaesthetic_record_intra_operative_event_record_id_idx
    ON anaesthetic_record_intra_operative_event (anaesthetic_record_id);

CREATE TRIGGER trigger_anaesthetic_record_intra_operative_event_updated_at
    BEFORE UPDATE ON anaesthetic_record_intra_operative_event
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_intra_operative_event IS
    'Intra-operative events recorded during the anaesthetic: event type, time, and management.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.anaesthetic_record_id IS
    'Foreign key to the parent anaesthetic record.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.event_type IS
    'Event type: desaturation, hypotension, arrhythmia, laryngospasm, bronchospasm, anaphylaxis, difficult-airway, awareness, or other.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.occurred_at IS
    'Timestamp when the event occurred.';
COMMENT ON COLUMN anaesthetic_record_intra_operative_event.management IS
    'How the event was managed.';
