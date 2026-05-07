CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    completion_percentage NUMERIC(5,1) NOT NULL DEFAULT 0
        CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    completion_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (completion_status IN ('not-started', 'in-progress', 'mostly-complete', 'complete', '')),
    overall_risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'critical', '')),
    items_completed INTEGER NOT NULL DEFAULT 0,
    items_total INTEGER NOT NULL DEFAULT 0,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed onboarding completion grading result. Completion percentage 0-100% with status categories. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.completion_percentage IS
    'Overall completion percentage from 0 to 100.';
COMMENT ON COLUMN grade.completion_status IS
    'Completion status: not-started (0%), in-progress (1-49%), mostly-complete (50-89%), complete (90-100%), or empty.';
COMMENT ON COLUMN grade.overall_risk_level IS
    'Overall onboarding risk level: low, moderate, high, critical, or empty.';
COMMENT ON COLUMN grade.items_completed IS
    'Number of checklist items completed.';
COMMENT ON COLUMN grade.items_total IS
    'Total number of checklist items.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
