-- One row per recorded metric within a reporting period. 67 metrics are
-- catalogued in ../spec/index.md; metric_code carries the metric's stable
-- dotted identifier from that catalogue (e.g. '1.1', '4.3', '14.6'). A
-- normalised child table is used instead of one wide column per metric,
-- since 67 metrics would need well over 130 flat columns (value + notes).

CREATE TABLE hospital_dashboard_metric_value (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hospital_dashboard_metrics_id UUID NOT NULL REFERENCES hospital_dashboard_metrics(id) ON DELETE CASCADE,
    metric_code VARCHAR(10) NOT NULL,
    category_number INTEGER NOT NULL CHECK (category_number BETWEEN 1 AND 14),
    category_title VARCHAR(255) NOT NULL DEFAULT '',
    metric_text TEXT NOT NULL DEFAULT '',
    metric_value NUMERIC,
    notes TEXT NOT NULL DEFAULT '',

    UNIQUE (hospital_dashboard_metrics_id, metric_code)
);

CREATE TRIGGER trigger_hospital_dashboard_metric_value_updated_at
    BEFORE UPDATE ON hospital_dashboard_metric_value
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hospital_dashboard_metric_value IS
    'One recorded metric (of 67) within a hospital dashboard reporting period.';
COMMENT ON COLUMN hospital_dashboard_metric_value.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_dashboard_metric_value.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hospital_dashboard_metric_value.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hospital_dashboard_metric_value.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hospital_dashboard_metric_value.hospital_dashboard_metrics_id IS
    'Foreign key to the parent reporting period.';
COMMENT ON COLUMN hospital_dashboard_metric_value.metric_code IS
    'Stable dotted metric identifier from spec/index.md, e.g. 1.1, 4.3, 14.6.';
COMMENT ON COLUMN hospital_dashboard_metric_value.category_number IS
    'Top-level category number (1-14) this metric belongs to.';
COMMENT ON COLUMN hospital_dashboard_metric_value.category_title IS
    'Top-level category title, mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_dashboard_metric_value.metric_text IS
    'Full metric name, mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_dashboard_metric_value.metric_value IS
    'Recorded numeric value for this metric; unit is implied by the metric name. NULL if not yet recorded.';
COMMENT ON COLUMN hospital_dashboard_metric_value.notes IS
    'Optional free-text note about this metric value.';

CREATE INDEX hospital_dashboard_metric_value_metrics_id_idx
    ON hospital_dashboard_metric_value (hospital_dashboard_metrics_id);
CREATE INDEX hospital_dashboard_metric_value_category_idx
    ON hospital_dashboard_metric_value (category_number);
