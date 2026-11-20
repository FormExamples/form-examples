-- Attorney (or court self-help facilitator) who prepares the petition; optional
-- because many petitioners file pro se.

CREATE TABLE united_states_divorce_petition.attorney (
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
    BEFORE UPDATE ON united_states_divorce_petition.attorney
    FOR EACH ROW
    EXECUTE FUNCTION united_states_divorce_petition.set_updated_at();

COMMENT ON TABLE united_states_divorce_petition.attorney IS
    'Attorney or court self-help facilitator who prepares the petition; optional because many petitioners file pro se.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.name IS
    'Full name of the attorney or self-help facilitator preparing the petition.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.email IS
    'Email address.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.bar_state_as_usps_code IS
    'Two-letter USPS code of the state bar that admitted the attorney.';
COMMENT ON COLUMN united_states_divorce_petition.attorney.bar_number IS
    'State bar number; empty for a self-represented filer.';
