-- Patient (applicant) demographic information.
--
-- The patient is the prospective holder of the medical exemption certificate.
-- The FP92A captures full UK postal address details and an NHS number so that
-- NHSBSA Bridge House can match the application to the patient record.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title TEXT NOT NULL DEFAULT '' CHECK (title IN ('Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Dr', 'Prof', 'Rev', 'Other', '')),
    surname VARCHAR(255) NOT NULL DEFAULT '',
    forenames VARCHAR(255) NOT NULL DEFAULT '',
    name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    sex TEXT NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    full_time_education VARCHAR(5) NOT NULL DEFAULT '' CHECK (full_time_education IN ('yes', 'no', '')),
    pregnancy_status TEXT NOT NULL DEFAULT '' CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'post-partum-within-12-months', ''))
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Applicant for the FP92A medical exemption certificate.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.title IS
    'Personal title prefix as printed on the FP92A.';
COMMENT ON COLUMN patient.surname IS
    'Family name (surname) as printed on the FP92A.';
COMMENT ON COLUMN patient.forenames IS
    'Given names (forenames) as printed on the FP92A.';
COMMENT ON COLUMN patient.name IS
    'Full display name composed from forenames + surname.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth - used to derive age and age-based exemption eligibility.';
COMMENT ON COLUMN patient.sex IS
    'Sex recorded on the NHS demographic record.';
COMMENT ON COLUMN patient.email IS
    'Optional email address for non-statutory contact.';
COMMENT ON COLUMN patient.phone IS
    'Optional telephone number.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Full UK postal address as printed on the FP92A.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 (expected GB for FP92A applicants).';
COMMENT ON COLUMN patient.postcode IS
    'UK postcode used by NHSBSA to validate the address.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'NHS number (10 digits, Modulus-11 checksum). Required for NHSBSA matching.';
COMMENT ON COLUMN patient.full_time_education IS
    'Whether a 16-18 year-old is in full-time education (age-exemption check).';
COMMENT ON COLUMN patient.pregnancy_status IS
    'Pregnancy / post-partum status used to redirect applicants to FW8.';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
