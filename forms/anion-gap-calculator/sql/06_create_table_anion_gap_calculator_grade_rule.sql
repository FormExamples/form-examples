-- Audit trail of every rule that fired during anion-gap computation. Each row
-- records one rule firing with the instrument that produced it, the
-- classification band it contributed, and a human-readable description.

CREATE TABLE anion_gap_calculator_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anion_gap_calculator_grade_id UUID NOT NULL
        REFERENCES anion_gap_calculator_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('formula', 'correction', 'classification', 'composite')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('normal', 'high', 'very-high', 'low', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX anion_gap_calculator_grade_rule_grade_id_idx
    ON anion_gap_calculator_grade_rule (anion_gap_calculator_grade_id);

CREATE TRIGGER trigger_anion_gap_calculator_grade_rule_updated_at
    BEFORE UPDATE ON anion_gap_calculator_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anion_gap_calculator_grade_rule IS
    'Audit trail of every rule that fired during anion-gap computation: instrument, band, category, and description.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.anion_gap_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CLASSIFY-HIGH-01).';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.instrument IS
    'Instrument the rule belongs to: formula, correction, classification, or composite.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.band IS
    'Classification band contributed by this rule: normal, high, very-high, or low.';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.category IS
    'Subject category (e.g. reference-range, albumin-correction, missing-input).';
COMMENT ON COLUMN anion_gap_calculator_grade_rule.description IS
    'Human-readable description of why the rule fired.';
