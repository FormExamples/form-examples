-- Patient demographic information.

CREATE TABLE centor_score_for_streptococcal_pharyngitis.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    hospital_mrn VARCHAR(50),
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    allergies_summary TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON centor_score_for_streptococcal_pharyngitis.patient
    FOR EACH ROW
    EXECUTE FUNCTION centor_score_for_streptococcal_pharyngitis.set_updated_at();

COMMENT ON TABLE centor_score_for_streptococcal_pharyngitis.patient IS
    'Patient demographic information used by the Centor score assessment record.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.name IS
    'Full patient name.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.sex IS
    'Sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.email IS
    'Email address.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.hospital_mrn IS
    'Local hospital medical record number (MRN).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.height_as_cm IS
    'Height in centimetres.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.weight_as_kg IS
    'Weight in kilograms.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.body_mass_index IS
    'Body mass index (BMI), kg/m^2.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis.patient.allergies_summary IS
    'Free-text summary of known allergies.';

CREATE INDEX patient_name_trgm_idx
    ON centor_score_for_streptococcal_pharyngitis.patient
    USING GIN (name gin_trgm_ops);
