-- Additional flag — flags fired independently of the maturity band during arc42 documentation grading.

CREATE TABLE arc42_documentation_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_grade_id UUID NOT NULL REFERENCES arc42_documentation_grade(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT '' CHECK (priority IN ('high', 'medium', 'low', '')),
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_arc42_documentation_grade_flag_updated_at
    BEFORE UPDATE ON arc42_documentation_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE arc42_documentation_grade_flag IS 'Additional flag fired during arc42 documentation grading, independent of the maturity band.';
COMMENT ON COLUMN arc42_documentation_grade_flag.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN arc42_documentation_grade_flag.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN arc42_documentation_grade_flag.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN arc42_documentation_grade_flag.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN arc42_documentation_grade_flag.arc42_documentation_grade_id IS 'Parent grade record (cascade-deleted).';
COMMENT ON COLUMN arc42_documentation_grade_flag.ordinal IS 'Display/order index within the parent grade record.';
COMMENT ON COLUMN arc42_documentation_grade_flag.category IS 'Category of the flag (e.g. missing-stakeholders, insufficient-adrs, no-deployment-view).';
COMMENT ON COLUMN arc42_documentation_grade_flag.priority IS 'Priority of the flag: high, medium, or low.';
COMMENT ON COLUMN arc42_documentation_grade_flag.description IS 'Human-readable description of the architectural omission or concern flagged.';

CREATE INDEX arc42_documentation_grade_flag_index_gto
    ON arc42_documentation_grade_flag
    USING GIN ((description) gin_trgm_ops);
