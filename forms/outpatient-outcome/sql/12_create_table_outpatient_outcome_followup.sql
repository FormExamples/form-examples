CREATE TABLE outpatient_outcome_followup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    disposition VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (disposition IN (
            'discharge',
            'pifu',
            'follow_up_booked',
            'onward_referral',
            ''
        )),
    next_appointment_date DATE,
    onward_referral_specialty VARCHAR(100) NOT NULL DEFAULT '',
    followup_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_outpatient_outcome_followup_updated_at
    BEFORE UPDATE ON outpatient_outcome_followup
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_followup IS
    'Follow-up plan: disposition, next appointment date, onward referral, and clinician notes.';
COMMENT ON COLUMN outpatient_outcome_followup.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_followup.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_followup.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_followup.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_followup.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_followup.disposition IS
    'Disposition: discharge, pifu (patient-initiated follow-up), follow_up_booked, onward_referral, or empty.';
COMMENT ON COLUMN outpatient_outcome_followup.next_appointment_date IS
    'Date of the next booked appointment, if any.';
COMMENT ON COLUMN outpatient_outcome_followup.onward_referral_specialty IS
    'Specialty referred to, if disposition is onward_referral.';
COMMENT ON COLUMN outpatient_outcome_followup.followup_notes IS
    'Free-text clinician notes about the follow-up plan.';
