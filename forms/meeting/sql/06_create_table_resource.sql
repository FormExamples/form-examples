-- Resource — anything required for the meeting to succeed: a room, a piece
-- of equipment, a document, a URL, a budget line, catering, an interpreter.

CREATE TABLE resource (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),
    resource_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (resource_type IN (
            'room', 'equipment', 'document', 'link', 'budget',
            'catering', 'interpreter', 'transport', 'other', ''
        )),
    name VARCHAR(255) NOT NULL DEFAULT '',
    quantity INTEGER
        CHECK (quantity IS NULL OR quantity >= 0),
    unit VARCHAR(40) NOT NULL DEFAULT '',
    url VARCHAR(500) NOT NULL DEFAULT '',
    cost_amount NUMERIC(12, 2)
        CHECK (cost_amount IS NULL OR cost_amount >= 0),
    cost_currency VARCHAR(3) NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (status IN ('requested', 'reserved', 'confirmed', 'unavailable', 'cancelled', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_resource_updated_at
    BEFORE UPDATE ON resource
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE resource IS
    'A resource required for the meeting: room, equipment, document, link, budget line, catering, interpreter, transport. Tracks quantity, cost, reservation status.';
COMMENT ON COLUMN resource.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN resource.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN resource.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN resource.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN resource.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN resource.position IS
    'Zero-based ordinal of the resource in the list.';
COMMENT ON COLUMN resource.resource_type IS
    'Type of resource: room, equipment, document, link, budget, catering, interpreter, transport, other.';
COMMENT ON COLUMN resource.name IS
    'Name or short identifier of the resource.';
COMMENT ON COLUMN resource.quantity IS
    'Quantity required (e.g. 12 chairs, 1 projector).';
COMMENT ON COLUMN resource.unit IS
    'Unit of quantity (e.g. seats, licences, GBP, USD).';
COMMENT ON COLUMN resource.url IS
    'URL of the resource (document link, room booking page, equipment record).';
COMMENT ON COLUMN resource.cost_amount IS
    'Cost amount in the cost_currency.';
COMMENT ON COLUMN resource.cost_currency IS
    'ISO 4217 currency code (e.g. GBP, USD, EUR).';
COMMENT ON COLUMN resource.status IS
    'Reservation status: requested, reserved, confirmed, unavailable, cancelled.';
COMMENT ON COLUMN resource.notes IS
    'Free-text notes — e.g. supplier, vendor, point of contact.';

CREATE INDEX resource_index_meeting_id
    ON resource(meeting_id);
CREATE INDEX resource_index_meeting_id_position
    ON resource(meeting_id, position);
