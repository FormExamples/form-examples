CREATE TABLE outpatient_outcome_encounter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    clinic_date DATE,
    specialty VARCHAR(100) NOT NULL DEFAULT '',
    clinician_id UUID REFERENCES clinician(id) ON DELETE SET NULL,
    modality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (modality IN ('in_person', 'telephone', 'video', '')),
    appointment_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (appointment_type IN ('new', 'follow_up', 'pifu', ''))
);

CREATE TRIGGER trigger_outpatient_outcome_encounter_updated_at
    BEFORE UPDATE ON outpatient_outcome_encounter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_encounter IS
    'Outpatient encounter metadata: clinic date, specialty, clinician, modality, appointment type.';
COMMENT ON COLUMN outpatient_outcome_encounter.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_encounter.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_encounter.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_encounter.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_encounter.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_encounter.clinic_date IS
    'Date of the outpatient clinic attendance.';
COMMENT ON COLUMN outpatient_outcome_encounter.specialty IS
    'Clinical specialty (e.g., cardiology, orthopaedics).';
COMMENT ON COLUMN outpatient_outcome_encounter.clinician_id IS
    'Foreign key to the clinician who saw the patient.';
COMMENT ON COLUMN outpatient_outcome_encounter.modality IS
    'Consultation modality: in_person, telephone, video, or empty.';
COMMENT ON COLUMN outpatient_outcome_encounter.appointment_type IS
    'Appointment type: new, follow_up, pifu (patient initiated follow up), or empty.';
