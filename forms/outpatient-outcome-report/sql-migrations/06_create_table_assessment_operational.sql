CREATE TABLE assessment_operational (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

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
        )),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_assessment_operational_updated_at
    BEFORE UPDATE ON assessment_operational
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessment_operational IS
    'Operational efficiency data: referral-to-appointment wait time vs service target, NHS Attendance Outcome code.';
COMMENT ON COLUMN assessment_operational.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessment_operational.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN assessment_operational.referral_date IS
    'Date the patient was referred to the outpatient service.';
COMMENT ON COLUMN assessment_operational.appointment_date IS
    'Date of the appointment the patient attended (or was booked for).';
COMMENT ON COLUMN assessment_operational.wait_time_days IS
    'Days between referral and appointment; null if unknown.';
COMMENT ON COLUMN assessment_operational.service_target_days IS
    'Service-level-agreement target wait time in days; null if not set.';
COMMENT ON COLUMN assessment_operational.nhs_attendance_outcome IS
    'NHS Data Dictionary Attendance Outcome classification.';
COMMENT ON COLUMN assessment_operational.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN assessment_operational.updated_at IS
    'Timestamp when this row was updated.';
