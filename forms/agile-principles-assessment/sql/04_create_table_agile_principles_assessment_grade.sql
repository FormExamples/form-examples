CREATE TABLE agile_principles_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    agile_principles_assessment_id UUID NOT NULL UNIQUE
        REFERENCES agile_principles_assessment(id) ON DELETE CASCADE,
    answered_count SMALLINT NOT NULL DEFAULT 0
        CHECK (answered_count BETWEEN 0 AND 12),
    mean_score NUMERIC(3,2)
        CHECK (mean_score IS NULL OR mean_score BETWEEN 1.00 AND 5.00),
    weighted_mean_score NUMERIC(3,2)
        CHECK (weighted_mean_score IS NULL OR weighted_mean_score BETWEEN 1.00 AND 5.00),
    weights_customised BOOLEAN NOT NULL DEFAULT FALSE,
    maturity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (maturity IN (
            'optimising',
            'mature',
            'developing',
            'initial',
            'ad-hoc',
            'insufficient-data',
            ''
        )),
    top_action_1 VARCHAR(500) NOT NULL DEFAULT '',
    top_action_2 VARCHAR(500) NOT NULL DEFAULT '',
    top_action_3 VARCHAR(500) NOT NULL DEFAULT '',
    coach_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_agile_principles_assessment_grade_updated_at
    BEFORE UPDATE ON agile_principles_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_principles_assessment_grade IS
    'Computed grading and signed-off action plan. One-to-one with agile_principles_assessment.';
COMMENT ON COLUMN agile_principles_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_principles_assessment_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_principles_assessment_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_principles_assessment_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_principles_assessment_grade.agile_principles_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN agile_principles_assessment_grade.answered_count IS
    'Number of principles (0-12) that received a Likert score.';
COMMENT ON COLUMN agile_principles_assessment_grade.mean_score IS
    'Unweighted mean of answered principle scores; NULL when fewer than 6 principles were answered.';
COMMENT ON COLUMN agile_principles_assessment_grade.weighted_mean_score IS
    'Weighted mean of answered principle scores using the per-principle weights from the assessment row; equals mean_score when no weight is customised. NULL when fewer than 6 principles were answered.';
COMMENT ON COLUMN agile_principles_assessment_grade.weights_customised IS
    'TRUE when at least one principle weight on the assessment differs from the default 1.00.';
COMMENT ON COLUMN agile_principles_assessment_grade.maturity IS
    'Composite maturity level: optimising, mature, developing, initial, ad-hoc, or insufficient-data.';
COMMENT ON COLUMN agile_principles_assessment_grade.top_action_1 IS
    'First prioritised action drawn from the weakest principles.';
COMMENT ON COLUMN agile_principles_assessment_grade.top_action_2 IS
    'Second prioritised action drawn from the weakest principles.';
COMMENT ON COLUMN agile_principles_assessment_grade.top_action_3 IS
    'Third prioritised action drawn from the weakest principles.';
COMMENT ON COLUMN agile_principles_assessment_grade.coach_notes IS
    'Free-text agile-coach notes accompanying the action plan.';
COMMENT ON COLUMN agile_principles_assessment_grade.signed_at IS
    'Timestamp of electronic sign-off.';
COMMENT ON COLUMN agile_principles_assessment_grade.graded_at IS
    'Timestamp the engine last computed this result.';
