-- Patient demographic information for the deceased whose cause of death
-- this death certificate records.

CREATE TABLE united_states_standard_certificate_of_death.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    hospital_mrn VARCHAR(50)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON united_states_standard_certificate_of_death.patient
    FOR EACH ROW
    EXECUTE FUNCTION united_states_standard_certificate_of_death.set_updated_at();

COMMENT ON TABLE united_states_standard_certificate_of_death.patient IS
    'Patient demographic information for the deceased whose cause of death this death certificate records.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.name IS
    'Full name of the deceased.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.birth_date IS
    'Date of birth of the deceased.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.sex IS
    'Sex recorded for the deceased: female, male, other, or unknown.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.email IS
    'Email address.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient.hospital_mrn IS
    'Local hospital medical record number (MRN).';

CREATE INDEX patient_name_trgm_idx
    ON united_states_standard_certificate_of_death.patient
    USING GIN (name gin_trgm_ops);
