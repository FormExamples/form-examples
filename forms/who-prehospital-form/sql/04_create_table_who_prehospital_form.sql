CREATE TABLE who_prehospital_form.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES who_prehospital_form.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON who_prehospital_form.assessment
    FOR EACH ROW
    EXECUTE FUNCTION who_prehospital_form.set_updated_at();

COMMENT ON TABLE who_prehospital_form.assessment IS 'Top-level assessment instance for who-prehospital-form. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN who_prehospital_form.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN who_prehospital_form.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN who_prehospital_form.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN who_prehospital_form.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN who_prehospital_form.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN who_prehospital_form.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
