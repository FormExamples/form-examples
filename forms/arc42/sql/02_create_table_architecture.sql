-- A software architecture being documented with the arc42 template.

CREATE TABLE architecture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    version TEXT NOT NULL DEFAULT '',
    owner TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT '' CHECK (status IN ('draft', 'active', 'archived', '')),
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_architecture_updated_at
    BEFORE UPDATE ON architecture
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE architecture IS 'Software architecture being documented with arc42.';
COMMENT ON COLUMN architecture.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN architecture.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN architecture.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN architecture.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN architecture.name IS 'Architecture name.';
COMMENT ON COLUMN architecture.version IS 'Documentation version (free text, e.g. semantic version).';
COMMENT ON COLUMN architecture.owner IS 'Person or team responsible for the architecture.';
COMMENT ON COLUMN architecture.status IS 'Lifecycle status of the documented architecture: draft, active, or archived.';
COMMENT ON COLUMN architecture.description IS 'One-paragraph summary of the architecture.';

CREATE INDEX architecture_index_gto
    ON architecture
    USING GIN ((name) gin_trgm_ops);
