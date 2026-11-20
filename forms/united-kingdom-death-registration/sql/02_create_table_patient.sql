-- The deceased person whose death is being registered. Holds identity
-- details only; the registration process lives in the main table.

CREATE TABLE united_kingdom_death_registration.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON united_kingdom_death_registration.patient
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_death_registration.set_updated_at();

COMMENT ON TABLE united_kingdom_death_registration.patient IS
    'The deceased person whose death is being registered in England and Wales.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.name IS
    'Full name of the deceased as it will appear on the register entry.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.birth_date IS
    'Date of birth of the deceased; null when not known.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.sex IS
    'Sex recorded for the deceased: female, male, other, or unknown.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.postal_address_as_full_text IS
    'Usual address of the deceased as a single text block.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.postcode IS
    'Postal code of the usual address.';
COMMENT ON COLUMN united_kingdom_death_registration.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX patient_name_trgm_idx
    ON united_kingdom_death_registration.patient
    USING GIN (name gin_trgm_ops);
