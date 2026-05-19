-- Passenger demographic information (the MEDIF subject).

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    birth_date DATE,
    sex_at_birth VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (sex_at_birth IN ('female', 'male', 'intersex', 'unknown', '')),
    nationality_as_iso_3166_1_alpha_2 CHAR(2),
    passport_number TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE,
    national_health_id TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT NOT NULL DEFAULT '',
    emergency_contact_name TEXT NOT NULL DEFAULT '',
    emergency_contact_relationship TEXT NOT NULL DEFAULT '',
    emergency_contact_phone TEXT NOT NULL DEFAULT '',
    weight_as_kg NUMERIC(5,1),
    height_as_cm NUMERIC(5,1)
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Passenger (MEDIF subject) demographic and identity information.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Passenger full legal name as on travel document.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN patient.sex_at_birth IS
    'Sex at birth: female, male, intersex, or unknown.';
COMMENT ON COLUMN patient.nationality_as_iso_3166_1_alpha_2 IS
    'Nationality as ISO 3166-1 alpha-2 country code.';
COMMENT ON COLUMN patient.passport_number IS
    'Passport number used for the booking.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, if applicable.';
COMMENT ON COLUMN patient.national_health_id IS
    'National health identifier other than UK NHS, if applicable.';
COMMENT ON COLUMN patient.email IS
    'Email address.';
COMMENT ON COLUMN patient.phone IS
    'Phone number including international dialling code.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country of residence as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN patient.postcode IS
    'Postal code of residence.';
COMMENT ON COLUMN patient.emergency_contact_name IS
    'Emergency contact name.';
COMMENT ON COLUMN patient.emergency_contact_relationship IS
    'Emergency contact relationship to the passenger.';
COMMENT ON COLUMN patient.emergency_contact_phone IS
    'Emergency contact phone number.';
COMMENT ON COLUMN patient.weight_as_kg IS
    'Body weight in kilograms (for stretcher / seat planning).';
COMMENT ON COLUMN patient.height_as_cm IS
    'Body height in centimetres.';
