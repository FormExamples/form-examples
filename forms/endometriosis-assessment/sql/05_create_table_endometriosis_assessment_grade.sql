CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    asrm_stage VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asrm_stage IN ('I', 'II', 'III', 'IV', '')),
    asrm_points INTEGER
        CHECK (asrm_points IS NULL OR asrm_points >= 0),
    ehp30_total_score INTEGER
        CHECK (ehp30_total_score IS NULL OR (ehp30_total_score >= 0 AND ehp30_total_score <= 100)),
    overall_severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_severity IN ('mild', 'moderate', 'severe', 'critical', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed endometriosis staging and grading result. Revised ASRM Stage I-IV and EHP-30 quality of life score. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.asrm_stage IS
    'Revised ASRM endometriosis stage: I, II, III, IV, or empty.';
COMMENT ON COLUMN grade.asrm_points IS
    'Revised ASRM total points score.';
COMMENT ON COLUMN grade.ehp30_total_score IS
    'EHP-30 total quality of life score (0-100, higher = worse).';
COMMENT ON COLUMN grade.overall_severity IS
    'Overall endometriosis severity: mild, moderate, severe, critical, or empty.';
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
