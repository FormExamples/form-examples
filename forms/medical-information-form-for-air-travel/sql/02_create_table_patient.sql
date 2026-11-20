-- Passenger demographic information (the MEDIF subject).

CREATE TABLE medical_information_form_for_air_travel.patient (
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
    BEFORE UPDATE ON medical_information_form_for_air_travel.patient
    FOR EACH ROW
    EXECUTE FUNCTION medical_information_form_for_air_travel.set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel.patient IS
    'Passenger (MEDIF subject) demographic and identity information.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.name IS
    'Passenger full legal name as on travel document.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.sex_at_birth IS
    'Sex at birth: female, male, intersex, or unknown.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.nationality_as_iso_3166_1_alpha_2 IS
    'Nationality as ISO 3166-1 alpha-2 country code.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.passport_number IS
    'Passport number used for the booking.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, if applicable.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.national_health_id IS
    'National health identifier other than UK NHS, if applicable.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.email IS
    'Email address.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.phone IS
    'Phone number including international dialling code.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.country_as_iso_3166_1_alpha_2 IS
    'Country of residence as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.postcode IS
    'Postal code of residence.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.emergency_contact_name IS
    'Emergency contact name.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.emergency_contact_relationship IS
    'Emergency contact relationship to the passenger.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.emergency_contact_phone IS
    'Emergency contact phone number.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.weight_as_kg IS
    'Body weight in kilograms (for stretcher / seat planning).';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient.height_as_cm IS
    'Body height in centimetres.';
