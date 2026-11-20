-- Applicant demographic information for the person who needs a Social
-- Security card.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    us_state_code VARCHAR(2) NOT NULL DEFAULT '' CHECK (char_length(us_state_code) IN (0, 2))
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Applicant demographic information for the person who needs a Social Security card. The Social Security number is never stored.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Full name of the applicant.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN patient.sex IS
    'Sex recorded for the applicant: female, male, other, or unknown.';
COMMENT ON COLUMN patient.email IS
    'Email address.';
COMMENT ON COLUMN patient.phone IS
    'Phone number.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN patient.postcode IS
    'Postal code (ZIP code).';
COMMENT ON COLUMN patient.us_state_code IS
    'Two-letter USPS code of the state or territory of residence.';

CREATE INDEX patient_name_trgm_idx
    ON patient
    USING GIN (name gin_trgm_ops);
