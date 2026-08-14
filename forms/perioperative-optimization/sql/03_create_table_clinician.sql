-- Clinician employee information provided by the employer. In this form the
-- clinician is the perioperative assessor, who may be a pre-operative
-- assessment nurse, a perioperative physician, an anaesthetist, a surgeon, a
-- prehabilitation therapist, a pharmacist, or a dietitian.

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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('preoperative-assessment-nurse', 'perioperative-physician', 'anaesthetist', 'surgeon', 'prehabilitation-therapist', 'physiotherapist', 'pharmacist', 'dietitian', 'specialist-nurse', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    employer TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician, i.e. the practitioner who conducts the perioperative optimisation assessment.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Name.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN clinician.role IS
    'Clinician role within the perioperative pathway.';
COMMENT ON COLUMN clinician.registration_body IS
    'Professional registration body, such as GMC, NMC, or HCPC in the United Kingdom.';
COMMENT ON COLUMN clinician.registration_number IS
    'Professional registration number issued by the registration body.';
COMMENT ON COLUMN clinician.employer IS
    'Employer, such as the NHS trust or health board.';
COMMENT ON COLUMN clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX clinician_index_gto
    ON clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
