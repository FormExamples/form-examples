-- Certificate provider: the independent person who certifies the donor
-- understands the LPA and is not under undue pressure.
-- Lasting Powers of Attorney Regulations 2007 Sch.1 Pt.2: must be either
-- (a) skill-based (registered profession), or
-- (b) knowledge-based (known the donor personally for ≥ 2 years).
-- Must not be a family member, business partner, or employee of the donor
-- or any attorney; must not be an attorney.

CREATE TABLE certificate_provider (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title VARCHAR(20) NOT NULL DEFAULT '',
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    family_name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2) NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    route VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (route IN ('skill-based', 'knowledge-based', '')),
    profession VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (profession IN (
            'solicitor', 'barrister', 'general-practitioner', 'consultant',
            'registered-nurse', 'registered-social-worker', 'imca',
            'psychiatrist', 'psychologist', 'other-registered-professional', ''
        )),
    profession_registration_number VARCHAR(50) NOT NULL DEFAULT '',
    years_known_donor NUMERIC(4,1),
    relationship_to_donor VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (relationship_to_donor IN (
            'professional', 'friend', 'colleague', 'neighbour', 'other', ''
        )),
    declared_not_family VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (declared_not_family IN ('yes', 'no', '')),
    declared_not_employee VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (declared_not_employee IN ('yes', 'no', '')),
    declared_not_attorney VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (declared_not_attorney IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_certificate_provider_updated_at
    BEFORE UPDATE ON certificate_provider
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE certificate_provider IS
    'Independent certificate provider per Lasting Powers of Attorney Regulations 2007 Sch.1 Pt.2.';
COMMENT ON COLUMN certificate_provider.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN certificate_provider.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN certificate_provider.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN certificate_provider.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN certificate_provider.title IS
    'Honorific title.';
COMMENT ON COLUMN certificate_provider.given_names IS
    'Given names.';
COMMENT ON COLUMN certificate_provider.family_name IS
    'Family name.';
COMMENT ON COLUMN certificate_provider.email IS
    'Email address.';
COMMENT ON COLUMN certificate_provider.phone IS
    'Phone number.';
COMMENT ON COLUMN certificate_provider.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN certificate_provider.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN certificate_provider.postcode IS
    'Postal code.';
COMMENT ON COLUMN certificate_provider.route IS
    'Eligibility route: skill-based (registered profession) or knowledge-based (known donor ≥ 2 years).';
COMMENT ON COLUMN certificate_provider.profession IS
    'Profession when route = skill-based.';
COMMENT ON COLUMN certificate_provider.profession_registration_number IS
    'Professional registration number (e.g. SRA, GMC, NMC, HCPC number).';
COMMENT ON COLUMN certificate_provider.years_known_donor IS
    'Years known the donor personally. Must be ≥ 2 when route = knowledge-based (R-MCA-CP-ROUTE).';
COMMENT ON COLUMN certificate_provider.relationship_to_donor IS
    'Nature of the relationship with the donor.';
COMMENT ON COLUMN certificate_provider.declared_not_family IS
    'Self-declaration that the certificate provider is not a family member of donor or attorney (R-MCA-CP-FAM).';
COMMENT ON COLUMN certificate_provider.declared_not_employee IS
    'Self-declaration that the certificate provider is not a business partner or employee of donor or attorney (R-MCA-CP-EMP).';
COMMENT ON COLUMN certificate_provider.declared_not_attorney IS
    'Self-declaration that the certificate provider is not an attorney named in this LPA.';
