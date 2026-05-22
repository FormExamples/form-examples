--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_grade_id UUID NOT NULL REFERENCES okr_grade(id) ON DELETE CASCADE,
    flag_code TEXT NOT NULL DEFAULT ''
        CHECK (flag_code IN (
            'mis-aligned','orphaned','non-smart','unmeasurable','no-dri',
            'committed-at-risk','pace-collapse','confidence-collapse',
            'stale-check-in','cascading-broken','over-scoped','moonshot-progress',''
        )),
    priority TEXT NOT NULL DEFAULT ''
        CHECK (priority IN ('high','medium','low','')),
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_okr_grade_flag_updated_at
    BEFORE UPDATE ON okr_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_grade_flag_index_okr_grade_id ON okr_grade_flag(okr_grade_id);
CREATE INDEX okr_grade_flag_index_flag_code ON okr_grade_flag(flag_code);

COMMENT ON TABLE okr_grade_flag IS
    'A risk flag attached to an OKR grade. Computed independently of the composite RAG.';
COMMENT ON COLUMN okr_grade_flag.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade_flag.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade_flag.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade_flag.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade_flag.okr_grade_id IS 'Foreign key to the parent okr_grade.';
COMMENT ON COLUMN okr_grade_flag.flag_code IS
    'Flag code: mis-aligned, orphaned, non-smart, unmeasurable, no-dri, committed-at-risk, pace-collapse, confidence-collapse, stale-check-in, cascading-broken, over-scoped, moonshot-progress.';
COMMENT ON COLUMN okr_grade_flag.priority IS 'Flag priority: high, medium, low.';
COMMENT ON COLUMN okr_grade_flag.description IS 'Human-readable description of why the flag fired.';

--rollback DROP TABLE okr_grade_flag;
