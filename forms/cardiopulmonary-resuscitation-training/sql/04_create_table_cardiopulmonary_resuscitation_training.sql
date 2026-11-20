CREATE TABLE cardiopulmonary_resuscitation_training.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES cardiopulmonary_resuscitation_training.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON cardiopulmonary_resuscitation_training.assessment
    FOR EACH ROW
    EXECUTE FUNCTION cardiopulmonary_resuscitation_training.set_updated_at();

COMMENT ON TABLE cardiopulmonary_resuscitation_training.assessment IS 'Top-level assessment instance for cardiopulmonary-resuscitation-training. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN cardiopulmonary_resuscitation_training.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
