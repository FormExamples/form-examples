-- One row per hospital KPI reporting period (typically monthly).

CREATE TABLE hospital_dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hospital_name VARCHAR(255) NOT NULL DEFAULT '',
    period_month INTEGER CHECK (period_month IS NULL OR period_month BETWEEN 1 AND 12),
    period_year INTEGER CHECK (period_year IS NULL OR period_year BETWEEN 2000 AND 2100),
    prepared_by_name VARCHAR(255) NOT NULL DEFAULT '',

    overall_notes TEXT NOT NULL DEFAULT '',

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_hospital_dashboard_metrics_updated_at
    BEFORE UPDATE ON hospital_dashboard_metrics
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hospital_dashboard_metrics IS
    'One hospital KPI reporting period: hospital/site, period month/year, prepared-by, and sign-off notes.';
COMMENT ON COLUMN hospital_dashboard_metrics.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_dashboard_metrics.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hospital_dashboard_metrics.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hospital_dashboard_metrics.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hospital_dashboard_metrics.hospital_name IS
    'Name of the hospital or facility being reported on.';
COMMENT ON COLUMN hospital_dashboard_metrics.period_month IS
    'Reporting period month, 1-12.';
COMMENT ON COLUMN hospital_dashboard_metrics.period_year IS
    'Reporting period year.';
COMMENT ON COLUMN hospital_dashboard_metrics.prepared_by_name IS
    'Name of the person who compiled this report.';
COMMENT ON COLUMN hospital_dashboard_metrics.overall_notes IS
    'Free-text overall notes recorded at sign-off.';
COMMENT ON COLUMN hospital_dashboard_metrics.status IS
    'Submission status: draft or submitted.';
COMMENT ON COLUMN hospital_dashboard_metrics.signed_at IS
    'Timestamp the preparer signed off this report.';
