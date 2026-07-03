CREATE TABLE outpatient_outcome_clinical (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    presenting_complaint TEXT NOT NULL DEFAULT '',
    diagnosis TEXT NOT NULL DEFAULT '',
    treatment_delivered TEXT NOT NULL DEFAULT '',
    outcome_classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (outcome_classification IN (
            'resolved',
            'improved',
            'unchanged',
            'worsened',
            'died',
            ''
        ))
);

CREATE TRIGGER trigger_outpatient_outcome_clinical_updated_at
    BEFORE UPDATE ON outpatient_outcome_clinical
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_clinical IS
    'Clinician-rated clinical outcome for this encounter: presenting complaint, diagnosis, treatment, and five-level outcome classification.';
COMMENT ON COLUMN outpatient_outcome_clinical.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_clinical.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_clinical.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_clinical.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_clinical.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_clinical.presenting_complaint IS
    'Presenting complaint at the outpatient encounter.';
COMMENT ON COLUMN outpatient_outcome_clinical.diagnosis IS
    'Diagnosis confirmed or updated at this encounter.';
COMMENT ON COLUMN outpatient_outcome_clinical.treatment_delivered IS
    'Treatment, procedure, or intervention delivered at this encounter.';
COMMENT ON COLUMN outpatient_outcome_clinical.outcome_classification IS
    'Clinician-rated outcome: resolved, improved, unchanged, worsened, died, or empty.';
