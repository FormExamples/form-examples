CREATE TABLE patient_satisfaction_survey.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES patient_satisfaction_survey.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON patient_satisfaction_survey.assessment
    FOR EACH ROW
    EXECUTE FUNCTION patient_satisfaction_survey.set_updated_at();

COMMENT ON TABLE patient_satisfaction_survey.assessment IS
    'Patient satisfaction survey using Likert-scale scoring across care domains. Parent entity for all survey sections.';
COMMENT ON COLUMN patient_satisfaction_survey.assessment.patient_id IS
    'Foreign key to the patient who completed this survey.';
COMMENT ON COLUMN patient_satisfaction_survey.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN patient_satisfaction_survey.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_satisfaction_survey.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient_satisfaction_survey.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient_satisfaction_survey.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
