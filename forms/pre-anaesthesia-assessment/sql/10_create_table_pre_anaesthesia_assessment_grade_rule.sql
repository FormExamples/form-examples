CREATE TABLE pre_anaesthesia_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES pre_anaesthesia_assessment_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(30) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('asa', 'mallampati', 'rcri', 'stopbang', 'frailty')),
    grade VARCHAR(5) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_grading_fired_rule_grade_id
    ON pre_anaesthesia_assessment_grade_rule(grade_id);

CREATE TRIGGER trigger_pre_anaesthesia_assessment_grade_rule_updated_at
    BEFORE UPDATE ON pre_anaesthesia_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pre_anaesthesia_assessment_grade_rule IS
    'Audit trail of every ASA / Mallampati / RCRI / STOP-BANG / frailty rule that fired for this assessment.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ASA-III-02).';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: asa, mallampati, rcri, stopbang, frailty.';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.grade IS
    'Grade contributed by this rule (e.g. III for ASA).';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.category IS
    'Body-system or risk category (e.g. cardiovascular, respiratory).';
COMMENT ON COLUMN pre_anaesthesia_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
