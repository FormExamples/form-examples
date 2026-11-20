CREATE TABLE allergy_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES allergy_assessment.assessment(id) ON DELETE CASCADE,
    severity_level VARCHAR(10) NOT NULL DEFAULT 'mild'
        CHECK (severity_level IN ('mild', 'moderate', 'severe')),
    allergy_burden_score INTEGER NOT NULL DEFAULT 0
        CHECK (allergy_burden_score >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON allergy_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION allergy_assessment.set_updated_at();

COMMENT ON TABLE allergy_assessment.grade IS
    'Computed allergy severity grading result. One-to-one child of assessment.';
COMMENT ON COLUMN allergy_assessment.grade.severity_level IS
    'Overall severity classification: mild, moderate, or severe.';
COMMENT ON COLUMN allergy_assessment.grade.allergy_burden_score IS
    'Weighted allergy burden score across all allergen categories.';
COMMENT ON COLUMN allergy_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN allergy_assessment.grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN allergy_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN allergy_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN allergy_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
