-- Quality scenario — §10 Quality Requirements.

CREATE TABLE quality_scenario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT '',
    stimulus TEXT NOT NULL DEFAULT '',
    artifact TEXT NOT NULL DEFAULT '',
    response TEXT NOT NULL DEFAULT '',
    measure TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_quality_scenario_updated_at
    BEFORE UPDATE ON quality_scenario
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE quality_scenario IS 'Quality scenario captured in §10 Quality Requirements of the arc42 documentation.';
COMMENT ON COLUMN quality_scenario.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN quality_scenario.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN quality_scenario.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN quality_scenario.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN quality_scenario.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN quality_scenario.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN quality_scenario.source IS 'Source of the stimulus (e.g. end user, external system, time-based event).';
COMMENT ON COLUMN quality_scenario.stimulus IS 'The stimulus or event that triggers the scenario.';
COMMENT ON COLUMN quality_scenario.artifact IS 'The system artifact or component being stimulated.';
COMMENT ON COLUMN quality_scenario.response IS 'The expected response of the system to the stimulus.';
COMMENT ON COLUMN quality_scenario.measure IS 'Measurable criterion defining when the response is acceptable.';

CREATE INDEX quality_scenario_index_gto
    ON quality_scenario
    USING GIN ((stimulus) gin_trgm_ops);
