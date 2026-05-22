--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_check_in (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL REFERENCES okr_objective(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    narrative TEXT NOT NULL DEFAULT '',
    since_last_changes TEXT NOT NULL DEFAULT '',
    blockers TEXT NOT NULL DEFAULT '',
    asks TEXT NOT NULL DEFAULT '',
    confidence_decile_at_check_in INTEGER
        CHECK (confidence_decile_at_check_in IS NULL OR confidence_decile_at_check_in BETWEEN 1 AND 10)
);

CREATE TRIGGER trigger_okr_check_in_updated_at
    BEFORE UPDATE ON okr_check_in
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_check_in_index_okr_objective_id ON okr_check_in(okr_objective_id);
CREATE INDEX okr_check_in_index_checked_in_at ON okr_check_in(checked_in_at);

COMMENT ON TABLE okr_check_in IS
    'Periodic progress check-in narrative for an objective. Many rows per okr_objective.';
COMMENT ON COLUMN okr_check_in.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_check_in.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_check_in.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_check_in.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_check_in.okr_objective_id IS 'Foreign key to the parent okr_objective.';
COMMENT ON COLUMN okr_check_in.checked_in_at IS 'When this check-in was made.';
COMMENT ON COLUMN okr_check_in.narrative IS 'Free-text update narrative.';
COMMENT ON COLUMN okr_check_in.since_last_changes IS 'Summary of what changed since the previous check-in.';
COMMENT ON COLUMN okr_check_in.blockers IS 'Current blockers as of this check-in.';
COMMENT ON COLUMN okr_check_in.asks IS 'Asks for help / decisions / resources at this check-in.';
COMMENT ON COLUMN okr_check_in.confidence_decile_at_check_in IS
    'Confidence decile snapshot 1-10 at this check-in; used by the confidence-collapse flag.';

--rollback DROP TABLE okr_check_in;
