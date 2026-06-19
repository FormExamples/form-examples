-- Signatures on the LPA. The statutory sign-order is enforced by the validity
-- engine (R-MCA-ORDER): donor → certificate provider → attorneys.
-- Each row also records the witness (R-MCA-WIT-NOT-ATT: witness ≠ attorney).

CREATE TABLE lpa_signature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    signer_role VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (signer_role IN (
            'donor',
            'certificate-provider',
            'attorney',
            'replacement-attorney',
            ''
        )),
    signer_id UUID,
    signed_at TIMESTAMPTZ,
    signature_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (signature_method IN ('wet-ink', 'electronic', 'mark-with-witness', '')),
    signature_data BYTEA,

    witness_name VARCHAR(255) NOT NULL DEFAULT '',
    witness_address TEXT NOT NULL DEFAULT '',
    witness_signed_at TIMESTAMPTZ,
    witness_is_attorney VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (witness_is_attorney IN ('yes', 'no', ''))
);

CREATE INDEX index_lpa_signature_lpa_id ON lpa_signature(lpa_id);
CREATE INDEX index_lpa_signature_signer_role ON lpa_signature(signer_role);

CREATE TRIGGER trigger_lpa_signature_updated_at
    BEFORE UPDATE ON lpa_signature
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_signature IS
    'Captured signatures and witness details. Sign-order donor → certificate provider → attorneys is enforced by the validity engine (R-MCA-ORDER).';
COMMENT ON COLUMN lpa_signature.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_signature.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_signature.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_signature.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_signature.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_signature.signer_role IS
    'Role of the signer: donor, certificate-provider, attorney, replacement-attorney.';
COMMENT ON COLUMN lpa_signature.signer_id IS
    'UUID of the signer in the corresponding role table (donor, certificate_provider, attorney, replacement_attorney). Not foreign-keyed because the referent table varies by role.';
COMMENT ON COLUMN lpa_signature.signed_at IS
    'Timestamp at which the signer signed. Used by R-MCA-ORDER to verify statutory sign-order.';
COMMENT ON COLUMN lpa_signature.signature_method IS
    'How the signature was captured: wet-ink, electronic (post Powers of Attorney Act 2023), or mark-with-witness (donor unable to sign).';
COMMENT ON COLUMN lpa_signature.signature_data IS
    'Raw signature bytes (SVG path, PNG, or PKCS#7 envelope) when signature_method = electronic.';
COMMENT ON COLUMN lpa_signature.witness_name IS
    'Name of the witness.';
COMMENT ON COLUMN lpa_signature.witness_address IS
    'Postal address of the witness.';
COMMENT ON COLUMN lpa_signature.witness_signed_at IS
    'Timestamp at which the witness signed.';
COMMENT ON COLUMN lpa_signature.witness_is_attorney IS
    'Whether the witness is also a named attorney. Must be no (R-MCA-WIT-NOT-ATT).';
