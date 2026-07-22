-- One row per recorded indicator within a reporting period. 50 indicators
-- are catalogued in ../spec/index.md; indicator_code carries the
-- indicator's stable dotted identifier from that catalogue (e.g. '1.1',
-- '2.15', '4.5'). A normalised child table is used instead of one wide
-- column per indicator, since 50 indicators would need over 100 flat
-- columns (value + notes).

CREATE TABLE hospital_performance_indicator_value (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hospital_performance_indicators_id UUID NOT NULL REFERENCES hospital_performance_indicators(id) ON DELETE CASCADE,
    indicator_code VARCHAR(10) NOT NULL,
    category_number INTEGER NOT NULL CHECK (category_number BETWEEN 1 AND 4),
    category_title VARCHAR(255) NOT NULL DEFAULT '',
    indicator_text TEXT NOT NULL DEFAULT '',
    indicator_value NUMERIC,
    notes TEXT NOT NULL DEFAULT '',

    UNIQUE (hospital_performance_indicators_id, indicator_code)
);

CREATE TRIGGER trigger_hospital_performance_indicator_value_updated_at
    BEFORE UPDATE ON hospital_performance_indicator_value
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hospital_performance_indicator_value IS
    'One recorded Balanced Scorecard indicator (of 50) within a hospital performance reporting period.';
COMMENT ON COLUMN hospital_performance_indicator_value.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_performance_indicator_value.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hospital_performance_indicator_value.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hospital_performance_indicator_value.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hospital_performance_indicator_value.hospital_performance_indicators_id IS
    'Foreign key to the parent reporting period.';
COMMENT ON COLUMN hospital_performance_indicator_value.indicator_code IS
    'Stable dotted indicator identifier from spec/index.md, e.g. 1.1, 2.15, 4.5.';
COMMENT ON COLUMN hospital_performance_indicator_value.category_number IS
    'Balanced Scorecard perspective number (1=Finance, 2=Process, 3=Learning and Growth, 4=Customer).';
COMMENT ON COLUMN hospital_performance_indicator_value.category_title IS
    'Balanced Scorecard perspective title, mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_performance_indicator_value.indicator_text IS
    'Full indicator name, mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_performance_indicator_value.indicator_value IS
    'Recorded numeric value for this indicator; unit is implied by the indicator name. NULL if not yet recorded.';
COMMENT ON COLUMN hospital_performance_indicator_value.notes IS
    'Optional free-text note about this indicator value.';

CREATE INDEX hospital_performance_indicator_value_indicators_id_idx
    ON hospital_performance_indicator_value (hospital_performance_indicators_id);
CREATE INDEX hospital_performance_indicator_value_category_idx
    ON hospital_performance_indicator_value (category_number);
