CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    right_pta_db NUMERIC(5,1),
    left_pta_db NUMERIC(5,1),
    better_ear_pta_db NUMERIC(5,1),
    right_hearing_grade VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (right_hearing_grade IN ('normal', 'mild', 'moderate', 'moderately_severe', 'severe', 'profound')),
    left_hearing_grade VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (left_hearing_grade IN ('normal', 'mild', 'moderate', 'moderately_severe', 'severe', 'profound')),
    overall_hearing_grade VARCHAR(20) NOT NULL DEFAULT 'normal'
        CHECK (overall_hearing_grade IN ('normal', 'mild', 'moderate', 'moderately_severe', 'severe', 'profound')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed hearing level grading result based on pure tone average (PTA). Normal (<=25 dB), Mild (26-40 dB), Moderate (41-55 dB), Moderately Severe (56-70 dB), Severe (71-90 dB), Profound (>90 dB). One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.right_pta_db IS
    'Right ear pure tone average in dB HL, NULL if not tested.';
COMMENT ON COLUMN grade.left_pta_db IS
    'Left ear pure tone average in dB HL, NULL if not tested.';
COMMENT ON COLUMN grade.better_ear_pta_db IS
    'Better ear pure tone average in dB HL, NULL if not tested.';
COMMENT ON COLUMN grade.right_hearing_grade IS
    'Right ear hearing level grade: normal, mild, moderate, moderately_severe, severe, or profound.';
COMMENT ON COLUMN grade.left_hearing_grade IS
    'Left ear hearing level grade: normal, mild, moderate, moderately_severe, severe, or profound.';
COMMENT ON COLUMN grade.overall_hearing_grade IS
    'Overall hearing level grade based on the better ear PTA.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the hearing level grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
