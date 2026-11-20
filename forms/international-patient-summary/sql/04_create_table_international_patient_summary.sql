CREATE TABLE international_patient_summary.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES international_patient_summary.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON international_patient_summary.assessment
    FOR EACH ROW
    EXECUTE FUNCTION international_patient_summary.set_updated_at();

COMMENT ON TABLE international_patient_summary.assessment IS 'Top-level assessment instance for international-patient-summary. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN international_patient_summary.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN international_patient_summary.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN international_patient_summary.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN international_patient_summary.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN international_patient_summary.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN international_patient_summary.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
