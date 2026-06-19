-- Tyree & Akerman section 7: Positions.
-- A position is a viable alternative considered for the decision.
-- Each ADR typically has multiple positions; exactly one is_chosen=true
-- (this is enforced at the application layer, not by SQL constraint, because
-- a draft ADR may legitimately have zero chosen positions).

CREATE TABLE architecture_decision_record_position (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    architecture_decision_record_id UUID NOT NULL
        REFERENCES architecture_decision_record(id) ON DELETE CASCADE,

    ordinal INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    model_or_diagram_url TEXT NOT NULL DEFAULT '',
    is_chosen BOOLEAN NOT NULL DEFAULT FALSE,
    pros TEXT NOT NULL DEFAULT '',
    cons TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_architecture_decision_record_position_updated_at
    BEFORE UPDATE ON architecture_decision_record_position
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE architecture_decision_record_position IS
    'Tyree & Akerman section 7: a viable alternative considered for the decision.';
COMMENT ON COLUMN architecture_decision_record_position.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture_decision_record_position.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN architecture_decision_record_position.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture_decision_record_position.architecture_decision_record_id IS
    'Foreign key to architecture_decision_record.id.';
COMMENT ON COLUMN architecture_decision_record_position.ordinal IS
    'Display order; lower numbers appear first.';
COMMENT ON COLUMN architecture_decision_record_position.name IS
    'Short name of the position, e.g. "Use PostgreSQL".';
COMMENT ON COLUMN architecture_decision_record_position.description IS
    'Description of what this alternative would entail.';
COMMENT ON COLUMN architecture_decision_record_position.model_or_diagram_url IS
    'URL to a supporting model, diagram, or prototype.';
COMMENT ON COLUMN architecture_decision_record_position.is_chosen IS
    'TRUE if this is the position selected by the decision.';
COMMENT ON COLUMN architecture_decision_record_position.pros IS
    'Newline-separated list of advantages.';
COMMENT ON COLUMN architecture_decision_record_position.cons IS
    'Newline-separated list of disadvantages.';

CREATE INDEX architecture_decision_record_position_adr_id_index
    ON architecture_decision_record_position(architecture_decision_record_id);

CREATE INDEX architecture_decision_record_position_chosen_index
    ON architecture_decision_record_position(architecture_decision_record_id, is_chosen);
