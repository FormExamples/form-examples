-- Join table: LPA to attorney. 1 to 4 attorneys per LPA.

CREATE TABLE united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa(id) ON DELETE CASCADE,
    attorney_id UUID NOT NULL
        REFERENCES united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.attorney(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL
        CHECK (order_position BETWEEN 1 AND 4),

    UNIQUE (lpa_id, order_position),
    UNIQUE (lpa_id, attorney_id)
);

CREATE INDEX index_lpa_attorney_lpa_id ON united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney(lpa_id);
CREATE INDEX index_lpa_attorney_attorney_id ON united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney(attorney_id);

CREATE TRIGGER trigger_lpa_attorney_updated_at
    BEFORE UPDATE ON united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.set_updated_at();

COMMENT ON TABLE united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney IS
    'Join table linking an LPA to its 1-4 named attorneys, with their order on the form.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.attorney_id IS
    'Foreign key to the attorney.';
COMMENT ON COLUMN united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions.lpa_attorney.order_position IS
    'Order position 1-4 in which this attorney appears on the LP1H form.';
