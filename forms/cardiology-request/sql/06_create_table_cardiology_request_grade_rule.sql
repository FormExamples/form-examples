-- Audit trail of every scoring rule that fired for a cardiology referral request.

CREATE TABLE cardiology_request_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cardiology_request_grade_id UUID NOT NULL
        REFERENCES cardiology_request_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (axis IN ('appropriateness', 'safety', 'completeness', 'triage', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiology_request_grade_rule_grade_id
    ON cardiology_request_grade_rule(cardiology_request_grade_id);

CREATE TRIGGER trigger_cardiology_request_grade_rule_updated_at
    BEFORE UPDATE ON cardiology_request_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_request_grade_rule IS
    'Audit trail of every appropriateness / safety / completeness / triage rule that fired for this referral.';
COMMENT ON COLUMN cardiology_request_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_request_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cardiology_request_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_request_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_request_grade_rule.cardiology_request_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN cardiology_request_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-APPROP-CHEST-PAIN-01).';
COMMENT ON COLUMN cardiology_request_grade_rule.axis IS
    'Scoring axis the rule belongs to: appropriateness, safety, completeness, triage.';
COMMENT ON COLUMN cardiology_request_grade_rule.category IS
    'Category or reason the rule relates to.';
COMMENT ON COLUMN cardiology_request_grade_rule.description IS
    'Human-readable description of why the rule fired.';
