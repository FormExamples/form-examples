-- Attorney: the licensed attorney who drafts or supervises the will.

CREATE TABLE united_states_last_will_and_testament.attorney (
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
    ON united_states_last_will_and_testament.attorney
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_attorney_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament.attorney
    FOR EACH ROW
    EXECUTE FUNCTION united_states_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament.attorney IS
    'Attorney who drafts, supervises, or reviews the will, with bar admission details.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.name IS
    'Full name of the attorney.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.email IS
    'Email address.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.postcode IS
    'ZIP or postal code.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.role IS
    'Role on this will: drafting-attorney, supervising-attorney, reviewing-attorney, or other.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.bar_state IS
    'Two-letter state of bar admission.';
COMMENT ON COLUMN united_states_last_will_and_testament.attorney.bar_number IS
    'State bar number.';
