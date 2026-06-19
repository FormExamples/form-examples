-- Fired grading rule — audit trail of rules that fired during arc42 documentation grading.

CREATE TABLE arc42_documentation_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_grade_id UUID NOT NULL REFERENCES arc42_documentation_grade(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    rule_id TEXT NOT NULL DEFAULT '',
    section_number SMALLINT,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_arc42_documentation_grade_rule_updated_at
    BEFORE UPDATE ON arc42_documentation_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE arc42_documentation_grade_rule IS 'Audit trail of grading rules that fired when computing the maturity of an arc42 documentation snapshot.';
COMMENT ON COLUMN arc42_documentation_grade_rule.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN arc42_documentation_grade_rule.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN arc42_documentation_grade_rule.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN arc42_documentation_grade_rule.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN arc42_documentation_grade_rule.arc42_documentation_grade_id IS 'Parent grade record (cascade-deleted).';
COMMENT ON COLUMN arc42_documentation_grade_rule.ordinal IS 'Display/order index within the parent grade record.';
COMMENT ON COLUMN arc42_documentation_grade_rule.rule_id IS 'Machine-readable identifier of the rule that fired (e.g. SECTION_1_EMPTY).';
COMMENT ON COLUMN arc42_documentation_grade_rule.section_number IS 'arc42 section number (1–12) the rule applies to; NULL if cross-section.';
COMMENT ON COLUMN arc42_documentation_grade_rule.description IS 'Human-readable description of why the rule fired.';

CREATE INDEX arc42_documentation_grade_rule_index_gto
    ON arc42_documentation_grade_rule
    USING GIN ((description) gin_trgm_ops);
