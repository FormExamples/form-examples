-- Tyree & Akerman section 14: Notes.
-- Append-only discussion log captured during socialisation of the decision.
-- Each note is timestamped and attributed; notes are not edited after writing.

CREATE TABLE architecture_decision_record_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    architecture_decision_record_id UUID NOT NULL
        REFERENCES architecture_decision_record(id) ON DELETE CASCADE,

    noted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    noted_by TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL
);

CREATE TRIGGER trigger_architecture_decision_record_note_updated_at
    BEFORE UPDATE ON architecture_decision_record_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE architecture_decision_record_note IS
    'Tyree & Akerman section 14: append-only discussion notes captured during socialisation.';
COMMENT ON COLUMN architecture_decision_record_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture_decision_record_note.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN architecture_decision_record_note.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture_decision_record_note.architecture_decision_record_id IS
    'Foreign key to architecture_decision_record.id.';
COMMENT ON COLUMN architecture_decision_record_note.noted_at IS
    'Timestamp when the note was made (may differ from created_at if backdated).';
COMMENT ON COLUMN architecture_decision_record_note.noted_by IS
    'Name of the person who made the note.';
COMMENT ON COLUMN architecture_decision_record_note.body IS
    'Note body text.';

CREATE INDEX architecture_decision_record_note_adr_id_index
    ON architecture_decision_record_note(architecture_decision_record_id);

CREATE INDEX architecture_decision_record_note_noted_at_index
    ON architecture_decision_record_note(architecture_decision_record_id, noted_at);
