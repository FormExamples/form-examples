-- Clinician employee information used to identify the clinician who
-- conducted the hypertension annual review.

CREATE TABLE hypertension_review.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('gp', 'practice-nurse', 'pharmacist', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON hypertension_review.clinician
    FOR EACH ROW
    EXECUTE FUNCTION hypertension_review.set_updated_at();

COMMENT ON TABLE hypertension_review.clinician IS
    'Clinician identifying information for the clinician who conducted the hypertension annual review.';
COMMENT ON COLUMN hypertension_review.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hypertension_review.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hypertension_review.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hypertension_review.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hypertension_review.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN hypertension_review.clinician.email IS
    'Email address.';
COMMENT ON COLUMN hypertension_review.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN hypertension_review.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN hypertension_review.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN hypertension_review.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN hypertension_review.clinician.role IS
    'Primary clinical role of the reviewer: gp, practice-nurse, pharmacist, or other.';
COMMENT ON COLUMN hypertension_review.clinician.registration_body IS
    'Professional registration body: GMC, NMC, GPhC, or other.';
COMMENT ON COLUMN hypertension_review.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON hypertension_review.clinician
    USING GIN (name gin_trgm_ops);
