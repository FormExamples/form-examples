CREATE TABLE outpatient_outcome_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grade_id UUID NOT NULL
        REFERENCES outpatient_outcome_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    severity_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (severity_level IN ('low', 'medium', 'high', 'critical', ''))
);

CREATE TRIGGER trigger_outpatient_outcome_grade_rule_updated_at
    BEFORE UPDATE ON outpatient_outcome_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_grade_rule IS
    'Individual OOCG rules that evaluated to true during grading.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.rule_id IS
    'Stable identifier of the rule that fired.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.category IS
    'Category / domain of the rule (clinical, prom, prem, operational).';
COMMENT ON COLUMN outpatient_outcome_grade_rule.description IS
    'Human-readable description of the rule condition.';
COMMENT ON COLUMN outpatient_outcome_grade_rule.severity_level IS
    'Severity of the finding: low, medium, high, critical, or empty for non-severity rules.';
