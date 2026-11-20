CREATE TABLE psychiatry_assessment.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES psychiatry_assessment.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON psychiatry_assessment.assessment
    FOR EACH ROW
    EXECUTE FUNCTION psychiatry_assessment.set_updated_at();

COMMENT ON TABLE psychiatry_assessment.assessment IS
    'Psychiatry assessment form. Parent entity for all sections covering the GAF (Global Assessment of Functioning) evaluation.';
COMMENT ON COLUMN psychiatry_assessment.assessment.patient_id IS
    'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN psychiatry_assessment.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN psychiatry_assessment.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN psychiatry_assessment.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN psychiatry_assessment.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN psychiatry_assessment.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
