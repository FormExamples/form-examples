-- Audit trail of every rule that fired during corrected-calcium computation.
-- Each row records one rule firing with the instrument that produced it, the
-- classification band it contributed, and a human-readable description.

CREATE TABLE corrected_calcium_calculator_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    corrected_calcium_calculator_grade_id UUID NOT NULL
        REFERENCES corrected_calcium_calculator_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('correction', 'classification', 'severity', 'composite')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('hypocalcaemia', 'normal', 'hypercalcaemia', 'unknown', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX corrected_calcium_calculator_grade_rule_grade_id_idx
    ON corrected_calcium_calculator_grade_rule (corrected_calcium_calculator_grade_id);

CREATE TRIGGER trigger_corrected_calcium_calculator_grade_rule_updated_at
    BEFORE UPDATE ON corrected_calcium_calculator_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE corrected_calcium_calculator_grade_rule IS
    'Audit trail of every rule that fired during corrected-calcium computation: instrument, band, category, and description.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.corrected_calcium_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CLASSIFY-HYPERCALCAEMIA-01).';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.instrument IS
    'Instrument the rule belongs to: correction, classification, severity, or composite.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.band IS
    'Classification band contributed by this rule: hypocalcaemia, normal, hypercalcaemia, or unknown.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.category IS
    'Subject category (e.g. reference-range, severity-threshold, missing-input).';
COMMENT ON COLUMN corrected_calcium_calculator_grade_rule.description IS
    'Human-readable description of why the rule fired.';
