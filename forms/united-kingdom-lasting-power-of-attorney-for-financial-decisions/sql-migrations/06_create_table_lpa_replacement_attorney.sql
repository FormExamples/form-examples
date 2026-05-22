--liquibase formatted sql

--changeset author:1
-- LPA replacement attorney — many-to-one join: persons appointed as
-- replacement attorneys for a given LPA (LP1F section 4). A replacement
-- attorney steps in when an original attorney can no longer act.

CREATE TABLE lpa_replacement_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    ordinal SMALLINT NOT NULL DEFAULT 1,
    replacement_step_in_condition TEXT NOT NULL DEFAULT '',

    UNIQUE (lpa_id, person_id)
);
--rollback DROP TABLE lpa_replacement_attorney;

--changeset author:2
CREATE TRIGGER trigger_lpa_replacement_attorney_updated_at
    BEFORE UPDATE ON lpa_replacement_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_replacement_attorney_updated_at ON lpa_replacement_attorney;

--changeset author:3
COMMENT ON TABLE lpa_replacement_attorney IS
    'LPA replacement attorney — join table linking persons appointed as replacement attorneys to an LPA (LP1F section 4).';
COMMENT ON COLUMN lpa_replacement_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_replacement_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_replacement_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_replacement_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_replacement_attorney.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_replacement_attorney.person_id IS
    'Foreign key to the person table — the appointed replacement attorney.';
COMMENT ON COLUMN lpa_replacement_attorney.ordinal IS
    'Listing order on the LP1F deed.';
COMMENT ON COLUMN lpa_replacement_attorney.replacement_step_in_condition IS
    'Optional override of when and how this replacement attorney steps in (LP1F section 4 "when and how"); continued on LPC sheet 2 if long.';
--rollback SELECT 1;
