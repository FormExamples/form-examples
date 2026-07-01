-- Audit trail of every calculation rule that fired during MELD
-- computation. Each row records one rule firing with the formula
-- component it belongs to, the numeric contribution it made, and a
-- human-readable description.

CREATE TABLE model_for_end_stage_liver_disease_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    model_for_end_stage_liver_disease_score_grade_id UUID NOT NULL
        REFERENCES model_for_end_stage_liver_disease_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(20) NOT NULL
        CHECK (component IN ('bilirubin', 'inr', 'creatinine', 'sodium', 'albumin', 'dialysis', 'variant', 'band', 'other')),
    contribution NUMERIC(10,4),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX model_for_end_stage_liver_disease_score_grade_rule_grade_id_idx
    ON model_for_end_stage_liver_disease_score_grade_rule (model_for_end_stage_liver_disease_score_grade_id);

CREATE TRIGGER trigger_model_for_end_stage_liver_disease_score_grade_rule_updated_at
    BEFORE UPDATE ON model_for_end_stage_liver_disease_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE model_for_end_stage_liver_disease_score_grade_rule IS
    'Audit trail of every calculation rule that fired during MELD computation: formula component, numeric contribution, category, and description.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.model_for_end_stage_liver_disease_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CREATININE-DIALYSIS-01).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.component IS
    'Formula component the rule belongs to: bilirubin, inr, creatinine, sodium, albumin, dialysis, variant, band, or other.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.contribution IS
    'Numeric contribution this rule made to the score (e.g. a weighted-log term or an applied bound/clamp value).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.category IS
    'Subject category (e.g. unit-conversion, dialysis-rule, bound, sodium-correction, band-map).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
