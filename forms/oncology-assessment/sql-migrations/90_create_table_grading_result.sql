CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    ecog_score INTEGER NOT NULL DEFAULT 0
        CHECK (ecog_score >= 0 AND ecog_score <= 5),
    ecog_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (ecog_category IN ('fully-active', 'restricted', 'ambulatory', 'limited-self-care', 'completely-disabled', 'dead', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed ECOG Performance Status grading result for the oncology assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.ecog_score IS
    'ECOG Performance Status score: 0 = Fully active, 1 = Restricted, 2 = Ambulatory, 3 = Limited self-care, 4 = Completely disabled, 5 = Dead.';
COMMENT ON COLUMN grade.ecog_category IS
    'ECOG category label: fully-active, restricted, ambulatory, limited-self-care, completely-disabled, dead, or empty.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the ECOG grading was computed.';

COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
