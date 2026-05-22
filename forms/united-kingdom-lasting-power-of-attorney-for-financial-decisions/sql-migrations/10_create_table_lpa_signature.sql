--liquibase formatted sql

--changeset author:1
-- LPA signature — audit log of every signing event on an LP1F deed:
-- donor (section 9), certificate provider (section 10), each attorney
-- and replacement (section 11), and each applicant on the registration
-- application (section 15).

CREATE TABLE lpa_signature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    signatory_person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('donor', 'certificate_provider', 'attorney', 'replacement_attorney', 'applicant', 'signing_on_behalf_of_donor', 'trust_corporation_authorised_person')),
    lp1f_section SMALLINT NOT NULL CHECK (lp1f_section IN (9, 10, 11, 15)),
    signature_blob_path TEXT NOT NULL DEFAULT '',
    signed_on DATE,
    signed_on_behalf_full_name TEXT NOT NULL DEFAULT '',
    is_witnessed BOOLEAN NOT NULL DEFAULT FALSE
);
--rollback DROP TABLE lpa_signature;

--changeset author:2
CREATE TRIGGER trigger_lpa_signature_updated_at
    BEFORE UPDATE ON lpa_signature
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_signature_updated_at ON lpa_signature;

--changeset author:3
COMMENT ON TABLE lpa_signature IS
    'LPA signature — one row per signing event on the LP1F deed or registration application; the audit trail for sections 9, 10, 11 and 15.';
COMMENT ON COLUMN lpa_signature.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_signature.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_signature.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_signature.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_signature.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_signature.signatory_person_id IS
    'Foreign key to the person table — the person who signed.';
COMMENT ON COLUMN lpa_signature.role IS
    'Role under which this signature was given. One of: donor, certificate_provider, attorney, replacement_attorney, applicant, signing_on_behalf_of_donor, trust_corporation_authorised_person.';
COMMENT ON COLUMN lpa_signature.lp1f_section IS
    'LP1F section in which this signature appears. One of: 9 (donor), 10 (certificate provider), 11 (attorneys and replacements), 15 (registration applicant).';
COMMENT ON COLUMN lpa_signature.signature_blob_path IS
    'Server-side file reference to the stored signature image / blob.';
COMMENT ON COLUMN lpa_signature.signed_on IS
    'Date on which the signature was given; used to enforce the LPA Regulations 2007 reg. 9(6) signing order.';
COMMENT ON COLUMN lpa_signature.signed_on_behalf_full_name IS
    'Full name of the person who physically signed when role = signing_on_behalf_of_donor (donor cannot sign — requires LPC sheet 3).';
COMMENT ON COLUMN lpa_signature.is_witnessed IS
    'TRUE if this signature requires and has a corresponding lpa_witness row; FALSE for the certificate-provider signature which is not witnessed.';
--rollback SELECT 1;
