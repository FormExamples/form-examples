-- Clinician information for the preparer or assisting staff member who helps
-- complete this Social Security card application.

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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('preparer', 'field-office-staff', 'legal-guardian', 'other', '')),
    organization TEXT NOT NULL DEFAULT '',
    staff_identifier TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician information for the preparer or assisting staff member who helps complete the Social Security card application.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Full name of the preparer or staff member.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code (ZIP code).';
COMMENT ON COLUMN clinician.role IS
    'Role: preparer, field-office-staff, legal-guardian, or other.';
COMMENT ON COLUMN clinician.organization IS
    'Organization the preparer works for, such as a school, agency, or field office.';
COMMENT ON COLUMN clinician.staff_identifier IS
    'Organization-assigned identifier of the preparer.';
