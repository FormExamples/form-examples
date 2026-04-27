CREATE TABLE assessment_encounter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

    clinic_date DATE,
    specialty VARCHAR(100) NOT NULL DEFAULT '',
    clinician_id UUID REFERENCES clinician(id) ON DELETE SET NULL,
    modality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (modality IN ('in_person', 'telephone', 'video', '')),
    appointment_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (appointment_type IN ('new', 'follow_up', 'pifu', '')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_assessment_encounter_updated_at
    BEFORE UPDATE ON assessment_encounter
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessment_encounter IS
    'Outpatient encounter metadata: clinic date, specialty, clinician, modality, appointment type.';
COMMENT ON COLUMN assessment_encounter.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessment_encounter.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN assessment_encounter.clinic_date IS
    'Date of the outpatient clinic attendance.';
COMMENT ON COLUMN assessment_encounter.specialty IS
    'Clinical specialty (e.g., cardiology, orthopaedics).';
COMMENT ON COLUMN assessment_encounter.clinician_id IS
    'Foreign key to the clinician who saw the patient.';
COMMENT ON COLUMN assessment_encounter.modality IS
    'Consultation modality: in_person, telephone, video, or empty.';
COMMENT ON COLUMN assessment_encounter.appointment_type IS
    'Appointment type: new, follow_up, pifu (patient initiated follow up), or empty.';
COMMENT ON COLUMN assessment_encounter.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN assessment_encounter.updated_at IS
    'Timestamp when this row was updated.';
