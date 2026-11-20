CREATE TABLE who_emergency_unit_general_form.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES who_emergency_unit_general_form.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON who_emergency_unit_general_form.assessment
    FOR EACH ROW
    EXECUTE FUNCTION who_emergency_unit_general_form.set_updated_at();

COMMENT ON TABLE who_emergency_unit_general_form.assessment IS 'Top-level assessment instance for who-emergency-unit-general-form. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN who_emergency_unit_general_form.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN who_emergency_unit_general_form.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN who_emergency_unit_general_form.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN who_emergency_unit_general_form.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN who_emergency_unit_general_form.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN who_emergency_unit_general_form.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
