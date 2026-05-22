-- Parent entity for a single HIPAA authorization document.

CREATE TABLE hipaa_authorization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'valid', 'invalid', 'expired', 'revoked')),
    state_template VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (state_template IN ('', 'tn-hs-2557', 'pa-hs-1549', 'hhs-ocr-sample', 'custom')),
    revoked_at TIMESTAMPTZ,
    revocation_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (revocation_method IN ('', 'written', 'electronic', 'in-person'))
);

CREATE TRIGGER trigger_hipaa_authorization_updated_at
    BEFORE UPDATE ON hipaa_authorization
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hipaa_authorization IS
    'Parent entity for a single HIPAA authorization document. Every other section table is a one-to-one or one-to-many child.';
COMMENT ON COLUMN hipaa_authorization.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hipaa_authorization.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hipaa_authorization.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN hipaa_authorization.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN hipaa_authorization.patient_id IS
    'Foreign key to the patient who is authorising the disclosure.';
COMMENT ON COLUMN hipaa_authorization.status IS
    'Lifecycle status: draft, submitted, valid, invalid, expired, or revoked.';
COMMENT ON COLUMN hipaa_authorization.state_template IS
    'Source state template the authorization was generated from. Empty when not derived from a known template.';
COMMENT ON COLUMN hipaa_authorization.revoked_at IS
    'Timestamp when the patient revoked the authorization (NULL if not revoked).';
COMMENT ON COLUMN hipaa_authorization.revocation_method IS
    'Method of revocation: written, electronic, in-person, or empty if not revoked.';
