-- Clinician information for the medical certifier who completes the
-- US Standard Certificate of Death.

CREATE TABLE clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('attending-physician', 'pronouncing-physician', 'medical-examiner', 'coroner', 'funeral-director', 'other', '')),
    registration_body VARCHAR(25) NOT NULL DEFAULT '' CHECK (registration_body IN ('state-medical-board', 'state-funeral-board', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician information for the medical certifier (physician, medical examiner, or coroner) who completes the cause-of-death section of the US Standard Certificate of Death.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Certifier full name as licensed by the state.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN clinician.role IS
    'Role of the certifier: attending-physician, pronouncing-physician, medical-examiner, coroner, funeral-director, or other.';
COMMENT ON COLUMN clinician.registration_body IS
    'Licensing body: state-medical-board, state-funeral-board, or other.';
COMMENT ON COLUMN clinician.registration_number IS
    'Professional registration number (state license number).';

CREATE INDEX clinician_name_trgm_idx
    ON clinician
    USING GIN (name gin_trgm_ops);
