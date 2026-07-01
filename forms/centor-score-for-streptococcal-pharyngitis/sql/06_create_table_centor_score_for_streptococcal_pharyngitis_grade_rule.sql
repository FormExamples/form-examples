-- Audit trail of every grading rule that fired during Centor / McIsaac
-- computation. Each row records one rule firing with the criterion it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE centor_score_for_streptococcal_pharyngitis_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    centor_score_for_streptococcal_pharyngitis_grade_id UUID NOT NULL
        REFERENCES centor_score_for_streptococcal_pharyngitis_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    criterion VARCHAR(30) NOT NULL
        CHECK (criterion IN ('tonsillar-exudate', 'tender-nodes', 'fever', 'cough-absent', 'age-modifier', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX centor_score_for_streptococcal_pharyngitis_grade_rule_grade_id_idx
    ON centor_score_for_streptococcal_pharyngitis_grade_rule (centor_score_for_streptococcal_pharyngitis_grade_id);

CREATE TRIGGER trigger_centor_score_for_streptococcal_pharyngitis_grade_rule_updated_at
    BEFORE UPDATE ON centor_score_for_streptococcal_pharyngitis_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE centor_score_for_streptococcal_pharyngitis_grade_rule IS
    'Audit trail of every grading rule that fired during Centor / McIsaac computation: criterion, points contributed, category, and description.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.centor_score_for_streptococcal_pharyngitis_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-FEVER-01).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.criterion IS
    'Scored criterion the rule belongs to: tonsillar-exudate, tender-nodes, fever, cough-absent, age-modifier, or band.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.points IS
    'Points contributed by this rule (0 or 1 per criterion; -1..+1 for the age modifier).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.category IS
    'Subject category (e.g. criterion-point, age-band, risk-band).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade_rule.description IS
    'Human-readable description of why the rule fired.';
