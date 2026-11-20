CREATE TABLE gynecology_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES gynecology_assessment.assessment(id) ON DELETE CASCADE,
    severity_level VARCHAR(10) NOT NULL DEFAULT 'mild'
        CHECK (severity_level IN ('mild', 'moderate', 'severe')),
    total_symptom_score INTEGER NOT NULL DEFAULT 0
        CHECK (total_symptom_score >= 0),
    menstrual_domain_score INTEGER NOT NULL DEFAULT 0
        CHECK (menstrual_domain_score >= 0),
    pelvic_symptom_score INTEGER NOT NULL DEFAULT 0
        CHECK (pelvic_symptom_score >= 0),
    urogenital_symptom_score INTEGER NOT NULL DEFAULT 0
        CHECK (urogenital_symptom_score >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON gynecology_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION gynecology_assessment.set_updated_at();

COMMENT ON TABLE gynecology_assessment.grade IS
    'Computed gynaecological symptom severity result based on frequency, intensity, and clinical significance. One-to-one child of assessment.';
COMMENT ON COLUMN gynecology_assessment.grade.severity_level IS
    'Overall severity classification: mild, moderate, or severe.';
COMMENT ON COLUMN gynecology_assessment.grade.total_symptom_score IS
    'Composite symptom severity score across all domains.';
COMMENT ON COLUMN gynecology_assessment.grade.menstrual_domain_score IS
    'Sub-score for menstrual symptoms.';
COMMENT ON COLUMN gynecology_assessment.grade.pelvic_symptom_score IS
    'Sub-score for pelvic pain and prolapse symptoms.';
COMMENT ON COLUMN gynecology_assessment.grade.urogenital_symptom_score IS
    'Sub-score for urogenital and vulval symptoms.';
COMMENT ON COLUMN gynecology_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN gynecology_assessment.grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN gynecology_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN gynecology_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN gynecology_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN gynecology_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
