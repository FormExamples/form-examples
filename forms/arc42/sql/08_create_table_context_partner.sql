-- Context partner — §3 Context & Scope.

CREATE TABLE context_partner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    ordinal SMALLINT NOT NULL DEFAULT 0,
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('business', 'technical', '')),
    name TEXT NOT NULL DEFAULT '',
    interface_description TEXT NOT NULL DEFAULT '',
    protocol TEXT NOT NULL DEFAULT '',
    direction TEXT NOT NULL DEFAULT '' CHECK (direction IN ('inbound', 'outbound', 'bidirectional', ''))
);

CREATE TRIGGER trigger_context_partner_updated_at
    BEFORE UPDATE ON context_partner
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE context_partner IS 'External context partner captured in §3 Context & Scope of the arc42 documentation.';
COMMENT ON COLUMN context_partner.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN context_partner.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN context_partner.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN context_partner.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN context_partner.arc42_documentation_id IS 'Parent documentation (cascade-deleted).';
COMMENT ON COLUMN context_partner.ordinal IS 'Display/order index within the parent documentation.';
COMMENT ON COLUMN context_partner.kind IS 'Kind of context partner: business (external business system) or technical (external technical interface).';
COMMENT ON COLUMN context_partner.name IS 'Name of the external system, service, or organisation.';
COMMENT ON COLUMN context_partner.interface_description IS 'Description of the interface between the architecture and this partner.';
COMMENT ON COLUMN context_partner.protocol IS 'Communication protocol used at this interface (e.g. REST, gRPC, SFTP).';
COMMENT ON COLUMN context_partner.direction IS 'Direction of data or control flow: inbound, outbound, or bidirectional.';

CREATE INDEX context_partner_index_gto
    ON context_partner
    USING GIN ((name) gin_trgm_ops);
