-- Attending physician who completes Part 2 of the MEDIF.

CREATE TABLE medical_information_form_for_air_travel.clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    specialty TEXT NOT NULL DEFAULT '',
    role VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (role IN (
            'general-practitioner',
            'cardiologist',
            'respirologist',
            'obstetrician',
            'oncologist',
            'travel-medicine-physician',
            'aeromedical-physician',
            'discharge-coordinator',
            'other',
            ''
        )),
    registration_body VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    clinic_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON medical_information_form_for_air_travel.clinician
    FOR EACH ROW
    EXECUTE FUNCTION medical_information_form_for_air_travel.set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel.clinician IS
    'Attending physician (MEDIF Part 2 author).';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.name IS
    'Attending physician name.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.specialty IS
    'Physician specialty (free text).';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.role IS
    'Role classification: general-practitioner, cardiologist, etc.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, other.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.registration_number IS
    'Professional registration number.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.clinic_name IS
    'Clinic or hospital name.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.email IS
    'Email address.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.phone IS
    'Phone number including international dialling code.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country of practice as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician.postcode IS
    'Postal code of the clinic.';
