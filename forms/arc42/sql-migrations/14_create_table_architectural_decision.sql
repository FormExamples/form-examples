-- Architectural decision record (ADR) — §9 Architectural Decisions.

CREATE TABLE architectural_decision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    title TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT '' CHECK (status IN ('draft', 'proposed', 'accepted', 'deprecated', 'superseded', '')),
    context TEXT NOT NULL DEFAULT '',
    decision TEXT NOT NULL DEFAULT '',
    consequences TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_architectural_decision_updated_at
    BEFORE UPDATE ON architectural_decision
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE architectural_decision IS 'Architectural Decision Record (ADR) captured in §9 Architectural Decisions of the arc42 documentation.';
COMMENT ON COLUMN architectural_decision.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architectural_decision.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN architectural_decision.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architectural_decision.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN architectural_decision.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN architectural_decision.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN architectural_decision.title IS 'Short title of the architectural decision (e.g. Use PostgreSQL as primary database).';
COMMENT ON COLUMN architectural_decision.status IS 'Lifecycle status of the ADR: draft, proposed, accepted, deprecated, or superseded.';
COMMENT ON COLUMN architectural_decision.context IS 'Context explaining the problem or force that drove this decision.';
COMMENT ON COLUMN architectural_decision.decision IS 'The decision that was made.';
COMMENT ON COLUMN architectural_decision.consequences IS 'Consequences — positive and negative — of this decision.';

CREATE INDEX architectural_decision_index_gto
    ON architectural_decision
    USING GIN ((title) gin_trgm_ops);
