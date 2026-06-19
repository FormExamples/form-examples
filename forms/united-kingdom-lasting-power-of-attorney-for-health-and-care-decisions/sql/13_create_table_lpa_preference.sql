-- Preferences are non-binding guidance the donor offers to their attorneys.
-- LP1H s.7 (Preferences). Attorneys should have regard to preferences but
-- are not legally bound to follow them. 0 to many statements per LPA.

CREATE TABLE lpa_preference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL
        REFERENCES lpa(id) ON DELETE CASCADE,
    order_position INTEGER NOT NULL DEFAULT 1
        CHECK (order_position >= 1),
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'residence',
            'contact-with-others',
            'religion-and-belief',
            'food-and-drink',
            'end-of-life-care',
            'daily-routine',
            'medical-treatment',
            'other',
            ''
        )),
    statement TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_lpa_preference_lpa_id ON lpa_preference(lpa_id);

CREATE TRIGGER trigger_lpa_preference_updated_at
    BEFORE UPDATE ON lpa_preference
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_preference IS
    'Non-binding preference statement guiding the attorneys. LP1H s.7 (preferences).';
COMMENT ON COLUMN lpa_preference.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_preference.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_preference.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_preference.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_preference.lpa_id IS
    'Foreign key to the parent LPA.';
COMMENT ON COLUMN lpa_preference.order_position IS
    'Order in which the preference appears in the LP1H s.7 block.';
COMMENT ON COLUMN lpa_preference.category IS
    'Topical category for the preference; informational only, not statutory.';
COMMENT ON COLUMN lpa_preference.statement IS
    'The preference statement itself.';
