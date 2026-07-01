-- Audit trail of every grading rule that fired during SOFA computation.
-- Each row records one rule firing with the organ system (or derivation)
-- it belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE sequential_organ_failure_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    sequential_organ_failure_assessment_grade_id UUID NOT NULL
        REFERENCES sequential_organ_failure_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(20) NOT NULL
        CHECK (parameter IN ('respiration', 'coagulation', 'liver', 'cardiovascular', 'cns', 'renal', 'total', 'delta', 'band', 'sepsis')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX sequential_organ_failure_assessment_grade_rule_grade_id_idx
    ON sequential_organ_failure_assessment_grade_rule (sequential_organ_failure_assessment_grade_id);

CREATE TRIGGER trigger_sequential_organ_failure_assessment_grade_rule_updated_at
    BEFORE UPDATE ON sequential_organ_failure_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE sequential_organ_failure_assessment_grade_rule IS
    'Audit trail of every grading rule that fired during SOFA computation: organ system or derivation, points contributed, category, and description.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.sequential_organ_failure_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-RESPIRATION-3POINT-01).';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.parameter IS
    'Organ system or derivation the rule belongs to: respiration, coagulation, liver, cardiovascular, cns, renal, total, delta, band, or sepsis.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.points IS
    'Points (0-4) contributed by this rule for its organ system.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.category IS
    'Subject category (e.g. threshold-band, mortality-band, sepsis-criterion).';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
