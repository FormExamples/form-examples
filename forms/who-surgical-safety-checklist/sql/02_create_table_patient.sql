-- Patient demographic information.

CREATE TABLE who_surgical_safety_checklist.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    sex VARCHAR(10) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    medical_record_number VARCHAR(50),
    weight_as_kg NUMERIC(5,1)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON who_surgical_safety_checklist.patient
    FOR EACH ROW
    EXECUTE FUNCTION who_surgical_safety_checklist.set_updated_at();

COMMENT ON TABLE who_surgical_safety_checklist.patient IS
    'Patient receiving the surgical procedure.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.deleted_at IS
    'Timestamp when this row was deleted (soft delete).';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.name IS
    'Patient full name as recorded on the consent form.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.sex IS
    'Recorded sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.medical_record_number IS
    'Local medical record number (MRN) at the operating facility.';
COMMENT ON COLUMN who_surgical_safety_checklist.patient.weight_as_kg IS
    'Patient weight in kilograms, used for the paediatric blood-loss threshold (7 ml/kg).';

CREATE INDEX patient_index_gto
    ON who_surgical_safety_checklist.patient
    USING GIN ((
        name
    ) gin_trgm_ops);
