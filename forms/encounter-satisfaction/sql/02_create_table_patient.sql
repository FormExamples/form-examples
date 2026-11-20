-- Patient demographic information

CREATE TABLE encounter_satisfaction.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    waist_as_cm NUMERIC(5,1),
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    waist_height_ratio NUMERIC(4,1),
    vo2_max  NUMERIC(4,1)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON encounter_satisfaction.patient
    FOR EACH ROW
    EXECUTE FUNCTION encounter_satisfaction.set_updated_at();

COMMENT ON TABLE encounter_satisfaction.patient IS
    'Patient';
COMMENT ON COLUMN encounter_satisfaction.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN encounter_satisfaction.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN encounter_satisfaction.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN encounter_satisfaction.patient.updated_at IS
    'Timestamp when the record was deleted a.k.a. soft-deleted.';
COMMENT ON COLUMN encounter_satisfaction.patient.name IS
    'Name.';
COMMENT ON COLUMN encounter_satisfaction.patient.birth_date IS
    'Birth date.';
COMMENT ON COLUMN encounter_satisfaction.patient.email IS
    'Email address.';
COMMENT ON COLUMN encounter_satisfaction.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN encounter_satisfaction.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN encounter_satisfaction.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN encounter_satisfaction.patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN encounter_satisfaction.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN encounter_satisfaction.patient.waist_as_cm IS
    'Waist circumference measurement in cm, such as for calculating waist-height ratio (WHR).';
COMMENT ON COLUMN encounter_satisfaction.patient.height_as_cm IS
    'Height measurement in cm, such as for calculating waist-height ratio (WHR).';
COMMENT ON COLUMN encounter_satisfaction.patient.body_mass_index IS
    'Body mass index (BMI) measurement.';
COMMENT ON COLUMN encounter_satisfaction.patient.waist_height_ratio IS
    'Waist-height ratio (WHR) measurement.';
COMMENT ON COLUMN encounter_satisfaction.patient.vo2_max IS
    'VO2 max measurement.';

CREATE INDEX patient_index_gto
    ON encounter_satisfaction.patient
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON COLUMN encounter_satisfaction.patient.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN encounter_satisfaction.patient.weight_as_kg IS
    'Weight as kg.';
