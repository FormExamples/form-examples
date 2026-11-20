CREATE TABLE patient_intake.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES patient_intake.assessment(id) ON DELETE CASCADE,
    risk_level VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (risk_level IN ('low', 'medium', 'high')),
    risk_factor_count INTEGER NOT NULL DEFAULT 0
        CHECK (risk_factor_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON patient_intake.grade
    FOR EACH ROW
    EXECUTE FUNCTION patient_intake.set_updated_at();

COMMENT ON TABLE patient_intake.grade IS
    'Computed risk level grading result for the patient intake assessment. One-to-one child of assessment.';
COMMENT ON COLUMN patient_intake.grade.risk_level IS
    'Overall risk level: low (minimal risk factors), medium (some risk factors), high (significant risk factors requiring attention).';
COMMENT ON COLUMN patient_intake.grade.risk_factor_count IS
    'Total number of risk factors identified during intake.';
COMMENT ON COLUMN patient_intake.grade.graded_at IS
    'Timestamp when the risk grading was computed.';

COMMENT ON COLUMN patient_intake.grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN patient_intake.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_intake.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient_intake.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient_intake.grade.deleted_at IS
    'Timestamp when this row was deleted.';
