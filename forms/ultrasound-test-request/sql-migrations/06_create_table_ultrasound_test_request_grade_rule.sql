-- Audit trail of every scoring rule that fired for a general ultrasound request.

CREATE TABLE ultrasound_test_request_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ultrasound_test_request_grade_id UUID NOT NULL
        REFERENCES ultrasound_test_request_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (axis IN ('appropriateness', 'suitability', 'completeness', 'triage', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_ultrasound_test_request_grade_rule_grade_id
    ON ultrasound_test_request_grade_rule(ultrasound_test_request_grade_id);

CREATE TRIGGER trigger_ultrasound_test_request_grade_rule_updated_at
    BEFORE UPDATE ON ultrasound_test_request_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ultrasound_test_request_grade_rule IS
    'Audit trail of every appropriateness / suitability / completeness / triage rule that fired for this request.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.ultrasound_test_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-APPROP-RUQ-01).';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.axis IS
    'Scoring axis the rule belongs to: appropriateness, suitability, completeness, triage.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.category IS
    'Category or indication the rule relates to.';
COMMENT ON COLUMN ultrasound_test_request_grade_rule.description IS
    'Human-readable description of why the rule fired.';
