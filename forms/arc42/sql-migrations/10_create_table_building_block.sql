-- Building block — §5 Building Block View.

CREATE TABLE building_block (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    parent_id UUID REFERENCES building_block(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    responsibility TEXT NOT NULL DEFAULT '',
    interfaces TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_building_block_updated_at
    BEFORE UPDATE ON building_block
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE building_block IS 'Building block captured in §5 Building Block View of the arc42 documentation.';
COMMENT ON COLUMN building_block.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN building_block.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN building_block.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN building_block.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN building_block.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN building_block.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN building_block.parent_id IS 'Self-referential FK to the parent building block; NULL for top-level blocks (cascade-deleted with parent).';
COMMENT ON COLUMN building_block.name IS 'Name of the building block (e.g. component, subsystem, or module name).';
COMMENT ON COLUMN building_block.responsibility IS 'Single-sentence description of what this building block is responsible for.';
COMMENT ON COLUMN building_block.interfaces IS 'Description of the interfaces this building block exposes or consumes.';

CREATE INDEX building_block_index_gto
    ON building_block
    USING GIN ((name) gin_trgm_ops);
