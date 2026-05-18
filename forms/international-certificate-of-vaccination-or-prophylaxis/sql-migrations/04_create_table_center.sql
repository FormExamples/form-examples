-- WHO-designated vaccination centre that administers vaccinations and
-- validates each entry on the certificate with its uniform stamp.
-- For yellow fever, the centre must be designated by the national health
-- authority and listed in WHO records.

CREATE TABLE center (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    who_designation_reference VARCHAR(50) NOT NULL DEFAULT '',
    national_authority_reference VARCHAR(50) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    country_as_iso_3166_1_alpha_3 CHAR(3),
    postcode TEXT,
    uniform_stamp_image_data_url TEXT NOT NULL DEFAULT '',
    authorised_diseases TEXT NOT NULL DEFAULT 'yellow-fever',
    designation_valid_from DATE,
    designation_valid_until DATE
);

CREATE TRIGGER trigger_center_updated_at
    BEFORE UPDATE ON center
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE center IS
    'WHO-designated vaccination centre that administers vaccinations and validates each certificate entry with its uniform stamp.';
COMMENT ON COLUMN center.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN center.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN center.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN center.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN center.name IS
    'Official name of the vaccination centre.';
COMMENT ON COLUMN center.who_designation_reference IS
    'WHO designation reference number, if listed in the WHO directory of yellow fever vaccinating centres.';
COMMENT ON COLUMN center.national_authority_reference IS
    'Reference issued by the national health authority designating this centre.';
COMMENT ON COLUMN center.email IS
    'Email address.';
COMMENT ON COLUMN center.phone IS
    'Phone number.';
COMMENT ON COLUMN center.postal_address_as_full_text IS
    'Postal address as full free-text.';
COMMENT ON COLUMN center.country_as_iso_3166_1_alpha_2 IS
    'Country of the centre as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN center.country_as_iso_3166_1_alpha_3 IS
    'Country of the centre as ISO 3166-1 alpha-3 (WHO model uses three-letter form).';
COMMENT ON COLUMN center.postcode IS
    'Postal code for the centre address.';
COMMENT ON COLUMN center.uniform_stamp_image_data_url IS
    'Reference image of the uniform stamp captured as a data URL.';
COMMENT ON COLUMN center.authorised_diseases IS
    'Space-separated list of disease codes the centre is authorised to vaccinate against (default yellow-fever).';
COMMENT ON COLUMN center.designation_valid_from IS
    'Start date of the current WHO designation.';
COMMENT ON COLUMN center.designation_valid_until IS
    'End date of the current WHO designation.';

CREATE INDEX center_index_name_gto
    ON center
    USING GIN ((name) gin_trgm_ops);
