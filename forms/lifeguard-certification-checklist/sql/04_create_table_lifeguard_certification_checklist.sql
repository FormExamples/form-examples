CREATE TABLE lifeguard_certification_checklist.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES lifeguard_certification_checklist.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON lifeguard_certification_checklist.assessment
    FOR EACH ROW
    EXECUTE FUNCTION lifeguard_certification_checklist.set_updated_at();

COMMENT ON TABLE lifeguard_certification_checklist.assessment IS 'Top-level assessment instance for lifeguard-certification-checklist. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN lifeguard_certification_checklist.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN lifeguard_certification_checklist.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN lifeguard_certification_checklist.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lifeguard_certification_checklist.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN lifeguard_certification_checklist.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN lifeguard_certification_checklist.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
