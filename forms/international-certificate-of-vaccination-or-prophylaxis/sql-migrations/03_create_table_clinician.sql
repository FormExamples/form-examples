-- Supervising clinician who signs each vaccination entry on the certificate.
-- The clinician's handwritten signature is required on each entry; a stamp
-- is not acceptable per IHR Annex 6.

CREATE TABLE clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    professional_status VARCHAR(50) NOT NULL DEFAULT '' CHECK (professional_status IN ('MD', 'DO', 'RN', 'NP', 'PA', 'Pharmacist', 'Paramedic', 'other', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'state-medical-board', 'national-medical-council', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    signature_image_data_url TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Supervising clinician authorised to issue an International Certificate of Vaccination or Prophylaxis on behalf of a WHO-designated centre.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Full name of the supervising clinician as it appears on the registration certificate.';
COMMENT ON COLUMN clinician.professional_status IS
    'Professional status: MD, DO, RN, NP, PA, Pharmacist, Paramedic, other.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as full free-text.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country code for the postal address, ISO 3166-1 alpha-2.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code for the postal address.';
COMMENT ON COLUMN clinician.registration_body IS
    'Statutory registration body for the clinician.';
COMMENT ON COLUMN clinician.registration_number IS
    'Clinician registration number issued by the registration body.';
COMMENT ON COLUMN clinician.signature_image_data_url IS
    'Reference handwritten signature captured as a data URL for inclusion on the certificate.';
COMMENT ON COLUMN clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number for the clinician where applicable.';

CREATE INDEX clinician_index_name_gto
    ON clinician
    USING GIN ((name) gin_trgm_ops);
