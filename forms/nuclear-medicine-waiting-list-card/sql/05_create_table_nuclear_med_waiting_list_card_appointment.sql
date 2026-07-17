-- Upcoming or scheduled appointment(s) attached to a waiting list card.

CREATE TABLE nuclear_med_waiting_list_card_appointment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    nuclear_med_waiting_list_card_id UUID NOT NULL
        REFERENCES nuclear_med_waiting_list_card(id) ON DELETE CASCADE,

    appointment_date DATE,
    appointment_time TIME,
    duration_minutes INTEGER
        CHECK (duration_minutes IS NULL OR duration_minutes BETWEEN 1 AND 1440),
    appointment_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (appointment_type IN (
            'first-outpatient',
            'follow-up',
            'pre-assessment',
            'diagnostic',
            'treatment',
            'procedure',
            'admission',
            'telephone',
            'video',
            'other',
            ''
        )),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    site_address TEXT NOT NULL DEFAULT '',
    clinic_name VARCHAR(255) NOT NULL DEFAULT '',
    room VARCHAR(100) NOT NULL DEFAULT '',
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_team VARCHAR(255) NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'confirmed', 'rebooked', 'cancelled', 'attended', 'did-not-attend')),
    travel_notes TEXT NOT NULL DEFAULT '',
    access_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_nuclear_med_waiting_list_card_appointment_updated_at
    BEFORE UPDATE ON nuclear_med_waiting_list_card_appointment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_nuclear_med_waiting_list_card_appointment_card_id
    ON nuclear_med_waiting_list_card_appointment(nuclear_med_waiting_list_card_id);

CREATE INDEX index_nuclear_med_waiting_list_card_appointment_date
    ON nuclear_med_waiting_list_card_appointment(appointment_date);

COMMENT ON TABLE nuclear_med_waiting_list_card_appointment IS
    'Scheduled or upcoming appointment attached to a waiting list card. A card may have zero or many appointments over its lifetime.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.nuclear_med_waiting_list_card_id IS
    'Foreign key to the parent waiting list card.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.appointment_date IS
    'Date of the appointment.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.appointment_time IS
    'Start time of the appointment.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.duration_minutes IS
    'Planned duration in minutes.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.appointment_type IS
    'Appointment type: first-outpatient, follow-up, pre-assessment, diagnostic, treatment, procedure, admission, telephone, video, other.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.site_name IS
    'Name of the site (hospital, clinic, or community location).';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.site_address IS
    'Postal address of the site, suitable for printing on a patient letter.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.clinic_name IS
    'Name of the clinic within the site.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.room IS
    'Room or location reference within the clinic.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.clinician_name IS
    'Name of the attending clinician, if known.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.clinician_team IS
    'Name of the clinical team, if assignment is by team rather than individual.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.status IS
    'Appointment status: scheduled, confirmed, rebooked, cancelled, attended, did-not-attend.';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.travel_notes IS
    'Free-text travel information for the patient (transport, parking).';
COMMENT ON COLUMN nuclear_med_waiting_list_card_appointment.access_notes IS
    'Free-text accessibility notes (step-free access, BSL interpreter booked, etc.).';
