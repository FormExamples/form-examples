-- Testator: the person making the will. Held separately so one testator can
-- have several will drafting records over time (a new will replaces an old one).

CREATE TABLE united_kingdom_last_will_and_testament.testator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT
);

CREATE TRIGGER trigger_testator_updated_at
    BEFORE UPDATE ON united_kingdom_last_will_and_testament.testator
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_kingdom_last_will_and_testament.testator IS
    'Testator: the person making the will, with contact details.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.name IS
    'Full legal name of the testator.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.birth_date IS
    'Date of birth of the testator; a testator must be 18 or over.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.testator.postcode IS
    'Postal code.';

CREATE INDEX testator_name_trgm_idx
    ON united_kingdom_last_will_and_testament.testator
    USING GIN (name gin_trgm_ops);
