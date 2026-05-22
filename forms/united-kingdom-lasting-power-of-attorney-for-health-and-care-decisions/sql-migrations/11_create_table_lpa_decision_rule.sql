-- Attorney decision rule. LP1H s.3 forces a choice:
--   jointly                       — all attorneys must agree on every decision
--   jointly-and-severally         — any attorney can decide alone or together
--   mixed                         — joint for the listed decisions, severally for the rest
-- 1:1 with lpa.

CREATE TABLE lpa_decision_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE
        REFERENCES lpa(id) ON DELETE CASCADE,
    decision_rule VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (decision_rule IN (
            'jointly',
            'jointly-and-severally',
            'mixed',
            ''
        )),
    joint_decision_set TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_lpa_decision_rule_updated_at
    BEFORE UPDATE ON lpa_decision_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_decision_rule IS
    'How the attorneys must act together when making decisions (LP1H s.3, MCA 2005 s.10(4)).';
COMMENT ON COLUMN lpa_decision_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_decision_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_decision_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_decision_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_decision_rule.lpa_id IS
    'Foreign key to the parent LPA (unique, 1:1).';
COMMENT ON COLUMN lpa_decision_rule.decision_rule IS
    'Decision-making rule: jointly, jointly-and-severally, or mixed.';
COMMENT ON COLUMN lpa_decision_rule.joint_decision_set IS
    'When decision_rule = mixed: list of decisions that must be made jointly. Required when mixed (R-MCA-JOINT-MIXED-SCOPE).';
