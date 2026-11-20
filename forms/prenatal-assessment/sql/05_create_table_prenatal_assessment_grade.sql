CREATE TABLE prenatal_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES prenatal_assessment.assessment(id) ON DELETE CASCADE,
    risk_level VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (risk_level IN ('low', 'moderate', 'high')),
    risk_score INTEGER NOT NULL DEFAULT 0
        CHECK (risk_score >= 0),
    obstetric_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (obstetric_risk IN ('low', 'moderate', 'high', '')),
    medical_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (medical_risk IN ('low', 'moderate', 'high', '')),
    mental_health_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (mental_health_risk IN ('low', 'moderate', 'high', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON prenatal_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION prenatal_assessment.set_updated_at();

COMMENT ON TABLE prenatal_assessment.grade IS
    'Computed prenatal risk stratification result. Risk level based on obstetric, medical, and mental health factors. One-to-one child of assessment.';
COMMENT ON COLUMN prenatal_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN prenatal_assessment.grade.risk_level IS
    'Overall prenatal risk level: low, moderate, or high.';
COMMENT ON COLUMN prenatal_assessment.grade.risk_score IS
    'Aggregate risk score across all domains.';
COMMENT ON COLUMN prenatal_assessment.grade.obstetric_risk IS
    'Risk level from obstetric history: low, moderate, high, or empty.';
COMMENT ON COLUMN prenatal_assessment.grade.medical_risk IS
    'Risk level from medical history: low, moderate, high, or empty.';
COMMENT ON COLUMN prenatal_assessment.grade.mental_health_risk IS
    'Risk level from mental health screening: low, moderate, high, or empty.';
COMMENT ON COLUMN prenatal_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN prenatal_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN prenatal_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN prenatal_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN prenatal_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
