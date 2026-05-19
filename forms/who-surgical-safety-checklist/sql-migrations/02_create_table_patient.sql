-- Patient demographic information.

CREATE TABLE patient (
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
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient receiving the surgical procedure.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when this row was deleted (soft delete).';
COMMENT ON COLUMN patient.name IS
    'Patient full name as recorded on the consent form.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN patient.sex IS
    'Recorded sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN patient.medical_record_number IS
    'Local medical record number (MRN) at the operating facility.';
COMMENT ON COLUMN patient.weight_as_kg IS
    'Patient weight in kilograms, used for the paediatric blood-loss threshold (7 ml/kg).';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
