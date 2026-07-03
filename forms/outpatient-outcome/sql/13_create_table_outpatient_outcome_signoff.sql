CREATE TABLE outpatient_outcome_signoff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    reporting_clinician_id UUID REFERENCES clinician(id) ON DELETE SET NULL,
    reporting_clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    reporting_clinician_role VARCHAR(100) NOT NULL DEFAULT '',
    signed_off_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_outpatient_outcome_signoff_updated_at
    BEFORE UPDATE ON outpatient_outcome_signoff
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_signoff IS
    'Reporting clinician sign-off: who completed the report and when.';
COMMENT ON COLUMN outpatient_outcome_signoff.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_signoff.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_signoff.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_signoff.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_signoff.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_signoff.reporting_clinician_id IS
    'Foreign key to the clinician who signed off; null if not linked.';
COMMENT ON COLUMN outpatient_outcome_signoff.reporting_clinician_name IS
    'Typed name of the reporting clinician (redundant with clinician.name for audit).';
COMMENT ON COLUMN outpatient_outcome_signoff.reporting_clinician_role IS
    'Role of the reporting clinician at time of sign-off.';
COMMENT ON COLUMN outpatient_outcome_signoff.signed_off_at IS
    'Timestamp of sign-off; null when the report is still a draft.';
