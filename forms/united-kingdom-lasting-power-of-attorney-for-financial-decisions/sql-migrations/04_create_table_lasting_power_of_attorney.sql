--liquibase formatted sql

--changeset author:1
-- Lasting power of attorney — the top-level deed; one row per LPA.
-- Captures the donor, the decision mode (LP1F section 3), when the
-- attorneys can act (section 5), free-text preferences and instructions
-- (section 7), the legal-rights acknowledgement (section 8), and the
-- registration outcome from the Office of the Public Guardian.

CREATE TABLE lasting_power_of_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    donor_person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    decision_mode TEXT NOT NULL DEFAULT '' CHECK (decision_mode IN ('single_attorney', 'jointly_and_severally', 'jointly', 'mixed', '')),
    decision_mode_mixed_text TEXT NOT NULL DEFAULT '',
    when_attorneys_can_act TEXT NOT NULL DEFAULT '' CHECK (when_attorneys_can_act IN ('as_soon_as_registered', 'only_when_no_capacity', '')),
    preferences_text TEXT NOT NULL DEFAULT '',
    instructions_text TEXT NOT NULL DEFAULT '',
    legal_rights_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    opg_reference_number TEXT NOT NULL DEFAULT '',
    opg_registration_date DATE,
    status TEXT NOT NULL DEFAULT '' CHECK (status IN ('draft', 'ready_for_signing', 'partially_signed', 'fully_signed', 'ready_for_registration', 'submitted', 'registered', 'rejected', ''))
);
--rollback DROP TABLE lasting_power_of_attorney;

--changeset author:2
CREATE TRIGGER trigger_lasting_power_of_attorney_updated_at
    BEFORE UPDATE ON lasting_power_of_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lasting_power_of_attorney_updated_at ON lasting_power_of_attorney;

--changeset author:3
COMMENT ON TABLE lasting_power_of_attorney IS
    'Lasting power of attorney — the top-level LP1F deed (one row per LPA), under the Mental Capacity Act 2005.';
COMMENT ON COLUMN lasting_power_of_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lasting_power_of_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lasting_power_of_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lasting_power_of_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lasting_power_of_attorney.donor_person_id IS
    'Foreign key to the person table — the donor making the LPA (LP1F section 1).';
COMMENT ON COLUMN lasting_power_of_attorney.decision_mode IS
    'How the attorneys make decisions (LP1F section 3). One of: single_attorney, jointly_and_severally, jointly, mixed.';
COMMENT ON COLUMN lasting_power_of_attorney.decision_mode_mixed_text IS
    'When decision_mode is "mixed": free-text listing which decisions are joint and which are joint-and-several (continued on LPC sheet 2 if long).';
COMMENT ON COLUMN lasting_power_of_attorney.when_attorneys_can_act IS
    'When the attorneys may begin acting (LP1F section 5). One of: as_soon_as_registered, only_when_no_capacity.';
COMMENT ON COLUMN lasting_power_of_attorney.preferences_text IS
    'Donor preferences for the attorneys to consider (LP1F section 7); non-binding guidance.';
COMMENT ON COLUMN lasting_power_of_attorney.instructions_text IS
    'Donor instructions the attorneys must follow (LP1F section 7); legally binding on the attorneys.';
COMMENT ON COLUMN lasting_power_of_attorney.legal_rights_acknowledged IS
    'TRUE when the donor has read and acknowledged the legal-rights statement in LP1F section 8.';
COMMENT ON COLUMN lasting_power_of_attorney.opg_reference_number IS
    'Office of the Public Guardian reference number issued on registration.';
COMMENT ON COLUMN lasting_power_of_attorney.opg_registration_date IS
    'Date the OPG registered the LPA (the date the LPA becomes legally usable).';
COMMENT ON COLUMN lasting_power_of_attorney.status IS
    'Lifecycle status. One of: draft, ready_for_signing, partially_signed, fully_signed, ready_for_registration, submitted, registered, rejected.';
--rollback SELECT 1;
