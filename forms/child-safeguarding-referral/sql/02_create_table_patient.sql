-- Child demographic information for the safeguarding referral. The
-- "patient" is the child the referral concerns.

CREATE TABLE child_safeguarding_referral.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    hospital_mrn VARCHAR(50),
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    allergies_summary TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON child_safeguarding_referral.patient
    FOR EACH ROW
    EXECUTE FUNCTION child_safeguarding_referral.set_updated_at();

COMMENT ON TABLE child_safeguarding_referral.patient IS
    'Child demographic information for the child the safeguarding referral concerns.';
COMMENT ON COLUMN child_safeguarding_referral.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_safeguarding_referral.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN child_safeguarding_referral.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN child_safeguarding_referral.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN child_safeguarding_referral.patient.name IS
    'Full name of the child.';
COMMENT ON COLUMN child_safeguarding_referral.patient.birth_date IS
    'Date of birth of the child.';
COMMENT ON COLUMN child_safeguarding_referral.patient.sex IS
    'Sex recorded for the child: female, male, intersex, or unknown.';
COMMENT ON COLUMN child_safeguarding_referral.patient.email IS
    'Email address, where held.';
COMMENT ON COLUMN child_safeguarding_referral.patient.phone IS
    'Phone number, where held.';
COMMENT ON COLUMN child_safeguarding_referral.patient.postal_address_as_full_text IS
    'Home address of the child as a single text block.';
COMMENT ON COLUMN child_safeguarding_referral.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN child_safeguarding_referral.patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN child_safeguarding_referral.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN child_safeguarding_referral.patient.hospital_mrn IS
    'Local hospital or unique reference number for the child.';
COMMENT ON COLUMN child_safeguarding_referral.patient.height_as_cm IS
    'Height in centimetres.';
COMMENT ON COLUMN child_safeguarding_referral.patient.weight_as_kg IS
    'Weight in kilograms.';
COMMENT ON COLUMN child_safeguarding_referral.patient.body_mass_index IS
    'Body mass index (BMI), kg/m^2.';
COMMENT ON COLUMN child_safeguarding_referral.patient.allergies_summary IS
    'Free-text summary of known allergies.';

CREATE INDEX patient_name_trgm_idx
    ON child_safeguarding_referral.patient
    USING GIN (name gin_trgm_ops);
