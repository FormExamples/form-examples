-- Clinician employee information used to identify the reviewing
-- clinician who documented the ward-round entry.

CREATE TABLE ward_round_note.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('ward-doctor', 'acp', 'physician-associate', 'consultant', 'nurse', 'pharmacist', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON ward_round_note.clinician
    FOR EACH ROW
    EXECUTE FUNCTION ward_round_note.set_updated_at();

COMMENT ON TABLE ward_round_note.clinician IS
    'Clinician identifying information for the reviewing clinician who documented a ward-round note.';
COMMENT ON COLUMN ward_round_note.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ward_round_note.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ward_round_note.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ward_round_note.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ward_round_note.clinician.name IS
    'Clinician full name as recorded on the ward round.';
COMMENT ON COLUMN ward_round_note.clinician.email IS
    'Email address.';
COMMENT ON COLUMN ward_round_note.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN ward_round_note.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN ward_round_note.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN ward_round_note.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN ward_round_note.clinician.role IS
    'Ward-round role: ward-doctor, acp (advanced clinical practitioner), physician-associate, consultant, nurse, pharmacist, or other.';
COMMENT ON COLUMN ward_round_note.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN ward_round_note.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON ward_round_note.clinician
    USING GIN (name gin_trgm_ops);
