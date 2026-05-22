--liquibase formatted sql

--changeset author:1
-- LPA witness — the witness to a witnessable signature (donor and each
-- attorney / replacement signature). One row per witnessed signature;
-- enforced by UNIQUE (signature_id).

CREATE TABLE lpa_witness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    signature_id UUID NOT NULL UNIQUE REFERENCES lpa_signature(id) ON DELETE CASCADE,
    witness_person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    witness_signature_blob_path TEXT NOT NULL DEFAULT '',
    witnessed_on DATE
);
--rollback DROP TABLE lpa_witness;

--changeset author:2
CREATE TRIGGER trigger_lpa_witness_updated_at
    BEFORE UPDATE ON lpa_witness
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_witness_updated_at ON lpa_witness;

--changeset author:3
COMMENT ON TABLE lpa_witness IS
    'LPA witness — captures the witness for a donor or attorney signature (LPA Regulations 2007 reg. 9(2)).';
COMMENT ON COLUMN lpa_witness.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_witness.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_witness.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_witness.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_witness.signature_id IS
    'Foreign key to the lpa_signature table; UNIQUE so each signature has at most one witness row; cascades on delete.';
COMMENT ON COLUMN lpa_witness.witness_person_id IS
    'Foreign key to the person table — the witness. Must not be the donor or an attorney (LPA Regs 2007 reg. 9(2)).';
COMMENT ON COLUMN lpa_witness.witness_signature_blob_path IS
    'Server-side file reference to the stored witness signature image / blob.';
COMMENT ON COLUMN lpa_witness.witnessed_on IS
    'Date on which the witness signed.';
--rollback SELECT 1;
