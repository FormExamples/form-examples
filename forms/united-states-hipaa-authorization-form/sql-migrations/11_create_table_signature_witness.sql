-- Signature, date, and (where applicable) witness fields.

CREATE TABLE signature_witness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,

    individual_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (individual_signature_confirmed IN ('', 'yes', 'no')),
    individual_signature_image_uri TEXT NOT NULL DEFAULT '',
    signature_date DATE,
    signed_at_location TEXT NOT NULL DEFAULT '',

    parent_guardian_co_signature_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (parent_guardian_co_signature_required IN ('', 'yes', 'no')),
    parent_guardian_name VARCHAR(255) NOT NULL DEFAULT '',
    parent_guardian_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (parent_guardian_signature_confirmed IN ('', 'yes', 'no')),
    parent_guardian_signature_date DATE,

    witness_name VARCHAR(255) NOT NULL DEFAULT '',
    witness_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (witness_signature_confirmed IN ('', 'yes', 'no')),
    witness_date DATE,
    witness_role VARCHAR(120) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_signature_witness_updated_at
    BEFORE UPDATE ON signature_witness
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE signature_witness IS
    'Signature, date, and witness fields. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(vi).';
COMMENT ON COLUMN signature_witness.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN signature_witness.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN signature_witness.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN signature_witness.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN signature_witness.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN signature_witness.individual_signature_confirmed IS
    'Whether the individual (or their authorized representative) has confirmed the signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.individual_signature_image_uri IS
    'URI of the captured electronic signature image (SVG or PNG data URI).';
COMMENT ON COLUMN signature_witness.signature_date IS
    'Date the individual signed the authorization. Required by § 164.508(c)(1)(vi).';
COMMENT ON COLUMN signature_witness.signed_at_location IS
    'Optional location where the signature was captured (state, facility, or virtual).';
COMMENT ON COLUMN signature_witness.parent_guardian_co_signature_required IS
    'Whether a parent or guardian co-signature is required by state law: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.parent_guardian_name IS
    'Name of parent or guardian co-signing where required.';
COMMENT ON COLUMN signature_witness.parent_guardian_signature_confirmed IS
    'Whether the parent / guardian has confirmed their co-signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.parent_guardian_signature_date IS
    'Date the parent / guardian co-signed.';
COMMENT ON COLUMN signature_witness.witness_name IS
    'Name of the witness, when required by state law.';
COMMENT ON COLUMN signature_witness.witness_signature_confirmed IS
    'Whether the witness has confirmed their signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.witness_date IS
    'Date the witness signed.';
COMMENT ON COLUMN signature_witness.witness_role IS
    'Role of the witness (e.g. notary, agency representative, healthcare professional).';
