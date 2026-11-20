-- Applicant who gives notice of marriage or civil partnership and submits
-- the application, with contact details.

CREATE TABLE applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL DEFAULT '',
    birth_date DATE,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON applicant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE applicant IS
    'Applicant who gives notice of marriage or civil partnership and submits the United Kingdom marriage certificate application, with contact details.';
COMMENT ON COLUMN applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN applicant.name IS
    'Full name of the applicant who submits the application.';
COMMENT ON COLUMN applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN applicant.email IS
    'Email address of the applicant.';
COMMENT ON COLUMN applicant.phone IS
    'Telephone number of the applicant.';
COMMENT ON COLUMN applicant.postal_address_as_full_text IS
    'Postal address of the applicant as full text; a UK contact address if the home address is overseas.';
COMMENT ON COLUMN applicant.postcode IS
    'Postcode of the applicant.';
