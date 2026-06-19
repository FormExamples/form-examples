--liquibase formatted sql

--changeset author:1
-- LPA validation rule — one row per statutory blocker rule that fired
-- while validating an LPA. Each rule cites its source under the
-- Mental Capacity Act 2005 or the LPA Regulations 2007.

CREATE TABLE lpa_validation_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT '' CHECK (priority IN ('low', 'moderate', 'high', 'critical')),
    statutory_citation TEXT NOT NULL DEFAULT '',
    remediation_hint TEXT NOT NULL DEFAULT '',
    fired_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (lpa_id, rule_name)
);
--rollback DROP TABLE lpa_validation_rule;

--changeset author:2
CREATE TRIGGER trigger_lpa_validation_rule_updated_at
    BEFORE UPDATE ON lpa_validation_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_validation_rule_updated_at ON lpa_validation_rule;

--changeset author:3
COMMENT ON TABLE lpa_validation_rule IS
    'LPA validation rule — statutory blocker rules that fired during validation (e.g. DonorUnderEighteen, NoAttorneyAppointed).';
COMMENT ON COLUMN lpa_validation_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validation_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validation_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validation_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validation_rule.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_validation_rule.rule_name IS
    'Programmatic name of the fired rule (e.g. DonorUnderEighteen, AttorneyBankruptOrDRO).';
COMMENT ON COLUMN lpa_validation_rule.priority IS
    'Severity priority of the rule. One of: low, moderate, high, critical (statutory blockers are always critical).';
COMMENT ON COLUMN lpa_validation_rule.statutory_citation IS
    'Statutory citation for the rule (e.g. "MCA 2005 s. 9(2)(a)" for DonorUnderEighteen).';
COMMENT ON COLUMN lpa_validation_rule.remediation_hint IS
    'User-facing hint explaining how to fix the LPA so this rule no longer fires.';
COMMENT ON COLUMN lpa_validation_rule.fired_at IS
    'Timestamp when this rule fired during validation.';
--rollback SELECT 1;
