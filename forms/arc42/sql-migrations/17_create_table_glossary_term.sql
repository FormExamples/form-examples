-- Glossary term — §12 Glossary.

CREATE TABLE glossary_term (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    term TEXT NOT NULL DEFAULT '',
    definition TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_glossary_term_updated_at
    BEFORE UPDATE ON glossary_term
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glossary_term IS 'Glossary term captured in §12 Glossary of the arc42 documentation.';
COMMENT ON COLUMN glossary_term.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glossary_term.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN glossary_term.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN glossary_term.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN glossary_term.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN glossary_term.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN glossary_term.term IS 'The domain or architectural term being defined.';
COMMENT ON COLUMN glossary_term.definition IS 'Clear, concise definition of the term as used in this architecture.';

CREATE INDEX glossary_term_index_gto
    ON glossary_term
    USING GIN ((term) gin_trgm_ops);
