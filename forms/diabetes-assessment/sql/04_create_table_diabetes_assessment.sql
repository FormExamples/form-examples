CREATE TABLE diabetes_assessment.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    -- Foreign key to the patient this assessment belongs to
    patient_id          UUID NOT NULL REFERENCES diabetes_assessment.patient(id) ON DELETE CASCADE,
    -- Assessment status tracking
    status              TEXT NOT NULL DEFAULT 'in_progress'
                        CHECK (status IN ('in_progress', 'completed', 'reviewed'))
);

-- Index for the most common query: all assessments for a patient
CREATE INDEX index_assessment_patient_id ON diabetes_assessment.assessment(patient_id);

-- Auto-update updated_at on every row change
CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON diabetes_assessment.assessment
    FOR EACH ROW EXECUTE FUNCTION diabetes_assessment.set_updated_at();

COMMENT ON TABLE diabetes_assessment.assessment IS
    'A single diabetes assessment visit. Child tables hold section-specific clinical data.';
COMMENT ON COLUMN diabetes_assessment.assessment.patient_id IS
    'FK to patient. One patient may have many assessments.';
COMMENT ON COLUMN diabetes_assessment.assessment.status IS
    'Workflow status: in_progress (filling in), completed (submitted), reviewed (clinician signed off).';
COMMENT ON COLUMN diabetes_assessment.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetes_assessment.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN diabetes_assessment.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN diabetes_assessment.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
