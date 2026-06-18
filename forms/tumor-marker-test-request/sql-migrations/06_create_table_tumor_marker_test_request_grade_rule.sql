-- Audit trail of every scoring rule that fired for a tumour-marker test request.

CREATE TABLE tumor_marker_test_request_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    tumor_marker_test_request_grade_id UUID NOT NULL
        REFERENCES tumor_marker_test_request_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (axis IN ('appropriateness', 'interpretation', 'completeness', 'urgency', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_tumor_marker_test_request_grade_rule_grade_id
    ON tumor_marker_test_request_grade_rule(tumor_marker_test_request_grade_id);

CREATE TRIGGER trigger_tumor_marker_test_request_grade_rule_updated_at
    BEFORE UPDATE ON tumor_marker_test_request_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE tumor_marker_test_request_grade_rule IS
    'Audit trail of every appropriateness / interpretation / completeness / urgency rule that fired for this request.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.tumor_marker_test_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-APPROP-CA125-01).';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.axis IS
    'Scoring axis the rule belongs to: appropriateness, interpretation, completeness, urgency.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.category IS
    'Category or marker the rule relates to.';
COMMENT ON COLUMN tumor_marker_test_request_grade_rule.description IS
    'Human-readable description of why the rule fired.';
