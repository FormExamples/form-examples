-- Identification of the individual who signs the authorization.

CREATE TABLE united_states_hipaa_authorization_form.signer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES united_states_hipaa_authorization_form.hipaa_authorization(id) ON DELETE CASCADE,
    relationship VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (relationship IN (
            '',
            'self',
            'parent-of-minor',
            'guardian',
            'conservator',
            'power-of-attorney',
            'executor',
            'other-authorized-representative'
        )),
    representative_name VARCHAR(255) NOT NULL DEFAULT '',
    representative_authority_description TEXT NOT NULL DEFAULT '',
    representative_authority_proof_attached VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (representative_authority_proof_attached IN ('', 'yes', 'no'))
);

CREATE TRIGGER trigger_signer_updated_at
    BEFORE UPDATE ON united_states_hipaa_authorization_form.signer
    FOR EACH ROW
    EXECUTE FUNCTION united_states_hipaa_authorization_form.set_updated_at();

COMMENT ON TABLE united_states_hipaa_authorization_form.signer IS
    'Identification of the individual who signs the HIPAA authorization. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(vi).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.relationship IS
    'Signer relationship to patient: self, parent-of-minor, guardian, conservator, power-of-attorney, executor, other-authorized-representative, or empty if unanswered.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.representative_name IS
    'Print name of the authorized representative (empty when relationship is self).';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.representative_authority_description IS
    'Free-text description of the representative''s authority to act. Required by § 164.508(c)(1)(vi)(B) when signed by a representative.';
COMMENT ON COLUMN united_states_hipaa_authorization_form.signer.representative_authority_proof_attached IS
    'Whether proof of legal authority is attached (e.g. POA, guardianship order): yes, no, or empty.';
