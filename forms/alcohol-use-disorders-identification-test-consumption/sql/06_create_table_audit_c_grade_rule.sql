-- Audit trail of every grading rule that fired during AUDIT-C
-- computation. Each row records one rule firing with the item it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE audit_c_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    audit_c_grade_id UUID NOT NULL
        REFERENCES audit_c_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    item VARCHAR(20) NOT NULL
        CHECK (item IN ('frequency', 'quantity', 'binge-frequency', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX audit_c_grade_rule_grade_id_idx
    ON audit_c_grade_rule (audit_c_grade_id);

CREATE TRIGGER trigger_audit_c_grade_rule_updated_at
    BEFORE UPDATE ON audit_c_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE audit_c_grade_rule IS
    'Audit trail of every grading rule that fired during AUDIT-C computation: item, points contributed, category, and description.';
COMMENT ON COLUMN audit_c_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN audit_c_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN audit_c_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN audit_c_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN audit_c_grade_rule.audit_c_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN audit_c_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-FREQUENCY-3POINT-01).';
COMMENT ON COLUMN audit_c_grade_rule.item IS
    'Scored item the rule belongs to: frequency (Q1), quantity (Q2), binge-frequency (Q3), or band (total risk band).';
COMMENT ON COLUMN audit_c_grade_rule.points IS
    'Points (0-4) contributed by this rule for its item.';
COMMENT ON COLUMN audit_c_grade_rule.category IS
    'Subject category (e.g. item-score, band).';
COMMENT ON COLUMN audit_c_grade_rule.description IS
    'Human-readable description of why the rule fired.';
