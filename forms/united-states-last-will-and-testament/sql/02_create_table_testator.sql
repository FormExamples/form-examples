-- Testator: the person making the will, with contact details and the
-- state of domicile whose law governs the will.

CREATE TABLE united_states_last_will_and_testament.testator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state VARCHAR(2),
    postcode TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    citizenship_status VARCHAR(18) NOT NULL DEFAULT '' CHECK (citizenship_status IN ('us-citizen', 'us-resident-alien', 'non-resident-alien', 'unknown', ''))
);

CREATE INDEX testator_name_trgm_idx
    ON united_states_last_will_and_testament.testator
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_testator_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament.testator
    FOR EACH ROW
    EXECUTE FUNCTION united_states_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament.testator IS
    'Testator: the person making the will, with contact details, state of domicile, and citizenship status.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.name IS
    'Full legal name of the testator.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.birth_date IS
    'Date of birth of the testator.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.email IS
    'Email address.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.state IS
    'Two-letter US state or territory code of domicile.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.postcode IS
    'ZIP or postal code.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_states_last_will_and_testament.testator.citizenship_status IS
    'Citizenship status for estate-tax purposes: us-citizen, us-resident-alien, non-resident-alien, or unknown.';
