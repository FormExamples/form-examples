-- Audit trail of every grading rule that fired during NEWS2
-- computation. Each row records one rule firing with the parameter
-- instrument that produced it, the subscore or band it contributed, and
-- a human-readable description.

CREATE TABLE national_early_warning_score_2_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    national_early_warning_score_2_grade_id UUID NOT NULL
        REFERENCES national_early_warning_score_2_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('respiratory-rate', 'spo2', 'oxygen', 'blood-pressure', 'pulse', 'consciousness', 'temperature', 'aggregate', 'red-score')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('low', 'low-medium', 'medium', 'high', '')),
    points INTEGER,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX national_early_warning_score_2_grade_rule_grade_id_idx
    ON national_early_warning_score_2_grade_rule (national_early_warning_score_2_grade_id);

CREATE TRIGGER trigger_national_early_warning_score_2_grade_rule_updated_at
    BEFORE UPDATE ON national_early_warning_score_2_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE national_early_warning_score_2_grade_rule IS
    'Audit trail of every grading rule that fired during NEWS2 computation: instrument, band, points contributed, category, and description.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.national_early_warning_score_2_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-RESP-RATE-3-HIGH-01).';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: respiratory-rate, spo2, oxygen, blood-pressure, pulse, consciousness, temperature, aggregate, or red-score.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.band IS
    'Clinical-risk band contributed by this rule: low, low-medium, medium, or high.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.points IS
    'Subscore points contributed by this rule (0-3); NULL for non-scoring rules.';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.category IS
    'Subject category (e.g. tachypnoea, hypoxia, hypotension, new-confusion).';
COMMENT ON COLUMN national_early_warning_score_2_grade_rule.description IS
    'Human-readable description of why the rule fired.';
