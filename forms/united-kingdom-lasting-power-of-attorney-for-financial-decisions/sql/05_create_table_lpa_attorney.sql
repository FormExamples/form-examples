--liquibase formatted sql

--changeset author:1
-- LPA attorney — many-to-one join: persons appointed as original
-- attorneys for a given LPA (LP1F section 2). At least one is required;
-- more than four requires LPC continuation sheet 1.

CREATE TABLE lpa_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    ordinal SMALLINT NOT NULL DEFAULT 1,

    UNIQUE (lpa_id, person_id)
);
--rollback DROP TABLE lpa_attorney;

--changeset author:2
CREATE TRIGGER trigger_lpa_attorney_updated_at
    BEFORE UPDATE ON lpa_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_attorney_updated_at ON lpa_attorney;

--changeset author:3
COMMENT ON TABLE lpa_attorney IS
    'LPA attorney — join table linking persons appointed as original attorneys to an LPA (LP1F section 2).';
COMMENT ON COLUMN lpa_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_attorney.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_attorney.person_id IS
    'Foreign key to the person table — the appointed attorney.';
COMMENT ON COLUMN lpa_attorney.ordinal IS
    'Listing order on the LP1F deed (1, 2, 3, ...) so attorneys round-trip in the same order as they appear on the printed form.';
--rollback SELECT 1;
