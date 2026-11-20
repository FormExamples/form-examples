-- Applicant who gives notice of marriage or civil partnership and submits
-- the application, with contact details.

CREATE TABLE united_kingdom_marriage_certificate_application.applicant (
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
    BEFORE UPDATE ON united_kingdom_marriage_certificate_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_marriage_certificate_application.set_updated_at();

COMMENT ON TABLE united_kingdom_marriage_certificate_application.applicant IS
    'Applicant who gives notice of marriage or civil partnership and submits the United Kingdom marriage certificate application, with contact details.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.name IS
    'Full name of the applicant who submits the application.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.email IS
    'Email address of the applicant.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.phone IS
    'Telephone number of the applicant.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.postal_address_as_full_text IS
    'Postal address of the applicant as full text; a UK contact address if the home address is overseas.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.applicant.postcode IS
    'Postcode of the applicant.';
