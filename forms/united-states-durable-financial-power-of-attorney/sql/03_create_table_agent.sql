-- The agent (attorney-in-fact): the person or institution the principal
-- authorizes to act on the principal's behalf.

CREATE TABLE agent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    relationship VARCHAR(25) NOT NULL DEFAULT '' CHECK (relationship IN ('spouse', 'child', 'other-family', 'friend', 'professional', 'financial-institution', ''))
);

CREATE TRIGGER trigger_agent_updated_at
    BEFORE UPDATE ON agent
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agent IS
    'The agent (attorney-in-fact) named in a durable financial power of attorney.';
COMMENT ON COLUMN agent.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agent.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN agent.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agent.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agent.name IS
    'Full name of the agent.';
COMMENT ON COLUMN agent.email IS
    'Email address.';
COMMENT ON COLUMN agent.phone IS
    'Phone number.';
COMMENT ON COLUMN agent.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN agent.relationship IS
    'Relationship to the principal: spouse, child, other-family, friend, professional, or financial-institution.';
