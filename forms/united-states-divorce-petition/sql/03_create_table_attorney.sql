-- Attorney (or court self-help facilitator) who prepares the petition; optional
-- because many petitioners file pro se.

CREATE TABLE attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    bar_state_as_usps_code VARCHAR(2),
    bar_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_attorney_updated_at
    BEFORE UPDATE ON attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE attorney IS
    'Attorney or court self-help facilitator who prepares the petition; optional because many petitioners file pro se.';
COMMENT ON COLUMN attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN attorney.name IS
    'Full name of the attorney or self-help facilitator preparing the petition.';
COMMENT ON COLUMN attorney.email IS
    'Email address.';
COMMENT ON COLUMN attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN attorney.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN attorney.bar_state_as_usps_code IS
    'Two-letter USPS code of the state bar that admitted the attorney.';
COMMENT ON COLUMN attorney.bar_number IS
    'State bar number; empty for a self-represented filer.';
