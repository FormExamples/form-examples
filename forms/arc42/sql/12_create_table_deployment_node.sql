-- Deployment node — §7 Deployment View.

CREATE TABLE deployment_node (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    environment TEXT NOT NULL DEFAULT '' CHECK (environment IN ('development', 'staging', 'production', 'disaster-recovery', 'other', '')),
    node_name TEXT NOT NULL DEFAULT '',
    responsibility TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_deployment_node_updated_at
    BEFORE UPDATE ON deployment_node
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE deployment_node IS 'Deployment node captured in §7 Deployment View of the arc42 documentation.';
COMMENT ON COLUMN deployment_node.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN deployment_node.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN deployment_node.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN deployment_node.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN deployment_node.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN deployment_node.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN deployment_node.environment IS 'Target environment for this deployment node: development, staging, production, disaster-recovery, or other.';
COMMENT ON COLUMN deployment_node.node_name IS 'Name of the deployment node (e.g. server hostname, Kubernetes cluster, cloud region).';
COMMENT ON COLUMN deployment_node.responsibility IS 'What this deployment node is responsible for hosting or executing.';

CREATE INDEX deployment_node_index_gto
    ON deployment_node
    USING GIN ((node_name) gin_trgm_ops);
