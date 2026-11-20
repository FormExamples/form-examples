-- The informant: the person who attends the register office to give the
-- particulars of the death. A qualified informant is defined by section 16
-- of the Births and Deaths Registration Act 1953.

CREATE TABLE united_kingdom_death_registration.informant (
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
    relationship VARCHAR(40) NOT NULL DEFAULT '' CHECK (relationship IN ('relative-present-at-death', 'relative-in-attendance', 'relative-in-district', 'person-present-at-death', 'occupier-of-premises', 'person-arranging-funeral', 'not-qualified', ''))
);

CREATE TRIGGER trigger_informant_updated_at
    BEFORE UPDATE ON united_kingdom_death_registration.informant
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_death_registration.set_updated_at();

COMMENT ON TABLE united_kingdom_death_registration.informant IS
    'The informant who gives the particulars of the death to the registrar.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.name IS
    'Full name of the informant.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_death_registration.informant.relationship IS
    'Basis on which the person is an informant: a qualified category under section 16 of the 1953 Act, or not-qualified.';
