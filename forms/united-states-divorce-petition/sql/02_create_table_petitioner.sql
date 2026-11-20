-- Petitioner: the spouse who files the petition for dissolution of marriage.

CREATE TABLE petitioner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state_as_usps_code VARCHAR(2),
    postcode TEXT
);

CREATE TRIGGER trigger_petitioner_updated_at
    BEFORE UPDATE ON petitioner
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE petitioner IS
    'Petitioner: the spouse who files the petition for dissolution of marriage.';
COMMENT ON COLUMN petitioner.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN petitioner.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN petitioner.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN petitioner.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN petitioner.name IS
    'Full legal name of the petitioner.';
COMMENT ON COLUMN petitioner.birth_date IS
    'Date of birth of the petitioner.';
COMMENT ON COLUMN petitioner.email IS
    'Email address.';
COMMENT ON COLUMN petitioner.phone IS
    'Phone number.';
COMMENT ON COLUMN petitioner.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN petitioner.state_as_usps_code IS
    'Two-letter USPS code of the petitioner''s state of residence.';
COMMENT ON COLUMN petitioner.postcode IS
    'ZIP code.';

CREATE INDEX petitioner_name_trgm_idx
    ON petitioner
    USING GIN (name gin_trgm_ops);
