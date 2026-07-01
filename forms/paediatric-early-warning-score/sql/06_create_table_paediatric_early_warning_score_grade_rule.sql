-- Audit trail of every grading rule that fired during PEWS computation.
-- Each row records one rule firing with the parameter instrument that produced
-- it, the sub-score or band it contributed, and a human-readable description.

CREATE TABLE paediatric_early_warning_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    paediatric_early_warning_score_grade_id UUID NOT NULL
        REFERENCES paediatric_early_warning_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('respiratory-rate', 'respiratory-effort', 'oxygen-saturation', 'supplemental-oxygen', 'heart-rate', 'capillary-refill', 'consciousness', 'aggregate', 'single-parameter', 'concern')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('routine', 'low', 'medium', 'high', '')),
    points INTEGER,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX paediatric_early_warning_score_grade_rule_grade_id_idx
    ON paediatric_early_warning_score_grade_rule (paediatric_early_warning_score_grade_id);

CREATE TRIGGER trigger_paediatric_early_warning_score_grade_rule_updated_at
    BEFORE UPDATE ON paediatric_early_warning_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE paediatric_early_warning_score_grade_rule IS
    'Audit trail of every grading rule that fired during PEWS computation: instrument, band, points contributed, category, and description.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.paediatric_early_warning_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-RESP-RATE-3-HIGH-01).';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: respiratory-rate, respiratory-effort, oxygen-saturation, supplemental-oxygen, heart-rate, capillary-refill, consciousness, aggregate, single-parameter, or concern.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.band IS
    'Escalation band contributed by this rule: routine, low, medium, or high.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.points IS
    'Sub-score points contributed by this rule (0-3); NULL for non-scoring rules.';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.category IS
    'Subject category (e.g. tachypnoea, recession, hypoxia, prolonged-refill, reduced-consciousness).';
COMMENT ON COLUMN paediatric_early_warning_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
