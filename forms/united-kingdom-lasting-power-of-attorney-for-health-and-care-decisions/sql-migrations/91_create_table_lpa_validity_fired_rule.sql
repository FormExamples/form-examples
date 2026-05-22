-- Each statutory rule that fired during validity computation, with its
-- stable rule identifier, severity, source citation, and the human-readable
-- description that surfaced to the user.

CREATE TABLE lpa_validity_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_validity_id UUID NOT NULL
        REFERENCES lpa_validity(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL,
    severity VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (severity IN ('fatal', 'high', 'medium', 'informational', '')),
    rule_family VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (rule_family IN (
            'donor',
            'attorney',
            'certificate-provider',
            'signature-order',
            'instruction',
            'registration',
            ''
        )),
    source_citation VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    suggested_correction TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_lpa_validity_fired_rule_validity_id ON lpa_validity_fired_rule(lpa_validity_id);
CREATE INDEX index_lpa_validity_fired_rule_rule_id ON lpa_validity_fired_rule(rule_id);

CREATE TRIGGER trigger_lpa_validity_fired_rule_updated_at
    BEFORE UPDATE ON lpa_validity_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_validity_fired_rule IS
    'Audit trail of every statutory rule that fired during the most recent validity computation.';
COMMENT ON COLUMN lpa_validity_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validity_fired_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validity_fired_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validity_fired_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validity_fired_rule.lpa_validity_id IS
    'Foreign key to the parent validity result.';
COMMENT ON COLUMN lpa_validity_fired_rule.rule_id IS
    'Stable rule identifier (e.g. R-MCA-S9-AGE, R-MCA-CP-FAM, R-MCA-LST-CHOICE).';
COMMENT ON COLUMN lpa_validity_fired_rule.severity IS
    'Severity: fatal invalidates the LPA; high requires correction before registration; medium and informational do not block.';
COMMENT ON COLUMN lpa_validity_fired_rule.rule_family IS
    'Engine rule family the rule belongs to.';
COMMENT ON COLUMN lpa_validity_fired_rule.source_citation IS
    'Statute / regulation / OPG note that the rule encodes (e.g. "MCA 2005 s.9(2)(c)").';
COMMENT ON COLUMN lpa_validity_fired_rule.description IS
    'Human-readable description of why the rule fired.';
COMMENT ON COLUMN lpa_validity_fired_rule.suggested_correction IS
    'Hint to the user about how to fix the underlying field.';
