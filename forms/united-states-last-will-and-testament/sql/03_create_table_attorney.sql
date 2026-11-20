-- Attorney: the licensed attorney who drafts or supervises the will.

CREATE TABLE attorney (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('drafting-attorney', 'supervising-attorney', 'reviewing-attorney', 'other', '')),
    bar_state VARCHAR(2) NOT NULL DEFAULT '',
    bar_number TEXT NOT NULL DEFAULT ''
);

CREATE INDEX attorney_name_trgm_idx
    ON attorney
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_attorney_updated_at
    BEFORE UPDATE ON attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE attorney IS
    'Attorney who drafts, supervises, or reviews the will, with bar admission details.';
COMMENT ON COLUMN attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN attorney.name IS
    'Full name of the attorney.';
COMMENT ON COLUMN attorney.email IS
    'Email address.';
COMMENT ON COLUMN attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN attorney.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN attorney.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN attorney.postcode IS
    'ZIP or postal code.';
COMMENT ON COLUMN attorney.role IS
    'Role on this will: drafting-attorney, supervising-attorney, reviewing-attorney, or other.';
COMMENT ON COLUMN attorney.bar_state IS
    'Two-letter state of bar admission.';
COMMENT ON COLUMN attorney.bar_number IS
    'State bar number.';
