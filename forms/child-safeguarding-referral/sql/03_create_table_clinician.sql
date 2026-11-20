-- Referrer information used to identify the professional making the
-- safeguarding referral to children's social care.

CREATE TABLE child_safeguarding_referral.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('education', 'health', 'social-care', 'police', 'early-years', 'allied-health', 'voluntary-sector', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'SWE', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON child_safeguarding_referral.clinician
    FOR EACH ROW
    EXECUTE FUNCTION child_safeguarding_referral.set_updated_at();

COMMENT ON TABLE child_safeguarding_referral.clinician IS
    'Referrer identifying information for the professional making the child safeguarding referral.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.name IS
    'Referrer full name.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.email IS
    'Referrer email address.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.phone IS
    'Referrer phone number.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.role IS
    'Referrer professional sector: education, health, social-care, police, early-years, allied-health, voluntary-sector, or other.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.registration_body IS
    'Professional registration body, where applicable: GMC, NMC, HCPC, GPhC, SWE, or other.';
COMMENT ON COLUMN child_safeguarding_referral.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON child_safeguarding_referral.clinician
    USING GIN (name gin_trgm_ops);
