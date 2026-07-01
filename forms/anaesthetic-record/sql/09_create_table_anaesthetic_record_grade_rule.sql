-- Audit trail of every mandatory-item rule evaluated during grading. Each row
-- records one rule with its criticality, whether it was satisfied, and a
-- human-readable description so the UI can show exactly what is missing.

CREATE TABLE anaesthetic_record_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_grade_id UUID NOT NULL
        REFERENCES anaesthetic_record_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '',
    criticality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (criticality IN ('critical', 'noncritical', '')),
    satisfied BOOLEAN NOT NULL DEFAULT FALSE,
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX anaesthetic_record_grade_rule_grade_id_idx
    ON anaesthetic_record_grade_rule (anaesthetic_record_grade_id);

CREATE TRIGGER trigger_anaesthetic_record_grade_rule_updated_at
    BEFORE UPDATE ON anaesthetic_record_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_grade_rule IS
    'Audit trail of every mandatory-item rule evaluated during grading: criticality, satisfied state, and description.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.anaesthetic_record_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ASA-STATUS-01).';
COMMENT ON COLUMN anaesthetic_record_grade_rule.category IS
    'Subject category (e.g. identification, airway, monitoring, sign-off).';
COMMENT ON COLUMN anaesthetic_record_grade_rule.criticality IS
    'Rule criticality: critical (missing implies incomplete) or noncritical (missing implies partial).';
COMMENT ON COLUMN anaesthetic_record_grade_rule.satisfied IS
    'Whether the mandatory item was present and valid.';
COMMENT ON COLUMN anaesthetic_record_grade_rule.description IS
    'Human-readable label describing the mandatory item.';
