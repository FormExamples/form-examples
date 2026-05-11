-- Risk item — §11 Risks & Technical Debt.

CREATE TABLE risk_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('risk', 'technical-debt', '')),
    name TEXT NOT NULL DEFAULT '',
    probability TEXT NOT NULL DEFAULT '' CHECK (probability IN ('high', 'medium', 'low', '')),
    impact TEXT NOT NULL DEFAULT '' CHECK (impact IN ('high', 'medium', 'low', '')),
    mitigation TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_risk_item_updated_at
    BEFORE UPDATE ON risk_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE risk_item IS 'Risk or technical debt item captured in §11 Risks & Technical Debt of the arc42 documentation.';
COMMENT ON COLUMN risk_item.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN risk_item.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN risk_item.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN risk_item.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN risk_item.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN risk_item.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN risk_item.kind IS 'Kind of item: risk (future threat) or technical-debt (known liability).';
COMMENT ON COLUMN risk_item.name IS 'Short name or title of the risk or technical debt item.';
COMMENT ON COLUMN risk_item.probability IS 'Likelihood of the risk materialising: high, medium, or low.';
COMMENT ON COLUMN risk_item.impact IS 'Impact if the risk materialises: high, medium, or low.';
COMMENT ON COLUMN risk_item.mitigation IS 'Action taken or planned to mitigate the risk or address the technical debt.';

CREATE INDEX risk_item_index_gto
    ON risk_item
    USING GIN ((name) gin_trgm_ops);
