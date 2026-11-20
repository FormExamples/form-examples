-- Flagged issues raised independently of the class, with a priority and a
-- suggested action for the principal, drafter, or notary.

CREATE TABLE united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_durable_financial_power_of_attorney_grade_id UUID NOT NULL
        REFERENCES united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(25) NOT NULL DEFAULT '' CHECK (category IN ('execution-formality', 'effectiveness', 'authority-scope', 'agent', 'gifting', 'acceptance', 'tax-representation', 'jurisdiction', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX dpoa_grade_flag_grade_id_idx
    ON united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag (united_states_durable_financial_power_of_attorney_grade_id);

CREATE TRIGGER trigger_dpoa_grade_flag_updated_at
    BEFORE UPDATE ON united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION united_states_durable_financial_power_of_attorney.set_updated_at();

COMMENT ON TABLE united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag IS
    'Flagged issues raised independently of the validity class, with priority and a suggested action.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.united_states_durable_financial_power_of_attorney_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-NOTARIZATION-REQUIRED-001).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.category IS
    'Flag category: execution-formality, effectiveness, authority-scope, agent, gifting, acceptance, tax-representation, jurisdiction, other.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.united_states_durable_financial_power_of_attorney_grade_flag.suggested_action IS
    'Suggested action, for example have the signature acknowledged before a notary.';
