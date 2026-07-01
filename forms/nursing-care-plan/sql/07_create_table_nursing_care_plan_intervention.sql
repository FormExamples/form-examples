-- Planned nursing interventions for a problem. Each intervention is one row
-- and cascades from the parent problem (which in turn cascades from the care
-- plan).

CREATE TABLE nursing_care_plan_intervention (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    nursing_care_plan_problem_id UUID NOT NULL REFERENCES nursing_care_plan_problem(id) ON DELETE CASCADE,

    intervention_text TEXT NOT NULL DEFAULT '',
    carried_out VARCHAR(10) NOT NULL DEFAULT '' CHECK (carried_out IN ('yes', 'no', 'partial', ''))
);

CREATE INDEX nursing_care_plan_intervention_problem_id_idx
    ON nursing_care_plan_intervention (nursing_care_plan_problem_id);

CREATE TRIGGER trigger_nursing_care_plan_intervention_updated_at
    BEFORE UPDATE ON nursing_care_plan_intervention
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan_intervention IS
    'Planned nursing interventions for a problem; cascades from the parent problem.';
COMMENT ON COLUMN nursing_care_plan_intervention.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan_intervention.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN nursing_care_plan_intervention.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN nursing_care_plan_intervention.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN nursing_care_plan_intervention.nursing_care_plan_problem_id IS
    'Foreign key to the parent nursing problem.';
COMMENT ON COLUMN nursing_care_plan_intervention.intervention_text IS
    'The planned nursing action.';
COMMENT ON COLUMN nursing_care_plan_intervention.carried_out IS
    'Whether the intervention was carried out: yes, no, or partial.';
