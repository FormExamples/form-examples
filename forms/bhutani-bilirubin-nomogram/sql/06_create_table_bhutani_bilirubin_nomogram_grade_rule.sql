-- Audit trail of every classification rule that fired during Bhutani
-- bilirubin nomogram computation. Each row records one rule firing (a zone
-- lookup or a threshold comparison) with its category and a human-readable
-- description.

CREATE TABLE bhutani_bilirubin_nomogram_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    bhutani_bilirubin_nomogram_grade_id UUID NOT NULL
        REFERENCES bhutani_bilirubin_nomogram_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX bhutani_bilirubin_nomogram_grade_rule_grade_id_idx
    ON bhutani_bilirubin_nomogram_grade_rule (bhutani_bilirubin_nomogram_grade_id);

CREATE TRIGGER trigger_bhutani_bilirubin_nomogram_grade_rule_updated_at
    BEFORE UPDATE ON bhutani_bilirubin_nomogram_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bhutani_bilirubin_nomogram_grade_rule IS
    'Audit trail of every classification rule that fired during Bhutani bilirubin nomogram computation: rule identifier, category, and description.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.bhutani_bilirubin_nomogram_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ZONE-HIGH-INTERMEDIATE-01).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.category IS
    'Rule category (e.g. zone-lookup, phototherapy-threshold, exchange-threshold).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade_rule.description IS
    'Human-readable description of why the rule fired.';
