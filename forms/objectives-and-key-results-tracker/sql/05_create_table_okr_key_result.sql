--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_key_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL REFERENCES okr_objective(id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 5),

    title TEXT NOT NULL DEFAULT '',
    kr_type TEXT NOT NULL DEFAULT ''
        CHECK (kr_type IN ('numeric','milestone','binary','')),
    unit TEXT NOT NULL DEFAULT '',
    start_value NUMERIC(20,4),
    current_value NUMERIC(20,4),
    target_value NUMERIC(20,4),
    milestones_json JSONB,
    binary_done BOOLEAN,
    owner_name TEXT NOT NULL DEFAULT '',
    due_date DATE,
    progress_fraction NUMERIC(6,4)
        CHECK (progress_fraction IS NULL OR progress_fraction BETWEEN 0 AND 1),

    UNIQUE (okr_objective_id, position)
);

CREATE TRIGGER trigger_okr_key_result_updated_at
    BEFORE UPDATE ON okr_key_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_key_result_index_okr_objective_id ON okr_key_result(okr_objective_id);

COMMENT ON TABLE okr_key_result IS
    'A Key Result for an objective. 1-5 rows per okr_objective; UNIQUE on (okr_objective_id, position).';
COMMENT ON COLUMN okr_key_result.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_key_result.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_key_result.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_key_result.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_key_result.okr_objective_id IS 'Foreign key to the parent okr_objective.';
COMMENT ON COLUMN okr_key_result.position IS 'Display order 1-5; UNIQUE per objective.';
COMMENT ON COLUMN okr_key_result.title IS 'One-sentence Key Result statement.';
COMMENT ON COLUMN okr_key_result.kr_type IS
    'Key Result type: numeric (start/current/target), milestone (ordered list), or binary (done flag).';
COMMENT ON COLUMN okr_key_result.unit IS
    'Unit of measure for numeric KRs: USD, users, percent, count, etc.';
COMMENT ON COLUMN okr_key_result.start_value IS 'Numeric KR: starting value at cycle start.';
COMMENT ON COLUMN okr_key_result.current_value IS 'Numeric KR: latest observed value.';
COMMENT ON COLUMN okr_key_result.target_value IS 'Numeric KR: target value at cycle end.';
COMMENT ON COLUMN okr_key_result.milestones_json IS
    'Milestone KR: ordered JSONB list, each {name, done, completed_at}.';
COMMENT ON COLUMN okr_key_result.binary_done IS 'Binary KR: done flag.';
COMMENT ON COLUMN okr_key_result.owner_name IS 'Optional KR-level owner name (may differ from objective DRI).';
COMMENT ON COLUMN okr_key_result.due_date IS 'Optional due date for this KR (defaults to objective cycle_end_date).';
COMMENT ON COLUMN okr_key_result.progress_fraction IS
    'Computed progress fraction 0.0-1.0; numeric → (cur-start)/(target-start) clamped, milestone → done/total, binary → 0 or 1.';

--rollback DROP TABLE okr_key_result;
