CREATE TABLE medical_language_speaking_assessment_for_cymraeg.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES medical_language_speaking_assessment_for_cymraeg.assessment(id) ON DELETE CASCADE,
    result_category VARCHAR(100) NOT NULL DEFAULT '',
    result_score NUMERIC,
    result_notes TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON medical_language_speaking_assessment_for_cymraeg.grade
    FOR EACH ROW
    EXECUTE FUNCTION medical_language_speaking_assessment_for_cymraeg.set_updated_at();

COMMENT ON TABLE medical_language_speaking_assessment_for_cymraeg.grade IS 'Computed grading / scoring result. One-to-one child of assessment. The result_category column holds a form-specific label (e.g. Low, Moderate, High, or Complete/Incomplete); result_score is optional for numeric instruments.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.assessment_id IS 'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.result_category IS 'Form-specific outcome label.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.result_score IS 'Optional numeric score for quantitative instruments.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.result_notes IS 'Free-text clinician notes accompanying the result.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.graded_at IS 'Timestamp when the grading was computed.';

COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_cymraeg.grade.deleted_at IS
    'Timestamp when this row was deleted.';
