-- Audit trail of every grading rule that fired during qSOFA
-- computation. Each row records one rule firing with the criterion it
-- belongs to, the point it contributed, and a human-readable
-- description.

CREATE TABLE quick_sequential_organ_failure_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    quick_sequential_organ_failure_assessment_grade_id UUID NOT NULL
        REFERENCES quick_sequential_organ_failure_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    criterion VARCHAR(30) NOT NULL
        CHECK (criterion IN ('respiratory-rate', 'mentation', 'systolic-blood-pressure', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX quick_sequential_organ_failure_assessment_grade_rule_grade_id_idx
    ON quick_sequential_organ_failure_assessment_grade_rule (quick_sequential_organ_failure_assessment_grade_id);

CREATE TRIGGER trigger_quick_sequential_organ_failure_assessment_grade_rule_updated_at
    BEFORE UPDATE ON quick_sequential_organ_failure_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE quick_sequential_organ_failure_assessment_grade_rule IS
    'Audit trail of every grading rule that fired during qSOFA computation: criterion, point contributed, category, and description.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.quick_sequential_organ_failure_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-RESPIRATORY-RATE-01).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.criterion IS
    'Scored criterion the rule belongs to: respiratory-rate, mentation, systolic-blood-pressure, or band.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.points IS
    'Point (0 or 1) contributed by this rule for its criterion.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.category IS
    'Subject category (e.g. threshold-band, risk-band).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
