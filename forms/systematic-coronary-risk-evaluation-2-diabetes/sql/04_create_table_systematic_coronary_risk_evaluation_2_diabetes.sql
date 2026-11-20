CREATE TABLE systematic_coronary_risk_evaluation_2_diabetes.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES systematic_coronary_risk_evaluation_2_diabetes.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON systematic_coronary_risk_evaluation_2_diabetes.assessment
    FOR EACH ROW
    EXECUTE FUNCTION systematic_coronary_risk_evaluation_2_diabetes.set_updated_at();

COMMENT ON TABLE systematic_coronary_risk_evaluation_2_diabetes.assessment IS
    'SCORE2-Diabetes assessment form. Parent entity for all assessment sections.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.patient_id IS
    'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
