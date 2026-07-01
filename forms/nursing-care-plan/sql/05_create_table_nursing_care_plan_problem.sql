-- Nursing problems / needs identified for a care plan. Each problem is one
-- row and cascades from the parent nursing_care_plan. A problem carries its
-- RLT activity-of-living category, whether it is actual or potential, the
-- supporting assessment data, any linked risk assessment, and the inline
-- evaluation (E of ADPIE). SMART goals and planned interventions are held in
-- child tables that cascade from this problem.

CREATE TABLE nursing_care_plan_problem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nursing_care_plan_id UUID NOT NULL REFERENCES nursing_care_plan(id) ON DELETE CASCADE,

    problem_statement TEXT NOT NULL DEFAULT '',
    adl_category VARCHAR(30) NOT NULL DEFAULT '' CHECK (adl_category IN ('safe-environment', 'communication', 'breathing', 'eating-drinking', 'elimination', 'personal-cleansing-dressing', 'body-temperature', 'mobilising', 'working-playing', 'expressing-sexuality', 'sleeping', 'dying', 'other', '')),
    actual_or_potential VARCHAR(10) NOT NULL DEFAULT '' CHECK (actual_or_potential IN ('actual', 'potential', '')),
    assessment_data TEXT NOT NULL DEFAULT '',
    linked_risk VARCHAR(20) NOT NULL DEFAULT '' CHECK (linked_risk IN ('none', 'falls', 'pressure-ulcer', 'vte', 'nutrition', '')),
    evaluation_note TEXT NOT NULL DEFAULT '',
    goal_met VARCHAR(20) NOT NULL DEFAULT '' CHECK (goal_met IN ('met', 'partially-met', 'not-met', 'not-evaluated', '')),
    next_review_date DATE
);

CREATE INDEX nursing_care_plan_problem_care_plan_id_idx
    ON nursing_care_plan_problem (nursing_care_plan_id);

CREATE TRIGGER trigger_nursing_care_plan_problem_updated_at
    BEFORE UPDATE ON nursing_care_plan_problem
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan_problem IS
    'Nursing problems / needs identified for a care plan: RLT activity category, actual/potential, assessment data, linked risk, and inline evaluation.';
COMMENT ON COLUMN nursing_care_plan_problem.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan_problem.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN nursing_care_plan_problem.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN nursing_care_plan_problem.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN nursing_care_plan_problem.nursing_care_plan_id IS
    'Foreign key to the parent nursing care plan.';
COMMENT ON COLUMN nursing_care_plan_problem.problem_statement IS
    'The identified nursing problem or need.';
COMMENT ON COLUMN nursing_care_plan_problem.adl_category IS
    'Roper-Logan-Tierney activity of living the problem relates to (e.g. breathing, eating-drinking, mobilising, elimination).';
COMMENT ON COLUMN nursing_care_plan_problem.actual_or_potential IS
    'Whether the problem is actual (present) or potential (at risk).';
COMMENT ON COLUMN nursing_care_plan_problem.assessment_data IS
    'Supporting observation or assessment data for the problem.';
COMMENT ON COLUMN nursing_care_plan_problem.linked_risk IS
    'Referenced risk assessment linked to this problem: none, falls, pressure-ulcer, vte, or nutrition.';
COMMENT ON COLUMN nursing_care_plan_problem.evaluation_note IS
    'Inline evaluation note (the E of ADPIE).';
COMMENT ON COLUMN nursing_care_plan_problem.goal_met IS
    'Overall evaluation of whether the problem goal was met: met, partially-met, not-met, or not-evaluated.';
COMMENT ON COLUMN nursing_care_plan_problem.next_review_date IS
    'Date this problem is next due for review.';
