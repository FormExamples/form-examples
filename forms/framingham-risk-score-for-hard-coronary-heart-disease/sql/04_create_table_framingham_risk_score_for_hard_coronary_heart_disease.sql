CREATE TABLE framingham_risk_score_for_hard_coronary_heart_disease.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES framingham_risk_score_for_hard_coronary_heart_disease.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON framingham_risk_score_for_hard_coronary_heart_disease.assessment
    FOR EACH ROW
    EXECUTE FUNCTION framingham_risk_score_for_hard_coronary_heart_disease.set_updated_at();

COMMENT ON TABLE framingham_risk_score_for_hard_coronary_heart_disease.assessment IS
    'Framingham Risk Score for Hard CHD assessment form. Estimates 10-year risk of heart attack in patients 30-79 years. Parent entity for all assessment sections.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.patient_id IS
    'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
