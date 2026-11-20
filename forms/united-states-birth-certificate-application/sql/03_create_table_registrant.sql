-- The person named on the birth certificate (the registrant): the data of the
-- US Standard Certificate of Live Birth needed to locate the record.

CREATE TABLE registrant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    birth_date DATE,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    place_of_birth TEXT NOT NULL DEFAULT '',
    county_of_birth TEXT NOT NULL DEFAULT '',
    birth_state CHAR(2),
    birth_facility TEXT NOT NULL DEFAULT '',
    mother_name_before_first_marriage TEXT NOT NULL DEFAULT '',
    father_name TEXT NOT NULL DEFAULT '',
    is_deceased VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_deceased IN ('yes', 'no', '')),
    is_adopted VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_adopted IN ('yes', 'no', ''))
);


CREATE TRIGGER trigger_registrant_updated_at
    BEFORE UPDATE ON registrant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE registrant IS
    'The person named on the birth certificate being requested, with the Standard Certificate of Live Birth data needed to locate the record.';
COMMENT ON COLUMN registrant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN registrant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN registrant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN registrant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN registrant.name IS
    'Full name of the registrant as it appears on the birth certificate.';
COMMENT ON COLUMN registrant.birth_date IS
    'Date of birth of the registrant.';
COMMENT ON COLUMN registrant.sex IS
    'Sex recorded on the certificate: female, male, other, or unknown.';
COMMENT ON COLUMN registrant.place_of_birth IS
    'City or town of birth.';
COMMENT ON COLUMN registrant.county_of_birth IS
    'County of birth.';
COMMENT ON COLUMN registrant.birth_state IS
    'Two-letter postal code of the state or territory where the birth occurred; the issuing vital records office.';
COMMENT ON COLUMN registrant.birth_facility IS
    'Hospital or facility of birth, or street address for a home birth.';
COMMENT ON COLUMN registrant.mother_name_before_first_marriage IS
    'Mother full name before first marriage, as on the certificate.';
COMMENT ON COLUMN registrant.father_name IS
    'Father or second parent full name as on the certificate, if recorded.';
COMMENT ON COLUMN registrant.is_deceased IS
    'Whether the registrant is deceased (yes/no).';
COMMENT ON COLUMN registrant.is_adopted IS
    'Whether the registrant was adopted, so an amended record may exist and the original may be sealed (yes/no).';
