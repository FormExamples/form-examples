-- Audit trail of every grading rule (per-variable point contributor)
-- that fired during GRACE computation. Each row records one contributor
-- with the GRACE variable it belongs to, the points it contributed, and
-- a human-readable description.

CREATE TABLE grace_score_for_acute_coronary_syndrome_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grace_score_for_acute_coronary_syndrome_grade_id UUID NOT NULL
        REFERENCES grace_score_for_acute_coronary_syndrome_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    variable VARCHAR(20) NOT NULL
        CHECK (variable IN ('age', 'heart-rate', 'systolic-bp', 'creatinine', 'killip', 'cardiac-arrest', 'st-deviation', 'cardiac-enzymes', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX grace_score_for_acute_coronary_syndrome_grade_rule_grade_id_idx
    ON grace_score_for_acute_coronary_syndrome_grade_rule (grace_score_for_acute_coronary_syndrome_grade_id);

CREATE TRIGGER trigger_grace_score_for_acute_coronary_syndrome_grade_rule_updated_at
    BEFORE UPDATE ON grace_score_for_acute_coronary_syndrome_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grace_score_for_acute_coronary_syndrome_grade_rule IS
    'Audit trail of every grading rule (per-variable point contributor) that fired during GRACE computation: GRACE variable, points contributed, category, and description.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.grace_score_for_acute_coronary_syndrome_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-AGE-BAND-04).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.variable IS
    'GRACE variable the contributor belongs to: age, heart-rate, systolic-bp, creatinine, killip, cardiac-arrest, st-deviation, cardiac-enzymes, or band.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.points IS
    'Weighted points contributed by this variable to the GRACE total.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.category IS
    'Subject category (e.g. weighted-band, mortality-band).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome_grade_rule.description IS
    'Human-readable description of why the rule fired.';
