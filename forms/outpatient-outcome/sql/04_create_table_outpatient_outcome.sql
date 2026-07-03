CREATE TABLE outpatient_outcome (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_outpatient_outcome_updated_at
    BEFORE UPDATE ON outpatient_outcome
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome IS
    'Top-level assessment instance for outpatient-outcome-report. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN outpatient_outcome.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome.patient_id IS
    'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN outpatient_outcome.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';
