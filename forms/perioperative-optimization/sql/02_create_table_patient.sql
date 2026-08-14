-- Patient demographic information and anthropometrics.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'prefer-not-to-say', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    waist_as_cm NUMERIC(5,1),
    mid_upper_arm_circumference_as_cm NUMERIC(4,1),
    calf_circumference_as_cm NUMERIC(4,1),
    preferred_language TEXT,
    ethnicity TEXT
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Name.';
COMMENT ON COLUMN patient.birth_date IS
    'Birth date, such as for calculating age and for the paediatric safety flag.';
COMMENT ON COLUMN patient.sex IS
    'Sex, such as for sex-adjusted hand-grip strength cut-offs.';
COMMENT ON COLUMN patient.email IS
    'Email address.';
COMMENT ON COLUMN patient.phone IS
    'Phone number.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN patient.height_as_cm IS
    'Height measurement in cm, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN patient.weight_as_kg IS
    'Weight measurement in kg, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN patient.body_mass_index IS
    'Body mass index (BMI) measurement, i.e. weight in kg divided by the square of height in metres.';
COMMENT ON COLUMN patient.waist_as_cm IS
    'Waist circumference measurement in cm, such as for calculating waist-height ratio (WHR).';
COMMENT ON COLUMN patient.mid_upper_arm_circumference_as_cm IS
    'Mid-upper-arm circumference (MUAC) measurement in cm, such as for estimating the MUST body mass index component when weighing is declined or impractical.';
COMMENT ON COLUMN patient.calf_circumference_as_cm IS
    'Calf circumference measurement in cm, such as for supporting the GLIM reduced-muscle-mass phenotypic criterion.';
COMMENT ON COLUMN patient.preferred_language IS
    'Preferred language, such as for deciding whether an interpreter is required.';
COMMENT ON COLUMN patient.ethnicity IS
    'Ethnicity, such as for interpreting body mass index thresholds and for cultural dietary requirements.';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
