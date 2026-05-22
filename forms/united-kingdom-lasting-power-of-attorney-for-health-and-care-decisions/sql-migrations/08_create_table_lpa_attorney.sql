-- Join table: LPA to attorney. 1 to 4 attorneys per LPA.

CREATE TABLE lpa_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL
        REFERENCES attorney(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL
        CHECK (order_position BETWEEN 1 AND 4),

    UNIQUE (lpa_id, order_position),
    UNIQUE (lpa_id, attorney_id)
);

CREATE INDEX index_lpa_attorney_lpa_id ON lpa_attorney(lpa_id);
CREATE INDEX index_lpa_attorney_attorney_id ON lpa_attorney(attorney_id);

CREATE TRIGGER trigger_lpa_attorney_updated_at
    BEFORE UPDATE ON lpa_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_attorney IS
    'Join table linking an LPA to its 1-4 named attorneys, with their order on the form.';
COMMENT ON COLUMN lpa_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_attorney.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_attorney.attorney_id IS
    'Foreign key to the attorney.';
COMMENT ON COLUMN lpa_attorney.order_position IS
    'Order position 1-4 in which this attorney appears on the LP1H form.';
