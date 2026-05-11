-- Business goal — §1 Introduction & Goals.

CREATE TABLE business_goal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    name TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_business_goal_updated_at
    BEFORE UPDATE ON business_goal
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE business_goal IS 'Business goal captured in §1 Introduction & Goals of the arc42 documentation.';
COMMENT ON COLUMN business_goal.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN business_goal.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN business_goal.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN business_goal.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN business_goal.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN business_goal.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN business_goal.name IS 'Short name or title of the business goal.';
COMMENT ON COLUMN business_goal.description IS 'Detailed description of the business goal.';

CREATE INDEX business_goal_index_gto
    ON business_goal
    USING GIN ((name) gin_trgm_ops);
