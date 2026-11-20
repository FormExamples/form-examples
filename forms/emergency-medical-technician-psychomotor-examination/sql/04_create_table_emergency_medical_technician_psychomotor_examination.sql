CREATE TABLE emergency_medical_technician_psychomotor_examination.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES emergency_medical_technician_psychomotor_examination.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON emergency_medical_technician_psychomotor_examination.assessment
    FOR EACH ROW
    EXECUTE FUNCTION emergency_medical_technician_psychomotor_examination.set_updated_at();

COMMENT ON TABLE emergency_medical_technician_psychomotor_examination.assessment IS 'Top-level assessment instance for emergency-medical-technician-psychomotor-examination. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN emergency_medical_technician_psychomotor_examination.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
