-- Patient demographic information

CREATE TABLE pulmonary_function_test_result.patient (
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
    sex_at_birth VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (sex_at_birth IN ('female', 'male', 'other', '')),
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON pulmonary_function_test_result.patient
    FOR EACH ROW
    EXECUTE FUNCTION pulmonary_function_test_result.set_updated_at();

COMMENT ON TABLE pulmonary_function_test_result.patient IS
    'Patient';
COMMENT ON COLUMN pulmonary_function_test_result.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.name IS
    'Name.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.birth_date IS
    'Birth date.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.email IS
    'Email address.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.sex_at_birth IS
    'Sex at birth: female, male, other. Required for lung-function reference equations (GLI) used to derive percent-predicted and z-scores.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.height_as_cm IS
    'Standing height measurement in cm, required for lung-function reference equations.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.weight_as_kg IS
    'Weight as kg.';
COMMENT ON COLUMN pulmonary_function_test_result.patient.body_mass_index IS
    'Body mass index (BMI) measurement.';

CREATE INDEX patient_index_gto
    ON pulmonary_function_test_result.patient
    USING GIN ((
        name
    ) gin_trgm_ops);
