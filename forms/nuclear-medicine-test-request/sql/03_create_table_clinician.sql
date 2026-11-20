-- Requesting clinician (referrer) information.

CREATE TABLE nuclear_medicine_test_request.clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('radiologist', 'nuclear-medicine-physician', 'oncologist', 'cardiologist', 'gp', 'technologist', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON nuclear_medicine_test_request.clinician
    FOR EACH ROW
    EXECUTE FUNCTION nuclear_medicine_test_request.set_updated_at();

COMMENT ON TABLE nuclear_medicine_test_request.clinician IS
    'Requesting clinician (referrer) who completes the nuclear medicine request.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.name IS
    'Name.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.email IS
    'Email address.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.role IS
    'Clinician role: radiologist, nuclear-medicine-physician, oncologist, cardiologist, gp, technologist, other.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.registration_body IS
    'Clinician registration body: GMC, NMC, HCPC, other.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.registration_number IS
    'Clinician registration number.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX clinician_index_gto
    ON nuclear_medicine_test_request.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
