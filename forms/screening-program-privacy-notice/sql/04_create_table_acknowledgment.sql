CREATE TABLE screening_program_privacy_notice.acknowledgment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES screening_program_privacy_notice.patient(id) ON DELETE CASCADE,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    full_name TEXT NOT NULL DEFAULT '',
    acknowledged_date DATE
);

CREATE TRIGGER trigger_acknowledgment_updated_at
    BEFORE UPDATE ON screening_program_privacy_notice.acknowledgment
    FOR EACH ROW
    EXECUTE FUNCTION screening_program_privacy_notice.set_updated_at();

COMMENT ON TABLE screening_program_privacy_notice.acknowledgment IS 'Patient acknowledgment of the screening program privacy notice.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.patient_id IS 'Foreign key referencing the patient who acknowledged the notice.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.confirmed IS 'Whether the patient confirmed they have read and understood the privacy notice.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.full_name IS 'Full name typed by the patient as their acknowledgment signature.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.acknowledged_date IS 'Date the patient acknowledged the privacy notice.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN screening_program_privacy_notice.acknowledgment.deleted_at IS
    'Timestamp when this row was deleted.';
