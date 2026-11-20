-- Applicant demographic information for the person who needs a Social
-- Security card.

CREATE TABLE united_states_social_security_card_application.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    us_state_code VARCHAR(2) NOT NULL DEFAULT '' CHECK (char_length(us_state_code) IN (0, 2))
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON united_states_social_security_card_application.patient
    FOR EACH ROW
    EXECUTE FUNCTION united_states_social_security_card_application.set_updated_at();

COMMENT ON TABLE united_states_social_security_card_application.patient IS
    'Applicant demographic information for the person who needs a Social Security card. The Social Security number is never stored.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.name IS
    'Full name of the applicant.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.sex IS
    'Sex recorded for the applicant: female, male, other, or unknown.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.email IS
    'Email address.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_states_social_security_card_application.patient.postcode IS
    'Postal code (ZIP code).';
COMMENT ON COLUMN united_states_social_security_card_application.patient.us_state_code IS
    'Two-letter USPS code of the state or territory of residence.';

CREATE INDEX patient_name_trgm_idx
    ON united_states_social_security_card_application.patient
    USING GIN (name gin_trgm_ops);
