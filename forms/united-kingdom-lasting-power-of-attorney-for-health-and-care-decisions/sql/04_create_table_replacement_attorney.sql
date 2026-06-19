-- Replacement attorney: stands in if a named attorney is unable or unwilling
-- to act. Same statutory requirements as a primary attorney.

CREATE TABLE replacement_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title VARCHAR(20) NOT NULL DEFAULT '',
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    family_name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2) NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    relationship_to_donor VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (relationship_to_donor IN (
            'spouse', 'civil-partner', 'child', 'parent', 'sibling',
            'friend', 'professional', 'other', ''
        )),
    is_bankrupt VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_bankrupt IN ('yes', 'no', '')),
    capacity_declared VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (capacity_declared IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_replacement_attorney_updated_at
    BEFORE UPDATE ON replacement_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE replacement_attorney IS
    'Replacement attorney: steps in if a primary attorney cannot act. Same MCA 2005 s.10 eligibility rules apply.';
COMMENT ON COLUMN replacement_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN replacement_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN replacement_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN replacement_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN replacement_attorney.title IS
    'Honorific title.';
COMMENT ON COLUMN replacement_attorney.given_names IS
    'Given names.';
COMMENT ON COLUMN replacement_attorney.family_name IS
    'Family name.';
COMMENT ON COLUMN replacement_attorney.birth_date IS
    'Date of birth. Used to verify age ≥ 18.';
COMMENT ON COLUMN replacement_attorney.email IS
    'Email address.';
COMMENT ON COLUMN replacement_attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN replacement_attorney.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN replacement_attorney.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN replacement_attorney.postcode IS
    'Postal code.';
COMMENT ON COLUMN replacement_attorney.relationship_to_donor IS
    'Stated relationship to the donor.';
COMMENT ON COLUMN replacement_attorney.is_bankrupt IS
    'Whether the replacement attorney is currently bankrupt.';
COMMENT ON COLUMN replacement_attorney.capacity_declared IS
    'Whether the replacement attorney has declared capacity to act.';
