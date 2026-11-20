-- The bank, credit union, or finance company that holds a security interest in
-- the vehicle and is named on the title as lienholder.

CREATE TABLE lienholder (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state_code VARCHAR(2) NOT NULL DEFAULT '',
    postcode TEXT,
    electronic_lien_identifier TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_lienholder_updated_at
    BEFORE UPDATE ON lienholder
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lienholder IS
    'The lienholder: the bank, credit union, or finance company holding a security interest in the vehicle.';
COMMENT ON COLUMN lienholder.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lienholder.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN lienholder.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN lienholder.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN lienholder.name IS
    'Exact name of the lienholder as it should print on the title.';
COMMENT ON COLUMN lienholder.email IS
    'Email address.';
COMMENT ON COLUMN lienholder.phone IS
    'Phone number.';
COMMENT ON COLUMN lienholder.postal_address_as_full_text IS
    'Lienholder mailing address as a single text block.';
COMMENT ON COLUMN lienholder.state_code IS
    'Two-letter code of the lienholder''s state.';
COMMENT ON COLUMN lienholder.postcode IS
    'ZIP code.';
COMMENT ON COLUMN lienholder.electronic_lien_identifier IS
    'Identifier the state assigns for electronic lien and title participation; empty when none.';
