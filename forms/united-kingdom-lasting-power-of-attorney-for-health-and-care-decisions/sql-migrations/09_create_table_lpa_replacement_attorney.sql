-- Join table: LPA to replacement attorney. 0 to 4 replacement attorneys per LPA.

CREATE TABLE lpa_replacement_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    replacement_attorney_id UUID NOT NULL
        REFERENCES replacement_attorney(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL
        CHECK (order_position BETWEEN 1 AND 4),
    replacement_trigger TEXT NOT NULL DEFAULT '',

    UNIQUE (lpa_id, order_position),
    UNIQUE (lpa_id, replacement_attorney_id)
);

CREATE INDEX index_lpa_replacement_attorney_lpa_id ON lpa_replacement_attorney(lpa_id);
CREATE INDEX index_lpa_replacement_attorney_replacement_attorney_id ON lpa_replacement_attorney(replacement_attorney_id);

CREATE TRIGGER trigger_lpa_replacement_attorney_updated_at
    BEFORE UPDATE ON lpa_replacement_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_replacement_attorney IS
    'Join table linking an LPA to its replacement attorneys.';
COMMENT ON COLUMN lpa_replacement_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_replacement_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_replacement_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_replacement_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_replacement_attorney.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_replacement_attorney.replacement_attorney_id IS
    'Foreign key to the replacement attorney.';
COMMENT ON COLUMN lpa_replacement_attorney.order_position IS
    'Order position 1-4 in which this replacement appears on the LP1H form.';
COMMENT ON COLUMN lpa_replacement_attorney.replacement_trigger IS
    'Free-text description of the conditions under which this replacement steps in. OPG accepts free text but unusual triggers raise R-MCA-INSTR-LAW.';
