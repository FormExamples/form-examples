-- Flagged issues raised independently of the completeness status, with a
-- priority and a suggested action for the nursing team.

CREATE TABLE nursing_care_plan_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nursing_care_plan_grade_id UUID NOT NULL
        REFERENCES nursing_care_plan_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'risk-without-intervention',
            'high-risk-not-actioned',
            'missing-evaluation',
            'unmet-goal-overdue',
            'no-review-date',
            'incomplete-problem',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX nursing_care_plan_grade_flag_grade_id_idx
    ON nursing_care_plan_grade_flag (nursing_care_plan_grade_id);

CREATE TRIGGER trigger_nursing_care_plan_grade_flag_updated_at
    BEFORE UPDATE ON nursing_care_plan_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan_grade_flag IS
    'Flagged issues raised independently of the completeness status, with priority and a suggested action for the nursing team.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.nursing_care_plan_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-RISK-WITHOUT-INTERVENTION-001).';
COMMENT ON COLUMN nursing_care_plan_grade_flag.category IS
    'Flag category: risk-without-intervention, high-risk-not-actioned, missing-evaluation, unmet-goal-overdue, no-review-date, incomplete-problem, or other.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN nursing_care_plan_grade_flag.suggested_action IS
    'Suggested nursing action (e.g. "add an intervention for the high falls risk").';
