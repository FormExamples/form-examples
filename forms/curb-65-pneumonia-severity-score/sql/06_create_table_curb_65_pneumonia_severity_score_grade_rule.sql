-- Audit trail of every grading rule that fired during CURB-65
-- computation. Each row records one rule firing with the criterion it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE curb_65_pneumonia_severity_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    curb_65_pneumonia_severity_score_grade_id UUID NOT NULL
        REFERENCES curb_65_pneumonia_severity_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    criterion VARCHAR(20) NOT NULL
        CHECK (criterion IN ('confusion', 'urea', 'respiratory-rate', 'blood-pressure', 'age', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX curb_65_pneumonia_severity_score_grade_rule_grade_id_idx
    ON curb_65_pneumonia_severity_score_grade_rule (curb_65_pneumonia_severity_score_grade_id);

CREATE TRIGGER trigger_curb_65_pneumonia_severity_score_grade_rule_updated_at
    BEFORE UPDATE ON curb_65_pneumonia_severity_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE curb_65_pneumonia_severity_score_grade_rule IS
    'Audit trail of every grading rule that fired during CURB-65 computation: criterion, points contributed, category, and description.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.curb_65_pneumonia_severity_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CONFUSION-01).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.criterion IS
    'Scored criterion the rule belongs to: confusion, urea, respiratory-rate, blood-pressure, age, or band.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.points IS
    'Points (0 or 1) contributed by this rule for its criterion.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.category IS
    'Subject category (e.g. threshold-band, band-classification).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
