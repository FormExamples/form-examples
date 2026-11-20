-- Attorney: a person nominated by the donor to make health and welfare decisions
-- on their behalf once the LPA is registered and the donor has lost capacity.
-- Mental Capacity Act 2005 s.10: attorney must be ≥ 18 and have capacity.

CREATE TABLE united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney (
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

CREATE TRIGGER trigger_attorney_updated_at
    BEFORE UPDATE ON united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_power_of_attorney_for_health_and_care_decisions.set_updated_at();

COMMENT ON TABLE united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney IS
    'A person nominated as an attorney by the donor. Must be ≥ 18 with capacity per MCA 2005 s.10.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.title IS
    'Honorific title.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.given_names IS
    'Given names of the attorney.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.family_name IS
    'Family name of the attorney.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.birth_date IS
    'Date of birth. Used to verify attorney age ≥ 18 (R-MCA-ATT-AGE).';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.relationship_to_donor IS
    'Stated relationship to the donor.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.is_bankrupt IS
    'Whether the attorney is currently bankrupt. Informational for H&W LPAs (statutory bar applies only to property/financial LPAs).';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_health_and_care_decisions.attorney.capacity_declared IS
    'Whether the attorney has declared capacity to act.';
