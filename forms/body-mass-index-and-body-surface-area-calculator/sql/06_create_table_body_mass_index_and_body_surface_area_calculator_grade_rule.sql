-- Audit trail of every rule that fired during anthropometry computation.
-- Each row records one rule firing with the instrument that produced it, the
-- BMI category band it contributed, and a human-readable description.

CREATE TABLE body_mass_index_and_body_surface_area_calculator_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    body_mass_index_and_body_surface_area_calculator_grade_id UUID NOT NULL
        REFERENCES body_mass_index_and_body_surface_area_calculator_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('bmi', 'bsa', 'classification', 'threshold', 'composite')),
    band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (band IN ('underweight', 'normal', 'overweight', 'obese-class-1', 'obese-class-2', 'obese-class-3', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX body_mass_index_and_body_surface_area_calculator_grade_rule_grade_id_idx
    ON body_mass_index_and_body_surface_area_calculator_grade_rule (body_mass_index_and_body_surface_area_calculator_grade_id);

CREATE TRIGGER trigger_body_mass_index_and_body_surface_area_calculator_grade_rule_updated_at
    BEFORE UPDATE ON body_mass_index_and_body_surface_area_calculator_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE body_mass_index_and_body_surface_area_calculator_grade_rule IS
    'Audit trail of every rule that fired during anthropometry computation: instrument, band, category, and description.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.body_mass_index_and_body_surface_area_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BMI-BAND-OVERWEIGHT-01).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.instrument IS
    'Instrument the rule belongs to: bmi, bsa, classification, threshold, or composite.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.band IS
    'BMI category band contributed by this rule: underweight, normal, overweight, obese-class-1, obese-class-2, or obese-class-3.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.category IS
    'Subject category (e.g. who-band, asian-threshold, plausibility, missing-input).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_rule.description IS
    'Human-readable description of why the rule fired.';
