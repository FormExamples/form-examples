CREATE TABLE assessment_followup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

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
    followup_notes TEXT NOT NULL DEFAULT '',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_assessment_followup_updated_at
    BEFORE UPDATE ON assessment_followup
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessment_followup IS
    'Follow-up plan: disposition, next appointment date, onward referral, and clinician notes.';
COMMENT ON COLUMN assessment_followup.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessment_followup.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN assessment_followup.disposition IS
    'Disposition: discharge, pifu (patient-initiated follow-up), follow_up_booked, onward_referral, or empty.';
COMMENT ON COLUMN assessment_followup.next_appointment_date IS
    'Date of the next booked appointment, if any.';
COMMENT ON COLUMN assessment_followup.onward_referral_specialty IS
    'Specialty referred to, if disposition is onward_referral.';
COMMENT ON COLUMN assessment_followup.followup_notes IS
    'Free-text clinician notes about the follow-up plan.';
COMMENT ON COLUMN assessment_followup.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN assessment_followup.updated_at IS
    'Timestamp when this row was updated.';
