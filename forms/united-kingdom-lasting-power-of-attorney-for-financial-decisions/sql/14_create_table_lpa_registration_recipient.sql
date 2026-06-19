--liquibase formatted sql

--changeset author:1
-- LPA registration recipient — LP1F section 13: who receives the
-- registered LPA from the OPG and through which contact channels.

CREATE TABLE lpa_registration_recipient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    recipient_kind TEXT NOT NULL DEFAULT '' CHECK (recipient_kind IN ('donor', 'attorney', 'other', '')),
    recipient_person_id UUID REFERENCES person(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL DEFAULT '',
    prefers_post BOOLEAN NOT NULL DEFAULT FALSE,
    prefers_phone BOOLEAN NOT NULL DEFAULT FALSE,
    prefers_email BOOLEAN NOT NULL DEFAULT FALSE,
    prefers_welsh BOOLEAN NOT NULL DEFAULT FALSE,
    contact_phone TEXT NOT NULL DEFAULT '',
    contact_email TEXT NOT NULL DEFAULT '',
    other_first_names TEXT NOT NULL DEFAULT '',
    other_last_name TEXT NOT NULL DEFAULT '',
    other_address_line_1 TEXT NOT NULL DEFAULT '',
    other_address_line_2 TEXT NOT NULL DEFAULT '',
    other_address_line_3 TEXT NOT NULL DEFAULT '',
    other_postcode TEXT NOT NULL DEFAULT ''
);
--rollback DROP TABLE lpa_registration_recipient;

--changeset author:2
CREATE TRIGGER trigger_lpa_registration_recipient_updated_at
    BEFORE UPDATE ON lpa_registration_recipient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_registration_recipient_updated_at ON lpa_registration_recipient;

--changeset author:3
COMMENT ON TABLE lpa_registration_recipient IS
    'LPA registration recipient — who receives the registered LPA and how (LP1F section 13).';
COMMENT ON COLUMN lpa_registration_recipient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_registration_recipient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_registration_recipient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_registration_recipient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_registration_recipient.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; UNIQUE so only one recipient block per LPA; cascades on delete.';
COMMENT ON COLUMN lpa_registration_recipient.recipient_kind IS
    'Who receives the registered LPA. One of: donor, attorney, other.';
COMMENT ON COLUMN lpa_registration_recipient.recipient_person_id IS
    'Foreign key to the person table — the recipient when recipient_kind is donor, attorney, or a named other individual; nullable when the recipient is a company.';
COMMENT ON COLUMN lpa_registration_recipient.company_name IS
    'Company or organisation name when the recipient is not a natural person (e.g. solicitors'' firm acting for the donor).';
COMMENT ON COLUMN lpa_registration_recipient.prefers_post IS
    'TRUE if the recipient prefers correspondence by post.';
COMMENT ON COLUMN lpa_registration_recipient.prefers_phone IS
    'TRUE if the recipient prefers correspondence by phone.';
COMMENT ON COLUMN lpa_registration_recipient.prefers_email IS
    'TRUE if the recipient prefers correspondence by email.';
COMMENT ON COLUMN lpa_registration_recipient.prefers_welsh IS
    'TRUE if the recipient prefers correspondence in Welsh (Welsh Language Act 1993).';
COMMENT ON COLUMN lpa_registration_recipient.contact_phone IS
    'Contact phone number used by the OPG to reach the recipient.';
COMMENT ON COLUMN lpa_registration_recipient.contact_email IS
    'Contact email address used by the OPG to reach the recipient.';
COMMENT ON COLUMN lpa_registration_recipient.other_first_names IS
    'First names of the "other" recipient when recipient_kind is "other" and the recipient is not represented by a person row (e.g. a one-off named contact at a solicitors'' firm).';
COMMENT ON COLUMN lpa_registration_recipient.other_last_name IS
    'Last name of the "other" recipient when recipient_kind is "other".';
COMMENT ON COLUMN lpa_registration_recipient.other_address_line_1 IS
    'Address line 1 of the "other" recipient when recipient_kind is "other".';
COMMENT ON COLUMN lpa_registration_recipient.other_address_line_2 IS
    'Address line 2 of the "other" recipient when recipient_kind is "other".';
COMMENT ON COLUMN lpa_registration_recipient.other_address_line_3 IS
    'Address line 3 of the "other" recipient when recipient_kind is "other".';
COMMENT ON COLUMN lpa_registration_recipient.other_postcode IS
    'Postcode of the "other" recipient when recipient_kind is "other".';
--rollback SELECT 1;
