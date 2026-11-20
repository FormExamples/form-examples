-- Patient demographic information.

CREATE TABLE cataract_diagnostic_evaluation.patient (
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
    united_kingdom_nhs_number VARCHAR(20) UNIQUE
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON cataract_diagnostic_evaluation.patient
    FOR EACH ROW
    EXECUTE FUNCTION cataract_diagnostic_evaluation.set_updated_at();

COMMENT ON TABLE cataract_diagnostic_evaluation.patient IS
    'Patient.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.name IS
    'Name.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.birth_date IS
    'Birth date, such as for calculating age and for the paediatric safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.sex IS
    'Sex.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.email IS
    'Email address.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX patient_index_gto
    ON cataract_diagnostic_evaluation.patient
    USING GIN ((
        name
    ) gin_trgm_ops);
