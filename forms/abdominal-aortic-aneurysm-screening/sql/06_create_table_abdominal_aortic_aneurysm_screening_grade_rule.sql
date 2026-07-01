-- Audit trail of every classification rule that fired during grading. Each row
-- records one rule firing with the pathway stage it concerns, the category, and
-- a human-readable description.

CREATE TABLE abdominal_aortic_aneurysm_screening_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    abdominal_aortic_aneurysm_screening_grade_id UUID NOT NULL
        REFERENCES abdominal_aortic_aneurysm_screening_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    stage VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (stage IN ('visualisation', 'classification', 'growth', 'completeness', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX abdominal_aortic_aneurysm_screening_grade_rule_grade_id_idx
    ON abdominal_aortic_aneurysm_screening_grade_rule (abdominal_aortic_aneurysm_screening_grade_id);

CREATE TRIGGER trigger_abdominal_aortic_aneurysm_screening_grade_rule_updated_at
    BEFORE UPDATE ON abdominal_aortic_aneurysm_screening_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE abdominal_aortic_aneurysm_screening_grade_rule IS
    'Audit trail of every classification rule that fired during grading: pathway stage, category, and description.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.abdominal_aortic_aneurysm_screening_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-CLASSIFICATION-LARGE-01).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.stage IS
    'Pathway stage the rule concerns: visualisation, classification, growth, or completeness.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.category IS
    'Subject category (e.g. guard, classification, growth, conditional-requirement).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening_grade_rule.description IS
    'Human-readable description of why the rule fired.';
