-- Patient demographic information and anthropometrics.

CREATE TABLE hernia_diagnostic_evaluation.patient (
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
    body_mass_index NUMERIC(4,1)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON hernia_diagnostic_evaluation.patient
    FOR EACH ROW
    EXECUTE FUNCTION hernia_diagnostic_evaluation.set_updated_at();

COMMENT ON TABLE hernia_diagnostic_evaluation.patient IS
    'Patient.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.name IS
    'Name.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.birth_date IS
    'Birth date, such as for calculating age and for the paediatric safety flag.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.sex IS
    'Sex, such as for interpreting groin-hernia epidemiology.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.email IS
    'Email address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.height_as_cm IS
    'Height measurement in cm, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.weight_as_kg IS
    'Weight measurement in kg, such as for calculating body mass index (BMI).';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient.body_mass_index IS
    'Body mass index (BMI) measurement, such as for supporting the obesity risk-factor field.';

CREATE INDEX patient_index_gto
    ON hernia_diagnostic_evaluation.patient
    USING GIN ((
        name
    ) gin_trgm_ops);
