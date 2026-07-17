-- Practitioner who places the patient on a craniofacial surgery waiting list.

CREATE TABLE practitioner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    role VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (role IN (
            'gp',
            'consultant',
            'specialist-nurse',
            'referral-coordinator',
            'booking-clerk',
            'rtt-validator',
            'other',
            ''
        )),
    registration_body VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number VARCHAR(50) NOT NULL DEFAULT '',
    organisation_name VARCHAR(255) NOT NULL DEFAULT '',
    organisation_ods_code VARCHAR(20) NOT NULL DEFAULT '',
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2)
);

CREATE TRIGGER trigger_practitioner_updated_at
    BEFORE UPDATE ON practitioner
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE practitioner IS
    'Practitioner who completes a craniofacial surgery waiting list card on behalf of the patient.';
COMMENT ON COLUMN practitioner.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN practitioner.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN practitioner.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN practitioner.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN practitioner.name IS
    'Name.';
COMMENT ON COLUMN practitioner.email IS
    'Email address.';
COMMENT ON COLUMN practitioner.phone IS
    'Phone number.';
COMMENT ON COLUMN practitioner.role IS
    'Practitioner role: gp, consultant, specialist-nurse, referral-coordinator, booking-clerk, rtt-validator, other.';
COMMENT ON COLUMN practitioner.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, other.';
COMMENT ON COLUMN practitioner.registration_number IS
    'Professional registration number.';
COMMENT ON COLUMN practitioner.organisation_name IS
    'Employing organisation (e.g. NHS trust name, GP practice name).';
COMMENT ON COLUMN practitioner.organisation_ods_code IS
    'NHS Organisation Data Service (ODS) code for the organisation.';
COMMENT ON COLUMN practitioner.site_name IS
    'Site or clinic name within the organisation.';
COMMENT ON COLUMN practitioner.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format.';
