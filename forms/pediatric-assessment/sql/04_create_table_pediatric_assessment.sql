CREATE TABLE pediatric_assessment.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES pediatric_assessment.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON pediatric_assessment.assessment
    FOR EACH ROW
    EXECUTE FUNCTION pediatric_assessment.set_updated_at();

COMMENT ON TABLE pediatric_assessment.assessment IS
    'Pediatric assessment form. Parent entity for all assessment sections covering child development screening.';
COMMENT ON COLUMN pediatric_assessment.assessment.patient_id IS
    'Foreign key to the patient (child) who owns this assessment.';
COMMENT ON COLUMN pediatric_assessment.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN pediatric_assessment.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pediatric_assessment.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pediatric_assessment.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN pediatric_assessment.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
