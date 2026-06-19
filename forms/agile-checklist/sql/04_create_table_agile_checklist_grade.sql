CREATE TABLE agile_checklist_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    agile_checklist_id UUID NOT NULL UNIQUE
        REFERENCES agile_checklist(id) ON DELETE CASCADE,
    answered_count SMALLINT NOT NULL DEFAULT 0
        CHECK (answered_count BETWEEN 0 AND 57),
    teams_yes_count SMALLINT NOT NULL DEFAULT 0
        CHECK (teams_yes_count BETWEEN 0 AND 25),
    teams_applicable_count SMALLINT NOT NULL DEFAULT 0
        CHECK (teams_applicable_count BETWEEN 0 AND 25),
    teams_percent NUMERIC(5,2)
        CHECK (teams_percent IS NULL OR teams_percent BETWEEN 0.00 AND 100.00),
    stakeholders_yes_count SMALLINT NOT NULL DEFAULT 0
        CHECK (stakeholders_yes_count BETWEEN 0 AND 14),
    stakeholders_applicable_count SMALLINT NOT NULL DEFAULT 0
        CHECK (stakeholders_applicable_count BETWEEN 0 AND 14),
    stakeholders_percent NUMERIC(5,2)
        CHECK (stakeholders_percent IS NULL OR stakeholders_percent BETWEEN 0.00 AND 100.00),
    practices_yes_count SMALLINT NOT NULL DEFAULT 0
        CHECK (practices_yes_count BETWEEN 0 AND 18),
    practices_applicable_count SMALLINT NOT NULL DEFAULT 0
        CHECK (practices_applicable_count BETWEEN 0 AND 18),
    practices_percent NUMERIC(5,2)
        CHECK (practices_percent IS NULL OR practices_percent BETWEEN 0.00 AND 100.00),
    overall_percent NUMERIC(5,2)
        CHECK (overall_percent IS NULL OR overall_percent BETWEEN 0.00 AND 100.00),
    teams_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (teams_band IN ('high', 'mid', 'low', 'unanswered', '')),
    stakeholders_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (stakeholders_band IN ('high', 'mid', 'low', 'unanswered', '')),
    practices_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (practices_band IN ('high', 'mid', 'low', 'unanswered', '')),
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

CREATE TRIGGER trigger_agile_checklist_grade_updated_at
    BEFORE UPDATE ON agile_checklist_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_checklist_grade IS
    'Computed grading and signed-off action plan. One-to-one with agile_checklist.';
COMMENT ON COLUMN agile_checklist_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_checklist_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_checklist_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_checklist_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_checklist_grade.agile_checklist_id IS
    'Foreign key to the parent checklist (unique, 1:1).';
COMMENT ON COLUMN agile_checklist_grade.answered_count IS
    'Total number of items (0-57) that received an answer of yes / no / not-applicable.';
COMMENT ON COLUMN agile_checklist_grade.teams_yes_count IS
    'Number of Teams items (0-25) answered yes.';
COMMENT ON COLUMN agile_checklist_grade.teams_applicable_count IS
    'Number of Teams items (0-25) answered yes or no (excludes not-applicable and unanswered).';
COMMENT ON COLUMN agile_checklist_grade.teams_percent IS
    'Teams section percentage of yes answers over applicable answers; NULL if no items applicable.';
COMMENT ON COLUMN agile_checklist_grade.stakeholders_yes_count IS
    'Number of Stakeholders items (0-14) answered yes.';
COMMENT ON COLUMN agile_checklist_grade.stakeholders_applicable_count IS
    'Number of Stakeholders items (0-14) answered yes or no.';
COMMENT ON COLUMN agile_checklist_grade.stakeholders_percent IS
    'Stakeholders section percentage of yes answers over applicable answers; NULL if no items applicable.';
COMMENT ON COLUMN agile_checklist_grade.practices_yes_count IS
    'Number of Practices items (0-18) answered yes.';
COMMENT ON COLUMN agile_checklist_grade.practices_applicable_count IS
    'Number of Practices items (0-18) answered yes or no.';
COMMENT ON COLUMN agile_checklist_grade.practices_percent IS
    'Practices section percentage of yes answers over applicable answers; NULL if no items applicable.';
COMMENT ON COLUMN agile_checklist_grade.overall_percent IS
    'Unweighted mean of the three section percentages; NULL when fewer than 30 items have been answered.';
COMMENT ON COLUMN agile_checklist_grade.teams_band IS
    'Teams band derived from teams_percent: high (>=75), mid (50-74), low (<50), unanswered.';
COMMENT ON COLUMN agile_checklist_grade.stakeholders_band IS
    'Stakeholders band derived from stakeholders_percent.';
COMMENT ON COLUMN agile_checklist_grade.practices_band IS
    'Practices band derived from practices_percent.';
COMMENT ON COLUMN agile_checklist_grade.maturity IS
    'Composite maturity level: optimising, mature, developing, initial, ad-hoc, or insufficient-data.';
COMMENT ON COLUMN agile_checklist_grade.top_action_1 IS
    'First prioritised action drawn from the weakest section.';
COMMENT ON COLUMN agile_checklist_grade.top_action_2 IS
    'Second prioritised action drawn from the weakest section.';
COMMENT ON COLUMN agile_checklist_grade.top_action_3 IS
    'Third prioritised action drawn from the weakest section.';
COMMENT ON COLUMN agile_checklist_grade.coach_notes IS
    'Free-text agile-coach notes accompanying the action plan.';
COMMENT ON COLUMN agile_checklist_grade.signed_at IS
    'Timestamp of electronic sign-off.';
COMMENT ON COLUMN agile_checklist_grade.graded_at IS
    'Timestamp the engine last computed this result.';
