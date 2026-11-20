CREATE TABLE consent_to_treatment.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES consent_to_treatment.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON consent_to_treatment.assessment
    FOR EACH ROW
    EXECUTE FUNCTION consent_to_treatment.set_updated_at();

COMMENT ON TABLE consent_to_treatment.assessment IS
    'Consent to treatment form with completeness validation. Parent entity for all consent sections.';
COMMENT ON COLUMN consent_to_treatment.assessment.patient_id IS
    'Foreign key to the patient who owns this consent form.';
COMMENT ON COLUMN consent_to_treatment.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN consent_to_treatment.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN consent_to_treatment.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN consent_to_treatment.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN consent_to_treatment.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
