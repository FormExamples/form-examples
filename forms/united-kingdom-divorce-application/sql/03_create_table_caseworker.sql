-- Caseworker information for the legal adviser or court officer who prepares or
-- checks this divorce or dissolution application.

CREATE TABLE caseworker (
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
    role VARCHAR(15) NOT NULL DEFAULT '' CHECK (role IN ('solicitor', 'legal-adviser', 'court-officer', 'mckenzie-friend', 'other', '')),
    registration_body VARCHAR(5) NOT NULL DEFAULT '' CHECK (registration_body IN ('SRA', 'CILEx', 'BSB', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_caseworker_updated_at
    BEFORE UPDATE ON caseworker
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE caseworker IS
    'Caseworker information for the legal adviser or court officer who prepares or checks the application.';
COMMENT ON COLUMN caseworker.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN caseworker.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN caseworker.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN caseworker.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN caseworker.name IS
    'Full name of the caseworker who prepares or checks the application.';
COMMENT ON COLUMN caseworker.email IS
    'Email address.';
COMMENT ON COLUMN caseworker.phone IS
    'Phone number.';
COMMENT ON COLUMN caseworker.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN caseworker.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN caseworker.postcode IS
    'Postal code.';
COMMENT ON COLUMN caseworker.role IS
    'Role of the caseworker: solicitor, legal-adviser, court-officer, mckenzie-friend, or other.';
COMMENT ON COLUMN caseworker.registration_body IS
    'Professional regulator: SRA, CILEx, BSB, or other.';
COMMENT ON COLUMN caseworker.registration_number IS
    'Professional registration number, where the caseworker is regulated.';
