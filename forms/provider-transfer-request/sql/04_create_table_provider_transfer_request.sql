CREATE TABLE provider_transfer_request.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES provider_transfer_request.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON provider_transfer_request.assessment
    FOR EACH ROW
    EXECUTE FUNCTION provider_transfer_request.set_updated_at();

COMMENT ON TABLE provider_transfer_request.assessment IS 'Top-level assessment instance for provider-transfer-request. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN provider_transfer_request.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN provider_transfer_request.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN provider_transfer_request.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN provider_transfer_request.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN provider_transfer_request.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN provider_transfer_request.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
