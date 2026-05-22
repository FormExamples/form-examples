-- Description of each purpose of the requested use or disclosure.

CREATE TABLE purpose_of_disclosure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    purposes TEXT[] NOT NULL DEFAULT '{}',
    primary_purpose VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_purpose IN (
            '',
            'eligibility-determination',
            'continuing-treatment',
            'insurance-claim',
            'legal-proceeding',
            'disability-application',
            'personal-use',
            'research',
            'employment',
            'at-the-request-of-the-individual',
            'other'
        )),
    other_details TEXT NOT NULL DEFAULT '',
    CHECK (primary_purpose != 'other' OR other_details <> '')
);

CREATE TRIGGER trigger_purpose_of_disclosure_updated_at
    BEFORE UPDATE ON purpose_of_disclosure
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE purpose_of_disclosure IS
    'Description of each purpose of the requested use or disclosure. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(iv).';
COMMENT ON COLUMN purpose_of_disclosure.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN purpose_of_disclosure.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN purpose_of_disclosure.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN purpose_of_disclosure.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN purpose_of_disclosure.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN purpose_of_disclosure.purposes IS
    'Array of purpose identifiers (multiple purposes are permitted).';
COMMENT ON COLUMN purpose_of_disclosure.primary_purpose IS
    'Primary purpose: eligibility-determination, continuing-treatment, insurance-claim, legal-proceeding, disability-application, personal-use, research, employment, at-the-request-of-the-individual, other, or empty.';
COMMENT ON COLUMN purpose_of_disclosure.other_details IS
    'Free-text details when primary_purpose is other. Must not be empty when primary_purpose is other.';
