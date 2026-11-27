-- Living donor demographics and identifiers.

CREATE TABLE medical_renal_living_donor_request.donor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    family_name VARCHAR(255) NOT NULL,
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    previous_name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE NOT NULL,
    sex VARCHAR(10) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    national_health_identifier VARCHAR(40) NOT NULL DEFAULT '',
    medical_record_number VARCHAR(40) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT
);

CREATE TRIGGER trigger_mrldr_donor_updated_at
    BEFORE UPDATE ON medical_renal_living_donor_request.donor
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_living_donor_request.set_updated_at();

COMMENT ON TABLE medical_renal_living_donor_request.donor IS
    'Living kidney donor.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.family_name IS
    'Family name (surname).';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.given_names IS
    'Given names (forenames).';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.previous_name IS
    'Previous name, if any; aids identity matching.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.birth_date IS
    'Birth date.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.sex IS
    'Sex recorded: female, male, other, unknown.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.national_health_identifier IS
    'National health identifier issued by the person''s health system, as free text.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.medical_record_number IS
    'Hospital or institution medical record number.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.email IS
    'Email address.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.phone IS
    'Phone number.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN medical_renal_living_donor_request.donor.postcode IS
    'Postal code, such as for validating the postal address.';

CREATE INDEX donor_index_gto
    ON medical_renal_living_donor_request.donor
    USING GIN ((
        family_name || ' ' || given_names
    ) gin_trgm_ops);
