CREATE TABLE care_privacy_notice.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES care_privacy_notice.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON care_privacy_notice.assessment
    FOR EACH ROW
    EXECUTE FUNCTION care_privacy_notice.set_updated_at();

COMMENT ON TABLE care_privacy_notice.assessment IS
    'Care privacy notice form with completeness validation. Parent entity for practice configuration and acknowledgment.';
COMMENT ON COLUMN care_privacy_notice.assessment.patient_id IS
    'Foreign key to the patient who owns this privacy notice form.';
COMMENT ON COLUMN care_privacy_notice.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN care_privacy_notice.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN care_privacy_notice.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN care_privacy_notice.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN care_privacy_notice.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
