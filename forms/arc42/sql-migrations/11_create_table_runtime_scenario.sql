-- Runtime scenario — §6 Runtime View.

CREATE TABLE runtime_scenario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    trigger_description TEXT NOT NULL DEFAULT '',
    steps_summary TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_runtime_scenario_updated_at
    BEFORE UPDATE ON runtime_scenario
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE runtime_scenario IS 'Runtime scenario captured in §6 Runtime View of the arc42 documentation.';
COMMENT ON COLUMN runtime_scenario.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN runtime_scenario.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN runtime_scenario.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN runtime_scenario.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN runtime_scenario.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN runtime_scenario.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN runtime_scenario.name IS 'Name of the runtime scenario (e.g. user login flow, batch job).';
COMMENT ON COLUMN runtime_scenario.trigger_description IS 'What event or condition triggers this runtime scenario.';
COMMENT ON COLUMN runtime_scenario.steps_summary IS 'Ordered prose summary of the steps or interactions in this scenario.';

CREATE INDEX runtime_scenario_index_gto
    ON runtime_scenario
    USING GIN ((name) gin_trgm_ops);
