-- Computed execution-readiness classification for a durable financial power of
-- attorney: ready-to-execute, incomplete, or execution-risk, plus the governing
-- state rule applied. Not legal advice.

CREATE TABLE united_states_durable_financial_power_of_attorney_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_durable_financial_power_of_attorney_id UUID NOT NULL UNIQUE
        REFERENCES united_states_durable_financial_power_of_attorney(id) ON DELETE CASCADE,
    validity_class VARCHAR(20) NOT NULL DEFAULT '' CHECK (validity_class IN ('ready-to-execute', 'incomplete', 'execution-risk', '')),
    governing_state TEXT NOT NULL DEFAULT '',
    execution_risk_indicated VARCHAR(5) NOT NULL DEFAULT '' CHECK (execution_risk_indicated IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_dpoa_grade_updated_at
    BEFORE UPDATE ON united_states_durable_financial_power_of_attorney_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_durable_financial_power_of_attorney_grade IS
    'Computed execution-readiness classification: validity class, governing state rule applied, and whether an execution risk is indicated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.united_states_durable_financial_power_of_attorney_id IS
    'Foreign key to the parent instrument (unique, 1:1).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.validity_class IS
    'Validity classification: ready-to-execute, incomplete, or execution-risk (execution-risk takes precedence).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.governing_state IS
    'Name of the state rule applied, or Uniform default (verify) for an unknown state.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.execution_risk_indicated IS
    'Whether an execution risk is indicated (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
