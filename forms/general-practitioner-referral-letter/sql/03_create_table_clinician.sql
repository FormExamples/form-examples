-- Clinician employee information used to identify the referring
-- clinician who authored the general-practitioner referral letter.

CREATE TABLE general_practitioner_referral_letter.clinician (
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
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('gp', 'gp-registrar', 'nurse-practitioner', 'pharmacist', 'paramedic', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON general_practitioner_referral_letter.clinician
    FOR EACH ROW
    EXECUTE FUNCTION general_practitioner_referral_letter.set_updated_at();

COMMENT ON TABLE general_practitioner_referral_letter.clinician IS
    'Clinician identifying information for the referring clinician who authored the referral letter.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.name IS
    'Referring clinician full name.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.email IS
    'Email address.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.role IS
    'Referrer role: gp, gp-registrar, nurse-practitioner, pharmacist, paramedic, or other.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN general_practitioner_referral_letter.clinician.registration_number IS
    'Professional registration number (GMC / NMC / GPhC) issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON general_practitioner_referral_letter.clinician
    USING GIN (name gin_trgm_ops);
