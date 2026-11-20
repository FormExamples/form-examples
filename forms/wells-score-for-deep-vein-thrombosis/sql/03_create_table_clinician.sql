-- Clinician employee information used to identify the assessing
-- clinician (doctor, nurse-practitioner, physician-associate).

CREATE TABLE wells_score_for_deep_vein_thrombosis.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('doctor', 'nurse-practitioner', 'physician-associate', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON wells_score_for_deep_vein_thrombosis.clinician
    FOR EACH ROW
    EXECUTE FUNCTION wells_score_for_deep_vein_thrombosis.set_updated_at();

COMMENT ON TABLE wells_score_for_deep_vein_thrombosis.clinician IS
    'Clinician identifying information for the assessing clinician.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.email IS
    'Email address.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.role IS
    'Primary clinical role: doctor, nurse-practitioner, physician-associate, or other.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON wells_score_for_deep_vein_thrombosis.clinician
    USING GIN (name gin_trgm_ops);
