CREATE TABLE hospital_discharge.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES hospital_discharge.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON hospital_discharge.assessment
    FOR EACH ROW
    EXECUTE FUNCTION hospital_discharge.set_updated_at();

COMMENT ON TABLE hospital_discharge.assessment IS 'Top-level assessment instance for hospital-discharge. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN hospital_discharge.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN hospital_discharge.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN hospital_discharge.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_discharge.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hospital_discharge.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN hospital_discharge.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
