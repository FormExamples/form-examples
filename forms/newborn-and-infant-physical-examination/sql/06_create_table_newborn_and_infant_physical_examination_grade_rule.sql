-- Audit trail of every classification rule that fired during grading. Each
-- row records one rule firing with the key component it concerns, the
-- category, and a human-readable description.

CREATE TABLE newborn_and_infant_physical_examination_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    newborn_and_infant_physical_examination_grade_id UUID NOT NULL
        REFERENCES newborn_and_infant_physical_examination_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (component IN ('eyes', 'heart', 'hips', 'testes', 'overall', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX newborn_and_infant_physical_examination_grade_rule_grade_id_idx
    ON newborn_and_infant_physical_examination_grade_rule (newborn_and_infant_physical_examination_grade_id);

CREATE TRIGGER trigger_newborn_and_infant_physical_examination_grade_rule_updated_at
    BEFORE UPDATE ON newborn_and_infant_physical_examination_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_and_infant_physical_examination_grade_rule IS
    'Audit trail of every classification rule that fired during grading: the key component, category, and description.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.newborn_and_infant_physical_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-HIPS-REFER-01).';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.component IS
    'Key component the rule concerns: eyes, heart, hips, testes, or overall.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.category IS
    'Subject category (e.g. component-result, outcome-rollup).';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_rule.description IS
    'Human-readable description of why the rule fired.';
