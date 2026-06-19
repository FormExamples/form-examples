-- The person(s) or class of persons authorized to make the disclosure.

CREATE TABLE disclosing_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    identification_mode VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (identification_mode IN ('', 'specific', 'class')),
    specific_persons_or_organizations TEXT NOT NULL DEFAULT '',
    class_description TEXT NOT NULL DEFAULT '',
    is_va_facility VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_va_facility IN ('', 'yes', 'no')),
    is_part_2_program VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_part_2_program IN ('', 'yes', 'no'))
);

CREATE TRIGGER trigger_disclosing_source_updated_at
    BEFORE UPDATE ON disclosing_source
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE disclosing_source IS
    'Person(s) or class of persons authorized to make the disclosure. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(ii).';
COMMENT ON COLUMN disclosing_source.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN disclosing_source.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN disclosing_source.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN disclosing_source.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN disclosing_source.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN disclosing_source.identification_mode IS
    'Whether the disclosing source is identified specifically or as a class: specific, class, or empty.';
COMMENT ON COLUMN disclosing_source.specific_persons_or_organizations IS
    'Free-text list of the specific persons or organizations holding the records. Used when identification_mode is specific.';
COMMENT ON COLUMN disclosing_source.class_description IS
    'Free-text description of the class of persons (e.g. "doctors, hospitals, clinics, nursing homes, …"). Used when identification_mode is class.';
COMMENT ON COLUMN disclosing_source.is_va_facility IS
    'Whether the disclosing source is a US Department of Veterans Affairs facility: yes, no, or empty. Triggers the 38 U.S.C. § 7332 rule when yes.';
COMMENT ON COLUMN disclosing_source.is_part_2_program IS
    'Whether the disclosing source is a federally assisted substance-use-disorder program subject to 42 CFR Part 2: yes, no, or empty.';
