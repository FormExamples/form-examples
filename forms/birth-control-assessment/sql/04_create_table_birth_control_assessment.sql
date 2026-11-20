CREATE TABLE birth_control_assessment.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES birth_control_assessment.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON birth_control_assessment.assessment
    FOR EACH ROW
    EXECUTE FUNCTION birth_control_assessment.set_updated_at();

COMMENT ON TABLE birth_control_assessment.assessment IS
    'Birth control assessment form using UK MEC categories. Parent entity for all assessment sections.';
COMMENT ON COLUMN birth_control_assessment.assessment.patient_id IS
    'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN birth_control_assessment.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN birth_control_assessment.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN birth_control_assessment.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN birth_control_assessment.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN birth_control_assessment.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
