--liquibase formatted sql

--changeset author:1
-- Person — every named individual involved in an LPA: donor, attorney,
-- replacement attorney, certificate provider, person to notify, witness,
-- applicant, recipient. One row per unique person so that a person who
-- plays more than one role across LPAs is stored once.

CREATE TABLE united_kingdom_power_of_attorney_for_financial_decisions.person (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title TEXT NOT NULL DEFAULT '',
    first_names TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    other_names TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    address_id UUID,
    is_trust_corporation BOOLEAN NOT NULL DEFAULT FALSE,
    trust_corporation_number TEXT NOT NULL DEFAULT '',
    is_bankrupt BOOLEAN NOT NULL DEFAULT FALSE,
    has_debt_relief_order BOOLEAN NOT NULL DEFAULT FALSE
);
--rollback DROP TABLE person;

--changeset author:2
CREATE TRIGGER trigger_person_updated_at
    BEFORE UPDATE ON united_kingdom_power_of_attorney_for_financial_decisions.person
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_power_of_attorney_for_financial_decisions.set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_person_updated_at ON person;

--changeset author:3
COMMENT ON TABLE united_kingdom_power_of_attorney_for_financial_decisions.person IS
    'Person — every named individual involved in an LPA (donor, attorney, replacement attorney, certificate provider, person to notify, witness, applicant, recipient).';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.title IS
    'Honorific title such as Mr, Mrs, Ms, Mx, Dr.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.first_names IS
    'First name(s) including any middle names, as written on the LP1F deed.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.last_name IS
    'Last name (surname / family name) as written on the LP1F deed.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.other_names IS
    'Other names the person is or has been known by, such as a maiden name.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.date_of_birth IS
    'Date of birth — used to compute age for the donor (must be 18+) and attorneys (must be 18+).';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.address_id IS
    'Foreign key to the address table; nullable because some persons (witnesses captured only by name and signature) may not have a recorded address.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.is_trust_corporation IS
    'TRUE if this "person" is a trust corporation appointed as a corporate attorney (LP1F section 2); requires LPC continuation sheet 4.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.trust_corporation_number IS
    'Companies House registration number or other corporate identifier of the trust corporation; empty if not a trust corporation.';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.is_bankrupt IS
    'TRUE if the person is currently bankrupt — a bankrupt person cannot be appointed as a financial attorney (MCA 2005 s. 10(2)).';
COMMENT ON COLUMN united_kingdom_power_of_attorney_for_financial_decisions.person.has_debt_relief_order IS
    'TRUE if the person is currently subject to a debt relief order — same statutory disqualification as bankruptcy for financial attorneys (MCA 2005 s. 13(8)).';
--rollback SELECT 1;
