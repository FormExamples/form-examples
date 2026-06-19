--liquibase formatted sql

--changeset author:1
-- LPA registration application — the OPG registration block of LP1F
-- (sections 12 and 14): who is applying, how the fee is paid, whether a
-- reduced fee is requested, and whether this is a repeat application.

CREATE TABLE lpa_registration_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    applicant_kind TEXT NOT NULL DEFAULT '' CHECK (applicant_kind IN ('donor', 'attorneys', '')),
    payment_method TEXT NOT NULL DEFAULT '' CHECK (payment_method IN ('card', 'cheque', '')),
    card_payment_phone TEXT NOT NULL DEFAULT '',
    reduced_fee_requested BOOLEAN NOT NULL DEFAULT FALSE,
    has_lpa120a_evidence BOOLEAN NOT NULL DEFAULT FALSE,
    is_repeat_application BOOLEAN NOT NULL DEFAULT FALSE,
    repeat_case_number TEXT NOT NULL DEFAULT '',
    payment_reference TEXT NOT NULL DEFAULT '',
    payment_date DATE,
    payment_amount NUMERIC(8,2)
);
--rollback DROP TABLE lpa_registration_application;

--changeset author:2
CREATE TRIGGER trigger_lpa_registration_application_updated_at
    BEFORE UPDATE ON lpa_registration_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_registration_application_updated_at ON lpa_registration_application;

--changeset author:3
COMMENT ON TABLE lpa_registration_application IS
    'LPA registration application — the registration block of LP1F (sections 12 and 14) submitted to the OPG.';
COMMENT ON COLUMN lpa_registration_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_registration_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_registration_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_registration_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_registration_application.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; UNIQUE so only one registration block per LPA; cascades on delete.';
COMMENT ON COLUMN lpa_registration_application.applicant_kind IS
    'Who is applying to register the LPA. One of: donor, attorneys.';
COMMENT ON COLUMN lpa_registration_application.payment_method IS
    'How the OPG fee is paid. One of: card, cheque.';
COMMENT ON COLUMN lpa_registration_application.card_payment_phone IS
    'Phone number on which the OPG should contact the applicant to take a card payment (LP1F section 14).';
COMMENT ON COLUMN lpa_registration_application.reduced_fee_requested IS
    'TRUE if the applicant is asking for a reduced or remitted fee (requires LPA120A and supporting evidence).';
COMMENT ON COLUMN lpa_registration_application.has_lpa120a_evidence IS
    'TRUE if the LPA120A evidence is attached when a reduced fee is requested.';
COMMENT ON COLUMN lpa_registration_application.is_repeat_application IS
    'TRUE if this is a repeat application after a previous OPG rejection (entitles the applicant to a discounted second-attempt fee).';
COMMENT ON COLUMN lpa_registration_application.repeat_case_number IS
    'OPG case number of the previous (rejected) application when is_repeat_application is TRUE.';
COMMENT ON COLUMN lpa_registration_application.payment_reference IS
    'Reference number of the fee payment (card receipt or cheque number).';
COMMENT ON COLUMN lpa_registration_application.payment_date IS
    'Date the fee was paid.';
COMMENT ON COLUMN lpa_registration_application.payment_amount IS
    'Amount of the fee paid, in GBP (numeric to two decimal places).';
--rollback SELECT 1;
