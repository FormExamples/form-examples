-- Clinician employee information provided by the employer.

CREATE TABLE medical_records_release_permission.clinician (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ( 'anaesthetist', 'surgeon', 'preop-nurse', 'perioperative-physician', 'geriatrician', 'pharmacist', 'other', '' )),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12)UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON medical_records_release_permission.clinician
    FOR EACH ROW
    EXECUTE FUNCTION medical_records_release_permission.set_updated_at();

COMMENT ON TABLE medical_records_release_permission.clinician IS
    'Clinician';
COMMENT ON COLUMN medical_records_release_permission.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_records_release_permission.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_records_release_permission.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_records_release_permission.clinician.name IS
    'Name.';
COMMENT ON COLUMN medical_records_release_permission.clinician.email IS
    'Email address.';
COMMENT ON COLUMN medical_records_release_permission.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN medical_records_release_permission.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_records_release_permission.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN medical_records_release_permission.clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN medical_records_release_permission.clinician.role IS
    'Clinician role.';
COMMENT ON COLUMN medical_records_release_permission.clinician.registration_body IS
    'Clinician registration body.';
COMMENT ON COLUMN medical_records_release_permission.clinician.registration_number IS
    'Clinician registration number.';
COMMENT ON COLUMN medical_records_release_permission.clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX clinician_index_gto
    ON medical_records_release_permission.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON COLUMN medical_records_release_permission.clinician.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
