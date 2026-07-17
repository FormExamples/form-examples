-- Patient demographic information.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    preferred_language_as_iso_639_1 CHAR(2) NOT NULL DEFAULT '',
    interpreter_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (interpreter_required IN ('yes', 'no', '')),
    accessibility_needs TEXT NOT NULL DEFAULT '',
    preferred_contact_channel VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (preferred_contact_channel IN ('sms', 'email', 'phone', 'letter', 'nhs-app', ''))
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient placed on a oral and maxillofacial surgery waiting list.';
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
    'Birth date.';
COMMENT ON COLUMN patient.sex IS
    'Sex recorded for clinical purposes.';
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
COMMENT ON COLUMN patient.preferred_language_as_iso_639_1 IS
    'Preferred written / spoken language as ISO 639-1 two-letter code.';
COMMENT ON COLUMN patient.interpreter_required IS
    'Whether an interpreter is required for clinical communication.';
COMMENT ON COLUMN patient.accessibility_needs IS
    'Recorded accessibility needs (e.g. BSL, large print, easy read, step-free access).';
COMMENT ON COLUMN patient.preferred_contact_channel IS
    'Preferred channel for waiting-list and appointment communications.';
