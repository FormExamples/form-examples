-- Clinician employee information used to identify the clinician who
-- administered the Edinburgh Postnatal Depression Scale (midwife,
-- health visitor, GP, perinatal mental-health practitioner).

CREATE TABLE edinburgh_postnatal_depression_scale.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('midwife', 'health-visitor', 'gp', 'perinatal-mh', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON edinburgh_postnatal_depression_scale.clinician
    FOR EACH ROW
    EXECUTE FUNCTION edinburgh_postnatal_depression_scale.set_updated_at();

COMMENT ON TABLE edinburgh_postnatal_depression_scale.clinician IS
    'Clinician identifying information for the clinician who administered the EPDS.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.name IS
    'Clinician full name.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.email IS
    'Email address.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.role IS
    'Primary clinical role: midwife, health-visitor, gp, perinatal-mh, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON edinburgh_postnatal_depression_scale.clinician
    USING GIN (name gin_trgm_ops);
