-- Audit trail of every completeness rule that fired during grading. Each
-- row records one required component, whether it was completed, the category,
-- and a human-readable description, so the front-end can render a checklist.

CREATE TABLE learning_disability_annual_health_check_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    learning_disability_annual_health_check_grade_id UUID NOT NULL
        REFERENCES learning_disability_annual_health_check_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(50) NOT NULL DEFAULT '',
    completed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (completed IN ('yes', 'no', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX learning_disability_annual_health_check_grade_rule_grade_id_idx
    ON learning_disability_annual_health_check_grade_rule (learning_disability_annual_health_check_grade_id);

CREATE TRIGGER trigger_learning_disability_annual_health_check_grade_rule_updated_at
    BEFORE UPDATE ON learning_disability_annual_health_check_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE learning_disability_annual_health_check_grade_rule IS
    'Audit trail of every completeness rule that fired during grading: required component, whether it was completed, category, and description.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.learning_disability_annual_health_check_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-PHYSICAL-HEALTH-01).';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.component IS
    'Required component the rule concerns (e.g. reasonable-adjustments, physical-health, medication-review).';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.completed IS
    'Whether the required component was completed (yes/no).';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.category IS
    'Subject category (e.g. required-component).';
COMMENT ON COLUMN learning_disability_annual_health_check_grade_rule.description IS
    'Human-readable description of why the rule fired.';
