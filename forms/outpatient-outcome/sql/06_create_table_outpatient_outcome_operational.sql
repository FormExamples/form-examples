CREATE TABLE outpatient_outcome_operational (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    referral_date DATE,
    appointment_date DATE,
    wait_time_days INTEGER,
    service_target_days INTEGER,
    nhs_attendance_outcome VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (nhs_attendance_outcome IN (
            'attended',
            'attended_late_seen',
            'attended_late_not_seen',
            'did_not_attend',
            'cancelled_by_patient',
            'cancelled_by_provider',
            'rebooked',
            ''
        ))

);

CREATE TRIGGER trigger_outpatient_outcome_operational_updated_at
    BEFORE UPDATE ON outpatient_outcome_operational
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_operational IS
    'Operational efficiency data: referral-to-appointment wait time vs service target, NHS Attendance Outcome code.';
COMMENT ON COLUMN outpatient_outcome_operational.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_operational.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_operational.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_operational.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_operational.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_operational.referral_date IS
    'Date the patient was referred to the outpatient service.';
COMMENT ON COLUMN outpatient_outcome_operational.appointment_date IS
    'Date of the appointment the patient attended (or was booked for).';
COMMENT ON COLUMN outpatient_outcome_operational.wait_time_days IS
    'Days between referral and appointment; null if unknown.';
COMMENT ON COLUMN outpatient_outcome_operational.service_target_days IS
    'Service-level-agreement target wait time in days; null if not set.';
COMMENT ON COLUMN outpatient_outcome_operational.nhs_attendance_outcome IS
    'NHS Data Dictionary Attendance Outcome classification.';
