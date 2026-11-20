-- Clinician employee information used to identify the assessor who
-- performed the CAM delirium screen (ward or ICU nurse, doctor,
-- geriatrician, liaison psychiatrist, physiotherapist, occupational
-- therapist, or clinical researcher).

CREATE TABLE confusion_assessment_method.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('nurse', 'doctor', 'geriatrician', 'liaison-psychiatrist', 'physiotherapist', 'occupational-therapist', 'researcher', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON confusion_assessment_method.clinician
    FOR EACH ROW
    EXECUTE FUNCTION confusion_assessment_method.set_updated_at();

COMMENT ON TABLE confusion_assessment_method.clinician IS
    'Clinician identifying information for the assessor performing the CAM delirium screen.';
COMMENT ON COLUMN confusion_assessment_method.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN confusion_assessment_method.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN confusion_assessment_method.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN confusion_assessment_method.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN confusion_assessment_method.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN confusion_assessment_method.clinician.email IS
    'Email address.';
COMMENT ON COLUMN confusion_assessment_method.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN confusion_assessment_method.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN confusion_assessment_method.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN confusion_assessment_method.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN confusion_assessment_method.clinician.role IS
    'Primary clinical role: nurse, doctor, geriatrician, liaison-psychiatrist, physiotherapist, occupational-therapist, researcher, or other.';
COMMENT ON COLUMN confusion_assessment_method.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN confusion_assessment_method.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON confusion_assessment_method.clinician
    USING GIN (name gin_trgm_ops);
