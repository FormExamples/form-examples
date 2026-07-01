-- Audit trail of every rule that fired during the Parkland-formula
-- computation. Each row records one rule firing with the instrument that
-- produced it, a subject category, and a human-readable description.

CREATE TABLE parkland_formula_for_burns_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    parkland_formula_for_burns_grade_id UUID NOT NULL
        REFERENCES parkland_formula_for_burns_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('volume', 'phase-split', 'rate', 'urine-output', 'composite')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX parkland_formula_for_burns_grade_rule_grade_id_idx
    ON parkland_formula_for_burns_grade_rule (parkland_formula_for_burns_grade_id);

CREATE TRIGGER trigger_parkland_formula_for_burns_grade_rule_updated_at
    BEFORE UPDATE ON parkland_formula_for_burns_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE parkland_formula_for_burns_grade_rule IS
    'Audit trail of every rule that fired during the Parkland-formula computation: instrument, category, and description.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.parkland_formula_for_burns_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-VOLUME-PARKLAND-01).';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.instrument IS
    'Instrument the rule belongs to: volume, phase-split, rate, urine-output, or composite.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.category IS
    'Subject category (e.g. base-formula, time-offset, overdue, missing-input).';
COMMENT ON COLUMN parkland_formula_for_burns_grade_rule.description IS
    'Human-readable description of why the rule fired.';
