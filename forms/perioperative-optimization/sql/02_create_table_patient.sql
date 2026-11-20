-- Patient demographic information and anthropometrics.

CREATE TABLE perioperative_optimization.patient (
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
    BEFORE UPDATE ON perioperative_optimization.patient
    FOR EACH ROW
    EXECUTE FUNCTION perioperative_optimization.set_updated_at();

COMMENT ON TABLE perioperative_optimization.patient IS
    'Patient.';
COMMENT ON COLUMN perioperative_optimization.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN perioperative_optimization.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN perioperative_optimization.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN perioperative_optimization.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN perioperative_optimization.patient.name IS
    'Name.';
COMMENT ON COLUMN perioperative_optimization.patient.birth_date IS
    'Birth date, such as for calculating age and for the paediatric safety flag.';
COMMENT ON COLUMN perioperative_optimization.patient.sex IS
    'Sex, such as for sex-adjusted hand-grip strength cut-offs.';
COMMENT ON COLUMN perioperative_optimization.patient.email IS
    'Email address.';
COMMENT ON COLUMN perioperative_optimization.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN perioperative_optimization.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN perioperative_optimization.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN perioperative_optimization.patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN perioperative_optimization.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN perioperative_optimization.patient.height_as_cm IS
    'Height measurement in cm, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN perioperative_optimization.patient.weight_as_kg IS
    'Weight measurement in kg, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN perioperative_optimization.patient.body_mass_index IS
    'Body mass index (BMI) measurement, i.e. weight in kg divided by the square of height in metres.';
COMMENT ON COLUMN perioperative_optimization.patient.waist_as_cm IS
    'Waist circumference measurement in cm, such as for calculating waist-height ratio (WHR).';
COMMENT ON COLUMN perioperative_optimization.patient.mid_upper_arm_circumference_as_cm IS
    'Mid-upper-arm circumference (MUAC) measurement in cm, such as for estimating the MUST body mass index component when weighing is declined or impractical.';
COMMENT ON COLUMN perioperative_optimization.patient.calf_circumference_as_cm IS
    'Calf circumference measurement in cm, such as for supporting the GLIM reduced-muscle-mass phenotypic criterion.';
COMMENT ON COLUMN perioperative_optimization.patient.preferred_language IS
    'Preferred language, such as for deciding whether an interpreter is required.';
COMMENT ON COLUMN perioperative_optimization.patient.ethnicity IS
    'Ethnicity, such as for interpreting body mass index thresholds and for cultural dietary requirements.';

CREATE INDEX patient_index_gto
    ON perioperative_optimization.patient
    USING GIN ((
        name
    ) gin_trgm_ops);
