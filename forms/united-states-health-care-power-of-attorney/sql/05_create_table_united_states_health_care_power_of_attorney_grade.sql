-- Computed readiness classification for a health care power of attorney. The
-- engine classifies the directive as ready-to-execute, incomplete, or
-- execution-risk. This is a completeness and formalities classification, not
-- legal advice, and it does not decide whether a directive is valid.

CREATE TABLE united_states_health_care_power_of_attorney_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    united_states_health_care_power_of_attorney_id UUID NOT NULL UNIQUE
        REFERENCES united_states_health_care_power_of_attorney(id) ON DELETE CASCADE,
    readiness_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (readiness_class IN ('ready-to-execute', 'incomplete', 'execution-risk', '')),
    rule_set_name VARCHAR(50) NOT NULL DEFAULT '',
    missing_count INTEGER NOT NULL DEFAULT 0 CHECK (missing_count >= 0),
    execution_risk VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (execution_risk IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_states_health_care_power_of_attorney_grade_updated_at
    BEFORE UPDATE ON united_states_health_care_power_of_attorney_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_health_care_power_of_attorney_grade IS
    'Computed readiness classification for a health care power of attorney: ready-to-execute, incomplete, or execution-risk, plus the state rule set applied.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.united_states_health_care_power_of_attorney_id IS
    'Foreign key to the parent directive (unique, 1:1).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.readiness_class IS
    'Readiness classification: ready-to-execute, incomplete, or execution-risk (execution-risk takes precedence).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.rule_set_name IS
    'Name of the state rule set applied (a state name or Uniform default).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.missing_count IS
    'Number of required items that are blank.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.execution_risk IS
    'Whether an execution defect could invalidate the directive (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
