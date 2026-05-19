-- Patient demographic information.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    employer_name TEXT,
    occupation TEXT
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient who is the subject of the fit note.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Full name as recorded on the fit note.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth, optional on Med 3 if NHS number is supplied.';
COMMENT ON COLUMN patient.email IS
    'Email address for digital fit-note delivery.';
COMMENT ON COLUMN patient.phone IS
    'Phone number.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Postal address as a single block of text.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 code (typically GB).';
COMMENT ON COLUMN patient.postcode IS
    'Postal code for address validation.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN patient.employer_name IS
    'Patient-reported employer name, useful for occupational-health triage.';
COMMENT ON COLUMN patient.occupation IS
    'Patient-reported occupation, supports tailoring of workplace adaptations.';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
