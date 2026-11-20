-- The principal: the person who signs the durable power of attorney and whose
-- property and finances the agent will manage.

CREATE TABLE united_states_durable_financial_power_of_attorney.principal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state_as_iso_3166_2_us CHAR(2),
    country_as_iso_3166_1_alpha_2 CHAR(2) DEFAULT 'US',
    postcode TEXT
);

CREATE INDEX principal_name_trgm_idx
    ON united_states_durable_financial_power_of_attorney.principal
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_principal_updated_at
    BEFORE UPDATE ON united_states_durable_financial_power_of_attorney.principal
    FOR EACH ROW
    EXECUTE FUNCTION united_states_durable_financial_power_of_attorney.set_updated_at();

COMMENT ON TABLE united_states_durable_financial_power_of_attorney.principal IS
    'The principal: the person who signs the durable financial power of attorney.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.name IS
    'Full legal name of the principal.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.birth_date IS
    'Date of birth of the principal.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.email IS
    'Email address.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.state_as_iso_3166_2_us IS
    'Home state as the two-letter United States postal code.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal.postcode IS
    'ZIP code.';
