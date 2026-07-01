-- Computed documentation-completeness grading result for an annual health
-- check. The engine classifies the check as complete or incomplete, reports
-- a completeness percentage against the required components, and confirms
-- whether the Health Action Plan is complete (produced and shared). A
-- completeness grade reflects whether the check was carried out fully, not
-- the person's clinical severity.

CREATE TABLE learning_disability_annual_health_check_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    learning_disability_annual_health_check_id UUID NOT NULL UNIQUE
        REFERENCES learning_disability_annual_health_check(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),
    completeness_percent INTEGER,
    health_action_plan_complete VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (health_action_plan_complete IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_learning_disability_annual_health_check_grade_updated_at
    BEFORE UPDATE ON learning_disability_annual_health_check_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE learning_disability_annual_health_check_grade IS
    'Computed documentation-completeness grading result for an annual health check: status (complete/incomplete), completeness percentage against required components, and Health Action Plan completeness.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.learning_disability_annual_health_check_id IS
    'Foreign key to the parent annual health check (unique, 1:1).';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.status IS
    'Completeness status: complete (every required component completed and the Health Action Plan complete) or incomplete.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.completeness_percent IS
    'Completeness percentage (0..100): completed required components / total required components x 100.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.health_action_plan_complete IS
    'Whether the Health Action Plan is complete (produced and shared): yes or no.';
COMMENT ON COLUMN learning_disability_annual_health_check_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
