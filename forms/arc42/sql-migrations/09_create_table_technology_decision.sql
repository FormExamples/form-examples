-- Technology decision — §4 Solution Strategy.

CREATE TABLE technology_decision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT '',
    choice TEXT NOT NULL DEFAULT '',
    rationale TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_technology_decision_updated_at
    BEFORE UPDATE ON technology_decision
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE technology_decision IS 'Technology decision captured in §4 Solution Strategy of the arc42 documentation.';
COMMENT ON COLUMN technology_decision.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN technology_decision.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN technology_decision.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN technology_decision.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN technology_decision.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN technology_decision.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN technology_decision.category IS 'Category of the technology decision (e.g. language, database, framework, infrastructure).';
COMMENT ON COLUMN technology_decision.choice IS 'The specific technology or approach chosen.';
COMMENT ON COLUMN technology_decision.rationale IS 'Rationale explaining why this technology was chosen over alternatives.';

CREATE INDEX technology_decision_index_gto
    ON technology_decision
    USING GIN ((choice) gin_trgm_ops);
