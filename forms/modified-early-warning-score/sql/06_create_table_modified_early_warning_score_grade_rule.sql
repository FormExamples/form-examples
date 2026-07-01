-- Audit trail of every grading rule that fired during MEWS computation.
-- Each row records one rule firing with the parameter instrument that
-- produced it, the sub-score or band it contributed, and a
-- human-readable description.

CREATE TABLE modified_early_warning_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    modified_early_warning_score_grade_id UUID NOT NULL
        REFERENCES modified_early_warning_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('systolic-blood-pressure', 'heart-rate', 'respiratory-rate', 'temperature', 'avpu', 'aggregate', 'single-parameter')),
    band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (band IN ('low', 'medium', 'high', '')),
    points INTEGER,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX modified_early_warning_score_grade_rule_grade_id_idx
    ON modified_early_warning_score_grade_rule (modified_early_warning_score_grade_id);

CREATE TRIGGER trigger_modified_early_warning_score_grade_rule_updated_at
    BEFORE UPDATE ON modified_early_warning_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE modified_early_warning_score_grade_rule IS
    'Audit trail of every grading rule that fired during MEWS computation: instrument, band, points contributed, category, and description.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.modified_early_warning_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SBP-3-LOW-01).';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: systolic-blood-pressure, heart-rate, respiratory-rate, temperature, avpu, aggregate, or single-parameter.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.band IS
    'Clinical-risk band contributed by this rule: low, medium, or high.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.points IS
    'Sub-score points contributed by this rule (0-3); NULL for non-scoring rules.';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.category IS
    'Subject category (e.g. hypotension, tachycardia, tachypnoea, hypothermia).';
COMMENT ON COLUMN modified_early_warning_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
