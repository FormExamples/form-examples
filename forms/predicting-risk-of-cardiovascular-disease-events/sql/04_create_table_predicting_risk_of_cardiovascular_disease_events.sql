CREATE TABLE predicting_risk_of_cardiovascular_disease_events.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    -- Foreign key to the patient this assessment belongs to
    patient_id          UUID NOT NULL REFERENCES predicting_risk_of_cardiovascular_disease_events.patient(id) ON DELETE CASCADE,
    -- Assessment status tracking
    status              TEXT NOT NULL DEFAULT 'in_progress'
                        CHECK (status IN ('in_progress', 'completed', 'reviewed'))
);

-- Index for the most common query: all assessments for a patient
CREATE INDEX index_assessment_patient_id ON predicting_risk_of_cardiovascular_disease_events.assessment(patient_id);

-- Auto-update updated_at on every row change
CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON predicting_risk_of_cardiovascular_disease_events.assessment
    FOR EACH ROW EXECUTE FUNCTION predicting_risk_of_cardiovascular_disease_events.set_updated_at();

COMMENT ON TABLE predicting_risk_of_cardiovascular_disease_events.assessment IS
    'A single PREVENT CVD risk assessment. Child tables hold section-specific clinical data.';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.patient_id IS
    'FK to patient. One patient may have many assessments over time.';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.status IS
    'Workflow status: in_progress (patient filling in), completed (submitted), reviewed (clinician signed off).';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN predicting_risk_of_cardiovascular_disease_events.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
