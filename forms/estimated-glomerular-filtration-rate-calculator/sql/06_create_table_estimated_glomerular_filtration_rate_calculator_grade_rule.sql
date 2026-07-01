-- Audit trail of every rule that fired during eGFR computation. Each row
-- records one rule firing with the instrument that produced it, the CKD
-- G-stage band it contributed, and a human-readable description.

CREATE TABLE estimated_glomerular_filtration_rate_calculator_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    estimated_glomerular_filtration_rate_calculator_grade_id UUID NOT NULL
        REFERENCES estimated_glomerular_filtration_rate_calculator_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('conversion', 'equation', 'banding', 'composite')),
    band VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (band IN ('G1', 'G2', 'G3a', 'G3b', 'G4', 'G5', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX estimated_glomerular_filtration_rate_calculator_grade_rule_grade_id_idx
    ON estimated_glomerular_filtration_rate_calculator_grade_rule (estimated_glomerular_filtration_rate_calculator_grade_id);

CREATE TRIGGER trigger_estimated_glomerular_filtration_rate_calculator_grade_rule_updated_at
    BEFORE UPDATE ON estimated_glomerular_filtration_rate_calculator_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE estimated_glomerular_filtration_rate_calculator_grade_rule IS
    'Audit trail of every rule that fired during eGFR computation: instrument, CKD G-stage band, category, and description.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.estimated_glomerular_filtration_rate_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BAND-G3A-01).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.instrument IS
    'Instrument the rule belongs to: conversion, equation, banding, or composite.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.band IS
    'CKD G-stage band contributed by this rule: G1, G2, G3a, G3b, G4, or G5.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.category IS
    'Subject category (e.g. unit-conversion, equation-term, stage-threshold, missing-input).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_rule.description IS
    'Human-readable description of why the rule fired.';
