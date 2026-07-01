-- Audit trail of every grading rule that fired during Child-Pugh
-- computation. Each row records one rule firing with the parameter it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE child_pugh_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    child_pugh_score_grade_id UUID NOT NULL
        REFERENCES child_pugh_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(20) NOT NULL
        CHECK (parameter IN ('bilirubin', 'albumin', 'coagulation', 'ascites', 'encephalopathy', 'class')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX child_pugh_score_grade_rule_grade_id_idx
    ON child_pugh_score_grade_rule (child_pugh_score_grade_id);

CREATE TRIGGER trigger_child_pugh_score_grade_rule_updated_at
    BEFORE UPDATE ON child_pugh_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_pugh_score_grade_rule IS
    'Audit trail of every grading rule that fired during Child-Pugh computation: parameter, points contributed, category, and description.';
COMMENT ON COLUMN child_pugh_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_pugh_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN child_pugh_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN child_pugh_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN child_pugh_score_grade_rule.child_pugh_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN child_pugh_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BILIRUBIN-3POINT-01).';
COMMENT ON COLUMN child_pugh_score_grade_rule.parameter IS
    'Scored parameter the rule belongs to: bilirubin, albumin, coagulation, ascites, encephalopathy, or class.';
COMMENT ON COLUMN child_pugh_score_grade_rule.points IS
    'Points (1-3) contributed by this rule for its parameter.';
COMMENT ON COLUMN child_pugh_score_grade_rule.category IS
    'Subject category (e.g. threshold-band, class-band).';
COMMENT ON COLUMN child_pugh_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
