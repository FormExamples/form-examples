--liquibase formatted sql

--changeset author:1
-- LPA validation flag — one row per non-blocking warning flag that
-- fired while validating an LPA. Flags do not block registration but
-- they raise the composite-risk grade.

CREATE TABLE lpa_validation_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    flag_name TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT '' CHECK (priority IN ('low', 'moderate', 'high')),
    category TEXT NOT NULL DEFAULT '',
    remediation_hint TEXT NOT NULL DEFAULT '',
    fired_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (lpa_id, flag_name)
);
--rollback DROP TABLE lpa_validation_flag;

--changeset author:2
CREATE TRIGGER trigger_lpa_validation_flag_updated_at
    BEFORE UPDATE ON lpa_validation_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_validation_flag_updated_at ON lpa_validation_flag;

--changeset author:3
COMMENT ON TABLE lpa_validation_flag IS
    'LPA validation flag — non-blocking warning flags that fired during validation (e.g. SingleAttorneyNoReplacement, OnlyWhenNoCapacitySelected).';
COMMENT ON COLUMN lpa_validation_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validation_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validation_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validation_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validation_flag.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_validation_flag.flag_name IS
    'Programmatic name of the fired flag (e.g. SingleAttorneyNoReplacement, ReducedFeeWithoutLPA120A).';
COMMENT ON COLUMN lpa_validation_flag.priority IS
    'Severity priority of the flag. One of: low, moderate, high (flags never reach critical).';
COMMENT ON COLUMN lpa_validation_flag.category IS
    'Free-text category grouping the flag belongs to (e.g. fee, witnesses, attorneys, instructions).';
COMMENT ON COLUMN lpa_validation_flag.remediation_hint IS
    'User-facing hint explaining how to clear the flag.';
COMMENT ON COLUMN lpa_validation_flag.fired_at IS
    'Timestamp when this flag fired during validation.';
--rollback SELECT 1;
