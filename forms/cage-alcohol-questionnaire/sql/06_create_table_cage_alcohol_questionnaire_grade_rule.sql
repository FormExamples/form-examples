-- Audit trail of every grading rule that fired during CAGE computation.
-- Each row records one rule firing with the criterion it belongs to, the
-- point it contributed, and a human-readable description.

CREATE TABLE cage_alcohol_questionnaire_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cage_alcohol_questionnaire_grade_id UUID NOT NULL
        REFERENCES cage_alcohol_questionnaire_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(20) NOT NULL
        CHECK (parameter IN ('cut-down', 'annoyed', 'guilty', 'eye-opener', 'total')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX cage_alcohol_questionnaire_grade_rule_grade_id_idx
    ON cage_alcohol_questionnaire_grade_rule (cage_alcohol_questionnaire_grade_id);

CREATE TRIGGER trigger_cage_alcohol_questionnaire_grade_rule_updated_at
    BEFORE UPDATE ON cage_alcohol_questionnaire_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cage_alcohol_questionnaire_grade_rule IS
    'Audit trail of every grading rule that fired during CAGE computation: criterion, point contributed, category, and description.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.cage_alcohol_questionnaire_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-EYE-OPENER-1POINT-01).';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.parameter IS
    'Scored criterion the rule belongs to: cut-down, annoyed, guilty, eye-opener, or total.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.points IS
    'Point (0-1) contributed by this rule for its criterion.';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.category IS
    'Subject category (e.g. criterion-positive, total-band).';
COMMENT ON COLUMN cage_alcohol_questionnaire_grade_rule.description IS
    'Human-readable description of why the rule fired.';
