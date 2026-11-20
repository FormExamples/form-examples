-- The person completing and signing the request for a certified copy of a birth certificate.

CREATE TABLE applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    birth_date DATE,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT
);


CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON applicant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE applicant IS
    'The person completing and signing a birth certificate copy request (the requester).';
COMMENT ON COLUMN applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN applicant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN applicant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN applicant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN applicant.name IS
    'Full legal name of the requester.';
COMMENT ON COLUMN applicant.birth_date IS
    'Date of birth of the requester, used to test minimum-age rules for self-requests.';
COMMENT ON COLUMN applicant.email IS
    'Email address of the requester.';
COMMENT ON COLUMN applicant.phone IS
    'Phone number of the requester.';
COMMENT ON COLUMN applicant.postal_address_as_full_text IS
    'Mailing address for delivery, as a single text block.';
