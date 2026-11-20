-- The billing authority (local council in England) that receives the
-- application and decides eligibility.

CREATE TABLE billing_authority (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    gss_code VARCHAR(20),
    email TEXT,
    phone TEXT,
    website_url TEXT
);

CREATE TRIGGER trigger_billing_authority_updated_at
    BEFORE UPDATE ON billing_authority
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE billing_authority IS
    'The billing authority (local council in England) that receives the application and decides eligibility.';
COMMENT ON COLUMN billing_authority.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN billing_authority.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN billing_authority.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN billing_authority.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN billing_authority.name IS
    'Name of the billing authority.';
COMMENT ON COLUMN billing_authority.gss_code IS
    'Office for National Statistics GSS code of the authority.';
COMMENT ON COLUMN billing_authority.email IS
    'Council Tax team email address.';
COMMENT ON COLUMN billing_authority.phone IS
    'Council Tax team phone number.';
COMMENT ON COLUMN billing_authority.website_url IS
    'Council Tax web page of the authority.';

CREATE INDEX billing_authority_name_trgm_idx
    ON billing_authority
    USING GIN (name gin_trgm_ops);
