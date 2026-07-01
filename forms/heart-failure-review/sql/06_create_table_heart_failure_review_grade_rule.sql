-- Audit trail of every classification or completeness rule that fired during
-- grading. Each row records one rule firing with the section it concerns, the
-- category, and a human-readable description.

CREATE TABLE heart_failure_review_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    heart_failure_review_grade_id UUID NOT NULL
        REFERENCES heart_failure_review_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN ('functional', 'medication', 'completeness', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX heart_failure_review_grade_rule_grade_id_idx
    ON heart_failure_review_grade_rule (heart_failure_review_grade_id);

CREATE TRIGGER trigger_heart_failure_review_grade_rule_updated_at
    BEFORE UPDATE ON heart_failure_review_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE heart_failure_review_grade_rule IS
    'Audit trail of every classification or completeness rule that fired during grading: section, category, and description.';
COMMENT ON COLUMN heart_failure_review_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_failure_review_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN heart_failure_review_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN heart_failure_review_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN heart_failure_review_grade_rule.heart_failure_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN heart_failure_review_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-FUNCTIONAL-NYHA-III-01).';
COMMENT ON COLUMN heart_failure_review_grade_rule.section IS
    'Section the rule concerns: functional, medication, or completeness.';
COMMENT ON COLUMN heart_failure_review_grade_rule.category IS
    'Subject category (e.g. functional-status, optimisation-status, required-domain).';
COMMENT ON COLUMN heart_failure_review_grade_rule.description IS
    'Human-readable description of why the rule fired.';
