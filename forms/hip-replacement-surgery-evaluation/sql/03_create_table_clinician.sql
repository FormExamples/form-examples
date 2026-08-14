-- Clinician who conducts the hip-replacement surgery evaluation, i.e. an
-- orthopaedic surgeon or extended-scope physiotherapist in a joint-replacement
-- clinic.

CREATE TABLE clinician (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('orthopaedic-surgeon', 'extended-scope-physiotherapist', 'orthopaedic-registrar', 'nurse-practitioner', 'other', '')),
    gmc_number TEXT NOT NULL DEFAULT '',
    site_name TEXT NOT NULL DEFAULT '',
    employer TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician, i.e. the orthopaedic surgeon or extended-scope physiotherapist who conducts the hip-replacement surgery evaluation.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Name.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN clinician.role IS
    'Clinician role, i.e. the job role the practitioner holds in the joint-replacement clinic.';
COMMENT ON COLUMN clinician.gmc_number IS
    'General Medical Council (GMC) registration number, or the equivalent professional registration number for a non-medical practitioner such as an extended-scope physiotherapist.';
COMMENT ON COLUMN clinician.site_name IS
    'Site where the clinician usually practises, such as the hospital or joint-replacement clinic.';
COMMENT ON COLUMN clinician.employer IS
    'Employer, such as the NHS trust or health board.';

CREATE INDEX clinician_index_gto
    ON clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
