-- Computed completeness grading result for a nursing care plan. Stores the
-- overall completeness status (Complete / Partial / Incomplete) and the
-- completeness percent derived by the engine from the plan's problems, goals,
-- interventions, and evaluations.

CREATE TABLE nursing_care_plan_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nursing_care_plan_id UUID NOT NULL UNIQUE
        REFERENCES nursing_care_plan(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER NOT NULL DEFAULT 0
        CHECK (completeness_percent BETWEEN 0 AND 100),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_nursing_care_plan_grade_updated_at
    BEFORE UPDATE ON nursing_care_plan_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan_grade IS
    'Computed completeness grading result for a nursing care plan: overall status and completeness percent.';
COMMENT ON COLUMN nursing_care_plan_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN nursing_care_plan_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN nursing_care_plan_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN nursing_care_plan_grade.nursing_care_plan_id IS
    'Foreign key to the parent nursing care plan (unique, 1:1).';
COMMENT ON COLUMN nursing_care_plan_grade.status IS
    'Overall completeness status: complete, partial, or incomplete.';
COMMENT ON COLUMN nursing_care_plan_grade.completeness_percent IS
    'Proportion (0-100) of the three required elements (goal, intervention, evaluation) present across all problems.';
COMMENT ON COLUMN nursing_care_plan_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
