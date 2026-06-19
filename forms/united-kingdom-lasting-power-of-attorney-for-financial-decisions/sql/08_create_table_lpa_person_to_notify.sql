--liquibase formatted sql

--changeset author:1
-- LPA person to notify — 0 to 5 persons who must be notified when the
-- LPA is submitted for registration (LP1F section 6, LP3 notice).

CREATE TABLE lpa_person_to_notify (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    ordinal SMALLINT NOT NULL CHECK (ordinal BETWEEN 1 AND 5),

    UNIQUE (lpa_id, ordinal)
);
--rollback DROP TABLE lpa_person_to_notify;

--changeset author:2
CREATE TRIGGER trigger_lpa_person_to_notify_updated_at
    BEFORE UPDATE ON lpa_person_to_notify
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_person_to_notify_updated_at ON lpa_person_to_notify;

--changeset author:3
COMMENT ON TABLE lpa_person_to_notify IS
    'LPA person to notify — up to five persons who receive an LP3 notice on registration (LP1F section 6).';
COMMENT ON COLUMN lpa_person_to_notify.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_person_to_notify.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_person_to_notify.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_person_to_notify.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_person_to_notify.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_person_to_notify.person_id IS
    'Foreign key to the person table — the person who will be notified.';
COMMENT ON COLUMN lpa_person_to_notify.ordinal IS
    'Position on the LP1F deed, from 1 to 5; the statutory maximum is five (LP1F section 6).';
--rollback SELECT 1;
