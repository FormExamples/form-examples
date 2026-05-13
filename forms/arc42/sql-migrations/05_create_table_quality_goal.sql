-- Quality goal — §1 Introduction & Goals.

CREATE TABLE quality_goal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL DEFAULT '' CHECK (priority IN ('high', 'medium', 'low', '')),
    scenario TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_quality_goal_updated_at
    BEFORE UPDATE ON quality_goal
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE quality_goal IS 'Quality goal captured in §1 Introduction & Goals of the arc42 documentation.';
COMMENT ON COLUMN quality_goal.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN quality_goal.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN quality_goal.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN quality_goal.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN quality_goal.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN quality_goal.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN quality_goal.name IS 'Short name or title of the quality goal (e.g. Performance, Security).';
COMMENT ON COLUMN quality_goal.priority IS 'Priority of this quality goal: high, medium, or low.';
COMMENT ON COLUMN quality_goal.scenario IS 'Concrete scenario illustrating when and how this quality goal applies.';

CREATE INDEX quality_goal_index_gto
    ON quality_goal
    USING GIN ((name) gin_trgm_ops);
