-- Crosscutting concept — §8 Crosscutting Concepts.

CREATE TABLE crosscutting_concept (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_crosscutting_concept_updated_at
    BEFORE UPDATE ON crosscutting_concept
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE crosscutting_concept IS 'Crosscutting concept captured in §8 Crosscutting Concepts of the arc42 documentation.';
COMMENT ON COLUMN crosscutting_concept.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN crosscutting_concept.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN crosscutting_concept.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN crosscutting_concept.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN crosscutting_concept.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN crosscutting_concept.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN crosscutting_concept.name IS 'Name of the crosscutting concept (e.g. Logging, Security, Internationalisation).';
COMMENT ON COLUMN crosscutting_concept.description IS 'Description of the concept, the pattern or approach used, and which building blocks it applies to.';

CREATE INDEX crosscutting_concept_index_gto
    ON crosscutting_concept
    USING GIN ((name) gin_trgm_ops);
