-- Join table: LPA to person to notify. 0 to 5 persons per LPA.

CREATE TABLE lpa_person_to_notify (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    person_to_notify_id UUID NOT NULL
        REFERENCES person_to_notify(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL
        CHECK (order_position BETWEEN 1 AND 5),

    UNIQUE (lpa_id, order_position),
    UNIQUE (lpa_id, person_to_notify_id)
);

CREATE INDEX index_lpa_person_to_notify_lpa_id ON lpa_person_to_notify(lpa_id);
CREATE INDEX index_lpa_person_to_notify_person_to_notify_id ON lpa_person_to_notify(person_to_notify_id);

CREATE TRIGGER trigger_lpa_person_to_notify_updated_at
    BEFORE UPDATE ON lpa_person_to_notify
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_person_to_notify IS
    'Join table linking an LPA to the (up to 5) persons to notify on registration (R-MCA-NOTIFY-MAX).';
COMMENT ON COLUMN lpa_person_to_notify.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_person_to_notify.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_person_to_notify.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_person_to_notify.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_person_to_notify.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_person_to_notify.person_to_notify_id IS
    'Foreign key to the person to notify.';
COMMENT ON COLUMN lpa_person_to_notify.order_position IS
    'Order position 1-5 in which this person appears on the LP1H form.';
