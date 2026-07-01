-- SMART goals for a nursing problem. Each goal is one row and cascades from
-- the parent problem (which in turn cascades from the care plan).

CREATE TABLE nursing_care_plan_goal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nursing_care_plan_problem_id UUID NOT NULL REFERENCES nursing_care_plan_problem(id) ON DELETE CASCADE,

    goal_text TEXT NOT NULL DEFAULT '',
    target_date DATE,
    met VARCHAR(20) NOT NULL DEFAULT '' CHECK (met IN ('met', 'partially-met', 'not-met', 'not-evaluated', ''))
);

CREATE INDEX nursing_care_plan_goal_problem_id_idx
    ON nursing_care_plan_goal (nursing_care_plan_problem_id);

CREATE TRIGGER trigger_nursing_care_plan_goal_updated_at
    BEFORE UPDATE ON nursing_care_plan_goal
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan_goal IS
    'SMART goals for a nursing problem; cascades from the parent problem.';
COMMENT ON COLUMN nursing_care_plan_goal.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan_goal.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN nursing_care_plan_goal.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN nursing_care_plan_goal.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN nursing_care_plan_goal.nursing_care_plan_problem_id IS
    'Foreign key to the parent nursing problem.';
COMMENT ON COLUMN nursing_care_plan_goal.goal_text IS
    'The SMART (specific, measurable, achievable, relevant, time-bound) goal.';
COMMENT ON COLUMN nursing_care_plan_goal.target_date IS
    'Target or review date for the goal.';
COMMENT ON COLUMN nursing_care_plan_goal.met IS
    'Evaluation of whether the goal was met: met, partially-met, not-met, or not-evaluated.';
