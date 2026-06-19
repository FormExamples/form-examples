-- Constraint item — §2 Constraints.

CREATE TABLE constraint_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('technical', 'organizational', 'convention', '')),
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_constraint_item_updated_at
    BEFORE UPDATE ON constraint_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE constraint_item IS 'Constraint item captured in §2 Constraints of the arc42 documentation.';
COMMENT ON COLUMN constraint_item.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN constraint_item.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN constraint_item.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN constraint_item.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN constraint_item.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN constraint_item.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN constraint_item.kind IS 'Kind of constraint: technical, organizational, or convention.';
COMMENT ON COLUMN constraint_item.name IS 'Short name or title of the constraint.';
COMMENT ON COLUMN constraint_item.description IS 'Detailed description of the constraint and its impact on the architecture.';

CREATE INDEX constraint_item_index_gto
    ON constraint_item
    USING GIN ((description) gin_trgm_ops);
