-- Audit trail of every classification rule that fired during PERC computation.
-- Each row records one criterion evaluation, the applicability gate, or the
-- composite classification, with the instrument that produced it, whether it was
-- satisfied, the outcome it informed, and a human-readable description.

CREATE TABLE pulmonary_embolism_rule_out_criteria_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    pulmonary_embolism_rule_out_criteria_grade_id UUID NOT NULL
        REFERENCES pulmonary_embolism_rule_out_criteria_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('criterion', 'gate', 'composite', '')),
    satisfied VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (satisfied IN ('yes', 'no', '')),
    outcome VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (outcome IN ('satisfied', 'failed', 'applicable', 'not-applicable', 'perc-negative', 'perc-positive', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX pulmonary_embolism_rule_out_criteria_grade_rule_grade_id_idx
    ON pulmonary_embolism_rule_out_criteria_grade_rule (pulmonary_embolism_rule_out_criteria_grade_id);

CREATE TRIGGER trigger_pulmonary_embolism_rule_out_criteria_grade_rule_updated_at
    BEFORE UPDATE ON pulmonary_embolism_rule_out_criteria_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_embolism_rule_out_criteria_grade_rule IS
    'Audit trail of every classification rule that fired during PERC computation: instrument, satisfied flag, outcome, category, and description.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.pulmonary_embolism_rule_out_criteria_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-AGE-UNDER-50-01).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.instrument IS
    'Classification instrument the rule belongs to: criterion, gate (applicability), or composite (overall classification).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.satisfied IS
    'Whether the criterion was satisfied (yes) or failed (no); blank for non-criterion instruments.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.outcome IS
    'Outcome informed by this rule: satisfied, failed, applicable, not-applicable, perc-negative, or perc-positive.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.category IS
    'Subject category (e.g. age, heart-rate, oxygenation, clinical-sign, history, applicability).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_rule.description IS
    'Human-readable description of why the rule fired.';
