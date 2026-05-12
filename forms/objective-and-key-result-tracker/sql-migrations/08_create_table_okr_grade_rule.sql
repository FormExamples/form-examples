--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_grade_id UUID NOT NULL REFERENCES okr_grade(id) ON DELETE CASCADE,
    rule_id TEXT NOT NULL DEFAULT '',
    instrument TEXT NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'progress','confidence','stretch','alignment',
            'impact','smart','pace','composite',''
        )),
    grade TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_okr_grade_rule_updated_at
    BEFORE UPDATE ON okr_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX okr_grade_rule_index_okr_grade_id ON okr_grade_rule(okr_grade_id);

COMMENT ON TABLE okr_grade_rule IS
    'A grading rule that fired during composite RAG computation. Many rows per okr_grade.';
COMMENT ON COLUMN okr_grade_rule.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade_rule.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade_rule.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade_rule.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade_rule.okr_grade_id IS 'Foreign key to the parent okr_grade.';
COMMENT ON COLUMN okr_grade_rule.rule_id IS 'Stable rule identifier (e.g. R-PROGRESS-RED-COMMITTED).';
COMMENT ON COLUMN okr_grade_rule.instrument IS
    'Which scoring instrument fired the rule: progress, confidence, stretch, alignment, impact, smart, pace, or composite.';
COMMENT ON COLUMN okr_grade_rule.grade IS 'Grade band the rule attached: green, amber, red.';
COMMENT ON COLUMN okr_grade_rule.category IS 'Free-text category, e.g. progress, alignment, smart.';
COMMENT ON COLUMN okr_grade_rule.description IS 'Human-readable rule description.';

--rollback DROP TABLE okr_grade_rule;
