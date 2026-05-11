-- Stakeholder — §1 Introduction & Goals.

CREATE TABLE stakeholder (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    concerns TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_stakeholder_updated_at
    BEFORE UPDATE ON stakeholder
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE stakeholder IS 'Stakeholder captured in §1 Introduction & Goals of the arc42 documentation.';
COMMENT ON COLUMN stakeholder.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN stakeholder.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN stakeholder.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN stakeholder.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN stakeholder.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN stakeholder.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN stakeholder.name IS 'Name or group name of the stakeholder.';
COMMENT ON COLUMN stakeholder.role IS 'Role or position of the stakeholder in relation to the architecture.';
COMMENT ON COLUMN stakeholder.concerns IS 'Key concerns, expectations, or interests this stakeholder has about the architecture.';

CREATE INDEX stakeholder_index_gto
    ON stakeholder
    USING GIN ((name) gin_trgm_ops);
