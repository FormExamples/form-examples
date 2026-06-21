-- Audit trail of every scoring rule that fired for an ABPM result.

CREATE TABLE ambulatory_blood_pressure_test_result_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ambulatory_blood_pressure_test_result_grade_id UUID NOT NULL
        REFERENCES ambulatory_blood_pressure_test_result_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (axis IN ('classification', 'severity', 'completeness', 'follow-up', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_ambulatory_blood_pressure_test_result_grade_rule_grade_id
    ON ambulatory_blood_pressure_test_result_grade_rule(ambulatory_blood_pressure_test_result_grade_id);

CREATE TRIGGER trigger_ambulatory_blood_pressure_test_result_grade_rule_updated_at
    BEFORE UPDATE ON ambulatory_blood_pressure_test_result_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ambulatory_blood_pressure_test_result_grade_rule IS
    'Audit trail of every classification / severity / completeness / follow-up rule that fired for this result.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.ambulatory_blood_pressure_test_result_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CLASS-CRITICAL-01).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.axis IS
    'Scoring axis the rule belongs to: classification, severity, completeness, follow-up.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.category IS
    'Category or finding the rule relates to.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade_rule.description IS
    'Human-readable description of why the rule fired.';
